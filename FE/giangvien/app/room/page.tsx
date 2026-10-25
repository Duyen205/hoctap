"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Users,
  X,
  LayoutGrid,
  BookOpen,
  Calendar,
  ChevronRight,
  Maximize2,
  Search,
} from "lucide-react";
import styles from "./room.module.css";
import AccountMenu, { type AccountInfo } from "../account-logo/AccountMenu";
import Layout from "../components/Layout";
import ActiveClassRoom from "./ActiveClassRoom";
import SessionLobby from "./SessionLobby";
import type {
  CaptionLine,
  ChatMessage,
  ClassInfo,
  ClassFilterTab,
  Participant,
  RoomViewState,
} from "./types";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function nowLabel() {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LiveSessionPage() {
  const router = useRouter();

  const [viewState, setViewState] = useState<RoomViewState>("dashboard");
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);

  // Dữ liệu thật từ API
  const [classesList, setClassesList] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState<boolean>(true);

  const [isSessionActive, setIsSessionActive] = useState(false);

  const [teacherName, setTeacherName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const [filterTab, setFilterTab] = useState<ClassFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // 🌐 CẤU HÌNH GỌI API LẤY DỮ LIỆU THẬT TỪ BACKEND
  useEffect(() => {
    async function fetchRealClassesData() {
      setIsLoadingClasses(true);
      let loadedClasses: ClassInfo[] = [];
      try {
        const response = await fetch("/api/classes");
        if (response.ok) {
          loadedClasses = await response.json();
          setClassesList(loadedClasses);
        } else {
          setClassesList([]);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối API lấy danh sách lớp học thật:", error);
        setClassesList([]);
      } finally {
        try {
          const activeState = sessionStorage.getItem("isSessionActive");
          const activeClassId = sessionStorage.getItem("selectedClassId");
          const savedViewState = sessionStorage.getItem(
            "viewState",
          ) as RoomViewState | null;

          if (
            activeState === "true" &&
            activeClassId &&
            loadedClasses.length > 0
          ) {
            setIsSessionActive(true);
            const foundClass = loadedClasses.find(
              (classItem) => classItem.id === activeClassId,
            );
            if (foundClass) {
              setSelectedClass(foundClass);
              if (savedViewState === "room") setViewState("room");
            }
          }

          const rawUser = localStorage.getItem("user");
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            if (parsed.fullName || parsed.name || parsed.username) {
              setTeacherName(
                parsed.fullName ?? parsed.name ?? parsed.username,
              );
            }
            if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
          }
        } catch (error) {
          console.error("Lỗi đọc bộ nhớ local:", error);
        }
        setIsLoadingClasses(false);
      }
    }

    fetchRealClassesData();
  }, []);

  // Lấy danh sách sinh viên tham gia lớp học thật khi vào phòng
  useEffect(() => {
    if (!selectedClass || viewState !== "room") return;

    async function fetchParticipantsRealData() {
      try {
        const res = await fetch(
          `/api/classes/${selectedClass?.id}/participants`,
        );
        if (res.ok) {
          const data = await res.json();
          setParticipants(data);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách sinh viên trong lớp:", err);
      }
    }

    fetchParticipantsRealData();
  }, [selectedClass, viewState]);

  const updateSessionStore = (
    active: boolean,
    classId: string,
    view: RoomViewState,
  ) => {
    setIsSessionActive(active);
    setViewState(view);
    sessionStorage.setItem("isSessionActive", active ? "true" : "false");
    sessionStorage.setItem("selectedClassId", classId);
    sessionStorage.setItem("viewState", view);
  };

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const lobbyVideoRef = useRef<HTMLVideoElement>(null);
  const floatVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  async function ensureLocalStream() {
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (lobbyVideoRef.current) lobbyVideoRef.current.srcObject = stream;
      if (floatVideoRef.current) floatVideoRef.current.srcObject = stream;
      stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
      stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
      return stream;
    } catch (err) {
      console.error("Không truy cập được camera/mic:", err);
      return null;
    }
  }

  const toggleCam = async () => {
    const stream = await ensureLocalStream();
    const next = !camOn;
    setCamOn(next);
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = next));
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (lobbyVideoRef.current) lobbyVideoRef.current.srcObject = stream;
      if (floatVideoRef.current) floatVideoRef.current.srcObject = stream;
    }
  };

  const toggleMic = async () => {
    const stream = await ensureLocalStream();
    const next = !micOn;
    setMicOn(next);
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = next));
    }
  };

  const [isSharing, setIsSharing] = useState(false);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const floatScreenVideoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const toggleShare = async () => {
    if (isSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setIsSharing(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = stream;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = stream;
      if (floatScreenVideoRef.current)
        floatScreenVideoRef.current.srcObject = stream;
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        screenStreamRef.current = null;
        setIsSharing(false);
      });
      setIsSharing(true);
    } catch (err) {
      console.error("Không chia sẻ được màn hình:", err);
    }
  };

  const activeSpeaker = participants.find((p) => p.isSpeaking);

  const [captionsVN] = useState<CaptionLine[]>([]);
  const [captionsEN] = useState<CaptionLine[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [questions, setQuestions] = useState<ChatMessage[]>([]);
  const [questionInput, setQuestionInput] = useState("");

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: teacherName, text, time: nowLabel() },
    ]);
    setChatInput("");
  };

  const handleSendQuestion = (e: FormEvent) => {
    e.preventDefault();
    const text = questionInput.trim();
    if (!text) return;
    setQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: teacherName, text, time: nowLabel() },
    ]);
    setQuestionInput("");
  };

  const handleClassCardAction = (cls: ClassInfo) => {
    setSelectedClass(cls);
    if (isSessionActive && selectedClass?.id === cls.id) {
      updateSessionStore(true, cls.id, "room");
      ensureLocalStream();
    } else {
      setIsLobbyOpen(true);
      ensureLocalStream();
    }
  };

  const handleViewDetails = (cls: ClassInfo) => {
    const params = new URLSearchParams({
      classId: cls.id,
      className: cls.name,
      code: cls.code,
    });
    router.push(`/question?${params.toString()}`);
  };

  const enterRoomFromLobby = () => {
    if (!selectedClass) return;
    setIsLobbyOpen(false);
    updateSessionStore(true, selectedClass.id, "room");
    ensureLocalStream();
  };

  const returnToDashboard = () => {
    if (!selectedClass) return;
    updateSessionStore(true, selectedClass.id, "dashboard");
  };

  const handleEndClass = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    sessionStorage.removeItem("isSessionActive");
    sessionStorage.removeItem("selectedClassId");
    sessionStorage.removeItem("viewState");
    setIsSessionActive(false);
    setViewState("dashboard");
    setShowLeavePopup(false);
  };

  const liveCount = classesList.filter((c) => c.status === "live").length;
  const upcomingCount = classesList.filter(
    (c) => c.status === "upcoming",
  ).length;
  const endedCount = classesList.filter((c) => c.status === "ended").length;

  const filteredClasses = classesList.filter((cls) => {
    const matchesFilter = filterTab === "all" ? true : cls.status === filterTab;
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = searchDate ? cls.date === searchDate : true;

    return matchesFilter && matchesSearch && matchesDate;
  });

  if (viewState === "dashboard") {
    return (
      <Layout
        className={styles.appShell}
        mainClassName={styles.contentBody}
        headerActions={
          <>
            <AccountMenu
              teacherName={teacherName}
              avatarUrl={avatarUrl}
              onSaveAccountInfo={(info: AccountInfo) => {
                if (info.username) setTeacherName(info.username);
                if (info.avatarUrl) setAvatarUrl(info.avatarUrl);
              }}
              onSubmitPasswordChange={() => {
                alert("Đổi mật khẩu thành công!");
              }}
              onLogout={() => {
                localStorage.removeItem("user");
                sessionStorage.clear();
                router.push("/login");
              }}
            />
          </>
        }
      >
            <div className={styles.statsCardsGrid}>
              <div
                className={`${styles.statCard} ${filterTab === "live" ? styles.statCardActive : ""}`}
                onClick={() => setFilterTab("live")}
              >
                <div className={styles.statTagGreen}>
                  <span className={styles.greenDot}></span> Đang diễn ra
                </div>
                <div className={styles.statNumberRow}>
                  <span className={styles.statNumber}>{liveCount}</span>
                  <span className={styles.statUnit}>lớp học</span>
                </div>
              </div>

              <div
                className={`${styles.statCard} ${filterTab === "upcoming" ? styles.statCardActive : ""}`}
                onClick={() => setFilterTab("upcoming")}
              >
                <div className={styles.statTagBlue}>
                  <span className={styles.blueDot}></span> Sắp diễn ra
                </div>
                <div className={styles.statNumberRow}>
                  <span className={styles.statNumber}>{upcomingCount}</span>
                  <span className={styles.statUnit}>lớp học</span>
                </div>
              </div>

              <div
                className={`${styles.statCard} ${filterTab === "ended" ? styles.statCardActive : ""}`}
                onClick={() => setFilterTab("ended")}
              >
                <div className={styles.statTagGray}>
                  <span className={styles.grayDot}></span> Đã kết thúc
                </div>
                <div className={styles.statNumberRow}>
                  <span className={styles.statNumber}>{endedCount}</span>
                  <span className={styles.statUnit}>lớp học</span>
                </div>
              </div>
            </div>

            <div className={styles.searchFilterBar}>
              <div className={styles.searchControlsGroup}>
                <div className={styles.searchInputWrap}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm lớp học..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>

                <div className={styles.datePickerWrap}>
                  <Calendar size={18} className={styles.dateIcon} />
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className={styles.dateInput}
                  />
                  {searchDate && (
                    <button
                      className={styles.clearDateBtn}
                      onClick={() => setSearchDate("")}
                      title="Xóa lọc ngày"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.filterTabsStack}>
                <button
                  className={`${styles.tabBtn} ${filterTab === "all" ? styles.tabBtnActive : ""}`}
                  onClick={() => setFilterTab("all")}
                >
                  Tất cả
                </button>
                <button
                  className={`${styles.tabBtn} ${filterTab === "live" ? styles.tabBtnActive : ""}`}
                  onClick={() => setFilterTab("live")}
                >
                  Đang diễn ra
                </button>
                <button
                  className={`${styles.tabBtn} ${filterTab === "upcoming" ? styles.tabBtnActive : ""}`}
                  onClick={() => setFilterTab("upcoming")}
                >
                  Sắp diễn ra
                </button>
                <button
                  className={`${styles.tabBtn} ${filterTab === "ended" ? styles.tabBtnActive : ""}`}
                  onClick={() => setFilterTab("ended")}
                >
                  Đã kết thúc
                </button>
              </div>
            </div>

            <div className={styles.classCardsStack}>
              {isLoadingClasses ? (
                <div className={styles.emptyClassState}>
                  <p>Đang tải danh sách lớp học từ hệ thống...</p>
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className={styles.emptyClassState}>
                  <BookOpen size={40} color="#94a3b8" />
                  <p>Không tìm thấy lớp học phù hợp.</p>
                </div>
              ) : (
                filteredClasses.map((cls) => {
                  const isThisClassActive =
                    isSessionActive && selectedClass?.id === cls.id;
                  return (
                    <div key={cls.id} className={styles.classCardItem}>
                      <div className={styles.cardLeftBox}>
                        <div className={styles.cardIconBox}>
                          <BookOpen size={24} color="#2563eb" />
                        </div>

                        <div className={styles.cardMainDetails}>
                          <div className={styles.titleBadgeRow}>
                            {cls.status === "live" && (
                              <span
                                className={
                                  isThisClassActive
                                    ? styles.badgeActiveGreen
                                    : styles.badgeLiveRed
                                }
                              >
                                {isThisClassActive
                                  ? "● Đang tham gia"
                                  : "● LIVE"}
                              </span>
                            )}
                            {cls.status === "upcoming" && (
                              <span className={styles.badgeUpcomingBlue}>
                                Sắp diễn ra
                              </span>
                            )}
                            {cls.status === "ended" && (
                              <span className={styles.badgeEndedGray}>
                                Đã kết thúc
                              </span>
                            )}
                            <h3 className={styles.cardClassName}>{cls.name}</h3>
                          </div>

                          <div className={styles.cardMetaRow}>
                            <span>{cls.startTime} · Hôm nay</span>
                            <span>
                              <Users size={14} /> {cls.studentCount} sinh viên
                            </span>
                            {cls.groupsCount && (
                              <span>
                                <LayoutGrid size={14} /> {cls.groupsCount} nhóm
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.cardRightAction}>
                        {cls.status === "live" && (
                          <button
                            className={
                              isThisClassActive
                                ? styles.btnActionGreenActive
                                : styles.btnActionBlue
                            }
                            onClick={() => handleClassCardAction(cls)}
                          >
                            {isThisClassActive
                              ? "Quay lại phòng"
                              : "Vào phòng dạy ngay"}{" "}
                            <ChevronRight size={16} />
                          </button>
                        )}

                        {cls.status === "upcoming" && (
                          <button
                            className={styles.btnActionLightBlue}
                            onClick={() => handleClassCardAction(cls)}
                          >
                            Chuẩn bị <ChevronRight size={16} />
                          </button>
                        )}

                        {cls.status === "ended" && (
                          <button
                            className={styles.btnActionOutline}
                            onClick={() => handleViewDetails(cls)}
                          >
                            Xem chi tiết <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

        {/* FLOATING ZOOM WIDGET */}
        {isSessionActive && selectedClass && (
          <div className={styles.zoomFloatingWindow}>
            <div className={styles.zoomVideoContainer}>
              {isSharing ? (
                <video
                  ref={floatScreenVideoRef}
                  autoPlay
                  playsInline
                  className={styles.zoomVideoTag}
                />
              ) : activeSpeaker ? (
                <div className={styles.speakerAvatarBox}>
                  <div className={styles.bigAvatarCircle}>
                    {getInitials(activeSpeaker.name)}
                  </div>
                </div>
              ) : (
                <video
                  ref={floatVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`${styles.zoomVideoTag} ${camOn ? "" : styles.hidden}`}
                />
              )}

              {!isSharing && !activeSpeaker && !camOn && (
                <div className={styles.zoomAvatarFallback}>
                  {getInitials(teacherName)}
                </div>
              )}

              <div className={styles.zoomSpeakerBadge}>
                {activeSpeaker ? activeSpeaker.name : teacherName}
              </div>

              <div className={styles.zoomOverlayBar}>
                <button
                  type="button"
                  className={styles.zoomBarBtn}
                  onClick={toggleMic}
                  title="Bật/Tắt Mic"
                >
                  {micOn ? (
                    <Mic size={16} />
                  ) : (
                    <MicOff size={16} color="#ef4444" />
                  )}
                </button>
                <button
                  type="button"
                  className={styles.zoomBarBtn}
                  onClick={toggleCam}
                  title="Bật/Tắt Camera"
                >
                  {camOn ? (
                    <Video size={16} />
                  ) : (
                    <VideoOff size={16} color="#ef4444" />
                  )}
                </button>
                <button
                  type="button"
                  className={`${styles.zoomBarBtn} ${isSharing ? styles.sharingActive : ""}`}
                  onClick={toggleShare}
                  title="Chia sẻ màn hình"
                >
                  <ScreenShare size={16} />
                </button>
                <button
                  type="button"
                  className={styles.zoomExpandBtn}
                  onClick={() =>
                    updateSessionStore(true, selectedClass.id, "room")
                  }
                  title="Mở rộng phòng dạy"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {isLobbyOpen && selectedClass && (
          <SessionLobby
            selectedClass={selectedClass}
            videoRef={lobbyVideoRef}
            camOn={camOn}
            micOn={micOn}
            onClose={() => setIsLobbyOpen(false)}
            onToggleCamera={toggleCam}
            onToggleMicrophone={toggleMic}
            onEnter={enterRoomFromLobby}
          />
        )}
      </Layout>
    );
  }

  return (
    <ActiveClassRoom
      selectedClass={selectedClass}
      teacherName={teacherName}
      avatarUrl={avatarUrl}
      participants={participants}
      captionsVN={captionsVN}
      captionsEN={captionsEN}
      micOn={micOn}
      camOn={camOn}
      isSharing={isSharing}
      showParticipants={showParticipants}
      showChat={showChat}
      showQuestion={showQuestion}
      showLeavePopup={showLeavePopup}
      messages={messages}
      chatInput={chatInput}
      questions={questions}
      questionInput={questionInput}
      localVideoRef={localVideoRef}
      screenVideoRef={screenVideoRef}
      onBackToDashboard={returnToDashboard}
      onSaveAccountInfo={(info: AccountInfo) => {
        if (info.username) setTeacherName(info.username);
        if (info.avatarUrl) setAvatarUrl(info.avatarUrl);
      }}
      onPasswordChange={() => alert("Đổi mật khẩu thành công!")}
      onLogout={() => {
        localStorage.removeItem("user");
        sessionStorage.clear();
        router.push("/login");
      }}
      onToggleMic={toggleMic}
      onToggleCamera={toggleCam}
      onToggleShare={toggleShare}
      onTogglePanel={(panel) => {
        setShowParticipants((previous) =>
          panel === "participants" ? !previous : false,
        );
        setShowChat((previous) => (panel === "chat" ? !previous : false));
        setShowQuestion((previous) =>
          panel === "question" ? !previous : false,
        );
      }}
      onClosePanel={(panel) => {
        if (panel === "participants") setShowParticipants(false);
        if (panel === "chat") setShowChat(false);
        if (panel === "question") setShowQuestion(false);
      }}
      onToggleLeavePopup={() => setShowLeavePopup((previous) => !previous)}
      onEndClass={handleEndClass}
      onCancelLeave={() => setShowLeavePopup(false)}
      onChatInputChange={setChatInput}
      onQuestionInputChange={setQuestionInput}
      onSendMessage={handleSendMessage}
      onSendQuestion={handleSendQuestion}
    />
  );
}
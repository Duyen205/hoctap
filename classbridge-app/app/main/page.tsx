"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Home,
  BookOpen,
  MessageSquare,
  FileText,
  BarChart2,
  Settings,
  Search,
  Plus,
  Calendar,
  Video,
  FileEdit,
  Bell,
  CalendarDays,
  Radio,
  ChevronDown,
  ChevronRight,
  X,
  PhoneOff,
  Mic,
  Monitor,
  Users,
} from "lucide-react";
import styles from "./dashboard.module.css";

export default function MainPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<
    "dashboard" | "meeting" | "live"
  >("dashboard");

  // State quản lý dropdown New Meeting
  const [showNewMeetingMenu, setShowNewMeetingMenu] = useState(false);
  const [startWithVideo, setStartWithVideo] = useState(true);
  const [usePMI, setUsePMI] = useState(false);
  const [dynamicId, setDynamicId] = useState("899 763 4622");
  const [showSubMenu, setShowSubMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // State Modal Join Meeting
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const [joinUsername, setJoinUsername] = useState("Duyên");

  useEffect(() => {
    const p1 = Math.floor(100 + Math.random() * 900);
    const p2 = Math.floor(100 + Math.random() * 900);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    setDynamicId(`${p1} ${p2} ${p3}`);
  }, []);

  // Đóng menu khi click ra ngoài vùng chứa
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowNewMeetingMenu(false);
        setShowSubMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <span className={styles.logoText}>
            <GraduationCap size={22} /> ClassBridge
          </span>
        </div>
        <nav className={styles.navMenu}>
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`${styles.navItem} ${currentView === "dashboard" ? styles.active : ""}`}
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          <button className={styles.navItem}>
            <BookOpen size={18} />
            <span>My class</span>
          </button>
          <button className={styles.navItem}>
            <MessageSquare size={18} />
            <span>Question center</span>
          </button>
          <button className={styles.navItem}>
            <FileText size={18} />
            <span>Lesson Summary</span>
          </button>
          <button className={styles.navItem}>
            <BarChart2 size={18} />
            <span>Report</span>
          </button>
          <div className={styles.sidebarDivider}>
            <button className={styles.navItem}>
              <Settings size={18} />
              <span>Setting</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* HEADER */}
        <header className={styles.topbar}>
          <div className={styles.searchSection}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
            </div>
            <button className={styles.plusButton}>
              <Plus size={16} />
            </button>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.roomBtn}>Room</button>
            <div className={styles.iconGroup}>
              <button className={styles.topIconBtn}>
                <Bell size={20} />
                <span className={styles.badge}></span>
              </button>
              <button className={styles.topIconBtn}>
                <CalendarDays size={20} />
              </button>
            </div>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>D</div>
              <span className={styles.userName}>Duyên</span>
            </div>
          </div>
        </header>

        {/* VIEW 1: DASHBOARD */}
        {currentView === "dashboard" && (
          <div className={styles.dashboardView}>
            <div className={styles.dashboardInner}>
              <div className={styles.welcomeBanner}>
                <h1 className={styles.welcomeTitle}>Good morning, Duyên!</h1>
                <p className={styles.welcomeDesc}>
                  Chào mừng bạn quay trở lại với hệ thống quản lý học tập.
                </p>
              </div>

              <div className={styles.cardGrid}>
                {/* 1. NÚT NEW MEETING */}
                <div
                  className={styles.featureCard}
                  style={{ position: "relative", overflow: "visible" }}
                  ref={menuRef}
                >
                  {/* Bấm vào icon camera -> Vào phòng họp */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView("meeting");
                    }}
                    className={styles.zoomOrangeCardIcon}
                    style={{ cursor: "pointer" }}
                  >
                    <Video size={36} fill="currentColor" strokeWidth={0} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.25rem",
                      position: "relative",
                    }}
                  >
                    {/* Bấm vào chữ New meeting -> Vào phòng họp */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView("meeting");
                      }}
                      className={styles.cardLinkText}
                      style={{ cursor: "pointer" }}
                    >
                      New meeting
                    </span>

                    {/* NÚT MŨI TÊN BẬT MENU */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowNewMeetingMenu((prev) => !prev);
                        setShowSubMenu(false);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronDown size={14} color="#8b8fae" />
                    </button>
                  </div>

                  {/* MENU DROPDOWN CHÍNH */}
                  {showNewMeetingMenu && (
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        top: "105%",
                        width: "21rem",
                        backgroundColor: "rgba(19, 19, 20, 0.97)",
                        backdropFilter: "blur(18px)",
                        borderRadius: "0.75rem",
                        boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
                        border: "1px solid rgba(124, 92, 252, 0.18)",
                        padding: "0.5rem 0",
                        zIndex: 99999,
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontFamily: "'Inter', sans-serif",
                        cursor: "default",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.75rem 1.25rem",
                          cursor: "pointer",
                          color: "#CAC3D8",
                          fontWeight: 400,
                        }}
                        onClick={() => setStartWithVideo(!startWithVideo)}
                      >
                        <input
                          type="checkbox"
                          checked={startWithVideo}
                          onChange={() => {}}
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.75rem",
                            accentColor: "#7C5CFC",
                          }}
                        />
                        Start with video
                      </label>

                      <div
                        style={{
                          borderTop: "1px solid rgba(124, 92, 252, 0.14)",
                          margin: "0.25rem 0",
                        }}
                      ></div>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.75rem 1.25rem",
                          cursor: "pointer",
                          color: "#CAC3D8",
                          fontWeight: 400,
                          marginBottom: "0.5rem",
                        }}
                        onClick={() => setUsePMI(!usePMI)}
                      >
                        <input
                          type="checkbox"
                          checked={usePMI}
                          onChange={() => {}}
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.75rem",
                            accentColor: "#7C5CFC",
                          }}
                        />
                        Use my personal meeting ID (PMI)
                      </label>

                      <div style={{ position: "relative", width: "100%" }}>
                        <div
                          style={{
                            padding: "0.85rem 1.25rem",
                            background:
                              "linear-gradient(135deg, #7C5CFC 0%, #4CD6FB 100%)",
                            color: "white",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            borderBottomLeftRadius: "0.75rem",
                            borderBottomRightRadius: "0.75rem",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSubMenu(!showSubMenu);
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.95rem",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {dynamicId}
                          </span>
                          <ChevronRight size={16} color="white" />
                        </div>

                        {/* SUB-MENU BÊN PHẢI */}
                        {showSubMenu && (
                          <div
                            style={{
                              position: "absolute",
                              left: "100%",
                              top: "-2rem",
                              marginLeft: "0.5rem",
                              width: "15rem",
                              backgroundColor: "rgba(19, 19, 20, 0.97)",
                              backdropFilter: "blur(18px)",
                              borderRadius: "0.75rem",
                              boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
                              border: "1px solid rgba(124, 92, 252, 0.18)",
                              padding: "0.5rem 0",
                              zIndex: 100000,
                              color: "#CAC3D8",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => alert("Copied meeting link!")}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "0.6rem 1.25rem",
                                background:
                                  "linear-gradient(135deg, #7C5CFC 0%, #4CD6FB 100%)",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                color: "white",
                              }}
                            >
                              Copy meeting link
                            </button>
                            <button
                              onClick={() => alert("Copied ID!")}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "0.6rem 1.25rem",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                color: "#CAC3D8",
                              }}
                            >
                              Copy ID
                            </button>
                            <button
                              onClick={() => alert("Copied invitation!")}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "0.6rem 1rem",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                color: "#CAC3D8",
                              }}
                            >
                              Copy invitation
                            </button>
                            <div
                              style={{
                                borderTop: "1px solid rgba(124, 92, 252, 0.14)",
                                margin: "0.25rem 0",
                              }}
                            ></div>
                            <button
                              onClick={() => alert("PMI settings")}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "0.6rem 1rem",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                color: "#CAC3D8",
                              }}
                            >
                              PMI settings
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. JOIN */}
                <button
                  onClick={() => setShowJoinModal(true)}
                  className={styles.featureCard}
                >
                  <div className={styles.zoomBlueCardIcon}>
                    <Plus size={36} strokeWidth={2.5} />
                  </div>
                  <span className={styles.cardMainTitle}>Join</span>
                </button>

                {/* 3. SCHEDULE */}
                <button className={styles.featureCard}>
                  <div className={styles.zoomPurpleCardIcon}>
                    <Calendar size={32} />
                  </div>
                  <span className={styles.cardMainTitle}>Schedule</span>
                </button>

                {/* 4. MY NOTE */}
                <button className={styles.featureCard}>
                  <div className={styles.zoomOrangeCardIcon}>
                    <FileEdit size={32} />
                  </div>
                  <span className={styles.cardMainTitle}>My note</span>
                </button>

                {/* 5. LIVE LESSON */}
                <div className={styles.liveCardWrapper}>
                  <button
                    onClick={() => setCurrentView("live")}
                    className={styles.featureCard}
                  >
                    <div
                      className={`${styles.cardIconBox} ${styles.redIcon} ${styles.relativeBox}`}
                    >
                      <Radio size={28} />
                      <span className={styles.liveBadgePulse}>
                        <i className={styles.redDot}></i> LIVE
                      </span>
                    </div>
                    <span
                      className={`${styles.cardMainTitle} ${styles.redTextHover}`}
                    >
                      Live Lesson
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MEETING ROOM */}
        {currentView === "meeting" && (
          <div className={styles.meetingRoomView}>
            <header className={styles.meetingHeader}>
              <span className={styles.logoText}>
                <GraduationCap size={20} /> ClassBridge
              </span>
              <div className={styles.roomTag}>CMU-CS 403 CIS Capstone</div>
              <div className={styles.meetingHeaderRight}>
                <button className={styles.topIconBtn}>
                  <Bell size={18} />
                </button>
                <div className={styles.avatarSmall}>D</div>
              </div>
            </header>

            <div className={styles.meetingBody}>
              <div className={styles.camsRow}>
                <div className={styles.camBox}>
                  <span>cam 1</span>
                </div>
                <div className={styles.camBox}>
                  <span>cam 2</span>
                </div>
                <div className={styles.camBox}>
                  <span>cam 3</span>
                </div>
                <div className={styles.camBox}>
                  <span>cam 4</span>
                </div>
              </div>
              <div className={styles.workspaceRow}>
                <div className={styles.screenMain}>
                  <span>Screen</span>
                </div>
                <div className={styles.transcribeWrapper}>
                  <div className={styles.transcriptBox}>
                    <div className={styles.transcriptHeader}>Eng</div>
                    <div className={styles.transcriptContent}>
                      English transcription stream...
                    </div>
                  </div>
                  <div className={styles.transcriptBox}>
                    <div
                      className={`${styles.transcriptHeader} ${styles.vnHeader}`}
                    >
                      VN
                    </div>
                    <div className={styles.transcriptContent}>
                      Bản dịch tiếng Việt...
                    </div>
                  </div>
                </div>
                <div className={styles.chatBoxWrapper}>
                  <div className={styles.chatHeader}>Mes</div>
                  <div className={styles.chatContent}>
                    <div className={styles.chatBubbleIncoming}>
                      Xin chào thầy cô và các bạn!
                    </div>
                    <div className={styles.chatBubbleOutgoing}>Chào bạn.</div>
                  </div>
                  <div className={styles.chatFooter}>
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      className={styles.chatInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            <footer className={styles.meetingFooter}>
              <button className={styles.controlBtn}>
                <Mic size={16} /> Mic
              </button>
              <button className={styles.controlBtn}>
                <Video size={16} /> Bật/tắt cam
              </button>
              <button className={styles.controlBtn}>
                <Monitor size={16} /> Share
              </button>
              <button className={styles.controlBtn}>
                <Users size={16} /> participants
              </button>
              <div className={styles.footerDivider}></div>
              <button
                onClick={() => setCurrentView("dashboard")}
                className={styles.leaveBtn}
              >
                <PhoneOff size={16} /> Leave
              </button>
            </footer>
          </div>
        )}

        {/* VIEW 3: LIVE LESSON */}
        {currentView === "live" && (
          <div className={styles.liveLessonView}>
            <div className={styles.liveGrid}>
              <div className={styles.liveColumn}>
                <div className={styles.liveColHeader}>
                  <span className={styles.liveColTitle}>Tiếng Việt</span>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.liveColBody}>
                  <p className={styles.livePlaceholder}>
                    Đang chờ tín hiệu âm thanh...
                  </p>
                </div>
              </div>
              <div className={styles.liveColumn}>
                <div className={styles.liveColHeader}>
                  <span className={styles.liveColTitle}>English</span>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.liveColBody}>
                  <p className={styles.livePlaceholder}>
                    Waiting for audio stream...
                  </p>
                </div>
              </div>
            </div>
            <footer className={styles.meetingFooter}>
              <button className={styles.controlBtn}>
                <Mic size={16} /> Mic
              </button>
              <button
                onClick={() => setCurrentView("dashboard")}
                className={styles.leaveBtn}
              >
                <PhoneOff size={16} /> Leave
              </button>
            </footer>
          </div>
        )}

        {/* MODAL JOIN */}
        {showJoinModal && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalCard}>
              <div className={styles.modalHeader}>
                <h3>Join Meeting</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className={styles.modalCloseBtn}
                >
                  <X size={18} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <label className={styles.inputLabel}>
                  Meeting ID or personal link name
                </label>
                <div className={styles.inputWrapperRelative}>
                  <input
                    type="text"
                    value={joinMeetingId}
                    onChange={(e) => setJoinMeetingId(e.target.value)}
                    placeholder="Meeting ID"
                    className={styles.modalInput}
                  />
                </div>
                <label className={styles.inputLabel}>Your Name</label>
                <input
                  type="text"
                  value={joinUsername}
                  onChange={(e) => setJoinUsername(e.target.value)}
                  className={styles.modalInput}
                />
              </div>
              <div className={styles.modalFooter}>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className={styles.cancelModalBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setCurrentView("meeting");
                  }}
                  className={styles.submitModalBtn}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import type { FormEvent, RefObject } from "react";
import {
  CircleHelp,
  Home,
  Languages,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  Send,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import AccountMenu from "../account-logo/AccountMenu";
import type { AccountInfo } from "../account-logo/types";
import NotificationMenu from "../components/NotificationMenu";
import styles from "./room.module.css";
import type {
  CaptionLine,
  ChatMessage,
  ClassInfo,
  Participant,
} from "./types";

type ActiveClassRoomProps = {
  selectedClass: ClassInfo | null;
  teacherName: string;
  avatarUrl?: string;
  participants: Participant[];
  captionsVN: CaptionLine[];
  captionsEN: CaptionLine[];
  micOn: boolean;
  camOn: boolean;
  isSharing: boolean;
  showParticipants: boolean;
  showChat: boolean;
  showQuestion: boolean;
  showLeavePopup: boolean;
  messages: ChatMessage[];
  chatInput: string;
  questions: ChatMessage[];
  questionInput: string;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  screenVideoRef: RefObject<HTMLVideoElement | null>;
  onBackToDashboard: () => void;
  onSaveAccountInfo: (info: AccountInfo) => void;
  onPasswordChange: (oldPassword: string, newPassword: string) => void;
  onLogout: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleShare: () => void;
  onTogglePanel: (panel: "participants" | "chat" | "question") => void;
  onClosePanel: (panel: "participants" | "chat" | "question") => void;
  onToggleLeavePopup: () => void;
  onEndClass: () => void;
  onCancelLeave: () => void;
  onChatInputChange: (value: string) => void;
  onQuestionInputChange: (value: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  onSendQuestion: (event: FormEvent<HTMLFormElement>) => void;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default function ActiveClassRoom({
  selectedClass,
  teacherName,
  avatarUrl,
  participants,
  captionsVN,
  captionsEN,
  micOn,
  camOn,
  isSharing,
  showParticipants,
  showChat,
  showQuestion,
  showLeavePopup,
  messages,
  chatInput,
  questions,
  questionInput,
  localVideoRef,
  screenVideoRef,
  onBackToDashboard,
  onSaveAccountInfo,
  onPasswordChange,
  onLogout,
  onToggleMic,
  onToggleCamera,
  onToggleShare,
  onTogglePanel,
  onClosePanel,
  onToggleLeavePopup,
  onEndClass,
  onCancelLeave,
  onChatInputChange,
  onQuestionInputChange,
  onSendMessage,
  onSendQuestion,
}: ActiveClassRoomProps) {
  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <img src="/Ai.png" alt="ClassBridge AI" className={styles.logo} />
          <span className={styles.brandName}>
            ClassBridge <span className={styles.brandAccent}>AI</span>
          </span>
        </div>

        <div className={styles.classInfo}>
          <span className={styles.className}>{selectedClass?.name}</span>
          <span className={styles.classCode}>
            Mã lớp: {selectedClass?.code}
          </span>
        </div>

        <button
          className={styles.btnBackToDashboard}
          onClick={onBackToDashboard}
        >
          <Home size={16} /> Trang chủ Sảnh
        </button>

        <NotificationMenu />
        <AccountMenu
          teacherName={teacherName}
          avatarUrl={avatarUrl}
          onSaveAccountInfo={onSaveAccountInfo}
          onSubmitPasswordChange={onPasswordChange}
          onLogout={onLogout}
        />
      </header>

      <div className={styles.cameraBar}>
        <div className={styles.miniTile}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`${styles.miniVideo} ${camOn ? "" : styles.hidden}`}
          />
          {!camOn && (
            <div className={styles.miniAvatarFallback}>
              {getInitials(teacherName)}
            </div>
          )}
          <span className={styles.miniName}>{teacherName} (Bạn)</span>
          {!micOn && <MicOff size={11} className={styles.miniMuteIcon} />}
        </div>
        {participants.map((participant) => (
          <div key={participant.id} className={styles.miniTile}>
            <div className={styles.miniAvatarFallback}>
              {getInitials(participant.name)}
            </div>
            <span className={styles.miniName}>{participant.name}</span>
            {!participant.micOn && (
              <MicOff size={11} className={styles.miniMuteIcon} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.mainArea}>
        <div className={styles.stage}>
          {isSharing ? (
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className={styles.stageVideo}
            />
          ) : (
            <div className={styles.stagePlaceholder}>
              <ScreenShare size={40} />
              <p>Chưa có ai chia sẻ màn hình</p>
            </div>
          )}
        </div>

        <aside className={styles.captionPanel}>
          <div className={styles.captionBox}>
            <div className={styles.captionHeader}>
              <Languages size={14} /> English
            </div>
            <div className={styles.captionBody}>
              {captionsVN.length === 0 ? (
                <p className={styles.captionEmpty}>Chưa có phụ đề...</p>
              ) : (
                captionsVN.map((caption) => (
                  <p key={caption.id} className={styles.captionLine}>
                    {caption.text}
                  </p>
                ))
              )}
            </div>
          </div>
          <div className={styles.captionBox}>
            <div className={styles.captionHeader}>
              <Languages size={14} /> VietNamese
            </div>
            <div className={styles.captionBody}>
              {captionsEN.length === 0 ? (
                <p className={styles.captionEmpty}>No captions yet...</p>
              ) : (
                captionsEN.map((caption) => (
                  <p key={caption.id} className={styles.captionLine}>
                    {caption.text}
                  </p>
                ))
              )}
            </div>
          </div>
        </aside>

        {showParticipants && (
          <aside className={styles.sidePanel}>
            <div className={styles.sidePanelHeader}>
              <h3>Người tham gia ({participants.length + 1})</h3>
              <button
                type="button"
                onClick={() => onClosePanel("participants")}
              >
                <X size={16} />
              </button>
            </div>
            <ul className={styles.participantList}>
              <li className={styles.participantItem}>
                <div className={styles.avatarCircle}>{getInitials(teacherName)}</div>
                <span>{teacherName} (Bạn)</span>
                <div className={styles.participantIcons}>
                  {micOn ? <Mic size={14} /> : <MicOff size={14} />}
                  {camOn ? <Video size={14} /> : <VideoOff size={14} />}
                </div>
              </li>
              {participants.map((participant) => (
                <li key={participant.id} className={styles.participantItem}>
                  <div className={styles.avatarCircle}>
                    {getInitials(participant.name)}
                  </div>
                  <span>{participant.name}</span>
                  <div className={styles.participantIcons}>
                    {participant.micOn ? <Mic size={14} /> : <MicOff size={14} />}
                    {participant.camOn ? (
                      <Video size={14} />
                    ) : (
                      <VideoOff size={14} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {showChat && (
          <ChatPanel
            title="Trò chuyện"
            messages={messages}
            input={chatInput}
            emptyText="Chưa có tin nhắn nào."
            placeholder="Nhập tin nhắn..."
            ariaLabel="Gửi"
            onClose={() => onClosePanel("chat")}
            onChange={onChatInputChange}
            onSubmit={onSendMessage}
          />
        )}
        {showQuestion && (
          <ChatPanel
            title="Câu hỏi"
            messages={questions}
            input={questionInput}
            emptyText="Chưa có câu hỏi nào."
            placeholder="Nhập câu hỏi..."
            ariaLabel="Gửi câu hỏi"
            onClose={() => onClosePanel("question")}
            onChange={onQuestionInputChange}
            onSubmit={onSendQuestion}
          />
        )}
      </div>

      <footer className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.toolBtn} ${!micOn ? styles.toolBtnOff : ""}`}
          onClick={onToggleMic}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          <span>Mic</span>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${!camOn ? styles.toolBtnOff : ""}`}
          onClick={onToggleCamera}
        >
          {camOn ? <Video size={20} /> : <VideoOff size={20} />}
          <span>{camOn ? "Tắt cam" : "Bật cam"}</span>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${isSharing ? styles.toolBtnActive : ""}`}
          onClick={onToggleShare}
        >
          <ScreenShare size={20} />
          <span>{isSharing ? "Dừng share" : "Share"}</span>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${showParticipants ? styles.toolBtnActive : ""}`}
          onClick={() => onTogglePanel("participants")}
        >
          <Users size={20} />
          <span>Participants</span>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${showChat ? styles.toolBtnActive : ""}`}
          onClick={() => onTogglePanel("chat")}
        >
          <MessageSquare size={20} />
          <span>Message</span>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${showQuestion ? styles.toolBtnActive : ""}`}
          onClick={() => onTogglePanel("question")}
        >
          <CircleHelp size={20} />
          <span>Câu hỏi</span>
        </button>
        <div className={styles.leaveWrapper}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={onToggleLeavePopup}
          >
            <PhoneOff size={20} />
            <span>Leave</span>
          </button>
          {showLeavePopup && (
            <div className={styles.leaveMenu}>
              <button
                type="button"
                className={styles.leaveMeetingBtn}
                onClick={onEndClass}
              >
                Leave meeting
              </button>
              <button
                type="button"
                className={styles.cancelLeaveBtn}
                onClick={onCancelLeave}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

function ChatPanel({
  title,
  messages,
  input,
  emptyText,
  placeholder,
  ariaLabel,
  onClose,
  onChange,
  onSubmit,
}: {
  title: string;
  messages: ChatMessage[];
  input: string;
  emptyText: string;
  placeholder: string;
  ariaLabel: string;
  onClose: () => void;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <aside className={styles.sidePanel}>
      <div className={styles.sidePanelHeader}>
        <h3>{title}</h3>
        <button type="button" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
          <p className={styles.captionEmpty}>{emptyText}</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={styles.chatMessage}>
              <span className={styles.chatSender}>
                {message.sender} · {message.time}
              </span>
              <p className={styles.chatText}>{message.text}</p>
            </div>
          ))
        )}
      </div>
      <form className={styles.chatInputRow} onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={styles.chatInput}
        />
        <button
          type="submit"
          className={styles.chatSendBtn}
          aria-label={ariaLabel}
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
}

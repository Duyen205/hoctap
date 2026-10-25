"use client";

import { ArrowLeft, CalendarClock, Clock3, DoorOpen, Users } from "lucide-react";
import styles from "./waiting-lobby.module.css";

export type WaitingLobbyClassInfo = {
  code: string;
  className: string;
  displayName: string;
  scheduledTime: string;
};

type WaitingLobbyProps = {
  classInfo: WaitingLobbyClassInfo;
  onLeave: () => void;
};

export default function WaitingLobby({
  classInfo,
  onLeave,
}: WaitingLobbyProps) {
  return (
    <section className={styles.page}>
      <button type="button" className={styles.backButton} onClick={onLeave}>
        <ArrowLeft size={17} />
        Về trang chủ
      </button>

      <div className={styles.lobbyCard} aria-labelledby="lobby-title">
        <div className={styles.waitingIllustration} aria-hidden="true">
          <span className={`${styles.orbit} ${styles.orbitOne}`} />
          <span className={`${styles.orbit} ${styles.orbitTwo}`} />
          <span className={styles.clockIcon}>
            <Clock3 size={34} strokeWidth={1.7} />
          </span>
          <span className={styles.waitingIndicator} />
        </div>

        <span className={styles.statusPill}>
          <span className={styles.statusDot} />
          ĐANG CHỜ GIẢNG VIÊN
        </span>
        <h1 id="lobby-title" className={styles.title}>
          Phòng chờ lớp học
        </h1>
        <p className={styles.description}>
          Lớp học chưa bắt đầu. Vui lòng đợi giảng viên mở phòng học.
        </p>

        <div className={styles.classSummary}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryIcon}>
              <Users size={18} />
            </span>
            <span>THÔNG TIN LỚP HỌC</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tên lớp</span>
            <strong>{classInfo.className}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Mã lớp</span>
            <strong>{classInfo.code}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Thời gian dự kiến</span>
            <strong className={styles.expectedTime}>
              <CalendarClock size={15} />
              {classInfo.scheduledTime}
            </strong>
          </div>
          <div className={styles.waitingFor}>
            <span className={styles.avatar}>
              {classInfo.displayName.trim().charAt(0).toUpperCase() || "S"}
            </span>
            <span>
              Đang chờ với tên <strong>{classInfo.displayName}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          className={styles.leaveButton}
          onClick={onLeave}
        >
          <DoorOpen size={17} />
          Rời phòng chờ
        </button>
        <p className={styles.footerNote}>
          Bạn có thể rời phòng chờ và quay lại bất cứ lúc nào.
        </p>
      </div>
    </section>
  );
}

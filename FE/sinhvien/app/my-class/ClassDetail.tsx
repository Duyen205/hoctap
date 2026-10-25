"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  Play,
  Radio,
} from "lucide-react";
import type { ClassDetailData } from "./types";
import styles from "./class-id/class-id.module.css";

type ClassDetailProps = {
  classDetail: ClassDetailData | null;
  onBack: () => void;
  onJoinSession: (code: string) => void;
  onOpenSummary: (classId: string, sessionId: string) => void;
};

export default function ClassDetail({
  classDetail,
  onBack,
  onJoinSession,
  onOpenSummary,
}: ClassDetailProps) {
  if (!classDetail) return <p>Đang tải chi tiết lớp học...</p>;

  return (
    <div className={styles.detailContainer}>
      <button className={styles.backLink} onClick={onBack}>
        <ArrowLeft size={16} /> Lớp học của tôi
      </button>
      <header className={styles.detailHeader}>
        <div className={styles.detailHeaderMain}>
          <div className={styles.detailAvatar}>
            {classDetail.instructorInitials}
          </div>
          <div className={styles.detailTitleBlock}>
            <span className={styles.detailEyebrow}>KHÔNG GIAN LỚP HỌC</span>
            <h1 className={styles.detailTitle}>{classDetail.title}</h1>
            <p className={styles.detailSubtitle}>
              Mã lớp <strong>{classDetail.code}</strong>
              <span className={styles.subtitleDivider} />
              Giảng viên <strong>{classDetail.instructorName}</strong>
            </p>
          </div>
        </div>
        <div className={styles.scheduleCard}>
          <span className={styles.scheduleCardIcon}>
            <CalendarDays size={18} />
          </span>
          <span className={styles.scheduleCardText}>
            <span className={styles.scheduleCardLabel}>Lịch học cố định</span>
            <strong>{classDetail.schedule}</strong>
          </span>
          <Clock3 className={styles.scheduleCardClock} size={17} />
        </div>
      </header>

      {classDetail.currentSessionTitle ? (
        <section className={styles.currentSessionCard}>
          <div className={styles.sessionVisual} aria-hidden="true">
            <Radio size={28} />
          </div>
          <div className={styles.sessionDetails}>
            <div className={styles.sessionBadgeRow}>
              <span className={styles.currentSessionText}>BUỔI HỌC ĐANG DIỄN RA</span>
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} />
                Live
              </span>
            </div>
            <h2 className={styles.currentSessionTitle}>
              {classDetail.currentSessionTitle}
            </h2>
            <p className={styles.sessionDescription}>
              Buổi học đang diễn ra. Tham gia phòng học để theo dõi nội dung trực
              tiếp.
            </p>
          </div>
          <button
            className={styles.joinSessionBtn}
            type="button"
            onClick={() => onJoinSession(classDetail.code)}
          >
            <Play fill="currentColor" size={17} />
            Tham gia Room
          </button>
        </section>
      ) : (
        <section className={styles.noLiveSession}>
          <span className={styles.noLiveIcon}>
            <Radio size={21} />
          </span>
          <div>
            <h2>Hiện không có buổi học trực tiếp</h2>
            <p>Buổi học tiếp theo sẽ xuất hiện tại đây khi bắt đầu.</p>
          </div>
        </section>
      )}

      <div className={styles.previousSection}>
        <div className={styles.historyHeading}>
          <div>
            <span className={styles.detailEyebrow}>ÔN TẬP &amp; TÀI LIỆU</span>
            <h3 className={styles.previousTitle}>Lịch sử lớp học</h3>
          </div>
          <span className={styles.historyCount}>
            {classDetail.previousSessions.length} buổi học
          </span>
        </div>
        <div className={styles.previousList}>
          {classDetail.previousSessions.length ? (
            classDetail.previousSessions.map((session) => (
              <button
                key={session.id}
                type="button"
                className={styles.previousItem}
                onClick={() => onOpenSummary(classDetail.id, session.id)}
              >
                <span className={styles.historyDate}>
                  <span className={styles.weekBadge}>{session.week}</span>
                  <span className={styles.sessionDate}>{session.date}</span>
                </span>
                <span className={styles.previousItemTitle}>
                  <span className={styles.historyPlayIcon}>
                    <Play size={13} fill="currentColor" />
                  </span>
                  {session.title}
                </span>
                <span className={styles.summaryAction}>
                  Xem tóm tắt
                  <ChevronRight size={17} className={styles.chevronIcon} />
                </span>
              </button>
            ))
          ) : (
            <p className={styles.historyEmpty}>
              Chưa có buổi học nào được lưu trữ.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

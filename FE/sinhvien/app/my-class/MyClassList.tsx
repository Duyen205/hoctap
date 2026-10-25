"use client";

import { ArrowRight, BookOpen, CalendarDays, Clock3, Users } from "lucide-react";
import type { ClassData } from "./types";
import styles from "./my-class.module.css";

type MyClassListProps = {
  classes: ClassData[];
  isLoading: boolean;
  onEnterClass: (classId: string) => void;
};

export default function MyClassList({
  classes,
  isLoading,
  onEnterClass,
}: MyClassListProps) {
  return (
    <section className={styles.listPage}>
      <header className={styles.headerArea}>  
        <h1 className={styles.pageTitle}>Lớp học của tôi</h1>
        <p className={styles.pageDescription}>
          Theo dõi lịch học và tiếp tục hành trình học tập của bạn.
        </p>
      </header>

      {isLoading ? (
        <div className={styles.loadingState} role="status">
          <span className={styles.loadingSpinner} aria-hidden="true" />
          Đang tải danh sách lớp học...
        </div>
      ) : classes.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <BookOpen size={28} strokeWidth={1.7} />
          </span>
          <p>Bạn chưa tham gia lớp học nào.</p>
          <span>Các lớp học bạn tham gia sẽ được hiển thị tại đây.</span>
        </div>
      ) : (
        <>
          <div className={styles.listSummary}>
            <span className={styles.classCount}>
              <Users size={16} />
              {classes.length} lớp học
            </span>
          </div>

          <div className={styles.classList}>
            {classes.map((cls) => (
              <article key={cls.id} className={styles.classCard}>
                <div className={styles.cardTop}>
                  <div className={styles.classIdentity}>
                    <span className={styles.classIcon}>
                      <BookOpen size={19} />
                    </span>
                    <div className={styles.classHeading}>
                      <h2 className={styles.className}>{cls.title}</h2>
                      <span className={styles.classCode}>
                        Mã lớp <strong>{cls.code}</strong>
                      </span>
                    </div>
                  </div>
                  {cls.isLive && (
                    <span className={styles.liveBadge}>
                      <span className={styles.liveDot} />
                      Live
                    </span>
                  )}
                </div>

                <div className={styles.instructorRow}>
                  <span className={styles.instructorAvatar}>
                    {cls.instructorInitials}
                  </span>
                  <div className={styles.instructorDetails}>
                    <span className={styles.metaLabel}>Giảng viên</span>
                    <span className={styles.instructorName}>
                      {cls.instructorName}
                    </span>
                  </div>
                </div>

                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleIcon}>
                    <CalendarDays size={16} />
                  </span>
                  <div className={styles.scheduleDetails}>
                    <span className={styles.metaLabel}>Lịch học cố định</span>
                    <span className={styles.scheduleText}>{cls.schedule}</span>
                  </div>
                  <Clock3 className={styles.scheduleClock} size={16} />
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.lastSession}>
                    Buổi gần nhất: <strong>{cls.lastSession}</strong>
                  </span>
                  <button
                    className={styles.enterBtn}
                    type="button"
                    onClick={() => onEnterClass(cls.id)}
                  >
                    Xem chi tiết
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

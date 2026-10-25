"use client";

import { CameraIcon, Hash } from "lucide-react";
import type { ClassItem, ClassTab } from "./types";
import styles from "./home.module.css";

type HomeDashboardProps = {
  activeTab: ClassTab;
  classes: ClassItem[];
  onTabChange: (tab: ClassTab) => void;
  onJoinScreenChange: (screen: "scanQr" | "enterCode") => void;
};

export default function HomeDashboard({
  activeTab,
  classes,
  onTabChange,
  onJoinScreenChange,
}: HomeDashboardProps) {
  const ongoingClasses = classes.filter((item) => item.status === "ongoing");
  const upcomingClasses = classes.filter((item) => item.status === "upcoming");
  const visibleClasses =
    activeTab === "ongoing" ? ongoingClasses : upcomingClasses;

  return (
    <>
      <h1 className={styles.greetingTitle}>Xin chào, !</h1>
      <p className={styles.greetingSubtitle}>
        Tham gia lớp học để bắt đầu hành trình học tập cùng ClassBridge.
      </p>

      <h2 className={styles.sectionTitle}>Tham gia lớp học</h2>
      <div className={styles.joinGrid}>
        <button
          className={styles.joinCardPrimary}
          onClick={() => onJoinScreenChange("scanQr")}
        >
          <span className={styles.joinIconWrap}>
            <CameraIcon />
          </span>
          <div className={styles.joinTitle}>Quét mã QR</div>
          <div className={styles.joinSubtitle}>Dùng camera để quét mã lớp</div>
        </button>

        <button
          className={styles.joinCard}
          onClick={() => onJoinScreenChange("enterCode")}
        >
          <span className={styles.joinIconWrap}>
            <Hash />
          </span>
          <div className={styles.joinTitle}>Nhập mã lớp</div>
          <div className={styles.joinSubtitle}>
            Nhập mã lớp do giảng viên cung cấp
          </div>
        </button>
      </div>

      <div className={styles.classBox}>
        <div className={styles.classBoxHeader}>
          <h2 className={styles.sectionTitle}>Các lớp học của tôi</h2>
          <a href="#" className={styles.viewAll}>
            Xem tất cả
          </a>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "ongoing" ? styles.tabActive : ""}`}
            onClick={() => onTabChange("ongoing")}
          >
            Đang diễn ra ({ongoingClasses.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : ""}`}
            onClick={() => onTabChange("upcoming")}
          >
            Sắp tới ({upcomingClasses.length})
          </button>
        </div>

        {visibleClasses.length === 0 && (
          <p className={styles.emptyText}>Chưa có dữ liệu lớp học.</p>
        )}

        {visibleClasses.map((item) => (
          <div key={item.id} className={styles.classCard}>
            <span className={styles.classIcon}>📘</span>
            <div className={styles.classInfo}>
              <div className={styles.classTitle}>
                {item.code} - {item.name}
              </div>
              <div className={styles.classInstructor}>{item.instructor}</div>
              <div className={styles.classMeta}>
                {item.time} · {item.date}
              </div>
            </div>
            <span
              className={
                item.status === "ongoing"
                  ? styles.statusOngoing
                  : styles.statusUpcoming
              }
            >
              {item.status === "ongoing" ? "Đang diễn ra" : "Sắp diễn ra"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import {
  BookOpen,
  CloudUpload,
  ChevronRight,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import styles from "./home.module.css";
import type { HomeClassItem } from "./types";

type HomeMainPageProps = {
  classes: HomeClassItem[];
  onUploadSlide: (classId: string) => void;
  onAddStudent: (classId: string) => void;
  onEditClass: (classItem: HomeClassItem) => void;
  onDeleteClass: (classId: string) => void;
};

export default function HomeMainPage({
  classes,
  onUploadSlide,
  onAddStudent,
  onEditClass,
  onDeleteClass,
}: HomeMainPageProps) {
  return (
    <section className={styles.classBox}>
      <div className={styles.classBoxHeader}>
        <h2 className={styles.sectionTitle}>Lớp học của tôi</h2>
        <Link href="/classmanagement" className={styles.viewAll}>
          Xem tất cả &gt;
        </Link>
      </div>

      {classes.length === 0 && (
        <p className={styles.emptyText}>Chưa có dữ liệu lớp học.</p>
      )}

      {classes.map((classItem) => (
        <div key={classItem.id} className={styles.classCard}>
          <div className={styles.classCardTop}>
            <span className={styles.classIcon}>
              <BookOpen size={18} />
            </span>
            <div className={styles.classInfo}>
              <div className={styles.classTitle}>
                {classItem.code} - {classItem.name}
              </div>
              <div className={styles.classMeta}>
                {classItem.date} · {classItem.time}
              </div>
            </div>
            <span
              className={
                classItem.status === "ongoing"
                  ? styles.statusOngoing
                  : styles.statusUpcoming
              }
            >
              {classItem.status === "ongoing" ? "Đang diễn ra" : "Sắp diễn ra"}
            </span>
          </div>

          <div className={styles.classStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{classItem.studentCount}</div>
              <div className={styles.statLabel}>Sinh viên</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{classItem.groupCount}</div>
              <div className={styles.statLabel}>Nhóm câu hỏi</div>
            </div>
          </div>

          <div className={styles.classCardFooter}>
            <button
              type="button"
              className={styles.uploadSlideBtn}
              onClick={() => onUploadSlide(classItem.id)}
              title={
                classItem.slideFileName
                  ? `Đã chọn: ${classItem.slideFileName}`
                  : "Tải lên slide"
              }
            >
              <CloudUpload size={15} />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {classItem.slideFileName ?? "Tải lên slide"}
              </span>
              <ChevronRight size={14} className={styles.uploadChevron} />
            </button>

            <div className={styles.classActions}>
              <button
                type="button"
                className={styles.actionBtn}
                title="Thêm sinh viên"
                onClick={() => onAddStudent(classItem.id)}
              >
                <UserPlus size={15} />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                title="Sửa lớp"
                onClick={() => onEditClass(classItem)}
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                title="Xóa lớp"
                onClick={() => onDeleteClass(classItem.id)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

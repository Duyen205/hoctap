"use client";

import {
  Calendar,
  ChevronRight,
  Clock,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import type { ClassSummaryItem, LectureItem } from "./types";
import styles from "./summary.module.css";

const CARD_COLOR_CLASS: Record<ClassSummaryItem["color"], string> = {
  blue: styles.iconBlue,
  green: styles.iconGreen,
  purple: styles.iconPurple,
};

type SummaryLectureListProps = {
  classInfo: ClassSummaryItem;
  lectures: LectureItem[];
  search: string;
  onSearchChange: (value: string) => void;
  onOpenLecture: (lectureId: string) => void;
};

export default function SummaryLectureList({
  classInfo,
  lectures,
  search,
  onSearchChange,
  onOpenLecture,
}: SummaryLectureListProps) {
  return (
    <>
      <div className={styles.classHeaderRow}>
        <span
          className={`${styles.classCardIcon} ${CARD_COLOR_CLASS[classInfo.color]}`}
        >
          <classInfo.icon size={22} />
        </span>
        <div>
          <h1 className={styles.pageTitle}>{classInfo.name}</h1>
          <p className={styles.pageSubtitle}>
            {classInfo.code} ·{" "}
            <Users size={13} style={{ verticalAlign: -2 }} />{" "}
            {classInfo.studentCount} students
          </p>
        </div>
      </div>
      <h2 className={styles.sectionLabel}>Danh sách bài giảng</h2>
      <label className={styles.searchBox}>
        <Search size={16} />
        <input
          type="search"
          placeholder="Tìm kiếm bài giảng..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <div className={styles.lectureList}>
        {lectures.map((lecture) => (
          <div key={lecture.id} className={styles.lectureCard}>
            <div className={styles.lectureCardMain}>
              <p className={styles.lectureTitle}>{lecture.title}</p>
              <p className={styles.lectureTopic}>{lecture.topic}</p>
              <div className={styles.lectureMeta}>
                <span>
                  <Calendar size={13} /> {lecture.date}
                </span>
                <span>
                  <Clock size={13} /> {lecture.duration}
                </span>
              </div>
            </div>
            <div className={styles.lectureCardActions}>
              {lecture.hasSummary && (
                <span className={styles.summaryBadge}>
                  <Sparkles size={12} /> Đã có bản tổng hợp
                </span>
              )}
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onOpenLecture(lecture.id)}
              >
                Xem tổng hợp <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
        {lectures.length === 0 && (
          <p className={styles.emptyText}>Không tìm thấy bài giảng phù hợp.</p>
        )}
      </div>
    </>
  );
}

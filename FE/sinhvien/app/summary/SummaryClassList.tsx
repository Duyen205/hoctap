"use client";

import { ChevronRight, Users } from "lucide-react";
import type { ClassSummaryItem } from "./types";
import styles from "./summary.module.css";

const CARD_COLOR_CLASS: Record<ClassSummaryItem["color"], string> = {
  blue: styles.iconBlue,
  green: styles.iconGreen,
  purple: styles.iconPurple,
};

type SummaryClassListProps = {
  classes: ClassSummaryItem[];
  onOpenClass: (classId: string) => void;
};

export default function SummaryClassList({
  classes,
  onOpenClass,
}: SummaryClassListProps) {
  return (
    <>
      <h1 className={styles.pageTitle}>Lớp học của tôi</h1>
      <p className={styles.pageSubtitle}>Các lớp học bạn đang tham gia</p>
      <div className={styles.classGrid}>
        {classes.map((item) => (
          <div key={item.id} className={styles.classCard}>
            <span
              className={`${styles.classCardIcon} ${CARD_COLOR_CLASS[item.color]}`}
            >
              <item.icon size={20} />
            </span>
            <div className={styles.classCardBody}>
              <h3 className={styles.classCardName}>{item.name}</h3>
              <p className={styles.classCardCode}>{item.code}</p>
              <span className={styles.classCardStudents}>
                <Users size={13} /> {item.studentCount} students
              </span>
            </div>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => onOpenClass(item.id)}
            >
              Xem bài giảng <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

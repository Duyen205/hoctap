"use client";

import { ChevronLeft, Users } from "lucide-react";
import type { ClassItem } from "./types";
import styles from "./classmanagement.module.css";

type ClassGridProps = {
  classes: ClassItem[];
  studentCounts: Record<string, number>;
  onSelectClass: (classId: string) => void;
};

export default function ClassGrid({
  classes,
  studentCounts,
  onSelectClass,
}: ClassGridProps) {
  return (
    <section className={styles.containerSection}>
      <div className={styles.classGridContainer}>
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className={`${styles.modernClassCard} ${
              classItem.isLive ? styles.liveBorderAccent : ""
            }`}
            onClick={() => onSelectClass(classItem.id)}
          >
            <div className={styles.cardHeaderFlex}>
              <span className={styles.classCodeChip}>{classItem.code}</span>
              {classItem.isLive ? (
                <span className={styles.liveStatusBadge}>
                  <span className={styles.pulsingGreenDot} /> Live Streaming
                </span>
              ) : (
                <span className={styles.offlineStatusBadge}>Ngoại tuyến</span>
              )}
            </div>

            <h2 className={styles.cardTitleText}>{classItem.name}</h2>

            <div className={styles.cardFooterFlex}>
              <div className={styles.studentCounterGroup}>
                <div className={styles.iconCircleBg}>
                  <Users size={16} />
                </div>
                <span className={styles.countNumberText}>
                  <strong>{studentCounts[classItem.id] ?? 0}</strong> sinh viên
                </span>
              </div>

              <span className={styles.arrowIconWrapper}>
                <ChevronLeft size={18} style={{ transform: "rotate(180deg)" }} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

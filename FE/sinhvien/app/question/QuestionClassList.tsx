"use client";

import { ChevronRight } from "lucide-react";
import type { ClassInfo } from "./types";
import styles from "./question.module.css";

type QuestionClassListProps = {
  classes: ClassInfo[];
  onOpenClass: (id: string) => void;
};

export default function QuestionClassList({
  classes,
  onOpenClass,
}: QuestionClassListProps) {
  return (
    <>
      <h2 className={styles.sectionTitle}>
        Lớp học đã tham gia ({classes.length})
      </h2>
      <div className={styles.classListGrid}>
        {classes.map((cls) => (
          <button
            key={cls.id}
            type="button"
            className={styles.classListCard}
            onClick={() => onOpenClass(cls.id)}
          >
            <div className={styles.classListCardTop}>
              <span className={styles.classListCardCode}>
                {cls.code} · {cls.day} - {cls.time}
              </span>
              {cls.isLive && (
                <span className={`${styles.statusBadge} ${styles.statusLive}`}>
                  <span className={styles.statusDot} />
                  Đang diễn ra
                </span>
              )}
            </div>
            <h3 className={styles.classListCardName}>{cls.name}</h3>
            <div className={styles.classListCardFooter}>
              <span>{cls.date}</span>
              <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

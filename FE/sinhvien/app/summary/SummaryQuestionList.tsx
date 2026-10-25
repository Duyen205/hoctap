"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import type { QAItem } from "./types";
import styles from "./summary.module.css";

type SummaryQuestionListProps = {
  questions: QAItem[];
  expandedId: string | null;
  onToggle: (id: string | null) => void;
};

export default function SummaryQuestionList({
  questions,
  expandedId,
  onToggle,
}: SummaryQuestionListProps) {
  if (questions.length === 0) return null;

  return (
    <div className={styles.questionList}>
      {questions.map((question) => {
        const isOpen = expandedId === question.id;
        return (
          <div key={question.id} className={styles.questionItem}>
            <button
              type="button"
              className={styles.questionItemHeader}
              onClick={() => onToggle(isOpen ? null : question.id)}
            >
              <HelpCircle size={16} className={styles.questionIcon} />
              <span className={styles.questionText}>{question.question}</span>
              <span className={styles.questionMeta}>
                {question.answered && (
                  <span className={styles.answeredBadge}>Đã trả lời</span>
                )}
                <span className={styles.questionGroupLabel}>
                  {question.groupLabel} · {question.studentCount} sinh viên
                </span>
                <ChevronDown
                  size={15}
                  className={`${styles.questionChevron} ${
                    isOpen ? styles.questionChevronOpen : ""
                  }`}
                />
              </span>
            </button>
            {isOpen && question.answer && (
              <p className={styles.questionAnswer}>{question.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

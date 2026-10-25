"use client";

import { CheckCircle2, ChevronDown, ChevronUp, Search } from "lucide-react";
import type { QuestionGroup } from "./types";
import styles from "./question.module.css";

type QuestionGroupListProps = {
  groups: QuestionGroup[];
  expandedGroupId: string | null;
  translationVisible: Record<string, boolean>;
  expandedRelatedIds: Record<string, boolean>;
  onToggleGroup: (id: string) => void;
  onToggleTranslation: (id: string) => void;
  onToggleRelated: (id: string) => void;
};

const RELATED_PREVIEW_COUNT = 3;

export default function QuestionGroupList({
  groups,
  expandedGroupId,
  translationVisible,
  expandedRelatedIds,
  onToggleGroup,
  onToggleTranslation,
  onToggleRelated,
}: QuestionGroupListProps) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Nhóm câu hỏi</h2>
        <div className={styles.groupsToolbar}>
          <select className={styles.groupsFilterSelect} defaultValue="all">
            <option value="all">Tất cả nhóm</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                Nhóm {group.index} · {group.topic}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Tìm kiếm"
          >
            <Search size={16} />
          </button>
        </div>
      </div>
      <div className={styles.groupList}>
        {groups.length === 0 ? (
          <div className={styles.emptyState}>Chưa có nhóm câu hỏi nào.</div>
        ) : (
          groups.map((group) => {
            const isOpen = expandedGroupId === group.id;
            const showTranslation = translationVisible[group.id] ?? false;
            const showAllRelated = expandedRelatedIds[group.id] ?? false;
            const visibleRelated = showAllRelated
              ? group.relatedQuestions
              : group.relatedQuestions.slice(0, RELATED_PREVIEW_COUNT);

            return (
              <div key={group.id} className={styles.groupCard}>
                <button
                  type="button"
                  className={styles.groupCardHeader}
                  onClick={() => onToggleGroup(group.id)}
                >
                  <span className={styles.groupIndexBadge}>{group.index}</span>
                  <span className={styles.groupTopic}>{group.topic}</span>
                  <span className={styles.groupCountBadge}>
                    {group.totalQuestions} câu hỏi
                  </span>
                  <span
                    className={`${styles.answerBadge} ${
                      group.answered
                        ? styles.answerBadgeDone
                        : styles.answerBadgePending
                    }`}
                  >
                    {group.answered && <CheckCircle2 size={12} />}
                    {group.answered ? "Đã trả lời" : "Chưa trả lời"}
                  </span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div className={styles.groupBody}>
                    <p className={styles.groupSubheading}>Câu hỏi đại diện</p>
                    <div className={styles.mainQuestionBox}>
                      <span>{group.mainQuestion.text}</span>
                      <span className={styles.langTag}>
                        {group.mainQuestion.lang}
                      </span>
                    </div>
                    {group.relatedQuestions.length > 0 && (
                      <>
                        <p className={styles.groupSubheading}>
                          Các câu hỏi liên quan ({group.relatedQuestions.length})
                        </p>
                        <div className={styles.relatedList}>
                          {visibleRelated.map((question) => (
                            <div
                              key={question.id}
                              className={styles.relatedQuestionRow}
                            >
                              <span>{question.text}</span>
                              <span className={styles.langTag}>
                                {question.lang}
                              </span>
                            </div>
                          ))}
                        </div>
                        {group.relatedQuestions.length >
                          RELATED_PREVIEW_COUNT && (
                          <button
                            type="button"
                            className={styles.viewAllBtn}
                            onClick={() => onToggleRelated(group.id)}
                          >
                            {showAllRelated
                              ? "Thu gọn"
                              : "Xem tất cả câu hỏi trong nhóm"}
                          </button>
                        )}
                      </>
                    )}
                    {group.answer && (
                      <div className={styles.answerSection}>
                        <div className={styles.answerSectionHeader}>
                          <span
                            className={styles.cardTitle}
                            style={{ margin: 0 }}
                          >
                            Câu trả lời từ giảng viên
                          </span>
                          <label className={styles.translationToggleLabel}>
                            Hiển thị bản dịch
                            <button
                              type="button"
                              role="switch"
                              aria-checked={showTranslation}
                              className={`${styles.toggleSwitch} ${
                                showTranslation
                                  ? styles.toggleSwitchOn
                                  : ""
                              }`}
                              onClick={() => onToggleTranslation(group.id)}
                            >
                              <span className={styles.toggleKnob} />
                            </button>
                          </label>
                        </div>
                        <div className={styles.answerLangChips}>
                          <span className={styles.langTag}>EN</span>
                          {showTranslation && (
                            <span className={styles.langTag}>VI</span>
                          )}
                        </div>
                        <p className={styles.answerText}>{group.answer.en}</p>
                        {showTranslation && (
                          <p className={styles.answerTranslation}>
                            {group.answer.vi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

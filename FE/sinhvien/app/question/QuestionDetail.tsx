"use client";

import {
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import type { FormEvent } from "react";
import QuestionComposer from "./QuestionComposer";
import QuestionGroupList from "./QuestionGroupList";
import {
  LANG_LABEL,
  type ClassInfo,
  type CurrentUser,
  type MainTab,
  type QuestionFilter,
  type QuestionGroup,
  type QuestionItem,
  type QuestionLang,
} from "./types";
import styles from "./question.module.css";

type QuestionDetailProps = {
  classInfo: ClassInfo;
  currentUser: CurrentUser;
  activeTab: MainTab;
  questions: QuestionItem[];
  filteredQuestions: QuestionItem[];
  questionFilter: QuestionFilter;
  newQuestion: string;
  questionLang: QuestionLang;
  questionGroups: QuestionGroup[];
  expandedGroupId: string | null;
  translationVisible: Record<string, boolean>;
  expandedRelatedIds: Record<string, boolean>;
  onBack: () => void;
  onTabChange: (tab: MainTab) => void;
  onFilterChange: (filter: QuestionFilter) => void;
  onQuestionChange: (value: string) => void;
  onQuestionLangChange: (language: QuestionLang) => void;
  onSubmitQuestion: (event: FormEvent) => void;
  onToggleGroup: (id: string) => void;
  onToggleTranslation: (id: string) => void;
  onToggleRelated: (id: string) => void;
};

export default function QuestionDetail({
  classInfo,
  currentUser,
  activeTab,
  questions,
  filteredQuestions,
  questionFilter,
  newQuestion,
  questionLang,
  questionGroups,
  expandedGroupId,
  translationVisible,
  expandedRelatedIds,
  onBack,
  onTabChange,
  onFilterChange,
  onQuestionChange,
  onQuestionLangChange,
  onSubmitQuestion,
  onToggleGroup,
  onToggleTranslation,
  onToggleRelated,
}: QuestionDetailProps) {
  const answeredCount = questions.filter((question) => question.answered).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <ChevronLeft size={16} /> Lớp học đã tham gia
      </button>
      <div className={styles.classCard}>
        <div className={styles.classCardLeft}>
          <div className={styles.classAvatar}>
            <GraduationCap size={20} />
          </div>
          <div>
            <p className={styles.classTitle}>
              {classInfo.code} - {classInfo.name}
            </p>
            <div className={styles.classMeta}>
              <span>{currentUser.name}</span>
              <span className={styles.classMetaDot}>•</span>
              <span>
                {classInfo.day} - {classInfo.time}
              </span>
              <span className={styles.classMetaDot}>•</span>
              <span>{classInfo.date}</span>
            </div>
          </div>
        </div>
        {classInfo.isLive && (
          <span className={`${styles.statusBadge} ${styles.statusLive}`}>
            <span className={styles.statusDot} />
            Đang diễn ra
          </span>
        )}
      </div>

      <div className={styles.mainTabs}>
        <button
          type="button"
          className={`${styles.mainTabBtn} ${
            activeTab === "qa" ? styles.mainTabBtnActive : ""
          }`}
          onClick={() => onTabChange("qa")}
        >
          Hỏi đáp
        </button>
        <button
          type="button"
          className={`${styles.mainTabBtn} ${
            activeTab === "groups" ? styles.mainTabBtnActive : ""
          }`}
          onClick={() => onTabChange("groups")}
        >
          Nhóm câu hỏi
        </button>
        <button
          type="button"
          className={`${styles.mainTabBtn} ${
            activeTab === "materials" ? styles.mainTabBtnActive : ""
          }`}
          onClick={() => onTabChange("materials")}
        >
          Tài liệu
        </button>
      </div>

      {activeTab === "qa" && (
        <>
          <QuestionComposer
            value={newQuestion}
            language={questionLang}
            onValueChange={onQuestionChange}
            onLanguageChange={onQuestionLangChange}
            onSubmit={onSubmitQuestion}
          />
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Câu hỏi của tôi</h2>
            <div className={styles.filterTabs}>
              <button
                type="button"
                className={`${styles.filterTabBtn} ${
                  questionFilter === "all" ? styles.filterTabBtnActive : ""
                }`}
                onClick={() => onFilterChange("all")}
              >
                Tất cả ({questions.length})
              </button>
              <button
                type="button"
                className={`${styles.filterTabBtn} ${
                  questionFilter === "answered"
                    ? styles.filterTabBtnActive
                    : ""
                }`}
                onClick={() => onFilterChange("answered")}
              >
                Đã trả lời ({answeredCount})
              </button>
              <button
                type="button"
                className={`${styles.filterTabBtn} ${
                  questionFilter === "unanswered"
                    ? styles.filterTabBtnActive
                    : ""
                }`}
                onClick={() => onFilterChange("unanswered")}
              >
                Chưa trả lời ({unansweredCount})
              </button>
            </div>
          </div>
          <div className={styles.questionList}>
            {filteredQuestions.length === 0 ? (
              <div className={styles.emptyState}>
                Không có câu hỏi nào ở mục này.
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div key={question.id} className={styles.questionCard}>
                  <div className={styles.questionLeft}>
                    <span className={styles.groupBadge}>{question.group}</span>
                    <p className={styles.questionText}>{question.text}</p>
                    <div className={styles.questionMeta}>
                      <span className={styles.langTag}>
                        {LANG_LABEL[question.lang]}
                      </span>
                      <span>{question.timeAgo}</span>
                    </div>
                  </div>
                  <span
                    className={`${styles.answerBadge} ${
                      question.answered
                        ? styles.answerBadgeDone
                        : styles.answerBadgePending
                    }`}
                  >
                    {question.answered ? "Đã trả lời" : "Chưa trả lời"}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "groups" && (
        <QuestionGroupList
          groups={questionGroups}
          expandedGroupId={expandedGroupId}
          translationVisible={translationVisible}
          expandedRelatedIds={expandedRelatedIds}
          onToggleGroup={onToggleGroup}
          onToggleTranslation={onToggleTranslation}
          onToggleRelated={onToggleRelated}
        />
      )}
      {activeTab === "materials" && (
        <div className={styles.emptyState}>
          Tài liệu của lớp học sẽ hiển thị ở đây.
        </div>
      )}
    </>
  );
}

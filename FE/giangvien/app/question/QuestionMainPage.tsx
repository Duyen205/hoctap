"use client";

import { useMemo, useState, type MouseEvent } from "react";
import {
  ChevronDown,
  Filter,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import QuestionReplyPanel from "./QuestionReplyPanel";
import type {
  ClassItem,
  QuestionGroup,
  QuestionStatusFilter,
  QuestionSortOption,
  ReplyLanguage,
} from "./types";
import styles from "./question.module.css";

const CLASSES: ClassItem[] = [
  { id: "c1", code: "CS101", name: "AI Education", status: "Live", studentCount: 23 },
  { id: "c2", code: "SE305", name: "Software Testing", status: "Sắp diễn ra", studentCount: 18 },
  { id: "c3", code: "DB210", name: "Database", status: "Đã kết thúc", studentCount: 25 },
  { id: "c4", code: "CS301", name: "Web Programming", status: "Đã kết thúc", studentCount: 30 },
  { id: "c5", code: "ML101", name: "Data Mining", status: "Đã kết thúc", studentCount: 20 },
];

type QuestionMainPageProps = {
  groups: QuestionGroup[];
  replyingCardGroupId: string | null;
  replyText: string;
  sendToAllChecked: boolean;
  currentLang: ReplyLanguage;
  isTranslating: boolean;
  hidden?: boolean;
  onOpenGroup: (groupId: string) => void;
  onToggleQuickReply: (group: QuestionGroup) => void;
  onReplyTextChange: (text: string) => void;
  onSendToAllChange: (checked: boolean) => void;
  onLanguageChange: (language: ReplyLanguage) => void;
  onCancelInlineReply: () => void;
  onSubmitReply: (groupId: string) => void;
};

export default function QuestionMainPage({
  groups,
  replyingCardGroupId,
  replyText,
  sendToAllChecked,
  currentLang,
  isTranslating,
  hidden = false,
  onOpenGroup,
  onToggleQuickReply,
  onReplyTextChange,
  onSendToAllChange,
  onLanguageChange,
  onCancelInlineReply,
  onSubmitReply,
}: QuestionMainPageProps) {
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [searchClassQuery, setSearchClassQuery] = useState("");
  const [searchQuestionQuery, setSearchQuestionQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<QuestionStatusFilter>("all");
  const [sortBy, setSortBy] = useState<QuestionSortOption>("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const displayedGroups = useMemo(() => {
    let result = groups;

    if (selectedClassId !== "all") {
      result = result.filter((group) => group.classId === selectedClassId);
    }

    const query = searchQuestionQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (group) =>
          group.topic.toLowerCase().includes(query) ||
          group.representativeQuestion.toLowerCase().includes(query) ||
          group.rawQuestions.some((question) =>
            question.text.toLowerCase().includes(query),
          ),
      );
    }

    if (statusFilter === "answered") {
      result = result.filter((group) => group.answered);
    } else if (statusFilter === "unanswered") {
      result = result.filter((group) => !group.answered);
    }

    return [...result].sort((first, second) => {
      if (first.answered !== second.answered) {
        return first.answered ? 1 : -1;
      }
      if (sortBy === "most_q") {
        return second.totalQuestions - first.totalQuestions;
      }
      if (sortBy === "least_q") {
        return first.totalQuestions - second.totalQuestions;
      }
      return 0;
    });
  }, [groups, selectedClassId, searchQuestionQuery, statusFilter, sortBy]);

  const filteredClasses = useMemo(() => {
    const query = searchClassQuery.trim().toLowerCase();
    if (!query) return CLASSES;
    return CLASSES.filter(
      (classItem) =>
        classItem.name.toLowerCase().includes(query) ||
        classItem.code.toLowerCase().includes(query),
    );
  }, [searchClassQuery]);

  const selectedClass = CLASSES.find(
    (classItem) => classItem.id === selectedClassId,
  );

  function handleQuickReplyClick(
    event: MouseEvent<HTMLButtonElement>,
    group: QuestionGroup,
  ) {
    event.stopPropagation();
    onToggleQuickReply(group);
  }

  function selectClass(classId: string) {
    setSelectedClassId(classId);
    setClassDropdownOpen(false);
  }

  function selectSort(option: QuestionSortOption) {
    setSortBy(option);
    setSortDropdownOpen(false);
  }

  return (
    <div hidden={hidden}>
      <h1 className={styles.mainTitleHeading}>Question Grouping</h1>

      <div className={styles.toolbarHeaderBox}>
        <div className={styles.classDropdownWrapper}>
          <button
            type="button"
            className={styles.dropdownButtonTrigger}
            onClick={() => setClassDropdownOpen((open) => !open)}
          >
            <Users size={15} />
            <span>
              {selectedClassId === "all"
                ? "Tất cả lớp"
                : selectedClass?.name}
            </span>
            <ChevronDown size={14} />
          </button>

          {classDropdownOpen && (
            <div className={styles.dropdownMenuPopup}>
              <div className={styles.searchBoxInDropdown}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Tìm kiếm lớp..."
                  value={searchClassQuery}
                  onChange={(event) => setSearchClassQuery(event.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.dropdownScrollList}>
                <button
                  type="button"
                  className={`${styles.dropdownOptionItem} ${
                    selectedClassId === "all" ? styles.optionActive : ""
                  }`}
                  onClick={() => selectClass("all")}
                >
                  <span className={styles.optionClassName}>Tất cả lớp</span>
                </button>

                {filteredClasses.map((classItem) => (
                  <button
                    key={classItem.id}
                    type="button"
                    className={`${styles.dropdownOptionItem} ${
                      selectedClassId === classItem.id
                        ? styles.optionActive
                        : ""
                    }`}
                    onClick={() => selectClass(classItem.id)}
                  >
                    <span className={styles.optionClassName}>
                      {classItem.name}
                    </span>
                    <span
                      className={`${styles.statusBadgeSmall} ${
                        styles[classItem.status.replace(/\s+/g, "")]
                      }`}
                    >
                      {classItem.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.searchQuestionBox}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuestionQuery}
            onChange={(event) => setSearchQuestionQuery(event.target.value)}
          />
        </div>

        <div className={styles.filterChipGroup}>
          <button
            type="button"
            className={`${styles.filterChip} ${
              statusFilter === "all" ? styles.chipActive : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${
              statusFilter === "answered" ? styles.chipActive : ""
            }`}
            onClick={() => setStatusFilter("answered")}
          >
            Đã trả lời
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${
              statusFilter === "unanswered" ? styles.chipActive : ""
            }`}
            onClick={() => setStatusFilter("unanswered")}
          >
            Chưa trả lời
          </button>
        </div>

        <div className={styles.sortWrapper}>
          <button
            type="button"
            className={styles.dropdownButtonTrigger}
            onClick={() => setSortDropdownOpen((open) => !open)}
          >
            <Filter size={14} />
            <span>Sắp xếp</span>
            <ChevronDown size={14} />
          </button>
          {sortDropdownOpen && (
            <div className={styles.sortMenuPopup}>
              <button type="button" onClick={() => selectSort("newest")}>
                Mới nhất
              </button>
              <button type="button" onClick={() => selectSort("oldest")}>
                Cũ nhất
              </button>
              <button type="button" onClick={() => selectSort("most_q")}>
                Nhiều câu hỏi
              </button>
              <button type="button" onClick={() => selectSort("least_q")}>
                Ít câu hỏi
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.groupsStackContainer}>
        {displayedGroups.length === 0 ? (
          <div className={styles.emptyCardBox}>
            <MessageSquare size={36} />
            <p>Không tìm thấy nhóm câu hỏi nào phù hợp.</p>
          </div>
        ) : (
          displayedGroups.map((group) => {
            const isReplying = replyingCardGroupId === group.id;

            return (
              <div key={group.id} className={styles.cardWrapperContainer}>
                <div
                  className={styles.questionCardItemWithReply}
                  onClick={() => onOpenGroup(group.id)}
                >
                  <div className={styles.cardLeftReplyAction}>
                    <button
                      type="button"
                      className={styles.quickReplyBtn}
                      onClick={(event) => handleQuickReplyClick(event, group)}
                    >
                      {isReplying
                        ? "Đóng"
                        : group.answered
                          ? "Chỉnh sửa"
                          : "Reply"}
                    </button>
                  </div>

                  <div className={styles.cardMainContentArea}>
                    {selectedClassId === "all" && (
                      <div className={styles.cardHeaderFlexLine}>
                        <span className={styles.classNameChip}>
                          {group.className}
                        </span>
                        <span
                          className={`${styles.statusBadgeSmall} ${
                            styles[group.classStatus.replace(/\s+/g, "")]
                          }`}
                        >
                          {group.classStatus}
                        </span>
                      </div>
                    )}

                    <div className={styles.topicHeaderRow}>
                      <span className={styles.groupIndexPill}>
                        Nhóm {group.index}
                      </span>
                      <h3 className={styles.groupTopicTitle}>{group.topic}</h3>
                    </div>

                    <div className={styles.metaRowInfo}>
                      <span>{group.totalQuestions} câu hỏi</span>
                      <span>·</span>
                      <span>{group.totalStudents} sinh viên</span>
                      <span>·</span>
                      {group.answered ? (
                        <span className={styles.answeredStatusPill}>
                          Đã trả lời
                        </span>
                      ) : (
                        <span className={styles.notAnsweredStatusPill}>
                          Chưa trả lời
                        </span>
                      )}
                      <span className={styles.timeMetaText}>
                        {group.lastActivityAt}
                      </span>
                    </div>
                  </div>
                </div>

                {isReplying && (
                  <QuestionReplyPanel
                    group={group}
                    variant="inline"
                    replyText={replyText}
                    sendToAllChecked={sendToAllChecked}
                    currentLang={currentLang}
                    isTranslating={isTranslating}
                    onReplyTextChange={onReplyTextChange}
                    onSendToAllChange={onSendToAllChange}
                    onLanguageChange={onLanguageChange}
                    onCancel={onCancelInlineReply}
                    onSubmit={() => onSubmitReply(group.id)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

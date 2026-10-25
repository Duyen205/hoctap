"use client";

import { ChevronLeft, Sparkles } from "lucide-react";
import type { QuestionGroup, ReplyLanguage } from "./types";
import QuestionReplyPanel, { ReviewedAnswer } from "./QuestionReplyPanel";
import styles from "./question.module.css";

type QuestionDetailPageProps = {
  group: QuestionGroup;
  replyText: string;
  sendToAllChecked: boolean;
  currentLang: ReplyLanguage;
  isTranslating: boolean;
  onBack: () => void;
  onReplyTextChange: (text: string) => void;
  onSendToAllChange: (checked: boolean) => void;
  onLanguageChange: (language: ReplyLanguage) => void;
  onSubmit: () => void;
};

export default function QuestionDetailPage({
  group,
  replyText,
  sendToAllChecked,
  currentLang,
  isTranslating,
  onBack,
  onReplyTextChange,
  onSendToAllChange,
  onLanguageChange,
  onSubmit,
}: QuestionDetailPageProps) {
  return (
    <div className={styles.detailViewContainerStandard}>
      <div className={styles.detailTopBar}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </button>
        <div className={styles.detailTopBadgeRow}>
          <span className={styles.groupBadgePill}>Nhóm {group.index}</span>
          <span className={styles.classSourceChip}>{group.className}</span>
          {group.answered ? (
            <span className={styles.answeredPill}>Đã trả lời</span>
          ) : (
            <span className={styles.unansweredPill}>Chưa trả lời</span>
          )}
        </div>
      </div>

      <h2 className={styles.detailHeadingTitle}>{group.topic}</h2>

      <div className={styles.repQuestionHighlightBox}>
        <div className={styles.repHeaderFlex}>
          <span className={styles.repLabelSmall}>Representative Question</span>
          <span className={styles.aiGlowBadge}>
            <Sparkles size={11} /> AI Selected
          </span>
        </div>
        <p className={styles.repTextContent}>
          {group.representativeQuestion}
        </p>
      </div>

      <div className={styles.contentSectionBox}>
        <h4 className={styles.sectionHeadingText}>
          Danh sách câu hỏi con ẩn danh trong nhóm ({group.totalQuestions})
        </h4>
        <div className={styles.rawCardsListVertical}>
          {group.rawQuestions.map((question) => (
            <div key={question.id} className={styles.rawQuestionCardItem}>
              <p className={styles.rawQuestionText}>{question.text}</p>
              <span className={styles.timeText}>{question.time}</span>
            </div>
          ))}
        </div>
      </div>

      {group.answered && group.replyTextContent && !replyText && (
        <ReviewedAnswer
          answer={group.replyTextContent}
          onEdit={() => onReplyTextChange(group.replyTextContent ?? "")}
        />
      )}

      <QuestionReplyPanel
        group={group}
        variant="detail"
        replyText={replyText}
        sendToAllChecked={sendToAllChecked}
        currentLang={currentLang}
        isTranslating={isTranslating}
        onReplyTextChange={onReplyTextChange}
        onSendToAllChange={onSendToAllChange}
        onLanguageChange={onLanguageChange}
        onCancel={onBack}
        onSubmit={onSubmit}
      />
    </div>
  );
}

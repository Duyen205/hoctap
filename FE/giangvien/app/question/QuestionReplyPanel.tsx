"use client";

import { Check, Paperclip } from "lucide-react";
import type { QuestionGroup, ReplyLanguage } from "./types";
import styles from "./question.module.css";

type QuestionReplyPanelProps = {
  group: QuestionGroup;
  variant: "inline" | "detail";
  replyText: string;
  sendToAllChecked: boolean;
  currentLang: ReplyLanguage;
  isTranslating: boolean;
  onReplyTextChange: (text: string) => void;
  onSendToAllChange: (checked: boolean) => void;
  onLanguageChange: (language: ReplyLanguage) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function QuestionReplyPanel({
  group,
  variant,
  replyText,
  sendToAllChecked,
  currentLang,
  isTranslating,
  onReplyTextChange,
  onSendToAllChange,
  onLanguageChange,
  onCancel,
  onSubmit,
}: QuestionReplyPanelProps) {
  const isDetail = variant === "detail";
  const containerClass = isDetail
    ? styles.replyBoxWrapperStandard
    : styles.inlineReplyBoxDirect;

  return (
    <div className={containerClass}>
      <div className={styles.replyBoxHeader}>
        <div className={styles.replyBoxTitle}>
          ✍️ Trả lời tất cả câu hỏi trong nhóm
          {!isDetail && (
            <>
              : <em>{group.topic}</em>
            </>
          )}
        </div>
        <div className={styles.langSwitchGroup}>
          <button
            type="button"
            className={`${styles.langBtn} ${currentLang === "en" ? styles.langActive : ""}`}
            onClick={() => onLanguageChange("en")}
          >
            EN
          </button>
          <span className={styles.langDivider}>|</span>
          <button
            type="button"
            className={`${styles.langBtn} ${currentLang === "vi" ? styles.langActive : ""}`}
            onClick={() => onLanguageChange("vi")}
          >
            VI
          </button>
        </div>
      </div>

      <div className={styles.replyBoxBody}>
        <textarea
          className={styles.replyTextareaField}
          rows={isDetail ? 5 : 4}
          placeholder="Nhập câu trả lời của giảng viên..."
          value={replyText}
          onChange={(event) => onReplyTextChange(event.target.value)}
          disabled={isTranslating}
          autoFocus
        />
      </div>

      <div className={styles.replyBoxFooter}>
        <div className={styles.footerLeftOptions}>
          <label className={styles.attachFileButtonLabel}>
            <Paperclip size={13} /> Đính kèm file / hình ảnh
            <input type="file" style={{ display: "none" }} />
          </label>
          <span className={styles.optionalBadgeText}>(Optional)</span>

          <label className={styles.checkboxLabelFlex}>
            <input
              type="checkbox"
              checked={sendToAllChecked}
              onChange={(event) => onSendToAllChange(event.target.checked)}
            />
            <span>
              Gửi câu trả lời cho tất cả ({group.totalQuestions} câu hỏi)
            </span>
          </label>
        </div>

        <div className={styles.footerRightButtons}>
          <button
            type="button"
            className={styles.secondaryOutlineBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryActionButton}
            disabled={!replyText.trim()}
            onClick={onSubmit}
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}

type ReviewedAnswerProps = {
  answer: string;
  onEdit: () => void;
};

export function ReviewedAnswer({ answer, onEdit }: ReviewedAnswerProps) {
  return (
    <div className={styles.reviewedAnswerCard}>
      <div className={styles.reviewedHeader}>
        <span className={styles.reviewedTitle}>
          <Check size={15} color="#059669" /> Câu trả lời đã gửi cho nhóm này
        </span>
        <button
          type="button"
          className={styles.editBtnInline}
          onClick={onEdit}
        >
          Chỉnh sửa
        </button>
      </div>
      <p className={styles.reviewedBodyText}>{answer}</p>
    </div>
  );
}

"use client";

import type { EndFlowStep } from "./types";
import styles from "./live.module.css";

type EndLessonDialogProps = {
  step: EndFlowStep;
  className: string;
  onClassNameChange: (value: string) => void;
  onCancel: () => void;
  onConfirmNo: () => void;
  onConfirmYes: () => void;
  onSave: () => void;
};

export default function EndLessonDialog({
  step,
  className,
  onClassNameChange,
  onCancel,
  onConfirmNo,
  onConfirmYes,
  onSave,
}: EndLessonDialogProps) {
  if (step === "closed") return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        {step === "confirm" ? (
          <>
            <h3 className={styles.modalTitle}>Kết thúc buổi nghe bài giảng?</h3>
            <p className={styles.modalText}>
              Bạn có muốn tổng hợp bài giảng này để lưu lại không?
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalBtnOutline}
                onClick={onConfirmNo}
              >
                Không
              </button>
              <button
                type="button"
                className={styles.modalBtnPrimary}
                onClick={onConfirmYes}
              >
                Có
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className={styles.modalTitle}>Lưu vào tài liệu lớp học</h3>
            <p className={styles.modalText}>
              Nhập tên lớp học để lưu bản tổng hợp bài giảng này vào mục Tài
              liệu.
            </p>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Ví dụ: CMU-IS 482 CIS"
              value={className}
              onChange={(event) => onClassNameChange(event.target.value)}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalBtnOutline}
                onClick={onCancel}
              >
                Hủy
              </button>
              <button
                type="button"
                className={styles.modalBtnPrimary}
                disabled={!className.trim()}
                onClick={onSave}
              >
                Lưu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

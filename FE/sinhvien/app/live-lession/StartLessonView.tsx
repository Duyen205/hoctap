"use client";

import { Mic, Play } from "lucide-react";
import styles from "./live.module.css";

type StartLessonViewProps = {
  onStart: () => void | Promise<void>;
  isStarting: boolean;
  errorMessage: string | null;
};

export default function StartLessonView({
  onStart,
  isStarting,
  errorMessage,
}: StartLessonViewProps) {
  return (
    <section className={styles.waitingContainer}>
      <div className={styles.waitingContent}>
        
        <div className={styles.micIconWrapper} aria-hidden="true">
          <Mic size={42} strokeWidth={1.8} />
        </div>

        <h1 className={styles.waitingTitle}>Ready for Live Translation</h1>
        <p className={styles.waitingDesc}>
          Bắt đầu ghi âm để lưu lại bài giảng và tiếp tục theo dõi khi bạn chuyển
          sang trang khác.
        </p>

        <button
          type="button"
          className={styles.startListenBtn}
          onClick={() => void onStart()}
          disabled={isStarting}
        >
          <Play size={18} fill="currentColor" />
          {isStarting ? "Đang kết nối micro..." : "Bắt đầu nghe & dịch"}
        </button>

        {errorMessage && (
          <p className={styles.recordingError} role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}

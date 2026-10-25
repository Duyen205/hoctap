"use client";

import { Globe, Send } from "lucide-react";
import type { FormEvent } from "react";
import { LANG_LABEL, type QuestionLang } from "./types";
import styles from "./question.module.css";

type QuestionComposerProps = {
  value: string;
  language: QuestionLang;
  onValueChange: (value: string) => void;
  onLanguageChange: (language: QuestionLang) => void;
  onSubmit: (event: FormEvent) => void;
};

export default function QuestionComposer({
  value,
  language,
  onValueChange,
  onLanguageChange,
  onSubmit,
}: QuestionComposerProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Đặt câu hỏi</h2>
      <form onSubmit={onSubmit}>
        <textarea
          className={styles.questionTextarea}
          placeholder="Nhập câu hỏi của bạn... (có thể bằng tiếng Việt, tiếng Anh hoặc kết hợp)"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
        <div className={styles.questionFooter}>
          <div className={styles.langGroup}>
            {(["vi", "en", "mixed"] as QuestionLang[]).map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.langBtn} ${
                  language === item ? styles.langBtnActive : ""
                }`}
                onClick={() => onLanguageChange(item)}
              >
                <Globe size={12} />
                {LANG_LABEL[item]}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!value.trim()}
          >
            Gửi <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import {
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Sparkles,
} from "lucide-react";
import SummaryQuestionList from "./SummaryQuestionList";
import type {
  ClassSummaryItem,
  LectureDetail,
  LectureItem,
  TabKey,
} from "./types";
import styles from "./summary.module.css";

const TABS: { key: TabKey; label: string }[] = [
  { key: "summary", label: "Tóm tắt" },
  { key: "questions", label: "Câu hỏi" },
  { key: "transcript", label: "Transcript" },
];

type SummaryLectureDetailProps = {
  classInfo: ClassSummaryItem;
  lecture: LectureItem;
  detail: LectureDetail;
  activeTab: TabKey;
  summaryLang: "vi" | "en";
  bilingualTranscript: boolean;
  expandedQuestionId: string | null;
  onBack: () => void;
  onTabChange: (tab: TabKey) => void;
  onSummaryLangChange: (language: "vi" | "en") => void;
  onBilingualTranscriptChange: (enabled: boolean) => void;
  onToggleQuestion: (id: string | null) => void;
};

export default function SummaryLectureDetail({
  classInfo,
  lecture,
  detail,
  activeTab,
  summaryLang,
  bilingualTranscript,
  expandedQuestionId,
  onBack,
  onTabChange,
  onSummaryLangChange,
  onBilingualTranscriptChange,
  onToggleQuestion,
}: SummaryLectureDetailProps) {
  return (
    <>
      <div className={styles.detailHeaderRow}>
        <div>
          <h1 className={styles.pageTitle}>Tổng hợp bài giảng</h1>
          <p className={styles.pageSubtitle}>{lecture.topic}</p>
          <div className={styles.detailMetaRow}>
            <span>
              <BookOpen size={13} /> {classInfo.name}
            </span>
            <span>{lecture.title}</span>
            <span>
              <Calendar size={13} /> {lecture.date}
            </span>
            <span>
              <Clock size={13} /> {lecture.duration}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={styles.backLink}
          onClick={onBack}
        >
          <ChevronLeft size={15} /> Quay lại
        </button>
      </div>

      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`${styles.tabItem} ${
              activeTab === tab.key ? styles.tabItemActive : ""
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div className={styles.tabPanel}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <span className={styles.summaryCardTitle}>
                <Sparkles size={15} /> Tóm tắt bài giảng
              </span>
              <div className={styles.langToggle}>
                <button
                  type="button"
                  className={`${styles.langBtn} ${
                    summaryLang === "vi" ? styles.langBtnActive : ""
                  }`}
                  onClick={() => onSummaryLangChange("vi")}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  className={`${styles.langBtn} ${
                    summaryLang === "en" ? styles.langBtnActive : ""
                  }`}
                  onClick={() => onSummaryLangChange("en")}
                >
                  English
                </button>
              </div>
            </div>
            <p className={styles.summaryText}>
              {summaryLang === "vi" ? detail.summaryVi : detail.summaryEn}
            </p>
          </div>

          {detail.keyConcepts.length > 0 && (
            <>
              <h2 className={styles.sectionLabel}>Chủ đề chính</h2>
              <div className={styles.conceptGrid}>
                {detail.keyConcepts.map((concept, index) => (
                  <div key={concept.id} className={styles.conceptCard}>
                    <span className={styles.conceptNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.conceptTitle}>{concept.title}</h3>
                    <p className={styles.conceptDesc}>
                      {concept.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.glossaryCard}>
                <h2 className={styles.glossaryCardTitle}>
                  Giải thích từ ngữ chuyên ngành
                </h2>
                <div className={styles.glossaryList}>
                  {detail.keyConcepts.map((concept) => (
                    <div key={concept.id} className={styles.glossaryItem}>
                      <p className={styles.glossaryTerm}>{concept.title}</p>
                      <p className={styles.glossaryDesc}>
                        {concept.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "questions" && (
        <div className={styles.tabPanel}>
          <h2 className={styles.sectionLabel}>
            Tất cả câu hỏi đã giải đáp
          </h2>
          <SummaryQuestionList
            questions={detail.questions}
            expandedId={expandedQuestionId}
            onToggle={onToggleQuestion}
          />
          {detail.questions.length === 0 && (
            <p className={styles.emptyText}>
              Chưa có câu hỏi nào cho bài giảng này.
            </p>
          )}
        </div>
      )}

      {activeTab === "transcript" && (
        <div className={styles.tabPanel}>
          <div className={styles.transcriptHeaderRow}>
            <h2 className={styles.sectionLabel}>Transcript bài giảng</h2>
            <label className={styles.bilingualToggleRow}>
              <span>Hiển thị song ngữ</span>
              <button
                type="button"
                role="switch"
                aria-checked={bilingualTranscript}
                onClick={() =>
                  onBilingualTranscriptChange(!bilingualTranscript)
                }
                className={`${styles.toggle} ${
                  bilingualTranscript ? styles.toggleOn : ""
                }`}
              >
                <span className={styles.toggleThumb} />
              </button>
            </label>
          </div>
          <div className={styles.transcriptList}>
            {detail.transcript.map((line, index) => (
              <div key={index} className={styles.transcriptRow}>
                <span className={styles.transcriptTime}>{line.time}</span>
                <div className={styles.transcriptTextBlock}>
                  <p className={styles.transcriptEn}>{line.en}</p>
                  {bilingualTranscript && (
                    <p className={styles.transcriptVi}>{line.vi}</p>
                  )}
                </div>
              </div>
            ))}
            {detail.transcript.length === 0 && (
              <p className={styles.emptyText}>
                Chưa có transcript cho bài giảng này.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

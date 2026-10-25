"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import AccountMenu from "../account/AccountMenu";
import Layout from "../components/Layout";
import SummaryClassList from "./SummaryClassList";
import SummaryLectureDetail from "./SummaryLectureDetail";
import SummaryLectureList from "./SummaryLectureList";
import { CLASSES, FALLBACK_DETAIL, LECTURES, LECTURE_DETAILS } from "./data";
import styles from "./summary.module.css";
import type { SummaryView, TabKey } from "./types";

export default function LessonSummaryPage() {
  const [teacherName, setTeacherName] = useState("");
  const [view, setView] = useState<SummaryView>("classes");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(
    null,
  );
  const [lectureSearch, setLectureSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [summaryLang, setSummaryLang] = useState<"vi" | "en">("vi");
  const [bilingualTranscript, setBilingualTranscript] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null,
  );

  const selectedClass = CLASSES.find((item) => item.id === selectedClassId) ?? null;
  const selectedLecture =
    LECTURES.find((item) => item.id === selectedLectureId) ?? null;
  const detail = selectedLectureId
    ? (LECTURE_DETAILS[selectedLectureId] ?? FALLBACK_DETAIL)
    : FALLBACK_DETAIL;
  const filteredLectures = useMemo(() => {
    const list = LECTURES.filter((lecture) => lecture.classId === selectedClassId);
    const query = lectureSearch.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(query) ||
        lecture.topic.toLowerCase().includes(query),
    );
  }, [selectedClassId, lectureSearch]);

  function openClass(classId: string) {
    setSelectedClassId(classId);
    setLectureSearch("");
    setView("lectures");
  }

  function openLecture(lectureId: string) {
    setSelectedLectureId(lectureId);
    setActiveTab("summary");
    setExpandedQuestionId(null);
    setView("detail");
  }

  function backToLectures() {
    setView("lectures");
    setSelectedLectureId(null);
  }

  return (
    <Layout
      className={styles.page}
      bodyClassName={styles.body}
      mainClassName={styles.main}
      headerActions={
        <AccountMenu
          teacherName={teacherName}
          onSaveAccountInfo={(info) => {
            console.log("Lưu thông tin tài khoản:", info);
            setTeacherName(info.username);
          }}
          onSubmitPasswordChange={(oldPassword, newPassword) => {
            console.log("Đổi mật khẩu:", { oldPassword, newPassword });
          }}
          onLogout={() => {
            console.log("Đăng xuất");
          }}
        />
      }
    >
      <div className={styles.breadcrumb}>
        {selectedClass && (
          <>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <button
              type="button"
              onClick={backToLectures}
              className={styles.breadcrumbItem}
            >
              {selectedClass.name}
            </button>
          </>
        )}
        {selectedLecture && (
          <>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>
              {selectedLecture.title} · Tổng hợp bài giảng
            </span>
          </>
        )}
      </div>

      {view === "classes" && (
        <SummaryClassList classes={CLASSES} onOpenClass={openClass} />
      )}
      {view === "lectures" && selectedClass && (
        <SummaryLectureList
          classInfo={selectedClass}
          lectures={filteredLectures}
          search={lectureSearch}
          onSearchChange={setLectureSearch}
          onOpenLecture={openLecture}
        />
      )}
      {view === "detail" && selectedClass && selectedLecture && (
        <SummaryLectureDetail
          classInfo={selectedClass}
          lecture={selectedLecture}
          detail={detail}
          activeTab={activeTab}
          summaryLang={summaryLang}
          bilingualTranscript={bilingualTranscript}
          expandedQuestionId={expandedQuestionId}
          onBack={backToLectures}
          onTabChange={setActiveTab}
          onSummaryLangChange={setSummaryLang}
          onBilingualTranscriptChange={setBilingualTranscript}
          onToggleQuestion={setExpandedQuestionId}
        />
      )}
    </Layout>
  );
}

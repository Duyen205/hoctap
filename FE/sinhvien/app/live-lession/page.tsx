"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "../account/AccountMenu";
import Layout from "../components/Layout";
import EndLessonDialog from "./EndLessonDialog";
import {
  formatElapsedTime,
  useLiveLesson,
} from "./LiveLessonContext";
import LiveLessonPlayer from "./LiveLessonPlayer";
import StartLessonView from "./StartLessonView";
import styles from "./live.module.css";
import type { EndFlowStep } from "./types";

function saveLectureToDocuments(
  className: string,
  title: string,
  duration: string,
  transcript: ReturnType<typeof useLiveLesson>["transcript"],
) {
  if (typeof window === "undefined") return;
  const doc = {
    id: crypto.randomUUID(),
    className: className.trim(),
    title,
    duration,
    transcript,
    savedAt: new Date().toISOString(),
  };
  const existingRaw = localStorage.getItem("classbridge_documents");
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  localStorage.setItem(
    "classbridge_documents",
    JSON.stringify([...existing, doc]),
  );
}

export default function LessonSummaryPage() {
  const router = useRouter();
  const {
    isStarted,
    transcript,
    lectureTitle,
    elapsedSeconds,
    isStarting,
    recordingError,
    startLesson,
    stopLesson,
  } = useLiveLesson();
  const [teacherName, setTeacherName] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [endFlowStep, setEndFlowStep] = useState<EndFlowStep>("closed");
  const [className, setClassName] = useState("");
  const duration = formatElapsedTime(elapsedSeconds);

  function handleSaveDocument() {
    if (!className.trim()) return;
    saveLectureToDocuments(className, lectureTitle, duration, transcript);
    stopLesson();
    setEndFlowStep("closed");
    router.push("/question?tab=materials");
  }

  return (
    <Layout
      className={styles.appShell}
      bodyClassName={styles.page}
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
      {isStarted ? (
        <LiveLessonPlayer
          isPlaying={isPlaying}
          transcript={transcript}
          title={lectureTitle}
          duration={duration}
          onTogglePlayback={() => setIsPlaying((playing) => !playing)}
          onEnd={() => setEndFlowStep("confirm")}
        />
      ) : (
        <StartLessonView
          onStart={startLesson}
          isStarting={isStarting}
          errorMessage={recordingError}
        />
      )}
      <EndLessonDialog
        step={endFlowStep}
        className={className}
        onClassNameChange={setClassName}
        onCancel={() => setEndFlowStep("closed")}
        onConfirmNo={() => {
          stopLesson();
          setEndFlowStep("closed");
          router.push("/home");
        }}
        onConfirmYes={() => setEndFlowStep("enterClassName")}
        onSave={handleSaveDocument}
      />
    </Layout>
  );
}

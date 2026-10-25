"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./LiveLessonContext.module.css";
import type { TranscriptLine } from "./types";

const INITIAL_TRANSCRIPT: TranscriptLine[] = [
  {
    id: "t1",
    time: "00:42",
    en: "Machine learning is a subset of artificial intelligence.",
    vi: "Machine learning là một nhánh của trí tuệ nhân tạo.",
  },
  {
    id: "t2",
    time: "01:12",
    en: "Today we will focus on supervised learning algorithms.",
    vi: "Hôm nay chúng ta sẽ tập trung vào các thuật toán học có giám sát.",
  },
  {
    id: "t3",
    time: "01:45",
    en: "The next slide shows the basic structure of a neural network.",
    vi: "Slide tiếp theo cho thấy cấu trúc cơ bản của một mạng nơ-ron.",
  },
];

type LiveLessonContextValue = {
  isStarted: boolean;
  isRecording: boolean;
  transcript: TranscriptLine[];
  lectureTitle: string;
  elapsedSeconds: number;
  isStarting: boolean;
  recordingError: string | null;
  recordingAudio: Blob | null;
  startLesson: () => Promise<void>;
  stopLesson: () => void;
  setTranscript: (transcript: TranscriptLine[]) => void;
  setLectureTitle: (title: string) => void;
};

const LiveLessonContext = createContext<LiveLessonContextValue | null>(null);

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function FloatingRecordingBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isStarted, isRecording } = useLiveLesson();
  const isLiveLessonPage =
    pathname === "/live-lession" || pathname.startsWith("/live-lession/");

  if (!isStarted || !isRecording || isLiveLessonPage) return null;

  return (
    <aside className={styles.floatingRecordingBar} role="status">
      <span className={styles.recordingIndicator} aria-hidden="true" />
      <span className={styles.recordingMessage}>
        Bài giảng đang được ghi âm ngầm...
      </span>
      <button
        className={styles.returnButton}
        type="button"
        onClick={() => router.push("/live-lession")}
      >
        Quay lại phòng học
      </button>
    </aside>
  );
}

export function LiveLessonProvider({ children }: { children: ReactNode }) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [recordingAudio, setRecordingAudio] = useState<Blob | null>(null);
  const [transcript, setTranscript] =
    useState<TranscriptLine[]>(INITIAL_TRANSCRIPT);
  const [lectureTitle, setLectureTitle] = useState("Lớp học chưa có tên");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) return;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((elapsed) => elapsed + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  const startLesson = useCallback(async () => {
    if (isRecording || isStarting) return;
    setRecordingError(null);
    setIsStarting(true);

    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      ) {
        throw new Error("Trình duyệt này không hỗ trợ ghi âm.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      setRecordingAudio(null);

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        if (audioChunks.length > 0) {
          setRecordingAudio(
            new Blob(audioChunks, {
              type: recorder.mimeType || "audio/webm",
            }),
          );
        }
      });
      recorder.addEventListener("error", () => {
        setRecordingError("Ghi âm bị gián đoạn. Vui lòng bắt đầu lại.");
        setIsRecording(false);
        setIsStarted(false);
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
      });

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setElapsedSeconds(0);
      setIsStarted(true);
      setIsRecording(true);
    } catch (error) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;
      setRecordingError(
        error instanceof Error
          ? error.message
          : "Không thể bắt đầu ghi âm. Vui lòng thử lại.",
      );
    } finally {
      setIsStarting(false);
    }
  }, [isRecording, isStarting]);

  const stopLesson = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    setIsRecording(false);
    setIsStarted(false);
  }, []);

  const value = useMemo<LiveLessonContextValue>(
    () => ({
      isStarted,
      isRecording,
      isStarting,
      recordingError,
      recordingAudio,
      transcript,
      lectureTitle,
      elapsedSeconds,
      startLesson,
      stopLesson,
      setTranscript,
      setLectureTitle,
    }),
    [
      elapsedSeconds,
      isRecording,
      isStarted,
      isStarting,
      lectureTitle,
      recordingAudio,
      recordingError,
      startLesson,
      stopLesson,
      transcript,
    ],
  );

  return (
    <LiveLessonContext.Provider value={value}>
      {children}
      <FloatingRecordingBar />
    </LiveLessonContext.Provider>
  );
}

export function useLiveLesson(): LiveLessonContextValue {
  const context = useContext(LiveLessonContext);
  if (!context) {
    throw new Error("useLiveLesson must be used within LiveLessonProvider");
  }
  return context;
}

import type { ComponentType } from "react";

export type ClassSummaryItem = {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  icon: ComponentType<{ size?: number }>;
  color: "blue" | "green" | "purple";
};

export type LectureItem = {
  id: string;
  classId: string;
  title: string;
  topic: string;
  date: string;
  duration: string;
  hasSummary: boolean;
};

export type KeyConcept = {
  id: string;
  title: string;
  description: string;
};

export type QAItem = {
  id: string;
  question: string;
  groupLabel: string;
  studentCount: number;
  answered: boolean;
  answer?: string;
};

export type TranscriptLine = {
  time: string;
  en: string;
  vi: string;
};

export type LectureDetail = {
  summaryEn: string;
  summaryVi: string;
  keyConcepts: KeyConcept[];
  questions: QAItem[];
  transcript: TranscriptLine[];
};

export type TabKey = "summary" | "questions" | "transcript";
export type SummaryView = "classes" | "lectures" | "detail";

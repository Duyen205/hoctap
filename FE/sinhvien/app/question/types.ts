export type QuestionLang = "vi" | "en" | "mixed";
export type GroupQuestionLang = "EN" | "VI";
export type QuestionFilter = "all" | "answered" | "unanswered";
export type MainTab = "qa" | "groups" | "materials";

export interface ClassInfo {
  id: string;
  code: string;
  name: string;
  isLive: boolean;
  day: string;
  time: string;
  date: string;
}

export interface CurrentUser {
  name: string;
}

export interface QuestionItem {
  id: string;
  group: string;
  text: string;
  answered: boolean;
  lang: QuestionLang;
  timeAgo: string;
}

export interface GroupRelatedQuestion {
  id: string;
  text: string;
  lang: GroupQuestionLang;
}

export interface QuestionGroup {
  id: string;
  index: number;
  topic: string;
  totalQuestions: number;
  answered: boolean;
  mainQuestion: { text: string; lang: GroupQuestionLang };
  relatedQuestions: GroupRelatedQuestion[];
  answer?: { en: string; vi: string };
}

export const LANG_LABEL: Record<QuestionLang, string> = {
  vi: "VI",
  en: "EN",
  mixed: "Mixed",
};

export interface RawQuestion {
  id: string;
  text: string;
  time: string;
}

export interface QuestionGroup {
  id: string;
  classId: string;
  className: string;
  classStatus: "Live" | "Sắp diễn ra" | "Đã kết thúc";
  index: number;
  topic: string;
  totalQuestions: number;
  totalStudents: number;
  representativeQuestion: string;
  rawQuestions: RawQuestion[];
  answered: boolean;
  replyTextContent?: string;
  lastActivityAt: string;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  status: "Live" | "Sắp diễn ra" | "Đã kết thúc";
  studentCount: number;
}

export type QuestionStatusFilter = "all" | "answered" | "unanswered";
export type QuestionSortOption = "newest" | "oldest" | "most_q" | "least_q";
export type ReplyLanguage = "vi" | "en";

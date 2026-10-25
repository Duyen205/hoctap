export interface ClassItem {
  id: string;
  code: string;
  name: string;
  isLive: boolean;
}

export interface Student {
  id: number;
  classId: string;
  name: string;
  studentId: string;
  joined: boolean;
  joinedAt: string;
  questionCount: number;
}

export type StudentStatusFilter = "all" | "joined";

export interface StudentStats {
  total: number;
  joined: number;
  totalQuestions: number;
}

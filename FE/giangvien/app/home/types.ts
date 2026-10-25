export interface HomeClassItem {
  id: string;
  code: string;
  name: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  status: "ongoing" | "upcoming";
  studentCount: number;
  groupCount: number;
  sessionCount: number;
  weekdays: string[];
  slideFileName?: string;
}

export interface StudentForm {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
}

export type StudentFormErrors = Partial<Record<keyof StudentForm, string>>;
export type HomeFormView = "create" | "result";
export type CopiedValue = "code" | "link" | null;

export const WEEKDAYS = [
  { key: "T2", label: "T2" },
  { key: "T3", label: "T3" },
  { key: "T4", label: "T4" },
  { key: "T5", label: "T5" },
  { key: "T6", label: "T6" },
  { key: "T7", label: "T7" },
  { key: "CN", label: "CN" },
] as const;

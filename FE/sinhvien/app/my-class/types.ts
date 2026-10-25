export type ClassData = {
  id: string;
  title: string;
  code: string;
  instructorInitials: string;
  instructorName: string;
  lastSession: string;
  schedule: string;
  isLive: boolean;
};

export type SessionData = {
  id: string;
  week: string;
  title: string;
  date: string;
};

export type ClassDetailData = {
  id: string;
  title: string;
  code: string;
  instructorInitials: string;
  instructorName: string;
  schedule: string;
  currentSessionTitle: string | null;
  previousSessions: SessionData[];
};

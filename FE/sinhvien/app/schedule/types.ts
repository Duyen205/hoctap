export type ScheduleView = "day" | "week" | "month";

export type ScheduledClass = {
  id: string;
  classId: string;
  title: string;
  code: string;
  instructor: string;
  weekday: number;
  startTime: string;
  endTime: string;
  roomCode: string;
  isLive?: boolean;
};

export type ScheduleOccurrence = ScheduledClass & {
  date: Date;
};

export interface ClassInfo {
  id: string;
  name: string;
  code: string;
  date?: string;
  startTime: string;
  endTime: string;
  isLiveNow: boolean;
  status: "live" | "upcoming" | "ended";
  studentCount: number;
  groupsCount?: number;
}

export interface Participant {
  id: string;
  name: string;
  micOn: boolean;
  camOn: boolean;
  isSpeaking?: boolean;
}

export interface CaptionLine {
  id: string;
  text: string;
  time: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export type RoomViewState = "dashboard" | "room";
export type ClassFilterTab = "all" | "live" | "upcoming" | "ended";

export interface TranscriptLine {
  id: string;
  time: string;
  en: string;
  vi: string;
}

export type EndFlowStep = "closed" | "confirm" | "enterClassName";

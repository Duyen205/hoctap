export type ClassItem = {
  id: string;
  code: string;
  name: string;
  instructor: string;
  time: string;
  date: string;
  status: "ongoing" | "upcoming";
};

export type JoinScreen = "none" | "scanQr" | "enterCode";
export type ClassTab = "ongoing" | "upcoming";

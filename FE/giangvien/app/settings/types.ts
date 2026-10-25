export interface Option {
  value: string;
  label: string;
}

export interface SettingsState {
  interfaceLanguage: string;
  timeZone: string;
  lectureLanguage: string;
  translation: boolean;
  bilingualSubtitles: boolean;
  subtitleStyle: string;
  classroomData: boolean;
  audioStorage: boolean;
  dataUsage: boolean;
}

export type UpdateSetting = <K extends keyof SettingsState>(
  key: K,
  value: SettingsState[K],
) => void;

"use client";

import type { ReactNode } from "react";
import {
  Captions,
  Check,
  ChevronDown,
  Clock,
  Globe,
  Languages,
  Lock,
  Mic,
  Settings,
} from "lucide-react";
import styles from "./setting.module.css";
import type { Option, SettingsState, UpdateSetting } from "./types";

const INTERFACE_LANGUAGES: Option[] = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

const TIME_ZONES: Option[] = [
  { value: "Asia/Ho_Chi_Minh", label: "(GMT+7) Hanoi" },
  { value: "Asia/Bangkok", label: "(GMT+7) Bangkok" },
  { value: "Asia/Singapore", label: "(GMT+8) Singapore" },
  { value: "Asia/Tokyo", label: "(GMT+9) Tokyo" },
  { value: "Europe/London", label: "(GMT+0) London" },
  { value: "America/New_York", label: "(GMT-5) New York" },
];

const LECTURE_LANGUAGES: Option[] = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

const SUBTITLE_STYLES: Option[] = [
  { value: "default", label: "Default" },
  { value: "large", label: "Large text" },
  { value: "contrast", label: "High contrast" },
];

type SettingsMainPageProps = {
  settings: SettingsState;
  isDirty: boolean;
  isDefault: boolean;
  justSaved: boolean;
  onUpdate: UpdateSetting;
  onReset: () => void;
  onSave: () => void;
};

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionIcon} aria-hidden="true">
          {icon}
        </span>
        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionDesc}>{description}</p>
        </div>
      </div>
      <div className={styles.rows}>{children}</div>
    </section>
  );
}

function SelectRow({
  id,
  icon,
  label,
  description,
  value,
  options,
  disabled = false,
  onChange,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  description: string;
  value: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className={`${styles.row} ${disabled ? styles.rowDisabled : ""}`}>
      <div className={styles.rowText}>
        <label htmlFor={id} className={styles.rowLabel}>
          {label}
        </label>
        <p id={`${id}-desc`} className={styles.rowDesc}>
          {description}
        </p>
      </div>
      <div className={styles.selectWrap}>
        <span className={styles.selectIcon} aria-hidden="true">
          {icon}
        </span>
        <select
          id={id}
          className={styles.select}
          value={value}
          disabled={disabled}
          aria-describedby={`${id}-desc`}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className={styles.selectChevron}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className={`${styles.row} ${disabled ? styles.rowDisabled : ""}`}>
      <div className={styles.rowText}>
        <span id={`${id}-label`} className={styles.rowLabel}>
          {label}
        </span>
        <p id={`${id}-desc`} className={styles.rowDesc}>
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        disabled={disabled}
        className={`${styles.switch} ${checked ? styles.switchOn : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.switchThumb} />
      </button>
    </div>
  );
}

export default function SettingsMainPage({
  settings,
  isDirty,
  isDefault,
  justSaved,
  onUpdate,
  onReset,
  onSave,
}: SettingsMainPageProps) {
  const bilingualDisabled = !settings.translation;
  const subtitleStyleDisabled =
    !settings.translation || !settings.bilingualSubtitles;

  return (
    <div className={styles.content}>
      <SettingsSection
        icon={<Settings size={19} />}
        title="General"
        description="Basic settings for your account and interface."
      >
        <SelectRow
          id="interface-language"
          icon={<Globe size={16} />}
          label="Interface language"
          description="Choose the language for the interface"
          value={settings.interfaceLanguage}
          options={INTERFACE_LANGUAGES}
          onChange={(value) => onUpdate("interfaceLanguage", value)}
        />
        <SelectRow
          id="time-zone"
          icon={<Clock size={16} />}
          label="Time zone"
          description="Set your local time zone"
          value={settings.timeZone}
          options={TIME_ZONES}
          onChange={(value) => onUpdate("timeZone", value)}
        />
      </SettingsSection>

      <SettingsSection
        icon={<Mic size={19} />}
        title="Lecture & Translation"
        description="Configure how the lecture and translation features work."
      >
        <SelectRow
          id="lecture-language"
          icon={<Languages size={16} />}
          label="Lecture language"
          description="Select the language for your lecture content"
          value={settings.lectureLanguage}
          options={LECTURE_LANGUAGES}
          onChange={(value) => onUpdate("lectureLanguage", value)}
        />
        <ToggleRow
          id="translation"
          label="Translation"
          description="Enable real-time translation during the session"
          checked={settings.translation}
          onChange={(checked) => onUpdate("translation", checked)}
        />
        <ToggleRow
          id="bilingual-subtitles"
          label="Show bilingual subtitles"
          description="Display both languages in the subtitles"
          checked={settings.bilingualSubtitles}
          disabled={bilingualDisabled}
          onChange={(checked) => onUpdate("bilingualSubtitles", checked)}
        />
        <SelectRow
          id="subtitle-style"
          icon={<Captions size={16} />}
          label="Subtitle display style"
          description="Choose the style for bilingual subtitles"
          value={settings.subtitleStyle}
          options={SUBTITLE_STYLES}
          disabled={subtitleStyleDisabled}
          onChange={(value) => onUpdate("subtitleStyle", value)}
        />
      </SettingsSection>

      <SettingsSection
        icon={<Lock size={19} />}
        title="Privacy"
        description="Manage your data and privacy settings."
      >
        <ToggleRow
          id="classroom-data"
          label="Classroom data"
          description="Allow the system to store classroom data for better experience"
          checked={settings.classroomData}
          onChange={(checked) => onUpdate("classroomData", checked)}
        />
        <ToggleRow
          id="audio-storage"
          label="Audio storage"
          description="Do not store original audio files for a long time"
          checked={settings.audioStorage}
          onChange={(checked) => onUpdate("audioStorage", checked)}
        />
        <ToggleRow
          id="data-usage"
          label="Data usage"
          description="Allow anonymous usage data for system improvement"
          checked={settings.dataUsage}
          onChange={(checked) => onUpdate("dataUsage", checked)}
        />
      </SettingsSection>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={onReset}
          disabled={isDefault}
        >
          Reset to default
        </button>

        <div className={styles.footerRight}>
          <span className={styles.saveStatus} role="status">
            {justSaved && (
              <>
                <Check size={15} aria-hidden="true" />
                Settings saved
              </>
            )}
          </span>
          <button
            type="button"
            className={styles.saveButton}
            onClick={onSave}
            disabled={!isDirty}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

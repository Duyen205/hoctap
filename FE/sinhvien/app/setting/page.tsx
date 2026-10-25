"use client";

import { useState } from "react";
import styles from "./setting.module.css";
import AccountMenu from "../account/AccountMenu";
import Layout from "../components/Layout";
import {
  Settings,
  Monitor,
  Lock,
  Globe,
  Languages,
  ChevronDown,
} from "lucide-react";

// TODO: lấy cài đặt thật của giảng viên từ API khi tích hợp thật, và gửi lên
// server khi bấm "Save changes" thay vì chỉ giữ trong state cục bộ.
type ToggleKey = "translation" | "bilingualSubtitles" | "anonymousQuestion" | "classroomData";

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingRowText}>
        <p className={styles.settingRowLabel}>{label}</p>
        <p className={styles.settingRowDesc}>{description}</p>
      </div>
      <div className={styles.settingRowControl}>{children}</div>
    </div>
  );
}

function SelectField({
  icon,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className={styles.selectControl}>
      <span className={styles.selectControlIcon}>{icon}</span>
      <select
        className={styles.selectControlInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className={styles.selectControlChevron} />
    </label>
  );
}

export default function SettingPage() {
const [teacherName, setTeacherName] = useState("");
  const [interfaceLanguage, setInterfaceLanguage] = useState("en");
  const [answerTranslation, setAnswerTranslation] = useState("both");

  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    translation: true,
    bilingualSubtitles: true,
    anonymousQuestion: true,
    classroomData: true,
  });

  function toggle(key: ToggleKey) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    // TODO: gửi toàn bộ state cài đặt lên server.
    console.log("Lưu cài đặt:", {
      interfaceLanguage,
      answerTranslation,
      ...toggles,
    });
  }

  function handleResetDefault() {
    setInterfaceLanguage("en");
    setAnswerTranslation("both");
    setToggles({
      translation: true,
      bilingualSubtitles: true,
      anonymousQuestion: true,
      classroomData: true,
    });
  }

  return (
    <Layout
      className={styles.page}
      bodyClassName={styles.body}
      mainClassName={styles.main}
      headerActions={
        <AccountMenu
            teacherName={teacherName}
            onSaveAccountInfo={(info) => {
              // TODO: gọi API cập nhật thông tin tài khoản thật ở đây
              console.log("Lưu thông tin tài khoản:", info);
              setTeacherName(info.username);
            }}
            onSubmitPasswordChange={(oldPassword, newPassword) => {
              // TODO: gọi API đổi mật khẩu thật ở đây
              console.log("Đổi mật khẩu:", { oldPassword, newPassword });
            }}
            onLogout={() => {
              // TODO: gọi API/logic đăng xuất thật
              console.log("Đăng xuất");
            }}
        />
      }
    >
          <div className={styles.mainScroll}>
            <div className={styles.settingsStack}>
            {/* ---------- General ---------- */}
            <section className={styles.settingCard}>
              <div className={styles.settingCardHeader}>
                <span className={styles.sectionIconWrap}>
                  <Settings size={16} />
                </span>
                <div>
                  <h2 className={styles.settingCardTitle}>General</h2>
                  <p className={styles.settingCardSubtitle}>
                    Basic settings for your account and interface.
                  </p>
                </div>
              </div>

              <SettingRow
                label="Interface language"
                description="Choose the language for the interface"
              >
                <SelectField
                  icon={<Globe size={14} />}
                  value={interfaceLanguage}
                  onChange={setInterfaceLanguage}
                  options={[
                    { value: "en", label: "English" },
                    { value: "vi", label: "Tiếng Việt" },
                  ]}
                />
              </SettingRow>
            </section>

            {/* ---------- Lecture & Translation ---------- */}
            <section className={styles.settingCard}>
              <div className={styles.settingCardHeader}>
                <span className={styles.sectionIconWrap}>
                  <Monitor size={16} />
                </span>
                <div>
                  <h2 className={styles.settingCardTitle}>
                    Lecture &amp; Translation
                  </h2>
                  <p className={styles.settingCardSubtitle}>
                    Adjust how the lecture content and translations are
                    displayed.
                  </p>
                </div>
              </div>

              <SettingRow
                label="Translation"
                description="Enable or disable translation for lecture content and answers."
              >
                <ToggleSwitch
                  checked={toggles.translation}
                  onChange={() => toggle("translation")}
                  label="Translation"
                />
              </SettingRow>

              <SettingRow
                label="Bilingual subtitles"
                description="Show both English and Vietnamese subtitles in real-time."
              >
                <ToggleSwitch
                  checked={toggles.bilingualSubtitles}
                  onChange={() => toggle("bilingualSubtitles")}
                  label="Bilingual subtitles"
                />
              </SettingRow>

              <SettingRow
                label="Answer translation"
                description="Choose how to display the lecturer's answers."
              >
                <SelectField
                  icon={<Languages size={14} />}
                  value={answerTranslation}
                  onChange={setAnswerTranslation}
                  options={[
                    { value: "both", label: "Both (English & Vietnamese)" },
                    { value: "en", label: "English only" },
                    { value: "vi", label: "Vietnamese only" },
                  ]}
                />
              </SettingRow>
            </section>

            {/* ---------- Privacy ---------- */}
            <section className={styles.settingCard}>
              <div className={styles.settingCardHeader}>
                <span className={styles.sectionIconWrap}>
                  <Lock size={16} />
                </span>
                <div>
                  <h2 className={styles.settingCardTitle}>Privacy</h2>
                  <p className={styles.settingCardSubtitle}>
                    Manage your data and privacy settings.
                  </p>
                </div>
              </div>

              <SettingRow
                label="Anonymous question"
                description="Keep your identity hidden when asking questions."
              >
                <ToggleSwitch
                  checked={toggles.anonymousQuestion}
                  onChange={() => toggle("anonymousQuestion")}
                  label="Anonymous question"
                />
              </SettingRow>

              <SettingRow
                label="Classroom data"
                description="Allow the system to process necessary data for better experience."
              >
                <ToggleSwitch
                  checked={toggles.classroomData}
                  onChange={() => toggle("classroomData")}
                  label="Classroom data"
                />
              </SettingRow>
            </section>
            </div>
          </div>

          {/* ---------- Footer hành động ---------- */}
          <div className={styles.settingsFooter}>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetDefault}
            >
              Reset to default
            </button>
            <button type="button" className={styles.saveBtn} onClick={handleSave}>
              Save changes
            </button>
          </div>
    </Layout>
  );
}
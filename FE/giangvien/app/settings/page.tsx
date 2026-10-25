"use client";

import { useEffect, useState } from "react";
import AccountMenu from "../account-logo/AccountMenu";
import Layout from "../components/Layout";
import SettingsMainPage from "./SettingsMainPage";
import styles from "./setting.module.css";
import type { SettingsState, UpdateSetting } from "./types";

const DEFAULT_SETTINGS: SettingsState = {
  interfaceLanguage: "en",
  timeZone: "Asia/Ho_Chi_Minh",
  lectureLanguage: "en",
  translation: true,
  bilingualSubtitles: true,
  subtitleStyle: "default",
  classroomData: true,
  audioStorage: true,
  dataUsage: false,
};

function isSameSettings(first: SettingsState, second: SettingsState) {
  return (Object.keys(first) as (keyof SettingsState)[]).every(
    (key) => first[key] === second[key],
  );
}

export default function SettingsPage() {
  const [teacherName, setTeacherName] = useState("");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] =
    useState<SettingsState>(DEFAULT_SETTINGS);
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = !isSameSettings(settings, savedSettings);
  const isDefault = isSameSettings(settings, DEFAULT_SETTINGS);

  useEffect(() => {
    if (!justSaved) return;
    const timer = window.setTimeout(() => setJustSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [justSaved]);

  const update: UpdateSetting = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setJustSaved(false);
  };

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    setJustSaved(false);
  }

  function handleSave() {
    console.log("Lưu cài đặt:", settings);
    setSavedSettings(settings);
    setJustSaved(true);
  }

  return (
    <Layout
      className={styles.page}
      mainClassName={styles.main}
      headerActions={
        <AccountMenu
          teacherName={teacherName}
          onSaveAccountInfo={(info) => {
            console.log("Lưu thông tin tài khoản:", info);
            setTeacherName(info.username);
          }}
          onSubmitPasswordChange={(oldPassword, newPassword) => {
            console.log("Đổi mật khẩu:", { oldPassword, newPassword });
          }}
          onLogout={() => console.log("Đăng xuất")}
        />
      }
    >
      <SettingsMainPage
        settings={settings}
        isDirty={isDirty}
        isDefault={isDefault}
        justSaved={justSaved}
        onUpdate={update}
        onReset={handleReset}
        onSave={handleSave}
      />
    </Layout>
  );
}

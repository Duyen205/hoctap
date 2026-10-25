"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import HomeDashboard from "./HomeDashboard";
import JoinClassFlow from "./JoinClassFlow";
import styles from "./home.module.css";
import type { ClassItem, ClassTab, JoinScreen } from "./types";

const loggedInUserName = "";
const classes: ClassItem[] = [];
const ROOM_ROUTE = "/room";
const WAITING_ROOM_ROUTE = "/waiting-room";
const MOCK_LIVE_CLASS_CODES = new Set(["C1SE.38", "LIVE-101"]);

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ClassTab>("ongoing");
  const [joinScreen, setJoinScreen] = useState<JoinScreen>("none");
  const [classCodeInput, setClassCodeInput] = useState("");
  const [nameInput, setNameInput] = useState(loggedInUserName);
  const [noAudio, setNoAudio] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  function goToRoom(code: string, name: string) {
    try {
      localStorage.setItem("user", JSON.stringify({ fullName: name }));
    } catch {
      // localStorage may be unavailable in restricted browser contexts.
    }
    const params = new URLSearchParams({ code, displayName: name });
    if (MOCK_LIVE_CLASS_CODES.has(code.toUpperCase())) {
      router.push(`${ROOM_ROUTE}?${params.toString()}`);
      return;
    }

    params.set("className", `Lớp ${code}`);
    params.set("scheduledTime", "Theo lịch học của giảng viên");
    router.push(`${WAITING_ROOM_ROUTE}?${params.toString()}`);
  }

  function handleJoinByCode() {
    if (!classCodeInput.trim() || !nameInput.trim()) return;
    console.log("Tham gia lớp:", {
      code: classCodeInput.trim(),
      name: nameInput.trim(),
    });
    goToRoom(classCodeInput.trim(), nameInput.trim());
  }

  function handleQrScanned() {
    if (isScanning) return;
    setIsScanning(true);
    const fallbackName = nameInput.trim() || loggedInUserName || "Sinh viên";
    goToRoom("QR-JOIN", fallbackName);
  }

  if (joinScreen !== "none") {
    return (
      <JoinClassFlow
        screen={joinScreen}
        classCode={classCodeInput}
        displayName={nameInput}
        noAudio={noAudio}
        noVideo={noVideo}
        isScanning={isScanning}
        onBack={() => setJoinScreen("none")}
        onClassCodeChange={setClassCodeInput}
        onDisplayNameChange={setNameInput}
        onNoAudioChange={setNoAudio}
        onNoVideoChange={setNoVideo}
        onJoin={handleJoinByCode}
        onQrScanned={handleQrScanned}
      />
    );
  }

  return (
    <Layout
      className={styles.page}
      bodyClassName={styles.body}
      mainClassName={styles.main}
    >
      <HomeDashboard
        activeTab={activeTab}
        classes={classes}
        onTabChange={setActiveTab}
        onJoinScreenChange={setJoinScreen}
      />
    </Layout>
  );
}

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../components/Layout";
import WaitingLobby, {
  type WaitingLobbyClassInfo,
} from "../home/WaitingLobby";
import styles from "../home/home.module.css";

function WaitingRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classInfo: WaitingLobbyClassInfo = {
    code: searchParams.get("code") || "UNKNOWN",
    className: searchParams.get("className") || "Lớp học",
    displayName: searchParams.get("displayName") || "Sinh viên",
    scheduledTime:
      searchParams.get("scheduledTime") || "Theo lịch học của giảng viên",
  };

  return (
    <Layout
      className={styles.page}
      bodyClassName={styles.body}
      mainClassName={styles.main}
    >
      <WaitingLobby
        classInfo={classInfo}
        onLeave={() => router.push("/home")}
      />
    </Layout>
  );
}

export default function WaitingRoomPage() {
  return (
    <Suspense fallback={null}>
      <WaitingRoomContent />
    </Suspense>
  );
}

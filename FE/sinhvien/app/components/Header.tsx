"use client";

import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import styles from "./layout.module.css";

type HeaderProps = {
  actions?: ReactNode;
};

export default function Header({ actions }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Image src="/Ai.png" alt="ClassBridge" width={32} height={32} priority />
        <span>ClassBridge</span>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.notificationButton}
          aria-label="Thông báo"
        >
          <Bell size={18} />
        </button>
        {actions ?? <span className={styles.avatarPlaceholder} aria-hidden="true" />}
      </div>
    </header>
  );
}

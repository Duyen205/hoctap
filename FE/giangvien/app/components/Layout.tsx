"use client";

import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";
import FloatingChat from "./floating-chat/FloatingChat";

type LayoutProps = {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
  headerActions?: ReactNode;
  brandHref?: string;
};

export default function Layout({
  children,
  className,
  mainClassName,
  headerActions,
  brandHref,
}: LayoutProps) {
  return (
    <>
      <div className={`${styles.layout} ${className ?? ""}`}>
        <Header brandHref={brandHref}>{headerActions}</Header>
        <div className={styles.body}>
          <Sidebar />
          <main className={`${styles.main} ${mainClassName ?? ""}`}>
            {children}
          </main>
        </div>
      </div>
      <FloatingChat audience="lecturer" />
    </>
  );
}

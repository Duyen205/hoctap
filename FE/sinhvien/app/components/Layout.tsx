"use client";

import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./layout.module.css";
import FloatingChat from "./floating-chat/FloatingChat";

type LayoutProps = {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  mainClassName?: string;
  headerActions?: ReactNode;
};

export default function Layout({
  children,
  className = "",
  bodyClassName = "",
  mainClassName = "",
  headerActions,
}: LayoutProps) {
  return (
    <>
      <div className={`${styles.layout} ${className}`}>
        <Header actions={headerActions} />
        <div className={`${styles.body} ${bodyClassName}`}>
          <Sidebar />
          <main className={`${styles.main} ${mainClassName}`}>{children}</main>
        </div>
      </div>
      <FloatingChat audience="student" />
    </>
  );
}

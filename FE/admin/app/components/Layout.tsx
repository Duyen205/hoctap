import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: ReactNode;
  mainClassName?: string;
  language?: "EN" | "VI";
  onLanguageChange?: (language: "EN" | "VI") => void;
  adminName?: string;
  onLogout?: () => void;
};

export default function Layout({
  children,
  mainClassName,
  language = "EN",
  onLanguageChange = () => {},
  adminName = "Admin",
  onLogout = () => {},
}: LayoutProps) {
  return (
    <div className={styles.layout}>
      {/* 1. Header tràn toàn bộ chiều rộng (100% width) ở trên cùng */}
      <Header
        language={language}
        onLanguageChange={onLanguageChange}
        adminName={adminName}
        onLogout={onLogout}
      />

      {/* 2. Phần thân gồm Sidebar bên trái và Main Content bên phải */}
      <div className={styles.body}>
        <Sidebar />
        <main className={`${styles.main} ${mainClassName ?? ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
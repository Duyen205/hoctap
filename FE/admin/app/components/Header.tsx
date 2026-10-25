"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Globe, ChevronDown, Search, GraduationCap } from "lucide-react";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
  language: "EN" | "VI";
  onLanguageChange: (language: "EN" | "VI") => void;
  adminName: string;
  onLogout: () => void;
};

export default function Header({
  language,
  onLanguageChange,
  adminName,
  onLogout,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<"language" | "profile" | null>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerActionsRef.current &&
        !headerActionsRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      {/* Góc trái: Logo & Tên web ClassBridge */}
      <Link href="/" className={styles.brand}>
        <span className={styles.logoIcon}>
          <GraduationCap size={20} />
        </span>
        <span className={styles.logoText}>ClassBridge</span>
      </Link>

      {/* Ở giữa: Ô tìm kiếm */}
      <label className={styles.searchBox}>
        <Search size={16} />
        <input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      {/* Góc phải: Thông báo ➔ Ngôn ngữ ➔ Tài khoản */}
      <div className={styles.actions} ref={headerActionsRef}>
        {/* 1. Nút thông báo */}
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* 2. Chuyển ngôn ngữ Anh / Việt */}
        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() =>
              setOpenMenu((current) =>
                current === "language" ? null : "language",
              )
            }
          >
            <Globe size={15} />
            <span>{language}</span>
            <ChevronDown size={13} />
          </button>
          {openMenu === "language" && (
            <div className={styles.dropdownMenu}>
              {(["EN", "VI"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.dropdownItem} ${
                    language === item ? styles.dropdownItemActive : ""
                  }`}
                  onClick={() => {
                    onLanguageChange(item);
                    setOpenMenu(null);
                  }}
                >
                  {item === "EN" ? "English" : "Tiếng Việt"}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className={styles.divider} />

        {/* 3. Logo / Menu tài khoản (Account Menu) */}
        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() =>
              setOpenMenu((current) =>
                current === "profile" ? null : "profile",
              )
            }
          >
            <span className={styles.avatar}>
              {(adminName || "A").slice(0, 1).toUpperCase()}
            </span>
            <span className={styles.profileName}>{adminName || "Admin"}</span>
            <ChevronDown size={13} />
          </button>
          {openMenu === "profile" && (
            <div className={styles.dropdownMenu}>
              <button type="button" className={styles.dropdownItem}>
                Profile
              </button>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={onLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

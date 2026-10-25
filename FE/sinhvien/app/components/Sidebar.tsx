"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Home,
  MessageSquare,
  Radio,
  Settings,
} from "lucide-react";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "My class", href: "/my-class", icon: BookOpen },
  { label: "Lịch học", href: "/schedule", icon: CalendarDays },
  { label: "Live lessons", href: "/live-lession", icon: Radio },
  { label: "Question grouping", href: "/question", icon: MessageSquare },
  { label: "Lesson Summary", href: "/summary", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navigation} aria-label="Điều hướng chính">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/my-class"
              ? pathname.startsWith(href)
              : pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
        <div className={styles.sidebarDivider}>
          <Link
            href="/setting"
            className={`${styles.navItem} ${pathname === "/setting" ? styles.navItemActive : ""}`}
            aria-current={pathname === "/setting" ? "page" : undefined}
          >
            <Settings size={18} />
            <span>Setting</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}

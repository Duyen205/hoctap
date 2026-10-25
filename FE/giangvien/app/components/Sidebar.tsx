"use client";

import {
  Home,
  Radio,
  Users,
  BookOpen,
  LayoutGrid,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Live Session", href: "/room", icon: Radio },
  { label: "Class management", href: "/classmanagement", icon: Users },
  { label: "Question grouping", href: "/question", icon: LayoutGrid },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navMenu} aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={`${styles.navItem} ${
              pathname === href ? styles.navItemActive : ""
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
        <div className={styles.sidebarDivider}>
          <Link
            href="/settings"
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={`${styles.navItem} ${
              pathname === "/settings" ? styles.navItemActive : ""
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
"use client";

import { useState } from "react";
import styles from "./home.module.css";
import Link from 'next/link';
import {
  GraduationCap,
  Home,
  BookOpen,
  MessageSquare,
  FileText,
  BarChart2,
  Settings,
  Search,
  Plus,
  Calendar,
  Video,
  FileEdit,
  Bell,
  CalendarDays,
  Radio,
  ChevronDown,
  ChevronRight,
  X,
  PhoneOff,
  Mic,
  Monitor,
  Users,
  CameraIcon,
  Hash,
} from "lucide-react";

// Kiểu dữ liệu 1 lớp học (dành cho giảng viên)
type ClassItem = {
  id: string;
  code: string;
  name: string;
  date: string;
  time: string;
  status: "ongoing" | "upcoming"; // ongoing = đang diễn ra, upcoming = sắp diễn ra
  studentCount: number; // số sinh viên
  groupCount: number; // số nhóm câu hỏi
};

// TODO: thay bằng dữ liệu thật lấy từ API sau này
const teacherName = "";
const classes: ClassItem[] = [];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing");

  const ongoingClasses = classes.filter((c) => c.status === "ongoing");
  const upcomingClasses = classes.filter((c) => c.status === "upcoming");
  const visibleClasses = activeTab === "ongoing" ? ongoingClasses : upcomingClasses;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
        <Link href="/home" className={styles.logoLink}>
            <span className={styles.logoText}>
              <img src="/Ai.png" alt="Logo" /> ClassBridge
            </span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.navItemActive}`}>
            <Home size={18} /> Trang chủ
          </button>
          <button className={styles.navItem}>
            <Plus size={18} /> Tạo lớp học
          </button>
          <button className={styles.navItem}>
            <BookOpen size={18} /> Lớp học của tôi
          </button>
          <button className={styles.navItem}>
            <BarChart2 size={18} /> Thống kê
          </button>
          <button className={styles.navItem}>
            <Settings size={18} /> Cài đặt
          </button>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className={styles.main}>
        {/* Thanh trên cùng */}
        <div className={styles.topbar}>
          <button className={styles.bellButton}>
            <Bell size={18} />
          </button>
          <div className={styles.avatar}>DR</div>
        </div>

        {/* Lời chào */}
        <h1 className={styles.greetingTitle}>Xin chào, {teacherName}! 👋</h1>
        <p className={styles.greetingSubtitle}>
          Quản lý lớp học và theo dõi tiến độ các sinh viên.
        </p>

        {/* Nút tạo lớp học */}
        <Link href="/createroom" className={styles.createClassBtn}>
          <Plus size={18} /> Tạo lớp học
        </Link>

        {/* Danh sách lớp học */}
        <div className={styles.classBox}>
          <div className={styles.classBoxHeader}>
            <h2 className={styles.sectionTitle}>Lớp học của tôi</h2>
            <a href="#" className={styles.viewAll}>
              Xem tất cả
            </a>
          </div>

          {/* Tab */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "ongoing" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("ongoing")}
            >
              Đang diễn ra ({ongoingClasses.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Sắp tới ({upcomingClasses.length})
            </button>
          </div>

          {/* Danh sách */}
          {visibleClasses.length === 0 && (
            <p className={styles.emptyText}>Chưa có dữ liệu lớp học.</p>
          )}

          {visibleClasses.map((c) => (
            <div key={c.id} className={styles.classCard}>
              <div className={styles.classCardTop}>
                <span className={styles.classIcon}>
                  <BookOpen size={18} />
                </span>

                <div className={styles.classInfo}>
                  <div className={styles.classTitle}>
                    {c.code} - {c.name}
                  </div>
                  <div className={styles.classMeta}>
                    {c.date} · {c.time}
                  </div>
                </div>

                <span
                  className={
                    c.status === "ongoing" ? styles.statusOngoing : styles.statusUpcoming
                  }
                >
                  {c.status === "ongoing" ? "Đang diễn ra" : "Sắp diễn ra"}
                </span>
              </div>

              <div className={styles.classStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{c.studentCount}</div>
                  <div className={styles.statLabel}>Sinh viên</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{c.groupCount}</div>
                  <div className={styles.statLabel}>Nhóm câu hỏi</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
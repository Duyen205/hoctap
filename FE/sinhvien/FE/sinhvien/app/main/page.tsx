"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./dashboard.module.css";
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
  ArrowLeft,
  X,
  PhoneOff,
  Mic,
  Monitor,
  Users,
  CameraIcon,
  Hash,
} from "lucide-react";

// Kiểu dữ liệu 1 lớp học
type ClassItem = {
  id: string;
  code: string;
  name: string;
  instructor: string;
  time: string;
  date: string;
  status: "ongoing" | "upcoming"; // ongoing = đang diễn ra, upcoming = sắp diễn ra
};

// TODO: lấy tên người dùng thật từ session/login khi tích hợp thật
const studentName = "";
// TODO: hệ thống lấy tên đăng nhập thật của người dùng để tự điền vào ô "Tên của bạn"
const loggedInUserName = "";
const classes: ClassItem[] = [];

// Màn hình tham gia lớp học đang hiển thị (ngoài trang chủ)
type JoinScreen = "none" | "scanQr" | "enterCode";

export default function StudentDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing");
  const [currentView, setCurrentView] = useState<
    "dashboard" | "meeting" | "live"
  >("dashboard");

  // Màn hình tham gia lớp học (quét QR / nhập mã) — chồng lên trên dashboard
  const [joinScreen, setJoinScreen] = useState<JoinScreen>("none");
  const [classCodeInput, setClassCodeInput] = useState("");
  const [nameInput, setNameInput] = useState(loggedInUserName);
  const [noAudio, setNoAudio] = useState(false);
  const [noVideo, setNoVideo] = useState(false);

  const ongoingClasses = classes.filter((c) => c.status === "ongoing");
  const upcomingClasses = classes.filter((c) => c.status === "upcoming");
  const visibleClasses =
    activeTab === "ongoing" ? ongoingClasses : upcomingClasses;
  const NAV_ITEMS = [
    { label: "Home", href: "/main", icon: Home },
    { label: "My lessons", href: "/lesson", icon: BookOpen },
    { label: "Question grouping", href: "/question", icon: MessageSquare },
    { label: "Lesson Summary", href: "/summary", icon: FileText },
    { label: "Report", href: "/report", icon: BarChart2 },
  ];

  const SETTING_NAV_ITEM = {
    label: "Setting",
    href: "/setting",
    icon: Settings,
  };

  function handleJoinByCode() {
    if (!classCodeInput.trim() || !nameInput.trim()) return;
    console.log("Tham gia lớp:", {
      code: classCodeInput.trim(),
      name: nameInput.trim(),
    });
  }

  if (joinScreen === "scanQr") {
    return (
      <div className={styles.page}>
        <div className={styles.joinScreen}>
          <button
            className={styles.backButton}
            onClick={() => setJoinScreen("none")}
          >
            <ArrowLeft size={18} /> Quay lại
          </button>

          <h1 className={styles.joinScreenTitle}>Quét mã QR</h1>

          <div className={styles.scanBox}>
            <span className={`${styles.scanCorner} ${styles.scanCornerTL}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerTR}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerBL}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerBR}`} />
            <div className={styles.scanCameraCircle}>
              <CameraIcon />
            </div>
          </div>

          <p className={styles.scanHint}>Đưa mã QR vào khung hình</p>
        </div>
      </div>
    );
  }
  if (joinScreen === "enterCode") {
    return (
      <div className={styles.page}>
        <div className={styles.joinScreen}>
          <div className={styles.modalCard}>
            <div className={styles.modalTopBar}>
              <span className={styles.modalTopBarBrand}>
                <img
                  src="/Ai.png"
                  alt="Logo"
                  className={styles.modalTopBarLogo}
                />{" "}
                ClassBridge
              </span>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setJoinScreen("none")}
              >
                <X size={16} />
              </button>
            </div>

            <h1 className={styles.modalTitle}>Nhập mã lớp</h1>

            {/* Mã lớp học */}
            <div className={styles.selectField}>
              <Hash size={16} className={styles.selectFieldIcon} />
              <input
                type="text"
                className={styles.selectFieldInput}
                placeholder="Nhập mã lớp học"
                value={classCodeInput}
                onChange={(e) =>
                  setClassCodeInput(e.target.value.toUpperCase())
                }
              />
              <ChevronDown size={16} className={styles.selectFieldChevron} />
            </div>

            <div className={styles.nameField}>
              <span className={styles.nameFieldLabel}>Tên của bạn</span>
              <input
                type="text"
                className={styles.nameFieldInput}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>

            {/* Tuỳ chọn âm thanh / video khi vào lớp */}
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={noAudio}
                onChange={(e) => setNoAudio(e.target.checked)}
              />
              Không kết nối âm thanh
            </label>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={noVideo}
                onChange={(e) => setNoVideo(e.target.checked)}
              />
              Tắt video của tôi
            </label>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setJoinScreen("none")}
              >
                Hủy
              </button>
              <button
                className={styles.joinBtn}
                disabled={!classCodeInput.trim() || !nameInput.trim()}
                onClick={handleJoinByCode}
              >
                Tham gia
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.logoArea}>
          <span className={styles.logoText}>
            <img src="/Ai.png" alt="Logo" /> ClassBridge
          </span>
        </div>

        <div className={styles.topbarActions}>
          <button className={styles.bellButton}>🔔</button>
          <div className={styles.avatar}></div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
            <div className={styles.sidebarDivider}>
              <button
                type="button"
                onClick={() => router.push(SETTING_NAV_ITEM.href)}
                className={`${styles.navItem} ${
                  pathname === SETTING_NAV_ITEM.href ? styles.navItemActive : ""
                }`}
              >
                <SETTING_NAV_ITEM.icon size={18} />
                <span>{SETTING_NAV_ITEM.label}</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Nội dung chính */}
        <main className={styles.main}>
          {/* Lời chào */}
          <h1 className={styles.greetingTitle}>Xin chào, {studentName}!</h1>
          <p className={styles.greetingSubtitle}>
            Tham gia lớp học để bắt đầu hành trình học tập cùng ClassBridge.
          </p>

          {/* Tham gia lớp học */}
          <h2 className={styles.sectionTitle}>Tham gia lớp học</h2>
          <div className={styles.joinGrid}>
            <button
              className={styles.joinCardPrimary}
              onClick={() => setJoinScreen("scanQr")}
            >
              <span className={styles.joinIconWrap}>
                <CameraIcon />
              </span>
              <div className={styles.joinTitle}>Quét mã QR</div>
              <div className={styles.joinSubtitle}>
                Dùng camera để quét mã lớp
              </div>
            </button>

            <button
              className={styles.joinCard}
              onClick={() => setJoinScreen("enterCode")}
            >
              <span className={styles.joinIconWrap}>
                <Hash />
              </span>
              <div className={styles.joinTitle}>Nhập mã lớp</div>
              <div className={styles.joinSubtitle}>
                Nhập mã lớp do giảng viên cung cấp
              </div>
            </button>
          </div>

          {/* Danh sách lớp học */}
          <div className={styles.classBox}>
            <div className={styles.classBoxHeader}>
              <h2 className={styles.sectionTitle}>Các lớp học của tôi</h2>
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
                <span className={styles.classIcon}>📘</span>

                <div className={styles.classInfo}>
                  <div className={styles.classTitle}>
                    {c.code} - {c.name}
                  </div>
                  <div className={styles.classInstructor}>{c.instructor}</div>
                  <div className={styles.classMeta}>
                    {c.time} · {c.date}
                  </div>
                </div>

                <span
                  className={
                    c.status === "ongoing"
                      ? styles.statusOngoing
                      : styles.statusUpcoming
                  }
                >
                  {c.status === "ongoing" ? "Đang diễn ra" : "Sắp diễn ra"}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

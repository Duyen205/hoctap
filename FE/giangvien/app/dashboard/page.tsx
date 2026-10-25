"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import {
  CalendarDays,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Check,
  TrendingUp,
  RotateCcw,
  BarChart3,
  Calendar,
} from "lucide-react";

import AccountMenu from "../account-logo/AccountMenu";
import Layout from "../components/Layout";

const lecturer = { name: "Dr. Nguyen Van A", role: "Lecturer" };

type MetricKey =
  | "totalClasses"
  | "totalQuestions"
  | "questionGroups"
  | "studentsActive"
  | "avgResponseTime"
  | null;

type ClassOption = { id: string; label: string };
const CLASS_OPTIONS: ClassOption[] = [
  { id: "all", label: "Tất cả các lớp (Overview)" },
  { id: "cs101", label: "AI in Education (CS101)" },
  { id: "se305", label: "Software Testing (SE305)" },
  { id: "db210", label: "Database Systems (DB210)" },
];

type TimeRangeMode = "session" | "week" | "month";

type Trend = {
  direction: "up" | "down";
  value: string;
  positive: boolean;
};

type StatCardData = {
  key: MetricKey;
  label: string;
  value: string;
  trend: Trend;
  unit?: string;
  color: string;
};

type ConfusionPoint = {
  id: string;
  title: string;
  count: number;
};

type RecentQuestion = {
  id: string;
  text: string;
  secondaryText?: string;
  group: string;
  timeAgo: string;
};

// Dữ liệu hỗ trợ đa dạng theo các chế độ thời gian (Session, Week, Month)
const DASHBOARD_DATA_BY_CLASS: Record<
  string,
  {
    stats: StatCardData[];
    confusionPoints: ConfusionPoint[];
    recentQuestions: RecentQuestion[];
    chartsByMode: Record<TimeRangeMode, Record<string, { time: string; val: number }[]>>;
    breakdown: { label: string; count: number; percentage: number; color: string }[];
  }
> = {
  all: {
    stats: [
      { key: "totalClasses", label: "Total Classes", value: "3", trend: { direction: "up", value: "1", positive: true }, color: "#8b5cf6" },
      { key: "totalQuestions", label: "Total Questions", value: "142", trend: { direction: "up", value: "15%", positive: true }, color: "#2563eb" },
      { key: "questionGroups", label: "Question Groups", value: "24", trend: { direction: "up", value: "8%", positive: true }, color: "#ec4899" },
      { key: "studentsActive", label: "Students Active", value: "118", trend: { direction: "up", value: "12%", positive: true }, color: "#10b981" },
      { key: "avgResponseTime", label: "Avg. Response Time", value: "2.1s", trend: { direction: "down", value: "25%", positive: true }, unit: "s", color: "#f59e0b" },
    ],
    confusionPoints: [
      { id: "cp-all-1", title: "Machine Learning vs Deep Learning", count: 35 },
      { id: "cp-all-2", title: "Automated Testing Frameworks", count: 28 },
      { id: "cp-all-3", title: "SQL Normalization Forms", count: 22 },
    ],
    recentQuestions: [
      { id: "q-1", text: "What is the difference between supervised and unsupervised learning?", group: "AI Group 1", timeAgo: "2m ago" },
      { id: "q-2", text: "Làm thế nào để viết Unit Test hiệu quả với Jest?", secondaryText: "How to write effective unit tests with Jest?", group: "Testing Group 2", timeAgo: "5m ago" },
    ],
    chartsByMode: {
      session: {
        totalClasses: [{ time: "S1", val: 1 }, { time: "S2", val: 2 }, { time: "S3", val: 3 }, { time: "S4", val: 3 }],
        totalQuestions: [{ time: "S1", val: 20 }, { time: "S2", val: 45 }, { time: "S3", val: 85 }, { time: "S4", val: 142 }],
        questionGroups: [{ time: "S1", val: 4 }, { time: "S2", val: 9 }, { time: "S3", val: 16 }, { time: "S4", val: 24 }],
        studentsActive: [{ time: "S1", val: 30 }, { time: "S2", val: 65 }, { time: "S3", val: 92 }, { time: "S4", val: 118 }],
        avgResponseTime: [{ time: "S1", val: 3.5 }, { time: "S2", val: 2.9 }, { time: "S3", val: 2.4 }, { time: "S4", val: 2.1 }],
      },
      week: {
        totalClasses: [{ time: "W1", val: 2 }, { time: "W2", val: 3 }, { time: "W3", val: 3 }, { time: "W4", val: 3 }],
        totalQuestions: [{ time: "W1", val: 35 }, { time: "W2", val: 70 }, { time: "W3", val: 110 }, { time: "W4", val: 142 }],
        questionGroups: [{ time: "W1", val: 6 }, { time: "W2", val: 12 }, { time: "W3", val: 18 }, { time: "W4", val: 24 }],
        studentsActive: [{ time: "W1", val: 45 }, { time: "W2", val: 80 }, { time: "W3", val: 105 }, { time: "W4", val: 118 }],
        avgResponseTime: [{ time: "W1", val: 3.2 }, { time: "W2", val: 2.7 }, { time: "W3", val: 2.3 }, { time: "W4", val: 2.1 }],
      },
      month: {
        totalClasses: [{ time: "Tháng 8", val: 3 }, { time: "Tháng 9", val: 3 }, { time: "Tháng 10", val: 3 }],
        totalQuestions: [{ time: "Tháng 8", val: 40 }, { time: "Tháng 9", val: 95 }, { time: "Tháng 10", val: 142 }],
        questionGroups: [{ time: "Tháng 8", val: 8 }, { time: "Tháng 9", val: 16 }, { time: "Tháng 10", val: 24 }],
        studentsActive: [{ time: "Tháng 8", val: 60 }, { time: "Tháng 9", val: 98 }, { time: "Tháng 10", val: 118 }],
        avgResponseTime: [{ time: "Tháng 8", val: 2.8 }, { time: "Tháng 9", val: 2.3 }, { time: "Tháng 10", val: 2.1 }],
      },
    },
    breakdown: [
      { label: "CS101 (AI in Education)", count: 58, percentage: 41, color: "#2563eb" },
      { label: "SE305 (Software Testing)", count: 46, percentage: 32, color: "#10b981" },
      { label: "DB210 (Database Systems)", count: 38, percentage: 27, color: "#8b5cf6" },
    ],
  },
  cs101: {
    stats: [
      { key: "totalClasses", label: "Class Sessions", value: "12", trend: { direction: "up", value: "2", positive: true }, color: "#8b5cf6" },
      { key: "totalQuestions", label: "Total Questions", value: "48", trend: { direction: "up", value: "12%", positive: true }, color: "#2563eb" },
      { key: "questionGroups", label: "Question Groups", value: "8", trend: { direction: "down", value: "33%", positive: false }, color: "#ec4899" },
      { key: "studentsActive", label: "Students Active", value: "42", trend: { direction: "up", value: "5%", positive: true }, color: "#10b981" },
      { key: "avgResponseTime", label: "Avg. Response Time", value: "2.3s", trend: { direction: "down", value: "40%", positive: true }, unit: "s", color: "#f59e0b" },
    ],
    confusionPoints: [{ id: "cs-1", title: "Machine Learning vs Deep Learning", count: 12 }],
    recentQuestions: [{ id: "cs-q1", text: "What is the difference between supervised and unsupervised learning?", group: "Group 1", timeAgo: "2m ago" }],
    chartsByMode: {
      session: {
        totalClasses: [{ time: "S1", val: 3 }, { time: "S2", val: 6 }, { time: "S3", val: 9 }, { time: "S4", val: 12 }],
        totalQuestions: [{ time: "S1", val: 8 }, { time: "S2", val: 15 }, { time: "S3", val: 30 }, { time: "S4", val: 48 }],
        questionGroups: [{ time: "S1", val: 2 }, { time: "S2", val: 4 }, { time: "S3", val: 6 }, { time: "S4", val: 8 }],
        studentsActive: [{ time: "S1", val: 20 }, { time: "S2", val: 30 }, { time: "S3", val: 38 }, { time: "S4", val: 42 }],
        avgResponseTime: [{ time: "S1", val: 3.1 }, { time: "S2", val: 2.8 }, { time: "S3", val: 2.5 }, { time: "S4", val: 2.3 }],
      },
      week: {
        totalClasses: [{ time: "W1", val: 4 }, { time: "W2", val: 8 }, { time: "W3", val: 12 }],
        totalQuestions: [{ time: "W1", val: 12 }, { time: "W2", val: 28 }, { time: "W3", val: 48 }],
        questionGroups: [{ time: "W1", val: 3 }, { time: "W2", val: 6 }, { time: "W3", val: 8 }],
        studentsActive: [{ time: "W1", val: 25 }, { time: "W2", val: 36 }, { time: "W3", val: 42 }],
        avgResponseTime: [{ time: "W1", val: 3.0 }, { time: "W2", val: 2.5 }, { time: "W3", val: 2.3 }],
      },
      month: {
        totalClasses: [{ time: "Tháng 8", val: 4 }, { time: "Tháng 9", val: 4 }, { time: "Tháng 10", val: 4 }],
        totalQuestions: [{ time: "Tháng 8", val: 10 }, { time: "Tháng 9", val: 25 }, { time: "Tháng 10", val: 48 }],
        questionGroups: [{ time: "Tháng 8", val: 3 }, { time: "Tháng 9", val: 6 }, { time: "Tháng 10", val: 8 }],
        studentsActive: [{ time: "Tháng 8", val: 22 }, { time: "Tháng 9", val: 35 }, { time: "Tháng 10", val: 42 }],
        avgResponseTime: [{ time: "Tháng 8", val: 2.9 }, { time: "Tháng 9", val: 2.5 }, { time: "Tháng 10", val: 2.3 }],
      },
    },
    breakdown: [
      { label: "Group 1 (Deep Learning)", count: 20, percentage: 42, color: "#2563eb" },
      { label: "Group 2 (Neural Networks)", count: 16, percentage: 33, color: "#10b981" },
      { label: "Group 3 (Python Basics)", count: 12, percentage: 25, color: "#f59e0b" },
    ],
  },
  se305: {
    stats: [
      { key: "totalClasses", label: "Class Sessions", value: "10", trend: { direction: "up", value: "1", positive: true }, color: "#8b5cf6" },
      { key: "totalQuestions", label: "Total Questions", value: "56", trend: { direction: "up", value: "18%", positive: true }, color: "#2563eb" },
      { key: "questionGroups", label: "Question Groups", value: "10", trend: { direction: "up", value: "20%", positive: true }, color: "#ec4899" },
      { key: "studentsActive", label: "Students Active", value: "45", trend: { direction: "up", value: "10%", positive: true }, color: "#10b981" },
      { key: "avgResponseTime", label: "Avg. Response Time", value: "1.9s", trend: { direction: "down", value: "15%", positive: true }, unit: "s", color: "#f59e0b" },
    ],
    confusionPoints: [{ id: "se-1", title: "Black-box vs White-box Testing", count: 15 }],
    recentQuestions: [{ id: "se-q1", text: "Khi nào nên áp dụng Boundary Value Analysis?", group: "Group A", timeAgo: "3m ago" }],
    chartsByMode: {
      session: {
        totalClasses: [{ time: "S1", val: 2 }, { time: "S2", val: 5 }, { time: "S3", val: 8 }, { time: "S4", val: 10 }],
        totalQuestions: [{ time: "S1", val: 10 }, { time: "S2", val: 22 }, { time: "S3", val: 38 }, { time: "S4", val: 56 }],
        questionGroups: [{ time: "S1", val: 3 }, { time: "S2", val: 5 }, { time: "S3", val: 8 }, { time: "S4", val: 10 }],
        studentsActive: [{ time: "S1", val: 25 }, { time: "S2", val: 32 }, { time: "S3", val: 40 }, { time: "S4", val: 45 }],
        avgResponseTime: [{ time: "S1", val: 2.5 }, { time: "S2", val: 2.2 }, { time: "S3", val: 2.0 }, { time: "S4", val: 1.9 }],
      },
      week: {
        totalClasses: [{ time: "W1", val: 3 }, { time: "W2", val: 6 }, { time: "W3", val: 10 }],
        totalQuestions: [{ time: "W1", val: 15 }, { time: "W2", val: 35 }, { time: "W3", val: 56 }],
        questionGroups: [{ time: "W1", val: 4 }, { time: "W2", val: 7 }, { time: "W3", val: 10 }],
        studentsActive: [{ time: "W1", val: 30 }, { time: "W2", val: 38 }, { time: "W3", val: 45 }],
        avgResponseTime: [{ time: "W1", val: 2.4 }, { time: "W2", val: 2.1 }, { time: "W3", val: 1.9 }],
      },
      month: {
        totalClasses: [{ time: "Tháng 8", val: 3 }, { time: "Tháng 9", val: 4 }, { time: "Tháng 10", val: 3 }],
        totalQuestions: [{ time: "Tháng 8", val: 12 }, { time: "Tháng 9", val: 30 }, { time: "Tháng 10", val: 56 }],
        questionGroups: [{ time: "Tháng 8", val: 3 }, { time: "Tháng 9", val: 6 }, { time: "Tháng 10", val: 10 }],
        studentsActive: [{ time: "Tháng 8", val: 25 }, { time: "Tháng 9", val: 38 }, { time: "Tháng 10", val: 45 }],
        avgResponseTime: [{ time: "Tháng 8", val: 2.3 }, { time: "Tháng 9", val: 2.0 }, { time: "Tháng 10", val: 1.9 }],
      },
    },
    breakdown: [
      { label: "Unit Testing (Jest)", count: 26, percentage: 46, color: "#2563eb" },
      { label: "Integration Testing", count: 18, percentage: 32, color: "#10b981" },
      { label: "Selenium Automation", count: 12, percentage: 22, color: "#ec4899" },
    ],
  },
  db210: {
    stats: [
      { key: "totalClasses", label: "Class Sessions", value: "8", trend: { direction: "down", value: "1", positive: false }, color: "#8b5cf6" },
      { key: "totalQuestions", label: "Total Questions", value: "38", trend: { direction: "down", value: "5%", positive: false }, color: "#2563eb" },
      { key: "questionGroups", label: "Question Groups", value: "6", trend: { direction: "down", value: "10%", positive: false }, color: "#ec4899" },
      { key: "studentsActive", label: "Students Active", value: "31", trend: { direction: "up", value: "2%", positive: true }, color: "#10b981" },
      { key: "avgResponseTime", label: "Avg. Response Time", value: "2.4s", trend: { direction: "up", value: "5%", positive: false }, unit: "s", color: "#f59e0b" },
    ],
    confusionPoints: [{ id: "db-1", title: "Third Normal Form (3NF)", count: 14 }],
    recentQuestions: [{ id: "db-q1", text: "Transaction isolation levels hoạt động như thế nào?", group: "Team 1", timeAgo: "10m ago" }],
    chartsByMode: {
      session: {
        totalClasses: [{ time: "S1", val: 2 }, { time: "S2", val: 4 }, { time: "S3", val: 6 }, { time: "S4", val: 8 }],
        totalQuestions: [{ time: "S1", val: 6 }, { time: "S2", val: 14 }, { time: "S3", val: 24 }, { time: "S4", val: 38 }],
        questionGroups: [{ time: "S1", val: 1 }, { time: "S2", val: 3 }, { time: "S3", val: 4 }, { time: "S4", val: 6 }],
        studentsActive: [{ time: "S1", val: 18 }, { time: "S2", val: 24 }, { time: "S3", val: 28 }, { time: "S4", val: 31 }],
        avgResponseTime: [{ time: "S1", val: 2.8 }, { time: "S2", val: 2.6 }, { time: "S3", val: 2.5 }, { time: "S4", val: 2.4 }],
      },
      week: {
        totalClasses: [{ time: "W1", val: 2 }, { time: "W2", val: 5 }, { time: "W3", val: 8 }],
        totalQuestions: [{ time: "W1", val: 10 }, { time: "W2", val: 22 }, { time: "W3", val: 38 }],
        questionGroups: [{ time: "W1", val: 2 }, { time: "W2", val: 4 }, { time: "W3", val: 6 }],
        studentsActive: [{ time: "W1", val: 20 }, { time: "W2", val: 26 }, { time: "W3", val: 31 }],
        avgResponseTime: [{ time: "W1", val: 2.7 }, { time: "W2", val: 2.5 }, { time: "W3", val: 2.4 }],
      },
      month: {
        totalClasses: [{ time: "Tháng 8", val: 2 }, { time: "Tháng 9", val: 3 }, { time: "Tháng 10", val: 3 }],
        totalQuestions: [{ time: "Tháng 8", val: 8 }, { time: "Tháng 9", val: 20 }, { time: "Tháng 10", val: 38 }],
        questionGroups: [{ time: "Tháng 8", val: 2 }, { time: "Tháng 9", val: 4 }, { time: "Tháng 10", val: 6 }],
        studentsActive: [{ time: "Tháng 8", val: 16 }, { time: "Tháng 9", val: 25 }, { time: "Tháng 10", val: 31 }],
        avgResponseTime: [{ time: "Tháng 8", val: 2.9 }, { time: "Tháng 9", val: 2.5 }, { time: "Tháng 10", val: 2.4 }],
      },
    },
    breakdown: [
      { label: "SQL Normalization", count: 16, percentage: 42, color: "#2563eb" },
      { label: "Index Optimization", count: 12, percentage: 32, color: "#10b981" },
      { label: "Transactions & ACID", count: 10, percentage: 26, color: "#f59e0b" },
    ],
  },
};

export default function TeacherDashboard() {
  const pathname = usePathname();
  const router = useRouter();

  const [teacherName, setTeacherName] = useState(lecturer.name);

  useEffect(() => {
    const storedName =
      typeof window !== "undefined" ? localStorage.getItem("teacherName") : null;
    if (storedName) setTeacherName(storedName);
  }, []);

  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [activeMetric, setActiveMetric] = useState<MetricKey>(null);
  
  // Trạng thái chuyển đổi khoảng thời gian: session | week | month
  const [timeMode, setTimeMode] = useState<TimeRangeMode>("month");

  const classMenuRef = useRef<HTMLDivElement>(null);
  const selectedClass =
    CLASS_OPTIONS.find((c) => c.id === selectedClassId) ?? CLASS_OPTIONS[0];

  const currentData =
    DASHBOARD_DATA_BY_CLASS[selectedClassId] || DASHBOARD_DATA_BY_CLASS["all"];

  useEffect(() => {
    if (!isClassMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        classMenuRef.current &&
        !classMenuRef.current.contains(event.target as Node)
      ) {
        setIsClassMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isClassMenuOpen]);

  // Ngày hiện tại (2026-10-25), khóa không cho chọn tương lai
  const todayString = "2026-10-25";
  const [selectedDate, setSelectedDate] = useState(todayString);
  const dateInputRef = useRef<HTMLInputElement>(null);

  function openDatePicker() {
    const el = dateInputRef.current;
    if (!el) return;
    if (typeof (el as any).showPicker === "function") {
      (el as any).showPicker();
    } else {
      el.click();
    }
  }

  function formatDateLabel(isoDate: string) {
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const maxConfusionCount = Math.max(
    ...currentData.confusionPoints.map((c) => c.count),
    1
  );

  function handleNavigate(href: string) {
    if (!href || href === pathname) return;
    router.push(href);
  }

  // Lấy dữ liệu biểu đồ theo chế độ thời gian đang chọn
  const activeCharts = currentData.chartsByMode[timeMode];

  // Hàm tạo đường dẫn SVG (Line Path)
  function renderSvgPath(
    points: { time: string; val: number }[],
    maxVal: number,
    width = 580,
    height = 140,
    offsetX = 35
  ) {
    if (!points || points.length === 0) return "";
    const stepX = width / (points.length - 1 || 1);
    return points
      .map((pt, idx) => {
        const x = idx * stepX + offsetX;
        const y = height - (pt.val / maxVal) * (height - 25) - 10;
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

  return (
    <Layout
      className={styles.page}
      mainClassName={styles.main}
      headerActions={
        <>
          <AccountMenu
            teacherName={teacherName}
            onSaveAccountInfo={(info) => {
              setTeacherName(info.username);
            }}
            onSubmitPasswordChange={(oldPassword, newPassword) => {
              console.log("Đổi mật khẩu:", { oldPassword, newPassword });
            }}
            onLogout={() => {
              console.log("Đăng xuất");
            }}
          />
        </>
      }
    >
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            {selectedClassId === "all"
              ? "Overview of all your class sessions"
              : `Analytics summary for ${selectedClass.label}`}
          </p>
        </div>

        <div className={styles.topControls}>
          {/* Dropdown chọn lớp */}
          <div className={styles.pickerWrap} ref={classMenuRef}>
            <button
              type="button"
              className={styles.pickerBtn}
              onClick={() => setIsClassMenuOpen((prev) => !prev)}
            >
              <span>{selectedClass.label}</span>
              <ChevronDown
                size={14}
                className={isClassMenuOpen ? styles.pickerChevronOpen : ""}
              />
            </button>

            {isClassMenuOpen && (
              <div className={styles.pickerMenu} role="listbox">
                {CLASS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.pickerMenuItem} ${
                      option.id === selectedClassId
                        ? styles.pickerMenuItemActive
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedClassId(option.id);
                      setIsClassMenuOpen(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {option.id === selectedClassId && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bộ lọc ngày (Ràng buộc max là ngày hiện tại) */}
          <div className={styles.pickerWrap}>
            <button
              type="button"
              className={styles.pickerBtn}
              onClick={openDatePicker}
            >
              <CalendarDays size={14} />
              <span>{formatDateLabel(selectedDate)}</span>
              <ChevronDown size={14} />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className={styles.hiddenDateInput}
              value={selectedDate}
              max={todayString}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5 THẺ THỐNG KÊ PHÍA TRÊN */}
      <div className={styles.statsGrid}>
        {currentData.stats.map((stat) => {
          const isActive = activeMetric === stat.key;
          return (
            <div
              key={stat.key}
              className={`${styles.statCard} ${
                isActive ? styles.statCardActive : ""
              }`}
              onClick={() => setActiveMetric(stat.key)}
              title={`Click để xem chi tiết ${stat.label}`}
            >
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
              <div className={styles.statTrend}>
                <span
                  className={
                    stat.trend.positive ? styles.trendUp : styles.trendDown
                  }
                >
                  {stat.trend.direction === "up" ? (
                    <ArrowUp size={12} />
                  ) : (
                    <ArrowDown size={12} />
                  )}
                  {stat.trend.value}
                </span>
                <span>vs. last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KHUNG BIỂU ĐỒ TỔNG QUAN / CHIA ĐÔI */}
      <section className={styles.panel} style={{ marginBottom: "24px" }}>
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <TrendingUp size={18} style={{ color: "var(--accent)" }} />
            <h2 className={styles.panelTitle}>
              {activeMetric === null
                ? `Overview Multi-Axis Analytics (${selectedClass.label})`
                : `${
                    currentData.stats.find((s) => s.key === activeMetric)?.label
                  } - Detailed Analysis`}
            </h2>
          </div>

          {/* Cụm điều khiển bên phải header: Nút chuyển chế độ thời gian & Nút quay lại */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Bộ chuyển đổi Session / Week / Month */}
            <div className={styles.timeModeSwitcher}>
              <button
                type="button"
                className={`${styles.timeModeBtn} ${timeMode === "session" ? styles.timeModeBtnActive : ""}`}
                onClick={() => setTimeMode("session")}
              >
                Buổi
              </button>
              <button
                type="button"
                className={`${styles.timeModeBtn} ${timeMode === "week" ? styles.timeModeBtnActive : ""}`}
                onClick={() => setTimeMode("week")}
              >
                Tuần
              </button>
              <button
                type="button"
                className={`${styles.timeModeBtn} ${timeMode === "month" ? styles.timeModeBtnActive : ""}`}
                onClick={() => setTimeMode("month")}
              >
                Tháng
              </button>
            </div>

            {activeMetric !== null && (
              <button
                type="button"
                onClick={() => setActiveMetric(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={14} /> Quay lại tổng quan
              </button>
            )}
          </div>
        </div>

        {activeMetric === null ? (
          /* CHẾ ĐỘ BAN ĐẦU: BIỂU ĐỒ TỔNG QUAN LỚN HOÀN CHỈNH */
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "210px",
                padding: "10px 0",
              }}
            >
              <svg
                viewBox="0 0 650 170"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                {/* Lưới tọa độ ngang nét đứt */}
                {[10, 45, 80, 115, 150].map((y, idx) => (
                  <line
                    key={idx}
                    x1="35"
                    y1={y}
                    x2="630"
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Nhãn trục tung Y */}
                <text x="10" y="14" fontSize="10" fill="var(--text-muted)">
                  150
                </text>
                <text x="10" y="49" fontSize="10" fill="var(--text-muted)">
                  110
                </text>
                <text x="15" y="84" fontSize="10" fill="var(--text-muted)">
                  70
                </text>
                <text x="15" y="119" fontSize="10" fill="var(--text-muted)">
                  30
                </text>
                <text x="20" y="154" fontSize="10" fill="var(--text-muted)">
                  0
                </text>

                {/* Trục chính Y & X */}
                <line
                  x1="35"
                  y1="10"
                  x2="35"
                  y2="150"
                  stroke="var(--text-faint)"
                  strokeWidth="1.5"
                />
                <line
                  x1="35"
                  y1="150"
                  x2="630"
                  y2="150"
                  stroke="var(--text-faint)"
                  strokeWidth="1.5"
                />

                {/* Đường biểu đồ của 5 chỉ số theo activeCharts */}
                {currentData.stats.map((stat) => {
                  const pts = activeCharts[stat.key!] || [];
                  const maxVal = 150;
                  const pathD = renderSvgPath(pts, maxVal, 580, 150, 35);
                  return (
                    <g key={stat.key}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={stat.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {pts.map((pt, i) => {
                        const stepX = 580 / (pts.length - 1 || 1);
                        const x = i * stepX + 35;
                        const y = 150 - (pt.val / maxVal) * 125 - 10;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill={stat.color}
                          />
                        );
                      })}
                    </g>
                  );
                })}

                {/* Nhãn trục hoành X (Thay đổi theo Session, Week, Month) */}
                {(activeCharts.totalQuestions || []).map((pt, i) => {
                  const stepX =
                    580 /
                    ((activeCharts.totalQuestions || []).length - 1 || 1);
                  const x = i * stepX + 35;
                  return (
                    <text
                      key={i}
                      x={x}
                      y="166"
                      textAnchor="middle"
                      fontSize="11"
                      fill="var(--text-muted)"
                    >
                      {pt.time}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Chú thích Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "16px",
                fontSize: "13px",
              }}
            >
              {currentData.stats.map((stat) => (
                <span
                  key={stat.key}
                  onClick={() => setActiveMetric(stat.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "3px",
                      background: stat.color,
                      display: "inline-block",
                      borderRadius: "2px",
                    }}
                  />
                  {stat.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* CHẾ ĐỘ KHI CLICK: CHIA 2 CỘT (BÊN TRÁI LÀ MINI-CHART ĐẦY ĐỦ TRỤC VÀ HỖ TRỢ ĐỔI CHẾ ĐỘ THỜI GIAN) */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "24px",
              alignItems: "center",
            }}
          >
            {/* 1. CỘT TRÁI: MINI-CHART THU GỌN VẪN GIỮ ĐỦ 2 TRỤC VÀ MỐC THỜI GIAN */}
            <div
              style={{
                background: "var(--surface)",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justify: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Overview Mini-Chart ({timeMode.toUpperCase()})
                </p>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  Active:{" "}
                  {currentData.stats.find((s) => s.key === activeMetric)?.label}
                </span>
              </div>

              <div style={{ width: "100%", height: "160px" }}>
                <svg
                  viewBox="0 0 450 150"
                  style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                  {/* Lưới tọa độ ngang nét đứt */}
                  {[10, 38, 66, 94, 122].map((y, idx) => (
                    <line
                      key={idx}
                      x1="35"
                      y1={y}
                      x2="430"
                      y2={y}
                      stroke="var(--border)"
                      strokeDasharray="3 3"
                    />
                  ))}

                  {/* Nhãn trục tung Y */}
                  <text x="8" y="14" fontSize="9" fill="var(--text-muted)">
                    150
                  </text>
                  <text x="8" y="42" fontSize="9" fill="var(--text-muted)">
                    110
                  </text>
                  <text x="12" y="70" fontSize="9" fill="var(--text-muted)">
                    70
                  </text>
                  <text x="12" y="98" fontSize="9" fill="var(--text-muted)">
                    30
                  </text>
                  <text x="15" y="126" fontSize="9" fill="var(--text-muted)">
                    0
                  </text>

                  {/* Trục chính Y & X */}
                  <line
                    x1="35"
                    y1="10"
                    x2="35"
                    y2="125"
                    stroke="var(--text-faint)"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="35"
                    y1="125"
                    x2="430"
                    y2="125"
                    stroke="var(--text-faint)"
                    strokeWidth="1.2"
                  />

                  {/* Các đường line (đường được chọn đậm rõ, các đường khác làm mờ) */}
                  {currentData.stats.map((stat) => {
                    const pts = activeCharts[stat.key!] || [];
                    const isSelected = stat.key === activeMetric;
                    const maxVal = 150;
                    if (!pts || pts.length === 0) return null;
                    const stepX = 390 / (pts.length - 1 || 1);
                    const pathD = pts
                      .map((pt, idx) => {
                        const x = idx * stepX + 35;
                        const y = 125 - (pt.val / maxVal) * 110;
                        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ");

                    return (
                      <g key={stat.key}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={stat.color}
                          strokeWidth={isSelected ? "3" : "1.2"}
                          opacity={isSelected ? "1" : "0.2"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {pts.map((pt, i) => {
                          const x = i * stepX + 35;
                          const y = 125 - (pt.val / maxVal) * 110;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r={isSelected ? "3.5" : "2"}
                              fill={stat.color}
                              opacity={isSelected ? "1" : "0.2"}
                            />
                          );
                        })}
                      </g>
                    );
                  })}

                  {/* Nhãn trục hoành X theo timeMode */}
                  {(activeCharts.totalQuestions || []).map((pt, i) => {
                    const stepX =
                      390 /
                      ((activeCharts.totalQuestions || []).length - 1 || 1);
                    const x = i * stepX + 35;
                    return (
                      <text
                        key={i}
                        x={x}
                        y="140"
                        textAnchor="middle"
                        fontSize="9.5"
                        fill="var(--text-muted)"
                      >
                        {pt.time}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* 2. CỘT PHẢI: BIỂU ĐỒ PHÂN TÍCH TỶ TRỌNG (BREAKDOWN) */}
            <div
              style={{
                background: "var(--surface)",
                padding: "16px",
                borderRadius: "10px",
                border: "1.5px solid var(--accent)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <BarChart3 size={16} style={{ color: "var(--accent)" }} />
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  Phân bổ theo kỳ ({timeMode.toUpperCase()}):{" "}
                  {currentData.stats.find((s) => s.key === activeMetric)?.label}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {currentData.breakdown.map((item, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justify: "space-between",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "var(--text)" }}>
                        {item.label}
                      </span>
                      <span style={{ fontWeight: 700, color: item.color }}>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "var(--border)",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: "999px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-faint)",
                  marginTop: "14px",
                  textAlign: "right",
                }}
              >
                * Dữ liệu phân tích so sánh theo thời gian thực.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 2 BẢNG BÊN DƯỚI */}
      <div className={styles.bottomGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Top Confusion Points</h2>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} /> Live
            </span>
          </div>

          <div className={styles.confusionList}>
            {currentData.confusionPoints.map((point, index) => (
              <div key={point.id} className={styles.confusionRow}>
                <span className={styles.confusionRank}>{index + 1}</span>
                <div className={styles.confusionBody}>
                  <div className={styles.confusionTopLine}>
                    <span className={styles.confusionTitle}>{point.title}</span>
                    <span className={styles.confusionCount}>{point.count}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(point.count / maxConfusionCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Questions</h2>
            <button
              type="button"
              className={styles.viewAllLink}
              onClick={() => handleNavigate("/question")}
            >
              View all
            </button>
          </div>

          <div className={styles.questionList}>
            {currentData.recentQuestions.map((q) => (
              <div key={q.id} className={styles.questionRow}>
                <div className={styles.questionTextBlock}>
                  <p className={styles.questionText}>{q.text}</p>
                  {q.secondaryText && (
                    <p className={styles.questionSecondaryText}>
                      {q.secondaryText}
                    </p>
                  )}
                </div>
                <div className={styles.questionMeta}>
                  <span className={styles.groupTag}>{q.group}</span>
                  <span className={styles.timeAgo}>{q.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

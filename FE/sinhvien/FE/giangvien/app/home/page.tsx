"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react"; // npm install qrcode.react
import styles from "./home.module.css";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Radio,
  LayoutGrid,
  Users,
  CalendarClock,
  Settings,
  ChevronRight,
  LayoutDashboard,
  Plus,
  Bell,
  RefreshCw,
  Copy,
  Check,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import ClassManagementPage from "../question/classmanagement/page";
import TeacherQuestionGroupsPage from "../question/question-group/page";
import {
  generateUniqueClassCode,
  generateQrPayload,
} from "./classCodeGenerator";

// Đổi thành domain thật khi triển khai
const APP_BASE_URL = "https://classbridge.app";

// Kiểu dữ liệu 1 lớp học (danh sách bên trái)
type ClassItem = {
  id: string;
  code: string;
  name: string;
  date: string;
  time: string;
  status: "ongoing" | "upcoming";
  studentCount: number;
  groupCount: number;
};

// TODO: thay bằng dữ liệu thật lấy từ API sau này
const teacherName = "";
const initialClasses: ClassItem[] = [];

// TODO: lấy danh sách mã lớp đang có thật từ database để đảm bảo không trùng
const existingClassCodes: string[] = [];

// Khung bên phải đang ở chế độ nào: form tạo lớp / kết quả (QR-mã-link)
type RightPanelView = "create" | "result";

export default function TeacherHome() {
  const [isQuestionMenuOpen, setIsQuestionMenuOpen] = useState(false);
  const [showClassManagement, setShowClassManagement] = useState(false);
  const [showQuestionGroups, setShowQuestionGroups] = useState(false);
  // Danh sách lớp học — lưu trong state để lớp mới tạo hiện ngay lên danh sách
  const [classesList, setClassesList] = useState<ClassItem[]>(initialClasses);

  // Khung phải: tạo lớp hay hiển thị kết quả
  const [rightPanelView, setRightPanelView] =
    useState<RightPanelView>("create");

  // ----- Form tạo lớp học -----
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classCode, setClassCode] = useState(() =>
    generateUniqueClassCode(existingClassCodes),
  );
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const joinLink = `${APP_BASE_URL}/join/${classCode}`;

  // Lớp "Đang diễn ra" luôn được xếp lên trên, "Sắp diễn ra" xếp dưới
  const sortedClasses = [...classesList].sort((a, b) => {
    const weight = (c: ClassItem) => (c.status === "ongoing" ? 0 : 1);
    return weight(a) - weight(b);
  });

  function handleRegenerateCode() {
    setClassCode(generateUniqueClassCode(existingClassCodes));
  }

  function handleCreateClass() {
    if (!subjectName.trim() || !date || !startTime || !endTime) return;

    const newClass: ClassItem = {
      id: classCode, // mã lớp là duy nhất nên dùng luôn làm id
      code: classCode,
      name: subjectName.trim(),
      date,
      time: `${startTime} - ${endTime}`,
      status: "upcoming", // TODO: tự tính "ongoing" nếu thời gian hiện tại nằm trong khoảng date/startTime-endTime
      studentCount: 0,
      groupCount: 0,
    };

    // TODO: gửi newClass lên server để lưu thật, existingClassCodes cũng nên cập nhật lại từ server
    setClassesList((prev) => [...prev, newClass]);
    setRightPanelView("result");
  }

  function handleCopy(text: string, type: "code" | "link") {
    navigator.clipboard?.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  // Quay lại form để tạo thêm 1 lớp mới khác
  function handleCreateAnother() {
    setSubjectName("");
    setDescription("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setClassCode(generateUniqueClassCode(existingClassCodes));
    setRightPanelView("create");
  }

  // ----- Hành động trên từng thẻ lớp học (thêm sinh viên / sửa / xóa) -----
  function handleAddStudent(classId: string) {
    // TODO: mở modal thêm sinh viên vào lớp classId
    console.log("Thêm sinh viên vào lớp:", classId);
  }

  function handleEditClass(classId: string) {
    // TODO: mở form sửa thông tin lớp classId
    console.log("Sửa lớp:", classId);
  }

  function handleDeleteClass(classId: string) {
    // TODO: gọi API xóa lớp thật, hiện tại chỉ xóa khỏi state để demo
    setClassesList((prev) => prev.filter((c) => c.id !== classId));
  }

  return (
    <div className={styles.page}>
      {/* 1. Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>
              <img src="/Ai.png" alt="Logo" /> ClassBridge
            </span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/home"
            className={`${styles.navItem} ${styles.navItemActive}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link href="/room" className={styles.navItem}>
            <Radio size={18} />
            <span>Live Session</span>
          </Link>
          <div className={styles.navGroup}>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => setIsQuestionMenuOpen((prev) => !prev)}
            >
              <LayoutGrid size={18} />
              <span>Question grouping</span>
              <ChevronRight
                size={16}
                className={`${styles.navChevron} ${
                  isQuestionMenuOpen ? styles.navChevronOpen : ""
                }`}
              />
            </button>
            {isQuestionMenuOpen && (
              <div className={styles.navChildren}>
                <button
                  type="button"
                  className={styles.navItemChild}
                  onClick={() => setShowClassManagement(true)}
                >
                  <span>Class management</span>
                </button>
                <button
                  type="button"
                  className={styles.navItemChild}
                  onClick={() => setShowQuestionGroups(true)}
                >
                  <span>Gom câu hỏi</span>
                </button>
              </div>
            )}
          </div>
          <Link href="/home" className={styles.navItem}>
            <Users size={18} />
            <span>Students</span>
          </Link>
          <Link href="/home" className={styles.navItem}>
            <CalendarClock size={18} />
            <span>Sessions</span>
          </Link>
          <Link href="/home" className={styles.navItem}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <div className={styles.sidebarDivider}>
            <Link href="/home" className={styles.navItem}>
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </aside>

      <div className={styles.contentArea}>
        {showClassManagement && (
          <div className={styles.mainOverlay}>
            <ClassManagementPage embedded />
          </div>
        )}
        {showQuestionGroups && (
          <div className={styles.mainOverlay}>
            <TeacherQuestionGroupsPage embedded />
          </div>
        )}

        {/* Thanh trên cùng */}
        <div className={styles.topbar}>
          <button className={styles.bellButton}>
            <Bell size={18} />
          </button>
          <div className={styles.avatar}>DR</div>
        </div>

        <div className={styles.twoColumn}>
          {/* 2. Lớp học của tôi */}
          <section className={styles.classBox}>
            <div className={styles.classBoxHeader}>
              <h2 className={styles.sectionTitle}>Lớp học của tôi</h2>
              <a href="#" className={styles.viewAll}>
                Xem tất cả
              </a>
            </div>

            {sortedClasses.length === 0 && (
              <p className={styles.emptyText}>Chưa có dữ liệu lớp học.</p>
            )}

            {sortedClasses.map((c) => (
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
                      c.status === "ongoing"
                        ? styles.statusOngoing
                        : styles.statusUpcoming
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

                <div className={styles.classActions}>
                  <button
                    className={styles.actionBtn}
                    title="Thêm sinh viên"
                    onClick={() => handleAddStudent(c.id)}
                  >
                    <UserPlus size={15} />
                  </button>
                  <button
                    className={styles.actionBtn}
                    title="Sửa lớp"
                    onClick={() => handleEditClass(c.id)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    title="Xóa lớp"
                    onClick={() => handleDeleteClass(c.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className={styles.formCard}>
            {rightPanelView === "create" ? (
              <>
                <h2 className={styles.sectionTitle}>Tạo lớp học mới</h2>
                <label className={styles.label}>
                  Tên môn học <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Vui lòng nhập tên môn học"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
                <label className={styles.label}>
                  Mã lớp <span className={styles.required}>*</span>
                </label>
                <div className={styles.codeRow}>
                  <input
                    type="text"
                    className={styles.input}
                    value={classCode}
                    readOnly
                  />
                  <button
                    type="button"
                    className={styles.regenerateBtn}
                    onClick={handleRegenerateCode}
                    title="Tạo mã khác"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <p className={styles.helperText}>
                  Mã này do hệ thống tự sinh và đảm bảo không trùng với bất kỳ
                  lớp nào khác.
                </p>
                <label className={styles.label}>
                  Thời gian <span className={styles.required}>*</span>
                </label>
                <div className={styles.timeRow}>
                  <input
                    type="date"
                    className={styles.input}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className={styles.input}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <span className={styles.timeDash}>-</span>
                  <input
                    type="time"
                    className={styles.input}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <label className={styles.label}>Mô tả (tùy chọn)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Ví dụ: Introduction to Software Testing"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  className={styles.createBtn}
                  onClick={handleCreateClass}
                >
                  Tạo lớp học
                </button>
              </>
            ) : (
              <>
                <h2 className={styles.sectionTitle}>Đã tạo lớp học</h2>
                <p className={styles.resultInlineSubtitle}>
                  Bạn hãy chia sẻ mã lớp, link hoặc mã QR này cho sinh viên để
                  tham gia lớp học.
                </p>
                <div className={styles.inlineResultCenter}>
                  <div className={styles.bigQrWrap}>
                    <QRCodeSVG
                      value={generateQrPayload(classCode)}
                      size={220}
                    />
                  </div>
                  <div className={styles.bigCodeLabel}>Mã lớp học</div>
                  <div className={styles.bigCodeRow}>
                    <span className={styles.bigCode}>{classCode}</span>
                    <button
                      className={styles.copyIconBtn}
                      onClick={() => handleCopy(classCode, "code")}
                    >
                      {copied === "code" ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                  <div className={styles.linkRow}>
                    <span className={styles.linkText}>{joinLink}</span>
                    <button
                      className={styles.copyIconBtn}
                      onClick={() => handleCopy(joinLink, "link")}
                    >
                      {copied === "link" ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  className={styles.createBtn}
                  onClick={handleCreateAnother}
                >
                  Tạo lớp học khác
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

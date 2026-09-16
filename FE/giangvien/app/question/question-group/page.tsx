"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Radio,
  LayoutGrid,
  Users,
  CalendarClock,
  Settings,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import styles from "./question.module.css";
// Đường dẫn import tuỳ vào bạn đặt file classmanagement page.tsx ở đâu trong
// project, sửa lại cho khớp cấu trúc thư mục thật.
import ClassManagementPage from "../classmanagement/page";

interface RawQuestion {
  id: string;
  studentName: string;
  text: string;
}

interface QuestionGroup {
  id: string;
  index: number;
  isLive: boolean;
  topic: string;
  totalQuestions: number;
  totalStudents: number;
  representativeQuestions: string[];
  rawQuestions: RawQuestion[];
  answered: boolean;
}

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Live Session", href: "/room", icon: Radio },
  { label: "Question grouping", href: "/question", icon: LayoutGrid },
  { label: "Students", href: "", icon: Users },
  { label: "Sessions", href: "", icon: CalendarClock },
  { label: "Dashboard", href: "", icon: LayoutDashboard },
];

const SETTINGS_ITEM = { label: "Settings", href: "", icon: Settings };

const QUESTION_GROUP_CHILDREN = [
  { label: "Class management", href: "/classmanagement" },
  { label: "Gom câu hỏi", href: "/question" },
];

const INITIAL_GROUPS: QuestionGroup[] = [
  {
    id: "grp-1",
    index: 1,
    isLive: true,
    topic: "Machine Learning vs Deep Learning",
    totalQuestions: 12,
    totalStudents: 5,
    representativeQuestions: [
      "What is the difference between ML and DL?",
      "Sự khác nhau giữa Machine Learning và Deep Learning là gì?",
      "How do they relate to each other?",
    ],
    rawQuestions: [
      {
        id: "q1-1",
        studentName: "An",
        text: "What is the difference between ML and DL?",
      },
      {
        id: "q1-2",
        studentName: "Bình",
        text: "ML với DL khác nhau ở điểm nào vậy ạ?",
      },
      {
        id: "q1-3",
        studentName: "Chi",
        text: "How do they relate to each other?",
      },
    ],
    answered: true,
  },
  {
    id: "grp-3",
    index: 2,
    isLive: false,
    topic: "Overfitting & Regularization",
    totalQuestions: 6,
    totalStudents: 4,
    representativeQuestions: [
      "What causes overfitting?",
      "What are some regularization techniques?",
      "Underfitting là gì và khi nào xảy ra?",
    ],
    rawQuestions: [
      {
        id: "q3-1",
        studentName: "An",
        text: "What causes overfitting?",
      },
      {
        id: "q3-3",
        studentName: "Chi",
        text: "What are some regularization techniques?",
      },
      {
        id: "q3-4",
        studentName: "Đức",
        text: "Underfitting là gì và khi nào xảy ra?",
      },
      {
        id: "q3-5",
        studentName: "Hoa",
        text: "Is dropout a regularization method?",
      },
      {
        id: "q3-6",
        studentName: "Khang",
        text: "Mô hình của em bị overfitting thì nên làm gì?",
      },
    ],
    answered: false,
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

type TeacherQuestionGroupsPageProps = {
  embedded?: boolean;
};

export default function TeacherQuestionGroupsPage({
  embedded = false,
}: TeacherQuestionGroupsPageProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const [groups, setGroups] = useState<QuestionGroup[]>(INITIAL_GROUPS);
  const [expandedViewId, setExpandedViewId] = useState<string | null>(null);
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [justSentId, setJustSentId] = useState<string | null>(null);
  const [isQuestionMenuOpen, setIsQuestionMenuOpen] = useState(false);
  // Bật/tắt overlay "Class management" — hiện đè lên .main, sidebar vẫn giữ nguyên
  const [showClassManagement, setShowClassManagement] = useState(false);

  const toggleView = (groupId: string) => {
    setExpandedViewId((prev) => (prev === groupId ? null : groupId));
  };

  const toggleReply = (groupId: string) => {
    setOpenReplyId((prev) => (prev === groupId ? null : groupId));
    setJustSentId(null);
  };

  const updateDraft = (groupId: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleSend = (group: QuestionGroup) => {
    const answerText = (replyDrafts[group.id] ?? "").trim();
    if (!answerText) return;
    group.rawQuestions.forEach((q) => {
      console.log(
        `[Đã gửi] Trả lời cho câu hỏi "${q.text}" của sinh viên ${q.studentName}: ${answerText}`,
      );
    });

    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, answered: true } : g)),
    );
    setJustSentId(group.id);
    setOpenReplyId(null);
  };

  return (
    <div className={`${styles.page} ${embedded ? styles.embedded : ""}`}>
      <header className={styles.topBar}>
        <div className={styles.topBarBrand}>
          <span className={styles.logoText}>
            <img src="/Ai.png" alt="Logo" /> ClassBridge
          </span>
        </div>

        <div className={styles.topBarActions}>
          <button
            type="button"
            className={styles.topBarIconButton}
            aria-label="Thông báo"
          >
            <Bell size={17} />
          </button>
          <div className={styles.topBarAvatar}>NA</div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) =>
              label === "Question grouping" ? (
                <div key={href} className={styles.navGroup}>
                  <button
                    type="button"
                    onClick={() => setIsQuestionMenuOpen((prev) => !prev)}
                    className={styles.navItem}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                    <ChevronRight
                      size={16}
                      className={`${styles.navChevron} ${
                        isQuestionMenuOpen ? styles.navChevronOpen : ""
                      }`}
                    />
                  </button>
                  {isQuestionMenuOpen && (
                    <div className={styles.navChildren}>
                      {QUESTION_GROUP_CHILDREN.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            if (item.label === "Class management") {
                              // Hiện overlay đè lên .main thay vì chuyển trang
                              setShowClassManagement(true);
                            } else {
                              router.push(item.href);
                            }
                          }}
                          className={styles.navItemChild}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={href}
                  type="button"
                  onClick={() => router.push(href)}
                  className={`${styles.navItem} ${
                    pathname === href ? styles.navItemActive : ""
                  }`}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </button>
              ),
            )}
            <div className={styles.sidebarDivider} />
            <button
              type="button"
              onClick={() => router.push(SETTINGS_ITEM.href)}
              className={`${styles.navItem} ${
                pathname === SETTINGS_ITEM.href ? styles.navItemActive : ""
              }`}
            >
              <SETTINGS_ITEM.icon size={17} />
              <span>{SETTINGS_ITEM.label}</span>
            </button>
          </nav>

          <div className={styles.profileBox}>
            <span className={styles.profileAvatar}>NA</span>
            <div>
              <div className={styles.profileName}>Dr. Nguyen Van A</div>
              <div className={styles.profileRole}>Lecturer</div>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          {showClassManagement && (
            <div className={styles.mainOverlay}>
              <ClassManagementPage embedded />
            </div>
          )}

          <div className={styles.headerRow}>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.headerTitle}>Question Groups</h1>
              <span className={styles.liveTag}>
                <span className={styles.liveDot} /> Live
              </span>
            </div>
            <button type="button" className={styles.sortSelect}>
              Sort by: Recent <ChevronDown size={14} />
            </button>
          </div>

          <div className={styles.groupList}>
            {groups.map((group) => {
              const isViewOpen = expandedViewId === group.id;
              const isReplyOpen = openReplyId === group.id;
              const justSent = justSentId === group.id;
              const questionsToShow = isViewOpen
                ? group.rawQuestions.map((q) => ({
                    text: q.text,
                    name: q.studentName,
                  }))
                : group.representativeQuestions.map((text) => ({
                    text,
                    name: null,
                  }));

              return (
                <div key={group.id} className={styles.groupCard}>
                  {group.isLive && (
                    <span className={styles.groupBadge}>12</span>
                  )}

                  <div className={styles.groupTopRow}>
                    <div>
                      <div className={styles.groupHeadingLine}>
                        Nhóm {group.index}
                        {group.isLive && (
                          <span className={styles.liveMiniPill}>12</span>
                        )}
                        {group.answered && (
                          <span className={styles.answeredPill}>
                            Đã trả lời
                          </span>
                        )}
                      </div>
                      <h3 className={styles.groupTopic}>{group.topic}</h3>
                      <p className={styles.groupMeta}>
                        {group.totalQuestions} câu hỏi · {group.totalStudents}{" "}
                        sinh viên
                      </p>
                    </div>

                    <div className={styles.groupActions}>
                      <button
                        type="button"
                        className={styles.btnOutline}
                        onClick={() => toggleView(group.id)}
                      >
                        {isViewOpen ? "Thu gọn" : "Xem tất cả"}
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={() => toggleReply(group.id)}
                      >
                        Trả lời
                      </button>
                    </div>
                  </div>

                  <ul className={styles.questionBullets}>
                    {questionsToShow.map((q, idx) => (
                      <li key={idx}>
                        <span className={styles.bulletDot}>•</span>
                        <span>
                          {q.text}
                          {q.name && (
                            <span className={styles.rawStudentName}>
                              — {q.name}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {isReplyOpen && (
                    <div className={styles.replyBox}>
                      <p className={styles.replyLabel}>
                        Trả lời chung cho cả nhóm
                      </p>
                      <textarea
                        className={styles.replyTextarea}
                        placeholder="Nhập câu trả lời..."
                        value={replyDrafts[group.id] ?? ""}
                        onChange={(e) => updateDraft(group.id, e.target.value)}
                      />
                      <div className={styles.replyFooter}>
                        <span className={styles.replyHint}>
                          Câu trả lời sẽ gửi cho tất cả sinh viên trong nhóm
                        </span>
                        <div className={styles.replyFooterActions}>
                          <button
                            type="button"
                            className={styles.btnOutline}
                            onClick={() => setOpenReplyId(null)}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            className={styles.btnPrimary}
                            disabled={!(replyDrafts[group.id] ?? "").trim()}
                            onClick={() => handleSend(group)}
                          >
                            Gửi
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {justSent && (
                    <div className={styles.sentNotice}>
                      Đã gửi câu trả lời cho nhóm này.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

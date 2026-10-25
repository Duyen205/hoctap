"use client";

import { useMemo, useState, type FormEvent } from "react";
import AccountMenu from "../account/AccountMenu";
import Layout from "../components/Layout";
import QuestionClassList from "./QuestionClassList";
import QuestionDetail from "./QuestionDetail";
import styles from "./question.module.css";
import type {
  ClassInfo,
  CurrentUser,
  MainTab,
  QuestionFilter,
  QuestionGroup,
  QuestionItem,
  QuestionLang,
} from "./types";

const JOINED_CLASSES: ClassInfo[] = [
  {
    id: "c1",
    code: "2627",
    name: "CMU-IS 482 CIS",
    isLive: true,
    day: "Thứ 5",
    time: "11:15",
    date: "10/09/2026",
  },
  {
    id: "c2",
    code: "2627",
    name: "Software Testing (SE305)",
    isLive: false,
    day: "Thứ 3",
    time: "09:00",
    date: "12/09/2026",
  },
  {
    id: "c3",
    code: "2627",
    name: "Database Systems (DB210)",
    isLive: false,
    day: "Thứ 4",
    time: "14:00",
    date: "13/09/2026",
  },
];

const MOCK_QUESTIONS: QuestionItem[] = [
  {
    id: "q1",
    group: "Group 1",
    text: "What is regression testing?",
    answered: true,
    lang: "en",
    timeAgo: "2 phút trước",
  },
  {
    id: "q2",
    group: "Group 2",
    text: "How is unit testing different?",
    answered: true,
    lang: "vi",
    timeAgo: "5 phút trước",
  },
  {
    id: "q3",
    group: "Group 3",
    text: "When should we perform testing?",
    answered: false,
    lang: "mixed",
    timeAgo: "12 phút trước",
  },
];

const MOCK_QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: "grp-1",
    index: 1,
    topic: "Regression Testing",
    totalQuestions: 8,
    answered: true,
    mainQuestion: { text: "What is regression testing?", lang: "EN" },
    relatedQuestions: [
      {
        id: "rq-1",
        text: "What is the purpose of regression testing?",
        lang: "EN",
      },
      { id: "rq-2", text: "Regression testing có nghĩa là gì?", lang: "VI" },
      {
        id: "rq-3",
        text: "How often should regression tests be run?",
        lang: "EN",
      },
      {
        id: "rq-4",
        text: "Regression testing có bắt buộc trong CI/CD không?",
        lang: "VI",
      },
      {
        id: "rq-5",
        text: "Who is responsible for writing regression tests?",
        lang: "EN",
      },
      {
        id: "rq-6",
        text: "Có công cụ nào tự động hoá regression testing không?",
        lang: "VI",
      },
      {
        id: "rq-7",
        text: "Is regression testing part of unit testing?",
        lang: "EN",
      },
    ],
    answer: {
      en: "Regression testing is a type of software testing that ensures new changes do not break existing functionality.",
      vi: "Kiểm thử hồi quy là một loại kiểm thử phần mềm nhằm đảm bảo các thay đổi mới không làm ảnh hưởng đến chức năng hiện có.",
    },
  },
  {
    id: "grp-2",
    index: 2,
    topic: "Unit Testing",
    totalQuestions: 4,
    answered: false,
    mainQuestion: {
      text: "How is unit testing different from integration testing?",
      lang: "EN",
    },
    relatedQuestions: [
      {
        id: "rq-8",
        text: "Unit test và integration test khác nhau ở đâu?",
        lang: "VI",
      },
      {
        id: "rq-9",
        text: "Do we need both unit and integration tests?",
        lang: "EN",
      },
    ],
  },
];

export default function QuestionCenterPage() {
  const [teacherName, setTeacherName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const classInfo = useMemo(
    () => JOINED_CLASSES.find((item) => item.id === selectedClassId) ?? null,
    [selectedClassId],
  );
  const [currentUser] = useState<CurrentUser>(() => {
    if (typeof window === "undefined") return { name: "Sinh viên" };
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return { name: "Sinh viên" };
      const parsed = JSON.parse(raw);
      return {
        name:
          parsed.fullName ??
          parsed.name ??
          parsed.username ??
          "Sinh viên",
      };
    } catch {
      return { name: "Sinh viên" };
    }
  });
  const [activeTab, setActiveTab] = useState<MainTab>("qa");
  const [newQuestion, setNewQuestion] = useState("");
  const [questionLang, setQuestionLang] = useState<QuestionLang>("vi");
  const [questions, setQuestions] =
    useState<QuestionItem[]>(MOCK_QUESTIONS);
  const [questionFilter, setQuestionFilter] =
    useState<QuestionFilter>("all");
  const [questionGroups] =
    useState<QuestionGroup[]>(MOCK_QUESTION_GROUPS);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(
    MOCK_QUESTION_GROUPS[0]?.id ?? null,
  );
  const [translationVisible, setTranslationVisible] = useState<
    Record<string, boolean>
  >({ "grp-1": true });
  const [expandedRelatedIds, setExpandedRelatedIds] = useState<
    Record<string, boolean>
  >({});

  const filteredQuestions = useMemo(() => {
    if (questionFilter === "answered") {
      return questions.filter((question) => question.answered);
    }
    if (questionFilter === "unanswered") {
      return questions.filter((question) => !question.answered);
    }
    return questions;
  }, [questions, questionFilter]);

  function handleSubmitQuestion(event: FormEvent) {
    event.preventDefault();
    const text = newQuestion.trim();
    if (!text) return;
    setQuestions((previous) => [
      {
        id: crypto.randomUUID(),
        group: "Chưa phân nhóm",
        text,
        answered: false,
        lang: questionLang,
        timeAgo: "Vừa xong",
      },
      ...previous,
    ]);
    setNewQuestion("");
  }

  function handleOpenClass(id: string) {
    setSelectedClassId(id);
    setActiveTab("qa");
  }

  function handleToggleGroup(groupId: string) {
    setExpandedGroupId((previous) =>
      previous === groupId ? null : groupId,
    );
  }

  function handleToggleTranslation(groupId: string) {
    setTranslationVisible((previous) => ({
      ...previous,
      [groupId]: !previous[groupId],
    }));
  }

  function handleToggleRelated(groupId: string) {
    setExpandedRelatedIds((previous) => ({
      ...previous,
      [groupId]: !previous[groupId],
    }));
  }

  return (
    <Layout
      className={styles.appShell}
      bodyClassName={styles.page}
      mainClassName={styles.main}
      headerActions={
        <AccountMenu
          teacherName={teacherName}
          onSaveAccountInfo={(info) => {
            console.log("Lưu thông tin tài khoản:", info);
            setTeacherName(info.username);
          }}
          onSubmitPasswordChange={(oldPassword, newPassword) => {
            console.log("Đổi mật khẩu:", { oldPassword, newPassword });
          }}
          onLogout={() => {
            console.log("Đăng xuất");
          }}
        />
      }
    >
      {classInfo ? (
        <QuestionDetail
          classInfo={classInfo}
          currentUser={currentUser}
          activeTab={activeTab}
          questions={questions}
          filteredQuestions={filteredQuestions}
          questionFilter={questionFilter}
          newQuestion={newQuestion}
          questionLang={questionLang}
          questionGroups={questionGroups}
          expandedGroupId={expandedGroupId}
          translationVisible={translationVisible}
          expandedRelatedIds={expandedRelatedIds}
          onBack={() => setSelectedClassId(null)}
          onTabChange={setActiveTab}
          onFilterChange={setQuestionFilter}
          onQuestionChange={setNewQuestion}
          onQuestionLangChange={setQuestionLang}
          onSubmitQuestion={handleSubmitQuestion}
          onToggleGroup={handleToggleGroup}
          onToggleTranslation={handleToggleTranslation}
          onToggleRelated={handleToggleRelated}
        />
      ) : (
        <QuestionClassList
          classes={JOINED_CLASSES}
          onOpenClass={handleOpenClass}
        />
      )}
    </Layout>
  );
}

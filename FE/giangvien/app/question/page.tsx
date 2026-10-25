"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import styles from "./question.module.css";
import AccountMenu from "../account-logo/AccountMenu";
import Layout from "../components/Layout";
import QuestionDetailPage from "./QuestionDetailPage";
import QuestionMainPage from "./QuestionMainPage";
import type { QuestionGroup, ReplyLanguage } from "./types";

const INITIAL_GROUPS: QuestionGroup[] = [
  {
    id: "grp-1",
    classId: "c1",
    className: "AI Education (CS101)",
    classStatus: "Live",
    index: 1,
    topic: "Machine Learning vs Deep Learning",
    totalQuestions: 12,
    totalStudents: 5,
    representativeQuestion:
      "What is the difference between Machine Learning and Deep Learning?",
    rawQuestions: [
      { id: "q1", text: "What is ML?", time: "09:32" },
      { id: "q2", text: "Difference between ML and DL?", time: "09:33" },
      { id: "q3", text: "How do they relate to each other?", time: "09:35" },
    ],
    answered: false,
    lastActivityAt: "Cập nhật 2 phút trước",
  },
  {
    id: "grp-2",
    classId: "c3",
    className: "Database (DB210)",
    classStatus: "Đã kết thúc",
    index: 2,
    topic: "Normalization",
    totalQuestions: 6,
    totalStudents: 3,
    representativeQuestion: "Sự khác nhau giữa chuẩn hoá 2NF và 3NF là gì?",
    rawQuestions: [
      {
        id: "q4",
        text: "Sự khác nhau giữa 2NF và 3NF là gì?",
        time: "10:05",
      },
    ],
    answered: true,
    replyTextContent:
      "Chuẩn 3NF yêu cầu loại bỏ phụ thuộc bắc cầu, trong khi 2NF loại bỏ phụ thuộc một phần.",
    lastActivityAt: "Cập nhật 1 giờ trước",
  },
];

export default function QuestionGroupingPage() {
  const [teacherName, setTeacherName] = useState("Dr");
  const [groups, setGroups] = useState<QuestionGroup[]>(INITIAL_GROUPS);
  const [activeDetailGroupId, setActiveDetailGroupId] = useState<string | null>(
    null,
  );
  const [activeReplyText, setActiveReplyText] = useState("");
  const [replyingCardGroupId, setReplyingCardGroupId] = useState<string | null>(
    null,
  );
  const [sendToAllChecked, setSendToAllChecked] = useState(true);
  const [currentLang, setCurrentLang] = useState<ReplyLanguage>("vi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [targetGroupIdForSubmit, setTargetGroupIdForSubmit] = useState<
    string | null
  >(null);
  const [successToast, setSuccessToast] = useState(false);

  const detailGroup = groups.find(
    (group) => group.id === activeDetailGroupId,
  );

  function handleToggleQuickReply(group: QuestionGroup) {
    if (replyingCardGroupId === group.id) {
      setReplyingCardGroupId(null);
      return;
    }

    setReplyingCardGroupId(group.id);
    setActiveReplyText(group.replyTextContent || "");
  }

  function handleToggleLanguage(language: ReplyLanguage) {
    setCurrentLang(language);
    if (!activeReplyText.trim()) return;

    setIsTranslating(true);
    setTimeout(() => {
      setActiveReplyText(
        language === "en"
          ? "Machine Learning uses data to learn patterns, while Deep Learning is a branch of Machine Learning using multi-layered Neural networks..."
          : "Machine Learning sử dụng dữ liệu để học các quy luật, còn Deep Learning là một nhánh của Machine Learning sử dụng mạng Neural nhiều tầng...",
      );
      setIsTranslating(false);
    }, 400);
  }

  function handlePromptConfirm(groupId: string) {
    setTargetGroupIdForSubmit(groupId);
    setShowConfirmDialog(true);
  }

  function handleConfirmSend() {
    if (!activeReplyText.trim() || !targetGroupIdForSubmit) return;

    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === targetGroupIdForSubmit
          ? {
              ...group,
              answered: true,
              replyTextContent: activeReplyText,
            }
          : group,
      ),
    );

    setShowConfirmDialog(false);
    setReplyingCardGroupId(null);
    setTargetGroupIdForSubmit(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  }

  function handleBackToList() {
    setActiveDetailGroupId(null);
    setActiveReplyText("");
  }

  return (
    <Layout
      className={styles.page}
      mainClassName={styles.main}
      headerActions={
        <>
          <button type="button" aria-label="Thông báo" className={styles.iconBtn}>
            <Bell size={18} />
          </button>
          <AccountMenu
            teacherName={teacherName}
            onSaveAccountInfo={(info) => setTeacherName(info.username)}
            onSubmitPasswordChange={() => {}}
            onLogout={() => {}}
          />
        </>
      }
    >
      <div className={styles.container}>
        {successToast && (
          <div className={styles.successToastAlert}>
            <CheckCircle2 size={16} color="#10b981" /> Đã gửi/cập nhật câu trả
            lời thành công đến nhóm câu hỏi!
          </div>
        )}

        <QuestionMainPage
          groups={groups}
          replyingCardGroupId={replyingCardGroupId}
          replyText={activeReplyText}
          sendToAllChecked={sendToAllChecked}
          currentLang={currentLang}
          isTranslating={isTranslating}
          hidden={Boolean(detailGroup)}
          onOpenGroup={setActiveDetailGroupId}
          onToggleQuickReply={handleToggleQuickReply}
          onReplyTextChange={setActiveReplyText}
          onSendToAllChange={setSendToAllChecked}
          onLanguageChange={handleToggleLanguage}
          onCancelInlineReply={() => setReplyingCardGroupId(null)}
          onSubmitReply={handlePromptConfirm}
        />

        {detailGroup && (
          <QuestionDetailPage
            group={detailGroup}
            replyText={activeReplyText}
            sendToAllChecked={sendToAllChecked}
            currentLang={currentLang}
            isTranslating={isTranslating}
            onBack={handleBackToList}
            onReplyTextChange={setActiveReplyText}
            onSendToAllChange={setSendToAllChecked}
            onLanguageChange={handleToggleLanguage}
            onSubmit={() => handlePromptConfirm(detailGroup.id)}
          />
        )}

        {showConfirmDialog && (
          <div className={styles.dialogOverlay}>
            <div className={styles.confirmDialogBox}>
              <h3 className={styles.dialogTitle}>
                Xác nhận gửi câu trả lời
              </h3>
              <p className={styles.dialogDesc}>
                Câu trả lời này sẽ được gửi đồng thời đến toàn bộ các câu hỏi
                ẩn danh trong nhóm này.
              </p>
              <div className={styles.dialogFooter}>
                <button
                  type="button"
                  className={styles.secondaryOutlineBtn}
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryActionButton}
                  onClick={handleConfirmSend}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

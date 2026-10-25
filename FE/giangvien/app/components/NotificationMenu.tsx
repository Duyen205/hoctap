"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare } from "lucide-react";
import styles from "./NotificationMenu.module.css";

type NotificationClass = {
  id: string;
  name: string;
  code: string;
  status?: string;
  groupsCount?: number;
  studentCount?: number;
};

type QuestionNotification = {
  key: string;
  classId: string;
  className: string;
  isLive: boolean;
  questionCount: number;
  askerCount: number;
};

export default function NotificationMenu() {
  const router = useRouter();
  const notifyRef = useRef<HTMLDivElement | null>(null);
  const [classes, setClasses] = useState<NotificationClass[]>([]);
  const [readKeys, setReadKeys] = useState<Set<string>>(() => new Set());
  const [notifyOpen, setNotifyOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchClasses() {
      try {
        const response = await fetch("/api/classes", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Không thể tải danh sách lớp: HTTP ${response.status}`);
        }
        const data: NotificationClass[] = await response.json();
        setClasses(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Lỗi khi tải dữ liệu thông báo:", error);
      }
    }

    fetchClasses();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!notifyOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setNotifyOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNotifyOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notifyOpen]);

  const notifications = useMemo<QuestionNotification[]>(() => {
    return classes
      .map((classInfo) => {
        const questionCount = classInfo.groupsCount
          ? classInfo.groupsCount * 2
          : 0;
        return {
          key: `${classInfo.id}:${questionCount}`,
          classId: classInfo.id,
          className: classInfo.name,
          isLive: classInfo.status === "live",
          questionCount,
          askerCount: classInfo.studentCount
            ? Math.ceil(classInfo.studentCount / 3)
            : 0,
        };
      })
      .filter((notification) => notification.questionCount > 0)
      .sort((first, second) => Number(second.isLive) - Number(first.isLive));
  }, [classes]);

  const unreadCount = notifications.filter(
    (notification) => !readKeys.has(notification.key),
  ).length;

  function handleOpenNotification(notification: QuestionNotification) {
    setReadKeys((currentKeys) => new Set(currentKeys).add(notification.key));
    setNotifyOpen(false);
    router.push(`/question?classId=${notification.classId}`);
  }

  function handleMarkAllRead() {
    setReadKeys(new Set(notifications.map((notification) => notification.key)));
  }

  return (
    <div className={styles.notifyWrap} ref={notifyRef}>
      <button
        type="button"
        className={styles.notifyButton}
        aria-label={
          unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : "Thông báo"
        }
        aria-haspopup="true"
        aria-expanded={notifyOpen}
        onClick={() => setNotifyOpen((open) => !open)}
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className={styles.notifyBadge}>{unreadCount}</span>
        )}
      </button>

      {notifyOpen && (
        <div className={styles.notifyPanel} role="menu">
          <div className={styles.notifyHeader}>
            <h2 className={styles.notifyTitle}>Thông báo</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                className={styles.notifyMarkAll}
                onClick={handleMarkAllRead}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className={styles.notifyEmpty}>
              Chưa có câu hỏi nào từ sinh viên.
            </p>
          ) : (
            <ul className={styles.notifyList}>
              {notifications.map((notification) => {
                const unread = !readKeys.has(notification.key);
                return (
                  <li key={notification.key}>
                    <button
                      type="button"
                      role="menuitem"
                      className={`${styles.notifyItem} ${unread ? styles.notifyItemUnread : ""}`}
                      onClick={() => handleOpenNotification(notification)}
                    >
                      <span className={styles.notifyIcon}>
                        <MessageSquare size={16} />
                      </span>
                      <span className={styles.notifyBody}>
                        <span className={styles.notifyText}>
                          Lớp <strong>{notification.className}</strong> có{" "}
                          {notification.questionCount} câu hỏi từ{" "}
                          {notification.askerCount} sinh viên
                        </span>
                        <span className={styles.notifyMeta}>
                          {notification.isLive ? "Đang diễn ra · " : ""}
                          Bấm để xem ở Question grouping
                        </span>
                      </span>
                      {unread && <span className={styles.notifyDot} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

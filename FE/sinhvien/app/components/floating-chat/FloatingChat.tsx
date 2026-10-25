"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, MessageSquare, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./FloatingChat.module.css";

type Audience = "lecturer" | "student";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type FloatingChatProps = {
  audience?: Audience;
};

function audienceFromPath(pathname: string): Audience | null {
  if (pathname.includes("/giangvien") || pathname.includes("/dashboard")) {
    return "lecturer";
  }
  if (pathname.includes("/student") || pathname.includes("/sinhvien")) {
    return "student";
  }
  return null;
}

function welcomeMessage(audience: Audience | null): ChatMessage {
  const text =
    audience === "lecturer"
      ? "Xin chào! Tôi là trợ lý AI 24/7. Tôi có thể hỗ trợ quản lý lớp học và phân tích dữ liệu."
      : audience === "student"
        ? "Xin chào! Tôi là trợ lý AI 24/7. Tôi luôn sẵn sàng hỗ trợ và giải đáp thắc mắc về bài học."
        : "Xin chào! Tôi là trợ lý AI 24/7. Tôi có thể giúp gì cho bạn?";

  return { id: 1, role: "assistant", text };
}

function createReply(question: string, audience: Audience | null): string {
  const normalizedQuestion = question.toLocaleLowerCase();

  if (
    audience === "lecturer" &&
    (normalizedQuestion.includes("phân tích") ||
      normalizedQuestion.includes("thống kê") ||
      normalizedQuestion.includes("dữ liệu"))
  ) {
    return "Tôi có thể hỗ trợ bạn xem số liệu lớp học, mức độ tham gia và tình hình câu hỏi. Hãy mở Dashboard để theo dõi phân tích chi tiết.";
  }

  if (normalizedQuestion.includes("lớp")) {
    return audience === "student"
      ? "Bạn có thể xem các lớp đã tham gia trong mục My Class. Bạn cần hỗ trợ bài học của lớp nào?"
      : "Bạn có thể mở mục Quản lý lớp học để xem và quản lý các lớp. Bạn muốn tìm hiểu thao tác nào cụ thể?";
  }

  if (
    normalizedQuestion.includes("câu hỏi") ||
    normalizedQuestion.includes("question")
  ) {
    return audience === "student"
      ? "Bạn có thể gửi câu hỏi trong mục Question Center. Hãy mô tả bài học hoặc khái niệm bạn đang cần giải đáp nhé."
      : "Bạn có thể xem và trả lời câu hỏi trong mục Question Grouping. Hãy cho tôi biết bạn cần hỗ trợ phần nào nhé.";
  }

  if (
    normalizedQuestion.includes("bài giảng") ||
    normalizedQuestion.includes("buổi học") ||
    normalizedQuestion.includes("bài học")
  ) {
    return audience === "student"
      ? "Bạn có thể xem nội dung và bản tổng hợp bài giảng trong lớp học của mình. Hãy cho tôi biết chủ đề bạn muốn tìm hiểu."
      : "Bạn có thể xem các buổi học và nội dung bài giảng tại trang lớp học hoặc phòng học trực tiếp.";
  }

  return audience === "student"
    ? "Cảm ơn bạn đã gửi câu hỏi. Tôi đang ở chế độ hỗ trợ thử nghiệm; hãy hỏi tôi về bài học, bài giảng hoặc câu hỏi của bạn."
    : "Cảm ơn bạn đã gửi câu hỏi. Tôi đang ở chế độ hỗ trợ thử nghiệm; bạn có thể hỏi về quản lý lớp, dữ liệu hoặc câu hỏi.";
}

export default function FloatingChat({ audience }: FloatingChatProps) {
  const pathname = usePathname();
  const resolvedAudience = audience ?? audienceFromPath(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    welcomeMessage(resolvedAudience),
  ]);
  const nextMessageId = useRef(2);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = chatBodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: nextMessageId.current++, role: "user", text },
    ]);
    setInput("");

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextMessageId.current++,
          role: "assistant",
          text: createReply(text, resolvedAudience),
        },
      ]);
    }, 1000);
  }

  return (
    <>
      {isOpen && (
        <section
          className={styles.chatWindow}
          aria-label="Trò chuyện với trợ lý AI"
        >
          <header className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <span className={styles.botAvatar}>
                <Bot size={20} />
              </span>
              <div>
                <p className={styles.chatTitle}>Trợ lý AI</p>
                <p className={styles.chatStatus}>
                  <span className={styles.statusDot} />
                  Luôn sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Đóng cửa sổ trò chuyện"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </header>

          <div
            ref={chatBodyRef}
            className={styles.chatBody}
            aria-live="polite"
          >
            {messages.map((message) =>
              message.role === "assistant" ? (
                <div key={message.id} className={styles.messageRow}>
                  <span className={styles.messageAvatar}>
                    <Bot size={15} />
                  </span>
                  <p className={styles.botMessage}>{message.text}</p>
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${styles.userMessageRow}`}
                >
                  <p className={styles.userMessage}>{message.text}</p>
                </div>
              ),
            )}
          </div>

          <form className={styles.chatFooter} onSubmit={handleSubmit}>
            <input
              className={styles.chatInput}
              type="text"
              placeholder="Nhập câu hỏi..."
              aria-label="Nhập câu hỏi"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              className={styles.sendButton}
              type="submit"
              aria-label="Gửi tin nhắn"
              disabled={!input.trim()}
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={styles.chatBubbleBtn}
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
}

// classCodeGenerator.ts
// Sinh mã lớp + nội dung QR, và xử lý lịch học (sinh buổi học, trạng thái lớp).
// Mã sinh ra được kiểm tra để không bao giờ trùng với mã của lớp khác.

// Bộ ký tự dùng để sinh mã — bỏ các ký tự dễ nhầm lẫn: 0/O, 1/I
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Sinh 1 mã ngẫu nhiên dạng "ABCD-EFGH" (8 ký tự, có gạch ngang cho dễ đọc/gõ)
function randomCode(): string {
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    if (i === 3) result += "-";
  }
  return result;
}

/**
 * Sinh mã lớp học DUY NHẤT (không trùng với các mã đã tồn tại).
 * @param existingCodes Danh sách mã lớp đang có (lấy từ database khi tích hợp thật)
 */
export function generateUniqueClassCode(existingCodes: string[]): string {
  let code = randomCode();
  // Nếu trùng mã đã có, sinh lại cho tới khi ra mã mới hoàn toàn
  while (existingCodes.includes(code)) {
    code = randomCode();
  }
  return code;
}

/**
 * Nội dung sẽ được encode thành hình QR cho lớp học đó.
 * Mỗi mã lớp là duy nhất -> QR sinh ra từ nó cũng là duy nhất, không lớp nào trùng lớp nào.
 */
export function generateQrPayload(classCode: string): string {
  return `classbridge://join?code=${classCode}`;
}

// ======================= LỊCH HỌC =======================

export type Session = {
  date: string; // "YYYY-MM-DD" (giờ địa phương)
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
};

export type ClassStatus = "ongoing" | "upcoming" | "finished";

// value khớp với Date.getDay(): CN = 0, T2 = 1, ... T7 = 6
export const WEEKDAYS = [
  { label: "T2", value: 1 },
  { label: "T3", value: 2 },
  { label: "T4", value: 3 },
  { label: "T5", value: 4 },
  { label: "T6", value: 5 },
  { label: "T7", value: 6 },
  { label: "CN", value: 0 },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toYMD(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`); // không có "Z" => giờ địa phương
}

/**
 * Sinh `total` buổi học, bắt đầu từ hôm nay, rơi vào các thứ đã chọn.
 * Buổi hôm nay đã kết thúc rồi thì bỏ qua.
 */
export function generateSessions(
  weekdays: number[],
  total: number,
  startTime: string,
  endTime: string,
  now: Date = new Date(),
): Session[] {
  const sessions: Session[] = [];
  if (!weekdays.length || total <= 0) return sessions;

  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Giới hạn 2 năm để tránh vòng lặp vô hạn
  for (let i = 0; i < 730 && sessions.length < total; i++) {
    if (weekdays.includes(cursor.getDay())) {
      const date = toYMD(cursor);
      if (toDateTime(date, endTime) > now) {
        sessions.push({ date, startTime, endTime });
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return sessions;
}

/** Buổi học đang diễn ra hoặc buổi sắp tới gần nhất. Null nếu đã học xong hết. */
export function getNextSession(sessions: Session[], now: Date) {
  const upcoming = sessions
    .map((s) => ({
      session: s,
      start: toDateTime(s.date, s.startTime),
      end: toDateTime(s.date, s.endTime),
    }))
    .filter((x) => x.end > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  return upcoming[0] ?? null;
}

export function getClassStatus(sessions: Session[], now: Date): ClassStatus {
  const next = getNextSession(sessions, now);
  if (!next) return "finished";
  return next.start <= now ? "ongoing" : "upcoming";
}

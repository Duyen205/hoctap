import type { ClassItem, Student } from "./types";

export const CLASSES: ClassItem[] = [
  {
    id: "c1",
    code: "CMU-IS 482 CIS · 2627",
    name: "AI in Education (CS101)",
    isLive: true,
  },
  {
    id: "c2",
    code: "CMU-IS 305 · 2627",
    name: "Software Testing (SE305)",
    isLive: false,
  },
  {
    id: "c3",
    code: "CMU-IS 210 · 2627",
    name: "Database Systems (DB210)",
    isLive: false,
  },
];

export const STUDENTS: Student[] = [
  { id: 1, classId: "c1", name: "Nguyễn Văn Anh", studentId: "2105000124", joined: true, joinedAt: "09:20", questionCount: 3 },
  { id: 2, classId: "c1", name: "Trần Thị Bích Ngọc", studentId: "2105000340", joined: true, joinedAt: "09:43", questionCount: 2 },
  { id: 3, classId: "c1", name: "Lê Minh Đức", studentId: "2105001672", joined: true, joinedAt: "09:10", questionCount: 1 },
  { id: 4, classId: "c1", name: "Phạm Thị Hồng Nhung", studentId: "2105004581", joined: true, joinedAt: "09:32", questionCount: 4 },
  { id: 5, classId: "c1", name: "Ngô Văn Long", studentId: "2105000564", joined: false, joinedAt: "-", questionCount: 0 },
  { id: 6, classId: "c1", name: "Đặng Minh Khang", studentId: "2105000731", joined: true, joinedAt: "09:18", questionCount: 2 },
  { id: 7, classId: "c1", name: "Hoàng Thị Mai", studentId: "2105000816", joined: true, joinedAt: "09:26", questionCount: 0 },
  { id: 8, classId: "c1", name: "Võ Quốc Bảo", studentId: "2105000920", joined: false, joinedAt: "-", questionCount: 0 },
  { id: 9, classId: "c1", name: "Đỗ Thị Hà", studentId: "2105001042", joined: true, joinedAt: "09:35", questionCount: 1 },
  { id: 10, classId: "c1", name: "Bùi Gia Huy", studentId: "2105001178", joined: true, joinedAt: "09:41", questionCount: 3 },
  { id: 11, classId: "c1", name: "Phan Ngọc Linh", studentId: "2105001288", joined: true, joinedAt: "09:15", questionCount: 2 },
  { id: 12, classId: "c1", name: "Nguyễn Hoàng Nam", studentId: "2105001394", joined: false, joinedAt: "-", questionCount: 0 },
  { id: 13, classId: "c1", name: "Lý Khánh Vy", studentId: "2105001406", joined: true, joinedAt: "09:39", questionCount: 1 },
  { id: 14, classId: "c1", name: "Trương Minh Quân", studentId: "2105001530", joined: true, joinedAt: "09:22", questionCount: 2 },
  { id: 15, classId: "c1", name: "Đinh Thùy Dương", studentId: "2105001662", joined: true, joinedAt: "09:30", questionCount: 0 },
  { id: 16, classId: "c1", name: "Hồ Đức Anh", studentId: "2105001775", joined: false, joinedAt: "-", questionCount: 0 },
  { id: 17, classId: "c1", name: "Mai Thanh Tâm", studentId: "2105001820", joined: true, joinedAt: "09:28", questionCount: 1 },
  { id: 18, classId: "c1", name: "Đặng Ngọc Hân", studentId: "2105001932", joined: true, joinedAt: "09:37", questionCount: 2 },
  { id: 19, classId: "c1", name: "Vũ Anh Tú", studentId: "2105002041", joined: true, joinedAt: "09:12", questionCount: 0 },
  { id: 20, classId: "c1", name: "Nguyễn Thùy Trang", studentId: "2105002158", joined: false, joinedAt: "-", questionCount: 0 },
  { id: 21, classId: "c1", name: "Phạm Quốc Việt", studentId: "2105002264", joined: true, joinedAt: "09:44", questionCount: 1 },
  { id: 22, classId: "c1", name: "Lê Hải Yến", studentId: "2105002370", joined: true, joinedAt: "09:17", questionCount: 2 },
  { id: 23, classId: "c1", name: "Trần Minh Khôi", studentId: "2105002486", joined: true, joinedAt: "09:24", questionCount: 0 },
  { id: 24, classId: "c2", name: "Trần Bảo Long", studentId: "2103000456", joined: true, joinedAt: "08:58", questionCount: 1 },
  { id: 25, classId: "c2", name: "Nguyễn Thị Thu", studentId: "2103000789", joined: false, joinedAt: "-", questionCount: 0 },
  { id: 26, classId: "c3", name: "Phạm Đình Khoa", studentId: "2104000111", joined: true, joinedAt: "10:05", questionCount: 2 },
  { id: 27, classId: "c3", name: "Lâm Thị Ngân", studentId: "2104000233", joined: true, joinedAt: "10:02", questionCount: 0 },
];

export function getAvatarColor(name: string) {
  const colors = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #3b82f6, #2563eb)",
    "linear-gradient(135deg, #10b981, #059669)",
    "linear-gradient(135deg, #f59e0b, #d97706)",
    "linear-gradient(135deg, #ec4899, #db2777)",
  ];
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getInitial(name: string) {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1]?.charAt(0).toUpperCase() || "S";
}

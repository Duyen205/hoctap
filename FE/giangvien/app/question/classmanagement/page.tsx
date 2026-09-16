"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import styles from "./classmanagement.module.css";

type Student = {
  id: number;
  name: string;
  studentId: string;
  joined: boolean;
  joinedAt: string;
  questionCount: number;
};

const STUDENTS: Student[] = [
  {
    id: 1,
    name: "Nguyễn Văn Anh",
    studentId: "2105000124",
    joined: true,
    joinedAt: "09:20",
    questionCount: 3,
  },
  {
    id: 2,
    name: "Trần Thị Bích Ngọc",
    studentId: "2105000340",
    joined: true,
    joinedAt: "09:43",
    questionCount: 2,
  },
  {
    id: 3,
    name: "Lê Minh Đức",
    studentId: "2105001672",
    joined: true,
    joinedAt: "09:10",
    questionCount: 1,
  },
  {
    id: 4,
    name: "Phạm Thị Hồng Nhung",
    studentId: "2105004581",
    joined: true,
    joinedAt: "09:32",
    questionCount: 4,
  },
  {
    id: 5,
    name: "Ngô Văn Long",
    studentId: "2105000564",
    joined: false,
    joinedAt: "-",
    questionCount: 0,
  },
  {
    id: 6,
    name: "Đặng Minh Khang",
    studentId: "2105000731",
    joined: true,
    joinedAt: "09:18",
    questionCount: 2,
  },
  {
    id: 7,
    name: "Hoàng Thị Mai",
    studentId: "2105000816",
    joined: true,
    joinedAt: "09:26",
    questionCount: 0,
  },
  {
    id: 8,
    name: "Võ Quốc Bảo",
    studentId: "2105000920",
    joined: false,
    joinedAt: "-",
    questionCount: 0,
  },
  {
    id: 9,
    name: "Đỗ Thị Hà",
    studentId: "2105001042",
    joined: true,
    joinedAt: "09:35",
    questionCount: 1,
  },
  {
    id: 10,
    name: "Bùi Gia Huy",
    studentId: "2105001178",
    joined: true,
    joinedAt: "09:41",
    questionCount: 3,
  },
  {
    id: 11,
    name: "Phan Ngọc Linh",
    studentId: "2105001288",
    joined: true,
    joinedAt: "09:15",
    questionCount: 2,
  },
  {
    id: 12,
    name: "Nguyễn Hoàng Nam",
    studentId: "2105001394",
    joined: false,
    joinedAt: "-",
    questionCount: 0,
  },
  {
    id: 13,
    name: "Lý Khánh Vy",
    studentId: "2105001406",
    joined: true,
    joinedAt: "09:39",
    questionCount: 1,
  },
  {
    id: 14,
    name: "Trương Minh Quân",
    studentId: "2105001530",
    joined: true,
    joinedAt: "09:22",
    questionCount: 2,
  },
  {
    id: 15,
    name: "Đinh Thùy Dương",
    studentId: "2105001662",
    joined: true,
    joinedAt: "09:30",
    questionCount: 0,
  },
  {
    id: 16,
    name: "Hồ Đức Anh",
    studentId: "2105001775",
    joined: false,
    joinedAt: "-",
    questionCount: 0,
  },
  {
    id: 17,
    name: "Mai Thanh Tâm",
    studentId: "2105001820",
    joined: true,
    joinedAt: "09:28",
    questionCount: 1,
  },
  {
    id: 18,
    name: "Đặng Ngọc Hân",
    studentId: "2105001932",
    joined: true,
    joinedAt: "09:37",
    questionCount: 2,
  },
  {
    id: 19,
    name: "Vũ Anh Tú",
    studentId: "2105002041",
    joined: true,
    joinedAt: "09:12",
    questionCount: 0,
  },
  {
    id: 20,
    name: "Nguyễn Thùy Trang",
    studentId: "2105002158",
    joined: false,
    joinedAt: "-",
    questionCount: 0,
  },
  {
    id: 21,
    name: "Phạm Quốc Việt",
    studentId: "2105002264",
    joined: true,
    joinedAt: "09:44",
    questionCount: 1,
  },
  {
    id: 22,
    name: "Lê Hải Yến",
    studentId: "2105002370",
    joined: true,
    joinedAt: "09:17",
    questionCount: 2,
  },
  {
    id: 23,
    name: "Trần Minh Khôi",
    studentId: "2105002486",
    joined: true,
    joinedAt: "09:24",
    questionCount: 0,
  },
];

// embedded dùng để lấp đầy vùng main khi hiển thị trong trang Question grouping.
type ClassManagementPageProps = {
  embedded?: boolean;
};

export default function ClassManagementPage({
  embedded = false,
}: ClassManagementPageProps = {}) {
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return STUDENTS;
    return STUDENTS.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query),
    );
  }, [search]);

  const visibleStudents = filteredStudents;

  function handleSearch(value: string) {
    setSearch(value);
  }

  return (
    <main className={`${styles.page} ${embedded ? styles.pageEmbedded : ""}`}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>CMU-IS 482 CIS · 2627</p>
            <h1>Danh sách sinh viên ({filteredStudents.length})</h1>
          </div>
          <span className={styles.liveBadge}>Lớp đang diễn ra</span>
        </div>

        <label className={styles.searchBox}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Tìm kiếm theo tên hoặc MSSV..."
            aria-label="Tìm kiếm sinh viên"
          />
        </label>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sinh viên / MSSV</th>
                <th>Trạng thái</th>
                <th>Tham gia</th>
                <th>Câu hỏi</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student, index) => (
                <tr key={student.id}>
                  <td className={styles.indexCell}>{index + 1}</td>
                  <td>
                    <strong>{student.name}</strong>
                    <span className={styles.studentId}>
                      {student.studentId}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${student.joined ? styles.joined : styles.notJoined}`}
                    >
                      {student.joined ? "Đã tham gia" : "Chưa tham gia"}
                    </span>
                  </td>
                  <td className={styles.timeCell}>{student.joinedAt}</td>
                  <td className={styles.questionCell}>
                    {student.questionCount}
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Không tìm thấy sinh viên phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

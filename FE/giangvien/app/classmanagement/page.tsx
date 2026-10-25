"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "../account-logo/AccountMenu";
import Layout from "../components/Layout";
import ClassGrid from "./ClassGrid";
import StudentDetailPage from "./StudentDetailPage";
import { CLASSES, STUDENTS } from "./data";
import type { StudentStatusFilter } from "./types";
import styles from "./classmanagement.module.css";

export default function ClassManagementPage() {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StudentStatusFilter>("all");

  const selectedClass =
    CLASSES.find((classItem) => classItem.id === selectedClassId) ?? null;
  const studentsInClass = useMemo(
    () => STUDENTS.filter((student) => student.classId === selectedClassId),
    [selectedClassId],
  );
  const filteredStudents = useMemo(() => {
    let result = studentsInClass;
    if (statusFilter === "joined") {
      result = result.filter((student) => student.joined);
    }

    const query = search.trim().toLocaleLowerCase();
    if (query) {
      result = result.filter(
        (student) =>
          student.name.toLocaleLowerCase().includes(query) ||
          student.studentId.includes(query),
      );
    }

    return result;
  }, [search, studentsInClass, statusFilter]);

  const stats = useMemo(() => ({
    total: studentsInClass.length,
    joined: studentsInClass.filter((student) => student.joined).length,
    totalQuestions: studentsInClass.reduce(
      (sum, student) => sum + student.questionCount,
      0,
    ),
  }), [studentsInClass]);

  function handleOpenClass(classId: string) {
    setSelectedClassId(classId);
    setSearch("");
    setStatusFilter("all");
  }

  function handleBackToClassList() {
    setSelectedClassId(null);
    setSearch("");
    setStatusFilter("all");
  }

  async function handleExportExcel() {
    if (!selectedClass || filteredStudents.length === 0) return;

    const XLSX = await import("xlsx");
    const rows = filteredStudents.map((student, index) => ({
      STT: index + 1,
      "Tên sinh viên": student.name,
      MSSV: student.studentId,
      "Trạng thái": student.joined ? "Đã tham gia" : "Chưa tham gia",
      "Thời gian tham gia": student.joinedAt,
      "Số câu hỏi": student.questionCount,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 14 },
      { wch: 16 },
      { wch: 20 },
      { wch: 12 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách sinh viên");
    const safeName = selectedClass.name.replace(/[\\/:*?"<>|]/g, "").trim();
    XLSX.writeFile(workbook, `Danh-sach-sinh-vien_${safeName}.xlsx`);
  }

  return (
    <Layout
      className={styles.page}
      mainClassName={styles.main}
      headerActions={
        <AccountMenu
          teacherName={teacherName}
          onSaveAccountInfo={(info) => setTeacherName(info.username)}
          onSubmitPasswordChange={(oldPassword, newPassword) => {
            console.log("Đổi mật khẩu:", { oldPassword, newPassword });
          }}
          onLogout={() => console.log("Đăng xuất")}
        />
      }
    >
      {selectedClass ? (
        <StudentDetailPage
          selectedClass={selectedClass}
          filteredStudents={filteredStudents}
          search={search}
          statusFilter={statusFilter}
          stats={stats}
          onBack={handleBackToClassList}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onOpenQuestions={() =>
            router.push(`/question?classId=${selectedClass.id}`)
          }
          onExport={handleExportExcel}
        />
      ) : (
        <ClassGrid
          classes={CLASSES}
          studentCounts={Object.fromEntries(
            CLASSES.map((classItem) => [
              classItem.id,
              STUDENTS.filter((student) => student.classId === classItem.id)
                .length,
            ]),
          )}
          onSelectClass={handleOpenClass}
        />
      )}
    </Layout>
  );
}

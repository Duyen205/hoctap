"use client";

import {
  CheckCircle2,
  ChevronLeft,
  FileSpreadsheet,
  GraduationCap,
  HelpCircle,
  Radio,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import type {
  ClassItem,
  Student,
  StudentStats,
  StudentStatusFilter,
} from "./types";
import { getAvatarColor, getInitial } from "./data";
import styles from "./classmanagement.module.css";

type StudentDetailPageProps = {
  selectedClass: ClassItem;
  filteredStudents: Student[];
  search: string;
  statusFilter: StudentStatusFilter;
  stats: StudentStats;
  onBack: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: StudentStatusFilter) => void;
  onOpenQuestions: () => void;
  onExport: () => void;
};

export default function StudentDetailPage({
  selectedClass,
  filteredStudents,
  search,
  statusFilter,
  stats,
  onBack,
  onSearchChange,
  onStatusFilterChange,
  onOpenQuestions,
  onExport,
}: StudentDetailPageProps) {
  return (
    <section className={styles.containerSection}>
      <button
        type="button"
        className={styles.backLinkButton}
        onClick={onBack}
      >
        <ChevronLeft size={18} /> Quay lại danh sách lớp
      </button>

      <div className={styles.detailHeaderBar}>
        <div>
          <p className={styles.eyebrowCode}>{selectedClass.code}</p>
          <h1 className={styles.detailTitle}>{selectedClass.name}</h1>
        </div>

        {selectedClass.isLive && (
          <span className={styles.liveStatusBadgeLarge}>
            <Radio size={16} /> Đang trong giờ học trực tuyến
          </span>
        )}
      </div>

      <div className={styles.statsRow}>
        <div
          className={`${styles.statCard} ${
            statusFilter === "all" ? styles.statCardActive : ""
          }`}
          onClick={() => onStatusFilterChange("all")}
          title="Nhấn để xem tất cả sinh viên"
        >
          <div
            className={styles.statIconBox}
            style={{ background: "#eff6ff", color: "#3b82f6" }}
          >
            <GraduationCap size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Tổng sinh viên</span>
            <h3 className={styles.statValue}>{stats.total}</h3>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${
            statusFilter === "joined" ? styles.statCardActive : ""
          }`}
          onClick={() => onStatusFilterChange("joined")}
          title="Nhấn để lọc danh sách sinh viên đã tham gia"
        >
          <div
            className={styles.statIconBox}
            style={{ background: "#ecfdf5", color: "#10b981" }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Đã tham gia</span>
            <h3 className={styles.statValue}>{stats.joined}</h3>
          </div>
        </div>

        <div
          className={styles.statCard}
          onClick={onOpenQuestions}
          title="Nhấn để chuyển đến trang Gom nhóm câu hỏi của lớp này"
        >
          <div
            className={styles.statIconBox}
            style={{ background: "#fff7ed", color: "#f97316" }}
          >
            <HelpCircle size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Tổng câu hỏi gửi</span>
            <h3 className={styles.statValue}>{stats.totalQuestions}</h3>
          </div>
        </div>
      </div>

      <div className={styles.actionToolbar}>
        <div className={styles.modernSearchInput}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm sinh viên theo tên hoặc MSSV..."
          />
        </div>

        <button
          type="button"
          className={styles.primaryExportBtn}
          onClick={onExport}
          disabled={filteredStudents.length === 0}
        >
          <FileSpreadsheet size={18} /> Xuất Báo Cáo Excel
        </button>
      </div>

      <div className={styles.tableCardWrapper}>
        <table className={styles.styledTable}>
          <thead>
            <tr>
              <th style={{ width: "70px", textAlign: "center" }}>STT</th>
              <th>Sinh viên &amp; MSSV</th>
              <th>Trạng thái điểm danh</th>
              <th>Thời gian vào lớp</th>
              <th style={{ textAlign: "center" }}>Số câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td className={styles.centerText}>{index + 1}</td>
                <td>
                  <div className={styles.studentProfileCell}>
                    <div
                      className={styles.avatarCircle}
                      style={{ background: getAvatarColor(student.name) }}
                    >
                      {getInitial(student.name)}
                    </div>
                    <div className={styles.studentInfoMeta}>
                      <strong className={styles.studentNameText}>
                        {student.name}
                      </strong>
                      <span className={styles.studentCodeText}>
                        MSSV: {student.studentId}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  {student.joined ? (
                    <span className={styles.statusPillSuccess}>
                      <CheckCircle2 size={13} /> Đã vào lớp
                    </span>
                  ) : (
                    <span className={styles.statusPillMuted}>
                      <XCircle size={13} /> Vắng mặt
                    </span>
                  )}
                </td>
                <td className={styles.timeTextCell}>{student.joinedAt}</td>
                <td className={styles.centerText}>
                  <span
                    className={`${styles.questionBadge} ${
                      student.questionCount > 0
                        ? styles.activeQuestionBadge
                        : ""
                    }`}
                  >
                    {student.questionCount}
                  </span>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyTableState}>
                  <Users size={32} />
                  <p>Không tìm thấy sinh viên khớp với điều kiện lọc.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

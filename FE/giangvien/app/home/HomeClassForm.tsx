"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  Check,
  Copy,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import styles from "./home.module.css";
import type {
  CopiedValue,
  HomeFormView,
} from "./types";
import { WEEKDAYS } from "./types";

type HomeClassFormProps = {
  view: HomeFormView;
  editingClassId: string | null;
  subjectName: string;
  classCode: string;
  sessionCount: string;
  startTime: string;
  endTime: string;
  selectedDays: string[];
  sessionError: string | null;
  copied: CopiedValue;
  joinLink: string;
  qrPayload: string;
  onSubjectNameChange: (value: string) => void;
  onSessionCountChange: (value: string) => void;
  onValidateSessionCount: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onToggleDay: (day: string) => void;
  onRegenerateCode: () => void;
  onImportSchedule: () => void;
  onSave: () => void;
  onReset: () => void;
  onCopy: (value: "code" | "link") => void;
};

export default function HomeClassForm({
  view,
  editingClassId,
  subjectName,
  classCode,
  sessionCount,
  startTime,
  endTime,
  selectedDays,
  sessionError,
  copied,
  joinLink,
  qrPayload,
  onSubjectNameChange,
  onSessionCountChange,
  onValidateSessionCount,
  onStartTimeChange,
  onEndTimeChange,
  onToggleDay,
  onRegenerateCode,
  onImportSchedule,
  onSave,
  onReset,
  onCopy,
}: HomeClassFormProps) {
  return (
    <section className={styles.formCard}>
      {view === "create" ? (
        <>
          <div className={styles.formCardHeader}>
            <span className={styles.formCardIcon}>
              {editingClassId ? "✎" : "+"}
            </span>
            <h2 className={styles.sectionTitle}>
              {editingClassId ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
            </h2>
          </div>

          <label className={styles.label}>
            Tên môn học <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Vui lòng nhập tên môn học"
            value={subjectName}
            onChange={(event) => onSubjectNameChange(event.target.value)}
          />

          <label className={styles.label}>
            Mã lớp <span className={styles.required}>*</span>
          </label>
          <div className={styles.codeRow}>
            <input
              type="text"
              className={styles.input}
              value={classCode}
              readOnly
            />
            {!editingClassId && (
              <button
                type="button"
                className={styles.regenerateBtn}
                onClick={onRegenerateCode}
                title="Tạo mã khác"
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>

          <label className={styles.label}>
            Lịch học <span className={styles.required}>*</span>
          </label>
          <div className={styles.scheduleModeRow}>
            <button
              type="button"
              className={`${styles.scheduleModeBtn} ${styles.scheduleModeBtnActive}`}
            >
              <Calendar size={16} /> Nhập thủ công
            </button>
            <button
              type="button"
              className={styles.scheduleModeBtn}
              onClick={onImportSchedule}
            >
              <FileSpreadsheet size={16} /> Import file Excel
            </button>
          </div>

          <div className={styles.sessionTimeRow}>
            <div className={styles.sessionTimeCol}>
              <label className={styles.label}>
                Số buổi học <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.input} ${sessionError ? styles.inputError : ""}`}
                placeholder="Nhập số buổi"
                value={sessionCount}
                onChange={(event) => onSessionCountChange(event.target.value)}
                onBlur={(event) => onValidateSessionCount(event.target.value)}
              />
              {sessionError && (
                <div className={styles.errorText}>{sessionError}</div>
              )}
            </div>
            <div className={styles.sessionTimeCol}>
              <label className={styles.label}>
                Giờ bắt đầu - kết thúc{" "}
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.timeRow}>
                <div className={styles.timeInputWrap}>
                  <input
                    type="time"
                    className={styles.input}
                    value={startTime}
                    onChange={(event) => onStartTimeChange(event.target.value)}
                  />
                </div>
                <span className={styles.timeDash}>–</span>
                <div className={styles.timeInputWrap}>
                  <input
                    type="time"
                    className={styles.input}
                    value={endTime}
                    onChange={(event) => onEndTimeChange(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <label className={styles.label}>
            Ngày học trong tuần <span className={styles.required}>*</span>
          </label>
          <div className={styles.weekdayRow}>
            {WEEKDAYS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`${styles.weekdayBtn} ${selectedDays.includes(key) ? styles.weekdayBtnActive : ""}`}
                onClick={() => onToggleDay(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {editingClassId ? (
            <div className={styles.formActionRow}>
              <button className={styles.cancelBtn} onClick={onReset}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={onSave}>
                Save
              </button>
            </div>
          ) : (
            <button className={styles.createBtn} onClick={onSave}>
              + Tạo lớp học
            </button>
          )}
        </>
      ) : (
        <>
          <h2 className={styles.sectionTitle}>Đã tạo lớp học</h2>
          <p className={styles.resultInlineSubtitle}>
            Chia sẻ mã lớp, link hoặc mã QR cho sinh viên để tham gia.
          </p>
          <div className={styles.inlineResultCenter}>
            <div className={styles.bigQrWrap}>
              <QRCodeSVG value={qrPayload} size={220} />
            </div>
            <div className={styles.bigCodeRow}>
              <span className={styles.bigCode}>{classCode}</span>
              <button
                className={styles.copyIconBtn}
                onClick={() => onCopy("code")}
              >
                {copied === "code" ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className={styles.linkRow}>
              <span className={styles.linkText}>{joinLink}</span>
              <button
                className={styles.copyIconBtn}
                onClick={() => onCopy("link")}
              >
                {copied === "link" ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <button className={styles.createBtn} onClick={onReset}>
            Tạo lớp học khác
          </button>
        </>
      )}
    </section>
  );
}

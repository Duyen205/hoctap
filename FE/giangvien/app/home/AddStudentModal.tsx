"use client";

import { X } from "lucide-react";
import styles from "./home.module.css";
import type { StudentForm, StudentFormErrors } from "./types";

type AddStudentModalProps = {
  form: StudentForm;
  errors: StudentFormErrors;
  onClose: () => void;
  onChange: (field: keyof StudentForm, value: string) => void;
  onSubmit: () => void;
};

export default function AddStudentModal({
  form,
  errors,
  onClose,
  onChange,
  onSubmit,
}: AddStudentModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Thêm sinh viên</h3>
          <button
            type="button"
            className={styles.closeIconBtn}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div>
            <label className={styles.label}>
              Họ tên sinh viên <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
              placeholder="Nhập họ và tên (chỉ chứa chữ)"
              value={form.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
            />
            {errors.fullName && (
              <div className={styles.errorText}>{errors.fullName}</div>
            )}
          </div>

          <div>
            <label className={styles.label}>
              Mã số sinh viên <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              maxLength={11}
              className={`${styles.input} ${errors.studentId ? styles.inputError : ""}`}
              placeholder="Nhập đúng 11 chữ số"
              value={form.studentId}
              onChange={(event) => onChange("studentId", event.target.value)}
            />
            {errors.studentId && (
              <div className={styles.errorText}>{errors.studentId}</div>
            )}
          </div>

          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="VD: example@gmail.com"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
            />
            {errors.email && (
              <div className={styles.errorText}>{errors.email}</div>
            )}
          </div>

          <div>
            <label className={styles.label}>Số điện thoại</label>
            <input
              type="text"
              maxLength={10}
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              placeholder="Nhập đủ 10 chữ số"
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
            />
            {errors.phone && (
              <div className={styles.errorText}>{errors.phone}</div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.addBtn} onClick={onSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

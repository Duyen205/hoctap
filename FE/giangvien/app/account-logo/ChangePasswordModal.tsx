"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import styles from "./account-logo.module.css";
import type { ChangePasswordModalProps } from "./types";

export default function ChangePasswordModal({
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!oldPassword || !newPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.");
      return;
    }
    setError("");
    onSubmit(oldPassword, newPassword);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Đổi mật khẩu</h3>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <label className={styles.fieldLabel}>Mật khẩu cũ</label>
          <div className={styles.passwordFieldWrap}>
            <input
              type={showOld ? "text" : "password"}
              className={styles.fieldInput}
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowOld((previous) => !previous)}
              aria-label={showOld ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label className={styles.fieldLabel}>Mật khẩu mới</label>
          <div className={styles.passwordFieldWrap}>
            <input
              type={showNew ? "text" : "password"}
              className={styles.fieldInput}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowNew((previous) => !previous)}
              aria-label={showNew ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleSubmit}
          >
            Cập nhật mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}

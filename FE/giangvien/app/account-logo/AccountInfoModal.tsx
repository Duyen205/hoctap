"use client";

import { useState, type ChangeEvent } from "react";
import { Camera, X } from "lucide-react";
import styles from "./account-logo.module.css";
import type { AccountInfoModalProps } from "./types";

export default function AccountInfoModal({
  teacherName,
  avatarUrl,
  onClose,
  onSave,
}: AccountInfoModalProps) {
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [username, setUsername] = useState(teacherName);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [hobbies, setHobbies] = useState("");

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function handleSubmit() {
    onSave({ avatarUrl: preview, username, dateOfBirth, hobbies });
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Thông tin tài khoản</h3>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.avatarEditWrap}>
            <div className={styles.avatarEditPreview}>
              {preview ? (
                <img src={preview} alt={username} />
              ) : (
                <span>{username?.trim().charAt(0).toUpperCase() || "?"}</span>
              )}
            </div>
            <label className={styles.avatarEditBtn}>
              <Camera size={14} />
              <span>Đổi ảnh đại diện</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <label className={styles.fieldLabel}>Tên đăng nhập</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <label className={styles.fieldLabel}>Ngày tháng năm sinh</label>
          <input
            type="date"
            className={styles.fieldInput}
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />

          <label className={styles.fieldLabel}>Sở thích</label>
          <textarea
            className={styles.fieldTextarea}
            placeholder="Ví dụ: đọc sách, chơi thể thao, nghe nhạc..."
            value={hobbies}
            onChange={(event) => setHobbies(event.target.value)}
          />
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
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

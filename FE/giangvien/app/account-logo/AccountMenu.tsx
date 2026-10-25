"use client";

import { useState } from "react";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import AccountInfoModal from "./AccountInfoModal";
import ChangePasswordModal from "./ChangePasswordModal";
import styles from "./account-logo.module.css";
import type { AccountInfo, AccountMenuProps } from "./types";

export type { AccountInfo } from "./types";

export default function AccountMenu({
  teacherName,
  avatarUrl,
  onSaveAccountInfo,
  onSubmitPasswordChange,
  onLogout,
}: AccountMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const initials = teacherName?.trim()
    ? teacherName.trim().charAt(0).toUpperCase()
    : "?";

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function saveAccountInfo(info: AccountInfo) {
    onSaveAccountInfo?.(info);
    setIsInfoModalOpen(false);
  }

  function submitPasswordChange(oldPassword: string, newPassword: string) {
    onSubmitPasswordChange?.(oldPassword, newPassword);
    setIsPasswordModalOpen(false);
  }

  return (
    <div className={styles.accountMenuWrap}>
      <button
        type="button"
        className={styles.avatarTrigger}
        aria-label="Mở menu tài khoản"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((previous) => !previous)}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={teacherName} className={styles.avatarImg} />
        ) : (
          initials
        )}
      </button>

      {isMenuOpen && (
        <>
          <div
            className={styles.accountMenuOverlay}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className={styles.accountMenuPopup}>
            <div className={styles.accountMenuHeader}>
              <div className={styles.accountMenuAvatarBig}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={teacherName}
                    className={styles.avatarImg}
                  />
                ) : (
                  initials
                )}
              </div>
              <div className={styles.accountMenuName}>{teacherName}</div>
            </div>

            <div className={styles.accountMenuDivider} />

            <button
              type="button"
              className={styles.accountMenuItem}
              onClick={() => {
                closeMenu();
                setIsInfoModalOpen(true);
              }}
            >
              <UserRound size={16} />
              <span>Thông tin tài khoản</span>
            </button>

            <button
              type="button"
              className={styles.accountMenuItem}
              onClick={() => {
                closeMenu();
                setIsPasswordModalOpen(true);
              }}
            >
              <KeyRound size={16} />
              <span>Đổi mật khẩu</span>
            </button>

            <button
              type="button"
              className={`${styles.accountMenuItem} ${styles.accountMenuLogout}`}
              onClick={() => {
                closeMenu();
                onLogout?.();
              }}
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </>
      )}

      {isInfoModalOpen && (
        <AccountInfoModal
          teacherName={teacherName}
          avatarUrl={avatarUrl}
          onClose={() => setIsInfoModalOpen(false)}
          onSave={saveAccountInfo}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={submitPasswordChange}
        />
      )}
    </div>
  );
}

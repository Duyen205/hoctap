"use client";

import { ArrowLeft, CameraIcon, ChevronDown, Hash, X } from "lucide-react";
import styles from "./home.module.css";
import type { JoinScreen } from "./types";

type JoinClassFlowProps = {
  screen: Exclude<JoinScreen, "none">;
  classCode: string;
  displayName: string;
  noAudio: boolean;
  noVideo: boolean;
  isScanning: boolean;
  onBack: () => void;
  onClassCodeChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onNoAudioChange: (value: boolean) => void;
  onNoVideoChange: (value: boolean) => void;
  onJoin: () => void;
  onQrScanned: () => void;
};

export default function JoinClassFlow({
  screen,
  classCode,
  displayName,
  noAudio,
  noVideo,
  isScanning,
  onBack,
  onClassCodeChange,
  onDisplayNameChange,
  onNoAudioChange,
  onNoVideoChange,
  onJoin,
  onQrScanned,
}: JoinClassFlowProps) {
  if (screen === "scanQr") {
    return (
      <div className={styles.page}>
        <div className={styles.joinScreen}>
          <button className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={18} /> Quay lại
          </button>
          <h1 className={styles.joinScreenTitle}>Quét mã QR</h1>
          <div className={styles.scanBox}>
            <span className={`${styles.scanCorner} ${styles.scanCornerTL}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerTR}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerBL}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerBR}`} />
            <button
              type="button"
              className={styles.scanCameraCircle}
              onClick={onQrScanned}
              disabled={isScanning}
              aria-label="Xác nhận đã quét mã QR"
              style={{
                border: "none",
                cursor: isScanning ? "not-allowed" : "pointer",
              }}
            >
              <CameraIcon />
            </button>
          </div>
          <p className={styles.scanHint}>
            {isScanning ? "Đang vào lớp học..." : "Đưa mã QR vào khung hình"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.joinScreen}>
        <div className={styles.modalCard}>
          <div className={styles.modalTopBar}>
            <span className={styles.modalTopBarBrand}>
              <img
                src="/Ai.png"
                alt="Logo"
                className={styles.modalTopBarLogo}
              />{" "}
              ClassBridge
            </span>
            <button className={styles.modalCloseBtn} onClick={onBack}>
              <X size={16} />
            </button>
          </div>
          <h1 className={styles.modalTitle}>Nhập mã lớp</h1>
          <div className={styles.selectField}>
            <Hash size={16} className={styles.selectFieldIcon} />
            <input
              type="text"
              className={styles.selectFieldInput}
              placeholder="Nhập mã lớp học"
              value={classCode}
              onChange={(event) =>
                onClassCodeChange(event.target.value.toUpperCase())
              }
            />
            <ChevronDown size={16} className={styles.selectFieldChevron} />
          </div>
          <div className={styles.nameField}>
            <span className={styles.nameFieldLabel}>Tên của bạn</span>
            <input
              type="text"
              className={styles.nameFieldInput}
              value={displayName}
              onChange={(event) => onDisplayNameChange(event.target.value)}
            />
          </div>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={noAudio}
              onChange={(event) => onNoAudioChange(event.target.checked)}
            />
            Không kết nối âm thanh
          </label>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={noVideo}
              onChange={(event) => onNoVideoChange(event.target.checked)}
            />
            Tắt video của tôi
          </label>
          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={onBack}>
              Hủy
            </button>
            <button
              className={styles.joinBtn}
              disabled={!classCode.trim() || !displayName.trim()}
              onClick={onJoin}
            >
              Tham gia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

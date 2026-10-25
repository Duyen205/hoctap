"use client";

import type { RefObject } from "react";
import {
  BookOpen,
  ChevronRight,
  LayoutGrid,
  Mic,
  ShieldAlert,
  Users,
  Video,
  Volume2,
  X,
} from "lucide-react";
import styles from "./room.module.css";
import type { ClassInfo } from "./types";

type SessionLobbyProps = {
  selectedClass: ClassInfo;
  videoRef: RefObject<HTMLVideoElement | null>;
  camOn: boolean;
  micOn: boolean;
  onClose: () => void;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
  onEnter: () => void;
};

export default function SessionLobby({
  selectedClass,
  videoRef,
  camOn,
  micOn,
  onClose,
  onToggleCamera,
  onToggleMicrophone,
  onEnter,
}: SessionLobbyProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.lobbyModalCard}>
        <button className={styles.closeModalBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.modalHeading}>Tham gia lớp học</h2>
        <div className={styles.modalBodyGrid}>
          <div className={styles.mediaConfigCol}>
            <div className={styles.cameraPreviewBox}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`${styles.previewVideoTag} ${camOn ? "" : styles.hidden}`}
              />
              {!camOn && (
                <div className={styles.previewFallback}>
                  <span>Xem trước camera</span>
                </div>
              )}
            </div>

            <div className={styles.deviceRow}>
              <div className={styles.deviceLabel}>
                <Video size={18} />
                <div className={styles.selectWrapper}>
                  <label>Camera</label>
                  <select className={styles.deviceSelect}>
                    <option>HD Camera (Default)</option>
                  </select>
                </div>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={camOn}
                  onChange={onToggleCamera}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <div className={styles.deviceRow}>
              <div className={styles.deviceLabel}>
                <Mic size={18} />
                <div className={styles.selectWrapper}>
                  <label>Microphone</label>
                  <select className={styles.deviceSelect}>
                    <option>Microphone (Default)</option>
                  </select>
                </div>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={micOn}
                  onChange={onToggleMicrophone}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <div className={styles.deviceRow}>
              <div className={styles.deviceLabel}>
                <Volume2 size={18} />
                <div className={styles.selectWrapper}>
                  <label>Loa (Output)</label>
                  <select className={styles.deviceSelect}>
                    <option>Realtek Audio (Default)</option>
                    <option>Headphones (Bluetooth)</option>
                  </select>
                </div>
              </div>
              <ChevronRight size={18} className={styles.chevronGray} />
            </div>

            <p className={styles.roleNotice}>
              Bạn sẽ tham gia với tư cách: <strong>Giảng viên</strong>
            </p>
          </div>

          <div className={styles.classSummaryCol}>
            <h3 className={styles.summaryTitle}>Thông tin lớp học</h3>
            <div className={styles.classMainInfo}>
              <div className={styles.blueSquareIcon}>
                <BookOpen size={24} color="#2563eb" />
              </div>
              <div>
                <h4 className={styles.classCodeTitle}>{selectedClass.name}</h4>
                <div className={styles.classTimeMeta}>
                  {selectedClass.startTime} · Hôm nay
                </div>
              </div>
            </div>

            <div className={styles.summaryDetailsStack}>
              <div className={styles.detailItem}>
                <Users size={16} />
                <span>{selectedClass.studentCount} sinh viên</span>
              </div>
              <div className={styles.detailItem}>
                <LayoutGrid size={16} />
                <span>{selectedClass.groupsCount ?? 3} nhóm</span>
              </div>
            </div>

            <div className={styles.alertNoticeBox}>
              <ShieldAlert size={20} color="#2563eb" />
              <p>
                Hãy kiểm tra thiết bị trước khi vào phòng để đảm bảo buổi học
                diễn ra suôn sẻ.
              </p>
            </div>

            <div className={styles.modalFooterActions}>
              <button className={styles.btnModalBack} onClick={onClose}>
                Quay lại
              </button>
              <button className={styles.btnModalEnter} onClick={onEnter}>
                Vào phòng ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

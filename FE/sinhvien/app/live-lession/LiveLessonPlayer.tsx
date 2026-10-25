"use client";

import { Clock, FlagOff, Pause, Play, Volume2 } from "lucide-react";
import type { TranscriptLine } from "./types";
import styles from "./live.module.css";

type LiveLessonPlayerProps = {
  isPlaying: boolean;
  transcript: TranscriptLine[];
  title: string;
  duration: string;
  onTogglePlayback: () => void;
  onEnd: () => void;
};

export default function LiveLessonPlayer({
  isPlaying,
  transcript,
  title,
  duration,
  onTogglePlayback,
  onEnd,
}: LiveLessonPlayerProps) {
  return (
    <>
      <div className={styles.sessionBar}>
        <div className={styles.sessionBarLeft}>
          <span className={styles.offlineTag}>Bài giảng đã ghi</span>
          <span className={styles.sessionTitle}>{title}</span>
        </div>
        <div className={styles.sessionTimer}>
          <Clock size={14} />
          {duration}
        </div>
      </div>

      <div className={styles.audioBar}>
        <button
          type="button"
          className={styles.audioPlayBtn}
          onClick={onTogglePlayback}
          aria-label={isPlaying ? "Tạm dừng" : "Phát"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className={styles.audioProgressTrack}>
          <div className={styles.audioProgressFill} style={{ width: "42%" }} />
        </div>
        <span className={styles.audioTime}>18:56 / {duration}</span>
        <button
          type="button"
          className={styles.audioVolumeBtn}
          aria-label="Âm lượng"
        >
          <Volume2 size={16} />
        </button>
      </div>

      <div className={styles.translatePanel}>
        <div className={styles.translateHeader}>
          <span className={styles.translateColLabel}>EN — Nghe</span>
          <span className={styles.translateColLabel}>VI — Bản dịch</span>
        </div>
        <div className={styles.translateBody}>
          {transcript.map((line) => (
            <div key={line.id} className={styles.translateRow}>
              <span className={styles.translateTime}>{line.time}</span>
              <p className={styles.translateEn}>{line.en}</p>
              <p className={styles.translateVi}>{line.vi}</p>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className={styles.endButton} onClick={onEnd}>
        <FlagOff size={16} />
        Kết thúc
      </button>
    </>
  );
}

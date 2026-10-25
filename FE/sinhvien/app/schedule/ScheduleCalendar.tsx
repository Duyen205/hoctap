"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  DoorOpen,
  FileText,
  Radio,
} from "lucide-react";
import { useState } from "react";
import type {
  ScheduleOccurrence,
  ScheduleView,
} from "./types";
import styles from "./schedule.module.css";

type ScheduleCalendarProps = {
  view: ScheduleView;
  selectedDate: Date;
  occurrences: ScheduleOccurrence[];
  onViewChange: (view: ScheduleView) => void;
  onDateChange: (date: Date) => void;
  onJoinRoom: (roomCode: string) => void;
  onOpenSummary: (classId: string) => void;
};

const VIEW_OPTIONS: { id: ScheduleView; label: string }[] = [
  { id: "day", label: "Ngày" },
  { id: "week", label: "Tuần" },
  { id: "month", label: "Tháng" },
];

const WEEKDAY_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const FIRST_HOUR = 7;
const LAST_HOUR = 20;
const HOUR_ROW_HEIGHT = 64;
const WEEKDAY_LONG = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function sameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
}

function getHeaderLabel(date: Date, view: ScheduleView): string {
  if (view === "day") {
    return formatDate(date, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (view === "month") {
    return formatDate(date, { month: "long", year: "numeric" });
  }

  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const startLabel = formatDate(start, { day: "numeric", month: "short" });
  const endLabel = formatDate(end, { day: "numeric", month: "short" });
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`;
}

function getDateRange(date: Date, view: ScheduleView): Date[] {
  if (view === "day") {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return [day];
  }

  if (view === "week") {
    const start = startOfWeek(date);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }

  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = startOfWeek(firstOfMonth);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function eventPosition(occurrence: ScheduleOccurrence) {
  const [startHour, startMinute] = occurrence.startTime.split(":").map(Number);
  const [endHour, endMinute] = occurrence.endTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const gridStart = FIRST_HOUR * 60;
  const gridEnd = LAST_HOUR * 60;
  if (endMinutes <= gridStart || startMinutes >= gridEnd) return null;

  const visibleStart = Math.max(gridStart, Math.min(startMinutes, gridEnd));
  const visibleEnd = Math.max(visibleStart, Math.min(endMinutes, gridEnd));
  return {
    top: `${((visibleStart - gridStart) / 60) * HOUR_ROW_HEIGHT}px`,
    height: `${Math.max(
      18,
      ((visibleEnd - visibleStart) / 60) * HOUR_ROW_HEIGHT - 3,
    )}px`,
  };
}

function monthEventPosition(occurrence: ScheduleOccurrence) {
  const [startHour, startMinute] = occurrence.startTime.split(":").map(Number);
  const [endHour, endMinute] = occurrence.endTime.split(":").map(Number);
  const monthHourHeight = 8;
  const top =
    (startHour - FIRST_HOUR + startMinute / 60) * monthHourHeight;
  const duration = endHour - startHour + (endMinute - startMinute) / 60;

  return {
    top: `${top}px`,
    height: `${Math.max(20, duration * monthHourHeight - 1)}px`,
  };
}

function ScheduleEvent({
  occurrence,
  compact = false,
  selected = false,
  onSelect,
}: {
  occurrence: ScheduleOccurrence;
  compact?: boolean;
  selected?: boolean;
  onSelect: (occurrence: ScheduleOccurrence) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.eventCard} ${compact ? styles.eventCompact : ""} ${
        occurrence.isLive ? styles.eventLive : ""
      } ${selected ? styles.eventSelected : ""}`}
      onClick={() => onSelect(occurrence)}
      aria-label={`${occurrence.title}, ${occurrence.startTime} đến ${occurrence.endTime}`}
    >
      <span className={styles.eventTime}>
        {occurrence.startTime} – {occurrence.endTime}
      </span>
      <strong className={styles.eventTitle}>{occurrence.title}</strong>
      <span className={styles.eventCode}>
        {occurrence.code} · {occurrence.instructor}
      </span>
      {occurrence.isLive && (
        <span className={styles.eventLiveTag}>
          <span />
          Live
        </span>
      )}
    </button>
  );
}

function EventDetails({
  occurrence,
  onClose,
  onJoinRoom,
  onOpenSummary,
}: {
  occurrence: ScheduleOccurrence | null;
  onClose: () => void;
  onJoinRoom: (roomCode: string) => void;
  onOpenSummary: (classId: string) => void;
}) {
  if (!occurrence) return null;

  return (
    <div className={styles.detailOverlay} onMouseDown={onClose}>
      <section
        className={styles.detailDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-event-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.dialogClose}
          onClick={onClose}
          aria-label="Đóng thông tin buổi học"
        >
          ×
        </button>
        <span className={styles.dialogEyebrow}>THÔNG TIN BUỔI HỌC</span>
        <h2 id="schedule-event-title">{occurrence.title}</h2>
        <p className={styles.dialogCode}>{occurrence.code}</p>
        <div className={styles.dialogMeta}>
          <span>
            <CalendarDays size={16} />
            {formatDate(occurrence.date, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>
            <Clock3 size={16} />
            {occurrence.startTime} – {occurrence.endTime}
          </span>
          <span>{occurrence.instructor}</span>
        </div>
        {occurrence.isLive && (
          <div className={styles.dialogLive}>
            <Radio size={15} />
            Buổi học đang diễn ra
          </div>
        )}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.summaryButton}
            onClick={() => onOpenSummary(occurrence.classId)}
          >
            <FileText size={16} />
            Xem tóm tắt
          </button>
          <button
            type="button"
            className={styles.joinButton}
            onClick={() => onJoinRoom(occurrence.roomCode)}
          >
            <DoorOpen size={16} />
            {occurrence.isLive ? "Tham gia phòng" : "Thông tin phòng"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ScheduleCalendar({
  view,
  selectedDate,
  occurrences,
  onViewChange,
  onDateChange,
  onJoinRoom,
  onOpenSummary,
}: ScheduleCalendarProps) {
  const [selectedOccurrence, setSelectedOccurrence] =
    useState<ScheduleOccurrence | null>(null);
  const dates = getDateRange(selectedDate, view);
  const today = new Date();
  const weekDates = getDateRange(selectedDate, "week");

  function classesOn(date: Date) {
    return occurrences
      .filter((occurrence) => sameDay(occurrence.date, date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const selectedWeekDate = classesOn(selectedDate).length
    ? selectedDate
    : weekDates.find((date) => classesOn(date).length) ?? selectedDate;

  function changeRange(direction: number) {
    const next = new Date(selectedDate);
    if (view === "day") next.setDate(next.getDate() + direction);
    else if (view === "week") next.setDate(next.getDate() + direction * 7);
    else next.setMonth(next.getMonth() + direction);
    onDateChange(next);
  }

  return (
    <section className={styles.calendarPage}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Lịch học</h1>
          <p>Theo dõi lịch học và truy cập nhanh vào các buổi học của bạn.</p>
        </div>
        <div className={styles.viewSwitcher} aria-label="Chế độ xem lịch">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.viewButton} ${
                view === option.id ? styles.viewButtonActive : ""
              }`}
              aria-pressed={view === option.id}
              onClick={() => onViewChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.calendarCard}>
        <div className={styles.calendarToolbar}>
          <div className={styles.rangeNavigation}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => changeRange(-1)}
              aria-label="Khoảng thời gian trước"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => changeRange(1)}
              aria-label="Khoảng thời gian tiếp theo"
            >
              <ChevronRight size={19} />
            </button>
            <h2>{getHeaderLabel(selectedDate, view)}</h2>
            <button
              type="button"
              className={styles.todayButton}
              onClick={() => onDateChange(new Date())}
            >
              Hôm nay
            </button>
          </div>
          <span className={styles.timezone}>Múi giờ địa phương</span>
        </div>

        {view === "week" && (
          <div className={styles.weekScroller}>
            <div className={styles.weekView}>
              <div className={styles.weekHeader}>
                <span className={styles.timeCorner} />
                {weekDates.map((date) => {
                  const dayClasses = classesOn(date);
                  const isToday = sameDay(date, today);
                  const isSelected =
                    dayClasses.length > 0 && sameDay(date, selectedWeekDate);
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      className={`${styles.dayHeading} ${
                        isToday ? styles.dayHeadingToday : ""
                      } ${isSelected ? styles.dayHeadingSelected : ""} ${
                        dayClasses.length
                          ? styles.dayHeadingHasEvents
                          : styles.dayHeadingEmpty
                      }`}
                      onClick={() => {
                        if (dayClasses.length) onDateChange(date);
                      }}
                      aria-pressed={isSelected}
                      aria-label={`${WEEKDAY_LONG[date.getDay()]} ${date.getDate()}${
                        dayClasses.length
                          ? ", có lịch học"
                          : ", không có lịch học"
                      }`}
                    >
                      <span>{WEEKDAY_LONG[date.getDay()]}</span>
                      <strong>{date.getDate()}</strong>
                    </button>
                  );
                })}
              </div>

              <div className={styles.weekGrid}>
                <div className={styles.timeAxis}>
                  {Array.from(
                    { length: LAST_HOUR - FIRST_HOUR },
                    (_, index) => FIRST_HOUR + index,
                  ).map((hour) => (
                    <span key={hour} className={styles.timeLabel}>
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                  ))}
                  <span className={styles.timeLabelEnd}>{LAST_HOUR}:00</span>
                </div>
                {weekDates.map((date) => {
                  const dayClasses = classesOn(date);
                  const isSelected =
                    dayClasses.length > 0 && sameDay(date, selectedWeekDate);
                  return (
                    <div
                      key={date.toISOString()}
                      className={`${styles.dayColumn} ${
                        isSelected ? styles.dayColumnSelected : ""
                      }`}
                      aria-label={`${WEEKDAY_LONG[date.getDay()]} ${date.getDate()}`}
                    >
                      {Array.from(
                        { length: LAST_HOUR - FIRST_HOUR },
                        (_, index) => (
                          <span
                            key={index}
                            className={styles.hourCell}
                            aria-hidden="true"
                          />
                        ),
                      )}
                      {dayClasses.map((item) => {
                        const position = eventPosition(item);
                        if (!position) return null;
                        return (
                          <div
                            key={`${item.id}-${item.date.toISOString()}`}
                            className={styles.positionedEvent}
                            style={position}
                          >
                            <ScheduleEvent
                              occurrence={item}
                              compact
                              selected={isSelected}
                              onSelect={setSelectedOccurrence}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === "day" && (
          <div className={styles.weekScroller}>
            <div className={`${styles.weekView} ${styles.dayViewGrid}`}>
              <div className={styles.weekHeader}>
                <span className={styles.timeCorner} />
                <div
                  className={`${styles.dayHeading} ${styles.dayHeadingSelected}`}
                >
                  <span>{WEEKDAY_LONG[selectedDate.getDay()]}</span>
                  <strong>{selectedDate.getDate()}</strong>
                  <small>
                    {formatDate(selectedDate, {
                      month: "long",
                      year: "numeric",
                    })}
                  </small>
                </div>
              </div>
              <div className={styles.weekGrid}>
                <div className={styles.timeAxis}>
                  {Array.from(
                    { length: LAST_HOUR - FIRST_HOUR },
                    (_, index) => FIRST_HOUR + index,
                  ).map((hour) => (
                    <span key={hour} className={styles.timeLabel}>
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                  ))}
                  <span className={styles.timeLabelEnd}>{LAST_HOUR}:00</span>
                </div>
                <div className={styles.dayColumn}>
                  {Array.from(
                    { length: LAST_HOUR - FIRST_HOUR },
                    (_, index) => (
                      <span
                        key={index}
                        className={styles.hourCell}
                        aria-hidden="true"
                      />
                    ),
                  )}
                  {classesOn(selectedDate).map((item) => {
                    const position = eventPosition(item);
                    if (!position) return null;
                    return (
                      <div
                        key={`${item.id}-${item.date.toISOString()}`}
                        className={styles.positionedEvent}
                        style={position}
                      >
                        <ScheduleEvent
                          occurrence={item}
                          onSelect={setSelectedOccurrence}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {!classesOn(selectedDate).length && (
                <div className={styles.noDayEvents}>
                  <CalendarDays size={24} />
                  <strong>Ngày này chưa có buổi học nào</strong>
                  <span>Chọn ngày khác hoặc xem lịch theo tuần.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "month" && (
          <div className={styles.monthView}>
            <div className={styles.monthWeekdays}>
              {WEEKDAY_SHORT.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className={styles.monthGrid}>
              {dates.map((date) => {
                const dayClasses = classesOn(date);
                const isCurrentMonth =
                  date.getMonth() === selectedDate.getMonth();
                return (
                  <div
                    key={date.toISOString()}
                    className={`${styles.monthDay} ${
                      !isCurrentMonth ? styles.monthDayOutside : ""
                    } ${sameDay(date, today) ? styles.monthDayToday : ""} ${
                      sameDay(date, selectedDate) ? styles.monthDaySelected : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.monthDayNumber}
                      onClick={() => {
                        onDateChange(date);
                        onViewChange("day");
                      }}
                      aria-label={`Xem lịch ngày ${formatDate(date, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`}
                    >
                      {date.getDate()}
                    </button>
                    <div className={styles.monthDayTimeline}>
                      {Array.from(
                        { length: LAST_HOUR - FIRST_HOUR },
                        (_, index) => (
                          <span
                            key={index}
                            className={styles.monthHourLine}
                            aria-hidden="true"
                          />
                        ),
                      )}
                      {dayClasses.map((item) => (
                        <div
                          key={`${item.id}-${item.date.toISOString()}`}
                          className={styles.monthEventPosition}
                          style={monthEventPosition(item)}
                        >
                          <button
                            type="button"
                            className={`${styles.monthEvent} ${
                              item.isLive ? styles.monthEventLive : ""
                            }`}
                            title={`${item.startTime} – ${item.endTime} · ${item.title}`}
                            onClick={() => setSelectedOccurrence(item)}
                          >
                            <time>{item.startTime}</time>
                            <span>{item.title}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <EventDetails
        occurrence={selectedOccurrence}
        onClose={() => setSelectedOccurrence(null)}
        onJoinRoom={(code) => {
          setSelectedOccurrence(null);
          onJoinRoom(code);
        }}
        onOpenSummary={(classId) => {
          setSelectedOccurrence(null);
          onOpenSummary(classId);
        }}
      />
    </section>
  );
}

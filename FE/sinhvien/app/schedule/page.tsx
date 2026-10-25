"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import ScheduleCalendar from "./ScheduleCalendar";
import styles from "./schedule.module.css";
import type { ScheduleOccurrence, ScheduleView, ScheduledClass } from "./types";

const WEEKLY_CLASSES: ScheduledClass[] = [
  {
    id: "web-tue",
    classId: "1",
    title: "Web Programming",
    code: "C1SE.38",
    instructor: "John Smith",
    weekday: 2,
    startTime: "09:00",
    endTime: "10:00",
    roomCode: "C1SE.38",
  },
  {
    id: "web-wed",
    classId: "1",
    title: "Web Programming",
    code: "C1SE.38",
    instructor: "John Smith",
    weekday: 3,
    startTime: "09:00",
    endTime: "10:00",
    roomCode: "C1SE.38",
  },
  {
    id: "database-mon",
    classId: "2",
    title: "Database Management",
    code: "C1SE.38",
    instructor: "David Brown",
    weekday: 1,
    startTime: "13:30",
    endTime: "15:00",
    roomCode: "C1SE.38",
  },
  {
    id: "database-thu",
    classId: "2",
    title: "Database Management",
    code: "C1SE.38",
    instructor: "David Brown",
    weekday: 4,
    startTime: "13:30",
    endTime: "15:00",
    roomCode: "C1SE.38",
  },
];

function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function buildScheduleAround(date: Date): ScheduleOccurrence[] {
  const firstDay = startOfWeek(date);
  firstDay.setDate(firstDay.getDate() - 35);
  const occurrences: ScheduleOccurrence[] = [];
  const now = new Date();

  for (let offset = 0; offset < 105; offset += 1) {
    const eventDate = new Date(firstDay);
    eventDate.setDate(firstDay.getDate() + offset);
    const weekday = (eventDate.getDay() + 6) % 7 + 1;

    for (const scheduledClass of WEEKLY_CLASSES) {
      if (scheduledClass.weekday !== weekday) continue;
      const [startHour, startMinute] = scheduledClass.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = scheduledClass.endTime
        .split(":")
        .map(Number);
      const startsAt = new Date(eventDate);
      startsAt.setHours(startHour, startMinute, 0, 0);
      const endsAt = new Date(eventDate);
      endsAt.setHours(endHour, endMinute, 0, 0);

      occurrences.push({
        ...scheduledClass,
        date: eventDate,
        isLive: startsAt <= now && now < endsAt,
      });
    }
  }

  return occurrences;
}

export default function SchedulePage() {
  const router = useRouter();
  const [view, setView] = useState<ScheduleView>("week");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const occurrences = useMemo(
    () => buildScheduleAround(selectedDate),
    [selectedDate],
  );

  return (
    <Layout
      className={styles.page}
      bodyClassName={styles.body}
      mainClassName={styles.main}
    >
      <ScheduleCalendar
        view={view}
        selectedDate={selectedDate}
        occurrences={occurrences}
        onViewChange={setView}
        onDateChange={setSelectedDate}
        onJoinRoom={(roomCode) => {
          const params = new URLSearchParams({
            code: roomCode,
            displayName: "Sinh viên",
          });
          router.push(`/room?${params.toString()}`);
        }}
        onOpenSummary={(classId) => router.push(`/summary?id=${classId}`)}
      />
    </Layout>
  );
}

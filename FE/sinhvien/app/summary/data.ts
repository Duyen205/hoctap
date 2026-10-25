import { Code2, Cog, Database } from "lucide-react";
import type {
  ClassSummaryItem,
  LectureDetail,
  LectureItem,
} from "./types";

export const CLASSES: ClassSummaryItem[] = [
  {
    id: "web",
    name: "Web Programming",
    code: "C1SE.38",
    studentCount: 42,
    icon: Code2,
    color: "blue",
  },
  {
    id: "db",
    name: "Database Management",
    code: "C1SE.38",
    studentCount: 38,
    icon: Database,
    color: "green",
  },
  {
    id: "se",
    name: "Software Engineering",
    code: "C1SE.38",
    studentCount: 35,
    icon: Cog,
    color: "purple",
  },
];

export const LECTURES: LectureItem[] = [
  {
    id: "web-l3",
    classId: "web",
    title: "Lecture 03",
    topic: "React Components & Props",
    date: "23/09/2026",
    duration: "01:35:20",
    hasSummary: true,
  },
  {
    id: "web-l2",
    classId: "web",
    title: "Lecture 02",
    topic: "Introduction to React",
    date: "21/09/2026",
    duration: "01:42:15",
    hasSummary: true,
  },
  {
    id: "web-l1",
    classId: "web",
    title: "Lecture 01",
    topic: "What is React?",
    date: "19/09/2026",
    duration: "01:28:10",
    hasSummary: true,
  },
  {
    id: "db-l1",
    classId: "db",
    title: "Lecture 01",
    topic: "Relational Model Basics",
    date: "20/09/2026",
    duration: "01:20:00",
    hasSummary: false,
  },
  {
    id: "se-l1",
    classId: "se",
    title: "Lecture 01",
    topic: "SDLC Overview",
    date: "18/09/2026",
    duration: "01:15:40",
    hasSummary: false,
  },
];

export const LECTURE_DETAILS: Record<string, LectureDetail> = {
  "web-l3": {
    summaryEn:
      "This lecture introduces the core concepts of React, including Components, Props, and how components pass data to each other. It also covers State and its role in the component lifecycle.",
    summaryVi:
      "Bài giảng giới thiệu các khái niệm cơ bản về React, bao gồm Components, Props và cách các component truyền dữ liệu cho nhau. Ngoài ra, giảng viên cũng chia sẻ về State và vòng đời của component.",
    keyConcepts: [
      {
        id: "c1",
        title: "React Components",
        description: "Components are reusable parts of a React application.",
      },
      {
        id: "c2",
        title: "Props",
        description: "Props allow data to be passed between components.",
      },
      {
        id: "c3",
        title: "State",
        description:
          "State stores information that can change during the component lifecycle.",
      },
    ],
    questions: [
      {
        id: "q1",
        question: "What is the difference between Props and State?",
        groupLabel: "Nhóm 1",
        studentCount: 8,
        answered: true,
        answer:
          "Props are read-only data passed from a parent component, while State is data managed internally by the component itself and can change over time.",
      },
      {
        id: "q2",
        question: "How does the component lifecycle work?",
        groupLabel: "Nhóm 2",
        studentCount: 5,
        answered: true,
        answer:
          "A component goes through mounting, updating, and unmounting phases. Hooks like useEffect let you run code at these specific points.",
      },
      {
        id: "q3",
        question: "What are React Hooks used for?",
        groupLabel: "Nhóm 3",
        studentCount: 4,
        answered: true,
        answer:
          "Hooks let you use state and other React features in function components without writing a class.",
      },
    ],
    transcript: [
      {
        time: "09:05",
        en: "Today we are going to learn about React Components. Components are reusable parts of a React application.",
        vi: "Hôm nay chúng ta sẽ tìm hiểu về các thành phần trong React. Các thành phần là những phần tái sử dụng được trong ứng dụng React.",
      },
      {
        time: "09:07",
        en: "Next, we will look at Props. Props allow data to be passed from one component to another.",
        vi: "Tiếp theo, chúng ta sẽ tìm hiểu về Props. Props cho phép truyền dữ liệu từ thành phần này sang thành phần khác.",
      },
      {
        time: "09:12",
        en: "Finally, we will discuss State and how it works with the component lifecycle.",
        vi: "Cuối cùng, chúng ta sẽ thảo luận về State và cách nó hoạt động với vòng đời của component.",
      },
    ],
  },
};

export const FALLBACK_DETAIL: LectureDetail = {
  summaryEn: "AI-generated summary for this lecture is not available yet.",
  summaryVi: "Bản tổng hợp AI cho bài giảng này chưa có sẵn.",
  keyConcepts: [],
  questions: [],
  transcript: [],
};

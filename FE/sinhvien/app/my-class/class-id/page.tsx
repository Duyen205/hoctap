"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import layoutStyles from "../my-class.module.css";
import Layout from "../../components/Layout";
import ClassDetail from "../ClassDetail";
import type { ClassDetailData } from "../types";

function ClassDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentId = searchParams.get("id");
  const classDetail = useMemo<ClassDetailData | null>(
    () =>
      currentId
        ? {
            id: currentId,
            ...(currentId === "2"
              ? {
                  title: "Database Management",
                  code: "C1SE.38",
                  instructorInitials: "DB",
                  instructorName: "David Brown",
                  schedule: "Thứ 2, 5 | 13:30 - 15:00",
                  currentSessionTitle: null,
                  previousSessions: [
                    {
                      id: "db-s3",
                      week: "Tuần 03",
                      date: "18/10/2026",
                      title: "Relational Model",
                    },
                    {
                      id: "db-s2",
                      week: "Tuần 02",
                      date: "11/10/2026",
                      title: "Database Design",
                    },
                    {
                      id: "db-s1",
                      week: "Tuần 01",
                      date: "04/10/2026",
                      title: "Introduction to Databases",
                    },
                  ],
                }
              : {
                  title: "Web Programming",
                  code: "C1SE.38",
                  instructorInitials: "JS",
                  instructorName: "John Smith",
                  schedule: "Thứ 3, 4 | 09:00 - 10:00",
                  currentSessionTitle: "Database Normalization",
                  previousSessions: [
                    {
                      id: "s3",
                      week: "Tuần 03",
                      date: "20/10/2026",
                      title: "SQL Queries",
                    },
                    {
                      id: "s2",
                      week: "Tuần 02",
                      date: "13/10/2026",
                      title: "Relational Database",
                    },
                    {
                      id: "s1",
                      week: "Tuần 01",
                      date: "06/10/2026",
                      title: "Introduction",
                    },
                  ],
                }),
          }
        : null,
    [currentId],
  );

  return (
    <Layout
      className={layoutStyles.page}
      bodyClassName={layoutStyles.body}
      mainClassName={layoutStyles.main}
    >
      <ClassDetail
        classDetail={classDetail}
        onBack={() => router.push("/my-class")}
        onJoinSession={(code) => router.push(`/room?code=${code}`)}
        onOpenSummary={(classId, sessionId) =>
          router.push(`/summary?id=${classId}&session=${sessionId}`)
        }
      />
    </Layout>
  );
}

export default function ClassDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Đang tải giao diện...</div>}>
      <ClassDetailContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./my-class.module.css";
import Layout from "../components/Layout";
import MyClassList from "./MyClassList";
import AccountMenu from "../account/AccountMenu";
import type { ClassData } from "./types";

export default function MyClassPage() {
  const router = useRouter();
  const [myClasses, setMyClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const mockDataFromAPI: ClassData[] = [
          {
            id: "1",
            title: "Web Programming",
            code: "C1SE.38",
            instructorInitials: "JS",
            instructorName: "John Smith",
            lastSession: "SQL Queries",
            schedule: "Thứ 3, 4 | 09:00 - 10:00",
            isLive: true,
          },
          {
            id: "2",
            title: "Database Management",
            code: "C1SE.38",
            instructorInitials: "DB",
            instructorName: "David Brown",
            lastSession: "Relational Model",
            schedule: "Thứ 2, 5 | 13:30 - 15:00",
            isLive: false,
          },
        ];
        setTimeout(() => {
          setMyClasses(mockDataFromAPI);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu lớp học:", error);
        setIsLoading(false);
      }
    }

    fetchClasses();
  }, []);

  return (
    <Layout
      className={styles.page}
      bodyClassName={styles.body}
      mainClassName={styles.main}
    >
      <MyClassList
        classes={myClasses}
        isLoading={isLoading}
        onEnterClass={(classId) =>
          router.push(`/my-class/class-id?id=${classId}`)
        }
      />
    </Layout>
  );
}

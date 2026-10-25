"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import AccountMenu from "../account-logo/AccountMenu";
import Layout from "../components/Layout";
import AddStudentModal from "./AddStudentModal";
import HomeClassForm from "./HomeClassForm";
import HomeMainPage from "./HomeMainPage";
import styles from "./home.module.css";
import {
  generateQrPayload,
  generateUniqueClassCode,
} from "./classCodeGenerator";
import type {
  CopiedValue,
  HomeClassItem,
  HomeFormView,
  StudentForm,
  StudentFormErrors,
} from "./types";

const APP_BASE_URL = "https://classbridge.app";
const EMPTY_STUDENT_FORM: StudentForm = {
  fullName: "",
  studentId: "",
  email: "",
  phone: "",
};

export default function TeacherHome() {
  const excelInputRef = useRef<HTMLInputElement>(null);
  const slideInputRef = useRef<HTMLInputElement>(null);
  const [classesList, setClassesList] = useState<HomeClassItem[]>([]);
  const [rightPanelView, setRightPanelView] = useState<HomeFormView>("create");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [classCode, setClassCode] = useState(() => generateUniqueClassCode([]));
  const [sessionCount, setSessionCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [copied, setCopied] = useState<CopiedValue>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [activeSlideClassId, setActiveSlideClassId] = useState<string | null>(
    null,
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Thao tác thành công!");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [targetClassId, setTargetClassId] = useState<string | null>(null);
  const [studentForm, setStudentForm] =
    useState<StudentForm>(EMPTY_STUDENT_FORM);
  const [studentErrors, setStudentErrors] = useState<StudentFormErrors>({});

  const joinLink = `${APP_BASE_URL}/join/${classCode}`;

  useEffect(() => {
    if (!showToast) return;
    const timer = window.setTimeout(() => setShowToast(false), 2000);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  function validateSessionCount(value: string) {
    if (!value.trim()) {
      setSessionError("Vui lòng nhập số buổi học!");
      return false;
    }
    if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
      setSessionError("Vui lòng nhập số buổi học lớn hơn 0!");
      return false;
    }
    setSessionError(null);
    return true;
  }

  function handleStudentFormChange(field: keyof StudentForm, value: string) {
    setStudentForm((previous) => ({ ...previous, [field]: value }));
    setStudentErrors((previous) => {
      const next = { ...previous };
      const cleanNameRegex = /^[\p{L}\s]+$/u;

      if (field === "fullName") {
        if (!value.trim()) next.fullName = "Vui lòng nhập họ và tên!";
        else if (!cleanNameRegex.test(value.trim())) {
          next.fullName = "Họ tên chỉ được chứa chữ cái, không được chứa số!";
        } else delete next.fullName;
      }
      if (field === "studentId") {
        if (!value.trim()) next.studentId = "Vui lòng nhập mã số sinh viên!";
        else if (!/^\d{11}$/.test(value.trim())) {
          next.studentId = "Mã số sinh viên phải đúng 11 chữ số!";
        } else delete next.studentId;
      }
      if (field === "email") {
        if (value.trim() && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim())) {
          next.email = "Email phải đúng định dạng @gmail.com!";
        } else delete next.email;
      }
      if (field === "phone") {
        if (value.trim() && !/^\d{10}$/.test(value.trim())) {
          next.phone = "Số điện thoại phải đủ 10 chữ số!";
        } else delete next.phone;
      }
      return next;
    });
  }

  function getStudentFormErrors(form: StudentForm): StudentFormErrors {
    const errors: StudentFormErrors = {};
    if (!form.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên!";
    } else if (!/^[\p{L}\s]+$/u.test(form.fullName.trim())) {
      errors.fullName = "Họ tên chỉ được chứa chữ cái, không được chứa số!";
    }
    if (!form.studentId.trim()) {
      errors.studentId = "Vui lòng nhập mã số sinh viên!";
    } else if (!/^\d{11}$/.test(form.studentId.trim())) {
      errors.studentId = "Mã số sinh viên phải đúng 11 chữ số!";
    }
    if (
      form.email.trim() &&
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email.trim())
    ) {
      errors.email = "Email phải đúng định dạng @gmail.com!";
    }
    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim())) {
      errors.phone = "Số điện thoại phải đủ 10 chữ số!";
    }
    return errors;
  }

  function handleValidateAndAddStudent() {
    const errors = getStudentFormErrors(studentForm);
    setStudentErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setClassesList((previous) =>
      previous.map((classItem) =>
        classItem.id === targetClassId
          ? { ...classItem, studentCount: classItem.studentCount + 1 }
          : classItem,
      ),
    );
    setShowAddStudentModal(false);
  }

  function handleOpenEditClass(classItem: HomeClassItem) {
    setEditingClassId(classItem.id);
    setSubjectName(classItem.name);
    setClassCode(classItem.code);
    setSessionCount(String(classItem.sessionCount));
    setSessionError(null);
    setStartTime(classItem.startTime);
    setEndTime(classItem.endTime);
    setSelectedDays(classItem.weekdays);
    setRightPanelView("create");
  }

  function resetForm() {
    setEditingClassId(null);
    setSubjectName("");
    setSessionCount("");
    setSessionError(null);
    setStartTime("");
    setEndTime("");
    setSelectedDays([]);
    setClassCode(
      generateUniqueClassCode(classesList.map((classItem) => classItem.code)),
    );
    setRightPanelView("create");
  }

  function handleSaveClass() {
    const validSessionCount = validateSessionCount(sessionCount);
    if (
      !subjectName.trim() ||
      !validSessionCount ||
      !startTime ||
      !endTime ||
      selectedDays.length === 0
    ) {
      return;
    }

    const today = new Date();
    const dateLabel = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (editingClassId) {
      setClassesList((previous) =>
        previous.map((item) =>
          item.id === editingClassId
            ? {
                ...item,
                name: subjectName.trim(),
                sessionCount: Number(sessionCount),
                startTime,
                endTime,
                time: `${startTime} - ${endTime}`,
                weekdays: selectedDays,
              }
            : item,
        ),
      );
      setToastMessage("Chỉnh sửa thông tin lớp học thành công!");
      setShowToast(true);
      resetForm();
      return;
    }

    const newClass: HomeClassItem = {
      id: classCode,
      code: classCode,
      name: subjectName.trim(),
      date: dateLabel,
      time: `${startTime} - ${endTime}`,
      startTime,
      endTime,
      status: "upcoming",
      studentCount: 0,
      groupCount: 0,
      sessionCount: Number(sessionCount),
      weekdays: selectedDays,
    };
    setClassesList((previous) => [...previous, newClass]);
    setToastMessage("Tạo lớp học mới thành công!");
    setShowToast(true);
    setRightPanelView("result");
  }

  function toggleDay(day: string) {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((selectedDay) => selectedDay !== day)
        : [...previous, day],
    );
  }

  function handleSlideFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !activeSlideClassId) return;

    setClassesList((previous) =>
      previous.map((classItem) =>
        classItem.id === activeSlideClassId
          ? { ...classItem, slideFileName: file.name }
          : classItem,
      ),
    );
    alert(`Đã upload slide thành công cho lớp: ${file.name}`);
  }

  function handleCopy(value: "code" | "link") {
    navigator.clipboard?.writeText(value === "code" ? classCode : joinLink);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <Layout
      className={styles.page}
      brandHref="/"
      headerActions={<AccountMenu teacherName="" />}
    >
      <input
        type="file"
        ref={excelInputRef}
        onChange={(event) => {
          if (event.target.files?.[0]) {
            alert(`Đã chọn file: ${event.target.files[0].name}`);
          }
        }}
        accept=".xlsx, .xls, .csv"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={slideInputRef}
        onChange={handleSlideFileChange}
        accept=".ppt, .pptx, .pdf"
        style={{ display: "none" }}
      />

      <div className={styles.twoColumn}>
        <HomeMainPage
          classes={classesList}
          onUploadSlide={(classId) => {
            setActiveSlideClassId(classId);
            slideInputRef.current?.click();
          }}
          onAddStudent={(classId) => {
            setTargetClassId(classId);
            setStudentForm(EMPTY_STUDENT_FORM);
            setStudentErrors({});
            setShowAddStudentModal(true);
          }}
          onEditClass={handleOpenEditClass}
          onDeleteClass={(classId) =>
            setClassesList((previous) =>
              previous.filter((classItem) => classItem.id !== classId),
            )
          }
        />
        <HomeClassForm
          view={rightPanelView}
          editingClassId={editingClassId}
          subjectName={subjectName}
          classCode={classCode}
          sessionCount={sessionCount}
          startTime={startTime}
          endTime={endTime}
          selectedDays={selectedDays}
          sessionError={sessionError}
          copied={copied}
          joinLink={joinLink}
          qrPayload={generateQrPayload(classCode)}
          onSubjectNameChange={setSubjectName}
          onSessionCountChange={(value) => {
            setSessionCount(value);
            validateSessionCount(value);
          }}
          onValidateSessionCount={validateSessionCount}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
          onToggleDay={toggleDay}
          onRegenerateCode={() =>
            setClassCode(
              generateUniqueClassCode(
                classesList.map((classItem) => classItem.code),
              ),
            )
          }
          onImportSchedule={() => excelInputRef.current?.click()}
          onSave={handleSaveClass}
          onReset={resetForm}
          onCopy={handleCopy}
        />
      </div>

      {showAddStudentModal && (
        <AddStudentModal
          form={studentForm}
          errors={studentErrors}
          onClose={() => setShowAddStudentModal(false)}
          onChange={handleStudentFormChange}
          onSubmit={handleValidateAndAddStudent}
        />
      )}

      {showToast && (
        <div className={styles.toastOverlay} onClick={() => setShowToast(false)}>
          <div className={styles.toastBox} onClick={(event) => event.stopPropagation()}>
            <span className={styles.toastSuccessIcon}>
              <CheckCircle2 size={22} />
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}

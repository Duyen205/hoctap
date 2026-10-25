export type AccountInfo = {
  avatarUrl?: string;
  username: string;
  dateOfBirth: string;
  hobbies: string;
};

export type AccountMenuProps = {
  teacherName: string;
  avatarUrl?: string;
  onSaveAccountInfo?: (info: AccountInfo) => void;
  onSubmitPasswordChange?: (oldPassword: string, newPassword: string) => void;
  onLogout?: () => void;
};

export type AccountInfoModalProps = {
  teacherName: string;
  avatarUrl?: string;
  onClose: () => void;
  onSave: (info: AccountInfo) => void;
};

export type ChangePasswordModalProps = {
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => void;
};

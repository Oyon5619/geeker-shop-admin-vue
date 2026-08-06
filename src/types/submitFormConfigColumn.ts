export type FormComp =
  | "input"
  | "select"
  | "inputNumber"
  | "avatarUpload"
  | "switch"
  | "radioGroup"
  | "tree";

export interface FormConfigColumn {
  label: string;
  column: string;
  comp: FormComp;
  compProps?: Record<string, unknown>;
}

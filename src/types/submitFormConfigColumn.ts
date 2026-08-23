export type FormComp =
  | "input"
  | "select"
  | "inputNumber"
  | "avatarUpload"
  | "switch"
  | "radioGroup"
  | "tree"
  | "checkboxGroup"
  | "inputNumGroup";

export interface FormConfigColumn {
  label: string;
  column: string;
  comp: FormComp;
  compProps?: Record<string, unknown>;
  prefixLabel?: string;
  suffixLabel?: string;
  tips?: string;
}

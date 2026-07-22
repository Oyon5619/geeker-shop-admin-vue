import type { ButtonProps } from "naive-ui/es/button/src/Button";

export interface ButtonItem<T = unknown> extends Omit<ButtonProps, "onClick"> {
  btnText: string;
  onClick?: (row: T) => void | Promise<void>;
}

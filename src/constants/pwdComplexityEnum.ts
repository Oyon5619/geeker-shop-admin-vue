/** 强制密码复杂度枚举 */
export const PwdComplexityEnum = {
  /** 数字 */
  NUM: "0",
  /** 小写字母 */
  LOWER: "1",
  /** 大写字母 */
  UPPER: "2",
  /** 符号 */
  SIGN: "3",
} as const;

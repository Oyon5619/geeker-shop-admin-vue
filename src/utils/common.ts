import { DEFAULT_SEPARATOR, SPACE } from "@/constants/common";

/** 解析Json对象 */
export const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error(err);
    return {};
  }
};

/** 判断是否为指定类型 */
export const isType = (value: unknown, target: string) => {
  const strings = Object.prototype.toString.call(value).split(SPACE);
  const lasts = strings.at(-1)?.split("");
  lasts?.pop();

  return lasts?.join(DEFAULT_SEPARATOR) === target;
};

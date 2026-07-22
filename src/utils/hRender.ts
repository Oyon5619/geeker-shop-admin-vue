import type { ButtonItem } from "@/types/buttonItem";
import { NButton, NSpace, NIcon } from "naive-ui";
import { h, type Component } from "vue";

export const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

export const renderButtonItems = <T = unknown>(
  items: ButtonItem<T>[],
  row: T,
) => {
  const renderInner = () =>
    items.map((item) => {
      const { btnText, onClick: onClickInner, ...rest } = item;
      return h(
        NButton,
        { ...rest, onClick: () => onClickInner?.(row) },
        { default: () => btnText },
      );
    });

  return h(NSpace, null, { default: renderInner });
};

import type { ManagerInfo } from "@/types/apiTypes/adminApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import { NButton, NSpace, NIcon, NAvatar, NFlex, NSwitch } from "naive-ui";
import { h, type Component, type VNodeChild } from "vue";
import { textRender } from "./common";

export const renderIcon = (icon: Component) => {
  return h(NIcon, null, { default: () => h(icon) });
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

export const renderManagerThumbnail = (row: ManagerInfo) => {
  const { avatar, username, id } = row;

  const renderRightContent = () => {
    return h("div", null, {
      default: () => [
        h("div", null, { default: () => username }),
        h(
          "div",
          { class: "text-[0.6rem] text-gray-400" },
          { default: () => `ID: ${textRender(id)}` },
        ),
      ],
    });
  };

  return h(NFlex, null, {
    default: () => [
      h(NAvatar, { src: avatar, round: true }),
      renderRightContent(),
    ],
  });
};

export const renderManagerStatus = (
  row: ManagerInfo,
  props: {
    onSwitch: (
      row: ManagerInfo,
      newValue: boolean,
    ) => Promise<boolean | undefined>;
    loading?: boolean;
  },
) => {
  const { onSwitch, loading } = props;

  return h(NSwitch, {
    loading,
    value: Boolean(row.status),
    onUpdateValue: async (newValue) => {
      const isSuccess = await onSwitch(row, newValue);
      if (isSuccess) {
        row.status = newValue;
      }
    },
  });
};

export const renderFlex = (children: VNodeChild[]) => {
  return h(NFlex, { align: "center" }, { default: () => children });
};

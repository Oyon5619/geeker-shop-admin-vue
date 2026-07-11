import type { AdminMenu } from "@/types/apiTypes";
import type { MenuItem } from "@/types/menuItemn";
import { cloneDeep } from "lodash";
import { ICON_MAP } from "./iconMap";
import { renderIcon } from "./iconRender";

/** 从接口返回的menus里查找指定menu数据(根据id/path查找) */
export const findAdminMenu = (
  value: string,
  menus?: AdminMenu[],
): AdminMenu | undefined => {
  if (!menus?.length) {
    return;
  }

  for (const menu of menus) {
    const { id, frontpath, child } = menu;

    if (id.toString() === value || frontpath === value) {
      return cloneDeep(menu);
    }

    if (child?.length) {
      const foundInChild = findAdminMenu(value, child);
      if (foundInChild) {
        return foundInChild;
      }
    }
  }
};

/** 将接口返回的menus映射成能渲染NMenu组件的数据 */
export const mapToNMenuOptions = (data: AdminMenu[]): MenuItem[] => {
  return data.map((item) => {
    const { id, name, child, frontpath, icon: innerIcon } = item;

    const icon =
      innerIcon && ICON_MAP[innerIcon]
        ? renderIcon(ICON_MAP[innerIcon])
        : undefined;

    const menuItem: MenuItem = {
      key: id,
      label: name,
      routePath: frontpath,
      icon,
    };
    if (child?.length) {
      menuItem.children = mapToNMenuOptions(child);
    }

    return menuItem;
  });
};

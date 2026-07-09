import store from "@/store";
import type { AdminMenu } from "@/types/apiTypes";
import { ICON_MAP } from "@/utils/iconMap";
import { showToast } from "@/utils/popup";
import { cloneDeep } from "lodash";
import { NIcon, type MenuOption } from "naive-ui";
import { h, reactive, type Component } from "vue";
import { useRouter } from "vue-router";

interface MenuItem extends Omit<MenuOption, "children"> {
  routePath?: string;
  children?: MenuItem[];
}

const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const getMenuOptions = (data: AdminMenu[]): MenuItem[] => {
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
      menuItem.children = getMenuOptions(child);
    }

    return menuItem;
  });
};

// const findMenu = (
//   menuKey: string,
//   menuOptions?: MenuItem[],
// ): MenuItem | undefined => {
//   if (!menuOptions?.length) {
//     return;
//   }

//   for (const option of menuOptions) {
//     const { key, children } = option;
//     if (menuKey === key) {
//       return cloneDeep(option);
//     }

//     if (children?.length) {
//       const foundInChildren = findMenu(menuKey, children);
//       if (foundInChildren) {
//         return foundInChildren;
//       }
//     }
//   }
// };

export const useMenuManager = () => {
  const menuOptions = reactive<MenuItem[]>([]);
  const router = useRouter();

  const initMenuOptions = () => {
    const adminMenus = cloneDeep(store.state.adminInfo?.menus ?? []);
    menuOptions.push(...getMenuOptions(adminMenus));
  };

  const onMenuSelect = (_key: string, item: MenuItem) => {
    const path = item.routePath;
    if (!path) {
      return showToast("error", "未找到页面");
    }

    router.push({ path });
  };

  return { menuOptions, initMenuOptions, onMenuSelect };
};

import store from "@/store";
import type { AdminMenu } from "@/types/apiTypes";
import { ICON_MAP } from "@/utils/iconMap";
import { cloneDeep } from "lodash";
import { NIcon } from "naive-ui";
import { computed, h, type Component, type VNodeChild } from "vue";
import { useRoute, useRouter } from "vue-router";

interface MenuItem {
  key: number;
  label?: string;
  routePath?: string;
  icon?: () => VNodeChild;
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

const findMenuByPath = (
  targetPath: string,
  menuOptions?: MenuItem[],
): MenuItem | undefined => {
  if (!menuOptions?.length) {
    return;
  }

  for (const option of menuOptions) {
    const { routePath, children } = option;
    if (targetPath === routePath) {
      return cloneDeep(option);
    }

    if (children?.length) {
      const foundInChildren = findMenuByPath(targetPath, children);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
};

export const useMenuManager = () => {
  const router = useRouter();
  const route = useRoute();

  const menuOptions = computed(() =>
    getMenuOptions(cloneDeep(store.state.menus ?? [])),
  );

  const defaultActive = computed(() => {
    const target = findMenuByPath(route.path, menuOptions.value);
    return target?.key;
  });

  const onMenuSelect = (_key: string, item: MenuItem) => {
    const path = item.routePath;
    router.push({ path });
  };

  return { menuOptions, defaultActive, onMenuSelect };
};

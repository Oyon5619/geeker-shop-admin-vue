import type { VNodeChild } from "vue";

export interface MenuItem {
  key: number;
  label?: string;
  routePath?: string;
  icon?: () => VNodeChild;
  children?: MenuItem[];
}

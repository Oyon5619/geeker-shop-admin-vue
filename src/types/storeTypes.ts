import type { AdminMenu, GetAdminInfoApiResp } from "./apiTypes";

export interface StoreState {
  /** 当前管理员信息 */
  adminInfo?: GetAdminInfoApiResp;
  /** 侧边栏是否收缩 */
  isCollapsed?: boolean;
  /** 侧边菜单数据 */
  menus?: AdminMenu[];
  ruleNames: [];
}

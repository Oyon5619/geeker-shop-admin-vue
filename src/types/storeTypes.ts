import type { AdminMenu, GetAdminInfoApiResp } from "./apiTypes/adminApiTypes";
import type { TabItem } from "./tabItem";

export interface StoreState {
  /** 当前管理员信息 */
  adminInfo?: GetAdminInfoApiResp;
  /** 侧边栏是否收缩 */
  isCollapsed?: boolean;
  /** 侧边菜单数据 */
  menus?: AdminMenu[];
  /**  */
  ruleNames: string[];
  /** 标签导航列表 */
  tabList?: TabItem[];
  /** 当前点击的标签对应的key */
  activeTabKey?: number;
}

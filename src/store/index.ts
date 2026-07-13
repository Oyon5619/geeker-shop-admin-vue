import { getAdminInfoApi, loginApi, logoutApi } from "@/api/adminApi";
import { HOME_PAGE_MENU_ID, SYSTEM_APP_NAME } from "@/constants/common";
import type { LoginApiReq } from "@/types/apiTypes/adminApiTypes";
import type { StoreState } from "@/types/storeTypes";
import type { TabItem } from "@/types/tabItem";
import { removeToken, setToken } from "@/utils/auth";
import { findAdminMenu, mapToNMenuOptions } from "@/utils/menuUtil";
import { showToast } from "@/utils/popup";
import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

const persist = new VuexPersist({
  key: `${SYSTEM_APP_NAME.toUpperCase()}_SESSION`,
  storage: sessionStorage,
});

const store = createStore<StoreState>({
  state: {
    isCollapsed: false,
    menus: [],
    ruleNames: [],
    tabList: [],
  },
  getters: {
    menuOptions: ({ menus }) => mapToNMenuOptions(menus ?? []),
    defaultActive:
      ({ menus }) =>
      (path: string) => {
        const target = findAdminMenu(path, menus);
        return target?.id;
      },
    tabClosable: ({ tabList = [] }) => tabList.length > 1,
  },
  mutations: {
    SET_ADMININFO(state, value) {
      state.adminInfo = value;
    },
    TOGGLE_COLLAPSED(state) {
      state.isCollapsed = !state.isCollapsed;
    },
    SET_MENUS(state, value) {
      state.menus = value;
    },
    SET_RULENAMES(state, value) {
      state.ruleNames = value;
    },
    SET_TABLIST(state, value) {
      state.tabList = value;
    },
    SET_ACTIVE_TAB_KEY(state, value) {
      state.activeTabKey = value;
    },
  },
  actions: {
    clearSessions({ commit }) {
      commit("SET_ADMININFO");
      commit("SET_MENUS");
      commit("SET_RULENAMES");
      commit("SET_TABLIST");
      commit("SET_ACTIVE_TAB_KEY");
    },
    async login({ dispatch }, data: LoginApiReq) {
      try {
        const { data: respData } = await loginApi(data);
        const tokenValue = respData?.token ?? "";
        if (!tokenValue) {
          return false;
        }

        // 登录成功后存储token到cookie里
        setToken(tokenValue);
        // 获取当前管理员信息、初始化导航标签列表和侧边栏菜单
        await dispatch("getAdminInfo");
        await dispatch("initTabList");

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async logout({ dispatch }) {
      // 退出登录后要清除token和管理员信息
      try {
        await logoutApi();
        showToast("success", "退出登录成功");
      } catch (err) {
        console.error(err);
      } finally {
        removeToken();
        await dispatch("clearSessions");
      }
    },
    async getAdminInfo({ commit }) {
      try {
        const { data: adminInfoValue } = await getAdminInfoApi();

        const { menus, ruleNames, ...rest } = adminInfoValue ?? {};
        commit("SET_ADMININFO", rest);
        commit("SET_MENUS", menus);
        commit("SET_RULENAMES", ruleNames);
      } catch (err) {
        console.error(err);
      }
    },
    initTabList({ commit, state }) {
      const homeMenu = findAdminMenu(HOME_PAGE_MENU_ID.toString(), state.menus);
      if (!homeMenu) {
        return;
      }

      const { id: key, frontpath: routePath, name: title } = homeMenu;
      commit("SET_TABLIST", [{ key, title, routePath }]);
      commit("SET_ACTIVE_TAB_KEY", key);
    },

    // 新增某个标签导航
    addTab({ commit, state }, newTab: TabItem) {
      const target = state.tabList?.find(({ key }) => key === newTab.key);
      if (target) {
        commit("SET_ACTIVE_TAB_KEY", target.key);
        return;
      }

      state.tabList?.push(newTab);
      commit("SET_ACTIVE_TAB_KEY", newTab.key);
    },

    addTabByRoutePath({ dispatch, state }, routePath: string) {
      const target = findAdminMenu(routePath, state.menus);
      if (!target) {
        return;
      }

      const { id: key, name: title } = target;
      dispatch("addTab", { key, title, routePath });
    },

    // 关闭某个导航标签
    removeTab({ commit, state }, key: number) {
      if (!state.tabList?.length) {
        return;
      }

      const index = state.tabList.findIndex((item) => item.key === key);
      if (index === -1) {
        return;
      }

      if (state.activeTabKey === key) {
        const isLast = index === state.tabList.length - 1;
        const newActiveTab = state.tabList[isLast ? index - 1 : index + 1];

        commit("SET_ACTIVE_TAB_KEY", newActiveTab.key);
      }

      state.tabList.splice(index, 1);
    },

    removeTabByRoutePath({ dispatch, state }, routePath: string) {
      const targetTab = state.tabList?.find(
        (item) => item.routePath === routePath,
      );
      if (!targetTab) {
        return;
      }

      dispatch("removeTab", targetTab.key);
    },
  },
  plugins: [persist.plugin],
});

export default store;

import { getAdminInfoApi, loginApi, logoutApi } from "@/api/adminApi";
import { SYSTEM_NAME } from "@/constants/common";
import type { LoginApiReq } from "@/types/apiTypes";
import type { StoreState } from "@/types/storeTypes";
import { removeToken, setToken } from "@/utils/auth";
import { showToast } from "@/utils/popup";
import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

const persist = new VuexPersist({
  key: `${SYSTEM_NAME.toUpperCase()}_SESSION`,
  storage: sessionStorage,
});

const store = createStore<StoreState>({
  state: {
    isCollapsed: false,
    menus: [],
    ruleNames: [],
  },
  mutations: {
    // 设置当前登录的管理员信息
    SET_ADMININFO(state, value) {
      state.adminInfo = value;
    },
    // 切换侧边菜单栏的展开/收缩状态
    TOGGLE_COLLAPSED(state) {
      state.isCollapsed = !state.isCollapsed;
    },
    // 设置菜单
    SET_MENUS(state, value) {
      state.menus = value;
    },
    SET_RULENAMES(state, value) {
      state.ruleNames = value;
    },
  },
  actions: {
    async login({ dispatch }, data: LoginApiReq) {
      try {
        const { data: respData } = await loginApi(data);
        const tokenValue = respData?.token ?? "";
        if (!tokenValue) {
          return false;
        }

        // 登录成功后存储token到cookie里
        setToken(tokenValue);
        await dispatch("getAdminInfo");
        showToast("success", "登录成功");

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async logout({ commit }) {
      // 退出登录后要清除token和管理员信息
      try {
        await logoutApi();
        showToast("success", "退出登录成功");
      } catch (err) {
        console.error(err);
      } finally {
        removeToken();
        commit("SET_ADMININFO");
        commit("SET_MENUS");
        commit("SET_RULENAMES");
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
  },
  plugins: [persist.plugin],
});

export default store;

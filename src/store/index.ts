import { getAdminInfoApi, loginApi, logoutApi } from "@/api/adminApi";
import type { LoginApiReq } from "@/types/apiTypes";
import type { StoreState } from "@/types/storeTypes";
import { removeToken, setToken } from "@/utils/auth";
import { showToast } from "@/utils/popup";
import { createStore } from "vuex";

const store = createStore<StoreState>({
  state: {},
  mutations: {
    // 设置当前登录的管理员信息
    SET_ADMININFO(state, value) {
      state.adminInfo = value;
    },
  },
  actions: {
    async login(_, data: LoginApiReq) {
      try {
        const { data: respData } = await loginApi(data);
        const tokenValue = respData?.token ?? "";
        if (!tokenValue) {
          return false;
        }

        // 登录成功后存储token到cookie里
        setToken(tokenValue);
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
      }
    },
    async getAdminInfo({ commit }) {
      try {
        const { data: adminInfoValue } = await getAdminInfoApi();
        commit("SET_ADMININFO", adminInfoValue);
      } catch (err) {
        console.error(err);
      }
    },
  },
});

export default store;

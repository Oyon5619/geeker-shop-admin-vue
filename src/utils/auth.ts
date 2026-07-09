import { ADMIN_TOKEN_KEY } from "@/constants/common";
import { useCookieManager } from "@/hooks/useCookieManager";

// 登录token管理
const {
  get: getToken,
  set: setToken,
  remove: removeToken,
} = useCookieManager(ADMIN_TOKEN_KEY);

export { getToken, setToken, removeToken };

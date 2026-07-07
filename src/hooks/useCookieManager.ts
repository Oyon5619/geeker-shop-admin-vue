import { useCookieState } from "vue-hooks-plus";

// cookie管理
export const useCookieManager = (cookieKey: string) => {
  const [cookie, setCookie] = useCookieState(cookieKey);

  const get = () => cookie.value;

  const set = (newValue: string) => setCookie(newValue);

  const remove = () => setCookie(undefined);

  return { cookie, set, get, remove };
};

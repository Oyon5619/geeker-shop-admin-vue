// vuex.d.ts
import { Store } from "vuex";
import type { GetAdminInfoApiResp } from "./types/apiTypes";

declare module "vue" {
  interface State {
    adminInfo: GetAdminInfoApiResp;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

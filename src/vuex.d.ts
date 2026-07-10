// vuex.d.ts
import { Store } from "vuex";
import type { GetAdminInfoApiResp } from "./types/apiTypes";
import type { StoreState } from "./types/storeTypes";

declare module "vue" {
  interface State extends StoreState {}

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

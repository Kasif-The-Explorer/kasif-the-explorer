import { atom } from "recoil";

export type EnvironmentType = "web" | "electron" | "webview2" | null;

export const evironmentStoreState = atom<EnvironmentType>({
  key: "EvironmentStoreState",
  default: "electron",
});

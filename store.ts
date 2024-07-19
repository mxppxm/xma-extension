import { createContext } from "react"

export const InitState = {
  version: 1, // 新加状态后需要重置storage
  isLogOpen: false,
  isEditPageData: false
}
export const InitStore = {
  store: { ...InitState },
  setStore: (store: any) => {}
}
export const ExtensionContext = createContext(InitStore)

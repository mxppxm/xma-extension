import { createContext } from "react"

export const InitState = {
  isLogOpen: true
}
export const InitStore = {
  store: InitState,
  setStore: (store: any) => {}
}
export const ExtensionContext = createContext(InitStore)

import _ from "lodash"

const debug = true
export const ChromeStorage = {
  get: async (keys: string[] = []) => {
    if (_.isEmpty(keys)) {
      return new Error("keys is empty")
    }
    if (debug) {
      console.log("get chrome storage", keys)
    }
    return chrome.storage.sync.get(keys)
  },
  set: async (items: { [key: string]: any }) => {
    if (_.isEmpty(items)) {
      return new Error("items is empty")
    }
    if (debug) {
      console.log("set chrome storage", items)
    }
    return chrome.storage.sync.set(items)
  }
}

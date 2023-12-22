import _ from "lodash"

import { ExtensionMessageKey } from "./constants"

const debug = true
export const ChromeStorage = {
  get: async (keys: string[] = []) => {
    if (_.isEmpty(keys)) {
      return null
    }
    if (debug) {
      console.log("get chrome storage", keys)
    }
    return chrome.storage.sync.get(keys)
  },
  set: async (items: { [key: string]: any }) => {
    if (_.isEmpty(items)) {
      return null
    }
    if (debug) {
      console.log("set chrome storage", items)
    }
    return chrome.storage.sync.set(items)
  }
}

const PostMessageListenerMap = new Map()
export const PostMessage = {
  send: (message: Object) => {
    try {
      window.postMessage({
        sign: ExtensionMessageKey,
        data: message
      })
    } catch (e) {
      console.log("e :>> ", e)
    }
  },
  listen: (callback: (data: any) => void) => {
    const listener = (e: MessageEvent) => {
      const { sign, data } = e.data
      if (sign === ExtensionMessageKey) {
        callback(data)
      }
    }
    PostMessageListenerMap.set(callback, listener)
    window.addEventListener("message", listener)
  },
  remove: (callback: (data: any) => void) => {
    const func = PostMessageListenerMap.get(callback)
    window.removeEventListener("message", func)
  }
}

export const ChromePostMessage = {
  send: (message: Object) => {
    chrome.runtime.sendMessage(message)
  },
  listen: (callback: (data: any) => void) => {
    chrome.runtime.onMessage.addListener(callback)
  },
  remove: (callback: (data: any) => void) => {
    chrome.runtime.onMessage.removeListener(callback)
  }
}

export const ChromeTabMessage = {
  send: (message: Object) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message)
    })
  },
  listen: (callback: (data: any) => void) => {
    chrome.runtime.onMessage.addListener(callback)
  },
  remove: (callback: (data: any) => void) => {
    chrome.runtime.onMessage.removeListener(callback)
  }
}

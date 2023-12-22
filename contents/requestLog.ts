import _ from "lodash"
import type { PlasmoCSConfig } from "plasmo"

import { loadPageScript } from "~service/loadPageScript"
import { ChromeStorage, PostMessage } from "~util/chrome"
import { MessageEventType, StorageKey } from "~util/constants"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
}

export function isValidLogHost() {
  const host = window.location.host
  if (host.includes("umu.work")) {
    return false
  }
  return (
    host.includes("umu") ||
    window.location.host.includes("localhost") ||
    window.location.host.includes("172")
  )
}

let hasLoad = false
export function openLog() {
  if (isValidLogHost()) {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      event: MessageEventType.LOG.open
    })
    if (hasLoad) {
      PostMessage.send({ event: MessageEventType.LOG.open })
    } else {
      loadPageScript("resources/log.js").then(() => {
        hasLoad = true
        PostMessage.send({ event: MessageEventType.LOG.open })
      })
    }
  }
}
export function closeLog() {
  console.log("🚀 xma 🚀 ~ file: requestLog.ts:40 ~ closeLog:")
  PostMessage.send({ event: MessageEventType.LOG.close })
}
// 第一次触发，之后要通过Chrome.message转发
ChromeStorage.get([StorageKey.STORE]).then((res: any) => {
  console.log("🚀 xma 🚀 ~ file: requestLog.ts:45 ~ res:", res)
  if (!_.isEmpty(res)) {
    const { store } = res
    if (store.isLogOpen) {
      openLog()
    }
  }
})

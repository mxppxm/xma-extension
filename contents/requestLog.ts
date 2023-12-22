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

let hasLoad = false
export function openLog() {
  if (hasLoad) {
    PostMessage.send({ event: MessageEventType.LOG.open })
  } else {
    loadPageScript("resources/log.js").then(() => {
      hasLoad = true
      PostMessage.send({ event: MessageEventType.LOG.open })
    })
  }
}
export function closeLog() {
  PostMessage.send({ event: MessageEventType.LOG.close })
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.event === MessageEventType.LOG.open) {
    openLog()
  } else if (msg.event === MessageEventType.LOG.close) {
    closeLog()
  }
})
function init() {
  // 第一次触发，之后要通过Chrome.message转发
  ChromeStorage.get([StorageKey.STORE]).then((res: any) => {
    if (!_.isEmpty(res)) {
      const { store } = res
      if (store.isLogOpen) {
        openLog()
      }
    }
  })
}
init()

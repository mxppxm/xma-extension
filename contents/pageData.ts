import _ from "lodash"
import type { PlasmoCSConfig } from "plasmo"

import { loadPageScript } from "~service/loadPageScript"
import { PostMessage } from "~util/chrome"
import { ExtensionMessageKey, MessageEventType } from "~util/constants"

// export const config: PlasmoCSConfig = {
//   matches: ["<all_urls>"],
//   all_frames: true,
//   run_at: "document_start"
// }

// chrome.runtime.onMessage.addListener((msg) => {
//   console.log("🚀 xma 🚀 ~ file: pageData.ts:17 ~ msg:", msg)
// })
function init() {
  loadPageScript("resources/pageData.js")
  PostMessage.listen((event) => {
    console.log("🚀 xma 🚀 ~ file: pageData.ts:22 ~ event:", event)
  })
}
// init()

import type { PlasmoCSConfig } from "plasmo"

import { loadPageScript } from "~service/loadPageScript"

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

if (isValidLogHost()) {
  loadPageScript("resources/log.js")
}

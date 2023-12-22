import { useMount } from "ahooks"
import { useContext, useEffect } from "react"

import { closeLog, openLog } from "~contents/requestLog"
import { ExtensionContext } from "~store"

export function useStoreAction() {
  const { store } = useContext(ExtensionContext)
  const { isLogOpen } = store
  console.log("🚀 xma 🚀 ~ file: useStoreAction.ts:10 ~ isLogOpen:", isLogOpen)

  useMount(() => {
    chrome.runtime.onMessage.addListener((message) => {
      console.log("🚀 xma 🚀 ~ file: useStoreAction.ts:14 ~ message:", message)
    })
  })

  useEffect(() => {
    if (isLogOpen) {
      openLog()
    } else {
      closeLog()
    }
  }, [isLogOpen])
}

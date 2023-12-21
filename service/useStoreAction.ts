import { useContext, useEffect } from "react"

import { closeLog, openLog } from "~contents/requestLog"
import { ExtensionContext } from "~store"

export function useStoreAction() {
  const { store } = useContext(ExtensionContext)
  const { isLogOpen } = store
  console.log("🚀 xma 🚀 ~ file: useStoreAction.ts:10 ~ isLogOpen:", isLogOpen)
  useEffect(() => {
    if (isLogOpen) {
      openLog()
    } else {
      closeLog()
    }
  }, [isLogOpen])
}

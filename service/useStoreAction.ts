import { useContext, useEffect } from "react"

import { ExtensionContext } from "~store"
import { ChromeTabMessage } from "~util/chrome"
import { MessageEventType } from "~util/constants"

export function useStoreAction() {
  const { store } = useContext(ExtensionContext)
  const { isLogOpen } = store

  // log相关
  useEffect(() => {
    if (isLogOpen) {
      ChromeTabMessage.send({ event: MessageEventType.LOG.open })
    } else {
      ChromeTabMessage.send({ event: MessageEventType.LOG.close })
    }
  }, [isLogOpen])
}

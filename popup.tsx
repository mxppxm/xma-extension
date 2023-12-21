import { useMount, useSetState } from "ahooks"
import _ from "lodash"

import Header from "~components/header"
import Log from "~components/log"
import { ExtensionContext, InitState } from "~store"
import { ChromeStorage } from "~util/chrome"
import { StorageKey } from "~util/constants"

function IndexPopup() {
  const [store, _setStore] = useSetState(InitState)

  useMount(() => {
    ChromeStorage.get([StorageKey.STORE]).then((res) => {
      if (_.isEmpty(res)) {
        ChromeStorage.set({ [StorageKey.STORE]: InitState })
      } else {
        _setStore(res as typeof InitState)
      }
    })
  })
  const setStore: typeof _setStore = (newState) => {
    _setStore(newState)
    ChromeStorage.set({ [StorageKey.STORE]: newState })
  }

  return (
    <ExtensionContext.Provider value={{ store, setStore }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16,
          width: 300
        }}>
        <Header title="请求打印" />
        <Log />
        <Header title="请求拦截替换" />
        <Header title="多语key查询" />
        <Header title="多语修改" />
      </div>
    </ExtensionContext.Provider>
  )
}

export default IndexPopup

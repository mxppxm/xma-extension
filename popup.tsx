import { useMount, useSetState } from "ahooks"
import _ from "lodash"

import EditPageData from "~components/editPageData"
import { EffectAction } from "~components/EffectAction"
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
        if (res.store.version !== InitState.version) {
          ChromeStorage.set({ [StorageKey.STORE]: InitState })
        } else {
          _setStore(res.store as unknown as typeof InitState)
        }
      }
    })
  })
  const setStore: typeof _setStore = (newState) => {
    _setStore(newState)
    ChromeStorage.set({ [StorageKey.STORE]: newState })
  }

  return (
    <ExtensionContext.Provider value={{ store, setStore }}>
      <EffectAction />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16,
          width: 600
        }}>
        <Header title="请求打印" />
        <Log />
        <Header title="修改pageData" />
        <EditPageData />
        <Header title="多语key查询" />
        <Header title="多语修改" />
      </div>
    </ExtensionContext.Provider>
  )
}

export default IndexPopup

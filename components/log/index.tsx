import { Switch, Typography } from "@douyinfe/semi-ui"
import { useContext } from "react"

import { ExtensionContext } from "~store"

const { Title } = Typography
export default function Log() {
  const { store, setStore } = useContext(ExtensionContext)
  const { isLogOpen } = store
  console.log("🚀 xma 🚀 ~ file: index.tsx:10 ~ isLogOpen:", isLogOpen)

  const onChangeOpen = (checked: boolean) => {
    setStore({ isLogOpen: checked })
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Title heading={6} style={{ margin: 8 }}>
        {isLogOpen ? "已开启" : "已关闭"}
      </Title>
      <Switch
        checked={isLogOpen}
        onChange={onChangeOpen}
        aria-label="a switch for demo"
      />
    </div>
  )
}

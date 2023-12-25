import { Switch, Typography } from "@douyinfe/semi-ui"
import { useContext } from "react"

import { ExtensionContext } from "~store"

const { Title } = Typography
export default function EditPageData() {
  const { store, setStore } = useContext(ExtensionContext)
  const { isEditPageData } = store

  const onChangeOpen = (checked: boolean) => {
    setStore({ isEditPageData: checked })
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Title heading={6} style={{ margin: 8 }}>
        {isEditPageData ? "已开启" : "已关闭"}
      </Title>
      <Switch
        checked={isEditPageData}
        onChange={onChangeOpen}
        aria-label="a switch for demo"
      />
    </div>
  )
}

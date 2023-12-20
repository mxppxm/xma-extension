import { useState } from "react"

import Log from "~components/log"
import Title from "~components/title"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 300
      }}>
      <Title title="请求打印" />
      <Log />
      <Title title="请求拦截替换" />
    </div>
  )
}

export default IndexPopup

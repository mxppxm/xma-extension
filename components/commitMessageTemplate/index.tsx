import {
  Button,
  Col,
  Form,
  Row,
  Switch,
  Toast,
  Typography
} from "@douyinfe/semi-ui"
import { useKeyPress } from "ahooks"
import _ from "lodash"
import { useRef, useState } from "react"

const { Title } = Typography

export default function CommitMessageTemplate() {
  const [show, setShow] = useState(false)
  const onSubmit = (values: any) => {
    if (_.isEmpty(values)) {
      return
    }
    const { mono, Apps, supportModuleBranch, AppBranch, pc, wap, note } = values
    const defaultBranch = "release"
    const textList = []
    if (mono || Apps || supportModuleBranch) {
      textList.push(`大仓部署
    branch: ${mono || defaultBranch}
    Apps: ${Apps}
    AppBranch：${AppBranch || defaultBranch}
    SupportModulesBranch: ${supportModuleBranch || defaultBranch}`)
    }
    if (pc || wap) {
      textList.push("非大仓部署：")
      pc && textList.push(`  pc: ${pc}`)
      wap && textList.push(`  wap: ${wap}`)
    }
    if (note) {
      textList.push(`备注：${note}`)
    }
    textList.push("mr:")
    const text = textList.join("\n")
    navigator.clipboard.writeText(text)
    Toast.success("复制成功")
  }
  const formRef = useRef(null)

  useKeyPress(["meta.enter"], () => {
    if (!show) {
      return
    }
    formRef.current.formApi.submitForm()
  })

  const renderForm = () => {
    if (!show) {
      return null
    }
    return (
      <Form onSubmit={onSubmit} ref={formRef}>
        <Row>
          <Col span={8}>
            <Form.Input
              field="mono"
              label="大仓branch"
              placeholder="不填默认release"
            />
            <Form.Input field="Apps" placeholder="输入修改的app，逗号分开" />
            <Form.Input
              field="AppBranch"
              placeholder="输入修改的app，逗号分开"
            />
            <Form.Input
              field="supportModuleBranch"
              placeholder="不填默认release"
            />
          </Col>
          <Col span={8} offset={2}>
            <Form.Input
              field="pc"
              label="Pc仓库branch"
              placeholder="不填则不更新"
            />
            <Form.Input
              field="wap"
              label="wap仓库branch"
              placeholder="不填则不更新"
            />
            <Form.TextArea field="note" label="备注" placeholder="不填则为空" />
          </Col>
        </Row>
        <Row></Row>
        <Button type="primary" htmlType="submit" className="btn-margin-right">
          确认复制
        </Button>
      </Form>
    )
  }

  return (
    <div>
      <Title heading={6} style={{ margin: 8 }}>
        依次填写版本号后回车复制
      </Title>
      <Switch
        checked={show}
        onChange={(checked) => {
          console.log("🚀 xma 🚀 ~ file: index.tsx:94 ~ checked:", checked)
          setShow(checked)
        }}
      />
      {renderForm()}
    </div>
  )
}

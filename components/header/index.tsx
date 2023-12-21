import { Divider } from "@douyinfe/semi-ui"

interface IProps {
  title: string
}
export default function Header(props: IProps) {
  const { title } = props
  return (
    <Divider margin="12px" align="center" style={{ fontWeight: 600 }}>
      {title}
    </Divider>
  )
}

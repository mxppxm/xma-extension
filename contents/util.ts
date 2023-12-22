export function isValidLogHost() {
  const host = window.location.host
  console.log("🚀 xma 🚀 ~ file: util.ts:3 ~ host:", host)
  if (host.includes("umu.work")) {
    return false
  }
  return (
    host.includes("umu") ||
    window.location.host.includes("localhost") ||
    window.location.host.includes("172")
  )
}

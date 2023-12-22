import { isValidLogHost } from "~contents/util"

export function loadPageScript(url: string) {
  if (isValidLogHost()) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.setAttribute("type", "text/javascript")
      script.setAttribute("src", chrome.runtime.getURL(url))
      document.documentElement.appendChild(script)

      script.onload = resolve
    })
  }
  return Promise.reject("invalid host")
}

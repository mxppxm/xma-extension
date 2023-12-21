export function loadPageScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.setAttribute("type", "text/javascript")
    script.setAttribute("src", chrome.runtime.getURL(url))
    document.documentElement.appendChild(script)

    script.onload = resolve
  })
}

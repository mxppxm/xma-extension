export function loadPageScript(url: string) {
  const script = document.createElement("script")
  script.setAttribute("type", "text/javascript")
  script.setAttribute("src", chrome.runtime.getURL(url))
  document.documentElement.appendChild(script)

  script.addEventListener("load", () => {
    console.log("🚀 xma 🚀 ~ file: loadPageScript.ts:11 ~ load success:", url)
  })
}

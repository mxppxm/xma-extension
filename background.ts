// 接收iframe传来的信息，转发给content.js
chrome.runtime.onMessage.addListener((msg) => {
  console.log("🚀 xma 🚀 ~ file: background.ts:4 ~ msg:", msg)

  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, { ...msg, to: 'content' });
  //   })
  // }
})

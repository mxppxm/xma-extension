/** 去除参数中的t参数 */
const removeTParams = (match) => {
  const url = match.split("?")[0]
  let newUrl = ""
  if (url[1]) {
    return url
  }
  const params = match
    .split("?")[1]
    .split("&")
    .filter((item) => {
      return !item.includes("t=")
    })
  if (params.length) {
    newUrl = url + "?" + params.join("&")
  }
  return newUrl
}

function convertToNumber(value) {
  if (isNaN(Number(value))) {
    return value
  } else {
    return Number(value)
  }
}

function createNewResponse(oldResponse, responseText) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(responseText))
      controller.close()
    }
  })

  const tempResponse = new Response(stream, {
    headers: oldResponse.headers,
    status: oldResponse.status,
    statusText: oldResponse.statusText
  })
  const proxy = new Proxy(tempResponse, {
    get: function (target, name) {
      switch (name) {
        case "ok":
        case "redirected":
        case "type":
        case "url":
        case "useFinalURL":
        case "body":
        case "bodyUsed":
          return oldResponse[name]
      }
      return target[name]
    }
  })

  for (let key in proxy) {
    if (typeof proxy[key] === "function") {
      proxy[key] = proxy[key].bind(tempResponse)
    }
  }
  return proxy
}

function isMatchedRequest(url) {
  const host = window.location.host
  // if (!XMA_LOG.settings.ajaxInterceptor_switchList_logSwitch) {
  //   return false
  // }

  if (!url.includes("http")) {
    return true
  }
  if (host.includes("172")) {
    return true
  }

  const domain = url.split("?")[0]
  return domain.includes(host)
}

function convertFormDataToJson(str) {
  const jsonReg1 = /{.*?}&/
  const hasJson1 = jsonReg1.test(str)
  if (!hasJson1) {
    const jsonReg2 = /{.*?}/
    const hasJson2 = jsonReg2.test(str)
    if (hasJson2) {
      const jsonStr = jsonReg2.exec(str)[0]
      const newStr = str.replace(jsonReg2, "@")
      return { str: newStr, jsonStr }
    } else {
      return { str }
    }
  } else {
    const jsonStr = jsonReg1.exec(str)[0].slice(0, -1)
    const newStr = str.replace(jsonReg1, "@&")
    return { str: newStr, jsonStr }
  }
}

function logRequest(request, isFetch = true) {
  const bindToConsole = (consoleMethod, polyfill) => {
    return consoleMethod ? consoleMethod.bind(console) : polyfill
  }
  const logging = (() => {
    let prefix = ""

    const consoleLog = (...args) => {
      console.log(prefix, ...args)
    }

    const consoleError = (...args) => {
      console.error(prefix, ...args)
    }

    const consoleGroup = (...args) => {
      consoleLog(...args)
      prefix += "> "
    }

    const consoleGroupEnd = () => {
      prefix = prefix.slice(0, -2)
    }

    return {
      log: consoleLog,
      error: consoleError,
      group: bindToConsole(console.group, consoleGroup),
      groupCollapsed: bindToConsole(console.groupCollapsed, consoleGroup),
      groupEnd: bindToConsole(console.groupEnd, consoleGroupEnd)
    }
  })()

  const formatMessage = (method, url, ellapsed = 0) => {
    const headerCss = [
      "color: gray; font-weight: lighter", // title
      `color: ${method.toLocaleUpperCase() === "GET" ? "#03A9F4" : "red"};`, // method
      "color: inherit;", //url
      "color: gray; font-weight: lighter;"
    ]

    const parts = [
      "%c umu",
      `%c${method.toLocaleUpperCase()}`,
      `%c${url}`,
      `%c(in ${ellapsed} ms)`
    ]
    return [parts.join(" "), ...headerCss]
  }

  if (isFetch) {
    const { 0: url, 1: options, response, time } = request
    if (!isMatchedRequest(url)) {
      return response
    }
    const { method } = options
    let requestMethod = method || "GET"
    let params = {}
    const [requestUrl, paramStr] = url.split("?")
    if (requestMethod.toLocaleUpperCase() === "GET") {
      if (paramStr) {
        paramStr.split("&").forEach((item) => {
          const [key, value] = item.split("=")
          let newValue = value
          if (newValue.includes("%7B")) {
            newValue = JSON.parse(decodeURIComponent(value))
          }
          params[key] = convertToNumber(newValue)
        })
      }
    } else {
      const { body, headers } = options
      if (headers["Content-Type"] === "application/json") {
        params = JSON.parse(body)
      } else {
        body.split("&").forEach((item) => {
          const [key, value] = item.split("=")
          params[key] = convertToNumber(value)
        })
      }
    }

    return response
      .json()
      .then((data) => {
        const group = formatMessage(requestMethod, requestUrl, time)

        logging.groupCollapsed(...group)
        logging.log("PARAMS", params)
        logging.log("RESULT", data)

        logging.groupEnd(...group)
        return createNewResponse(response, JSON.stringify(data))
      })
      .catch((e) => {
        console.log("err fetch response error :>> ", e)
      })
  } else {
    const { xhrRequest, time } = request
    if (!isMatchedRequest(xhrRequest.responseURL)) {
      return
    }
    let requestMethod = xhrRequest.method || "GET"
    let params = {}
    let url = ""
    if (xhrRequest.responseURL.indexOf(window.location.host) > -1) {
      url = xhrRequest.responseURL.split(window.location.host)[1]
    }
    const [requestUrl, paramStr] = url.split("?")
    if (requestMethod.toLocaleUpperCase() === "GET") {
      paramStr &&
        paramStr.split("&").forEach((item) => {
          const [key, value] = item.split("=")
          let newValue = value
          if (newValue.includes("%7B")) {
            newValue = JSON.parse(decodeURIComponent(value))
          } else {
            newValue = convertToNumber(value)
          }
          params[key] = newValue
        })
    } else {
      const { postParams } = xhrRequest
      function parseURLParams(url) {
        const paramsString = url
        if (!paramsString) {
          return {} // 没有参数的情况
        }
        let replaceList = []
        const reg = /=({.*?})(&|$)/g
        // 先将 ={...} 替换为占位符
        function replacer(match) {
          replaceList.push(match)
          return `=$placeholder-${replaceList.length - 1}`
        }
        const replacedString = paramsString.replace(reg, replacer)
        replacedString.split("&").forEach((item) => {
          const [key, value] = item.split("=")
          const newValue = value.includes("$placeholder")
            ? replaceList[value.split("-")[1]]?.slice(1)
            : value
          try {
            params[key] = JSON.parse(newValue)
          } catch {
            params[key] = newValue
          }
        })

        return params
      }
      parseURLParams(postParams)
    }
    const group = formatMessage(requestMethod, requestUrl, time)

    logging.groupCollapsed(...group)
    logging.log("PARAMS", params)
    let reText = xhrRequest.responseText
    if (params.callback) {
      reText = reText.slice(params.callback.length + 1, -2)
    }
    logging.log("RESULT", reText ? JSON.parse(reText) : reText)

    logging.groupEnd(...group)
  }
}

function init() {
  XMLHttpRequest.prototype.wrappedSetRequestHeader =
    XMLHttpRequest.prototype.setRequestHeader
  XMLHttpRequest.prototype.wrappedSend = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.wrappedOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function (...args) {
    this.wrappedOpen(...args)
    // get请求send没有参数，post请求有
    this.method = args[0]
  }

  XMLHttpRequest.prototype.send = function (...args) {
    this.wrappedSend(...args)
    // get请求send没有参数，post请求有
    this.postParams = decodeURIComponent(args[0])
  }
  // Override the existing setRequestHeader function so that it stores the headers
  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    // Call the wrappedSetRequestHeader function first
    // so we get exceptions if we are in an erronous state etc.
    this.wrappedSetRequestHeader(header, value)

    // Create a headers map if it does not exist
    if (!this.headers) {
      this.headers = {}
    }

    // Create a list for the header that if it does not exist
    if (!this.headers[header]) {
      this.headers[header] = []
    }

    // Add the value to the header
    this.headers[header].push(value)
  }
}

// 命名空间
const XMA_LOG = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_rules: [],
    ajaxInterceptor_switchList_logSwitch: false
  },

  originalXHR: window.XMLHttpRequest,
  myXHR: function () {
    let pageScriptEventDispatched = false
    const modifyResponse = () => {
      XMA_LOG.settings.ajaxInterceptor_rules.forEach(
        ({
          filterType = "normal",
          switchOn = true,
          match,
          overrideTxt = ""
        }) => {
          let matched = false
          if (switchOn && match) {
            const newMatch = removeTParams(match)
            const newResponse = removeTParams(this.responseURL)

            if (filterType === "normal" && newResponse.indexOf(newMatch) > -1) {
              matched = true
            } else if (
              filterType === "regex" &&
              this.responseURL.match(new RegExp(match, "i"))
            ) {
              matched = true
            }
          }
          if (matched) {
            this.responseText = overrideTxt
            this.response = overrideTxt

            if (!pageScriptEventDispatched) {
              window.dispatchEvent(
                new CustomEvent("pageScript", {
                  detail: { url: this.responseURL, match }
                })
              )
              pageScriptEventDispatched = true
            }
          }
        }
      )
    }
    const startTime = new Date().getTime()
    const xhr = new XMA_LOG.originalXHR()
    for (let attr in xhr) {
      if (attr === "onreadystatechange") {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
            // 请求成功
            if (XMA_LOG.settings.ajaxInterceptor_switchOn) {
              // 开启拦截
              modifyResponse()
            }
          }
          const time = new Date().getTime() - startTime
          // logRequest({ xhrRequest: args[0].srcElement, time }, false)
          this.onreadystatechange && this.onreadystatechange.apply(this, args)
        }
        continue
      } else if (attr === "onload") {
        xhr.onload = (...args) => {
          // 请求成功
          if (XMA_LOG.settings.ajaxInterceptor_switchOn) {
            // 开启拦截
            modifyResponse()
          }
          const time = new Date().getTime() - startTime
          logRequest({ xhrRequest: args[0].srcElement, time }, false)
          this.onload && this.onload.apply(this, args)
        }
        continue
      }

      if (typeof xhr[attr] === "function") {
        this[attr] = xhr[attr].bind(xhr)
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
        if (attr === "responseText" || attr === "response") {
          Object.defineProperty(this, attr, {
            get: () =>
              this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: (val) => (this[`_${attr}`] = val),
            enumerable: true
          })
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => (xhr[attr] = val),
            enumerable: true
          })
        }
      }
    }
  },

  originalFetch: window.fetch.bind(window),
  myFetch: function (...args) {
    const startTime = new Date().getTime()
    return XMA_LOG.originalFetch(...args).then((response) => {
      let txt = undefined
      XMA_LOG.settings.ajaxInterceptor_rules.forEach(
        ({
          filterType = "normal",
          switchOn = true,
          match,
          overrideTxt = ""
        }) => {
          let matched = false
          if (switchOn && match) {
            const newMatch = removeTParams(match)
            const newResponseUrl = removeTParams(response.url)
            if (
              filterType === "normal" &&
              newResponseUrl.indexOf(newMatch) > -1
            ) {
              matched = true
            } else if (
              filterType === "regex" &&
              response.url.match(new RegExp(match, "i"))
            ) {
              matched = true
            }
          }

          if (matched) {
            window.dispatchEvent(
              new CustomEvent("pageScript", {
                detail: { url: response.url, match }
              })
            )
            txt = overrideTxt
          }
        }
      )
      let newResponse
      if (txt !== undefined) {
        newResponse = createNewResponse(response, txt)
      } else {
        newResponse = response
      }
      const time = new Date().getTime() - startTime
      return logRequest({ response: newResponse, ...args, time })
    })
  }
}

const printLog = true
if (printLog) {
  init()
  window.XMLHttpRequest = XMA_LOG.myXHR
  window.fetch = XMA_LOG.myFetch
} else {
  window.XMLHttpRequest = XMA_LOG.originalXHR
  window.fetch = XMA_LOG.originalFetch
}

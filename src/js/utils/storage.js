/**
 * 存储localStorage
 */
var domainName = 'dmain'
export const setDomain = (name) => {
  domainName = name
}
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(domainName + name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(domainName + name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(domainName + name)
}

export const setLocalStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(domainName + name, content)
}

/**
 * 获取localStorage
 */
export const getLocalStore = name => {
  if (!name) return
  return window.localStorage.getItem(domainName + name)
}

/**
 * 删除localStorage
 */
export const removeLocalStore = name => {
  if (!name) return
  window.localStorage.removeItem(domainName + name)
}

var _traceTimer = Date.now()
export const traceTimer = name => {
  if (name === '0') {
    _traceTimer = Date.now()
  } else {
    console.log(name, Date.now() - _traceTimer)
  }
}
export const isTheme = configTheme => {
  if (configTheme === '1a1d5c' || configTheme === '95262b' || configTheme === '1a2d5c') return true
  else return false
}

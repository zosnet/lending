// 检查用户名长度
export function checkUsernameLength (str) {
  return (str.length === 0 || str.length > 63)
}

// 检查用户名开头字符
export function checkUsernameBegin (str) {
  let strTemp = str.substr(0, 1)
  return (!((strTemp >= 'a' && strTemp <= 'z') || (strTemp >= 'A' && strTemp <= 'Z')))
}

// 检查用户名规则
export function checkUsernameRule (str) {
  return !new RegExp(/^[0-9a-zA-Z-]{1,}$/).test(str)
}

// 过滤ZOS
export const checkRegName = (str) => {
  return str.indexOf('zos') !== -1
}

// 是否是以http:// || https://开头
export const checkUrl = (str) => {
  return /^(http:\/\/|https:\/\/).*$/.test(str)
}

export function toggleClass (element, className) {
  // console.log('taoggggclass')
  if (!element || !className) {
    return
  }
  element.className = className
}

// 得到unix时间
export const formatUnixTime = (str) => {
  function add (m) { return m < 10 ? '0' + m : m }
  let time = new Date(str)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return y + '-' + add(m) + '-' + add(d) + 'T' + add(h) + ':' + add(mm) + ':' + add(s)
}
export const getNeedLogin = (path, pathsrc, options) => {
  for (var index = 0; index < options.length; index++) {
    let element = options[index]
    if (pathsrc === '/') pathsrc = ''
    let pathnew = pathsrc + '/' + element.path
    if (element.path[0] === '/') pathnew = element.path
    // console.log(pathnew, element.path)
    if (pathnew === path) return element.needlogin
    if (element.children !== undefined) {
      var re = getNeedLogin(path, pathnew, element.children)
      if (re === true) return re
    }
  }
  return false
}

export const loginToPath = (ZOSIn, thisVm, loginPath) => {
  let sLogin = !ZOSIn.accountIsLoginout()
  thisVm.$store.state.login = sLogin
  if (!sLogin) {
    if (getNeedLogin(loginPath.path, '/', thisVm.$router.options.routes)) {
      thisVm.$store.state.loginPath = loginPath
      return
    }
  }
  thisVm.$store.state.loginPath = undefined
  thisVm.$router.push(loginPath)
}
export const getTimezoneDate = (dateString) => {
  if (dateString === undefined || dateString === null || dateString.length <= 0) return 'N/A'
  if (dateString[dateString.length - 1] !== 'Z') dateString = dateString + 'Z'
  let dateObj = new Date(dateString)
  if (dateObj.getTime() <= 0) {
    return 'N/A'
  }
  return formatDate(dateObj)
}
export const formatDate = (date, fmt = 'yyyy-MM-ddThh:mm:ss') => {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 格式化法币
 * @param  {[value]} int [法币数值]
 * @param  {[type]} string [法币类型]
 * @return {[string]} [返回处理格式后数据]
 */
var companyName = 'ZOS'
const formatBaseCurrency = (value, precision) => {
  let num = Number(value).toFixed(precision)
  let numex = num
  let prex = ''
  if (num < 0) {
    numex = -numex
    prex = '-'
  }
  return prex + Math.floor(numex).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + num.toString().slice(num.length - precision - 1, num.length)
}
const formatLegalCurrency = (value, type, precision = 2) => {
  if (typeof (precision) === 'undefined' || Number(precision) < 2) {
    console.log(precision, 'please input precision')
    precision = 2
  }
  if (type !== 'undefind') {
    return type.toString() + ' ' + formatBaseCurrency(value, precision)
  }
}

const formatLegalCurrency2 = (value, type, precision = 2) => {
  if (typeof (precision) === 'undefined' || Number(precision) < 2) {
    console.log(precision, 'please input precision')
    precision = 2
  }
  if (type !== 'undefind') {
    return formatBaseCurrency(value, precision) + ' ' + type
  }
}
const formatLegalCurrency3 = (value, type, precision = 2) => {
  if (typeof (precision) === 'undefined' || Number(precision) < 2) {
    console.log(precision, 'please input precision')
    precision = 2
  }
  if (type !== 'undefind') {
    return formatBaseCurrency(value / Math.pow(10, precision), precision) + ' ' + type
  }
}

const formatLegalCurrencys = (value, type, precision = 2) => {
  if (typeof (precision) === 'undefined' || Number(precision) < 2) {
    console.log(precision, 'please input precision')
    precision = 2
  }
  if (type !== 'undefind') {
    return formatBaseCurrency(value, precision)
  }
}

const formatDigitalCurrency = (value, type = '') => {
  let num = value.toString().split('.')
  if (num.length > 1) {
    num = '.' + num[1]
  } else {
    num = ''
  }
  return type.toString() + ' ' + Math.floor(value).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + num
}

const formatDecimalCurrency = (value) => {
  let num = value.toString().split('.')
  if (num.length > 1) {
    num = '.' + num[1]
  } else {
    num = ''
  }
  return Math.floor(value).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + num
}

const formatDecimal = (num, val) => {
  let mnum = num.toString()
  let nums = mnum.substring(mnum.indexOf('.') + 1)
  let decimal = 0
  if (nums.length > val) {
    let into = num + 5 / Math.pow(10, (val + 1))
    decimal = into.toFixed(val)
  }
  return decimal
}

const digitUppercase = (borrowNum) => {
  var n = Number(borrowNum)
  if (n > 0) {
    var fraction = ['角', '分', '厘']
    var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
    ]
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ]
    var head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    var s = ''
    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (var index = 0; index < unit[0].length && n > 0; index++) {
      var p = ''
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p
        n = Math.floor(n / 10)
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][index] + s
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  } else if (borrowNum !== '') {
    return '格式错误'
  }
}

const converPercentage = (value) => {
  return (value / 10).toFixed(1) + '‰'
}

const dateDiffDay = (sDate1, sDate2, s, showSecond) => {
  if (!sDate1 || !sDate2) {
    return ''
  }
  let oDate1, oDate2, iDays, diff, iHour, iMinute, iSecond
  if (typeof (sDate1) === 'string') {
    oDate1 = Date.parse(new Date(sDate1.replace('T', ' ').replace(/-/g, '/')))
  } else if (typeof (sDate1) === 'number') {
    oDate1 = sDate1
  } else {
    oDate1 = Date.parse(sDate1)
  }
  if (typeof (sDate2) === 'string') {
    oDate2 = Date.parse(new Date(sDate2.replace('T', ' ').replace(/-/g, '/')))
  } else if (typeof (sDate2) === 'number') {
    oDate2 = sDate2
  } else {
    oDate2 = Date.parse(sDate2)
  }
  diff = parseInt(Math.abs(oDate1 - oDate2))
  if (diff < 0) {
    diff = 0
  }
  iDays = Math.floor(diff / (24 * 3600 * 1000))
  let leave1 = diff % (24 * 3600 * 1000)
  iHour = Math.floor(leave1 / (3600 * 1000))
  let leave2 = leave1 % (3600 * 1000)
  iMinute = Math.floor(leave2 / (60 * 1000))
  let leave3 = leave2 % (60 * 1000)
  iSecond = Math.round(leave3 / 1000)
  if (s) {
    return iDays + window.vm.$t('m.days') + ' ' + iHour + window.vm.$t('m.hours') + ' ' + iMinute + window.vm.$t('m.minute')
  } else {
    if (showSecond) {
      return iDays + window.vm.$t('m.day') + iHour + window.vm.$t('m.hours') + iMinute + window.vm.$t('m.minute') + iSecond + window.vm.$t('m.minutes')
    } else {
      return iDays + window.vm.$t('m.day') + iHour + window.vm.$t('m.hours')
    }
  }
}

const rePayState = (tableData) => {
  for (let index = 0; index < tableData.length; index++) {
    const itemData = tableData[index][1]
    if (itemData.interest_state === 1) {
      let d = Date.parse(itemData.expect_time.substr(0, itemData.expect_time.indexOf('T'))) - Date.parse(this.$store.state.curDate)
      // 正常,剩
      return window.vm.$t('m.borrowsuccess.normal') + ' (' + window.vm.$t('m.borrowsuccess.remaining') + Math.ceil(d / (3600 * 24 * 1000)) + window.vm.$t('m.day') + ')'
    } else if (itemData.interest_state === 3) {
      let d = Date.parse(itemData.overdue_time.substr(0, itemData.overdue_time.indexOf('T'))) - Date.parse(this.$store.state.curDate)
      return window.vm.$t('m.borrowsuccess.withOut') + ' (' + Math.ceil(d / (3600 * 24 * 1000)) + window.vm.$t('m.day') + ')'
    }
  }
}

const formatDateStr = (dateStr) => {
  return dateStr.toString().replace('T', ' ')
}

// 应还日期，不是时分
const formatDateStrHour = (dateStr) => {
  const datestr = dateStr.toString()
  return datestr.substring(0, datestr.indexOf('T'))
}
const formatDateStrHour1 = (dateStr) => {
  const datestr = dateStr.toString()
  return datestr.substring(0, datestr.indexOf(':'))
}

const formatProposalTime = (str) => {
  function add (m) { return m < 10 ? '0' + m : m }
  let time = new Date(str)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm) + ':' + add(s)
}

const formatLocalTime = (str) => {
  function add (m) { return m < 10 ? '0' + m : m }
  let time = new Date(str + 'Z')
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm) + ':' + add(s)
}
const formatCompanyName = (value) => {
  if (value === undefined || value == null || value.length < 3) return value
  return value.toString().replace(/ZOS/ig, companyName)
}

const setCompanyName = (name) => {
  companyName = name
}
export default {
  formatBaseCurrency,
  formatLegalCurrency,
  formatLegalCurrencys,
  formatLegalCurrency2,
  formatLegalCurrency3,
  formatDigitalCurrency,
  digitUppercase,
  converPercentage,
  dateDiffDay,
  formatDateStr,
  formatDateStrHour,
  formatDateStrHour1,
  rePayState,
  setCompanyName,
  formatDecimal,
  formatDecimalCurrency,
  formatLocalTime,
  formatCompanyName,
  formatProposalTime
}

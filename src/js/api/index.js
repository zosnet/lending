import http from './public'
import { setLocalStore, getLocalStore } from '/js-utils/storage'
// 请求提现
export const requestToCash = (url, params) => {
  return http.fetchPost(url + '/withdraw/orders', params)
}
// 确认提现
export const confirmToCash = (url, params) => {
  return http.fetchPost(url + '/withdraw/confirm', params)
}
// 请求充值
export const requestRecharge = (url, params) => {
  return http.fetchPost(url + '/topup/orders', params)
}
// 确认充值
export const confirmRecharge = (url, params) => {
  return http.fetchPost(url + '/topup/confirm', params)
}
// 获取充币地址
export const getRechargeAddress = (url, params) => {
  return http.fetchPost(url + '/cointopup/address', params)
}
// 登录用户数据中心
export const requestLoginUserData = (url, params) => {
  return http.fetchPost(url + '/login', params)
}
// 设置用户数据
export const requestSetUserData = (url, params) => {
  return http.fetchPost(url + '/setdata', params)
}
// 获取用户数据
export const getUserData = (url, params) => {
  return http.fetchPost(url + '/getdata', params)
}
// 获取用户手机号
export const getUserPhone = (url, params) => {
  return http.fetchPost(url + '/getmobile', params)
}
// 获取验证码
export const getSmsCode = (url, params) => {
  return http.fetchPost(url + '/zos-kyc/sms/captcha', params)
}
export const checkSmsCode = (url, params) => {
  return http.fetchPost(url + '/zos-kyc/sms/checkcaptcha', params)
}
// 绑定手机号
export const bindPhone = (url, params) => {
  return http.fetchPost(url + '/bindmobile', params)
}
// 获取网关配置
// 获取网关配置
export const getGatewayConfig = (cache) => {
  if (cache) {
    var readCfg = JSON.parse(getLocalStore('GatewayConfig'))
    return Promise.resolve(readCfg)
  } else {
    var getCfg = http.fetchGet('../../../static/config.json', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    getCfg.then(res => {
      setLocalStore('GatewayConfig', res)
    })
    return getCfg
  }
}

export const getHtml = (url) => {
  return http.fetchGet(url)
}

// 充提记录列表
export const orderRecordList = (url, params) => {
  return http.fetchPost(url + '/orderrecord/list', params)
}
// 获取网关联系方式
export const getGatewayContact = (url, params) => {
  return http.fetchPost(url + '/gatewaycontact', params)
}
// 获取当前充值订单详情
export const orderRecordTopup = (url, params) => {
  return http.fetchGet(url + '/orderrecord/topup/' + params)
}
// 提交KYC信息
export const kycInfo = (url, params) => {
  return http.fetchPost(url + '/activity/kycinfo4web', params)
}
// 检查KYC状态
export const kycStatus = (url, params) => {
  return http.fetchPost(url + '/user/kycstatus4web', params)
}
// 获取KYC状态列表
export const getkycStatusList = (url, params) => {
  return http.fetchPost(url + '/user/kycstatus4webV2', params)
}
// 获取网关前端地址
export const getGatewayAddress = (url, params) => {
  return http.fetchPost(url + '/url', params)
}
// 获取KYC前端地址
export const getKycAddress = (url, params) => {
  return http.fetchPost(url + '/url', params)
}

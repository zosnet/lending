import Vue from 'vue'
import Vuex from 'vuex'
import action from './action'
Vue.use(Vuex)

const state = {
  // 是否登录
  newVersion: false,
  login: false,
  userName: null,
  userDataSid: null,

  // 用户信息
  userInfo: {},
  basicList: null,
  userassets: null,
  initFinished: false,
  unRouterChange: false,
  coupon: { amount: 0 },

  accountNameHistory: '',
  accountNameId: '',
  // 配置文件
  carrierList: null,
  admin: null, // 管理员的账号名字
  admin_id: null, // 管理员的账号ID
  // gatewayUrl: null,
  // USERDATA_URL: null,
  // KYC_URL: null,
  settingsAPIs: null,
  chain: null,
  loginPath: undefined,
  lang: 1,
  theme: '',
  logo: '',
  logoen: '',
  copyRight: '',
  loanMode: 3,
  link: '',
  configTheme: '1a1d5c',
  adminNotifyId: '',
  connectionStatus: '',
  curDate: new Date(),
  exchangegateway: undefined,
  authoradmin: undefined,
  ucurl: undefined,
  companyName: 'ZOS',
  serveType: 1,
  accountObj: undefined,
  loanAssetArr: []
}

export default new Vuex.Store({
  state,
  action
})

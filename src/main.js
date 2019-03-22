import './js/global'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import filters from './js/filters'
import VueCookie from 'vue-cookie'
import {ZOSInstance} from 'zos-wallet-js'
import {ChainStore} from 'zosjs/es'
import { getNeedLogin, toggleClass } from '/js-utils/until'
import VueClipboard from 'vue-clipboard2'
import { Apis, ChainConfig } from 'zosjs-ws'
import { Button, Pagination, Checkbox, CheckboxButton, CheckboxGroup, Icon, Autocomplete, Loading, Message, Notification, Steps, Step, Table, TableColumn, DatePicker, TimeSelect, TimePicker, Input, InputNumber, Dialog, Select, Option, Collapse, CollapseItem, Cascader, Tabs, TabPane, Radio, RadioGroup, RadioButton, Form, FormItem, Progress, Carousel, CarouselItem, Alert, Slider, Row, Col, Card, Container, Header, Aside, Main, Footer, Tooltip, popover, Dropdown, DropdownMenu, DropdownItem, Tag } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import i18n from './langue'
import { getGatewayConfig } from '/js-api/index'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import { getLocalStore, setLocalStore, traceTimer, isTheme, getStore, setStore, setDomain } from '/js-utils/storage'
// export var eventInstance = new Vue()

Vue.use(VueClipboard)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Main)
Vue.use(locale)
Vue.use(Button)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Progress)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Icon)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(popover)
Vue.use(Tag)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$echarts = echarts
Vue.use(VueCookie)
// 导入公共 filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

// const whiteList = ['/home', '/login', '/register', '/blockBrowser', '/setting/accessSettings', '/setting/faucetAddress', '/invest/investList', '/history', '/setting/carrier', '/logo', '/setting/generalSetup'] // 不需要登陆的页面
router.beforeEach(function (to, from, next) {
  var element = document.getElementsByClassName('el-main')[0]
  if (element) {
    element.scrollTop = 0
  }
  if (to.path !== '/login' && to.path !== '/register') {
    router.options.nextpath = {
      path: to.path,
      query: to.query
    }
  }
  let sLogin = !ZOSInstance.accountIsLoginout()
  store.state.login = sLogin
  if (!sLogin) {
    if (!getNeedLogin(to.path, '/', router.options.routes)) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  store,
  i18n,
  router,
  created () {
    traceTimer('0')
    setDomain(this.getDomain())
    this._getVersion()
    Apis.setRpcConnectionStatusCallback(this.onUpdateRpcConnectionStatus)
    getGatewayConfig(!this.$store.state.newVersion).then(res => {
      try {
        traceTimer('1')
        this.$store.state.admin = res.admin
        // this.$store.state.gatewayUrl = res.gatewayUrl
        // this.$store.state.USERDATA_URL = res.USERDATA_URL
        // this.$store.state.KYC_URL = res.KYC_URL
        this.$store.state.settingsAPIs = res.settingsAPIs
        this.$store.state.chain = res.chain
        this.$store.state.logo = res.logo
        this.$store.state.logoen = res.logoen
        this.$store.state.themeEn = res.themeEn
        this.$store.state.copyRight = res.copyRight
        this.$store.state.copyRightEn = res.copyRightEn
        this.$store.state.link = res.link.slice(0, 5)
        this.$store.state.linkEn = res.linkEn.slice(0, 5)
        this.$store.state.userName = getStore('userName')
        this.$store.state.userDataSid = getStore('userId')
        this.$store.state.login = false
        this._getLogo(res)
        ZOSInstance.init(res.settingsAPIs, () => {
          traceTimer('2')
          if (Apis.instance().chain_id === res.chain.chain_id) {
            ChainConfig.setPrefix(res.chain.address_prefix)
            console.log('Successful modification of chain ID', res.chain.chain_id)
          } else {
            console.error('Unknown chain id = ', Apis.instance().chain_id, '  setting chain id = ', res.chain.chain_id)
          }
          ChainStore.getObject('2.1.0', false, true)
          ChainStore.getObject('2.0.0', false, true)
          ChainStore.getObject('1.3.0', false, true)
          ChainStore.subscribe(ZOSInstance.subscribe)
          Apis.instance().db_api().exec('lookup_account_names', [[res.admin, 'admin-notify']]).then(resAcc => {
            traceTimer('3')
            if (!resAcc[0]) {
              this.throwErr('admin does not exist')
            }
            if (!resAcc[1]) {
              this.throwErr('admin Notify not exist')
            }
            this.$store.state.admin_id = resAcc[0].id
            this.$store.state.adminNotifyId = resAcc[1].id
            this._getThemeConfig()
            this._getUserName()
            this._loanAssetArr().then(res => {
              ChainStore.setLoginAccount(this.$store.state.userDataSid)
              this.$store.state.initFinished = true
              this.$emit('initFinished', true) // 网络初始化完成事件
              traceTimer('4')
            })
          })
        }, () => {
          this.$store.state.initFinished = false
          this.$emit('initFail', true)
          console.log('initFail')
          this.$message({
            message: 'connection failed',
            type: 'error'
          })
        })
      } catch (errs) {
        console.log(errs)
        this.$store.state.initFinished = false
        this.$emit('initFail', true)
        this.$message({ message: 'JSON文件格式错误' + errs, type: 'warning' })
      }
    })
  },
  methods: {
    onUpdateRpcConnectionStatus (status) {
      traceTimer('4')
      console.log(status, '========')
      this.$store.state.connectionStatus = status
      if (status === 'reconnect') ChainStore.resetCache(false)
      else this.$emit('RpcConnectionStatus', status)
    },
    getDomain () {
      return `${window.location.host}`
    },
    throwErr (errMsg) {
      this.$store.state.initFinished = false
      this.$emit('initFail', true)
      console.log('initFail')
      this.$message({
        message: errMsg,
        type: 'error'
      })
      throw new Error(errMsg)
    },
    _getUserName () {
      let curUserName = ZOSInstance.getCurAccountLocalKey()
      if (curUserName && curUserName !== this.$store.state.userName) {
        this.$store.state.userName = curUserName
        setStore('userName', curUserName)
        let acc = ChainStore.getAccount(this.$store.state.userName, true)
        if (acc) {
          setStore('userId', acc.get('id'))
          this.$store.state.userDataSid = acc.get('id')
          ChainStore.setLoginAccount(this.$store.state.userDataSid)
        }
      }
      if (!curUserName) {
        this.$store.state.userName = ''
        this.$store.state.userDataSid = ''
      }
      console.log('loginUserId :', this.$store.state.userDataSid)
    },
    _getLogo (res) {
      if (res.logo) {
        localStorage.setItem('logo', res.logo)
      } else {
        localStorage.removeItem('logo')
      }
      if (res.index) {
        localStorage.setItem('index', res.index)
      } else {
        localStorage.setItem('index', 'home')
      }
    },
    _getVersion () {
      if (getLocalStore('LendingVersion') === '1.3') {
        this.$store.state.newVersion = false
      } else {
        this.$store.state.newVersion = true
        setLocalStore('LendingVersion', '1.3')
      }
      let configTheme = getLocalStore('choosedStyleslast')
      if (isTheme(configTheme)) {
        this.$store.state.configTheme = configTheme
        toggleClass(document.body, 'theme-' + this.$store.state.configTheme)
      }
    },
    _adminNotify () {
      Apis.instance().db_api().exec('get_account_by_name', ['admin-notify']).then((account) => {
        this.$store.state.adminNotifyId = account.id
      })
    },
    _getThemeConfig () {
      let configTheme = ''
      this.$store.state.configTheme = '1a1d5c'
      Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['theme']]).then(res => {
        if (res && res.length > 0 && res[0]) {
          const resParse = JSON.parse(res[0])
          configTheme = resParse[0]
        }
        if (!isTheme(configTheme)) {
          configTheme = getLocalStore('choosedStyles')
          if (!isTheme(configTheme)) {
            configTheme = '1a1d5c'
          }
        }
        this.$store.state.configTheme = configTheme
        let configThemelast = getLocalStore('choosedStyleslast')
        if (configThemelast !== configTheme) {
          setLocalStore('choosedStyleslast', configTheme)
          toggleClass(document.body, 'theme-' + this.$store.state.configTheme)
          console.log(configTheme)
        }
        traceTimer('6')
      }).catch(err => {
        console.log(err)
        this.$message({
          message: err,
          type: 'warning'
        })
      })
    },
    _loanAssetArr () {
      return Apis.instance().admin_api().exec('get_lending_asset', [this.$store.state.admin_id, null]).then(symbolArr => {
        if (!symbolArr || symbolArr.length < 1) {
          this.$message({
            message: this.$t('m.borrow.notAsset'),
            type: 'error'
          })
          return
        }
        this.$store.state.loanAssetArr = symbolArr
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: error,
          type: 'error'
        })
      })
    }
  },
  render: h => h(App)
})

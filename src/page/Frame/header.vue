<template>
  <div class="header-box">
      <header class="w">
        <div class="w-box">
          <div class="nav-logo">
            <h1 @click="changePage(11, 0)">
              <router-link :to="logo ? '/logo' : '/home'" :title="`Zos${$t('m.website')}`">
                <img :src="`/static/images/global-logo-${_theme}.jpg`" width="100" height="35">
              </router-link>
            </h1>
          </div>
          <div style="flex:1">
            <slot name="nav">
              <div class="nav-sub" :class="{fixed:st}">
                <div class="nav-sub-bg"></div>
                <div class="nav-sub-wrapper" :class="{fixed:st}">
                  <div class="w">
                    <router-link to="/home" class="dHMsll gTHKWe">
                      <a @click="changePage(1, 0)" class="dHMsll gTHKWe" >
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-home"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.Home")}}</span>
                        </div>
                      </a>
                    </router-link>
                    <a @click="loginDia('/borrow')" class="dHMsll gTHKWe">
                      <a @click="changePage(2)" class="dHMsll gTHKWe">
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-borrow"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.mustLoan")}}</span>
                        </div>
                      </a>
                    </a>
                    <router-link to="/invest" class="dHMsll gTHKWe">
                      <a @click="changePage(3, 0)" class="dHMsll gTHKWe">
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-invest"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.toInvest")}}</span>
                        </div>
                      </a>
                    </router-link>

                    <a @click="loginDia('/balance')" class="dHMsll gTHKWe">
                      <a @click="changePage(4)" class="dHMsll gTHKWe">
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===4}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-account"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.zhang")}}</span>
                        </div>
                      </a>
                    </a>
                    <a @click="loginDia('/admin/params')" class="dHMsll gTHKWe">
                      <a @click="changePage(5)" class="dHMsll gTHKWe">
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===5}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-admin"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.admin")}}</span>
                        </div>
                      </a>
                    </a>
                    <router-link to="/setting" class="dHMsll gTHKWe">
                      <a @click="changePage(6, 0)" class="dHMsll gTHKWe">
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===6}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-setting"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.setting")}}</span>
                        </div>
                      </a>
                    </router-link>
                    <router-link to="/history" class="dHMsll gTHKWe">
                      <a @click="changePage(7, 0)" class="dHMsll gTHKWe">
                        <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===7}">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-history"></use>
                          </svg>
                          <span class="bgdPDV">{{$t("m.history")}}</span>
                        </div>
                      </a>
                    </router-link>

                  </div>
                </div>
              </div>
            </slot>
          </div>
          <div>
            <div class="right-box" id="login">
              <div class="link-a">
                <a @click="loginDia('/invite')" :class="{lineBottom:choosePage===9}" style="margin-left: 10px">{{$t('m.invites')}}</a>
              </div>
              <div class="username">
                <el-popover
                  placement="bottom"
                  width="420"
                  trigger="hover"
                  v-if="$store.state.userName"
                  class="margin-l20"
                >
                  <el-table :data="gridData">
                    <el-table-column width="140" property="symbol" :label="$t('m.orderList.bitType')"></el-table-column>
                    <el-table-column width="125" property="amount" :label="$t('m.transfer.KY')"></el-table-column>
                    <el-table-column width="125" property="lock_amount" :label="$t('m.orderList.freeze')"></el-table-column>
                  </el-table>
                  <a slot="reference" style="width: 50px">{{$store.state.userName}}</a>
                </el-popover>

              </div>
              <div v-if="!$store.state.login">
                <a @click="_login" class="margin-l20">{{$t('m.login')}}</a>
                <span class="margin-l10">|</span>
                <router-link to="/register" :class="{lineBottom:choosePage===10}" style="margin-left: 10px">{{$t('m.register.title')}}</router-link>
              </div>



              <a v-if="$store.state.login" href="javascript:;" class="margin-l20" @click="_loginOut">{{$t("m.quit")}}</a>

              <div class="shop pr">
                <el-dropdown @command="change($event)">
                  <span class="el-dropdown-link">
                    <img :src="`/static/images/q${value}.png`" width="35" height="25">
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in options" :command="item.value" :key="index">
                      <img :src="`/static/images/q${item.value}.png`" width="35" height="25" />
                      <span class="margin-l10">{{item.label}}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
          </div>


              </div>
        </div>
      </header>
    <!--登录-->
    <login-dialog :visible="$store.state.loginPath !== undefined"></login-dialog>
    <el-dialog
      :title="$t('m.notSupport')"
      :visible.sync="validateBrowser"
      width="30%"
    >
      <span>{{$t('m.note')}}</span>
      <span slot="footer" class="dialog-footer">
        <a href @click="openLink()">Google Chrome</a>
        <el-button type="primary" @click="validateBrowser = false;">{{$t('m.understand')}}</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
import '/path-assets/style/theme/95262b/index.css'
import '/path-assets/style/theme/1a1d5c/index.css'
import '/path-assets/style/theme/1a2d5c/index.css'
import {ZOSInstance} from 'zos-wallet-js'
import { removeStore, getLocalStore, setLocalStore } from '/js-utils/storage'
import { ChainTypes as GraphChainTypes, ChainStore } from 'zosjs/es'
import Notify from 'notifyjs'
import Immutable from 'immutable'
import {Apis} from 'zosjs-ws'
import loginDialog from '/path-page/Login/loginDialog'
export default{
  components: {loginDialog},
  data () {
    return {
      options: [{
        value: '1',
        label: '中文'
      }, {
        value: '2',
        label: 'English'
      }],
      value: '1',
      user: {},
      // 查询数据库的商品
      st: false,
      // 头部购物车显示
      positionL: 0,
      positionT: 0,
      input: '',
      choosePage: 11,
      searchResults: [],
      timeout: null,
      token: '',
      gridData: [],
      operations: Object.keys(GraphChainTypes.operations),
      account: new Map(),
      validateBrowser: false,
      logo: localStorage.getItem('logo')
    }
  },
  watch: {
    '$route.path': function (val, oldVal) {
      if (val !== oldVal) {
        this.getPage()
      }
    }
  },
  computed: {
    _theme () {
      return this.$store.state.configTheme
    }
  },
  methods: {
    change (v) {
      if (v === '1') {
        this.lang = 'zh-CN'
        this.value = '1'
        this.$i18n.locale = this.lang // 关键语句
      } else if (v === '2') {
        this.value = '2'
        this.lang = 'en-US'
        this.$i18n.locale = this.lang // 关键语句
      }
      setLocalStore('i18nLocaleSet', this.value)
      this.$store.state.lang = this.value
    },
    // 导航栏文字样式改变
    changePage (v, bool = 1) {
      let sLogin = !ZOSInstance.accountIsLoginout()
      this.$store.state.login = sLogin
      if (bool && !sLogin) {
        return
      }
      this.choosePage = v
    },
    querySearchAsync (queryString, cb) {
    },
    handleSelect (item) {
      this.input = item.value
    },
    // 控制顶部
    navFixed () {
      if (this.$route.path === '/invest' || this.$route.path === '/home' || this.$route.path === '/investDetails' || this.$route.path === '/borrow' || this.$route.path === '/setting') {
      } else {
        return true
      }
    },
    _login () {
      this.$store.state.loginPath = this.$router.options.nextpath
    },
    // 退出登陆
    _loginOut () {
      // 是否登出:accountIsLoginout();无参数，返回true表示已经登出
      ZOSInstance.accountLoginout()
      this.$store.state.login = false
      this.$store.state.userName = ''
      this.$store.state.userDataSid = ''
      removeStore('userName')
      removeStore('userId')
      this.changePage(1, 0)
      this.$router.push('/')
      this.$store.state.loginPath = undefined
    },

    // 通过路由改变导航文字样式
    getPage () {
      if (this.$route.path === '/home') {
        this.changePage(1)
      } else if (this.$route.path.indexOf('/invest/') === 0 ||
      this.$route.path === '/investDetails') {
        this.changePage(3)
      } else if (this.$route.path.indexOf('/borrow/') === 0) {
        this.changePage(2)
      } else if (this.$route.path === '/balance') {
        this.changePage(4)
      } else if (this.$route.path.indexOf('/admin/') === 0 || this.$route.path === '/admin/params/') {
        this.changePage(5)
      } else if (this.$route.path === '/setting' || this.$route.path === '/setting/accessSettings') {
        this.changePage(6)
      } else if (this.$route.path.indexOf('/history/') === 0) {
        this.changePage(7)
      } else if (this.$route.path === '/blockBrowser') {
        this.changePage(8)
      } else if (this.$route.path === '/invite') {
        this.changePage(9)
      } else if (this.$route.path === '/register') {
        this.changePage(10)
      } else if (this.$route.path === '/logo') {
        this.changePage(11)
      }
    },
    loginDia (path) {
      if (this.$store.state.login) {
        this.$router.push({path: path})
      } else {
        this.$store.state.loginPath = {path: path}
      }
    },
    updateList () {
      this.doNotify()
      // 通知keepalive 不要发get_objects
      Apis.instance().usersubscribe()
      if (this.$store.state.userDataSid && ChainStore.getLoginAccountBalanceChange(0)) {
        ZOSInstance.get_account_allbalances(this.$store.state.userDataSid).then(resbalas => {
          var allDate = resbalas['balances']
          this.$store.state.coupon.amount = resbalas['coupon']
          this.$store.state.coupon.amountstr = this.$store.state.coupon.amount.toFixed(5)
          this.$store.state.coupon.canReceiveCoupon = this.$store.state.coupon.canReceiveCouponTime && (this.$store.state.coupon.amount < this.$store.state.coupon.coupon_per_month)
          this.$store.state.userassets = allDate
          this.gridData.splice(0, this.gridData.length)
          for (let index = 0; index < allDate.length; index++) {
            this.gridData.push(Object.assign({}, allDate[index]))
            let element = this.gridData[index]
            element.amount = this.scientificToNumber(element.amount / Math.pow(10, element.precision))
            element.lock_amount = element.lock_amount / Math.pow(10, element.precision)
          }
          // eventInstance.$emit('updateUserAssets', allDate)
        })
      }
      this.getAccountCoupon()
    },
    // 禁用科学计数法
    scientificToNumber (num) {
      let str = num.toString()
      let reg = /^(\d+)(e)([-]?\d+)$/
      let arr = ''
      let len = ''
      let zero = ''
      // /*6e7或6e+7 都会自动转换数值*/
      if (!reg.test(str)) {
        return num
      } else {
        // /*6e-7 需要手动转换*/
        arr = reg.exec(str)
        len = Math.abs(arr[3]) - 1
        for (var i = 0; i < len; i++) {
          zero += '0'
        }
        return '0.' + zero + arr[1]
      }
    },
    // 获得用户优惠
    getAccountCoupon () {
      if (this.$store.state.userDataSid && ChainStore.getLoginAccountBalanceChange(1)) {
        ZOSInstance.get_account_coupon(this.$store.state.userDataSid)
          .then(res => {
            this.$store.state.coupon = res
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    _getOperationName (operation) {
      if (operation.getIn(['op', 0]) !== undefined) {
        return this.operations[operation.getIn(['op', 0])]
      }
      return null
    },

    _isOperationTransfer (operation) {
      return this._getOperationName(operation) === 'transfer'
    },

    _isTransferToMyAccount (operation) {
      if (!this._isOperationTransfer(operation)) {
        throw Error('Operation is not transfer')
      }
      return (
        operation.getIn(['op', 1, 'to']) === this.account.get('id')
      )
    },

    _isOperationBitlenderInvest (operation) {
      return this._getOperationName(operation) === 'bitlender_invest'
    },

    _isBitlenderInvestToMyAccount (operation) {
      if (!this._isOperationBitlenderInvest(operation)) {
        throw Error('Operation is not Bitlender Invest')
      }
      return (
        operation.getIn(['op', 1, 'loan_id']) === this.account.get('id')
      )
    },

    doNotify () {
      // this.regetUserName()
      if (this.$store.state.userName === '') return
      var newObj = ChainStore.getAccount(this.$store.state.userName, true)
      if (!newObj) {
        return
      }
      if (!newObj.get('history')) {
        return
      }
      if (!this.account.get('history')) {
        // 直接把account=newObj,会导致this.account.get('history')里找不到first()
        if (Immutable.fromJS(newObj.get('history'))) {
          this.account.set('history', Immutable.fromJS(newObj.get('history')))
        }
        return false
      }
      if (!this.account.get('id')) {
        if (Immutable.fromJS(newObj.get('id'))) {
          this.account.set('id', Immutable.fromJS(newObj.get('id')))
        }
        return false
      }
      if (!this.account.get('balances')) {
        if (Immutable.fromJS(newObj.get('balances'))) {
          this.account.set('balances', Immutable.fromJS(newObj.get('balances')))
        }
        return false
      }
      let lastOperationOld = this.account.get('history').first()
      let lastOperationNew = newObj.get('history').first()
      if (typeof (lastOperationOld) === 'undefined' || typeof (lastOperationNew) === 'undefined') {
        return false
      }
      if (lastOperationNew.get('id') === lastOperationOld.get('id')) {
        return false
      }
      // 转账通知
      if (
        this._isOperationTransfer(lastOperationNew) &&
        this._isTransferToMyAccount(lastOperationNew)
      ) {
        const assetId = lastOperationNew.getIn(['op', 1, 'amount', 'asset_id'])
        const from = lastOperationNew.getIn(['op', 1, 'from'])
        const amount = lastOperationNew.getIn(['op', 1, 'amount', 'amount'])
        console.log('assetId:', assetId)
        console.log('from:', from)
        console.log('amount:', amount)
        const title = '转账通知'
        const notifyParams = {
          body: '您有一笔资金到账了!'
        }
        const notify = new Notify(title, notifyParams)
        notify.show()
      }
      // 投资订单通知
      if (
        this._isOperationBitlenderInvest(lastOperationNew) &&
        this._isBitlenderInvestToMyAccount(lastOperationNew)
      ) {
        const assetId = lastOperationNew.getIn(['op', 1, 'amount_to_invest', 'asset_id'])
        const from = lastOperationNew.getIn(['op', 1, 'issuer'])
        const amount = lastOperationNew.getIn(['op', 1, 'amount_to_invest', 'amount'])
        console.log('assetId:', assetId)
        console.log('from:', from)
        console.log('amount:', amount)
        const title = '投资通知'
        const notifyParams = {
          body: '您收到一笔投资!'
        }
        const notify = new Notify(title, notifyParams)
        notify.show()
      }

      this.account.set('history', Immutable.fromJS(newObj.get('history')))
      this.account.set('id', Immutable.fromJS(newObj.get('id')))
      this.account.set('balances', Immutable.fromJS(newObj.get('balances')))
      // Immutable.fromJS(newObj.get('history'))
    },
    openLink () {
      let newWnd = window.open(
        'https://www.google.com/chrome/browser/desktop/',
        '_blank'
      )
      newWnd.opener = null
    },
    isShowChromeTip () {
      const userAgent = navigator.userAgent.toLowerCase()
      console.log(userAgent)
      if (!(userAgent.indexOf('firefox') > -1 ||
          userAgent.indexOf('chrome') > -1 ||
          userAgent.indexOf('edge') > -1)) {
        this.validateBrowser = false
      } else {
        this.validateBrowser = false
      }
    },
    init () {
    }
  },
  mounted () {
    if (this.$store.state.initFinished) {
      this.init()
    } else {
      this.$root.$on('initFinished', (data) => {
        this.init()
      })
    }
    this.navFixed()
    this.getPage()
    this.isShowChromeTip()
    window.addEventListener('scroll', this.navFixed)
    window.addEventListener('resize', this.navFixed)
    if (typeof (this.$route.query.key) !== 'undefined') {
      this.input = this.$route.query.key
    }
  },
  created () {
    ChainStore.subscribe(this.updateList)
    if (Notify.needsPermission) {
      Notify.requestPermission()
    }
    if (!getLocalStore('i18nLocaleSet')) {
      this.value = '1'
      this.lang = 'zh-CN'
      this.$i18n.locale = this.lang // 关键语句
    } else {
      this.value = getLocalStore('i18nLocaleSet')
    }
    this.change(this.value)
  },
  destroyed () {
    ChainStore.unsubscribe(this.updateList)
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "/path-assets/style/theme";
  @import "/path-assets/style/mixin";

  .move_in_cart {
    animation: mymove .5s ease-in-out;
  }

  @keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  @-moz-keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  @-webkit-keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  @-o-keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }
  .bbYkHy {
    height: 70px;
    color: #fff;
    background-color: #0667d0;
  }
  .djliRF {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
  }
  // .header-box {
  //   color: #fff;
  //   background-color: #1A1D5C;

  // }

  // header {
  //   color: #fff;
  //   background-color: #1A1D5C;
  //   z-index: 30;
  //   position: relative;
  //   padding: 0 15px
  // }
  // .w-box {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   flex: 1;
  //   flex-direction: row;
  //   h1 {
  //     height: 100%;
  //     display: flex;
  //     align-items: center;
  //     margin-top: 0;
  //     margin-bottom: 0;
  //     > a {
  //       background: url(/static/images/global-logo-red@2x.jpg) no-repeat 50%;
  //       background-size: cover;
  //       display: block;
  //       @include wh(100px, 35px);
  //       text-indent: -9999px;
  //       background-position: 0 0;
  //     }
  //   }
  //   .nav-aside {
  //     position: relative;
  //     &:before {
  //       background: #333;
  //       background: hsla(0, 0%, 100%, .2);
  //       content: " ";
  //       @include wh(1px, 13px);
  //       overflow: hidden;
  //       // position: absolute;
  //       display: flex;
  //       align-items: center;
  //       // top: 4px;
  //       left: 0;
  //     }
  //     &.fixed {
  //       width: 262px;
  //       position: fixed;
  //       left: 50%;
  //       top: 19px;
  //       margin-left: 370px;
  //       margin-top: 0;
  //       z-index: 32;
  //       top: -50px;
  //       -webkit-transform: translate3d(0, 59px, 0);
  //       transform: translate3d(0, 59px, 0);
  //       -webkit-transition: -webkit-transform .3s cubic-bezier(.165, .84, .44, 1);
  //       transition: transform .3s cubic-bezier(.165, .84, .44, 1);
  //       .user {
  //         &:hover {
  //           a:before {
  //             background-position: -215px 0;
  //           }
  //         }
  //       }
  //       .shop {
  //         &:hover {
  //           a:before {
  //             background-position: -210px -22px;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   .right-box {
  //     display: flex;
  //     flex:1;
  //     flex-direction: row;
  //     justify-content: space-around;
  //     align-items: center;
  //     .link-a a{
  //       color: #5E5E92
  //     }
  //     .username a{
  //       color: #fff
  //     }
  //   }

  //   // 用户
  //   .user {
  //     text-align: center;
  //     /*margin-left: 11px;*/
  //     &:hover {
  //       a:before {
  //         background-position: -5px 0;
  //       }
  //       .nav-user-wrapper {
  //         top: 18px;
  //         visibility: visible;
  //         opacity: 1;
  //         -webkit-transition: opacity .15s ease-out;
  //         transition: opacity .15s ease-out;
  //       }
  //     }
  //     > a {
  //       position: relative;
  //       @include wh(70px, 20px);
  //       display: block;
  //       color: #fff;
  //       /*text-indent: -9999px;
  //       &:before {
  //         content: " ";
  //         position: absolute;
  //         left: 8px;
  //         top: 0;
  //         @include wh(20px);
  //         background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -155px 0;
  //         background-size: 240px 107px;
  //         transition: none;
  //       }*/

  //     }
  //     li + li {
  //       text-align: center;
  //       position: relative;
  //       border-top: 1px solid #f5f5f5;
  //       line-height: 44px;
  //       height: 44px;
  //       color: #616161;
  //       font-size: 12px;
  //       &:hover {
  //         background: #fafafa;
  //       }
  //       a {
  //         display: block;
  //         color: #616161;
  //       }
  //     }
  //     .nav-user-avatar {
  //       > div {
  //         position: relative;
  //         margin: 0 auto 8px;
  //         @include wh(46px);
  //         text-align: center;
  //         &:before {
  //           content: "";
  //           position: absolute;
  //           left: 0;
  //           right: 0;
  //           top: 0;
  //           bottom: 0;
  //           border-radius: 50%;
  //           box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
  //         }
  //         .avatar {
  //           border-radius: 50%;
  //           display: block;
  //           @include wh(100%);
  //           background-repeat: no-repeat;
  //           background-size: contain;
  //         }

  //       }
  //       .name {
  //         margin-bottom: 16px;
  //         font-size: 12px;
  //         line-height: 1.5;
  //         text-align: center;
  //         color: #757575;
  //       }
  //     }
  //     .nav-user-wrapper {
  //       width: 400px;
  //       transform: translate(-50%);
  //       left: 50%;
  //     }
  //     .nav-user-list {
  //       width: 400px;
  //       &:before {
  //         left: 50%;
  //       }

  //     }
  //   }
  //   .shop {
  //     position: relative;
  //     float: left;
  //     margin-left: 20px;
  //     margin-right: 20px;
  //     width: 50px;
  //     z-index: 99;
  //     &:hover {
  //       a:before {
  //         content: " ";
  //         background-position: 0 -22px;
  //       }
  //     }
  //     .nav-user-wrapper.active {
  //       top: 18px;
  //       visibility: visible;
  //       opacity: 1;
  //       -webkit-transition: opacity .15s ease-out;
  //       transition: opacity .15s ease-out;
  //     }
  //     > a {
  //       position: absolute;
  //       left: 0;
  //       top: 0;
  //       bottom: 0;
  //       display: block;
  //       right: 0;
  //       z-index: 1;
  //       &:before {
  //         display: block;
  //         @include wh(30px, 100%);
  //         content: " ";
  //         background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) 0 -22px;
  //         background-size: 240px 107px;
  //         background-position: -150px -22px;
  //       }
  //     }
  //     .cart-num {
  //       position: relative;
  //       display: block;
  //       margin-left: 31px;
  //       margin-top: -1px;
  //       min-width: 30px;
  //       text-indent: 0;
  //       line-height: 20px;
  //       > i {
  //         background: #eb746b;
  //         background-image: -webkit-linear-gradient(#eb746b, #e25147);
  //         background-image: linear-gradient(#eb746b, #e25147);
  //         box-shadow: inset 0 0 1px hsla(0, 0%, 100%, .15), 0 1px 2px hsla(0, 0%, 100%, .15);
  //         text-align: center;
  //         font-style: normal;
  //         display: inline-block;
  //         @include wh(20px);
  //         line-height: 20px;
  //         border-radius: 10px;
  //         color: #fff;
  //         font-size: 12px;
  //         &.no {
  //           background: #969696;
  //           background-image: -webkit-linear-gradient(#A4A4A4, #909090);
  //           background-image: linear-gradient(#A4A4A4, #909090);
  //           box-shadow: inset 0 0 1px #838383, 0 1px 2px #838383;
  //         }
  //       }

  //     }
  //     .nav-user-wrapper {
  //       right: 0;
  //       width: 360px;
  //       .nav-user-list {
  //         &:before {
  //           right: 34px;
  //         }
  //       }
  //     }
  //     .nav-user-list {
  //       padding: 0;
  //       width: 100%;
  //       .full {
  //         border-radius: 8px;
  //         overflow: hidden;
  //       }
  //       .nav-cart-items {
  //         max-height: 363px;
  //         overflow-x: hidden;
  //         overflow-y: auto;
  //       }
  //       .cart-item {
  //         height: 120px;
  //         width: 100%;
  //         overflow: hidden;
  //         border-top: 1px solid #f0f0f0;
  //         &:hover {
  //           background: #fcfcfc;
  //           .del {
  //             display: block;
  //           }
  //         }

  //       }
  //       li:first-child .cart-item:first-child {
  //         border-top: none;
  //         border-radius: 8px 8px 0 0;
  //         overflow: hidden;
  //       }
  //       .cart-item-inner {
  //         padding: 20px;
  //         position: relative;
  //       }
  //       .item-thumb {
  //         position: relative;
  //         float: left;
  //         width: 80px;
  //         height: 80px;
  //         border-radius: 3px;
  //         &:before {
  //           content: "";
  //           position: absolute;
  //           left: 0;
  //           right: 0;
  //           top: 0;
  //           bottom: 0;
  //           z-index: 2;
  //           border: 1px solid #f0f0f0;
  //           border: 0 solid transparent;
  //           box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
  //           border-radius: 3px;
  //         }
  //         img {
  //           display: block;
  //           @include wh(80px, 80px);
  //           border-radius: 3px;
  //           overflow: hidden;
  //         }
  //       }
  //       .item-desc {
  //         margin-left: 98px;
  //         display: table;
  //         @include wh(205px, 80px);
  //         h4 {
  //           color: #000;
  //           width: 185px;
  //           overflow: hidden;
  //           word-break: keep-all;
  //           white-space: nowrap;
  //           text-overflow: ellipsis;
  //           font-size: 14px;
  //           line-height: 16px;
  //           margin-bottom: 10px;
  //         }
  //         .attrs span {
  //           position: relative;
  //           display: inline-block;
  //           margin-right: 20px;
  //           font-size: 14px;
  //           line-height: 14px;
  //           color: #999;
  //         }
  //         .attrs span:last-child {
  //           margin-right: 0;
  //         }
  //         h6 {
  //           color: #cacaca;
  //           font-size: 12px;
  //           line-height: 14px;
  //           margin-top: 20px;
  //           span {
  //             display: inline-block;
  //             font-weight: 700;
  //             color: #cacaca;
  //           }
  //           .price-icon, .price-num {
  //             color: #d44d44;
  //           }
  //           .price-num {
  //             margin-left: 5px;
  //             font-size: 14px;
  //           }
  //           .item-num {
  //             margin-left: 10px;
  //           }
  //         }

  //       }
  //       .cart-cell {
  //         display: table-cell;
  //         vertical-align: middle;
  //       }
  //       .del {
  //         display: none;
  //         overflow: hidden;
  //         position: absolute;
  //         right: 20px;
  //         top: 50%;
  //         transform: translateY(-50%);
  //       }
  //     }
  //     .nav-cart-total {
  //       box-sizing: content-box;
  //       position: relative;
  //       padding: 20px;
  //       height: 40px;
  //       background: #fafafa;
  //       border-top: 1px solid #f0f0f0;
  //       border-radius: 0 0 8px 8px;
  //       box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, .5), 0 -3px 8px rgba(0, 0, 0, .04);
  //       background: -webkit-linear-gradient(#fafafa, #f5f5f5);
  //       background: linear-gradient(#fafafa, #f5f5f5);
  //       p {
  //         margin-bottom: 4px;
  //         line-height: 16px;
  //         font-size: 12px;
  //         color: #c1c1c1;
  //       }
  //       h5 {
  //         line-height: 20px;
  //         font-size: 14px;
  //         color: #6f6f6f;
  //         span {
  //           font-size: 18px;
  //           color: #de4037;
  //           display: inline-block;
  //           font-weight: 700;
  //         }
  //         span:first-child {
  //           font-size: 12px;
  //           margin-right: 5px;
  //         }
  //       }
  //       h6 {
  //         position: absolute;
  //         right: 20px;
  //         top: 20px;
  //         width: 108px;
  //       }
  //     }
  //   }
  // }

  @media (max-height: 780px) {
    .nav-cart-items {
      max-height: 423px !important;
    }
  }

  @media (max-height: 900px) {
    .nav-cart-items {
      max-height: 544px !important;
    }
  }

  @media (max-height: 1080px) {
    .nav-cart-items {
      max-height: 620px !important;
    }
  }
  @media (max-width: 1100px) {
    .bgdPDV {
      display: none;
    }
    .icon{
      font-size: 20px;
      margin-right: 10px;
    }
  }
  @media (min-width: 1101px) {
    .bgdPDV {
      display: block;
    }
    .icon{
      font-size: 16px;
      margin-right: 5px;
    }
  }
  // 用户信息弹出
  .nav-user-wrapper {
    position: absolute;
    z-index: 30;
    padding-top: 18px;
    opacity: 0;
    visibility: hidden;
    top: -3000px;
    .nav-user-list {
      position: relative;
      padding-top: 20px;
      background: #fff;
      border: 1px solid #d6d6d6;
      border-color: rgba(0, 0, 0, .08);
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, .15);
      z-index: 10;
      &:before {
        position: absolute;
        content: " ";
        background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) no-repeat -49px -43px;
        background-size: 240px 107px;
        @include wh(20px, 8px);
        top: -8px;
        margin-left: -10px;
      }
    }
  }

  .nav-sub {
    position: relative;
    z-index: 20;
    height: 64px;
    &.fixed {
      position: fixed;
      z-index: 21;
      height: 60px;
      top: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid #dadada;
      background-image: -webkit-linear-gradient(#fff, #f1f1f1);
      background-image: linear-gradient(#fff, #f1f1f1);
    }
    .nav-sub-wrapper {
      height: 64px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      position: relative;
      &.fixed {
        padding: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }
      &:after {
        content: " ";
        position: absolute;
        top: 89px;
        left: 50%;
        margin-left: -610px;
        /*width: 1220px;*/
        /*background: #000;*/
        height: 1px;
        display: none;
        opacity: 0;
        transition: opacity .3s ease-in;
      }
    }
    .w {
      display: flex;
      flex-direction: row;
      /*width: 95%;*/
      justify-content: flex-start;
      flex: 1;
      margin-left: 45px;
      .gTHKWe {
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
      }

      .dHMsll:not(:first-child) {
        margin-left: 30px;
      }
      a {
        text-decoration: none;
        cursor: pointer;
        /*.rsdjt :hover {*/
          /*color: #f9c215;*/
          /*border-bottom: 1px solid #82848a;*/
        /*}*/
        .lineBottom{
          color: #fff;
          /*border-bottom: 1px solid #fff;*/
        }
        .ftDCsB {
          position: relative;
          -webkit-box-align: center;
          align-items: center;
          cursor: pointer;
          margin-right: 30px;
          color: rgb(6, 103, 208);
        }
        .ftDCsB::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0px;
          width: 100%;
          height: 1px;
          border-bottom: 1px solid rgb(6, 103, 208);
        }
        .gTHKWe {
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }
        div{
          display: block;
          .joarYq{
            width: 16px;
            height: 16px;
            fill: currentColor;
          }
          .bgdPDV{
            font-size: 16px;
            margin-left: 5px;
          }
        }

      }
    }
    .nav-list2 {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      height: 100%;
      li:first-child {
        padding-left: 0;
        a {
          padding-left: 10px;
        }
      }
      li {
        position: relative;
        float: left;
        padding-left: 2px;
        a {
          display: block;
          padding: 0 10px;
          color: #666;
          &.active {
            font-weight: bold;
          }
        }
        a:hover {
          color: #5683EA;
        }
      }
      li:before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 13px;
        width: 2px;
        height: 2px;
        background: #bdbdbd;
      }
    }
  }

  @media (min-width: 1px) {
    .nav-sub .nav-sub-wrapper:after {
      display: block;
    }
  }

  .cart-con {
    /*display: flex;*/
    text-align: center;
    position: relative;
    p {
      padding-top: 185px;
      color: #333333;
      font-size: 16px;
    }
  }

  .cart-con:before {
    position: absolute;
    content: ' ';
    left: 50%;
    transform: translate(-50%, -70%);
    top: 50%;
    width: 76px;
    height: 62px;
    background: url("/static/images/cart-empty-new.png") no-repeat;
    background-size: cover;

  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-icon-circle-check{
    font-size: 25px;
  }
  .change-styles, .el-icon-goods{
    color: #409EFF;
    font-size: 25px;
  }
</style>


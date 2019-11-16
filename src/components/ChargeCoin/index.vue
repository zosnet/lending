<template>
    <div>
      <!--充币-->
        <el-dialog
        :title="titleName"
        @close="close"
        :visible.sync="webvisible"
        :width="iframeWidth"
        append-to-body="isAppend"
        >
          <div v-loading="loading" :element-loading-text="$t('m.applyWaiting')" :style="{'height': iframeHeight + 'px'}">
                <iframe
                    id="iframe"
                    ref="iframe"
                    :src="gatewayAddress"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    vspace="0"
                    hspace="0"
                    allowtransparency="true"
                    scrolling="yes"
                    allowfullscreen="true"
                ></iframe>
          </div>
        </el-dialog>
        <!--选择网关-->
        <select-gateway :visible="selectGatewayDialog" ref="GatewayData" :assetId="assetId" @close='SelectGatewayClose' @success="SelectGatewaySucess" :isAppend="true"></select-gateway>
         <!--前往kyc-->
        <goto-kyc :kycInfo="kycInfo" :kycurl="kycurl" :authorid="authourAccount" :kycStatusCode="kycStatusCode" :hintKycDialog="hintKycDialog" :checkinfoDialog="checkinfoDialog" @close='SelectKycClose'></goto-kyc>
    </div>
</template>

<script>
import axios from 'axios'
import {ZOSInstance} from 'zos-wallet-js'
import SelectGateway from '/path-components/ChargeCoin/SelectGateway'
import formatAssets from '/js-api/public'
import {getLocalStore, setLocalStore} from '/js-utils/storage'
import {getGatewayAddress, kycStatus} from '/js-api/index'
import {Apis} from 'zosjs-ws'
import gotoKyc from '/path-components/KYC'
export default {
  components: {
    SelectGateway,
    gotoKyc
  },
  props: {
    // 显示该控件与否
    visible: {
      type: Boolean,
      'default': true
    },
    // 资产id
    assetId: {
      type: String,
      'default': ''
    },
    gatewayId: {
      type: String,
      'default': undefined
    },
    recordOrder: {
      type: Object,
      'default': undefined
    },
    defGateway: {
      type: Object,
      'default': undefined
    },
    // 类型
    dialogType: {
      type: String,
      'default': ''
    }
  },
  data () {
    return {
      gatewayConfig: '',
      loading: false,
      username: '',
      userid: '',
      titleName: '',
      gatewayAddress: '',
      iframeHeight: 100,
      iframeWidth: '50%',
      symbol: '',
      realSymbol: '',
      precision: 8,
      kycName: '',
      kycurl: '',
      gatewayUrl: '',
      authorUrl: '',
      workStep: 0,
      webvisible: false,
      hintKycDialog: false,
      checkinfoDialog: false,
      selectGatewayItem: undefined,
      updateRecord: false,
      selectAsset: '',
      selectGatewayDialog: false,
      kycInfo: {},
      selectGatewayId: '',
      selectGatewayName: '',
      authourAccount: '',
      loadTimeout: null,
      funType: ''
    }
  },
  computed: {
    available () {
      let assetsArr = formatAssets.formatAssets(this.symbol)
      if (!assetsArr || assetsArr.length === 0) {
        return 0
      } else if (assetsArr.length > 0) {
        this.zosprecision = assetsArr[0].precision
        return assetsArr[0].amount
      }
    },
    zosAmount () {
      let assetsArr = formatAssets.formatAssets('ZOS')
      if (!assetsArr || assetsArr.length === 0) {
        return 0
      } else if (assetsArr.length > 0) {
        this.zosprecision = assetsArr[0].precision
        return assetsArr[0].amount
      }
    }
  },
  watch: {
    visible (newValue) {
      if (newValue) {
        this.gatewayUrl = undefined
        this.authorUrl = undefined
        this.workStep = 0
        if (this.defGateway === undefined) this.initCharge()
        else this.doExchange(this.defGateway)
      } else {
        this.workStep = 0
        this.selectGatewayDialog = false
        this.webvisible = false
        this.hintKycDialog = false
        this.checkinfoDialog = false
        this.gatewayUrl = undefined
        this.authorUrl = undefined
      }
    }
  },
  methods: {
    // 关闭控件
    close () {
      if (this.workStep === 4) {
        window.removeEventListener('message', this.windowEventListener)
        this.workStep = 0
        this.gatewayAddress = ''
        this.gatewayUrl = ''
        this.webvisible = false
        this.hintKycDialog = false
        this.checkinfoDialog = false
        this.selectGatewayDialog = false
        this.$emit('close', this.updateRecord)
      } else if (this.workStep === 3) {
        this.workStep = 0
        this.gatewayAddress = ''
        this.gatewayUrl = ''
        this.webvisible = false
        this.hintKycDialog = false
        this.checkinfoDialog = false
        this.selectGatewayDialog = false
        this.$emit('close', false)
      }
    },
    windowEventListener (event) {
      console.log('windowEventListener', event)
      if (this.gatewayAddress.indexOf(event.origin) !== -1) {
        let data = event.data
        switch (data.type) {
          case 'autoWidth':
            setLocalStore(this.symbol + this.funType + 'chargewidth', data.value)
            this.iframeWidth = data.value.toString() + '%'
            break
          case 'settitle':
            this.titleName = data.value
            break
          case 'autoHeight':
            this.loading = false
            this.iframeHeight = data.value
            setLocalStore(this.symbol + this.funType + 'chargehigh', data.value)
            if (this.loadTimeout) {
              clearTimeout(this.loadTimeout)
              this.loadTimeout = null
            }
            console.log('5', Date.now())
            break
          case 'closeDialog':
            this.loading = false
            this.close()
            break
          case 'createOrder':
            if (data.url) {
              this.updateRecord = true
              let orderStr = getLocalStore(this.$store.state.userName + 'gatewayOrders')
              let gatewayOrders = orderStr !== null ? JSON.parse(orderStr) : []
              if (!gatewayOrders) {
                gatewayOrders = []
              }
              let gatewayOrder = null
              for (let index = 0; index < gatewayOrders.length; index++) {
                let element = gatewayOrders[index]
                if (element.url === data.url) {
                  gatewayOrder = element
                  break
                }
              }
              if (!gatewayOrder) {
                gatewayOrders.unshift({url: data.url})
                setLocalStore(this.$store.state.userName + 'gatewayOrders', gatewayOrders)
              }
            }
            break
          case 'showMessage':
            this.$message({
              message: data.value,
              type: data.messageType
            })
            break
          default:
            break
        }
      }
    },
    init () {
      this.username = this.$store.state.userName
      this.userid = this.$store.state.userDataSid
      ZOSInstance.getAboutFee(this.username, '1.3.0', 'withdraw_permission_create').then(res => {
        this.feel = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.$message({
          message: this.$t('m.httpUtils.warning'),
          type: 'error'
        })
        this.loading = false
      })
    },
    initCharge () {
      if (this.feel <= 0) {
        this.$emit('close', false)
        return
      }
      if (this.dialogType !== 'withdraw' && this.dialogType !== 'deposit') {
        this.$emit('close', false)
        return
      }
      this.$refs.GatewayData.getData(this.assetId, this.gatewayId).then(res => {
        if (res === 0) {
          this.selectGatewayDialog = true
        } else if (res === undefined) {
          this.$emit('close', false)
        } else {
          this.SelectGatewaySucess(res)
        }
      })
    },
    initGateway () {
      if (this.gatewayUrl.charAt(this.gatewayUrl.length - 1) !== '/') {
        this.gatewayUrl = this.gatewayUrl + '/'
      }
      window.addEventListener('message', this.windowEventListener)
      this.loading = true
      console.log('get_gateway_url', this.assetId, this.loading, this.funType)
      this.username = this.$store.state.userName
      this.userid = this.$store.state.userDataSid
      this.gatewayConfig = this.gatewayUrl + '/zos-gateway'
      let high = getLocalStore(this.symbol + this.funType + 'chargehigh')
      if (high !== undefined && parseInt(high) > 100) this.iframeHeight = parseInt(high)
      let width = getLocalStore(this.symbol + this.funType + 'chargewidth')
      if (width !== undefined && parseInt(width) > 10) this.iframeHeight = parseInt(width).toString() + '%'
      console.log('1', Date.now())
      getGatewayAddress(this.gatewayConfig, {
        module: 'WEB',
        gatewayId: this.selectGatewayId,
        // 此处必须是链上名，因为网关和链上名才是唯一对应
        coin_type: this.symbol
      }).then(res => {
        if (res.ret_code === '0') {
          this.$message({
            message: this.$t('m.httpUtils.warning') + ' url: ' + this.gatewayUrl + ' Error :' + res.ret_msg,
            type: 'error'
          })
          this.workStep = 4
          this.close()
          return
        }
        console.log('2', Date.now())
        let token = Number((new Date().getTime() / 30000).toFixed(0)) + 12356
        let gatewayUrl = res.data.url
        let payMode = res.data.payMode
        if (payMode === '') payMode = this.realSymbol
        gatewayUrl = ZOSInstance.ReplaceAddress(gatewayUrl)
        console.log('2', Date.now(), gatewayUrl, payMode)
        switch (this.funType) {
          case '1':
            this.titleName = this.$t('m.orderList.depositMoney')
            this.gatewayAddress = gatewayUrl + '/?funType=1&symbol=' + this.symbol + '&realSymbol=' + this.realSymbol + '&precision=' + this.precision +
            '&assetId=' + this.assetId + '&userName=' + this.username + '&userId=' + this.userid + '&feel=' + this.feel +
            '&zosAmount=' + this.zosAmount + '&couponAmount=' + this.$store.state.coupon.amount +
            '&available=' + this.available + '&precision=' + this.precision + '&kycName=' + this.kycName +
            '&gatewayUrl=' + this.gatewayConfig + '&lang=' + this.$i18n.locale + '&selectGatewayId=' + this.selectGatewayId +
            '&theme=' + this.$store.state.configTheme + '&selectGatewayName=' + this.selectGatewayName + '&payMode=' + payMode +
            '&recordOrder=' + this.recordOrder + '&token=' + token
            console.log(this.funType, 'gatewayAddress', this.gatewayAddress)
            this.webvisible = true
            this.workStep = 4
            break
          case '2':
            this.titleName = this.$t('m.rechargeDialog.deposit')
            this.gatewayAddress = gatewayUrl + '?funType=2&symbol=' + this.symbol + '&realSymbol=' + this.realSymbol + '&precision=' + this.precision +
            '&assetId=' + this.assetId + '&userName=' + this.username + '&userId=' + this.userid + '&feel=' + this.feel +
            '&zosAmount=' + this.zosAmount + '&couponAmount=' + this.$store.state.coupon.amount +
            '&available=' + this.available + '&precision=' + this.precision + '&kycName=' + this.kycName +
            '&gatewayUrl=' + this.gatewayConfig + '&lang=' + this.$i18n.locale + '&selectGatewayId=' + this.selectGatewayId +
            '&theme=' + this.$store.state.configTheme + '&selectGatewayName=' + this.selectGatewayName + '&payMode=' + payMode +
            '&recordOrder=' + this.recordOrder + '&token=' + token
            console.log(this.funType, 'gatewayAddress', this.gatewayAddress)
            this.webvisible = true
            this.workStep = 4
            break
          case '3':
            this.titleName = this.$t('m.orderList.WithdrawMoney')
            this.gatewayAddress = gatewayUrl + '?funType=3&symbol=' + this.symbol + '&realSymbol=' + this.realSymbol + '&assetId=' + this.assetId +
              '&userName=' + this.username + '&userId=' + this.userid + '&feel=' + this.feel +
              '&zosAmount=' + this.zosAmount + '&couponAmount=' + this.$store.state.coupon.amount +
              '&available=' + this.available + '&precision=' + this.precision + '&kycName=' + this.kycName +
              '&gatewayUrl=' + this.gatewayConfig + '&lang=' + this.$i18n.locale + '&selectGatewayId=' + this.selectGatewayId +
              '&theme=' + this.$store.state.configTheme + '&selectGatewayName=' + this.selectGatewayName + '&payMode=' + payMode + '&token=' + token
            console.log(this.funType, 'gatewayAddress', this.gatewayAddress)
            this.webvisible = true
            this.workStep = 4
            break
          case '4':
            this.titleName = this.$t('m.drawDialog.withdraw')
            this.gatewayAddress = gatewayUrl + '?funType=4&symbol=' + this.symbol + '&realSymbol=' + this.realSymbol + '&assetId=' + this.assetId +
              '&userName=' + this.username + '&userId=' + this.userid + '&feel=' + this.feel +
              '&zosAmount=' + this.zosAmount + '&couponAmount=' + this.$store.state.coupon.amount +
              '&available=' + this.available + '&precision=' + this.precision + '&kycName=' + this.kycName +
              '&gatewayUrl=' + this.gatewayConfig + '&lang=' + this.$i18n.locale + '&selectGatewayId=' + this.selectGatewayId +
              '&theme=' + this.$store.state.configTheme + '&selectGatewayName=' + this.selectGatewayName + '&payMode=' + payMode + '&token=' + token
            console.log(this.funType, 'gatewayAddress', this.gatewayAddress)
            this.webvisible = true
            this.workStep = 4
            break
          default:
            break
        }
        let timeout = () => {
          this.$message({
            message: this.$t('m.httpUtils.warning'),
            type: 'error'
          })
          this.workStep = 4
          this.close()
        }
        if (this.loadTimeout) {
          clearTimeout(this.loadTimeout)
        }
        this.loadTimeout = setTimeout(timeout, axios.defaults.timeout * 2)
        let iframe = this.$refs.iframe
        if (iframe) {
          if (iframe.attachEvent) {
            iframe.attachEvent('onload', function () {
              console.log('iframe onload')
              // clearTimeout(t)
            })
            iframe.attachEvent('onerror', function () {
              console.log('iframe onerror')
              clearTimeout(this.loadTimeout)
              timeout()
            })
          } else {
            iframe.onload = function () {
              console.log('iframe onload')
              // clearTimeout(t)
            }
            iframe.onerror = function () {
              console.log('iframe onerror')
              clearTimeout(this.loadTimeout)
              timeout()
            }
          }
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: this.$t('m.httpUtils.warning') + ' url: ' + this.gatewayUrl + ' Error :' + err,
          type: 'error'
        })
        this.workStep = 4
        this.close()
      })
    },
    doExchange (item) {
      this.selectGatewayItem = item
      this.selectGatewayId = item.accountId
      this.selectGatewayName = item.name
      this.selectAsset = item.assetId
      this.assetId = item.assetId
      this.gatewayUrl = item.url
      this.authorUrl = item.authourUrl
      this.symbol = item.symbol
      this.realSymbol = item.realSymbol
      this.precision = item.precision

      this.gatewayConfig = this.gatewayUrl + '/zos-gateway'
      this.gatewayConfig = ZOSInstance.ReplaceAddress(this.gatewayConfig)
      getGatewayAddress(this.gatewayConfig, {
        module: 'WEB',
        gatewayId: this.selectGatewayId,
        // 此处必须是链上名，因为网关和链上名才是唯一对应
        coin_type: this.symbol
      }).then(res => {
        if (res.ret_code === '0') {
          this.$message({
            message: this.$t('m.httpUtils.warning') + ' url: ' + this.gatewayUrl + ' Error :' + res.ret_msg,
            type: 'error'
          })
          this.workStep = 4
          this.close()
          return
        }

        window.addEventListener('message', this.windowEventListener)
        this.username = this.$store.state.userName
        this.userid = this.$store.state.userDataSid
        let high = getLocalStore(this.symbol + this.funType + 'chargehigh')
        if (high !== undefined && parseInt(high) > 100) this.iframeHeight = parseInt(high)
        let width = getLocalStore(this.symbol + this.funType + 'chargewidth')
        if (width !== undefined && parseInt(width) > 10) this.iframeHeight = parseInt(width).toString() + '%'

        let token = Number((new Date().getTime() / 30000).toFixed(0)) + 12356
        let gatewayUrl = res.data.url
        let payMode = 'exchange'
        gatewayUrl = ZOSInstance.ReplaceAddress(gatewayUrl)

        this.titleName = this.$t('m.orderList.exchange')
        this.gatewayAddress = gatewayUrl + '/?funType=1&symbol=' + this.symbol + '&realSymbol=' + this.realSymbol + '&precision=' + this.precision +
          '&assetId=' + this.assetId + '&userName=' + this.username + '&userId=' + this.userid + '&feel=' + this.feel +
          '&zosAmount=' + this.zosAmount + '&couponAmount=' + this.$store.state.coupon.amount +
          '&available=' + this.available + '&precision=' + this.precision + '&kycName=' + this.kycName +
          '&gatewayUrl=' + this.gatewayConfig + '&lang=' + this.$i18n.locale + '&selectGatewayId=' + this.selectGatewayId +
          '&theme=' + this.$store.state.configTheme + '&selectGatewayName=' + this.selectGatewayName + '&payMode=' + payMode +
          '&recordOrder=' + this.recordOrder + '&token=' + token
        console.log(this.funType, 'gatewayAddress', this.gatewayAddress)
        this.webvisible = true
        this.workStep = 4
      })
    },
    SelectGatewaySucess (item) {
      this.selectGatewayItem = item
      this.selectGatewayId = item.accountId
      this.selectGatewayName = item.name
      this.selectAsset = item.assetId
      this.gatewayUrl = item.url
      this.authorUrl = item.authourUrl
      this.symbol = item.symbol
      this.realSymbol = item.realSymbol
      this.precision = item.precision
      this.selectGatewayDialog = false

      if (item.enable !== true) {
        this.$message({
          message: this.$t('m.params.gateway') + ' name: ' + item.name + this.$t('m.params.stop'),
          type: 'error'
        })
        this.SelectGatewayClose()
        return
      }
      this.workStep = 1
      this.titleName = ''
      if (this.dialogType === 'withdraw') {
        if (item.assetProperty & 0x00000040) this.withdrawBit_()
        else this.withdrawCash_()
      } else if (this.dialogType === 'deposit') {
        if (item.assetProperty & 0x00000040) this.depositBit_()
        else this.depositCash_()
      } else {
        console.log('Error Charge Type')
        this.workStep = 0
      }
    },
    SelectGatewayClose () {
      this.webvisible = false
      this.hintKycDialog = false
      this.checkinfoDialog = false
      this.selectGatewayDialog = false
      if (this.workStep === 0) {
        this.$emit('close', false)
      }
    },
    SelectKycClose (updateRecode) {
      this.webvisible = false
      this.hintKycDialog = false
      this.checkinfoDialog = false
      this.selectGatewayDialog = false
      this.workStep = 0
      this.$emit('close', false, updateRecode)
      console.log('onKycClose', updateRecode)
    },
    withdrawBit_ () {
      // this.webvisible = true
      this.funType = '3'
      this.withdraw()
    },
    withdrawCash_ () {
      this.funType = '4'
      this.withdraw()
    },
    depositBit_ () {
      this.funType = '1'
      // this.webvisible = true
      // this.initGateway()
      this.deposit()
    },
    depositCash_ () {
      this.funType = '2'
      this.deposit()
    },
    withdraw () {
      Apis.instance().db_api().exec('is_authenticator', [this.userid, 0, this.selectGatewayItem.assetId, this.selectGatewayItem.accountId]).then(status => {
        console.log('is_authenticator status ==============', status)
        // 根本不需要KYC
        if (status === 2000) {
          this.kycName = ''
          this.webvisible = true
          this.initGateway()
        } else if (status === -5) {
          this.$message({
            message: this.$t('m.kyc.statues5') + ' name: ' + this.selectGatewayItem.authourName + ' asset: ' + this.selectGatewayItem.symbol,
            type: 'error'
          })
          this.workStep = 0
          this.$emit('close', false)
        } else {
          this.kycurl = this.selectGatewayItem.authourUrl
          if (this.selectGatewayItem.authourUrl === '' || this.selectGatewayItem.authourUrl === undefined) {
            this.$message({
              message: this.$t('m.params.noAuthor') + ' name: ' + this.selectGatewayItem.authourName + ' url: ' + this.selectGatewayItem.authourUrl,
              type: 'error'
            })
            this.workStep = 0
            this.$emit('close', false)
            return
          }
          console.log('3', Date.now())
          kycStatus(this.kycurl + '/zos-kyc/', {chainid: this.userid, authorid: this.selectGatewayItem.authourAccount}).then(res => {
            console.log('kycStatus', res, this.userid, this.selectGatewayItem.authourAccount)
            console.log('4', Date.now())
            // 直接充值
            if (status > 0) {
              this.kycName = res.name
              this.webvisible = true
              this.initGateway()
            } else {
              if (res.ret_code === '0' || res.ret_code === '1') {
                this.kycStatusCode = res.ret_code
                this.kycInfo = {}
                this.kycInfo.name = res.name
                this.kycInfo.ictype = res.ictype
                this.kycInfo.icno = res.icno
                this.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
                this.kycInfo.remark = res.remark
                this.workStep = 3
                this.kycName = res.name
                this.checkinfoDialog = true
              } else {
                this.workStep = 3
                this.authourAccount = this.selectGatewayItem.authourAccount
                this.hintKycDialog = true
              }
            }
          }).catch(err => {
            console.log(err)
            this.$message({
              message: this.$t('m.httpUtils.warning') + '  url: ' + this.selectGatewayItem.authourUrl + ' error: ' + err,
              type: 'error'
            })
            this.workStep = 0
            this.$emit('close', false)
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: this.$t('m.httpUtils.warning') + err,
          type: 'error'
        })
        this.workStep = 0
        this.$emit('close', false)
      })
    },
    deposit () {
      Apis.instance().db_api().exec('is_authenticator', [this.userid, 1, this.selectGatewayItem.assetId, this.selectGatewayItem.accountId]).then(status => {
        console.log('is_authenticator status', status, this.userid, 1, this.selectGatewayItem.assetId, this.selectGatewayItem.accountId)
        // 根本不需要KYC
        if (status === 2000) {
          this.kycName = ''
          this.webvisible = true
          this.initGateway()
        } else if (status === -5) {
          this.$message({
            message: this.$t('m.kyc.statues5') + ' name: ' + this.selectGatewayItem.authourName + ' asset: ' + this.selectGatewayItem.symbol,
            type: 'error'
          })
          this.workStep = 0
          this.$emit('close', false)
        } else {
          this.kycurl = this.selectGatewayItem.authourUrl
          if (this.selectGatewayItem.authourUrl === '' || this.selectGatewayItem.authourUrl === undefined) {
            this.$message({
              message: this.$t('m.params.noAuthor') + ' name: ' + this.selectGatewayItem.authourName + ' url: ' + this.selectGatewayItem.authourUrl,
              type: 'error'
            })
            this.workStep = 0
            this.$emit('close', false)
            return
          }
          console.log('3', Date.now())
          kycStatus(this.kycurl + '/zos-kyc/', {chainid: this.userid, authorid: this.selectGatewayItem.authourAccount}).then(res => {
            console.log('4', Date.now())
            console.log('kycStatus', res)
            this.kycStatusCode = res.ret_code
            if (status > 0) {
              this.kycName = res.name
              this.webvisible = true
              this.initGateway()
            } else {
              if (res.ret_code === '0' || res.ret_code === '1') {
                this.kycStatusCode = res.ret_code
                this.kycInfo = {}
                this.kycInfo.name = res.name
                this.kycInfo.ictype = res.ictype
                this.kycInfo.icno = res.icno
                this.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
                this.kycInfo.remark = res.remark
                this.workStep = 3
                this.checkinfoDialog = true
              } else {
                this.workStep = 3
                this.authourAccount = this.selectGatewayItem.authourAccount
                this.hintKycDialog = true
              }
            }
          }).catch(err => {
            console.log(err)
            this.$message({
              message: this.$t('m.httpUtils.warning') + '  url: ' + this.selectGatewayItem.authourUrl + ' error: ' + err,
              type: 'error'
            })
            this.workStep = 0
            this.$emit('close', false)
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: this.$t('m.httpUtils.warning') + err,
          type: 'error'
        })
        this.workStep = 0
        this.$emit('close', false)
      })
    }
  },
  mounted () {
    this.loading = true
    if (this.$store.state.initFinished) {
      this.init()
    } else {
      this.$root.$on('initFinished', (data) => {
        this.init()
      })
    }
  }
}
</script>
<style scoped lang="scss">
</style>

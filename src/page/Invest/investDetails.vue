<!--商品详情-->
<template>
  <div class="w store-content">
    <div v-loading="loadingmain>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="loadingmain<=0">
    <div class="gray-box">
      <div style="padding: 10px;">
        <h2>{{$t('m.investDetails.touBXXQR')}}</h2>
        <p style="color: red">{{$t('m.investDetails.WXTS')}}</p>
        <p style="color: red">{{$t('m.investDetails.WXTSNEXT')}}</p>
      </div>
      <!--借款信息-->
      <h2>{{$t('m.borrowsuccess.information')}}</h2>
      <div style="border-top: 1px solid #888888">
        <div style="padding: 10px;">
         <div style="display: flex;padding: 10px;">
           <p style="flex: 1">{{$t('m.investDetails.JKYH')}}: <router-link :to="{path: '/history/borrowHis?accName=' + borrowData.issuer_info.name + '&accID=' + borrowData.issuer_info.id}">{{borrowData.issuer_info.name}}</router-link></p>
         </div>
         <div style="display: flex;padding: 10px;" v-if="authorinfo.length > 0">
           <p style="flex: 1">{{$t('m.investDetails.KYC')}}: {{authorinfo}}</p>
         </div>
          <div style="display: flex;padding: 10px;">
            <p style="flex: 1">{{$t('m.borrow.loanAmount')}}: {{borrowData.amount_to_loan.amount / Math.pow(10, borrowData.asset_to_loan.precision) | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision) }}</p>
          </div>
          <div style="display: flex;padding: 10px;">
            <p style="flex: 1">{{$t('m.borrow.borrowRate')}}: {{borrowData.interest_rate | converPercentage() }}/{{$t('m.invest.perioduint' + borrowData.repayment_type.repayment_period_uint)}}</p>
          </div>
          <div style="display: flex;padding: 10px;">
            <p style="flex: 1">{{$t('m.borrow.borrowCycle')}}: {{borrowData.loan_period}}{{$t('m.invest.perioduint' + borrowData.repayment_type.repayment_period_uint)}}/{{$t('m.invest.repayment' + borrowData.repayment_type.repayment_type)}}</p>
          </div>
        </div>
      </div>
      <!--抵押信息-->
      <h2>{{$t('m.investingdetail.DYXX')}}</h2>
      <div style="border-top: 1px solid #888888;" class="toubiaodiya">
        <div style="display: flex;">
          <p style="flex: 1">{{$t('m.investDetails.diyawu')}}: {{borrowData.amount_to_collateralize.amount / Math.pow(10, borrowData.asset_to_collateralize.precision) | formatDigitalCurrency(borrowData.asset_to_collateralize.symbol)}}</p>
          <p>{{borrowData.asset_to_loan.symbol}}/{{borrowData.asset_to_collateralize.symbol}}{{$t('m.investDetails.proportion')}}: {{current_price}}</p>
        </div>
        <div>
          <p style="flex: 1">{{$t('m.investDetails.diyaBILI')}}: {{borrowData.collateral_rate/1000}}</p>
        </div>
        <div>
          <p style="flex: 1">{{$t('m.investDetails.DYWDQJZ')}}: {{collateralizeFeed(borrowData) | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision)}}</p>
        </div>
      </div>
      <!--投资信息-->
      <h2>{{$t('m.invest.info')}}</h2>
      <div style="border-top: 1px solid #888888;">
        <div style="padding: 30px 10px 0">
          <div style="padding: 10px;">
            <div style="display: flex;width: 40%" ><p style="flex:  0 1 80px">{{$t('m.investDetails.DQJD')}}: </p><p style="flex: 1"> <el-progress :percentage="borrowData.invest_process * 100" class="progressdiv"></el-progress></p></div>
          </div>
          <div style="display: flex;padding: 10px;">
            <p style="flex: 1">{{$t('m.investDetails.SYKTJE')}}: {{(borrowData.amount_to_loan.amount - borrowData.invest_process_amount) / Math.pow(10, borrowData.asset_to_loan.precision) | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision)}}</p>
          </div>
          <div style="display: flex;padding: 10px 10px 0;">
            <p style="flex: 1">{{$t('m.investDetails.sYTBSJ')}}: {{borrowData.expiration_time | dateDiffDay($store.state.curDate)}}</p>
            <!--到期未满标,全额退还-->
            <p>{{$t('m.invest.toRefund')}}</p>
          </div>
        </div>
      <div class="tijiaoxinxi">
        <div>
          <div style="flex: 1">
            <div style="flex: 0 0 160px;">{{$t('m.investDetails.TBJE')}}</div>
            <div style="width: 250px"><el-input onmousewheel="return false;" v-model="borrowNum" :placeholder="$t('m.investDetails.TBJEPlacholder')" @keyup.native="checkAmount()"></el-input></div>
          </div>
          <div style="display: flex;flex-direction: column;margin-top: -23px;">
            <!--去充值-->
            <div>{{$t('m.investDetails.KYYE')}} {{loanBalance | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision) }}<span> <el-button type="text" @click="openRechargeDialog()" class="margin-l10">{{$t('m.invest.topUp')}} </el-button></span></div>
            <div>{{$t('m.investDetails.minTZJE')}} {{minInvest | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision)}}, {{$t('m.borrow.increasing')}} {{addInvest| formatLegalCurrency('', borrowData.asset_to_loan.precision)}} </div>
          </div>
        </div>
        <el-alert
          v-if="inputError"
          :title="inputErrorInfo"
          :closable="false"
          type="error"
          show-icon>
        </el-alert>
        <div>
          <div style="flex: 1;font-size: 12px;color: red">{{$t('m.investDetails.YJSY')}}: {{expected | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision) }}</div>
          <p>
            <!--了解收益与风险-->
            <!-- <el-button type="text">{{$t('m.invest.benefits')}}</el-button> -->
          </p>
        </div>
        <!-- <div>
          <div>{{$t('m.investDetails.HTMB')}}:<el-button @click="displayContract = true" type="text" class="margin-l10"><p>{{$t('m.investDetails.JKHT')}} </p></el-button></div>
        </div> -->
        <!--燃料费-->
        <!--(约)-->
        <span>{{$t('m.fuelCost')}}: {{$t('m.transfer.about')}} {{feelAmount | formatLegalCurrency(feeSymbol, feePrecision)}}</span>
        <!--可用数量-->
        <span class="margin-l20">{{$t('m.orderList.useNum')}}: {{feeBalance | formatLegalCurrency(feeSymbol, feePrecision)}}    <el-button @click="zosDialog = true" type="text">{{$t('m.transfer.get')}} ZOS</el-button></span>
        <div>
          <!--系统将优先使用优惠券抵扣-->
          <span class="gray">{{$t('m.transfer.useCoupons')}}</span>
          <!--优惠券数量-->
          <span class="margin-l20">{{$t('m.transfer.couponsNum')}} {{$store.state.coupon.amountstr}} ZOS
            <!--关于优惠券-->
            <el-button @click="couponVisible = true" type="text">{{$t('m.transfer.abountCoupons')}}</el-button>
        </span>
        </div>
      </div>
      </div>
      <!--关于优惠-->
      <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>
      <div class="tijiaoxinxi1">
        <div>
          <el-checkbox v-model="checked"></el-checkbox>
          <div style="margin-left: 10px">{{$t('m.investDetails.checkQR')}}</div>
        </div>
      </div>

      <div style="padding: 20px">
        <el-button v-if="curInvestCarrier!=undefine" type="primary" @click="invest()" :disabled="!checked">{{$t('m.investDetails.buttoQR')}}</el-button>
      </div>
    </div>
    <div>
    </div>
    <y-popup :open="popupOpen" @close='popupOpen=false' :title="popupTitle">
    <div slot="content" class="md">
      <div style="margin-bottom: 20px">
        <!--投标成功-->
        {{$t('m.toubiaosuccess')}}
      </div>
      <!-- <y-button text='确定'
                class="btn"
                :classStyle="'main-btn'"
                @btnClick="save()">
      </y-button> -->
      <el-button type="primary" @click="save()">{{$t('m.sure')}}</el-button>
    </div>
  </y-popup>
  <el-dialog
    :title="$t('m.inputPassword')"
    :visible.sync="accountDialog"
    width="30%"
    :before-close="handleClose">
    <!--正在验证-->
    <div v-loading="loadings" :element-loading-text="$t('m.transfer.being')" style="min-height: 4vw;">
      <!--为了确保资金安全，请输入密码-->
      <span>{{$t('m.investDetails.inputPass')}}</span>
      <el-input type="password" v-model="password" ></el-input>
      <div style="font-size: 12px;color: red" v-show="Passwordvalid">{{message}}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="accountDialog=false; password=''">{{$t('m.cancel')}}</el-button>
      <el-button type="primary" @click="accountSubmit">{{$t('m.sure')}}</el-button>
    </span>
  </el-dialog>
        <!--投资申请确认-->
  <el-dialog
    :title="$t('m.investDetails.investConfirm')"
    :visible.sync="conformDialog"
    width="30%"
    :before-close="handleClose">
    <div v-loading="loading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw;padding-left: 30px">
      <span>
        <div>
          <!--投资金额-->
          <p>{{$t('m.investList.investSum')}}: {{borrowNum | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision)}}</p>
          <!--投资期限-->
          <p>{{$t('m.investList.investLimitTime')}}: {{borrowData.loan_period}}{{$t('m.invest.perioduint' + borrowData.repayment_type.repayment_period_uint)}}</p>
          <!--投资利率-->
          <p>{{$t('m.investList.investRate')}}: {{borrowData.interest_rate | converPercentage() }}/{{$t('m.invest.perioduint' + borrowData.repayment_type.repayment_period_uint)}}</p>
          <!--预计收益-->
          <p>{{$t('m.investDetails.YJSY')}}: {{expected | formatLegalCurrency(borrowData.asset_to_loan.symbol, borrowData.asset_to_loan.precision)}}</p>
          <p>{{$t('m.fuelCost')}}: {{feelFeeAmount}} ZOS</p>
        </div>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="conformDialog=fasle">{{$t('m.cancel')}}</el-button>
      <el-button type="primary" @click="transferConfrom('ruleForm')">{{$t('m.sure')}}</el-button>
    </span>
  </el-dialog>
    <!--获得ZOS-->
  <getzosdialog @isVisible="isVisible" :visible="zosDialog"></getzosDialog>
  <!--前往kyc-->
  <goto-kyc :kycInfo="kycInfo" :kycurl="kycurl" :authorid="curInvestCarrier.investauthor_account" :kycStatusCode="kycStatusCode" :hintKycDialog="hintKycDialog" :checkinfoDialog="checkinfoDialog" @close="kycclose"></goto-kyc>
  <!--合同-->
  <el-dialog
    :title="$t('m.investDetails.contract')"
    :visible.sync="displayContract"
    width="30%"
    :before-close="handleClose">
    <!--合同详情-->
    <span>{{$t('m.investDetails.contractDetail')}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="displayContract = false">{{$t('m.sure')}}</el-button>
    </span>
  </el-dialog>
  <recharge-coin :assetId="borrowData.asset_to_loan.id" dialogType="deposit" @close='onRechargeClose' :visible="rechargeDialog"></recharge-coin>
  </div>
    </div>
  </div>
</template>

<script>
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import RechargeCoin from '/path-components/ChargeCoin'
  import gotoKyc from '/path-components/KYC'
  import YPopup from '/path-components/element/popup'
  import {kycStatus} from '/js-api/index'
  import {ChainStore} from 'zosjs/es'
  import {Apis} from 'zosjs-ws'
  export default {
    components: {
      getzosdialog,
      YPopup,
      RechargeCoin,
      couponDialog,
      gotoKyc
    },
    data () {
      return {
        gatewayConfig: {},
        borrowData: [],
        current_price: '',
        userName: '',
        userId: '',
        orderId: '',
        borrowNum: '',
        displayContract: false,
        checked: false,
        popupOpen: false,
        popupTitle: this.$t('m.borrow.note'),
        feelAmount: '',
        feePrecision: 2,
        feeBalance: '',
        feeSymbol: 'ZOS',
        canInvest: '',
        loanBalance: 0,
        minInvest: 0,
        addInvest: 0,
        password: '',
        accountDialog: false,
        conformDialog: false,
        rechargeDialog: false,
        Passwordvalid: false,
        zosDialog: false,
        author: [],
        authorinfo: '',
        tr: {},
        inputError: false,
        loading: true,
        loadingmain: 1,
        inputErrorInfo: '',
        kycStatusCode: false,
        kycInfo: {},
        // 查看优惠券
        couponVisible: false,
        hintKycDialog: false,
        checkinfoDialog: false,
        curInvestCarrier: {investauthor_account: '1.2.0'},
        kycurl: ''
      }
    },
    computed: {
      expected () {
        var n = Number(this.borrowNum)
        if (n > 0) {
          return n * (this.borrowData.interest_rate / 10000) * (this.borrowData.loan_period)
        } else {
          return 0
        }
      }
    },
    methods: {
      collateralizeFeed (row) {
        return LendInstance.collateralizeFeed(row)
      },
      save () {
        this.popupOpen = false
      },
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      invest () {
        if (this.canInvest !== '') {
          this.$message({
            message: this.canInvest,
            type: 'error'
          })
          return
        }
        if (this.$store.state.login) {
          if (this.checkAmount()) {
            this.inputError = false
            this.Passwordvalid = false
            this.password = ''
            this._isAuthenticator()
          }
        } else {
          this.$router.push({path: '/login'})
        }
      },
      checkAmount () {
        if (this.borrowNum === '') {
          this.inputError = true
          // '请输入投标金额'
          this.inputErrorInfo = this.$t('m.invest.inputInvest')
          return false
        }
        let value = Number(this.borrowNum)
        var regu = '^([0-9])[0-9]*(\\.\\w*)?$'
        var re = new RegExp(regu)
        if (!re.test(value || value <= 0 || value % 1 !== 0)) {
          this.inputError = true
          // '投标金额格式错误'
          this.inputErrorInfo = this.$t('m.invest.investFormat')
          return false
        }
        if (this.borrowNum.slice(0, 1) === '0') {
          this.inputError = true
          // '投标金额格式错误'
          this.inputErrorInfo = this.$t('m.invest.investFormat')
          return false
        }
        if (value > this.loanBalance) {
          this.inputError = true
          // '投标金额不足，请充值'
          this.inputErrorInfo = this.$t('m.invest.investNull')
          return false
        }
        if (value > (this.borrowData.amount_to_loan.amount - this.borrowData.invest_process_amount) / Math.pow(10, this.borrowData.asset_to_loan.precision)) {
          this.inputError = true
          // '投标金额不能大于剩余可投金额'
          this.inputErrorInfo = this.$t('m.invest.investGreater')
          return false
        }
        if ((this.borrowData.repayment_type.loan_mode & 0x02) && value * Math.pow(10, this.borrowData.asset_to_loan.precision) < this.borrowData.amount_to_loan.amount) {
          this.inputError = true
          // '必须一次性满标'
          this.inputErrorInfo = this.$t('m.invest.investOne')
          return false
        }
        if (value < this.minInvest) {
          this.inputError = true
          // '投标金额不能少于最小投标金额'
          this.inputErrorInfo = this.$t('m.invest.investLess')
          return false
        }
        if (value % this.addInvest !== 0) {
          this.inputError = true
          // '投标金额不满足递增条件'
          this.inputErrorInfo = this.$t('m.invest.investIncrease')
          return false
        }
        if (this.borrowData.issuer_info.name === this.$store.state.userName) {
          this.inputError = true
          // '不可以投资自己的借款订单'
          this.inputErrorInfo = this.$t('m.invest.notInvest')
          return false
        }
        if (this.feelAmount > this.$store.state.coupon.amountstr + this.feeBalance) {
          this.inputError = true
          // 'ZOS不足'
          this.inputErrorInfo = this.$t('m.transfer.nullNum')
        }
        this.inputError = false
        return true
      },
      accountSubmit () {
        this.Passwordvalid = false
        if (this.password === '') {
          this.Passwordvalid = true
          // '密码不能为空'
          this.message = this.$t('m.invest.noPassword')
          return false
        } else {
          let ifTrue = ZOSInstance.accountLogin(this.$store.state.userName, this.password)
          if (ifTrue) {
            this.loading = true
            this.Passwordvalid = false
            ZOSInstance.bitlender_invest(this.$store.state.userDataSid, this.borrowData.issuer_info.id, this.curInvestCarrier.investaccount, this.borrowData.id, this.borrowNum, this.borrowData.asset_to_loan.id, this.borrowData.asset_to_loan.precision).then(res => {
              this.loading = false
              this.accountDialog = false
              this.conformDialog = true
              this.tr = res.tr
              this.feelFeeAmount = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
            }).catch(err => {
              console.log(err)
              this.loading = false
              this.$message({
                message: err,
                type: 'error'
              })
            })
          } else {
            // '输入密码错误'
            this.message = this.$t('m.invest.passwordErr')
            this.loadings = false
            this.Passwordvalid = true
          }
        }
      },
      transferConfrom (formName) {
        this.loading = true
        ZOSInstance.broadcastTransaction(this.tr).then(res => {
          this.loading = false
          this.conformDialog = false
          this.accountDialog = false
          this.$notify({
            // 投资成功
            title: this.$t('m.invest.investSucc'),
            message: this.$t('m.invest.success')
          })
          let surplusAmount = (this.borrowData.amount_to_loan.amount - this.borrowData.invest_process_amount) / Math.pow(10, this.borrowData.asset_to_loan.precision)
          if (Number(this.borrowNum) >= surplusAmount) {
            this.$router.push('/invest/investsuccessList')
          } else {
            this.$router.push('/invest/investingList')
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.conformDialog = false
          this.accountDialog = false
          this.conformfail = true
          this.$notify({
            // 投资失败
            title: this.$t('m.invest.investFail'),
            message: err
          })
        })
      },
      kycclose () {
        this.hintKycDialog = false
        this.checkinfoDialog = false
      },
      _isAuthenticator () {
        Apis.instance().db_api().exec('is_authenticator', [this.$store.state.userDataSid, 3, this.borrowData.asset_to_loan.id, this.curInvestCarrier.investaccount]).then(status => {
          if (status === 2000) {
            this.kycInfo = {}
            this.kycInfo.name = undefined
            this.accountDialog = true
          } else if (status === -5) {
            this.$message({
              message: this.$t('m.kyc.statues5') + ' name: ' + this.curInvestCarrier.investauthor_name + ' asset: ' + this.borrowData.asset_to_loan.symbol,
              type: 'error'
            })
            this.comfirmPassword = false
          } else {
            if (this.curInvestCarrier.investauthor_url === '' || this.curInvestCarrier.investauthor_url === undefined) {
              this.$message({
                message: this.$t('m.params.noAuthor') + ' url: ' + this.curInvestCarrier.investauthor_url,
                type: 'error'
              })
            } else {
              this.kycurl = this.curInvestCarrier.investauthor_url
              kycStatus(this.kycurl + '/zos-kyc/', {chainid: this.$store.state.userDataSid, authorid: this.curInvestCarrier.investauthor_account}).then(res => {
                this.kycStatusCode = res.ret_code
                if (status > 0) {
                  this.kycInfo = {}
                  this.kycInfo.name = res.name
                  this.accountDialog = true
                } else {
                  this.comfirmPassword = false
                  if (res.ret_code === '0' || res.ret_code === '1') {
                    this.kycInfo = {}
                    this.kycInfo.name = res.name
                    this.kycInfo.ictype = res.ictype
                    this.kycInfo.icno = res.icno
                    this.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
                    this.checkinfoDialog = true
                  } else {
                    this.hintKycDialog = true
                  }
                }
              }).catch(err => {
                console.log(err)
                this.$message({
                  message: this.$t('m.httpUtils.warning') + '  url: ' + this.curInvestCarrier.investauthor_url + ' error: ' + err,
                  type: 'error'
                })
              })
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.loading = true
        this.loadingmain = 1
        ChainStore.setLoginAccount(this.$store.state.userDataSid)
        this.orderId = this.$route.query.id
        ZOSInstance.get_loan_object(this.orderId).then(res => {
          this.borrowData = res
          this.current_price = LendInstance.calcFeedPriceView(res.current_feed.settlement_price, res.asset_to_loan.id, res.asset_to_loan.precision, res.asset_to_collateralize.id, res.asset_to_collateralize.precision)
          this.getAboutFee()
          this.getBitlender()
          this.getCarrier()
          this.getAuthor()
          this.loading = false
          this.loadingmain--
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.loadingmain--
          this.$message.error({
            message: err
          })
        })
      },
      getAboutFee () {
        this.loadingmain++
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'bitlender_invest')
          .then((res) => {
            this.feelAmount = res.feeAmount.amount / Math.pow(10, res.precision)
            this.feePrecision = res.precision
            this.feeBalance = res.fee_balance / Math.pow(10, res.precision)
            this.feeSymbol = res.symbol
            this.loadingmain--
          })
          .catch((error) => {
            this.loadingmain--
            console.log(error)
          })
        this.loadingmain++
        ZOSInstance.get_account_balance(this.$store.state.userName, this.borrowData.asset_to_loan.id).then((res) => {
          this.loanBalance = res / Math.pow(10, this.borrowData.asset_to_loan.precision)
          this.loadingmain--
        }).catch((error) => {
          this.loadingmain--
          console.log(error)
        })
      },
      getAuthor () {
        this.loadingmain++
        return Apis.instance().db_api().exec('get_account_author', [this.borrowData.issuer_info.id]).then(author => {
          this.author = author
          this.authorinfo = ''
          this.author.forEach(item => {
            this.authorinfo += item.name + '   '
          })
          this.loadingmain--
        }).catch((error) => {
          this.loadingmain--
          console.log(error)
        })
      },
      getCarrier () {
        this.loadingmain++
        let type = ZOSInstance.getOptionKeyToValue(this.borrowData.repayment_type)
        return ZOSInstance.get_carrier(this.$store.state.admin_id, this.borrowData.asset_to_loan.id, type).then((account) => {
          if (!account) {
            this.$message({
              message: 'Please set carrier',
              type: 'error'
            })
            this.canInvest = 'Please set carrier'
            this.loadingmain--
            return
          }
          this.curInvestCarrier = account
          if (!account.investenable) {
            this.canInvest = 'invest carrier stop'
          }
          if (!account.investvalidate) {
            this.canInvest = 'invest carrier not validate in bitlender option'
          }
          this.loadingmain--
        }).catch((error) => {
          this.loadingmain--
          console.log(error)
        })
      },
      getBitlender () {
        this.loadingmain++
        let type = ZOSInstance.getOptionKeyToValue(this.borrowData.repayment_type)
        ZOSInstance.getBitlenderOption(this.borrowData.amount_to_loan.asset_id, type)
          .then((res) => {
            this.minInvest = res.options.min_invest_amount / Math.pow(10, this.borrowData.asset_to_loan.precision)
            this.addInvest = res.options.min_invest_increase_range / Math.pow(10, this.borrowData.asset_to_loan.precision)
            this.loadingmain--
          })
          .catch((error) => {
            this.loadingmain--
            console.log(error)
          })
      },
      onRechargeClose () {
        this.rechargeDialog = false
      },
      couponClose () {
        this.couponVisible = false
      },
      openRechargeDialog () {
        this.rechargeDialog = true
      }
    },
    mounted () {
      this.loadingmain = true
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
<style lang="scss">
  @import "/path-assets/style/mixin";
  .toubiaodiya{
    padding: 20px;
    div{
      line-height: 50px;
      height: 50px;
    }
  }
  .el-button--text p{
    margin-bottom: 0!important;
  }
  .tijiaoxinxi{
    padding: 20px 20px 0;
    div{
      display: flex;
      line-height: 50px;
      height: 50px;
      align-items: center;
    }
  }
  .tijiaoxinxi1{
    padding: 0 20px;
    div{
      display: flex;
      line-height: 50px;
      height: 50px;
      align-items: center;
    }
  }
  .store-content {
    clear: both;
    max-width: 1152px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 10px auto;
  }
  .contentCs{
    div{
      display: flex;
      margin-bottom: 20px;
      margin-left: 5%;
      p{
        color: #97a8be;
      }
    }
  }
  .gray-box {
    /*display: flex;*/
    padding: 10px;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>

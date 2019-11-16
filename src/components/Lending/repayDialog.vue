<template>
  <div v-if="visible">
  <el-dialog
    :title="$t('m.borrow.repaymentSure')"
    :visible.sync="visible"
    width="45%"
    @close="closeEvent"
  >
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
      <dl class="demo-ruleForm">
        <!--还款金额-->
        <dt>1.{{$t('m.borrowsuccess.repayment_sum')}}</dt>
        <dd>
          <span  v-if="onceRepayOption === 1">
              <!--应还金额-->
              {{$t('m.borrowsuccess.should')}}
              :
             {{dataDialog.amount | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}
           </span>
        </dd>

        <dd v-if="dataDialog.interestState === 3 && onceRepayOption === 1">
          <dl>
            <!--逾期罚息-->
            <dd>{{$t('m.borrowsuccess.payment')}}: {{dataDialog.withoutRemaining | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
          </dl>
        </dd>


         <!--提前还款-->
        <dd v-if="dataDialog.principalState === 2">
          <dl>
            <dd>{{$t('m.borrowsuccess.principal')}}: {{dataDialog.remainingAmount | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
            <!--提前还款违约金-->
            <dd>{{$t('m.borrowsuccess.dueBreach')}}: {{dataDialog.interest | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
          </dl>
        </dd>
        <!--还本-->
        <dd v-if="dataDialog.principalState === 3 || dataDialog.principalState === 4">
          <dl>
            <dd>{{$t('m.borrowsuccess.principal')}}: {{dataDialog.remainingAmount | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
            <dd v-if="dataDialog.repaymentType.repayment_type==2">{{$t('m.borrowsuccess.interest')}}: {{dataDialog.interest | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
          </dl>
        </dd>
        <!--逾期还本-->
        <dd v-if="dataDialog.orderState === 11 && (dataDialog.principalState > 0)">
          <dl>
            <dd>{{$t('m.borrowsuccess.principal')}}: {{dataDialog.remainingAmount | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
            <!--逾期违约金-->
            <dd>{{$t('m.borrowsuccess.penalty')}}: {{dataDialog.breach | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
            <!--逾期罚息-->
            <dd>{{$t('m.borrowsuccess.payment')}}: {{dataDialog.interest | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
          </dl>
        </dd>

         <dd>
          <!--还款状态-->
          {{$t('m.borrowsuccess.repayment_state')}}:
          <span v-if="dataDialog.principalState > 0">
          <i v-if="dataDialog.principalState === 1">{{$t('m.borrowsuccess.overdueRepay' + dataDialog.repaymentType.repayment_type)}}</i>
          <i v-else-if="dataDialog.principalState === 2">{{$t('m.borrowsuccess.prepayment' + dataDialog.repaymentType.repayment_type)}}</i>
          <i v-else-if="dataDialog.principalState === 3">{{$t('m.borrowsuccess.repayment' + dataDialog.repaymentType.repayment_type)}}</i>
          <i v-else-if="dataDialog.principalState === 4">{{$t('m.borrowsuccess.early' + dataDialog.repaymentType.repayment_type)}}</i>
          </span>
           <span v-if="onceRepayOption === 1 && (dataDialog.orderState === 6 || dataDialog.interestState === 1)">{{$t('m.borrowsuccess.normal')}}({{$t('m.borrowsuccess.remaining')}}{{remaining}}{{$t('m.day')}})</span>
           <span v-else-if="onceRepayOption === 1 && (dataDialog.orderState === 11 || dataDialog.interestState === 3)" style="color: #ff0000">{{$t('m.borrowsuccess.withOut')}}({{remaining}}{{$t('m.day')}})</span>
        </dd>

         <!--应还日期-->
        <dd>{{$t('m.borrowsuccess.shouldDate')}}: {{dataDialog.expect_time | formatDateStrHour}}</dd>

        <!--总计应还-->
        <dd>{{$t('m.borrowsuccess.total')}}: {{dataDialog.total | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}</dd>
        <dd></dd>
         <!--可用余额-->
        <dd>
              {{$t('m.investDetails.KYYE')}}
              : {{available | formatLegalCurrency(dataDialog.symbol, dataDialog.precision)}}
            <a v-if="toUp()" @click="toRecharge">
              <!--去充值-->
               {{$t('m.invest.topUp')}}
            </a>
         </dd>
          <dd v-if="toUp()" class="warning" >
          <!--余额不足-->
          {{$t('m.borrowsuccess.balance')}}
          <!--请充值-->
          {{$t('m.borrowsuccess.topUp')}}<a @click="toRecharge"></a>
          </dd>
        <!--手续费-->
        <dt>2.{{$t('m.params.poundage')}}</dt>
        <dd>
          <div class="feel">
            <!--燃料费-->
            <span>{{$t('m.fuelCost')}}: {{$t('m.transfer.about')}} {{feeObj.feeAmount.amount / Math.pow(10, feeObj.precision)}} ZOS</span>
            <span style="flex: 1"></span>
            <span>{{$t('m.orderList.useNum')}}{{feeObj.fee_balance / Math.pow(10, feeObj.precision)}} ZOS</span>
            <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
          </div>
        </dd>
        <dd>
          <div class="feel">
            <span>
              <!--系统将优先使用优惠券抵扣-->
              {{$t('m.transfer.useCoupons')}}
            </span>
            <span style="flex: 1"></span>
            <!--优惠券数量-->
            <span> {{$t('m.transfer.couponsNum')}}{{$store.state.coupon.amountstr}} ZOS</span>
            <!--关于优惠券-->
            <a class="margin-l10" @click="couponVisible=true"> {{$t('m.transfer.abountCoupons')}}</a>
          </div>

        </dd>
        <!--登录-->
        <!-- login-user :visible="loginUserDataDialog" @closeLogin='loginUserClose' :isAppend="true"></login-user -->
        <!--获得ZOS-->
        <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
        <!--关于优惠-->
        <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>



        <!--数量不足-->
        <dd v-show="zosShow">ZOS{{$t('m.transfer.numNull')}}</dd>
        <dd class="margin-t10 text-right">
          <y-button
            :text="$t('m.cancel')"
            @btnClick="closeEvent"
          ></y-button>
          <y-button
            :text="$t('m.sure')"
            @btnClick="repaymentSubmit"
            classStyle="main-btn"
          ></y-button>
        </dd>

      </dl>
    </div>
  </el-dialog>
  <recharge-coin :assetId="assetId" dialogType="deposit" @close='onRechargeClose' :visible="rechargeDialog"></recharge-coin>
  </div>
</template>

<script>
  import YButton from '/path-components/element/YButton'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import couponDialog from '/path-components/Chain/couponDialog'
  import RechargeCoin from '/path-components/ChargeCoin'
  // import loginUser from '/path-components/loginUser'
  import formatAssets from '/js-api/public'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {
      YButton,
      getzosdialog,
      couponDialog,
      RechargeCoin,
      // loginUser,
      formatAssets,
      passwordDialog
    },
    props: {
      visible: {
        type: Boolean,
        defalut: true
      },
      dataDialog: {
        type: Object,
        defalut: {}
      },
      onceRepayOption: {
        type: Number,
        defalut: 1
      },
      symbol: {
        type: String,
        defalut: 'CNY'
      }
    },
    data () {
      return {
        status: true,
        totalShow: false,
        zosShow: false,
        feeObj: {},
        feeZos: '',
        zos_balance: '',
        // 获得zos弹框
        zosDialog: false,
        loading: false,
        couponVisible: false,
        rechargeDialog: false,
        loginUserDataDialog: false,
        // loginPassword: false
        hintKycDialog: false,
        checkinfoDialog: false,
        authenticationDialog: false,
        assetId: undefined,
        kycInfo: null, // kyc
        kycStatusCode: -1
      }
    },
    methods: {
      // 关闭还款窗口
      closeEvent () {
        this.$emit('repaymenClose', false)
      },
      couponClose () {
        this.couponVisible = false
      },
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      handleClose () {
        this.$emit('cancelDialog')
        this.totalShow = false
      },
      onRechargeClose () {
        this.rechargeDialog = false
      },
      loginUserClose (v) {
        if (v) {
          this.loginUserDataDialog = false
          this.rechargeDialog = true
        } else {
          this.loginUserDataDialog = false
        }
      },
      // 充值
      toRecharge () {
        // if (this.$store.state.userDataSid) {
        // this.rechargeDialog = true
        // } else {
        //   this.loginUserDataDialog = true
        // }
        this.openRechargeDialog()
      },
      // 获得预计手续费
      feeGet () {
        this.loading = true
        if (!this.$store.state.userName) {
          this.loading = false
          return
        }
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'bitlender_repay_interest')
          .then((res) => {
            this.feeObj = res
            this.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.zos_balance = res.fee_balance / Math.pow(10, res.precision)
            this.loading = false
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      },
      // 提交还款
      repaymentSubmit () {
        // 余额不足的时候
        if (this.toUp()) {
          this.totalShow = true
          return
        }
        this.$emit('repaymenClose', true)
        // this.loginPassword = true
      },
      // bitlenderLendOrder (v) {
      //   if (v) this.$emit('reConfirm', true)
      //   else this.loginPassword = false
      // },
      toUp () {
        return this.dataDialog.total > this.available
      },
      openRechargeDialog () {
        this.rechargeDialog = true
      },
      onAuthenticationClose () {
        this.authenticationDialog = false
      },
      onAuthenticationSuccess () {
      },
      onCheckinfoClose () {
        this.checkinfoDialog = false
      },
      onCheckinfoSuccess () {
      },
      goAuthentication () {
        this.hintKycDialog = false
        this.authenticationDialog = true
      }
    },
    computed: {
      // 用户要还的资产
      userAssets () {
        return this.$store.state.userassets.filter((val, index) => {
          return this.dataDialog.symbol === val.symbol
        })
      },
      remaining () {
        let d = Date.parse(this.dataDialog.expect_time.substr(0, this.dataDialog.expect_time.indexOf('T'))) - Date.parse(this.$store.state.curDate) - this.dataDialog.offsetTime * 1000
        return Math.abs(Math.ceil(d / (3600 * 24 * 1000)))
      },
      zosShow () {
        return this.zos_balance + this.$store.state.coupon.amount < this.feeZos
      },
      available () {
        let assetsArr = formatAssets.formatAssets(this.dataDialog.symbol)
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (this.dataDialog.symbol && assetsArr.length > 0) {
          this.assetId = assetsArr[0].asset_id
          return assetsArr[0].amount
        }
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      this.loading = true
      if (this.$store.state.initFinished) {
        this.feeGet()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.feeGet()
        })
      }
    }
  }
</script>
<style scoped>
  .warning{
    color: #ff0000;
  }
  .demo-ruleForm dt{
    margin-top: 15px!important;
  }
  .demo-ruleForm dl{
    line-height: 24px!important;
  }
</style>

<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;"  class="jyNVPQ">
    <div v-if="!mainloading">
      <div class="basicInfo">
        <span style="float: left">
          <!--资金周转-->
        <span style="float: left">{{items.id}}  {{$t('m.borrowing.turnover')}}{{items.repay_interest.length}}{{$t('m.invest.perioduint' + items.repayment_type.repayment_period_uint)}}_{{items.loan_time}}</span>
        </span>
      </div>

      <div style="position:relative;">
        <dl class="title">
          <div v-if="items.order_state !== 17 && items.order_state !== 18 && items.order_state !== 19">
            <dt>{{$t('m.borrowsuccess.repayment_state')}}</dt>
            <repay-info :tableListData="tableListData" :isCurLoginUser="isCurLoginUser"></repay-info>
            <div class="line"></div>
          </div>

          <!--借款信息-->
          <loan-info :items="items"></loan-info>
          <!--抵押物状态-->
          <!--'已没收':'已解冻'-->
          <dd>{{$t('m.borrowsuccess.pawnState')}}:
            {{mortgeState}}
            <!--{{items.order_state >= 12 ? $t('m.borrowsuccess.confiscated') : $t('m.borrowsuccess.thawed')}}-->
          </dd>
          <collateralize-info :infoData="Object.assign({}, items, itemList)" :isFeed="false"></collateralize-info>
          <div class="line"></div>
          <fee :data="feeData"></fee>
          <div class="line" v-if="items.order_state===17 && items.order_state===18"></div>
          <!--投标信息-->
          <dt>{{$t('m.investingdetail.toubiaoXX')}}</dt>
          <bidder :itemList="itemList"></bidder>
          <div class="line"></div>
          <!--费用分配-->
          <fee-distribution :feeDistr="feeDis"></fee-distribution>
        </dl>
        <img v-if="items.order_state===12 || items.order_state===15" src="/static/images/state_npa.png" class="recycle" :onerror="errorImg01" />
        <img v-else-if="items.order_state===13" src="/static/images/state_verification.png" class="recycle" :onerror="errorImg01">
        <img v-else-if="items.order_state===17 || items.order_state===18" src="/static/images/state_flow.png" class="recycle" :onerror="errorImg01">
        <img v-else-if="items.order_state===19" src="/static/images/state_del.png" class="recycle" :onerror="errorImg01">
        <img v-else src="/static/images/state_complete.png" class="recycle" :onerror="errorImg01">
      </div>
    </div>
  </div>
</template>
<script>
import { ZOSInstance } from 'zos-wallet-js'
import feeDistribution from '/path-components/Lending/feeDistribution'
export default {
  components: {
    feeDistribution,
    bidder: () => import('/path-components/Lending/bidder'),
    collateralizeInfo: () => import('/path-components/Lending/collateralizeInfo'),
    fee: () => import('/path-components/Lending/fee'),
    'repayInfo': () => import('/path-components/Lending/RepayInfo'),
    'loanInfo': () => import('/path-components/Lending/LoanInfo')
  },
  data () {
    return {
      errorImg01:
        'this.src="' + require('/path-static/images/no-img.png') + '"',
      // 借款纪录的数据
      // 还款期数的数据
      orderId: '',
      userName: '',
      userId: '',
      tableListData: {},
      itemList: '',
      // 详情
      items: '',
      // 整体加载
      mainloading: true,
      // 逾期天数,如果超过10天，还款，和一次还清的按钮，不显示
      overdue: '',
      // 是否显示
      // 投标信息的列表颜色
      colors: ['#ff0000', '#E6A23C', '#409EFF'],
      // 是否是一次性还清,1是单期还,2是一次性还清
      onceRepayOption: 1,
      feeDis: {}
    }
  },
  watch: {},
  computed: {
    mortgeState () {
      if (
        this.items.order_state === 7 ||
        this.items.order_state === 8 ||
        this.items.order_state === 9
      ) {
        return this.$t('m.borrowsuccess.thawed')
      } else if (this.items.order_state === 13) {
        return this.$t('m.borrowsuccess.confiscated')
      } else if (
        this.items.order_state === 17 ||
        this.items.order_state === 18 ||
        this.items.order_state === 19
      ) {
        return this.$t('m.returned')
      }
    },
    isCurLoginUser () {
      if (this.$route.query.accName === this.$store.state.userName && this.$store.state.login) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getFee (res) {
      let data = res
      this.feeData = {
        collateralizeFee: data.collateralize_fee.amount / Math.pow(10, this.items.asset_to_collateralize.precision),
        collateralizeFeeSymbol: this.items.asset_to_collateralize.symbol,
        collateralizeFeePrecision: this.items.asset_to_collateralize.precision,
        riskFee: data.collateralize_risk.amount / Math.pow(10, this.items.asset_to_collateralize.precision),
        riskSymbol: this.items.asset_to_collateralize.symbol,
        riskPrecision: this.items.asset_to_collateralize.precision,
        carrierFee: data.carrier_fee.amount / Math.pow(10, this.items.asset_to_loan.precision),
        carrierFeeSymbol: this.items.asset_to_loan.symbol,
        carrierFeePrecision: this.items.asset_to_loan.precision
      }
    },
    // 请求数据之后，把数据给data
    init () {
      this.mainloading = true
      this.orderId = this.$route.query.id
      if (this.$route.query.accName || this.$route.query.accID) {
        this.userName = this.$route.query.accName
        this.userId = this.$route.query.accID
      } else {
        this.userName = this.$store.state.userName
        this.userId = this.$store.state.userDataSid
      }
      ZOSInstance.get_loan_object_history(this.orderId)
        .then(res => {
          this.items = res
          this.feeDis = res.feeDis
          this.getFee(res)
          this.tableListData = res.tableListData
          this.itemList = res.investorsList
          this.mainloading = false
        })
        .catch(oberr => {
          console.log(oberr)
          this.loading = false
          this.mainloading = false
        })
    }
  },
  mounted () {
    // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
    this.mainloading = true
    if (this.$store.state.initFinished) {
      this.init()
    } else {
      this.$root.$on('initFinished', data => {
        this.init()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-tab-pane {
  padding: 10px;
}
.basicInfo {
  background: #dedede;
  padding: 5px;
  overflow: hidden;
}
.repayment {
  right: 10px;
}
dl.title dd,
dl.title dt {
  line-height: 30px;
}
.jyNVPQ {
  padding: 20px;
  background: #fff !important;
}
</style>

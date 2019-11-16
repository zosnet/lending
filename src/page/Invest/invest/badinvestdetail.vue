<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loading">
        <!--收益信息-->
        <h1 style="font-size: 1.6rem; font-weight: bold">{{$t('m.orderList.shouyiXX')}}</h1>
        <div class="earnings">
          <div>
            <!--收益-->
            {{$t('m.investList.earnedIncome')}} :
            {{investData.repay_interest_sum / Math.pow(10, investData.asset_to_loan.precision) | formatLegalCurrency(investData.asset_to_loan.symbol, investData.asset_to_loan.precision)}}
          </div>
          <div class="margin-l20">
            <!--实际收益率-->
            {{$t('m.investList.realIncomeRate')}}
            : {{(investData.repay_interest_sum / (investData.amount_to_invest.amount) * 1000).toFixed(1)}}‰
          </div>
        </div>
        <div class="earnings">
          <div>
            <!--预计总收益-->
            {{$t('m.investingdetail.yujiZSY')}}
            : {{(investData.amount_to_invest.amount / Math.pow(10, investData.asset_to_loan.precision) * (investData.interest_rate.interest_rate / 10000) * investData.order_info.loan_period) | formatLegalCurrency(investData.asset_to_loan.symbol, investData.asset_to_loan.precision)}}
          </div>
          <div class="margin-l20">
            <!--预计收益率-->
            {{$t('m.investingdetail.yujiSYL')}}
            : {{(investData.interest_rate.interest_rate / 10 * investData.order_info.loan_period).toFixed(1)}}‰
          </div>
        </div>
        <!--利息-->
        <div class="pr">
          <repay-info :tableListData="tableListData" :isInvest="true" :isCurLoginUser="isCurLoginUser"></repay-info>
          <!--状态图标-->
          <img v-if="investData.order_state==12 || investData.order_state==15" src="/static/images/state_npa.png" class="recycle"  :onerror="errorImg01">
        </div>

        <h2 style="font-size: 15px;font-weight: 700">
          <!--投标信息-->
          {{$t('m.investingdetail.toubiaoXX')}}
        </h2>
        <ul>
          <!--投标金额-->
          <li style="line-height: 35px">{{$t('m.investingdetail.toubiaoJINE')}}: {{investData.amount_to_invest.amount / Math.pow(10, investData.asset_to_loan.precision) | formatLegalCurrency(investData.asset_to_loan.symbol, investData.asset_to_loan.precision)}}</li>
          <!--投标时间-->
          <li style="line-height: 35px">{{$t('m.investingdetail.toubiaoTime')}}: {{investData.invest_time | formatDateStr}}</li>

        </ul>
        <!--借款信息-->
        <h2 style="font-size: 15px;font-weight: 700">{{$t('m.borrowsuccess.information')}}</h2>
        <ul>
          <!--借款人-->
          <li style="line-height: 35px">{{$t('m.investingdetail.jieKR')}}:
            <router-link :to="{path: `/history/borrowHis?accName=${investData.order_info.issuer_info.name}&accID=${investData.order_info.issuer_info.id}`}">{{investData.order_info.issuer_info.name}}</router-link>
          </li>
          <!--借款运营商-->
          <li style="line-height: 35px">{{$t('m.investingdetail.jieCarrier')}}:
            <router-link :to="{path: `/history/borrowHis?accName=${investData.carrier_info.name}&accID=${investData.carrier_info.id}`}">{{investData.carrier_info.name}}</router-link>
          </li>
          <li style="line-height: 35px">{{$t('m.investingdetail.borrowOrder')}}:
            <a @click="borrowOrderId()">{{investData.order_id}}</a>
          </li>
          <li style="line-height: 35px">{{$t('m.transfer.XZMS')}}: {{$t('m.invest.periodmode' + investData.order_info.repayment_type.repayment_period_uint)}}  {{$t('m.invest.repayment' + investData.order_info.repayment_type.repayment_type)}}</li>
          <li style="line-height: 35px">{{$t('m.borrow.loanAmount')}}: {{investData.amount_to_loan.amount / Math.pow(10, investData.asset_to_loan.precision) | formatLegalCurrency(investData.asset_to_loan.symbol)}}</li>
          <!--借款时长-->
          <li style="line-height: 35px">{{$t('m.investingdetail.JKSC')}}: {{investData.order_info.loan_period}}{{$t('m.invest.perioduint' + investData.order_info.repayment_type.repayment_period_uint)}}</li>
          <!--借款利率-->
          <li style="line-height: 35px">{{$t('m.borrow.borrowRate')}}: {{investData.interest_rate.interest_rate | converPercentage}}</li>
          <!--发布时间-->
          <li style="line-height: 35px">{{$t('m.investingdetail.FBSJ')}}: {{investData.order_info.loan_time | formatDateStr}}</li>
          <!--开始计息时间-->
          <li style="line-height: 35px">{{$t('m.investingdetail.startTime')}}: {{investData.order_info.invest_finish_time | formatDateStr}}</li>
        </ul>
        <!--抵押信息-->
        <h2 style="font-size: 15px;font-weight: 700">{{$t('m.investingdetail.DYXX')}}</h2>
        <ul>
          <!--抵押物数量-->
          <li style="line-height: 35px">{{$t('m.borrow.pawnNum')}}: {{investData.amount_to_collateralize.amount / Math.pow(10, investData.asset_to_collateralize.precision) | formatDigitalCurrency(investData.asset_to_collateralize.symbol, investData.asset_to_collateralize.precision)}}</li>

          <!--抵押物价值-->
          <!--<li style="line-height: 35px">{{$t('m.borrow.pawnValue')}}: {{investData.amount_to_collateralize.amount / Math.pow(10, investData.collateralize_precision)  * investData.feed_price  | formatLegalCurrency(investData.asset_to_loan.symbol)}}</li>-->
          <!--抵押倍数-->
          <!--<li style="line-height: 35px">{{$t('m.borrow.ratio')}}: {{(investData.collateral_rate / 1000) + $t('m.borrow.times')}}</li>-->
          <!--抵押物状态-->
          <li style="line-height: 35px">{{$t('m.borrowsuccess.pawnState')}}:
            {{mortgeState}}
          </li>
        </ul>
        <collateralize-info :infoData="orderData" :isFeed="true"></collateralize-info>
        <fee :data="feeData"></fee>
        <!--投资信息-->
        <ul>
          <h2>{{$t('m.investingdetail.toubiaoXX')}}</h2>
          <li><bidder :itemList="itemList"></bidder></li>
        </ul>
        <!--费用分配-->
        <fee-distribution :feeDistr="feeDis"></fee-distribution>
        <div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import feeDistribution from '/path-components/Lending/feeDistribution'
  export default {
    components: {
      mortageDialog,
      'bidder': () => import('/path-components/Lending/bidder'),
      feeDistribution,
      'collateralizeInfo': () => import('/path-components/Lending/collateralizeInfo'),
      'fee': () => import('/path-components/Lending/fee'),
      'repayInfo': () => import('/path-components/Lending/RepayInfo')
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        // 本金表格数据
        tableListData: {},
        investData: [],
        orderData: [],
        loading: true,
        feeDis: {},
        itemList: {},
        userName: '',
        userId: '',
        investId: '',
        orderId: '',
        // 费用
        feeData: {}
      }
    },
    filters: {
      splitDate: date => {
        return date.split('T')[0]
      }
    },
    computed: {
      mortgeState () {
        if (this.investData.order_state === 13) {
          return this.$t('m.borrowsuccess.confiscated')
        } else {
          return this.$t('m.borrow.frozen')
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
    watch: {
      // 因为页面一样，只是id不一样，就刷新路由，不然数据不更新
      '$route': {
        handler () {
          this.init()
        },
        deep: true
      }
    },
    methods: {
      // 请求数据之后，把数据给data
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }

        this.loading = true
        this.investId = this.$route.query.id
        ZOSInstance.get_invest_object(this.investId).then(res => {
          this.investData = res
          this.orderId = res.order_info.id
          this.orderData = res.order_info
          this.feeData = this.orderData.feeData
          this.tableListData = res.tableListData
          this.feeDis = this.orderData.feeDis
          this.itemList = this.orderData.investorsList
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.$message.error({
            message: err
          })
        })
      },
      // 跳借款订单
      borrowOrderId () {
        this.$router.push({
          path: '/history/borrowHis/badloandetails',
          query: {
            id: this.investData.order_info.id,
            accName: this.investData.order_info.issuer_info.name,
            accID: this.investData.order_info.issuer_info.id
          }
        })
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
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
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    background: #dedede;
    padding: 5px;
    overflow: hidden;
  }
  dt{
    font-size: 14px;
    font-weight: bold;
  }
  .earnings {
    display: flex; flex:1;flex-direction: row; justify-content: flex-start; align-items: center; height: 48px; width: 80%;
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

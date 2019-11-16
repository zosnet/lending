<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 10vh; position: relative"  class="jyNVPQ">
    <div class="grid-container" v-if="!mainloading && (orderState !== 13)">
      <div class="detail-content">
        <div class="basicInfo">
          <!--还款状态-->
          <span style="float: left">{{$t('m.borrowsuccess.repayment_state')}}</span>
        </div>
        <dl class="title">
          <repay-info :tableListData="tableListData" :isCurLoginUser="isCurLoginUser" :isShow="true"></repay-info>
          <div class="line"></div>
          <!--借款信息-->
          <loan-info :items="items" :isCurLoginUser="isCurLoginUser" @closeMortageAdd="closeMortageAdd"></loan-info>
          <!--已冻结-->
          <dd>{{$t('m.borrowsuccess.pawnState')}}: {{$t('m.borrow.frozen')}}</dd>
          <collateralize-info :infoData="items" :isFeed="true"></collateralize-info>
          <div class="line"></div>
          <fee :data="feeData"></fee>
          <div class="line"></div>
          <!--投标信息-->
          <dt style="font-size: 15px;font-weight: 700">{{$t('m.investingdetail.toubiaoXX')}}</dt>
          <bidder :itemList="investorsList"></bidder>
          <div class="line"></div>
          <!--费用分配-->
          <fee-distribution :feeDistr="feeDis"></fee-distribution>
          <div class="line"></div>
        </dl>

    </div>
    <img v-if="orderState===12 || orderState===15" src="/static/images/state_npa.png" class="recycle" :onerror="errorImg01" />
    </div>
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import feeDistribution from '/path-components/Lending/feeDistribution'
  import { ChainStore } from 'zosjs/es'
  export default {
    components: {
      passwordDialog,
      'bidder': () => import('/path-components/Lending/bidder'),
      feeDistribution,
      'collateralizeInfo': () => import('/path-components/Lending/collateralizeInfo'),
      'fee': () => import('/path-components/Lending/fee'),
      'repayInfo': () => import('/path-components/Lending/RepayInfo'),
      'loanInfo': () => import('/path-components/Lending/LoanInfo')
    },
    data () {
      return {
        errorImg01: '/static/images/no-img.png',
        tableListData: {},
        // 还本的数据
        itemList: '',
        // 详情
        items: {},
        // 投资人列表
        investorsList: '',
        loading: true,
        // 整体加载
        mainloading: true,
        // 是否显示
        orderState: 1,
        feeDis: {},
        interest: ''
      }
    },
    watch: {
    },
    computed: {
      isCurLoginUser () {
        if (this.$route.query.accName === this.$store.state.userName && this.$store.state.login) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      // 请求数据之后，把数据给data
      closeMortageAdd (v) {
        if (v) this.init()
      },
      init () {
        this.mainloading = true
        ChainStore.setLoginAccount(this.$store.state.userDataSid)
        ZOSInstance.get_loan_object(this.$route.query.id)
          .then((res) => {
            this.mainloading = false
            if (res) this.items = res
            this.orderState = res.order_state
            this.tableListData = res.tableListData
            this.investorsList = res.investorsList
            this.feeDis = res.feeDis
            this.feeData = res.feeData
            this.loading = false
            this.mainloading = false
          })
          .catch((err) => {
            console.log(err)
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
  .repayment{
    right:10px;
  }
  dl.title dd, dl.title dt {
    line-height: 30px;
  }
  .principal{
    border: 1px solid #ebeef5;
    border-top: none;
    height: 48px;
    line-height: 48px;
    width: 90%;
  }
  .principal span{
    border-right: 1px solid #ebeef5;
    display: inline-block;
  }
  .principal span:last-child{
    border-right: 0;
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 10vh; position: relative" class="jyNVPQ">
    <div v-if="!mainloading">
      <div class="basicInfo">
        {{items.id}}
      </div>
      <dl class="title">
        <!--还款状态-->
        <dd>{{$t('m.borrow.loanStatus')}}: {{$t('m.badloan')}}</dd>
        <dd class="margin-l20">{{$t('m.index.transactions.type')}}:
          <span v-if="items.order_state === 12">{{$t('m.borrow.overdue')}}</span>
          <span v-else>{{$t('m.borrow.unwind')}}</span>
        </dd>
        <dd class="margin-l20">
          {{$t('m.orderList.operTime')}}: {{items.notify_time | formatDateStr}}
        </dd>
        <!--利息-->
        <repay-info :tableListData="tableListData"></repay-info>
        <div class="line"></div>
        <!--借款信息-->
        <loan-info :items="items" :isAddCollate="isAddCollate"></loan-info>
        <!--已冻结-->
        <dd>{{$t('m.borrowsuccess.pawnState')}}: {{$t('m.borrow.frozen')}}</dd>
        <collateralize-info :infoData="Object.assign({}, items, itemList)" :isFeed="true"></collateralize-info>
        <div class="line"></div>
        <fee :data="feeData"></fee>
        <div class="line"></div>
        <!--投标信息-->
        <dt>{{$t('m.investingdetail.toubiaoXX')}}</dt>
        <bidder :itemList="itemList"></bidder>
        <div class="line"></div>
        <!--费用分配-->
        <fee-distribution :feeDistr="feeDis"></fee-distribution>
        <div class="line"></div>
        <!--输入资金密码-->
      </dl>
    </div>
    <img v-if="itemList.order_state===12 || itemList.order_state===15" src="/static/images/state_npa.png" class="recycle" :onerror="errorImg01">
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
      'repayInfo': () => import('/path-components/Lending/RepayInfo'),
      'loanInfo': () => import('/path-components/Lending/LoanInfo')
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        // 还本的数据
        tableListData: {},
        // 还款期数的数据
        tableData: '',
        itemList: '',
        // 详情
        items: {},
        loading: true,
        // 整体加载
        mainloading: true,
        // 是否显示
        // 增加抵押物的弹窗
        addPawnDialog: false,
        // 还款弹窗
        repaymentDialog: false,
        orderState: 1,
        feeDis: {},
        orderId: '',
        userName: '',
        userId: '',
        appointtemI: ''
      }
    },
    watch: {
    },
    computed: {
      isAddCollate () {
        if (this.$route.query.accName === this.$store.state.userName) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      // 关闭增加抵押物
      closeMortage () {
        this.addPawnDialog = false
      },
      // 请求数据之后，把数据给data
      init () {
        this.orderId = this.$route.query.id
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.mainloading = true
        this.loading = true
        ZOSInstance.get_loan_object(this.orderId)
          .then((res) => {
            this.feeData = res.feeData
            this.itemList = res.investorsList
            this.items = res
            this.feeDis = res.feeDis
            this.orderState = res.order_state
            this.tableListData = res.tableListData
            this.mainloading = false
          })
          .catch((err) => {
            console.log(err)
            this.loading = false
            this.mainloading = false
          })
      },
      addDYW (item) {
        let itemObj = {}
        itemObj = item
        this.appointtemI = itemObj
        this.addPawnDialog = true
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
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
  .title{
    padding: 10px 15px 0;
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

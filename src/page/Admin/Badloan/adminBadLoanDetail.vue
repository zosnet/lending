<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
    <div v-if="!mainloading && (orderState === 12 || orderState === 15)">
      <div class="basicInfo">
        {{items.id}}
      </div>
      <dl class="title pr">
        <!--还款状态-->
          <dd>{{$t('m.borrow.loanStatus')}}: {{$t('m.badloan')}}</dd>
          <dd class="margin-l20">{{$t('m.index.transactions.type')}}:
            <span v-if="items.order_state === 12">{{$t('m.borrow.overdue')}}</span>
            <span v-else>{{$t('m.borrow.unwind')}}</span>
          </dd>
          <dd class="margin-l20">
            {{$t('m.orderList.operTime')}}: {{items.notify_time | formatLocalTime}}
          </dd>
        <!--利息-->
          <repay-info :tableListData="tableListData"  :isCurLoginUser="isCurLoginUser"></repay-info>
          <div class="line"></div>
          <dt>
            <!--借款信息-->
            {{$t('m.borrowsuccess.information')}}
          </dt>
           <!--借款模式-->
          <dd>{{$t('m.transfer.XZMS')}}: {{$t('m.invest.periodmode' + items.repayment_type.repayment_period_uint)}}{{$t('m.invest.repayment' + items.repayment_type.repayment_type)}}</dd>

          <dd>{{$t('m.borrow.loanAmount')}}:{{items.amount_to_loan.amount / Math.pow(10, items.asset_to_loan.precision) | formatLegalCurrency(items.asset_to_loan.symbol, items.asset_to_loan.precision)}}</dd>
          <!--借款时长-->
          <dd>{{$t('m.investingdetail.JKSC')}}: {{items.loan_period}}{{$t('m.invest.perioduint' + items.repayment_type.repayment_period_uint)}}</dd>
          <!--借款利率 , 年-->
          <dd>{{$t('m.borrow.borrowRate')}}: {{items.interest_rate | converPercentage}} /{{$t('m.invest.perioduint' + items.repayment_type.repayment_period_uint)}}</dd>
          <!--发布时间-->
          <dd>{{$t('m.investingdetail.FBSJ')}}: {{items.loan_time | formatDateStr}}</dd>
          <!--满标时间-->
          <dd>{{$t('m.borrow.WithTime')}}: {{items.invest_finish_time | formatDateStr}}</dd>
          <div class="line"></div>
          <!--抵押物信息-->
          <dt>{{$t('m.borrow.collateralInfo')}}</dt>
          <!--抵押物-->
          <dd>{{$t('m.borrow.collateral')}}: {{items.amount_to_collateralize.amount / Math.pow(10, items.asset_to_collateralize.precision) | formatLegalCurrency(items.asset_to_collateralize.symbol, items.asset_to_collateralize.precision)}}</dd>
          <!--抵押物价值-->
          <!--增加抵押-->

          <!--抵押物状态: 已冻结-->
          <dd>{{$t('m.borrow.collateralState')}}: {{$t('m.borrow.frozen')}}</dd>
          <collateralize-info :infoData="Object.assign({}, items, itemList)" :isFeed="true"></collateralize-info>
          <div class="line"></div>
          <!--投标信息-->
          <dt>{{$t('m.investingdetail.toubiaoXX')}}</dt>
          <bidder :itemList="itemList"></bidder>
          <div class="line"></div>
        <img src="/static/images/state_npa.png" style="position:absolute;top:0;left:70%;width:25%;z-index:10;" :onerror="errorImg01" />
        </dl>

    </div>
    <!--选择抵押物-->
    <el-dialog
      :title="$t('m.borrow.XZDYW')"
      :visible.sync="addPawnDialog"
      width="45%"
    >
      <mortage-dialog :element-loading-text="$t('m.loading')"
                      :datail = 'appointtemI'
                      :ifShowDlg = 'addPawnDialog'
                      @closeMortage="closeMortage"
                      v-if="addPawnDialog"
      ></mortage-dialog>
    </el-dialog>
    </div>
</template>
<script>
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {
      mortageDialog,
      'bidder': () => import('/path-components/Lending/bidder'),
      'collateralizeInfo': () => import('/path-components/Lending/collateralizeInfo'),
      'repayInfo': () => import('/path-components/Lending/RepayInfo')
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        orderId: '',
        userName: '',
        userId: '',
        type: 0,
        tableListData: {},
        // 还款期数的数据
        itemList: '',
        // 详情
        items: {},
        // 投资人列表
        investorsList: '',
        loading: true,
        // 整体加载
        mainloading: true,
        // 逾期天数,如果超过10天，还款，和一次还清的按钮，不显示
        // 增加抵押物的弹窗
        addPawnDialog: false,
        // 确认信息
        confirmDialog: false,
        orderState: '',
        appointtemI: ''
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
      // 关闭增加抵押物
      closeMortage () {
        this.addPawnDialog = false
      },
      // 请求数据之后，把数据给data
      init () {
        this.mainloading = true
        this.orderId = this.$route.query.id
        this.type = this.$route.query.type
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        ZOSInstance.get_loan_object(this.orderId).then((res) => {
          this.itemList = res.investorsList
          this.items = res
          this.orderState = res.order_state
          this.tableListData = res.tableListData
          this.loading = false
          this.mainloading = false
        }).catch((err) => {
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
</style>

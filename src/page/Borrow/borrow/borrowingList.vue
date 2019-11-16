<template>
  <div>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
      <div v-if="!loading">
        <el-table
          :data="borrowList"
          class="curp"
          style="width: 100%"
          @row-click="handleClick"
          stripe>
          <!--标题-->
          <el-table-column width="120" :label="$t('m.borrowing.name')">
            <template slot-scope="scope">
              <img :src="'/static/images/' + scope.row.asset_to_collateralize.symbol + '.png'" width="24" :onerror="errorImg01" />
              <!--资产周转-->
              <!--{{$t('m.borrowing.turnover')}}- -->
              {{scope.row.id}}
            </template>
          </el-table-column>
          <!--已投金额-->
          <el-table-column width="160" :label="$t('m.investList.invested')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.current_invest.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
          <!--已投进度-->
          <el-table-column  width="100" :label="$t('m.investList.investedPro')">
            <template slot-scope="scope">
              <div style="width: 60%; height:50px">
                <div style="margin-top: 25px">
                  <span>{{(scope.row.current_invest.amount / scope.row.amount_to_loan.amount) | formatProcess}}%</span>
                  <el-progress stroke-width="2" :show-text="false" :percentage="(scope.row.current_invest.amount / scope.row.amount_to_loan.amount) | formatProcess"></el-progress>
                </div>
              </div>
            </template>
          </el-table-column>
          <!--距截止时间-->
          <el-table-column width="120" :label="$t('m.investList.deadline')">
            <template slot-scope="scope">
              <span>{{scope.row.expiration_time | dateDiffDay($store.state.curDate)}}</span>
            </template>
          </el-table-column>
          <!--借款金额-->
          <el-table-column width="160" :label="$t('m.investList.allInvestSum')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
          <!--借款期限/利率-->
          <el-table-column width="150" :label="$t('m.investList.timeRate')">
            <template slot-scope="scope">
              <span>
                {{scope.row.loan_period}}({{showPeriodUint(scope.row.repayment_type)}})
              </span><br>
              <span>
                {{scope.row.interest_rate.interest_rate | converPercentage(100)}}/{{showPeriodUint(scope.row.repayment_type)}}
              </span>
            </template>
          </el-table-column>
          <!--抵押物数量/价值-->
          <el-table-column width="190" :label="$t('m.borrowing.quantity')">
            <template slot-scope="scope">
              {{scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.asset_to_collateralize.precision) | formatLegalCurrency(scope.row.asset_to_collateralize.symbol, scope.row.asset_to_collateralize.precision)}}
              <div class="secondaryInfo"><span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
                {{collateralizeFeed(scope.row) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <img v-show="scope.row.need_add_collateralize > 0 && showHistory" width="30" height="30" src="/static/images/addmortgageBtn.png" @click.stop="addDYW(scope.row)" :title="$t('m.borrow.addCollateral')">
            </template>
          </el-table-column>
          <div slot="empty">
            <p>{{$t('m.noData')}}</p>
          </div>
        </el-table>
        <div style="text-align: right">
          <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--选择抵押物-->
    <mortage-dialog :datail = 'appointtemI'
                    :ifShowDlg = 'addPawnDialog'
                    @closeMortage="closeMortage"
                    v-if="addPawnDialog"
    ></mortage-dialog>
  </div>
</template>
<script>
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
  export default {
    components: {
      mortageDialog
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        appointtemI: {},
        borrowListShow: 0,
        total: null,
        loading: true,
        listQuery: {
          page: -1,
          limit: 10
        },
        // 增加抵押物的弹窗
        addPawnDialog: false,
        userName: '',
        userId: ''
      }
    },
    computed: {
      // 是否为历史记录
      showHistory () {
        if (window.location.hash.indexOf('history') !== -1) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      '$route': function () {
        if (this.$store.state.initFinished) {
          if (this.$route.query.accName || this.$route.query.accID) {
            this.userName = this.$route.query.accName
            this.userId = this.$route.query.accID
          } else {
            this.userName = this.$store.state.userName
            this.userId = this.$store.state.userDataSid
          }
        }
      },
      'userId': {
        handler: function (newVal, oldVal) {
          if (this.userId !== newVal) {
            this.userId = newVal
            this.getList(1)
          }
        },
        deep: true
      }
    },
    filters: {
      formatProcess: process => {
        return Math.floor(process * 100)
      }
    },
    methods: {
      collateralizeFeed (row) {
        return LendInstance.collateralizeFeed(row)
      },
      // 关闭增加抵押物
      closeMortage () {
        this.addPawnDialog = false
      },
      handleClick (row) {
        this.$router.push({
          path: 'borrowingdetail',
          query: {
            id: row.id,
            accName: row.issuer.name,
            accID: row.issuer.id
          }
        })
      },
      showPeriodUint (x) {
        return this.$t('m.invest.perioduint' + x.repayment_period_uint)
      },
      addDYW (item) {
        let itemObj = {}
        itemObj = item
        this.appointtemI = itemObj
        this.addPawnDialog = true
      },
      getList (v) {
        let statusArry = [1, 3]
        this.loading = true
        this.listQuery.page = v
        ZOSInstance.get_loan_counts([this.userId], [], statusArry).then(res => {
          var listNum = res
          if (v === 1) {
            this.start = 0
          } else {
            this.start = (this.listQuery.page - 1) * this.listQuery.limt
          }
          ZOSInstance.get_loan_orders([this.userId], [], statusArry, this.start, this.listQuery.limit).then(res => {
            this.borrowList = res
            this.total = listNum
            if (this.borrowList.length === 0) {
              this.borrowListShow = 1
            } else if (this.borrowList.length > 0) {
              this.borrowListShow = 2
            }
            this.loading = false
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
        this.getList(1)
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.getList(val)
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
    }
  }
</script>
<style scoped lang="scss">
  .el-progress{
    line-height: 2!important;
  }
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    padding: 5px 0;
    overflow: hidden;
  }
  .charts{
    width: 300px;
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

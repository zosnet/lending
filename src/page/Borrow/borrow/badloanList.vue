<template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
      <div v-if="!loading">
        <el-table
          :data="refunding"
          class="curp"
          style="width: 100%"
          @row-click="handleClick"
          stripe>
          <!--标题/还款状态-->
          <el-table-column width="150" :label="$t('m.borrowing.name')">
            <template slot-scope="scope">
              <img :src="'/static/images/' + scope.row.asset_to_collateralize.symbol + '.png'" width="24" :onerror="errorImg01">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column width="150" :label="$t('m.borrow.reason')">
            <template slot-scope="scope">
              <!--不良资产-->
              <span v-if="scope.row.order_state === 12">{{$t('m.borrow.overdue')}}</span>
              <span v-else>{{$t('m.borrow.unwind')}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" :label="$t('m.borrow.badTime')">
            <template slot-scope="scope">
              <span>{{scope.row.notify_time | formatLocalTime}}</span>
            </template>
          </el-table-column>
          <!--借款金额/期限-->
          <el-table-column width="220" :label="$t('m.borrowsuccess.numNper')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
              <div class="secondaryInfo">{{scope.row.loan_period}}{{$t('m.invest.perioduint' + scope.row.repayment_type.repayment_period_uint)}}</div>
            </template>
          </el-table-column>

          <!--抵押物数量/价值-->
          <el-table-column width="220" :label="$t('m.borrowing.quantity')">
            <template slot-scope="scope">
              {{(scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.asset_to_collateralize.precision)) | formatLegalCurrency(scope.row.asset_to_collateralize.symbol, scope.row.asset_to_collateralize.precision)}}
              <div class="secondaryInfo">
                <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
                {{llateralizefeed(scope.row) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <img v-show="scope.row.need_add_collateralize > 0 && showHistory && (scope.row.order_state === 12)" width="30" height="30" src="/static/images/addmortgageBtn.png" @click.stop="addDYW(scope.row)" :title="$t('m.borrow.addCollateral')">
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
      <!--选择抵押物-->
        <mortage-dialog :element-loading-text="$t('m.loading')"
                        :datail = 'appointtemI'
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
        tableData: '',
        loadingDialog: false,
        total: null,
        listQuery: {
          page: 1,
          limit: 10
        },
        refunding: [
        ],
        emptyListShow: 0,
        // 增加抵押物的弹窗
        addPawnDialog: false,
        loading: true,
        loadings: false,
        password: '',
        feeTotal: '',
        btnText: this.$t('m.sure'),
        // 是否是一次性还清,1是单期还,2是一次性还清
        onceRepayOption: 1,
        userName: '',
        userId: '',
        appointtemI: ''
      }
    },
    watch: {
      '$route': function (from, to) {
        if (this.$store.state.initFinished) {
          if (this.$route.query.accName || this.$route.query.accID) {
            this.userName = this.$route.query.accName
            this.userId = this.$route.query.accID
          } else {
            this.userName = this.$store.state.userName
            this.userId = this.$store.state.userDataSid
          }
        }
      }
    },
    filters: {
      formatSum: sum => {
        return sum.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      },
      formatData: time => {
        return time.toString().replace('T', ' ')
      },
      formatState: (state, type) => {
        if (type === 1) {
          if (state === 12 || state === 13 || state === 15) {
            // '已核销'
            return this.$t('m.borrowsuccess.hasDel')
          } else {
            // '已还'
            return this.$t('m.borrowsuccess.repayed')
          }
        } else {
          if (state === 12 || state === 13 || state === 15) {
            // '已没收'
            return this.$t('m.borrowsuccess.confiscated')
          } else {
            // '已解冻'
            return this.$t('m.borrowsuccess.thawed')
          }
        }
      }
    },
    computed: {
      showHistory () {
        if (window.location.hash.indexOf('history') !== -1) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      llateralizefeed (row) {
        return LendInstance.collateralizeFeed(row)
      },
      // 关闭增加抵押物
      closeMortage () {
        this.addPawnDialog = false
      },
      handleClick (row, event, column) {
        this.$router.push({
          path: 'badloandetails',
          query: {
            id: row.id,
            accName: row.issuer.name,
            accID: row.issuer.id
          }
        })
      },
      // 显示密码输入框
      showPW () {
        this.accountDialog = true
        this.repaymentDialogVisible = false
      },
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.getList()
      },
      getList () {
        this.loading = true
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        let statusArry = [12, 15]
        ZOSInstance.get_loan_counts([this.userId], [], statusArry).then(res => {
          var listNum = res
          if (listNum === 0) {
            this.loading = false
            this.emptyListShow = 1
            return
          }
          this.emptyListShow = 2
          let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
          ZOSInstance.get_loan_orders([this.userId], [], statusArry, startIndex, this.listQuery.limit).then(res => {
            console.log('web不良资产', res)
            this.refunding = res
            this.total = listNum
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.$message.error({
              message: err
            })
            this.loading = false
          })
        })
          .catch((error) => {
            console.log(error)
            this.loading = false
            this.$message.error({
              message: error
            })
          })
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.listQuery.page = val
        this.getList()
      },
      addDYW (item) {
        this.appointtemI = item
        this.addPawnDialog = true
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
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    padding: 5px 0;
    overflow: hidden;
  }
  .secondaryInfo{
    color: #87898D;
    font-size: 13px;
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

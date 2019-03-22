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
          <el-table-column width="100" :label="$t('m.borrowing.name')">
            <template slot-scope="scope">
              <img :src="'/static/images/' + scope.row.asset_to_collateralize.symbol + '.png'" width="24" :onerror="errorImg01" />
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column width="180" :label="$t('m.borrowsuccess.repayment_sum')" prop="rePayAmount">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              <!-- <span v-if="scope.row.order_state===6">
                {{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}</span>
              <span v-else>
                {{scope.row.repayamount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
              </span> -->
              {{scope.row.repayamount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
          <el-table-column width="70" :label="$t('m.borrowsuccess.repayment_cycle')" prop="repayperiods">
            <template slot-scope="scope">
              <span>{{scope.row.repayperiods}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" :label="$t('m.borrowsuccess.repayment_day_state')" prop="expecttime">
            <template slot-scope="scope">
              <span>{{rePayState(scope.row.repay_interest)}}</span>
              <!-- <span>{{scope.row.expect_time | dateDiffDay($store.state.curDate)}}</span> -->
              <br>
              <span class="secondaryInfo">{{scope.row.expecttime}}</span>
            </template>
          </el-table-column>
          <!--借款金额/期限-->
          <el-table-column width="200" :label="$t('m.borrowsuccess.numNper')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
              <div class="secondaryInfo">{{scope.row.loan_period}}{{$t('m.month')}}</div>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('m.borrow.borrowRate')">
            <template slot-scope="scope">
              <span>{{scope.row.interest_rate.interest_rate | converPercentage(100) }}/{{ $t('m.year')}}</span>
            </template>
          </el-table-column>
          <!--抵押物数量/价值-->
          <el-table-column width="220" :label="$t('m.borrowing.quantity')">
            <template slot-scope="scope">
              {{(scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.asset_to_collateralize.precision)) | formatLegalCurrency(scope.row.asset_to_collateralize.symbol, scope.row.asset_to_collateralize.precision)}}
              <div class="secondaryInfo">
                <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
                {{collateralizeFeed(scope.row) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <!--增加抵押-->
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
      rePayState (tableData) {
        let chainTime = this.$store.state.curDate
        for (let index = 0; index < tableData.length; index++) {
          const itemData = tableData[index][1]
          if (itemData.interest_state === 1 || itemData.interest_state === 2) {
            let time = itemData.expect_time.substr(0, itemData.expect_time.indexOf('T'))
            let d = Date.parse(time) - Date.parse(chainTime)
            let day = Math.ceil(d / (3600 * 24 * 1000))
            return window.vm.$t('m.borrowsuccess.normal') + ' (' + window.vm.$t('m.borrowsuccess.remaining') + day + window.vm.$t('m.day') + ')'
          } else if (itemData.interest_state === 3) {
            let time = itemData.expect_time.substr(0, itemData.expect_time.indexOf('T'))
            let d = Date.parse(time) - Date.parse(chainTime)
            let day = Math.ceil(d / (3600 * 24 * 1000))
            // 逾期
            return window.vm.$t('m.borrowsuccess.withOut') + '(' + Math.abs(day) + window.vm.$t('m.day') + ')'
          }
        }
      },
      collateralizeFeed (row) {
        return LendInstance.collateralizeFeed(row)
      },
      // 关闭增加抵押物
      closeMortage () {
        this.addPawnDialog = false
      },
      handleClick (row, event, column) {
        this.$router.push({
          path: 'borrowsuccessdetail',
          query: {
            id: row.id,
            accName: row.issuer.name,
            accID: row.issuer.id
          }
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
      getList (val) {
        this.loading = true
        let userId = this.userId
        let statusArry = [4, 5, 6, 10, 11]
        this.listQuery.page = val
        ZOSInstance.get_loan_counts([userId], [], statusArry).then(res => {
          var listNum = res
          if (listNum === 0) {
            this.loading = false
            this.emptyListShow = 1
            return
          }
          this.emptyListShow = 2
          let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
          ZOSInstance.get_loan_orders([userId], [], statusArry, startIndex, this.listQuery.limit).then(res => {
            this.refunding = res
            // 应还的金额,应还期数
            this._repayAmout()
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
            this.loading = false
            console.log(error)
            this.$message.error({
              message: error
            })
          })
      },
      _repayAmout () {
        this.refunding.map(item => {
          for (let val of item.repay_interest) {
            if (val[1].interest_state === 1 || val[1].interest_state === 3) {
              item['repayamount'] = val[1].expect_repay_interest.amount
              item['repayperiods'] = `${val[0] + 1}/${item.repay_interest.length}`
              item['expecttime'] = val[1].expect_time.split('T')[0]
              return item
            } else {
              item['repayamount'] = item.amount_to_loan.amount
              item['repayperiods'] = window.vm.$t('m.borrow.capital')
              item['expecttime'] = item.expect_principal_time.split('T')[0]
            }
          }
        })
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.getList(val)
      },
      addDYW (item) {
        let itemObj = {}
        itemObj = item
        this.appointtemI = itemObj
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

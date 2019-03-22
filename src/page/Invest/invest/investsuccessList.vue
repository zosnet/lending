<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loading">
        <el-table
          :data="refunding"
          class="curp"
          style="width: 100%"
          stripe
          @row-click="handleClick">
          <el-table-column width="120" :label="$t('m.borrowing.name')">
            <template slot-scope="scope">
              <img :src="'/static/images/' + scope.row.asset_to_collateralize.symbol + '.png'" width="24" :onerror="errorImg01" />
              <span class="margin-l10">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" :label="$t('m.investList.investSum')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.amount_to_invest.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
          <el-table-column  width="180" :label="$t('m.investList.investTime')">
            <template slot-scope="scope">
              <span>{{scope.row.invest_time | formatDateStr}}</span>
            </template>
          </el-table-column>
          <el-table-column width="220" :label="$t('m.investList.earnedIncome')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.repay_interest_sum / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
            <el-table-column :label="$t('m.borrow.pawnNumState')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_collateralize.symbol}}</span>
              {{scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.asset_to_collateralize.precision) | formatLegalCurrencys(scope.row.asset_to_collateralize.symbol, scope.row.asset_to_collateralize.precision)}}
              <p><span class="secondaryInfo">{{scope.row.order_info.order_state | formatState}}</span></p>
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
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: null,
        loading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        refunding: [],
        userName: '',
        userId: ''
      }
    },
    filters: {
      formatState: (state) => {
        if (state === 12 || state === 15) {
          return window.vm.$t('m.badloan')
        } else {
          return window.vm.$t('m.orderList.freeze')
        }
      }
    },
    methods: {
      handleClick (row, event, column) {
        this.$router.push({
          path: 'investsuccessdetail',
          query: {
            id: row.id,
            accName: this.userName,
            accID: this.userId
          }
        })
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
        let userId = this.userId

        let statusArry = [4, 5, 6, 10, 11]
        ZOSInstance.get_invest_counts([userId], [], statusArry).then(res => {
          var listNum = res
          if (listNum === 0) {
            this.loading = false
            return
          }
          let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
          ZOSInstance.get_invest_orders([userId], [], statusArry, startIndex, this.listQuery.limit).then(res => {
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
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      init () {
        this.listQuery.page = 1
        this.getList()
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.listQuery.page = val
        this.getList()
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
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

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
              <img :src="'/static/images/' + scope.row.collateralize_asset.symbol + '.png'" width="24" :onerror="errorImg01">
              <span class="margin-l10">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <!-- 投资金额 -->
          <el-table-column width="200" :label="$t('m.investList.investSum')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{(scope.row.amount_to_invest.amount / Math.pow(10, scope.row.asset_to_loan.precision))  | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
          <!-- 运营商 -->
          <el-table-column :label="$t('m.params.operator')" width="200">
            <template slot-scope="scope">
              {{scope.row.order_info.carrier}}
                <i class="el-icon-circle-check-outline green f20" v-if="scope.row.state"></i>
                <i class="el-icon-circle-close-outline active f20" v-else></i>
            </template>
          </el-table-column>
          <!-- 不良资产原因 -->
          <el-table-column  width="150" :label="$t('m.borrow.reason')">
            <template slot-scope="scope">
              <!--不良资产-->
              <span v-if="scope.row.order_state === 12">{{$t('m.borrow.overdue')}}</span>
              <span v-else>{{$t('m.borrow.unwind')}}</span>
            </template>
          </el-table-column>
          <!-- 不良资产时间 -->
          <el-table-column width="180" :label="$t('m.borrow.badTime')">
            <template slot-scope="scope">
              {{scope.row.order_info.notify_time | formatDateStr}}
            </template>
          </el-table-column>
          <!-- 抵押物数量/价值 -->
          <el-table-column :label="$t('m.borrowing.quantity')">
            <template slot-scope="scope">
              {{(scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.collateralize_asset.precision)) | formatLegalCurrency(scope.row.collateralize_asset.symbol, scope.row.collateralize_asset.precision)}}
              <div class="secondaryInfo">
                <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
                {{collateralizeFeed(scope.row) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}</div>
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
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
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
      collateralizeFeed (row) {
        return LendInstance.collateralizeFeed(row)
      },
      handleClick (row, event, column) {
        this.$router.push({
          path: 'badinvestdetail',
          query: {
            id: row.id,
            accName: this.userName,
            accID: this.userId
          }
        })
      },
      init () {
        this.listQuery.page = 1
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
        let userId = this.userId
        let statusArry = [12, 15]
        ZOSInstance.get_invest_counts([userId], [], statusArry).then(res => {
          var listNum = res
          if (listNum === 0) {
            this.loading = false
            return
          }
          let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
          ZOSInstance.get_invest_orders([userId], [], statusArry, startIndex, this.listQuery.limit).then(ress => {
            this.refunding = ress
            this.total = listNum
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.$message.error({
              message: err
            })
            this.loading = false
          })
        }).catch(error => {
          console.log(error)
          this.$message.error({
            message: error
          })
          this.loading = false
        })
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

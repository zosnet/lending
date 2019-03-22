<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loading">
        <div class="block">
          <span class="demonstration">{{$t('m.borrowsuccess.selectDate')}}</span>
          <el-date-picker
            v-model="historyStartDate"
            type="month"
            :placeholder="$t('m.borrowsuccess.selectMonth')"
            @change="selectedTime"
          >
          </el-date-picker>
          <el-date-picker
              v-model="historyEndDate"
              type="month"
              :placeholder="$t('m.borrowsuccess.selectMonth')"
              @change="selectedTime"
          >
          </el-date-picker>
        </div>
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
             <span class="currency">{{scope.row.asset_to_invest.symbol}}</span>
              {{scope.row.amount_to_invest.amount / Math.pow(10, scope.row.asset_to_invest.precision) | formatLegalCurrencys('', scope.row.asset_to_invest.precision)}}
            </template>
          </el-table-column>
          <el-table-column width="160" :label="$t('m.investList.investTime')">
            <template slot-scope="scope">
              <span>{{scope.row.invest_time | formatDateStr}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" :label="$t('m.investList.realIncome')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_invest.symbol}}</span>
              {{scope.row.repay_interest_sum / Math.pow(10, scope.row.asset_to_invest.precision) | formatLegalCurrencys('', scope.row.asset_to_invest.precision)}}
            </template>
          </el-table-column>
          <el-table-column width="160" :label="$t('m.investList.realIncomeRate')">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.repay_interest_rate * 1000).toFixed(2)}}‰</span>
            </template>
          </el-table-column>
          <!--订单状态-->
          <el-table-column :label="$t('m.page.orderStatus')">
            <template slot-scope="scope">
              <span>{{scope.row.order_info.order_state | formatState(scope.row.order_info.time_state)}}</span>
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
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import {formatUnixTime} from '/js-utils/until'
  import { getStore, setStore } from '/js-utils/storage'
  export default {
    components: {
      mortageDialog
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: 0,
        loading: true,
        emptyListShow: 0,
        listQuery: {
          page: 1,
          limit: 7
        },
        refunding: [],
        userName: '',
        userId: '',
        start: 0,
        historyStartDate: new Date(),
        historyStartDate_sel: new Date(),
        historyEndDate: new Date(),
        historyEndDate_sel: new Date(),
        firstDay: '',
        lastDay: ''
      }
    },
    filters: {
      formatState: (state, timeState) => {
        if (state === 7 || state === 8 || state === 9 || state === 13) {
          return window.vm.$t('m.settlement')
        } else if (state === 17 || state === 18) {
          return window.vm.$t('m.flow')
        }
      }
    },
    methods: {
      handleClick (row, event, column) {
        this.$router.push({
          path: 'historyInvestdetail',
          query: {
            id: row.id,
            accName: this.userName,
            accID: this.userId
          }
        })
      },
      // 选择时间
      selectedTime () {
        if (this.historyStartDate_sel === this.historyStartDate && this.historyEndDate_sel === this.historyEndDate) return
        this.historyStartDate_sel = this.historyStartDate
        this.historyEndDate_sel = this.historyEndDate
        setStore('historyStartDate', this.historyStartDate.toString())
        setStore('historyEndDate', this.historyEndDate.toString())
        this.getListByTime()
      },
      // 得到开始，结束时间
      getListByTime () {
        let y = this.historyStartDate.getFullYear()
        let m = this.historyStartDate.getMonth()
        this.firstDay = formatUnixTime(new Date(y, m, 1, 0, 0, 0))
        y = this.historyEndDate.getFullYear()
        m = this.historyEndDate.getMonth()
        this.lastDay = formatUnixTime(new Date(y, m + 1, 0, 0, 0, 0))
        this.getList(1)
      },
      init () {
        var store = getStore('historyStartDate')
        if (store) this.historyStartDate = new Date(store)
        store = getStore('historyEndDate')
        if (store) this.historyEndDate = new Date(store)
        this.selectedTime()
      },
      getList (v) {
        this.loading = true
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        let userId = this.userId
        this.listQuery.page = v
        ZOSInstance.get_account_invest_history_count(userId, this.firstDay, this.lastDay).then(res => {
          var listNum = res
          if (listNum === 0) {
            this.loading = false
            this.emptyListShow = 1
            return
          }
          this.emptyListShow = 2
          if (v === 1) {
            this.start = 0
          } else {
            this.start = (this.listQuery.page - 1) * this.listQuery.limit
          }
          ZOSInstance.get_account_invest_history(userId, this.firstDay, this.lastDay, this.start, this.listQuery.limit).then(res => {
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

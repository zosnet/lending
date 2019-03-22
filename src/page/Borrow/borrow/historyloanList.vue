  <template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
      <div v-if="!loading">
        <div>
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
            @row-click="handleClick"
            stripe>
            <!--标题-->
            <el-table-column width="180" :label="$t('m.borrowing.name')">
              <template slot-scope="scope">
                <img :src="'/static/images/' + scope.row.collateralize_asset.symbol + '.png'" width="24" :onerror="errorImg01" />
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="180" :label="$t('m.borrowsuccess.borrowSum')">
              <template slot-scope="scope">
                <span class="currency">{{scope.row.loan_asset.symbol}}</span>
                <span>{{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.loan_asset.precision) | formatLegalCurrencys(scope.row.loan_asset.symbol, scope.row.loan_asset.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="220" :label="$t('m.borrowsuccess.repaymentAllSum')">
              <template slot-scope="scope">
                <span>{{scope.row.repay_amount_sum | formatLegalCurrency(scope.row.loan_asset.symbol, scope.row.loan_asset.precision)}}</span>
              </template>
            </el-table-column>
            <!--订单状态-->
            <el-table-column width="160" :label="$t('m.page.orderStatus')">
              <template slot-scope="scope">
                <span>{{scope.row.order_state | formatState(1)}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.borrow.pawnNumState')">
              <template slot-scope="scope">
                <span class="currency">{{scope.row.collateralize_asset.symbol}}</span>
                {{scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.collateralize_asset.precision) | formatLegalCurrencys(scope.row.collateralize_asset.symbol, scope.row.collateralize_asset.precision)}}
                <p><span class="secondaryInfo">{{scope.row.order_state | formatState(2)}}</span></p>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import { getStore, setStore } from '/js-utils/storage'
  import {formatUnixTime} from '/js-utils/until'
  export default {
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: 20,
        listQuery: {
          page: 1,
          limit: 7
        },
        refunding: [
        ],
        userName: '',
        userId: '',
        start: 0,
        loading: true,
        historyStartDate: new Date(),
        historyStartDate_sel: new Date(),
        historyEndDate: new Date(),
        historyEndDate_sel: new Date(),
        firstDay: '',
        lastDay: ''
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
          if (state === 13) {
            return window.vm.$t('m.borrowsuccess.hasDel')
          } else if (state === 19) {
            return window.vm.$t('m.borrow.deled')
          } else if (state === 17 || state === 18) {
            return window.vm.$t('m.flow')
          } else if (state === 7 || state === 8 || state === 9) {
            return window.vm.$t('m.borrowsuccess.repayed')
          }
        } else {
          if (state === 13) {
            return window.vm.$t('m.borrowsuccess.confiscated')
          } else if (state === 17 || state === 18 || state === 19) {
            return window.vm.$t('m.returned')
          } else if (state === 7 || state === 8 || state === 9) {
            return window.vm.$t('m.borrowsuccess.thawed')
          }
        }
      }
    },
    computed: {
    },
    methods: {
      handleClick (row) {
        this.$router.push({
          path: 'historyloandetail',
          query: {
            id: row.id,
            accName: row.issuer.name,
            accID: row.issuer.id
          }
        })
      },
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
        ZOSInstance.get_account_loan_history_count(userId, this.firstDay, this.lastDay).then(res => {
          var listNum = res
          if (v === 1) {
            this.start = 0
          } else {
            this.start = (this.listQuery.page - 1) * this.listQuery.limit
          }
          ZOSInstance.get_account_loan_history(userId, this.firstDay, this.lastDay, this.start, this.listQuery.limit).then(res => {
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

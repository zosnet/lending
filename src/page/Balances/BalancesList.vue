  <template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
      <div v-if="!loading">
        <div>
          <el-table
            :data="refunding"
            class="curp"
            style="width: 100%"
            @row-click="handleClick"
            stripe>
            <!--标题-->
             <el-table-column width="100" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.index}}
              </template>
            </el-table-column>
            <el-table-column width="180" :label="$t('m.balance.optype')">
              <template slot-scope="scope">
                {{$t('m.balance_utypes.' + scope.row.utype)}}
              </template>
            </el-table-column>
            <el-table-column width="180" :label="$t('m.balance.opinfo')">
              <template slot-scope="scope">
                <span>{{scope.row.info}}</span>
              </template>
            </el-table-column>
            <el-table-column width="180" :label="$t('m.balance.opbalance')">
              <template slot-scope="scope">
                <span>{{scope.row.asset_op.amount / Math.pow(10, scope.row.precision) | formatLegalCurrencys(scope.row.symbol, scope.row.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" :label="$t('m.balance.curbalance')">
              <template slot-scope="scope">
                <span>{{scope.row.balance  / Math.pow(10, scope.row.precision) | formatLegalCurrency(scope.row.symbol, scope.row.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" :label="$t('m.block.high')">
              <template slot-scope="scope">
                <span>{{scope.row.block_num}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.block.timestamp')">
              <template slot-scope="scope">
                <p><span class="secondaryInfo">{{scope.row.block_time}}</span></p>
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
  import {Apis} from 'zosjs-ws'
  import { getTimezoneDate } from '/js-utils/until'
  import formatAssets from '/js-api/public'
  export default {
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: 20,
        listQuery: {
          page: 1,
          limit: 10
        },
        refunding: [
        ],
        maxindex: 0x7FFFFFFFFFFFFFFF,
        userName: '',
        userId: '',
        start: 0,
        loading: true
      }
    },
    filters: {
      formatSum: sum => {
        return sum.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      },
      formatData: time => {
        return time.toString().replace('T', ' ')
      }
    },
    computed: {
    },
    methods: {
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.loading = true
        this.maxindex = 0x7FFFFFFFFFFFFFFF
        Apis.instance().history_api().exec('get_balance_history_count', [this.$store.state.userDataSid, [], 100000]).then(result => {
          this.total = result
          this.getList(1)
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      getList (v) {
        this.loading = true
        this.listQuery.page = v
        if (v === 1) {
          this.start = 0
        } else {
          this.start = (this.listQuery.page - 1) * this.listQuery.limit
        }
        if (this.total <= 0) {
          this.refunding = []
          this.loading = false
          return
        }
        Apis.instance().history_api().exec('get_balance_history', [this.$store.state.userDataSid, [], 100000, this.maxindex - this.start, this.listQuery.limit]).then(result => {
          for (let index = 0; index < result.length; index++) {
            result[index].block_time = getTimezoneDate(result[index].block_time)
            let assetsArr = formatAssets.formatAssetsID(result[index].asset_op.asset_id)
            if (!assetsArr || assetsArr.length === 0) {
              result[index]['symbol'] = 'ZOS'
              this.refunding[index]['precision'] = 2
            } else {
              result[index]['symbol'] = assetsArr[0].symbol
              result[index]['precision'] = assetsArr[0].precision
            }
          }
          if (v === 1 && result.length > 0) this.maxindex = result[0].index
          this.refunding = result
          this.loading = false
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

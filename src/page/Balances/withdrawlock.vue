  <template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
    <div v-loading="subloading" :element-loading-text="$t('m.params.submit')">
        <div>
          <el-table
            :data="refunding"
            class="curp"
            style="width: 100%"
            stripe>
            <!--标题-->
             <el-table-column width="200" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="200" :label="$t('m.lockasseted.symbol')">
              <template slot-scope="scope">
                 {{scope.row.assetinfo.symbol}}
              </template>
            </el-table-column>
            <el-table-column width="300" :label="$t('m.lockasseted.balance')">
              <template slot-scope="scope">
                <span>{{scope.row.balance.amount / Math.pow(10, scope.row.assetinfo.precision) | formatLegalCurrencys('', scope.row.assetinfo.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" :label="$t('m.lockasseted.canwithdray')">
              <template slot-scope="scope">
                <span>{{scope.row.allow.amount / Math.pow(10, scope.row.assetinfo.precision) | formatLegalCurrencys('', scope.row.assetinfo.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" :label="$t('m.orderList.operation')">
              <template slot-scope="scope">
                <el-button v-if="scope.row.allow.amount>0" size="small" @click="operator(scope.row)">{{$t('m.lockasseted.withdray')}}</el-button>
              </template>
            </el-table-column>

            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
        </div>
        <!--输入资金密码-->
        <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder" :isAppend="true"></password-dialog>
      </div>
    </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import { MessageBox } from 'element-ui'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {
      passwordDialog
    },
    data () {
      return {
        refunding: [
        ],
        userName: '',
        userId: '',
        comfirmPassword: false,
        row: {},
        subloading: false,
        feeZos: 0,
        tr: {},
        loading: 0
      }
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
        this.refresh()
      },
      refresh () {
        this.loading = true
        this.refunding = []
        Apis.instance().db_api().exec('get_vesting_balances_data', [this.userId]).then(result => {
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
      bitlenderLendOrder (data) {
        this.comfirmPassword = false
        if (data) {
          this.subloading = true
          ZOSInstance.vesting_balance_withdraw(this.$store.state.userDataSid, this.row.id, this.row.allow.asset_id, this.row.allow.amount)
            .then(res => {
              this.comfirmPassword = false
              this.tr = res.tr
              this.feeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
              this.dataSubmit()
            })
            .catch((err) => {
              this.subloading = false
              console.log(err)
              this.comfirmPassword = false
            })
        } else {
          this.comfirmPassword = false
        }
      },
      dataSubmit () {
        // 处理广播
        ZOSInstance.broadcastTransaction(this.tr)
          .then((res) => {
            this.subloading = false
            // '提交成功'
            this.$message({
              type: 'success',
              // '提交成功'
              message: this.$t('m.badloans.subSucc')
            })
            this.refresh()
          })
          .catch((err) => {
            this.subloading = false
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
          })
      },
      operator (r) {
        this.row = r
        MessageBox.confirm('', {
          message: this.$t('m.withdrawlock') + ':' + (r.allow.amount / Math.pow(10, r.assetinfo.precision)).toFixed(r.assetinfo.precision) + ',' + this.$t('m.bankcardInfo.confirm') + '?',
          title: this.$t('m.borrow.note'),
          confirmButtonText: this.$t('m.sure'),
          cancelButtonText: this.$t('m.cancel')
        }).then(action => {
          if (action === 'confirm') {
            this.comfirmPassword = true
          }
        })
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

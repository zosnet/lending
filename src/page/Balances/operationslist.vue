  <template>
    <div v-loading="loading > 0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
      <div>
        <div>
          <el-table
            :data="refunding"
            class="curp"
            style="width: 100%"
            @row-click="handleClick"
            stripe>
            <!--标题-->
             <!-- <el-table-column width="120" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column> -->
            <el-table-column width="150" :label="$t('m.balance.optype')">
              <template slot-scope="scope">
                {{getOperTypeName(scope.row.op[0])}}
              </template>
            </el-table-column>
            <el-table-column width="370" :label="$t('m.balance.opinfo')">
              <template slot-scope="scope">
                <span v-if="loading <= 0" >{{scope.row.op[1].info}}</span>
                <span v-if="scope.row.op[1].memoinfo" style="color: red">{{scope.row.op[1].memoinfo}}</span>

              </template>
            </el-table-column>
            <el-table-column width="350" :label="$t('m.balance.trxid')">
              <template slot-scope="scope">
                <span> <a :href="hreftrxid(scope.row)" target="_blank">{{scope.row.trxid}}</a></span>
              </template>
            </el-table-column>
            <el-table-column width="100" :label="$t('m.block.high')">
              <template slot-scope="scope">
                <span> <a :href="hrefblock(scope.row)" target="_blank">{{scope.row.block_num}}</a></span>
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
  import filters from '/js-filters'
  import {ZOSInstance} from 'zos-wallet-js'
  import { getTimezoneDate } from '/js-utils/until'
  import { ChainTypes as GraphChainTypes } from 'zosjs/es'
  // import formatAssets from '/js-api/public'
  export default {
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        allLenderList: {},
        items: {},
        account: {},
        infos: {},
        total: 20,
        listQuery: {
          page: 1,
          limit: 10
        },
        ops: [],
        refunding: [
        ],
        refund: [],
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
      getinfo (op) {
        return op.info
      },
      getOperTypeName (type) {
        let typeStr = this.ops[type]
        if (typeStr) {
          return this.$t('m.transaction.trxTypes.' + typeStr + '.name')
        } else {
          return ''
        }
      },
      getOperMemoInfo (op) {
        if (!op.memo) return
        if (op.memo.nonce === '34359738367') {
          try {
            ZOSInstance.get_noenc_memo(op.memo).then(info => {
              op['memoinfo'] = info
            })
          } catch (errs) {
            op['memoinfo'] = '***'
            console.log(errs)
          }
        } else {
          if (ZOSInstance.accountIsLoginout()) return
          try {
            ZOSInstance.get_decode_memo(this.userId, op.memo).then(info => {
              op['memoinfo'] = info
            })
          } catch (errs) {
            console.log(errs)
            op['memoinfo'] = '***'
          }
        }
      },
      getOperTypeInfo (op, id, srcStr, param) {
        if (this.infos[id]) {
          op['info'] = this.infos[id]
          this.loading--
        } else {
          for (var key in param) {
            if (param[key]) {
              srcStr = srcStr.replace('{' + key + '}', param[key])
            } else {
            }
          }
          this.infos[id] = srcStr
          op['info'] = srcStr
          this.loading--
        }
      },
      formatted_account (op, key, id) {
        if (this.account[id]) {
          op[key] = this.account[id].name
          return op[key]
        } else {
          let _self = this
          return Apis.instance().db_api().exec('get_objects', [[id]]).then(optionRes => {
            let asset = {
              name: optionRes[0].name,
              id: optionRes[0].id
            }
            _self.account[id] = asset
            op[key] = asset.name
            return op[key]
          }).catch(err => {
            console.log(err)
            this.loading--
            return ''
          })
        }
      },
      formatted_number (op, key, assetId, amount) {
        if (this.allLenderList[assetId]) {
          op[key] = filters.formatLegalCurrency3(amount, '', this.allLenderList[assetId].precision)
          return op[key]
        } else {
          let _self = this
          return Apis.instance().db_api().exec('get_objects', [[assetId]]).then(optionRes => {
            let asset = {
              symbol: optionRes[0].symbol,
              precision: optionRes[0].precision,
              id: optionRes[0].id
            }
            _self.allLenderList[assetId] = asset
            op[key] = filters.formatLegalCurrency3(amount, '', asset.precision)
            return op[key]
          }).catch(err => {
            this.loading--
            console.log(err)
            return ''
          })
        }
      },
      async getOperInfo (id, op, trx) {
        if (this.ops[op[0]] === 'transfer') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].from)
          await this.formatted_account(op[1], 'toacc', op[1].to)
          await this.formatted_number(op[1], 'assetamount', op[1].amount.asset_id, op[1].amount.amount)
          if (op[1].from === this.userId || op[1].to === this.userId) this.getOperMemoInfo(op[1])
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.transfer'), {from: op[1].fromacc, amount: op[1].assetamount, to: op[1].toacc})
        } else if (this.ops[op[0]] === 'vesting_balance_withdraw') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].owner)
          await this.formatted_number(op[1], 'assetamount', op[1].amount.asset_id, op[1].amount.amount)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.vest_withdraw'), {issuer: op[1].fromacc, amount: op[1].assetamount, id: op[1].vesting_balance})
        } else if (this.ops[op[0]] === 'gateway_withdraw') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].from)
          await this.formatted_number(op[1], 'assetamount', op[1].withdraw.asset_id, op[1].withdraw.amount)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.gateway_withdraw'), {issuer: op[1].fromacc, amount: op[1].assetamount})
        } else if (this.ops[op[0]] === 'gateway_deposit') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].to)
          await this.formatted_number(op[1], 'assetamount', op[1].deposit.asset_id, op[1].deposit.amount)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.gateway_deposit'), {issuer: op[1].fromacc, amount: op[1].assetamount})
        } else if (this.ops[op[0]] === 'bitlender_lend_order') {
          this.loading++
          console.log(trx)
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_lend_order'), {issuer: op[1].fromacc, id: trx.result[1]})
        } else if (this.ops[op[0]] === 'bitlender_invest') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_invest'), {issuer: op[1].fromacc, id: op[1].order_id})
        } else if (this.ops[op[0]] === 'bitlender_repay_interest') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_repay_interest'), {issuer: op[1].fromacc, id: op[1].order_id, n: op[1].repay_period + 1})
        } else if (this.ops[op[0]] === 'bitlender_overdue_interest') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_overdue_interest'), {issuer: op[1].fromacc, id: op[1].order_id, n: op[1].repay_period + 1})
        } else if (this.ops[op[0]] === 'bitlender_repay_principal') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_repay_principal'), {issuer: op[1].fromacc, id: op[1].order_id})
        } else if (this.ops[op[0]] === 'bitlender_prepayment') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_prepayment'), {issuer: op[1].fromacc, id: op[1].order_id})
        } else if (this.ops[op[0]] === 'bitlender_overdue_repay') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_overdue_repay'), {issuer: op[1].fromacc, id: op[1].order_id})
        } else if (this.ops[op[0]] === 'bitlender_add_collateral') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          await this.formatted_number(op[1], 'assetamount', op[1].collateral.asset_id, op[1].collateral.amount)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_add_collateral'), {issuer: op[1].fromacc, id: op[1].order_id, amount: op[1].assetamount})
        } else if (this.ops[op[0]] === 'bitlender_recycle') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_recycle'), {issuer: op[1].fromacc, id: op[1].order_id})
        } else if (this.ops[op[0]] === 'bitlender_remove_operation') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.bitlender_remove_operation'), {issuer: op[1].fromacc, id: op[1].order_id})
        } else if (this.ops[op[0]] === 'account_coupon') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.account_coupon_operation'), {issuer: op[1].fromacc})
        } else if (this.ops[op[0]] === 'locktoken_create') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.locktoken_create_operation'), {issuer: op[1].fromacc})
        } else if (this.ops[op[0]] === 'locktoken_update') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.locktoken_update_operation'), {issuer: op[1].fromacc, id: op[1].locktoken_id})
        } else if (this.ops[op[0]] === 'locktoken_remove') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.locktoken_remove_operation'), {issuer: op[1].fromacc, id: op[1].locktoken_id})
        } else if (this.ops[op[0]] === 'locktoken_node') {
          this.loading++
          await this.formatted_account(op[1], 'fromacc', op[1].issuer)
          return this.getOperTypeInfo(op[1], id, this.$t('m.transaction.operation.locktoken_node_operation'), {issuer: op[1].fromacc, id: op[1].locktoken_id})
        }
        return ''
      },
      hrefblock (x) {
        return this.$store.state.settingsAPIs.WEB_SITE + '/explorer/block/' + x.block_num
      },
      hreftrxid (x) {
        return this.$store.state.settingsAPIs.WEB_SITE + '/explorer/block/' + x.block_num + '/' + x.trxid
      },
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.ops = Object.keys(GraphChainTypes.operations)
        this.loading = 1
        let operation = [0, 33, 48, 49, 56, 57, 58, 59, 60, 61, 62, 63, 64, 71, 84, 107, 108, 109, 110]
        Apis.instance().db_api().exec('get_accounts_statistics', [[this.$store.state.userDataSid]]).then((resacc) => {
          let start = resacc[0].total_ops - 99
          if (start < 0) start = 0
          Apis.instance().history_api().exec('get_account_history_by_operations', [this.$store.state.userDataSid, operation, start, 100]).then(result => {
            this.total = result.operation_history_objs.length
            this.refund = result.operation_history_objs
            // console.log(result, operation)
            this.getList(1)
            this.loading--
          }).catch(err => {
            console.log(err)
            this.$message.error({
              message: err
            })
            this.loading = 0
          })
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = 0
        })
      },
      getList (v) {
        this.loading++
        this.listQuery.page = v
        if (v === 1) {
          this.start = 0
        } else {
          this.start = (this.listQuery.page - 1) * this.listQuery.limit
        }
        if (this.total <= 0) {
          this.refunding = []
          this.loading--
          return
        }
        let result = this.refund.slice(this.start, this.start + this.listQuery.limit)
        for (let index = 0; index < result.length; index++) {
          result[index].block_time = getTimezoneDate(result[index].block_time)
          this.getOperInfo(result[index].id, result[index].op, result[index])
        }
        this.refunding = result
        this.loading--
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

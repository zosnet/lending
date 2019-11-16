<template>
  <div v-loading="loading > 0" :element-loading-text="$t('m.loading')" style="min-height: 8vw;"  class="jyNVPQ2">
    <el-card >
      <sellinfo :visible="true" @sellpairchange="sellpairchange"   @subinfo="subinfo"></sellinfo>
   </el-card >
     <div class="layout margin-t10">
      <div style="width: 80%;">
       <div v-loading="subloading" :element-loading-text="$t('m.borrow.submiting')">
      <div class="layout" style="height: 420px;">
        <el-card class="box-card"  style="width: 50%;">
          <div slot="header" class="clearfix">
            <span>{{$t('m.sell.buy1')}}({{firstSymbol.symbol}}) </span>
            <a @click="chargeMoney(secondSymbol.id)" class="dHMsll gTHKWe"  style="float: right; text-decoration:underline;">
              <span class="bgdPDV">{{$t("m.rechargeDialog.deposit")}}{{secondSymbol.symbol}} </span>
            </a>
          </div>
          <div class="ZHZZL">
            <sellbase :visible="true" :firstSymbol="firstSymbol" :secondSymbol="secondSymbol" :selltype="'buy'"  ref="buyref" @sellevent="sellevent" @sellloading="sellloading"></sellbase>
          </div>
        </el-card >
        <el-card class="box-card  margin-l10"  style="width: 50%">
          <div slot="header" class="clearfix">
            <span>{{$t('m.sell.sell1')}}({{firstSymbol.symbol}})</span>
            <a @click="chargeMoney(firstSymbol.id)" class="dHMsll gTHKWe"  style="float: right;">
              <span class="bgdPDV">{{$t("m.rechargeDialog.deposit")}}{{firstSymbol.symbol}} </span>
            </a>
          </div>
          <div class="ZHZZL">
            <sellbase :visible="true" :firstSymbol="firstSymbol" :secondSymbol="secondSymbol" :selltype="'sell'" ref="sellref" @sellevent="sellevent" @sellloading="sellloading"></sellbase>
          </div>
        </el-card>
      </div>
      </div>
        <div class="margin-t10" style="width: 100%">
        <el-card class="box-card">
         <el-tabs v-model="activeTabName" @tab-click="handleClicktab" class="margin-lr10">
         <el-tab-pane :label="$t('m.sell.selllist')" name="first">
          <el-table
            :data="refunding1"
            class="curp"
            style="width: 100%"
            @row-click="handleClickRowMyOrder"
            stripe>
             <el-table-column width="110" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="180"  :label="sell_amount">
              <template slot-scope="scope">
                {{_getfirstAmount(scope.row) | formatLegalCurrency2('', firstSymbol.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180"   :label="sell_destamount">
              <template slot-scope="scope">
                {{_getsecondAmount(scope.row) | formatLegalCurrency2('', secondSymbol.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180"   :label="sell_price">
              <template slot-scope="scope">
                <span>{{_getPrice(scope.row)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="190"  :label="$t('m.sell.expricetime')">
              <template slot-scope="scope">
                <span> {{ scope.row.expiration | formatProposalTime}} </span>
              </template>
            </el-table-column>
              <el-table-column width="70"   :label="$t('m.sell.mode')">
              <template slot-scope="scope">
                <span> {{(scope.row.fill_mode & 0x02) > 0 ? $t('m.sell.mode2') : $t('m.sell.mode1')}}  </span>
              </template>
            </el-table-column>
              <el-table-column width="70"   :label="$t('m.sell.mode3')">
              <template slot-scope="scope">
                <span :class="_isSell(scope.row) ? 'sell-text' : 'buy-text'"> {{_isSell(scope.row) ? $t('m.sell.sell1') : $t('m.sell.buy1')}}  </span>
              </template>
            </el-table-column>
             <el-table-column width="70" :label="$t('m.orderList.operation')">
              <template slot-scope="scope">
                <span>
                  <el-button class="btn_small" size="small" @click="removeOrder(scope.row)">{{$t('m.borrow.removeOrder')}}</el-button>
                </span>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
           <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChangeMyOrder" :current-page="listQuery1.page" :page-size="listQuery1.limit" layout="total, prev, pager, next, jumper" :total="total1">
            </el-pagination>
          </div>
          </el-tab-pane>
        <el-tab-pane :label="$t('m.sell.sellhistort')" name="second">
          <el-table
            :data="refunding2"
            class="curp"
            style="width: 100%"
            @row-click="handleClickRowMyHistory"
            stripe>
             <el-table-column width="120" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
           <el-table-column width="180"  :label="sell_amount">
              <template slot-scope="scope">
                {{_getfirstAmount(scope.row) | formatLegalCurrency2('', firstSymbol.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180"   :label="sell_destamount">
              <template slot-scope="scope">
                {{_getsecondAmount(scope.row)  | formatLegalCurrency2('', secondSymbol.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180"   :label="sell_price">
              <template slot-scope="scope">
                <span>{{_getPrice(scope.row)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="190"  :label="$t('m.sell.expricetime')">
              <template slot-scope="scope">
                <span> {{ scope.row.expiration | formatProposalTime}} </span>
              </template>
            </el-table-column>
              <el-table-column width="60"   :label="$t('m.sell.mode')">
              <template slot-scope="scope">
                <span> {{(scope.row.fill_mode & 0x02) > 0 ? $t('m.sell.mode2') : $t('m.sell.mode1')}}  </span>
              </template>
            </el-table-column>
              <el-table-column width="60"   :label="$t('m.sell.mode3')">
              <template slot-scope="scope">
                <span :class="_isSell(scope.row) ? 'sell-text' : 'buy-text'"> {{_isSell(scope.row) ? $t('m.sell.sell1') : $t('m.sell.buy1')}}  </span>
              </template>
            </el-table-column>
            <el-table-column width="60"   :label="$t('m.sell.modetype')">
              <template slot-scope="scope">
                {{_getType(scope.row)}}
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChangeMyHistory" :current-page="listQuery2.page" :page-size="listQuery2.limit" layout="total, prev, pager, next, jumper" :total="total2">
            </el-pagination>
          </div>
        </el-tab-pane>
         <el-tab-pane :label="$t('m.sell.sellfill')" name="third">
          <el-table
            :data="refunding4"
            class="curp"
            style="width: 100%"
            stripe>
           <el-table-column width="170"  :label="'fee'">
              <template slot-scope="scope">
                {{ scope.row.fee.amount / Math.pow(10, scope.row.fee_symbol.precision) | formatLegalCurrency2(scope.row.fee_symbol.symbol, scope.row.fee_symbol.precision) }}
              </template>
            </el-table-column>
            <el-table-column width="210"   :label="'fill_price'">
              <template slot-scope="scope">
                {{ _getPrice1(scope.row) }} {{scope.row.base_symbol.symbol}}/{{scope.row.quote_symbol.symbol}}
              </template>
            </el-table-column>
            <el-table-column width="80"   :label="'order_id'">
              <template slot-scope="scope">
                <span>{{scope.row.order_id}}</span>
              </template>
            </el-table-column>
            <el-table-column width="170"  :label="'pays'">
              <template slot-scope="scope">
                {{ scope.row.pays.amount / Math.pow(10, scope.row.pays_symbol.precision) | formatLegalCurrency2(scope.row.pays_symbol.symbol, scope.row.pays_symbol.precision)  }}
              </template>
            </el-table-column>
            <el-table-column width="170"  :label="'receives'">
              <template slot-scope="scope">
                {{ scope.row.receives.amount / Math.pow(10, scope.row.receives_symbol.precision) | formatLegalCurrency2(scope.row.receives_symbol.symbol, scope.row.receives_symbol.precision)  }}
              </template>
            </el-table-column>
              <el-table-column width="200"   :label="'time'">
              <template slot-scope="scope">
                <span> {{scope.row.time | formatProposalTime}}  </span>
              </template>
            </el-table-column>
              <el-table-column width="60"   :label="'seq'">
              <template slot-scope="scope">
                 {{scope.row.sequence}}
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChangeMatchList" :current-page="listQuery4.page" :page-size="listQuery4.limit" layout="total, prev, pager, next, jumper" :total="total4">
            </el-pagination>
          </div>
        </el-tab-pane>

        </el-tabs>
       </el-card>
       </div>
       </div>
      <div class="margin-l10"  style="width: 20%; min-height: 10vw;"  v-if="loading <= 0">
      <el-card class="box-card">
         <div slot="header" class="clearfix">
        <span>{{$t('m.sell.alllist')}}</span>
        </div>
            <el-table
            :data="refunding3"
            class="curp"
            style="width: 100%"
            @row-click="handleClickRowMatchList"
            stripe>
             <el-table-column width="120"  :label="sell_amount">
              <template slot-scope="scope">
                 <span :class="_isSell(scope.row) ? 'sell-text' : 'buy-text'">{{_getfirstAmount(scope.row) | formatLegalCurrency2('', firstSymbol.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120"   :label="$t('m.sell.price')">
              <template slot-scope="scope">
                 <span :class="_isSell(scope.row) ? 'sell-text' : 'buy-text'">{{_getPrice(scope.row)}}</span>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>

      </el-card>
      </div>
    </div>
    <!--充提-->
    <recharge-coin :assetId="rechargeID"
                   dialogType="deposit"
                   @close='chargeclose'
                   :visible="chargeMoneyVisible"></recharge-coin>
    <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
  </div>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  import {getStore, setStore} from '/js-utils/storage'
  import {Apis} from 'zosjs-ws'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import RechargeCoin from '/path-components/ChargeCoin'
  import sellinfo from '/path-page/Sell/sell/sellinfo.vue'
  import sellbase from '/path-page/Sell/sell/sellbase.vue'
  import formatAssets from '/js-api/public'
  import { MessageBox } from 'element-ui'
  import { getTimezoneDate, formatUnixTime } from '/js-utils/until'
  export default {
    components: {
      YButton, passwordDialog, formatAssets, sellinfo, sellbase, RechargeCoin},
    data () {
      return {
        total1: 0,
        listQuery1: {
          page: 1,
          limit: 7
        },
        refunding1: [],
        refundid1: [],
        total2: 0,
        listQuery2: {
          page: 1,
          limit: 7
        },
        refundid2: [],
        refunding2: [],
        total4: 0,
        listQuery4: {
          page: 1,
          limit: 15
        },
        refunding4: [],
        refunding3: [],
        getDataFlag: false,
        rechargeID: '',
        needAuthor: true,
        priceprecision: 5,
        chargeMoneyVisible: false,
        activeIndex: 0,
        activeChange: [false, false, false, false],
        activeTabName: 'first',
        loading: true,
        subloading: false,
        sell_amount: '',
        sell_destamount: '',
        sell_price: '',
        firstSymbol: {id: undefined, precision: 2},
        secondSymbol: {id: undefined, precision: 2}
      }
    },
    methods: {
      _getPricePrecision (v) {
        if (v.sell_price.base.asset_id === this.firstSymbol.id) {
          v.sell_price.base.precision = this.firstSymbol.precision
          v.sell_price.quote.precision = this.secondSymbol.precision
        } else {
          v.sell_price.base.precision = this.secondSymbol.precision
          v.sell_price.quote.precision = this.firstSymbol.precision
        }
      },
      _getfirstAmount (v) {
        if (v.sell_price.base.asset_id === this.firstSymbol.id) {
          return v.for_sale / Math.pow(10, v.sell_price.base.precision)
        } else {
          let val = v.for_sale * v.sell_price.quote.amount / v.sell_price.base.amount
          return val / Math.pow(10, v.sell_price.quote.precision)
        }
      },
      _isSell (v) {
        return v.sell_price.base.asset_id === this.firstSymbol.id
      },
      _getsecondAmount (v) {
        if (v.sell_price.base.asset_id === this.firstSymbol.id) {
          let val = v.for_sale * v.sell_price.quote.amount / v.sell_price.base.amount
          return val / Math.pow(10, v.sell_price.quote.precision)
        } else {
          return v.for_sale / Math.pow(10, v.sell_price.base.precision)
        }
      },
      _getPrice (v) {
        let price = 0
        if (v.sell_price.base.asset_id !== this.firstSymbol.id) {
          price = (v.sell_price.base.amount * Math.pow(10, v.sell_price.quote.precision)) / (v.sell_price.quote.amount * Math.pow(10, v.sell_price.base.precision))
        } else {
          price = (v.sell_price.quote.amount * Math.pow(10, v.sell_price.base.precision)) / (v.sell_price.base.amount * Math.pow(10, v.sell_price.quote.precision))
        }
        price = price.toFixed(this.priceprecision)
        return price
      },
      _getType (v) {
        if (v.fill_mode & 0x0000010) return '过期'
        if (v.fill_mode & 0x0000020) return '撤单'
        if (v.fill_mode & 0x0000080) return '卖满'
        if (v.fill_mode & 0x0000100) return '买满'
        return ''
      },
      _getPrice1 (v) {
        let price = (v.fill_price.quote.amount * Math.pow(10, v.base_symbol.precision)) / (v.fill_price.base.amount * Math.pow(10, v.quote_symbol.precision))
        price = price.toFixed(this.priceprecision)
        return price
      },
      // 初始化币种，抵押物等
      init () {
        this.loading = 1
        if (this.activeTabName === 'first') this.activeIndex = 0
        if (this.activeTabName === 'second') this.activeIndex = 1
        else this.activeIndex = 0
      },
      sellevent (v) {
        if (v) {
          this.getDataFlag = true
          setTimeout(() => {
            if (this.getDataFlag) {
              this.getDataFlag = false
              this.loading = 1
              this.activeChange = [false, false, false, false]
              this.getDataAllOrders()
              this.getChangeData()
              this.loading--
            }
          }, 6000)
        }
      },
      sellloading (v) {
        this.subloading = v
      },
      // 关闭充币弹窗
      chargeMoney (v) {
        this.rechargeID = v
        this.chargeMoneyVisible = true
      },
      chargeclose () {
        this.chargeMoneyVisible = false
      },
      getChangeData () {
        this.loading++
        if (this.activeIndex === 0 && this.activeChange[0]) this.getDataMyOrder()
        if (this.activeIndex === 1 && this.activeChange[1]) this.getDataMyHistory()
        if (this.activeIndex === 2 && this.activeChange[2]) this.getDataMatchList()
        this.loading--
      },
      handleClickRowMyOrder (v) {
        if (this._isSell(v)) {
          this.$refs.sellref.setdata(this._getfirstAmount(v), this._getsecondAmount(v), this._getPrice(v))
          this.$refs.buyref.setdata(0, 0, this._getPrice(v))
        } else {
          this.$refs.buyref.setdata(this._getfirstAmount(v), this._getsecondAmount(v), this._getPrice(v))
          this.$refs.sellref.setdata(0, 0, this._getPrice(v))
        }
      },
      handleClicktab (v) {
        this.activeIndex = Number(v.index)
        this.getChangeData()
      },
      handleClickRowMyHistory (v) {
      },
      handleClickRowMatchList (v) {
      },
      getPricePrecision () {
        if (this.firstSymbol.precision > this.secondSymbol.precision) this.priceprecision = this.firstSymbol.precision
        else this.priceprecision = this.secondSymbol.precision
        if (this.priceprecision < 5) this.priceprecision = 5
      },
      subinfo (a) {
        this.getDataFlag = false
        this.loading = 1
        if (a.removeLimitOrder || a.addLimitOrder) {
          this.getDataAllOrders()
          this.activeChange[0] = true
        }
        if (a.removeLimitOrder) this.activeChange[1] = true
        if (a.hasFill) this.activeChange[2] = true
        this.getChangeData()
        this.loading--
      },
      sellpairchange (v) {
        this.loading = 1
        this.firstSymbol = v.firstSymbol
        this.secondSymbol = v.secondSymbol
        this.needAuthor = v.needAuthor
        this.$refs.sellref.changesymbol(this.firstSymbol, this.secondSymbol, this.needAuthor)
        this.$refs.buyref.changesymbol(this.firstSymbol, this.secondSymbol, this.needAuthor)
        this.sell_amount = this.$t('m.sell.amount') + this.firstSymbol.symbol
        this.sell_destamount = this.$t('m.sell.destamount') + this.secondSymbol.symbol
        this.sell_price = this.$t('m.sell.price') + this.secondSymbol.symbol + '/' + this.firstSymbol.symbol
        this.getPricePrecision()
        this.getDataMyOrder()
        this.getDataMyHistory()
        this.getDataAllOrders()
        this.getDataMatchList()

        this.getDataTopMarkets()
        this.getDataTrackedGroups()
        this.getDataMarketHistoryBuckets()
        this.getDataTradeHistory()

        this.loading--
      },
      getDataTopMarkets () {
        console.log('get top markets')
        this.loading++
        Apis.instance().db_api().exec('get_top_markets', [7]).then((balance) => {
          console.log('get top markets', balance)
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataTrackedGroups () {
        console.log('get tracked groups')
        this.loading++
        Apis.instance().orders_api().exec('get_tracked_groups', []).then((balance) => {
          console.log('get tracked groups', balance)
          balance.forEach(item => {
            this.loading++
            Apis.instance().orders_api().exec('get_grouped_limit_orders', [this.firstSymbol.id, this.secondSymbol.id, item, null, 7]).then((groups) => {
              console.log('get tracked groups', item, groups)
              this.loading--
            }).catch((error) => {
              console.log(error)
              this.$message({
                message: error,
                type: 'error'
              })
              this.loading--
            })
          })
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataTradeHistory () {
        console.log('get trade history')
        let curDate = new Date(this.$store.state.curDate)
        let startDate = new Date(curDate.getTime() - 24 * 3600 * 1000)
        this.loading++
        Apis.instance().db_api().exec('get_trade_history', [this.firstSymbol.symbol, this.secondSymbol.symbol, formatUnixTime(startDate), formatUnixTime(curDate), 10]).then((balance) => {
          console.log('get_trade_history', balance)
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })

        this.loading++
        Apis.instance().db_api().exec('get_trade_history_by_sequence', [this.firstSymbol.symbol, this.secondSymbol.symbol, 16, formatUnixTime(curDate), 10]).then((balance) => {
          console.log('get_trade_history_by_sequence', balance)
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataMarketHistoryBuckets () {
        console.log('get market history buckets')
        this.loading++
        Apis.instance().history_api().exec('get_market_history_buckets', []).then((balance) => {
          console.log('get market history buckets', balance)
          let curDate = new Date(this.$store.state.curDate)
          let startDate = new Date(curDate.getTime() - 24 * 3600 * 1000)
          balance.forEach(item => {
            this.loading++
            Apis.instance().history_api().exec('get_market_history', [this.firstSymbol.id, this.secondSymbol.id, item, formatUnixTime(startDate), formatUnixTime(curDate)]).then((groups) => {
              console.log('get market history buckets', item, groups)
              this.loading--
            }).catch((error) => {
              console.log(error)
              this.$message({
                message: error,
                type: 'error'
              })
              this.loading--
            })
          })
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataMyOrder () {
        console.log('my limit order')
        this.activeChange[0] = false
        this.loading++
        Apis.instance().db_api().exec('get_account_limit_orders', [this.$store.state.userDataSid, this.firstSymbol.id, this.secondSymbol.id]).then((balance) => {
          this.refundid1 = balance
          this.total1 = balance.length
          this.getListMyOrder(this.listQuery1.page)
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataMyHistory () {
        console.log('my histoty list')
        this.activeChange[1] = false
        this.loading++
        Apis.instance().history_api().exec('get_account_limit_history_count', [this.$store.state.userDataSid, this.firstSymbol.id, this.secondSymbol.id, 20]).then((balance) => {
          this.refundid2 = balance
          this.total2 = balance.length
          this.getListMyHistory(this.listQuery2.page)
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataMatchList () {
        console.log('match list')
        this.activeChange[2] = false
        this.refunding4 = []
        this.loading++
        Apis.instance().history_api().exec('get_fill_order_history', [this.firstSymbol.id, this.secondSymbol.id, 7]).then((balance) => {
          balance.forEach(item => {
            let add = item.op
            if (item.op.fee.asset_id === this.firstSymbol.id) add.fee_symbol = this.firstSymbol
            else add.fee_symbol = this.secondSymbol

            if (item.op.pays.asset_id === this.firstSymbol.id) add.pays_symbol = this.firstSymbol
            else add.pays_symbol = this.secondSymbol

            if (item.op.receives.asset_id === this.firstSymbol.id) add.receives_symbol = this.firstSymbol
            else add.receives_symbol = this.secondSymbol

            if (item.op.fill_price.base.asset_id === this.firstSymbol.id) add.base_symbol = this.firstSymbol
            else add.base_symbol = this.secondSymbol

            if (item.op.fill_price.quote.asset_id === this.firstSymbol.id) add.quote_symbol = this.firstSymbol
            else add.quote_symbol = this.secondSymbol

            add.time = getTimezoneDate(item.time)
            add.sequence = item.key.sequence
            this.refunding4.push(add)
            this.loading--
          })
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getDataAllOrders () {
        console.log('all limit order')
        this.loading++
        Apis.instance().db_api().exec('get_limit_orders', [this.firstSymbol.id, this.secondSymbol.id, 20]).then((balance) => {
          this.refunding3 = balance
          this.total3 = balance.length
          this.refunding3.forEach(item => {
            item.expiration = getTimezoneDate(item.expiration)
            item.create = getTimezoneDate(item.create)
            this._getPricePrecision(item)
          })
          this.loading--
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading--
        })
      },
      getListMyOrder (v) {
        this.listQuery1.page = v
        if (v === 1) {
          this.start1 = 0
        } else {
          this.start1 = (this.listQuery1.page - 1) * this.listQuery1.limit
        }
        if (this.total1 <= 0) {
          this.refunding1 = []
          return
        }
        this.loading++
        let ids = this.refundid1.slice(this.start1, this.start1 + this.listQuery1.limit)
        Apis.instance().db_api().exec('get_objects', [ids]).then(result => {
          this.refunding1 = result
          this.refunding1.forEach(item => {
            item.expiration = getTimezoneDate(item.expiration)
            item.create = getTimezoneDate(item.create)
            this._getPricePrecision(item)
          })
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      getListMyHistory (v) {
        this.listQuery2.page = v
        if (v === 1) {
          this.start2 = 0
        } else {
          this.start2 = (this.listQuery2.page - 1) * this.listQuery2.limit
        }
        if (this.total2 <= 0) {
          this.refunding2 = []
          return
        }
        this.loading++
        let ids = this.refundid2.slice(this.start2, this.start2 + this.listQuery2.limit)
        Apis.instance().history_api().exec('get_account_limit_history', [ids]).then(result => {
          this.refunding2 = result
          this.refunding2.forEach(item => {
            item.expiration = getTimezoneDate(item.expiration)
            item.create = getTimezoneDate(item.create)
            this._getPricePrecision(item)
          })
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      handleCurrentChangeMyOrder (val) {
        if (this.listQuery1.page === val) return
        this.getListMyOrder(val)
      },
      handleCurrentChangeMyHistory (val) {
        if (this.listQuery2.page === val) return
        this.getListMyHistory(val)
      },
      handleCurrentChangeMatchList (val) {
        // if (this.listQuery4.page === val) return
      },
      removeOrder (v) {
        MessageBox.confirm('', {
          message: this.$t('m.borrow.removeOrder') + v.id + ',' + this.$t('m.bankcardInfo.confirm') + '?',
          title: this.$t('m.borrow.note'),
          confirmButtonText: this.$t('m.sure'),
          cancelButtonText: this.$t('m.cancel')
        }).then(action => {
          if (action === 'confirm') {
            this.$refs.buyref.removeSubmit(v.id)
          }
        })
      }
    },
    destroyed () {
      setStore('selltab', this.activeTabName)
    },
    mounted () {
      this.activeTabName = getStore('selltab') ? getStore('selltab') : 'first'
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      this.loading = false
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
<style lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
  .btn_small{
    padding: 9px 0px;
    margin-left: 2px;
  }
  .sell-text{
    color: red!important;
  }
  .buy-text{
    color: rgb(0, 98, 128)!important;
  }
  .layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .jyNVPQ2 {
  background-color: rgb(255, 255, 255)!important;
  background: rgb(255, 255, 255)!important;
  margin: 5px auto 0;
  max-width: 1440px;
}
</style>

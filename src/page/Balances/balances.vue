<template>
  <div   v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div class="jvhNys UMJSF VsGOO account">
      <div class="layout">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <!--数字资产-->
            <span>{{$t('m.orderList.numberZC')}}</span>
          </div>
          <div class="ZHZZL">
            <div v-for="(item,index) in allLenderBalance" :key="index">
              <div class="hgJtCZ1" @click="changePage(index, 1)">
                <div class="item_top">
                  <div class="icon_info">
                    <img width="30" height="30" v-bind:src="`/static/images/${item.symbol.toUpperCase()}.png`" :onerror="errorImg01" />
                    <span>{{item.symbol}}</span>
                  </div>
                  <div class="operation_info">
                    <!--充币-->
                    <el-button  v-if="item.asset_id !== '1.3.0'" size="small" @click="deposit(item.asset_id)">{{$t('m.orderList.depositMoney')}}</el-button>
                    <el-button  v-if="item.asset_id === '1.3.0'" size="small" @click="deposit(item.asset_id)">{{$t('m.orderList.mapMoney')}}</el-button>
                    <!--提币-->
                    <el-button v-if="item.asset_id !== '1.3.0'" size="small" @click="withdraw(item.asset_id)">{{$t('m.orderList.WithdrawMoney')}}</el-button>
                    <!--转账-->
                    <el-button size="small" @click="transfer(item)">{{$t('m.transfer.title')}}</el-button>
                  </div>
                </div>
                <div class="item_middle">
                  <div class="item_middle_block" v-if="Number(item.all_amount)!==item.amount">
                    <span class="item_title">{{$t('m.orderList.totalamount')}}</span>
                    <span class="item_number">{{item.all_amount | formatLegalCurrency('', item.precision)}}</span>
                  </div>
                  <div class="item_middle_block">
                    <span class="item_title">{{$t('m.transfer.KY')}}</span>
                    <span class="item_number">{{item.amount | formatLegalCurrency('', item.precision)}}</span>
                  </div>
                </div>
                <div class="item_info">
                  <span v-if="Number(item.invest_lock)>0">{{$t('m.orderList.invest')}} {{item.invest_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.lending_lock)>0">{{$t('m.orderList.lending')}} {{item.lending_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.vesting_lock)>0">{{$t('m.orderList.vesting')}} {{item.vesting_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.identify_lock)>0">{{$t('m.orderList.identify')}} {{item.identify_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.fixed_lock)>0">{{$t('m.orderList.fixedlock')}} {{item.fixed_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.dy_lock)>0">{{$t('m.orderList.dylock')}} {{item.dy_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.node_lock)>0">{{$t('m.orderList.nodelock')}} {{item.node_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="item.asset_id === '1.3.0'">
                    <span v-if="coupon>0">{{$t('m.orderList.coupon')}} {{ coupon | formatLegalCurrency('', item.precision)}}</span>
                  </span>
                </div>
              </div>
            </div>
            <!--暂无资产-->
            <span v-if="allLenderBalance.length <=0 ">{{$t('m.transfer.nullAsset')}}</span>
          </div>
          <!-- 选择币种 -->
          <div class="feel">
              <div>
                <el-select v-model="selectSymbol" :placeholder="$t('m.transfer.selectCurreny')" size="medium">
                  <el-option
                    v-for="item in allLenderList"
                    :key="item.id"
                    :label="item.symbol"
                    :value="item.id">
                    <img width="20" height="20" v-bind:src="`/static/images/${item.symbol.toUpperCase()}.png`" :onerror="errorImg01">
                    <span class="margin-l20">{{item.symbol}}</span>
                  </el-option>
                </el-select>
              </div>
              <div class="feel_btn">
                <!--充币-->
                <el-button size="medium" @click="deposit(selectSymbol)">{{$t('m.orderList.depositMoney')}}</el-button>
              </div>
          </div>
        </el-card >
        <el-card class="box-card" style="background: #fff">
          <div slot="header" class="clearfix">
            <!--法定资产-->
            <span>{{$t('m.orderList.statutory')}}</span>
          </div>
          <div class="ZHZZL">
            <div v-for="(item,index) in allCashBalance" :key="index">
              <div class="hgJtCZ1" @click="changePage(index, 0)">
                <div class="item_top">
                  <div class="icon_info">
                    <img width="30" height="30" v-bind:src="`/static/images/${item.symbol.toUpperCase()}.png`" :onerror="errorImg01">
                    <span>{{item.symbol}}</span>
                  </div>
                  <div class="operation_info">
                    <!--充值-->
                    <el-button size="small" @click="deposit(item.asset_id)">{{$t('m.orderList.topup')}}</el-button>
                    <!--提现-->
                    <el-button size="small"  @click="withdraw(item.asset_id)">{{$t('m.orderList.Withdraw')}}</el-button>
                  </div>
                </div>
                <div class="item_middle">
                  <div class="item_middle_block" v-if="Number(item.all_amount)!==item.amount">
                    <span class="item_title">{{$t('m.orderList.totalamount')}}</span>
                    <span class="item_number">{{item.all_amount | formatLegalCurrency('', item.precision)}}</span>
                  </div>
                  <div class="item_middle_block">
                    <span class="item_title">{{$t('m.transfer.KY')}}</span>
                    <span class="item_number">{{item.amount | formatLegalCurrency('', item.precision)}}</span>
                  </div>
                </div>
                <div class="item_info">
                  <span v-if="Number(item.invest_lock)>0">{{$t('m.orderList.invest')}} {{item.invest_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.lending_lock)>0">{{$t('m.orderList.lending')}} {{item.lending_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.vesting_lock)>0">{{$t('m.orderList.vesting')}} {{item.vesting_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.identify_lock)>0">{{$t('m.orderList.identify')}} {{item.identify_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.fixed_lock)>0">{{$t('m.orderList.fixedlock')}} {{item.fixed_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.dy_lock)>0">{{$t('m.orderList.dylock')}} {{item.dy_lock | formatLegalCurrency('', item.precision)}}</span>
                  <span v-if="Number(item.node_lock)>0">{{$t('m.orderList.nodelock')}} {{item.node_lock | formatLegalCurrency('', item.precision)}}</span>
                </div>
              </div>
            </div>
            <!--暂无资产-->
            <span v-if="allCashBalance.length <=0 ">{{$t('m.transfer.nullAsset')}}</span>
          </div>
          <!-- 选择币种 -->
          <div class="feel">
              <div>
                <el-select v-model="selectLoanSymbol" :placeholder="$t('m.transfer.selectCurreny')" size="medium">
                  <el-option
                    v-for="item in allCashSelect"
                    :key="item.id"
                    :label="item.symbol"
                    :value="item.id">
                    <img width="20" height="20" v-bind:src="`/static/images/${item.symbol.toUpperCase()}.png`" :onerror="errorImg01">
                    <span class="margin-l20">{{item.symbol}}</span>
                  </el-option>
                </el-select>
              </div>
              <div class="feel_btn">
                <!--充币-->
                <el-button size="medium" @click="deposit(selectLoanSymbol)">{{$t('m.orderList.topup')}}</el-button>
              </div>
          </div>
        </el-card>
      </div>
    </div>

    <div class="jvhNys UMJSF VsGOO margin-t10">
      <div class="bugpkJ">
        <el-tabs @tab-click="handleRecordTabClick">
          <el-button class="update-recode-btn" size="small" @click="refreshRecode()">{{$t('m.orderList.refresh')}}</el-button>
          <el-tab-pane :label="$t('m.orderList.gatewayRecords')">
            <el-card style="border:none;">
              <div>
                <div class="panel-body no-padding">
                  <el-table
                    v-loading="recordLoading"
                    :data="showrecordList"
                    class="curp"
                    style="width: 100%"
                    stripe
                    @row-click="handleClick">
                    <el-table-column :label="$t('m.orderList.oper')">
                      <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.orderType=='TOPUP'">{{$t('m.orderList.topup')}}</el-tag>
                        <el-tag type="info" v-if="scope.row.orderType=='TOPUPCOIN'">{{$t('m.orderList.depositMoney')}}</el-tag>
                        <el-tag type="warning" v-if="scope.row.orderType=='WITHDRAW'">{{$t('m.orderList.Withdraw')}}</el-tag>
                        <el-tag v-if="scope.row.orderType=='WITHDRAWCOIN'">{{$t('m.orderList.WithdrawMoney')}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.orderList.symbol')">
                      <template slot-scope="scope">
                        <span>{{scope.row.coin}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.orderList.operNum')">
                      <template slot-scope="scope">
                        <span>{{scope.row.amount}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="160" :label="$t('m.orderList.operTime')">
                      <template slot-scope="scope">
                        <span>{{scope.row.time | formatDateStr}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.orderList.operState')">
                      <template slot-scope="scope">
                        <span v-if="scope.row.orderType=='TOPUP'">{{$t('m.orderList.topup_'+scope.row.status)}}</span>
                        <span v-if="scope.row.orderType=='TOPUPCOIN'">{{$t('m.orderList.chargeMoney_'+scope.row.status)}}</span>
                        <span v-if="scope.row.orderType=='WITHDRAW'">{{$t('m.orderList.withdraw_'+scope.row.status)}}</span>
                        <span v-if="scope.row.orderType=='WITHDRAWCOIN'">{{$t('m.orderList.withdrawMoney_'+scope.row.status)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.params.gateway')">
                      <template slot-scope="scope">
                        <span>{{scope.row.gatewayName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('m.transfer.gatewayContacts')">
                      <template slot-scope="scope">
                          <div>
                            <el-button
                            size="mini"
                            @click="handleGatewayContacts(scope.row)">{{$t('m.orderList.check')}}</el-button>
                          </div>
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
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="$t('m.orderList.kycRecords')" name="kycRecords">
            <el-card style="border:none;">
              <div>
                <div class="panel-body no-padding">
                  <el-table
                    v-loading="kycRecordLoading"
                    :data="kycStatusList"
                    class="curp"
                    style="width: 100%"
                    stripe
                    @row-click="handleClick">
                    <el-table-column :label="$t('m.orderList.authorid')">
                      <template slot-scope="scope">
                        <span>{{scope.row.authorid}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.orderList.operState')">
                      <template slot-scope="scope">
                        <span v-if="scope.row.status==='0'">{{$t('m.authentication.kycState1')}}</span>
                        <span v-else-if="scope.row.status==='2'">{{$t('m.authentication.kycState3')}}:{{scope.row.remark}} </span>
                        <span v-else>{{$t('m.authentication.kycState2')}}</span>
                        <span v-if="scope.row.remark"> : {{scope.row.remark}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="120" :label="$t('m.orderList.operTime')">
                      <template slot-scope="scope">
                        <span>{{ _getTimezoneDate(scope.row.createdtime) | formatDateStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.authentication.name')">
                      <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.authentication.IDsType')">
                      <template slot-scope="scope">
                        <span>{{scope.row.ictype === '1' ? $t('m.authentication.IDCard'):$t('m.authentication.passport')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.authentication.IDsCode')">
                      <template slot-scope="scope">
                        <span>{{scope.row.icno}}</span>
                      </template>
                    </el-table-column>
                    <div slot="empty">
                      <p>{{$t('m.noData')}}</p>
                    </div>
                  </el-table>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--转账-->
    <transfer v-if="dialogVisibleTransfer" :transferId="transferId" :visible="dialogVisibleTransfer" @closeTransfer="closeTransfer"></transfer>
    <!--充提-->
    <recharge-coin :visible="gatewayWebDialog" :defGateway="exchangeGateway" :dialogType="gatewayWebDialogType" :recordOrder="recordOrder" :assetId="withdrawAssetId" :gatewayId="getwayId"  @close='rechargeclose' ></recharge-coin>
    <!--联系方式提示-->
    <el-dialog
      :title="$t('m.transfer.gatewayContacts')"
      :visible.sync="gatewayContactsDialog"
      width="30%"
      :before-close="handleClose">
      <div v-if="gatewayContacts[gatewayContactsShowKey] && gatewayContacts[gatewayContactsShowKey].length !== 0" style="margin-left: 20px;
            margin-top: 10px;
            color: rgb(144, 147, 153);">
        <div v-for="(item, index) in gatewayContacts[gatewayContactsShowKey]" :key="index">
          <span>{{$t(('m.gatewayContactType.' + item.contactType))}}:</span>
          <span v-for="(contactInfo, index1) in item.infoList" :key="index1">
              {{contactInfo}} &nbsp;
            </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--关 闭-->
          <el-button @click="gatewayContactsDialog = false">{{$t('m.close')}}</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>
  // import {Apis} from 'zosjs-ws'
  import RechargeCoin from '/path-components/ChargeCoin'
  import {Apis} from 'zosjs-ws'
  import {ZOSInstance} from 'zos-wallet-js'
  // import { formatProposalTime1 } from '/js-utils/until'
  import {ChainStore} from 'zosjs/es'
  import {getLocalStore, setLocalStore, removeLocalStore} from '/js-utils/storage'
  import {orderRecordList, getGatewayContact, getkycStatusList} from '/js-api/index'
  export default {
    components: {
      RechargeCoin,
      'transfer': () => import('/path-components/Balances/transfer')
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        loading: true,
        allCashList: [],
        allLenderList: [],
        allCashBalance: [],
        allLenderBalance: [],
        allCashSelect: [],
        allLenderSelect: [],
        transferId: null,
        loadCount: 0,
        dialogVisibleTransfer: false,
        choosePageBit: -1,
        choosePageCash: -1,
        // SlectValue: '',
        listQuery: {
          page: 1,
          limit: 10
        },
        rechargeDialog: false,
        rechargeAddress: '',
        coupon: 0,
        withdrawAssetId: '',
        getwayId: undefined,
        recordList: [],
        showrecordList: [],
        recordOrder: false,
        gatewayContacts: [],
        gatewayContactsShowKey: '',
        gatewayContactsDialog: false,
        recordLoading: false,
        gatewayWebDialog: false,
        gatewayDoing: false,
        gatewayWebDialogType: '',
        selectSymbol: '',
        selectLoanSymbol: '',
        exchangeGateway: {},
        total: 0,
        kycRecordLoading: false,
        kycStatusList: false
      }
    },
    filters: {
    },
    methods: {
      // 导航栏文字样式改变
      _getTimezoneDate (x) {
        return ZOSInstance.getTimezoneDateByUnix(x)
      },
      changePage (v, t) {
        if (t === 0) this.choosePageCash = v
        else this.choosePageBit = v
      },
      transfer (asset) {
        this.transferId = asset.asset_id
        this.dialogVisibleTransfer = true
      },
      closeTransfer () {
        this.dialogVisibleTransfer = false
      },
      rechargeclose (update, updateKycRecode) {
        this.gatewayWebDialog = false
        this.exchangeGateway = undefined
        this.recordOrder = false
        if (update) this.updateRecordList()
        if (updateKycRecode) this.loadkycStatusList()
      },
      withdraw (assetId) {
        if (assetId === '') {
          this.$message({
            message: this.$t('m.transfer.selectCurreny'),
            type: 'error'
          })
          return
        }
        this.getwayId = undefined
        this.withdrawAssetId = assetId
        this.gatewayWebDialogType = 'withdraw'
        this.recordOrder = false
        this.exchangeGateway = undefined
        this.gatewayWebDialog = true
      },
      deposit (assetId) {
        if (assetId === '') {
          this.$message({
            message: this.$t('m.transfer.selectCurreny'),
            type: 'error'
          })
          return
        }
        this.getwayId = undefined
        this.withdrawAssetId = assetId
        this.gatewayWebDialogType = 'deposit'
        this.recordOrder = false
        this.exchangeGateway = undefined
        this.gatewayWebDialog = true
      },
      getRecordList (v) {
        var listNum = this.total
        this.listQuery.page = v
        let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
        if (listNum === 0) {
          this.showrecordList = []
        } else if (listNum <= this.listQuery.page) {
          this.showrecordList = this.recordList
        } else {
          this.showrecordList = this.recordList.slice(startIndex, startIndex + this.listQuery.limit)
        }
      },
      saveOrders (array) {
        for (let index = 0; index < array.length; index++) {
          if (array[index].url === '') array.splice(index--, 1)
        }
        setLocalStore(this.$store.state.userName + 'gatewayOrders', array)
      },
      isSameGateway (v) {
        if (v.length <= 0) return false
        let a = this.recordList.filter((val) => {
          return v[0].orderNo === val.orderNo && ZOSInstance.getTimezoneDateByGmt(v[0].time) === val.time
        })
        return a.length > 0
      },
      isSameKyc (v) {
        if (v.length <= 0) return false
        let a = this.kycStatusList.filter((val) => {
          return v[0].id === val.id && v[0].createdtime === val.createdtime
        })
        return a.length > 0
      },
      loadRecordList (v) {
        this.recordLoading = true
        this.recordList = []
        let orderStr = getLocalStore(this.$store.state.userName + 'gatewayOrders')
        let gatewayOrders = orderStr !== null ? JSON.parse(orderStr) : []
        let userid = this.$store.state.userDataSid
        if (gatewayOrders.length > 0) {
          let loadCount = 0
          let saveO = false
          gatewayOrders.forEach(element => {
            if (element.url && element.url.length > 3) {
              orderRecordList(element.url, {userNo: userid}).then(res => {
                let array = res.ordersList
                if (res.ordersList === undefined || res.ordersList.length <= 0 || this.isSameGateway(res.ordersList)) {
                  element.url = ''
                  saveO = true
                  array = []
                }
                for (let index = 0; index < array.length; index++) {
                  let order = array[index]
                  order['url'] = element.url
                  order.time = ZOSInstance.getTimezoneDateByGmt(order.time)
                  order['gatewayName'] = ''
                  ZOSInstance.get_account(order.gatewayId).then(acc => {
                    order.gatewayName = acc.get('name')
                  }).catch(err => {
                    console.log(err)
                  })
                  let contactKey = order.gatewayId
                  if (contactKey !== '' && !this.gatewayContacts[contactKey]) {
                    this.gatewayContacts[contactKey] = true
                    getGatewayContact(element.url, {ceGatewayId: order.gatewayId}).then(res1 => {
                      this.gatewayContacts[contactKey] = res1.contacts
                    })
                  }
                  this.recordList.push(order)
                }
                loadCount++
                if (loadCount === gatewayOrders.length) {
                  this.recordLoading = false
                  this.recordList.sort(function (a, b) {
                    let m = new Date(a.time).getTime()
                    let n = new Date(b.time).getTime()
                    return n - m
                  })
                  this.total = this.recordList.length
                  this.getRecordList(1)
                  if (saveO) this.saveOrders(gatewayOrders)
                }
              }).catch(err => {
                console.log(err)
                loadCount++
                if (loadCount === gatewayOrders.length) {
                  this.recordLoading = false
                  this.recordList.sort(function (a, b) {
                    let m = new Date(a.time).getTime()
                    let n = new Date(b.time).getTime()
                    return n - m
                  })
                  this.total = this.recordList.length
                  this.getRecordList(1)
                }
              })
            }
          })
        } else {
          this.recordLoading = false
        }
      },
      updateRecordList () {
        this.listQuery.page = 1
        this.loadRecordList()
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.getRecordList(val)
      },
      handleClick (row, event, column) {
        if (row.orderType === 'TOPUP' && row.status === '1') {
          this.getwayId = row.gatewayId
          this.withdrawAssetId = row.assetId
          this.gatewayWebDialogType = 'deposit'
          this.recordOrder = true
          this.exchangeGateway = undefined
          this.gatewayWebDialog = true
        }
      },
      handleGatewayContacts (row) {
        event.cancelBubble = true
        if (this.gatewayContacts[row.gatewayId] !== true) {
          this.gatewayContactsShowKey = row.gatewayId
          this.gatewayContactsDialog = true
        }
      },
      removeAsset (v = this.allCashSelect, a = '1.3.0') {
        for (var index = 0; index < v.length; index++) {
          if (v[index].id === a) {
            v.splice(index, 1)
            break
          }
        }
      },
      loadBalanceInfo () {
        let allCashBalance = []
        let allLenderBalance = []
        this.allCashSelect = this.allCashList
        this.allLenderSelect = this.allLenderList
        ChainStore.getLoginAccountBalanceChange(2)
        this.removeAsset(this.allLenderSelect, '1.3.0')
        ZOSInstance.get_account_allbalances(this.$store.state.userDataSid, 0xFFFF).then(res => {
          this.coupon = res.coupon
          for (var index = 0; index < res.balances.length; index++) {
            let element = res.balances[index]
            let data = element
            data['amount'] = element.amount
            data['isShow'] = true
            data['symbol'] = element.symbol
            data['precision'] = element.precision
            data['asset_id'] = element.asset_id
            data['uasset_property'] = element.uasset_property
            if ((element.uasset_property & 0x00000001) === 0x00000001) {
              allCashBalance.push(data)
              this.removeAsset(this.allCashSelect, element.asset_id)
            } else {
              allLenderBalance.push(data)
              this.removeAsset(this.allLenderSelect, element.asset_id)
            }
          }
          this.allCashBalance = allCashBalance
          this.allLenderBalance = allLenderBalance
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.$message({
            message: this.$t('m.httpUtils.warning'),
            type: 'error'
          })
          this.loading = false
        })
      },
      doExchange () {
        if (this.gatewayWebDialog) return
        if (this.gatewayDoing) return
        if (this.$store.state.exchangegateway === undefined) return
        this.gatewayDoing = true
        this.exchangeGateway = undefined
        Apis.instance().db_api().exec('get_objects', [[this.$store.state.exchangegateway]]).then(res => {
          if (res && res.length > 0) {
            this.exchangeGateway = {
              accountId: res[0].gateway_account,
              assetId: res[0].allowed_assets[0],
              assetProperty: 86,
              authorId: res[0].def_auth,
              authourAccount: undefined,
              authourName: undefined,
              authourUrl: undefined,
              depositAmount: 0,
              enable: true,
              gatewayid: res[0].id,
              name: '',
              precision: 8,
              realSymbol: 'USDT',
              symbol: 'USDT',
              url: res[0].url,
              withdrawAmount: 0
            }
            this.withdrawAssetId = this.exchangeGateway.assetId
            this.getwayId = this.exchangeGateway.gatewayid
            this.recordOrder = false
            Apis.instance().db_api().exec('get_objects', [[res[0].gateway_account]]).then(res => {
              if (res && res.length > 0) {
                this.exchangeGateway.name = res[0].name
                this.gatewayWebDialog = true
                this.gatewayWebDialogType = 'deposit'
                this.gatewayDoing = false
              }
            }).catch(err => {
              console.log(err)
              this.gatewayDoing = false
              this.$message({
                message: err,
                type: 'error'
              })
            })
          }
        }).catch(err => {
          console.log(err)
          this.gatewayDoing = false
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      updateBalance () {
        if (this.$store.state.userDataSid && ChainStore.getLoginAccountBalanceChange(2)) {
          this.loadBalanceInfo()
        }
      },
      init () {
        this.loading = true
        ZOSInstance.getCashBitAssetList().then(res => {
          this.allCashList = res.cash_list
          this.allLenderList = res.bit_list
          this.loadRecordList()
          this.loadBalanceInfo()
          this.loadAllRecodeUrl()
          if (this.$route.query.type !== undefined && this.$route.query.type === 'exchange') this.doExchange()
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      loadkycStatusList () {
        this.kycRecordLoading = true
        this.kycStatusList = []
        let statusStr = getLocalStore(this.$store.state.userName + 'kycStatus')
        let kycStatus = statusStr !== null ? JSON.parse(statusStr) : []
        let userid = this.$store.state.userDataSid
        if (kycStatus && kycStatus.length > 0) {
          let loadCount = 0
          let saveO = false
          kycStatus.forEach(element => {
            getkycStatusList(element.url, {chainid: userid}).then(res => {
              if (res.ret_code === '1') {
                let array = res.list
                if (array.length <= 0 || this.isSameKyc(res.list)) {
                  element.url = ''
                  saveO = true
                  array = []
                }
                this.kycStatusList = this.kycStatusList.concat(array)
              }
              loadCount++
              if (loadCount === kycStatus.length) {
                this.kycRecordLoading = false
                if (saveO) {
                  for (let index = 0; index < kycStatus.length; index++) {
                    if (kycStatus[index].url === '') kycStatus.splice(index--, 1)
                  }
                  setLocalStore(this.$store.state.userName + 'kycStatus', kycStatus)
                }
              }
            }).catch(err => {
              console.log(err)
              loadCount++
              if (loadCount === kycStatus.length) {
                this.kycRecordLoading = false
                for (let index = 0; index < kycStatus.length; index++) {
                  if (kycStatus[index].url === '') kycStatus.splice(index, 1)
                }
                setLocalStore(this.$store.state.userName + 'kycStatus', kycStatus)
              }
            })
          })
        } else {
          this.kycRecordLoading = false
        }
      },
      handleRecordTabClick (tab, event) {
        if (tab.name === 'kycRecords') {
          this.loadkycStatusList()
        }
      },
      loadAllRecodeUrl () {
        let gatewayOrders = getLocalStore(this.$store.state.userName + 'gatewayOrders')
        if (gatewayOrders && gatewayOrders !== '') {
          return
        }
        let kycStatus = getLocalStore(this.$store.state.userName + 'kycStatus')
        if (kycStatus && kycStatus !== '') {
          return
        }
        let assetsIdArray = []
        this.allLenderList.forEach(element => {
          assetsIdArray.push(element.id)
        })
        this.allCashList.forEach(element => {
          assetsIdArray.push(element.id)
        })
        this.allCashBalance.forEach(element => {
          assetsIdArray.push(element.asset_id)
        })
        this.allLenderBalance.forEach(element => {
          assetsIdArray.push(element.asset_id)
        })
        let removeIndex = assetsIdArray.indexOf('1.3.0')
        if (removeIndex > -1) {
          assetsIdArray.splice(removeIndex, 1)
        }

        let loadCount = 0
        let gatewayUrlArray = []
        let kycUrlArray = []
        let saveRecode = () => {
          for (let index = 0; index < gatewayUrlArray.length; index++) {
            gatewayUrlArray[index] = {url: gatewayUrlArray[index] + '/zos-gateway/'}
          }
          for (let index = 0; index < kycUrlArray.length; index++) {
            kycUrlArray[index] = {url: kycUrlArray[index] + '/zos-kyc/'}
          }
          setLocalStore(this.$store.state.userName + 'gatewayOrders', gatewayUrlArray)
          setLocalStore(this.$store.state.userName + 'kycStatus', kycUrlArray)
          this.loadRecordList()
          this.loadkycStatusList()
        }
        assetsIdArray.forEach(assetsId => {
          ZOSInstance.get_gateway(this.$store.state.admin_id, assetsId).then(res => {
            loadCount++
            let gateNum = res.length
            // console.log('assetsIdArray', this.$store.state.admin_id, assetsId, gateNum)
            if (gateNum > 0) {
              for (var index = 0; index < res.length; index++) {
                var element = res[index]
                if (element.gateway_url !== '' && element.gateway_url !== undefined) {
                  if (element.gateway_url.charAt(element.gateway_url.length - 1) !== '/') {
                    element.gateway_url = element.gateway_url + '/'
                  }
                  if (gatewayUrlArray.indexOf(element.gateway_url) === -1) {
                    gatewayUrlArray.push(element.gateway_url)
                  }
                }
                if (element.author_url !== '' && element.author_url !== undefined) {
                  if (element.author_url.charAt(element.author_url.length - 1) !== '/') {
                    element.author_url = element.author_url + '/'
                  }
                  if (kycUrlArray.indexOf(element.author_url) === -1) {
                    kycUrlArray.push(element.author_url)
                  }
                }
              }
            }
            if (loadCount === assetsIdArray.length) {
              saveRecode()
            }
          }).catch(err => {
            console.log(err)
            loadCount++
            if (loadCount === assetsIdArray.length) {
              saveRecode()
            }
          })
        })
      },
      refreshRecode () {
        removeLocalStore(this.$store.state.userName + 'gatewayOrders')
        removeLocalStore(this.$store.state.userName + 'kycStatus')
        this.loadAllRecodeUrl()
      }
    },
    computed: {
    },
    destroyed () {
      ChainStore.unsubscribe(this.updateBalance)
      this.$root.eventHub.$off('exchange')
    },
    mounted () {
      this.loading = true
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
      ChainStore.subscribe(this.updateBalance)
      this.$root.eventHub.$on('exchange', _ => {
        this.doExchange()
      })
    }
  }
</script>
<style scoped lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
  .kOArsS {
    border-left: 1px solid rgb(218, 225, 233);
  }
  .dialogP{
    >div{
      line-height: 40px;
      height: 40px;
    }
  }
  .hVLRn{
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border-bottom-left-radius: 4px;
    background-color: rgb(255, 255, 255);
    cursor: pointer;
    color: rgb(155, 166, 178);
    font-weight: 500;
    padding: 18px;
    border-top: 1px solid rgb(218, 225, 233);
  }
  .cAuZvH {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }
  .fAptwkW {
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
  }
  .hsOUBK {
    max-height: 100%;
    overflow: hidden;
  }
  .bFuKMc{
    height: 54px;
    padding: 0px 20px;
    border-bottom: 1px solid rgb(218, 225, 233);
  }
  .ZHZZL{
    overflow-y: scroll;
    position: relative;
    height: 50vh;
  }
  .ctPIHk {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    flex-direction: row;
    flex: 1 1 auto;
  }
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
    flex: 0 0 54px;
    padding: 0px 20px;
    border-bottom: 1px solid rgb(218, 225, 233);
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  .columnSZZC{
    background-color: white;
    >div{
      border-bottom: 1px solid rgb(218, 225, 233);
      min-height: 137px;
    }
  }

  .gcOhUY {
    position: relative;
    padding-bottom: 58px;
    flex: 0 0 360px;
  }

  .jvBcNsR{
    display: flex;
    flex-direction: row;
  }
  .jJcDFA {
    margin-top: -1px;
    /*width: 1px;*/
    background-color: rgb(6, 103, 208);
    flex: 0 0 1px;
  }
  .hXQVcf {
    overflow-y: scroll;
  }
  .jnpnHF {
    display: flex;
    flex-direction: column;
  }
  .hXQVcf {
    overflow-y: scroll;
  }
  .inEAkf {
    outline: none;
  }
  a, [role="button"] {
    cursor: pointer;
    color: rgb(6, 103, 208);
    text-decoration: none;
  }
  .dosgL {
    flex: 0 0 1px;
  }

  .gYBgJm {
    padding: 20px 16px 16px;
  }
  .btVfat {
    padding: 16px 16px 16px 0px;
  }
  .cAuZvH {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }
  .cJptbt {
    margin-bottom: 4px;
    max-width: 275px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .hSTCvS {
    display: inline-block;
    font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: rgb(78, 92, 110);
  }
  .hgJtCZ1{
    margin-top: 10px;
    padding: 16px;
    min-width: 360px;
    border-radius:4px;
    border:1px solid #B7BEC6;
    .item_top{
      // display:flex;
      // margin: 16px 0;
      // height:35px;
      // line-height:35px;
      .icon_info{
        // flex: 1;
        display: inline-block;
        min-width: calc(50% - 16px);
        height: 35px;
        line-height: 35px;
        img{
          margin-top: -8px;
        }
        span{
          font-size:18px;
          color:#191A5E;
          font-weight:500;
          font-family:PingFangSC-Medium,PingFangSC;
        }
      }
      .operation_info{
        // flex: 1;
        display: inline-block;
        min-width: calc(50% - 16px);
        height: 35px;
        line-height: 35px;
      }
    }
    .item_middle{
      // display:flex;
      .item_middle_block{
        // flex: 1;
        display: inline-block;
        min-width: calc(50% - 16px);
        height: 35px;
        line-height: 35px;
        .item_title{
          font-size:14px;
          color:#191A5E;
          font-weight:500;
          font-family:PingFangSC-Medium,PingFangSC;
          
        }
        .item_number{
          font-size:22px;
          color:#31364F;
          font-weight:400;
          font-family:Bebas-Regular,Bebas;
        }
      }
    }
    .item_info{
      span{
        display: inline-block;
        margin-right: 10px;
        height: 17px;
        line-height: 17px;
        font-size: 12px;
        color:#797C89;
        font-weight:400;
        font-family:PingFangSC-Regular,PingFangSC;
      }
    }
  }
  .hgjLjo {
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-top: 16px;
  }
  .ccMVUG {
    display: inline-block;
    font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: rgb(78, 92, 110);
  }
  .bugpkJ {
    padding: 16px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    background-color: rgb(255, 255, 255);
    height: 100%;
    max-height: 100%;
    flex: 1 1 0%;
    overflow: hidden;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(218, 225, 233);
    border-image: initial;
  }
  .jvhNys {
    flex: 0 0 calc(100vh - 200px);
  }
  .UMJSF {
    background-color: rgb(244, 247, 250);
  }
  .VsGOO {
    -webkit-box-align: center;
    align-items: center;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix{
    span{
      font-size:14px;
      color: #191A5E;
      font-weight:500;
      font-family:PingFangSC-Medium,PingFangSC;
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 49.5%;
    .feel{
      margin-top: 16px;
      .feel_btn{
        flex: 1;
        margin-left: 16px;
        .el-button{
          color:#fff;
          background-color:#5D5DFF;
          border-radius:4px;
        }
      }
    }
  }
  .lenderlistTop {
    background-color: #516AF6
  }

  .addAsset{
    border-top: 1px solid rgb(218, 225, 233);
  }
  #dialog-account .el-dialog__body{
    overflow: auto !important;
    height: 60vh !important;
  }
  .account .el-card{
    background: #fff!important;
  }
  .update-recode-btn{
    position: absolute;
    top: 5px;
    right: 50px;
    height: 30px;
    width: 80px;
  }
</style>

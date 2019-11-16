<template>
  <div  slot="content" class="container-params" v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div   style="flex:1"></div>
    <div v-if="loading <= 0 ">
     <dt class="lh40 feel">
      <div style="flex:1"></div>
      <!--提交-->
      <el-button type="primary" v-if="tableDataParamsShow && canEdit" @click="paramsEdit()">
      {{$t('m.params.update')}}
      </el-button>
      <div v-if="!tableDataParamsShow">
        <el-button type="primary" :disabled="!isEdit" @click="sumbmitFeeders">{{$t('m.params.submit')}} </el-button>
        <el-button @click="paramsCancel">{{$t('m.cancel')}}</el-button>
      </div>
     </dt>
    </div>
    <dl class="feeder-dl">
      <dd class="feel">
        <!--喂价模式-->
        <span>{{$t('m.params.feederFlag')}}:</span>
         <el-radio-group v-model="checks" class="margin-t10 margin-l10" v-if="!tableDataParamsShow">
         <el-radio v-for="(item, i) in checksArr" :label="item.label" :key="i">{{item.value}}</el-radio>
         </el-radio-group>
         <el-radio-group v-model="checks" class="margin-t10 margin-l10" v-else>
         <el-radio v-for="(item, i) in checksArr" :label="item.label" :key="i" :disabled="feedOption.flags===i ? false: true">{{item.value}}</el-radio>
      </el-radio-group>
      </dd>
      <!--喂价人-->
      <dd><span>{{$t('m.params.getFeeders')}}</span></dd>
          <dd>
          <el-table
            :data="getFeeders"
                  stripe
                  style="width: 100%">
                  <!--序号-->
                  <el-table-column
                    type="index"
                    :label="$t('m.params.index')"
                    width="200">
                  </el-table-column>
                  <!--账号-->
                  <el-table-column
                    prop="userName"
                    :label="$t('m.params.account')"
                    >
                  </el-table-column>
                  <!--操作-->
                  <el-table-column
                    :label="$t('m.orderList.oper')"
                    width="200"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">
                        <!--删除-->{{$t('m.params.del')}}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>
              <dd class="feel margin-t40 feeder" v-if="!tableDataParamsShow">
                <!--请输入账号-->
                <el-input v-model="addFeeder" :placeholder="$t('m.params.enter')" style="width: 80%" @keyup.native="addFeeder = addFeeder.replace(/[^\w\.\-\/]/ig,'')"></el-input>
                <el-button type="primary" @click="addFeedProducers" class="margin-l20" :disabled="addFeeder?false:true">{{$t('m.params.addFeeder')}}</el-button>
              </dd>
              <dt class="margin-t40 feel">
                <span class="f16">
                <!--喂价-->{{$t('m.params.price')}}
                </span>
              </dt>
              <dd class="feeder">
                <!--请选择-->
                <span>{{$t('m.pChose')}}:</span>
                <el-select v-model="selectedTradingVal" value-key="id" :placeholder="$t('m.transfer.XZBZ')"
                           @change="_selectedTrading"
                           class="margin-l10">
                  <el-option
                    v-for="item in selectedTrading"
                    :key="item.id"
                    :label="item.symbol"
                    :value="item">
                  </el-option>
                </el-select>
                <span class="margin-l10">{{feedSymbol + '  ' + $t('m.params.isFeed')}}: {{feedPrice}}</span>
                <el-button @click="invertFeed">{{$t('m.params.invert')}}</el-button>
              </dd>
              <dd class="margin-t10">
                <!--喂价数据-->
               <span>{{$t('m.params.data')}}</span>
                <el-table
                  :data="feedData"
                  style="width: 100%">
                  <!--发布人-->
                  <el-table-column
                    prop="username"
                    :label="$t('m.params.people')"
                    width="180">
                  </el-table-column>
                  <!--清算价-->
                  <el-table-column
                    prop="clearingPrice"
                    :label="$t('m.params.clearing')+'('+feedSymbol+')'"
                    width="180">
                  </el-table-column>
                  <!--手续费汇率-->
                  <el-table-column
                    prop="coreRate"
                    :label="$t('m.params.handling')+'('+coreSymbol+')'">
                  </el-table-column>
                  <!--维持抵押率-->
                  <el-table-column
                    prop="keep"
                    width="120"
                    :label="$t('m.params.mortgage')">
                  </el-table-column>
                  <!--强制平仓比例上限-->
                  <el-table-column
                    prop="unwinding"
                    width="150"
                    :label="$t('m.params.limit')">
                  </el-table-column>
                  <!--发布时间-->
                  <el-table-column
                    prop="time"
                    :label="$t('m.investingdetail.FBSJ')">
                    <template slot-scope="scope">
                      {{scope.row.time | formatDateStr}}
                    </template>
                  </el-table-column>
                </el-table>
      </dd>
    </dl>
    <!--修改喂价人提案-->
    <el-dialog
      :title="$t('m.params.feederProposal')"
      :visible="feederDialog"
      @close="feederClose"
      width="45%"
    >
      <div v-loading="loadingFeeder" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vh;">
        <dl class="demo-ruleForm">
          <!--修改内容-->
          <dt>{{$t('m.params.updateContent')}}</dt>
          <dd style="padding: 10px">{{feederContent}}</dd>
          <!--修改时间-->
          <dt>{{$t('m.params.updateTime')}}</dt>
          <dd><el-input :value="Date.parse(new Date()) | formatProposalTime()" readonly></el-input></dd>
          <!--手续费-->
          <dt>2.{{$t('m.params.poundage')}}</dt>
          <dd>
            <div class="feel">
              <!--燃料费-->
              <!--(约)-->
              <span>{{$t('m.fuelCost')}}: {{feederFeeZos}} ZOS{{$t('m.transfer.about')}}</span>
              <span style="flex: 1"></span>
              <!--可用数量-->
              <span>{{$t('m.transfer.KYSL')}}: {{available}} ZOS</span>
              <!--获得-->
              <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
            </div>
          </dd>
          <!--数量不足-->
          <dd v-show="zosShow(feederFeeZos)" style="color: #ff0000">ZOS{{$t('m.transfer.numNull')}}</dd>
          <dd>
            <div class="feel">
          <span>
            <!--系统将优先使用优惠券抵扣-->
            {{$t('m.transfer.useCoupons')}}
          </span>
              <span style="flex: 1"></span>
              <!--优惠券数量-->
              <span>{{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS</span>
              <a class="margin-l10" @click="couponVisible=true">
                <!--关于优惠券-->
                {{$t('m.transfer.abountCoupons')}}
              </a>
            </div>
          </dd>
          <dd class="margin-t10 text-right">
            <y-button
              :text="$t('m.cancel')"
              @btnClick="feederClose"
            ></y-button>
            <y-button
              :text="$t('m.sure')"
              @btnClick="feederSubmit"
              :classStyle="zosShow(feederFeeZos) ? 'disabled-btn' : 'main-btn'"
            ></y-button>
          </dd>
        </dl>
      </div>
    </el-dialog>
 <!--获得ZOS-->
    <getzosdialog @isVisible="isZosVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
    <!--关于优惠-->
    <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>
    <!--输入资金密码-->
    <password-dialog :visible="comfirmSumbmitFeeders" @bitlenderLendOrder="bitlenderLendFeeders"></password-dialog>
    </div>
</template>
<script>
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import {getTimezoneDate} from '/js-utils/until'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import formatAssets from '/js-api/public'
  import YButton from '/path-components/element/YButton'
  export default {
    name: 'carriers',
    components: {passwordDialog, getzosdialog, couponDialog, YButton},
    props: {
      optionId: '',
      selectedSymbol: {},
      symbol: '',
      Type: '',
      assetId: ''
    },
    computed: {
      available () {
        let assetsArr = formatAssets.formatAssets('ZOS')
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else {
          return assetsArr[0].amount
        }
      },
      // zos燃料费，够不够
      zosShow (fee) {
        return function (fee) {
          return this.available + this.$store.state.coupon.amount < fee
        }
      }
    },
    data () {
      return {
        loading: 1,
        canEdit: false,
        timeInter: undefined,
        tableDataParamsShow: true,
        author: '',
        tr: '',
        loadingFeeder: false,
        proposalTime: '',
        feeZos: '',
        selectedTrading: [],
        feederDialog: false,
        selectedTradingVal: '',
        selectedTradingLast: '',
        proposalDialog: false,
        zosDialog: false,
        couponVisible: false,
        feedOption: {},
        copyfeedOption: {},
        copyGetFeeders: [],
        getFeeders: '',
        feedData: [],
        checks: 0,
        addFeeder: '',
        feedType: false,
        feedSymbol: '',
        coreSymbol: '',
        comfirmSumbmitFeeders: false,
        feederContent: {},
        getFeedersParam: [],
        checksArr: [
          {
            'label': 0,
            'value': this.$t('m.params.specified') // '指定喂价人'
          },
          {
            'label': 1,
            'value': this.$t('m.params.directors') // '小理事会'
          },
          {
            'label': 2,
            'value': this.$t('m.params.witnesses') // '见证人'
          },
          {
            'label': 3,
            'value': this.$t('m.params.board') // '董事会'
          }
        ],
        rateTable: {
          base: '',
          quote: ''
        },
        isEdit: false
      }
    },
    methods: {
      // 关闭zos
      isZosVisible () {
        this.zosDialog = false
      },
      // 关闭优惠
      couponClose () {
        this.couponVisible = false
      },
      // 删除喂价人
      handleDelete (index, row) {
        this.getFeeders.splice(index, 1)
        this.isEdit = true
      },
      getFeedSymbol () {
        if (!this.feedType) {
          this.feedSymbol = this.selectedSymbol.symbol + '/' + this.selectedTradingVal.symbol
          this.coreSymbol = this.rateTable.base + '/' + this.rateTable.quote
        } else {
          this.feedSymbol = this.selectedTradingVal.symbol + '/' + this.selectedSymbol.symbol
          this.coreSymbol = this.rateTable.quote + '/' + this.rateTable.base
        }
      },
      invertFeed () {
        this.feedType = !this.feedType
        this.getFeedDetail()
      },
      // 添加喂价人
      addFeedProducers () {
        Apis.instance().db_api().exec('get_account_by_name', [this.addFeeder]).then(acc => {
          if (!acc) {
            this.$message({
              message: this.$t('m.historyinfo.noAccount'),
              type: 'warning'
            })
            return
          }
          let userId = acc.id
          let isAt = this.getFeeders.filter(res => {
            return res.userName === acc.name
          })
          if (isAt.length > 0) {
            this.$message({
              message: this.$t('m.params.isFeeder'),
              type: 'warning'
            })
            return
          }
          let params = {
            userId: userId,
            userName: this.addFeeder
          }
          this.getFeeders.push(params)
          this.addFeeder = ''
          this.isEdit = true
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 提交喂价人修改后的参数
      sumbmitFeeders () {
        if (!this.isEdit) {
          this.$message({
            type: 'warning',
            // '没有任何修改'
            message: this.$t('m.params.noupdate')
          })
          return
        }
        this.comfirmSumbmitFeeders = true
      },
      // 喂价人弹窗
      bitlenderLendFeeders (bool) {
        if (!bool) {
          this.comfirmSumbmitFeeders = false
          return
        }
        let feedersArr = []
        let _feedersArr = []
        this.getFeeders.forEach(item => {
          feedersArr.push(item.userId)
          _feedersArr.push(item.userName)
        })
        this.feedOption.feeders = feedersArr
        this.feedOption.flags = this.checks
        this.feederContent[this.$t('m.params.feederFlag')] = this.checksArr[this.checks].value
        this.feederContent[this.$t('m.params.getFeeders')] = _feedersArr
        ZOSInstance.bitlender_update_feed_producers_operation(
          this.$store.state.userDataSid,
          this.optionId,
          this.author,
          this.feedOption)
          .then(data => {
            if (data) {
              this.feederTr = data.tr
              this.feederFeeZos = data.fee.fee_amount / Math.pow(10, data.fee.fee_precision)
              this.comfirmSumbmitFeeders = false
              this.feederDialog = true
            }
          })
          .catch(err => {
            this.comfirmSumbmitFeeders = false
            console.log(err)
          })
      },
      feederClose () {
        this.feederDialog = false
      },
      // 提交喂价人到链
      feederSubmit () {
        this.loadingFeeder = true
        this.bitlenderLendFeedersBroad(this.feederTr)
      },
      bitlenderLendFeedersBroad (tr) {
        ZOSInstance.broadcastTransaction(tr).then(res => {
          if (res) {
            this.$message({
              message: this.$t('m.params.proposalsSucc'),
              type: 'success'
            })
            this.loadingFeeder = false
            this.feederDialog = false
            this.tableDatafeederShow = !this.tableDatafeederShow
            this.paramsCancel()
          }
        })
          .catch(err => {
            console.log(err)
            this.loadingFeeder = false
            this.feederDialog = false
          })
      },
      paramsEdit () {
        this.tableDataParamsShow = !this.tableDataParamsShow
      },
      paramsCancel () {
        this.tableDataParamsShow = true
        this.isEdit = false
        this.setEdit(this.isEdit)
        this.feedOption = [...(this.copyfeedOption)]
        this.checks = this.feedOption.flags
        this.getFeeders = [...(this.copyGetFeeders)]
      },
      setEdit (st) {
        this.isEdit = st
      },
      canLeave () {
        return this.isEdit === false
      },
      _getAssetFeed () {
        this.loading++
        ZOSInstance.getAssetList().then(item => {
          if (!item.cash_list || !item.lender_list || item.cash_list.length <= 0 || item.lender_list.length <= 0) {
            this.loading--
            return
          }
          this.selectedTrading = item.lender_list
          this.selectedTradingVal = this.selectedTrading[0]
          this._selectedTrading(this.selectedTradingVal)
          this.loading--
        }).catch(err => {
          this.loading--
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 得到当前喂价需要选择交易对,如：CNY/BTC
      _selectedTrading (v) {
        if (this.selectedTradingLast.symbol !== v.symbol) {
          this.selectedTradingVal = v
          this.selectedTradingLast = v
          this.feedData = []
          this.getFeedDetail()
        }
      },
      // 喂价详情
      getFeedDetail () {
        if (this.selectedSymbol.id === undefined || this.selectedTradingVal.id === undefined) return
        this.loading++
        ZOSInstance.get_asset_exchange_feed(this.selectedSymbol.id, this.selectedTradingVal.id, 1)
          .then(res => {
            if (res) {
              let arr = []
              res.feeds.forEach(it => {
                arr.push(it[0])
              })
              this.current_feed = res.current_feed
              if (this.feedType) this.feedPrice = LendInstance.calcFeedPriceView(res.current_feed.settlement_price, this.selectedTradingVal.id, this.selectedTradingVal.precision, this.selectedSymbol.id, this.selectedSymbol.precision)
              else this.feedPrice = LendInstance.calcFeedPriceView(res.current_feed.settlement_price, this.selectedSymbol.id, this.selectedSymbol.precision, this.selectedTradingVal.id, this.selectedTradingVal.precision)
              ZOSInstance.get_account(arr).then(arrName => {
                if (arrName) {
                  let _arrName = []
                  arrName.forEach(iname => {
                    _arrName.push(iname.get('name'))
                  })
                  var ifeeder = 0
                  res.feeds.forEach((item, index) => {
                    if (item[1][1].settlement_price.base.amount !== 0) {
                      let params = {}
                      arr.push(item[0])
                      params.settlement_price = item[1][1].settlement_price
                      params.core_exchange_rate = item[1][1].core_exchange_rate
                      params.username = _arrName[index]
                      if (this.feedType) params.clearingPrice = LendInstance.calcFeedPriceView(item[1][1].settlement_price, this.selectedTradingVal.id, this.selectedTradingVal.precision, this.selectedSymbol.id, this.selectedSymbol.precision)
                      else params.clearingPrice = LendInstance.calcFeedPriceView(item[1][1].settlement_price, this.selectedSymbol.id, this.selectedSymbol.precision, this.selectedTradingVal.id, this.selectedTradingVal.precision)
                      this.loading++
                      Apis.instance().db_api().exec('get_objects', [[item[1][1].core_exchange_rate.base.asset_id, item[1][1].core_exchange_rate.quote.asset_id]])
                        .then(asset => {
                          if (asset) {
                            params.asset0 = asset[0]
                            params.asset1 = asset[1]
                            this.rateTable.base = asset[0].symbol
                            this.rateTable.quote = asset[1].symbol
                            if (asset[0].symbol !== 'ZOS') {
                              if (this.feedType) params.coreRate = LendInstance.calcFeedPriceView(item[1][1].core_exchange_rate, asset[1].id, asset[1].precision, asset[0].id, asset[0].precision)
                              else params.coreRate = LendInstance.calcFeedPriceView(item[1][1].core_exchange_rate, asset[0].id, asset[0].precision, asset[1].id, asset[1].precision)
                            } else {
                              if (this.feedType) params.coreRate = LendInstance.calcFeedPriceView(item[1][1].core_exchange_rate, asset[0].id, asset[0].precision, asset[1].id, asset[1].precision)
                              else params.coreRate = LendInstance.calcFeedPriceView(item[1][1].core_exchange_rate, asset[1].id, asset[1].precision, asset[0].id, asset[0].precision)
                            }
                            params.keep = item[1][1].maintenance_collateral_ratio / 10 + '%'
                            params.unwinding = item[1][1].maximum_short_squeeze_ratio / 10 + '%'
                            params.time = getTimezoneDate(item[1][0])
                            if (ifeeder >= this.feedData.length) this.feedData.push(params)
                            else this.feedData.splice(ifeeder, 1, params)
                            ifeeder++
                          }
                          this.loading--
                        }).catch(err => {
                          this.loading--
                          console.log(err)
                          this.$message({
                            message: err,
                            type: 'warning'
                          })
                        })
                    }
                  })
                }
              })
            }
            this.getFeedSymbol()
            this.loading--
          })
          .catch(err => {
            this.feedPrice = ''
            this.feedData = []
            this.loading--
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      _getfeederData () {
        // 喂价人
        this.checks = this.feedOption.flags
        this.getFeeders = []
        this.loading++
        ZOSInstance.get_account(this.feedOption.feeders).then(feederObj => {
          feederObj.forEach((item, index) => {
            this.getFeeders.push({userId: item.get('id'), userName: item.get('name')})
          })
          this.copyGetFeeders = [...(this.getFeeders)]
          this.loading--
        }).catch(feederErr => {
          console.log(feederErr)
          this.loading--
          this.$message({
            message: feederErr,
            type: 'warning'
          })
        })
        this.getFeedersParam = []
        this.loading++
        ZOSInstance.lookup_feeders(this.selectedSymbol.id).then(data => {
          if (data) {
            data.forEach(item => {
              this.getFeedersParam.push(item.userName)
            })
            this.loading--
          }
        }).catch(e => {
          this.loading--
          console.log(e)
        })
      },
      _getConfig (asset) {
        this.getFeeders = []
        this.getFeedersParam = []
        this.feedOption = {}
        this.loading++
        ZOSInstance.getBitlenderOption(this.assetId, this.Type).then(res => {
          if (!res) {
            this.loading--
            return
          }
          this.author = res.author
          this.optionId = res.id
          // 其它的参数
          this.params = res.options
          this.feeMode = res.fee_mode
          this.feedOption = res.feed_option
          this.copyfeedOption = [...(this.feedOption)]
          if (res.isExiste) this._getfeederData()
          if (asset) this._getAssetFeed()
          this.loading--
        }).catch(errors => {
          console.log(errors)
          this.loading--
          this.$message({
            message: errors,
            type: 'warning'
          })
        })
        if (this.$store.state.userDataSid !== '' && this.optionId !== '') {
          this.loading++
          ZOSInstance.can_edit_bitlender_option(this.optionId, this.$store.state.userDataSid, this.Type).then(edit => {
            this.canEdit = edit
            this.loading--
          }).catch(errmess => {
            this.loading--
            this.$message({
              message: errmess,
              type: 'error'
            })
          })
        } else {
          this.canEdit = false
        }
      },
      changeOption (id, assetId, type, selectedSymbol) {
        this.assetId = assetId
        this.optionId = id
        this.Type = type
        this.selectedSymbol = selectedSymbol
        this.loading = 1
        this._getConfig(true)
        this.loading--
      },
      setTimeFeed (v) {
        if (v === true) {
          this.timeInter = setInterval(this.getFeedDetail, 9000)
        } else {
          clearInterval(this.timeInter)
          this.timeInter = undefined
        }
      },
      init () {
        this.loading = 1
        this._getConfig(true)
        this.loading--
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
      this.setTimeFeed(true)
    },
    destroyed () {
      this.setTimeFeed(false)
    }
  }
</script>
<style scoped lang="scss">
.leftpanel{
      display: flex;
      flex:1;
      width: 50%!important;
      flex-direction: row;
}
.box-card {
   width: 49.5%;
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
.account .el-card{
  background: #fff!important;
}
.layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

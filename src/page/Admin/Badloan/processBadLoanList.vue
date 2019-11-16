<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loading">
        <div>
          <el-table
            :data="refunding"
            class="curp"
            style="width: 100%"
            @row-click="handleClick"
            stripe>
            <el-table-column :label="`${$t('m.borrow.orders')}ID`">
              <template slot-scope="scope">
                <div class="fw">{{scope.row.id}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.investingdetail.jieKR')">
              <template slot-scope="scope">
                <span>{{scope.row.issuer.name}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.params.operator')" width="200">
              <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.invest_list" :key="index">
                  {{item.carrier.name}}
                  <i class="el-icon-circle-check-outline green f20" v-if="item.state > 0"></i>
                  <i class="el-icon-circle-close-outline active f20" v-else></i>
                  </p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.borrow.loanAmount')">
              <template slot-scope="scope">
                <span>{{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrency(scope.row.asset_to_loan.symbol)}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.borrow.pawnNum')">
              <template slot-scope="scope">
                <span>{{scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.asset_to_collateralize.precision) | formatLegalCurrency(scope.row.asset_to_collateralize.symbol, scope.row.asset_to_collateralize.precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="120px" :label="$t('m.badloans.badTime')">
              <template slot-scope="scope">
                <span>{{scope.row.notify_time | formatLocalTime}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" :label="$t('m.orderList.operation')">
              <template slot-scope="scope" >
                <!--处理-->
                <el-button v-if="scope.row.state > 0" type="primary" size="mini" @click.stop="bitlenderRecycle(scope.row)">{{$t('m.badloans.deal')}}</el-button>
                <!--<el-button type="primary" size="mini" @click="handleClick(scope.row)">{{$t('m.badloans.detail')}}</el-button>-->
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
    <confirm-password :visible="passwordDialog" @close='confirmClose' @success="confirmSuccess"></confirm-password>
    <!--不良资产处理-->
    <el-dialog
      :title="$t('m.badloans.assetDeal')"
      :visible.sync="conformDialog"
      width="40%"
      :before-close="handleClose">
      <div v-loading="conformLoading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw;">
          <span>
            <div v-if="conformDialog">
              <p>{{$t('m.borrow.orders')}}ID: {{selectData.id}}</p>
              <!--剩余未还金额-->
              <p> {{$t('m.borrow.notRepay')}}: </p>
              <p> {{$t('m.borrow.capital')}}: {{nplData.capital | formatLegalCurrency(selectData.asset_to_loan.symbol, selectData.asset_to_loan.precision)}}</p>
              <p> {{$t('m.borrow.penaltyInterest')}}: {{nplData.penaltyInterest | formatLegalCurrency(selectData.asset_to_loan.symbol, selectData.asset_to_loan.precision)}}</p>
              <p> {{$t('m.borrow.total')}}: {{nplData.capital + nplData.penaltyInterest | formatLegalCurrency(selectData.asset_to_loan.symbol, selectData.asset_to_loan.precision)}}</p>
              <br/>
              <p>{{$t('m.borrow.pawnNum')}}: {{nplData.collRecycle | formatLegalCurrency(selectData.asset_to_collateralize.symbol, selectData.asset_to_collateralize.precision)}}</p>
              <p>{{ selectData.asset_to_loan.symbol + $t('m.investDetails.exchange') + selectData.asset_to_collateralize.symbol + $t('m.investDetails.proportion')}}: {{feedPrice}}</p>
              <p>{{$t('m.borrow.pawnValue')}}: {{(nplData.collRecycle) / feedPrice | formatLegalCurrency(selectData.asset_to_loan.symbol)}}</p>
              <!--投资者保本率-->
              <p>{{$t('m.borrow.principalGuaranteeRate')}}: {{recycleInvesterLoseRate}}%</p>
              <!--偿还金额-->
              <p class="feel" style="flex-direction: column;">
                <span>{{$t('m.badloans.repayNum')}}: {{(nplData.capital + nplData.penaltyInterest) * ((recycleInvesterLoseRate)/100) | formatLegalCurrency(selectData.asset_to_loan.symbol)}}</span>
                <i18n path="m.badloans.loanAmountPercent" class="gray">
                  <span place="repayNum">{{recycleInvesterLoseRate}}</span>
                </i18n>
              </p>
              <p>{{$t('m.account.balances.title')}}: {{this.balanAmount | formatLegalCurrency(selectData.asset_to_loan.symbol, selectData.asset_to_loan.precision)}}</p>
              <div  style="margin: 0 0 10px">
                <span>{{$t('m.badloans.inputLabel')}}</span>
                <el-input v-model="repayMoney" type="text" @keyup.native="depoValid"><i slot="suffix" style="line-height: 40px" >{{selectData.asset_to_loan.symbol}}</i></el-input>
              </div>
              <el-alert
                v-if="inputError"
                :title="inputErrorInfo"
                :closable="false"
                type="error"
                show-icon>
              </el-alert>
              <div  style="margin: 0 0 10px">
                <span>{{$t('m.badloans.memoLabel')}}</span>
                <el-input v-model="memo" style="width: 100%;" type="textarea" resize="none"></el-input>
              </div>

              <p class="feel" style="flex-direction: column;">
                <!--燃料费-->
                  <!--(约)-->
                <span>{{$t('m.transfer.YJXH')}}: {{fee}} ZOS {{$t('m.transfer.YJXH1')}}</span>
                <span style="flex:1"></span>
                  <!--可用数量-->
                  <!--获得-->
                <span>{{$t('m.transfer.KYSL')}}: {{zosAmount}}  ZOS   <a @click="zosDialog=true">{{$t('m.transfer.get')}} ZOS</a></span>
              </p>
              <p class="feel" style="flex-direction: column;">
                <!--系统将优先使用优惠券抵扣-->
                <span class="gray">{{$t('m.transfer.useCoupons')}}</span>
                <span style="flex:1"></span>
                <!--优惠券数量-->
                <span>{{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS
                  <!--了解优惠券-->
                    <a class="margin-l20" @click="couponVisible=true">{{$t('m.transfer.understandCoupons')}}</a>
                  </span>
              </p>
              <!--关于优惠-->
              <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>
                <!--获得ZOS-->
              <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
              <!--数量不足-->
              <div style="font-size: 12px;color: red" v-show="zosAmount < fee && $store.state.coupon.amount < fee">{{$t('m.transfer.numNull')}}ZOS</div>
            </div>
          </span>
          <span class="gray">{{$t('m.badloans.transferred')}}</span>
          <div slot="footer" class="dialog-footer" style="text-align: right;">
              <el-button @click="conformDialog=false">{{$t('m.cancel')}}</el-button>
              <el-button type="primary" @click="operateConfrom()">{{$t('m.badloans.deal')}}</el-button>
          </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
  import ConfirmPassword from '/path-components/Login/ConfirmPassword'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import formatAssets from '/js-api/public'
  export default {
    components: {
      ConfirmPassword,
      getzosdialog,
      formatAssets
    },
    data () {
      return {
        total: null,
        listQuery: {
          page: 1,
          limit: 10
        },
        refunding: [
        ],
        allOrderIds: [],
        emptyListShow: 0,
        loading: true,
        passwordDialog: false,
        conformLoading: false,
        conformDialog: false,
        selectData: {},
        feedPrice: 0,
        fee: 0,
        feePrecision: 8,
        recycleInvesterLoseRate: 0,
        repayMoney: '0',
        userBalance: 0,
        memo: '',
        inputError: false,
        inputErrorInfo: '',
        zosDialog: false,
        couponVisible: false,
        // Ella
        nplData: {}
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
      zosAmount () {
        let assetsArr = formatAssets.formatAssets('ZOS')
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (assetsArr.length > 0) {
          this.zosprecision = assetsArr[0].precision
          return assetsArr[0].amount
        }
      }
    },
    watch: {
      '$route': function (val, oldVal) {
        if (oldVal.name === 'processBadLoanList') {
          this.refunding = []
          this.allOrderIds = []
          this.init()
        }
      }
    },
    methods: {
      handleClick (row) {
        this.$router.push({
          path: 'adminBadLoanDetail',
          query: {
            type: this.$route.query.type,
            id: row.id,
            accName: row.issuer.name,
            accID: row.issuer.id
          }
        })
      },
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      couponClose () {
        this.couponVisible = false
      },
      getBalance () {
        let assetsArr = formatAssets.formatAssets(this.selectData.asset_to_loan.symbol)
        let balanAmount = 0
        if (!assetsArr || assetsArr.length === 0) {
          balanAmount = 0
        } else if (assetsArr.length > 0) {
          balanAmount = assetsArr[0].amount
        }
        return balanAmount
      },
      depoValid () {
        this.repayMoney = this.repayMoney.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        this.repayMoney = this.repayMoney.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        this.repayMoney = this.repayMoney.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        if (Number(this.repayMoney) >= 0) {
          let newstr
          if (this.repayMoney.indexOf('.') !== -1) { // 如果存在小数点
            var pos = this.repayMoney.indexOf('.') // 小数点的位置
            newstr = this.repayMoney.substring(pos + 1) // 小数点后面的值
            var yong = this.repayMoney.substring(0, pos + 1)
            newstr = newstr.replace(/[^0-9]/ig, '')
            if (typeof (this.selectData.asset_to_loan.precision) === 'undefined') {
              this.selectData.asset_to_loan.precision = 2
            }
            if (newstr.length >= this.selectData.asset_to_loan.precision + 1) {
              newstr = newstr.substring(0, this.selectData.asset_to_loan.precision)
            }
            this.repayMoney = yong + newstr
          }
          if (this.repayMoney < (this.nplData.capital + this.nplData.penaltyInterest) * ((this.recycleInvesterLoseRate) / 100)) {
            this.inputError = true
            // '偿还金额不能小于最低偿还金额'
            this.inputErrorInfo = this.$t('m.badloans.inputErrNoEnough')
            return
          }
          if (this.repayMoney > this.balanAmount) {
            this.inputError = true
            // '余额不足'
            this.inputErrorInfo = this.$t('m.badloans.balanceNotEnough')
            return
          }
          this.inputError = false
          this.inputErrorInfo = ''
        }
      },
      init () {
        this.loading = true
        this.listQuery.page = 1
        this.getAboutFee()
        this.getCarrierOrderList()
      },
      getCarrierOrderList () {
        ZOSInstance.get_carrier_orders(this.$store.state.userDataSid, this.$route.query.type).then(res => {
          this.allOrderIds = res
          this.getList()
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      getList () {
        var listNum = this.allOrderIds.length
        let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
        if (listNum === 0) {
          this.loading = false
          this.emptyListShow = 1
          return
        } else {
          this.emptyListShow = 2
        }
        ZOSInstance.get_loan_orders_by_order(this.allOrderIds.slice(startIndex, startIndex + this.listQuery.limit)).then(res => {
          if (this.listQuery.page === 1 && res.length === 0) {
            this.emptyListShow = 1
            this.loading = false
          } else {
            this.emptyListShow = 2
            this.total = listNum
            this.refunding = res
            this.refunding.forEach(element => {
              element.state = 0
              ZOSInstance.get_invest_orders_by_order(element.interest_book).then(res1 => {
                element['invest_list'] = res1
                for (var i = 0; i < res1.length; i++) {
                  if (res1[i].state === 0) element.state = element.state + 1
                }
              }).catch(err => {
                console.log(err)
                this.$message.error({
                  message: err
                })
                this.loading = false
              })
            })
            this.loading = false
          }
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      getAboutFee () {
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'bitlender_recycle', '').then(res => {
          this.fee = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
          this.feePrecision = res.feeAmount.precision
        }).catch(err => {
          console.log(err)
        })
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.listQuery.page = val
        this.getList()
      },
      confirmClose () {
        this.passwordDialog = false
      },
      confirmSuccess () {
        this.passwordDialog = false
        this.bitlenderUpdate()
      },
      bitlenderRecycle (data) {
        let capital = 0
        let penaltyInterest = 0
        let collRecycle = 0
        data.invest_list.forEach(item => {
          if (item.carrier.id === this.$store.state.userDataSid) {
            capital += item.amount_to_invest.amount
            penaltyInterest += item.repay_principal_fee.amount
            collRecycle += item.amount_to_recycle.amount
          }
        })
        this.nplData = {
          capital: capital / Math.pow(10, data.asset_to_loan.precision),
          penaltyInterest: penaltyInterest / Math.pow(10, data.asset_to_loan.precision),
          collRecycle: collRecycle / Math.pow(10, data.asset_to_collateralize.precision),
          collateralizeNum: data.amount_to_collateralize.amount / Math.pow(10, data.asset_to_collateralize.precision)
        }
        this.selectData = data
        this.balanAmount = this.getBalance()
        this.passwordDialog = true
      },
      bitlenderUpdate () {
        ZOSInstance.get_asset_exchange_feed(this.selectData.asset_to_loan.id, this.selectData.asset_to_collateralize.id, 1).then(res => {
          this.feedPrice = LendInstance.calcFeedPriceView(res.current_feed.settlement_price, this.selectData.asset_to_loan.id, this.selectData.asset_to_loan.precision, this.selectData.asset_to_collateralize.id, this.selectData.asset_to_collateralize.precision)
          let type = ZOSInstance.getOptionKeyToValue(this.selectData.repayment_type)
          ZOSInstance.getBitlenderOption(this.selectData.asset_to_loan.id, type).then(res => {
            this.recycleInvesterLoseRate = res.options.principal_guarantee_rate
            this.conformDialog = true
          }).catch(err => {
            console.log(err)
            this.$message.error({
              message: err
            })
          })
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
        })
      },
      operateConfrom () {
        if (this.inputError) {
          return
        }
        this.conformLoading = true
        ZOSInstance.bitlender_recycle(this.$store.state.userDataSid, this.selectData.id, this.repayMoney * Math.pow(10, this.selectData.asset_to_loan.precision), this.memo).then(trRes => {
          ZOSInstance.broadcastTransaction(trRes.tr).then(res => {
            this.fee = res.fee.amount / Math.pow(10, this.feePrecision)
            this.conformDialog = false
            this.conformLoading = false
            this.$message({
              message: this.$t('m.badloans.subSucc'),
              type: 'success'
            })
            setTimeout(this.getCarrierOrderList(), 6000)
          }).catch(err => {
            console.log(err)
            this.conformLoading = false
            this.$message({
              message: err,
              type: 'error'
            })
          })
        }).catch(err => {
          console.log(err)
          this.conformLoading = false
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
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
</style>

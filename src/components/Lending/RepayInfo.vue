<template>
  <dl>
    <!--利息-->
          <dt>{{$t('m.borrowsuccess.interest')}}</dt>
          <dd class="pr">
            <el-table
              :data="tableListData.interestData"
              border
              :show-header="true"
              style="width: 85%">
              <!--期数-->
              <el-table-column
                prop="id"
                :label="$t('m.borrowsuccess.nper')"
                width="80">
                <template slot-scope="scope">
                  {{scope.row[0] + 1}}
                </template>
              </el-table-column>
              <!--应收金额-->
              <el-table-column
                prop="amount"
                :label="isInvest ? `${$t('m.borrowsuccess.shouldGet')}(${tableListData.symbol})` : `${$t('m.borrowsuccess.should')}(${tableListData.symbol})`"
                width="150">
                <template slot-scope="scope">
                  {{scope.row[1].expect_repay_interest.amount / Math.pow(10, tableListData.precision)  | formatLegalCurrencys('', tableListData.precision)}}
                </template>
              </el-table-column>
              <!--应还日期-->
              <el-table-column
                prop="expect_time"
                :label="isInvest ? $t('m.borrowsuccess.shouldDateGet') : $t('m.borrowsuccess.shouldDate')"
                width="120">
                <template slot-scope="scope">
                  {{scope.row[1].expect_time | formatDateStrHour}}
                </template>
              </el-table-column>
              <!--实还金额-->
              <el-table-column
                prop="finish_amount"
                :label="isInvest ? `${$t('m.borrowsuccess.realAmountGet')}(${tableListData.symbol})` : `${$t('m.borrowsuccess.realAmount')}(${tableListData.symbol})`"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row[1].finish_amount !== 0">
                    {{scope.row[1].finish_amount | formatLegalCurrencys('', tableListData.precision)}}
                    </span>
                </template>
              </el-table-column>
              <!--实还日期-->
              <el-table-column
                prop="finish_time"
                :label="isInvest ? $t('m.borrowsuccess.realDateGet') : $t('m.borrowsuccess.realDate')">
                <template slot-scope="scope">
                  <span v-if="scope.row[1].amount_repay_interest.amount !== 0">
                    {{scope.row[1].finish_time | formatDateStr}}
                  </span>
                </template>
              </el-table-column>
              <!--还款状态-->
              <el-table-column
                :label="$t('m.borrowsuccess.repayment_state')">
                <template slot-scope="scope">
                  <!--interest_state:状态（1:未还息；2:已还息；3:逾期；4:逾期还息）-->
                  <i class="el-icon-check"
                    v-if="(scope.row[1].interest_state === 2 || scope.row[1].interest_state === 4) && (tableListData.orderState !== 12 && tableListData.orderState !== 15)">
                  </i>
                  <!--正常,剩余-->
                  <span v-else-if="scope.row[1].interest_state === 1 && (tableListData.orderState!==12 && tableListData.orderState!==15)"
                        v-show="scope.row[0] === toppx">
                    {{$t('m.borrowsuccess.normal')}}
                    ({{$t('m.borrowsuccess.remaining')}} {{Math.abs(Math.ceil(remaining))}} {{$t('m.days')}})
                  </span>
                  <span
                    v-else-if="scope.row[1].interest_state === 3 && (tableListData.orderState!==12 && tableListData.orderState!==15)"
                    v-show="scope.row[0] === toppx"
                    style="color: #ff0000">
                    {{$t('m.borrowsuccess.withOut')}}
                    ({{Math.abs(Math.ceil(remaining))}}{{$t('m.day')}})
                  </span>
                  <span v-else-if="tableListData.orderState >= 12" v-show="scope.row.id === toppx">已核销</span>
                </template>
              </el-table-column>
            </el-table>
            <!--interest_state状态判断，重新调用一下，就是下一期还款-->
            <el-button
              v-if="(tableListData.orderState < 11) && isShow"
              type="primary" class="repayment pa"
              :style="{top: `${(toppx + 1)  * 58}px`}"
              v-show="tableListData.orderState !== 6 && toppx >=0"
              @click="onceRepayOption=1;tableListData.interestData[toppx][1].interest_state === 3 ? getBreach(tableListData.id, toppx) : showloading()"
            >
              <!--还息-->
              {{$t('m.borrowsuccess.alsoInterest')}}
            </el-button>
          </dd>
          <!--还本-->
          <!--本金-->
          <dt class="margin-t10">{{$t('m.borrowsuccess.principal')}}</dt>
          <dd class="pr">
            <el-table
              :data="tableListData.principalData"
              border
              :show-header="true"
              style="width: 85%">
              <!--期数-->
              <el-table-column
                :label="$t('m.borrowsuccess.principal')"
                width="80">
              </el-table-column>
              <!--应还金额-->
              <el-table-column
                prop="amount"
                :label="isInvest ? `${$t('m.borrowsuccess.shouldGet')}(${tableListData.symbol})` : `${$t('m.borrowsuccess.should')}(${tableListData.symbol})`"
                width="150">
                <template slot-scope="scope">
                  {{scope.row.amountLoan / Math.pow(10, tableListData.precision) | formatLegalCurrencys('', tableListData.precision)}}
                </template>
              </el-table-column>
              <!--应还日期-->
              <el-table-column
                prop="expect_time"
                :label="isInvest ? $t('m.borrowsuccess.shouldDateGet') : $t('m.borrowsuccess.shouldDate')"
                width="120">
                <template slot-scope="scope">
                  {{scope.row.expect_principal_time | formatDateStrHour}}
                </template>
              </el-table-column>
              <!--实还金额-->
              <el-table-column
                :label="isInvest ? `${$t('m.borrowsuccess.realAmountGet')}(${tableListData.symbol})` : `${$t('m.borrowsuccess.realAmount')}(${tableListData.symbol})`"
              >
              <template slot-scope="scope">
                <span v-if="scope.row.finish">{{scope.row.principalFinish / Math.pow(10, tableListData.precision) | formatLegalCurrencys('', tableListData.precision)}}</span>
              </template>
              </el-table-column>
              <!--实还日期-->
              <el-table-column
                :label="isInvest ? $t('m.borrowsuccess.realDateGet') : $t('m.borrowsuccess.realDate')">
                <template slot-scope="scope"><span v-if="scope.row.finish">{{scope.row.principalTime | formatDateStr}}</span></template>
              </el-table-column>
              <!--还款状态-->
              <el-table-column
                :label="$t('m.borrowsuccess.repayment_state')">
                <template slot-scope="scope">
                  <!--order_state：订单状态（1:发标；2:订单逾期；3:正在应标；4:满标；5:开始付息；6:还息结束；7:还本结束；8:提前还本结束；9:逾期还本结束；10:利息逾期；11:本金逾期；12:不良资产；13:不良资产处理完成）-->
                  <span
                    v-if="tableListData.orderState === 6"
                    v-show="isPrincipal"
                  >
                    {{$t('m.borrowsuccess.normal')}}
                    ({{$t('m.borrowsuccess.remaining')}}{{Math.abs(Math.ceil(remaining))}}{{$t('m.day')}})
                  </span>
                  <span
                    v-else-if="tableListData.orderState === 11"
                    v-show="isPrincipal">
                    {{$t('m.borrowsuccess.withOut')}}
                    ({{Math.abs(Math.ceil(remaining))}}{{$t('m.day')}})
                  </span>
                  <i class="el-icon-check" v-if="tableListData.orderState === 7"></i>
                  <i class="el-icon-check" v-else-if="tableListData.orderState === 8">
                    <!--提前还本-->
                    {{$t('m.borrowsuccess.early')}}
                  </i>
                  <!--逾期还本-->
                  <i class="el-icon-check" v-else-if="tableListData.orderState == 9">{{$t('m.borrowsuccess.overdueRepay')}}</i>
                  <!--已核销-->
                  <span v-else-if="tableListData.orderState >= 12" v-show="isPrincipal">{{$t('m.borrowsuccess.hasDel')}}</span>

                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" class="repayment pa" style="bottom: 10px"
                       @click="onceRepayOption=3; getRemaining(tableListData.id)"
                        v-show="isPrincipal && isShow"
                        :disabled="isDisabled">
              <!--还本-->
              {{$t('m.borrowsuccess.repayment')}}
            </el-button>
          </dd>
          <el-button v-if="orderState !== 12 && orderState !== 15 && isShow" type="primary" style="margin-top: 10px" v-show="!isPrincipal" @click="onceRepayOption=2;getRemaining(tableListData.id)">
            <!--提前还款-->
            {{$t('m.borrowsuccess.prepayment')}}
          </el-button>
          <!--还款信息确认-->
          <repay-dialog
            :visible="repaymentDialog"
            @repaymenClose='repaymenClose'
            :dataDialog="onceRepayOption === 1 ? dataDialog : dataPrincipal"
            :onceRepayOption="onceRepayOption"
          ></repay-dialog>
          <el-dialog
            :title="$t('m.borrow.repaymentSure')"
            :visible.sync="confirmDialog"
            width="30%"
          >
            <div v-loading="loading" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vw;">
              <div v-if="onceRepayOption === 1 && toppx !== -1">
                <p>{{$t('m.borrowsuccess.nper')}}: {{tableListData.interestData[toppx][0]+1}} / {{tableListData.interestData.length}}</p>
                <!--期数-->
              </div>
              <!--还款金额-->
              <p>{{$t('m.borrowsuccess.repayment_sum')}}: {{total | formatLegalCurrency(tableListData.symbol, tableListData.precision)}}</p>
              <!--还款日期-->
              <p>{{$t('m.borrowsuccess.repayment_day')}}: {{new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}}</p>
              <p>{{$t('m.fuelCost')}}: {{feeTotal}} ZOS</p>

              <p slot="footer" class="dialog-footer text-right">
                <el-button @click="confirmDialog=false">{{$t('m.cancel')}}</el-button>
                <el-button type="primary" @click="confirmSubmit()">{{$t('m.sure')}}</el-button>
              </p>
            </div>
          </el-dialog>
          <!--输入资金密码-->
        <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder" :isAppend="true"></password-dialog>
  </dl>
</template>
<script>
  import { MessageBox } from 'element-ui'
  import {ZOSInstance} from 'zos-wallet-js'
  import repayDialog from '/path-components/Lending/repayDialog'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {repayDialog, passwordDialog},
    props: {
      tableListData: {
        type: Object,
        default: {}
      },
      isShow: {
        type: Boolean,
        default: false
      },
      isInvest: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        // 是否是一次性还清,1是单期还,2是一次性还清,3还本
        onceRepayOption: '',
        total: 0,
        // 罚息
        withoutRemaining: 0,
        // 利息
        withoutBreach: 0,
        // 本金
        remainingAmount: 0,
        // 罚金
        breach: 0,
        // 此订单的所需要还的利息总和，包含应还利息和罚息(没有处理精度)
        interest: 0,
        repaymentDialog: false,
        // 确认还款
        confirmDialog: false,
        // 密码
        comfirmPassword: false
      }
    },
    computed: {
      dataDialog () {
        if (this.tableListData.interestData && this.toppx !== -1) {
          let data = this.tableListData.interestData[this.toppx]
          data.symbol = this.tableListData.symbol
          data.precision = this.tableListData.precision
          data.orderid = this.tableListData.id
          data.expect_time = this.tableListData.interestData[this.toppx][1].expect_time
          data.amount = this.tableListData.interestData[this.toppx][1].expect_repay_interest.amount / Math.pow(10, this.tableListData.precision)
          // 提前还本
          data.remainingAmount = this.remainingAmount
          // 提前还本的违约金
          data.breach = this.breach
          data.interest = this.interest
          // 逾期罚息
          data.withoutRemaining = this.withoutRemaining
          // 逾期利息
          data.withoutBreach = this.withoutBreach
          // 逾期还本
          data.orderState = this.orderState
          data.interestState = this.tableListData.interestData[this.toppx][1].interest_state
          data.total = this.total
          return data
        }
      },
      dataPrincipal () {
        if (this.tableListData.principalData) {
          let data = this.tableListData.principalData[0]
          // 本金
          data.remainingAmount = this.remainingAmount
          data.expect_time = data.expectTime
          // 提前还本的违约金
          data.breach = this.breach
          data.interest = this.interest
          data.symbol = this.tableListData.symbol
          data.precision = this.tableListData.precision
          data.orderState = this.tableListData.orderState
          data.total = this.total
          return data
        }
      },
      isPrincipal () {
        if (this.tableListData.interestData) {
          if (this.tableListData.orderState === 11 || this.tableListData.interestData.length === 1) {
            if (this.tableListData.orderState === 12 || this.tableListData.orderState === 15) {
              return false
            }
            return true
          } else {
            // 最后一期应还时间
            let expectTime = this.tableListData.interestData[this.tableListData.interestData.length - 1][1].expect_time
            let date = expectTime.replace('T', ' ')
            let dateu = new Date(date).getTime()
            // 倒数第二期
            let erTime = this.tableListData.interestData[this.tableListData.interestData.length - 2][1].expect_time
            let erdate = erTime.replace('T', ' ')
            // 倒数第二期应还时间
            let erDateu = new Date(erdate).getTime()
            let chainTime = new Date()
            if ((erDateu < chainTime && chainTime < dateu) && this.tableListData.orderState < 11) {
              return true
            } else {
              return false
            }
          }
        }
      },
      // 还本按钮是否置灰,还息列表的数据
      isDisabled () {
        if (this.tableListData.interestData) {
          if (this.tableListData.orderState === 11 || this.tableListData.orderState === 6) {
            return false
          } else {
            let interset = this.tableListData.interestData[this.tableListData.interestData.length - 1].interest_state
            return interset === 1 || interset === 3 || this.tableListData.orderState < 11 ? 'true' : false
          }
        }
      },
      // 剩余多少天
      remaining () {
        let time
        if (this.toppx !== -1) {
          time = this.tableListData.interestData[this.toppx][1].expect_time.substr(0, this.tableListData.interestData[this.toppx][1].expect_time.indexOf('T'))
        } else {
          time = this.tableListData.principalData[0].expect_time.substr(0, this.tableListData.principalData[0].expect_time.indexOf('T'))
        }
        let d = Date.parse(time) - Date.parse(this.$store.state.curDate)
        return d / (3600 * 24 * 1000)
      },
      // 还款按钮的位置,根据哪一期没有还的索引，决定按钮的位置
      toppx () {
        if (this.tableListData.interestData && this.tableListData.interestData.length > 0) {
          return this.tableListData.interestData.findIndex((val, index, arr) => {
            return val[1].interest_state === 1 || val[1].interest_state === 3
          })
        }
        return -1
      }
    },
    methods: {
      // 关闭还款窗口
      repaymenClose (v) {
        this.repaymentDialog = false
        if (v) {
          this.comfirmPassword = true
        }
      },
      // 获取逾期还,获取还息所需的罚息和利息
      getBreach (orderid, repayPeriod) {
        // 参数：订单ID，第几期
        ZOSInstance.get_invest_fee(orderid, repayPeriod)
          .then((res) => {
            this.withoutRemaining = res.penalties.amount / Math.pow(10, this.tableListData.precision)
            this.withoutBreach = res.invest / Math.pow(10, this.tableListData.precision)
            this.totals()
          })
          .catch((error) => {
            console.log(error)
          })
      },
      // 一共需要还多少是否是一次性还清,1是单期还,2是一次性还清,3还本
      totals () {
        let repayInest
        if (this.toppx !== -1) {
          repayInest = this.tableListData.interestData[this.toppx][1].expect_repay_interest.amount / Math.pow(10, this.tableListData.precision)
        }
        if (this.onceRepayOption === 1 && this.tableListData.interestData[this.toppx][1].interest_state === 3) {
          this.total = this.withoutRemaining + repayInest
        } else if (this.onceRepayOption === 1 && this.tableListData.interestData[this.toppx][1].interest_state === 1) {
          this.total = repayInest
        } else if (this.onceRepayOption === 2 || this.onceRepayOption === 3) {
          this.total = Number(this.remainingAmount) + Number(this.breach) + Number(this.interest)
        }
        this.repaymentDialog = true
      },
      // 获取提前还本所需的违约金和本金
      getRemaining (orderid) {
        ZOSInstance.get_repay_fee(orderid)
          .then((res) => {
            // 本金
            this.remainingAmount = res.capital.amount / Math.pow(10, this.tableListData.precision)
            // 罚金
            this.breach = res.penalty.amount / Math.pow(10, this.tableListData.precision)
            // 此订单的所需要还的利息总和，包含应还利息和罚息(没有处理精度)
            this.interest = res.interest.amount / Math.pow(10, this.tableListData.precision)
            this.totals()
          })
          .catch((error) => {
            console.log(error)
          })
      },
      showloading () {
        this.$nextTick(() => {
          this.totals()
        })
      },
      // 获得预计手续费
      bitlenderLendOrder (v) {
        if (v) {
          ZOSInstance.getAboutFee(this.$route.query.accName, '1.3.0', 'bitlender_repay_interest', '')
            .then(res => {
              this.feeTotal = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
              this.comfirmPassword = false
              this.confirmDialog = true
            }).catch((err) => {
              console.log(err)
              this.comfirmPassword = false
            })
        } else {
          this.comfirmPassword = false
        }
      },
      // 确认还款
      confirmSubmit () {
        let currentData = this.tableListData.interestData[this.toppx]
        this.loading = true
        if (this.onceRepayOption === 1 && currentData[1].interest_state === 1) {
          console.log('正常还息')
          ZOSInstance.bitlender_repay_interest(this.$store.state.userDataSid, this.tableListData.id, currentData[0])
            .then((res) => {
              return ZOSInstance.broadcastTransaction(res.tr)
            })
            .then((res) => {
              MessageBox.alert(this.$t('m.borrow.repaySucc'), {
                confirmButtonText: this.$t('m.sure')
              })
              this.$parent.init()
              this.confirmDialog = false
            })
            .catch((err) => {
              console.log(err)
              this.btnText = this.$t('m.sure')
              this.confirmDialog = false
              MessageBox.alert(this.$t('m.borrow.repayFail'), {
                confirmButtonText: this.$t('m.sure')
              })
            })
          // 逾期还息
        } else if (this.onceRepayOption === 1 && currentData[1].interest_state === 3) {
          console.log('逾期还息')
          ZOSInstance.bitlender_overdue_interest(this.$store.state.userDataSid, this.tableListData.id, currentData[0])
            .then((res) => {
              return ZOSInstance.broadcastTransaction(res.tr)
            })
            .then((res) => {
              MessageBox.alert(this.$t('m.borrow.repaySucc'), {
                confirmButtonText: this.$t('m.sure')
              })
              this.$parent.init()
              this.confirmDialog = false
            })
            .catch((err) => {
              console.log(err)
              this.btnText = this.$t('m.sure')
              this.confirmDialog = false
              MessageBox.alert(this.$t('m.borrow.repayFail'), {
                confirmButtonText: this.$t('m.sure')
              })
            })
          // 逾期还本。
        } else if (this.onceRepayOption === 3 && this.tableListData.orderState === 11) {
          ZOSInstance.bitlender_overdue_repay(this.$store.state.userDataSid, this.tableListData.id)
            .then((res) => {
              return ZOSInstance.broadcastTransaction(res.tr)
            })
            .then((res2) => {
              MessageBox.alert(this.$t('m.borrow.repaySucc'), {
                confirmButtonText: this.$t('m.sure')
              })
              this.$parent.init()
              this.confirmDialog = false
              this.$router.push({name: 'historyloanList'})
            })
            .catch((err) => {
              console.log(err)
              this.btnText = this.$t('m.sure')
              this.confirmDialog = false
              MessageBox.alert(this.$t('m.borrow.repayFail'), {
                confirmButtonText: this.$t('m.sure')
              })
            })
            // 正常还本
        } else if (this.onceRepayOption === 3 && this.tableListData.orderState === 6) {
          // order_id,               //'1.18.x'
          //   fee_asset_id = "1.3.0" //手续费资产IDe
          console.log('正常还本')
          ZOSInstance.bitlender_repay_principal(this.$store.state.userDataSid, this.tableListData.id)
            .then((res) => {
              console.log('正常还本')
              return ZOSInstance.broadcastTransaction(res.tr)
            })
            .then((res2) => {
              MessageBox.alert(this.$t('m.borrow.repaySucc'), {
                confirmButtonText: this.$t('m.sure')
              })
              this.confirmDialog = false
              this.$router.push({name: 'historyloanList'})
            })
            .catch((err) => {
              console.log(err)
              this.btnText = this.$t('m.sure')
              this.confirmDialog = false
              MessageBox.alert(this.$t('m.borrow.repayFail'), {
                confirmButtonText: this.$t('m.sure')
              })
            })
            // 提前还本
        } else if (this.onceRepayOption === 2) {
          // order_id,               //'1.18.x'
          //   fee_asset_id = "1.3.0" //手续费资产ID
          console.log('一性清还清，提前还本')
          ZOSInstance.bitlender_prepayment(this.$store.state.userDataSid, this.tableListData.id)
            .then((res) => {
              return ZOSInstance.broadcastTransaction(res.tr)
            })
            .then((res2) => {
              MessageBox.alert(this.$t('m.borrow.repaySucc'), {
                confirmButtonText: this.$t('m.sure')
              })
              this.confirmDialog = false
              this.$router.push({name: 'historyloanList'})
            })
            .catch((err2) => {
              console.log(err2)
              this.confirmDialog = false
              MessageBox.alert(this.$t('m.borrow.repayFail'), {
                confirmButtonText: this.$t('m.sure')
              })
            })
        }
      }
    },
    mounted () {
    },
    created () {
    }
  }
</script>
<style scoped>
  dl dd{
    line-height: 30px;
  }
   .repayment{
    right:10px;
  }
</style>

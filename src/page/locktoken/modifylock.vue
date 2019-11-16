<template>
  <div v-if="visible">
  <el-dialog
    :title="titleStr"
    :visible.sync="visible"
    width="45%"
    @close="closeEvent"
  >
    <div v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
    <div v-loading="subloading" :element-loading-text="$t('m.params.submit')">

    <div class="layout">
      <div class="main_item" style="margin-right:50px;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          label-position="left"
        >
        <!--数量-->
        <el-form-item
        :label="`${$t('m.lockasseted.lockamount')}`"
          prop="lockamount"
        >
        <el-input
          v-model="ruleForm.lockamount"
          :disabled="this.mode === 5"
          :placeholder="`${$t('m.lockasseted.minamount')}:${this.locktoken_min},${$t('m.drawDialog.available')}: ${this.zos_balance}`"
          @keyup.native="depoValid"
          ></el-input>
        </el-form-item>
        <!--期限-->
        <div v-if="row.type === 1">
        <el-form-item
        :label="`${$t('m.lockasseted.lockperiod')}`"
          prop="lockperiod"
        >
        <el-select v-model="ruleForm.period" value-key="id" @change="selectedTrading">
            <el-option
              v-for="item in lockperiodlist"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        </div>
        <!--模式-->
        <div v-if="row.type === 1">
        <el-form-item
        :label="`${$t('m.lockasseted.lockmode')}`"
          prop="lockmode"
        >
        <el-select v-model="ruleForm.mode" value-key="id">
            <el-option
              v-for="item in lockmodelist"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        </div>
        </el-form>
      </div>
      <div class="main_item">
        <!-- <div class="f14 fw">{{$t('m.investDetails.touBXXQR')}}</div> -->
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.curlock')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{symbol}}</span>
            {{row.locked.amount | formatLegalCurrency3('', precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.minamount')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{symbol}}</span>
            {{this.locktoken_min | formatLegalCurrency('', precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.maxamount')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{symbol}}</span>
            {{this.locktoken_max | formatLegalCurrency('', precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.drawDialog.available')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{symbol}}</span>
            {{available| formatLegalCurrency('', precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">
            {{$t('m.information.coupons')}}:
          </el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">ZOS</span>
            {{this.$store.state.coupon.amount | formatLegalCurrency('', precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.borrow.fee')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">ZOS</span>
            {{this.feeZos | formatLegalCurrency('', precision)}}
          </el-col>
        </el-row>
        <el-row v-if='feed!==1.0'>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.feed')}}:</el-col>
          <el-col :span="16" class="num_info">
            {{this.feed}}
            <span class="symbol_unit">{{row.symbol}}</span>/<span class="symbol_unit">{{row.interestsymbol}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.yearinterest')}}:</el-col>
          <el-col :span="16" class="num_info">{{rateInfo}}</el-col> </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.ratestr')}}:</el-col>
          <el-col :span="16" class="num_info" style="color: #E75441;">
            <span class="symbol_unit">{{this.row.interestsymbol}}</span>
            {{this.rateString | formatLegalCurrency('', this.row.interestprecision)}}
          </el-col>
        </el-row>
      </div>
    </div>
    </div>
    </div>
    <div class="confirm_box">
      <el-button class="cancel_btn" @click="closeEvent()">{{$t('m.cancel')}}</el-button>
      <el-button class="determine_btn" @click="subEvent()">{{$t('m.sure')}}</el-button>
    </div>
  </el-dialog>
   <!--输入资金密码-->
  <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder" :isAppend="true"></password-dialog>
  </div>
</template>

<script>
  import YButton from '/path-components/element/YButton'
  import {ZOSInstance} from 'zos-wallet-js'
  import formatAssets from '/js-api/public'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {
      YButton,
      formatAssets,
      passwordDialog
    },
    props: {
      visible: {
        type: Boolean,
        defalut: true
      },
      // 资产id
      assetId: {
        type: String,
        default: '1.3.0'
      },
      // 货币精度
      precision: {
        type: Number,
        default: 5
      },
      symbol: {
        type: String,
        defalut: 'ZOS'
      }
    },
    data () {
      var vlockamount = (rule, value, callback) => {
        let vari = Number(value)
        // 减仓
        if (this.mode === 4) {
          let variCur = this.row.locked.amount / Math.pow(10, this.precision) - vari
          if (value === '') {
            callback(new Error(this.$t('m.page.inputAmount')))
          } else if (variCur < this.locktoken_min) {
            callback(new Error(this.$t('m.lockasseted.minlock') + this.locktoken_min))
          } else {
            callback()
          }
        } else if (this.mode === 3) {
          let variCur = this.row.locked.amount / Math.pow(10, this.precision) + vari
          let variZos = this.assetId === '1.3.0' ? vari : 0
          if (value === '') {
            callback(new Error(this.$t('m.page.inputAmount')))
          } else if (variCur < this.locktoken_min) {
            callback(new Error(this.$t('m.lockasseted.minlock') + this.locktoken_min))
          } else if (variCur > this.locktoken_max) {
            callback(new Error(this.$t('m.lockasseted.maxlock') + this.locktoken_max))
          } else if (vari > this.available) {
            callback(new Error(this.$t('m.borrow.useLess') + (vari - this.available)))
          } else if (Number(this.$store.state.coupon.amount) < this.feeZos && variZos + Number(this.feeZos) > this.zos_balance) {
            callback(new Error(this.$t('m.borrow.useLess') + ' ZOS ' + (variZos + Number(this.feeZos) - this.zos_balance)))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          lockamount: '',
          period: 1,
          rate: 0,
          mode: 1
        },
        rules: {
          lockamount: [
            {
              required: true, message: this.$t('m.page.inputAmount')
            },
            {
              validator: vlockamount, trigger: 'blur'
            }
          ],
          period: [
            {
              required: true, message: this.$t('m.lockasseted.lockperiod')
            }
          ],
          mode: [
            {
              required: true, message: this.$t('m.lockasseted.lockmode')
            }
          ]
        },
        Type: -1,
        mode: 0,
        titleStr: '',
        loading: 1,
        feeObj: {},
        feeZos: {},
        zos_balance: {},
        feed: 1.0,
        locktoken_min: 0,
        locktoken_max: 1,
        parameters: {},
        lockoptions: {},
        selectSymbol: {},
        periodindex: 0,
        period: 0,
        rate: 0,
        rateSelect: '',
        subloading: false,
        authenticationDialog: false,
        lockperiodlist: [],
        lockmodelist: [],
        comfirmPassword: false,
        rateString: '',
        rateInfo: '',
        tr: {},
        row: {locked: {amount: 0}},
        assetId: undefined
      }
    },
    methods: {
      bitlenderLendOrder (data) {
        if (data) {
          this.subloading = true
          ZOSInstance.locktoken_update(this.$store.state.userDataSid, this.row.id, this.Type, this.assetId, this.ruleForm.lockamount * Math.pow(10, this.precision), this.ruleForm.period, this.row.type, this.ruleForm.mode)
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
            this.$emit('modifyclose', true)
          })
          .catch((err) => {
            this.subloading = false
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
            this.$emit('modifyclose', false)
          })
      },
      checkParm () {
        if (this.Type === 5) {
          var d1 = new Date()
          var d2 = new Date(this.row.create_time)
          let period = (d1.getFullYear() * 12 + d1.getMonth()) - (d2.getFullYear() * 12 + d2.getMonth())
          if (this.ruleForm.period <= period) {
            let errorInfo = 'period' + this.ruleForm.period + ' ' + period
            this.$message({
              type: 'warning',
              message: errorInfo
            })
            return false
          }
          console.log(this.ruleForm.period, period, this.row.create_time)
        }
        return true
      },
      subEvent () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (!this.checkParm()) return
            this.comfirmPassword = true
          }
        })
      },
      closeEvent () {
        this.$emit('modifyclose', false)
      },
      selectedTrading (v) {
        this.period = v
        this.ruleForm.period = v
        this.getPeriodIndex(this.ruleForm.period)
        this.priceGet()
      },
      getPeriodIndex (period) {
        this.periodindex = 0
        this.lockoptions.locktoken_rates.forEach((item, i) => {
          if (Number(period) === Number(item[0])) {
            this.periodindex = i
          }
        })
        if (this.ruleForm.type === 0) {
          this.period = 1
          this.ruleForm.period = 1
        } else {
          this.period = this.lockoptions.locktoken_rates[this.periodindex][0]
          this.ruleForm.period = this.period
        }
      },
      getRate () {
        let lockamount = Number(this.ruleForm.lockamount)
        if (this.mode === 4) {
          lockamount = this.row.locked.amount / Math.pow(10, this.row.precision) - Number(this.ruleForm.lockamount)
        } else if (this.mode === 3) {
          lockamount = this.row.locked.amount / Math.pow(10, this.row.precision) + Number(this.ruleForm.lockamount)
        }
        this.getRateInfo(lockamount)
        this.getRateByAmount(lockamount)
        this.rateString = (Number(this.ruleForm.lockamount) * Number(this.feed) * (Number(this.ruleForm.period)) * Number(this.ruleForm.rate) / (12 * 10000)).toFixed(this.selectSymbol.interest_precision)
      },
      getRateInfo (amount) {
        this.lockperiodlist = []
        if (this.row.type !== 1) return
        if (this.lockoptions) {
          let value = Number(amount) * Math.pow(10, this.selectSymbol.asset_precision)
          this.lockoptions.locktoken_rates.forEach(itemp => {
            console.log('aaaaaa', itemp)
            let rateInfo = itemp[0] + this.$t('m.months') + ''
            let amountindex = 0
            itemp[1].forEach((item, i) => {
              if (value >= Number(item[0])) {
                amountindex = i
              }
            })
            rateInfo += (itemp[1][amountindex][1] / 10).toFixed(2) + '‰'
            let add = {id: itemp[0], label: rateInfo}
            this.lockperiodlist.push(add)
          })
        }
      },
      getRateByAmount (amount) {
        if (this.lockoptions && this.lockoptions.locktoken_rates.length > this.periodindex) {
          let value = Number(amount) * Math.pow(10, this.selectSymbol.asset_precision)
          this.rateSelect = ''
          this.ruleForm.rate = 0
          this.rate = 0
          this.lockoptions.locktoken_rates[this.periodindex][1].forEach(item => {
            if (value >= Number(item[0])) {
              if (this.period === 0) {
                this.rateSelect = (item[1] / 10).toFixed(2) + '‰' + '/' + this.$t('m.year')
              } else {
                this.rateSelect = this.period + this.$t('m.months') + ' ' + (item[1] / 10).toFixed(2) + '‰' + '/' + this.$t('m.year')
              }
              this.ruleForm.rate = item[1]
              this.rate = item[1]
            }
          })
          if (this.rateSelect === '') {
            let item = this.lockoptions.locktoken_rates[this.periodindex]
            this.rateSelect = this.period + this.$t('m.months') + ' ' + (item[1][0][1] / 10).toFixed(2) + '‰' + '/' + this.$t('m.year')
            this.ruleForm.rate = item[1][0][1]
            this.rate = item[1][0][1]
          }
        }
        this.rateInfo = this.rateSelect
      },

      priceGet () {
        this.feed = 1.0
        if (this.row.pay_asset === this.row.locked.asset_id) {
          this.getRate()
        } else {
          this.loading++
          ZOSInstance.getAssetCoreFeed(this.row.locked.asset_id, this.row.precision, this.selectSymbol.lockoptions.pay_asset, this.selectSymbol.interest_precision)
            .then((res) => {
              this.feed = res
              this.loading--
              this.getRate()
            })
            .catch((error) => {
              this.loading--
              console.log(error)
            })
        }
      },
      changeOption (v, p, r) {
        this.loading = 1
        this.ruleForm.lockamount = ''
        this.row = r
        this.parameters = p.lockoptions
        this.lockoptions = p.lockoptions
        this.selectSymbol = p
        this.precision = r.precision
        this.symbol = r.symbol
        this.mode = v
        this.assetId = r.locked.asset_id
        this.ruleForm.lockamount = (r.locked.amount / Math.pow(10, this.precision)).toFixed(this.precision)
        // 定期
        if (this.row.type === 1) {
          this.locktoken_min = this.parameters.locktoken_min
          this.locktoken_max = this.parameters.locktoken_max
          this.ruleForm.period = this.row.period
          this.ruleForm.mode = this.row.autolock
        // 活期
        } else {
          this.locktoken_min = this.parameters.locktoken_min
          this.locktoken_max = this.parameters.locktoken_max
        }
        this.locktoken_min = (Number(this.locktoken_min) / Math.pow(10, this.precision)).toFixed(this.precision)
        this.locktoken_max = (Number(this.locktoken_max) / Math.pow(10, this.precision)).toFixed(this.precision)

        if (this.mode === 3) {
          this.ruleForm.lockamount = ''
          this.titleStr = this.$t('m.orderList.HQ') + this.$t('m.lockasseted.addlock')
          this.Type = 3
        } else if (this.mode === 4) {
          this.ruleForm.lockamount = ''
          this.titleStr = this.$t('m.orderList.HQ') + this.$t('m.lockasseted.dellock')
          this.Type = 4
        } else {
          this.titleStr = this.$t('m.orderList.DQ') + this.$t('m.lockasseted.modify')
          this.Type = 5
        }
        this.titleStr += '    ' + this.row.id
        this.priceGet()
        this.feeGet()
        if (this.row.type === 1) {
          this.getPeriodIndex(this.ruleForm.period)
          this.selectedTrading(this.ruleForm.period)
        } else {
          this.ruleForm.period = 1
          this.periodindex = 0
        }
        this.loading--
      },
      init () {
        this.lockmodelist = [
          {id: 1, label: this.$t('m.lockasseted.lockmode1')},
          {id: 2, label: this.$t('m.lockasseted.lockmode2')},
          {id: 3, label: this.$t('m.lockasseted.lockmode3')}
        ]
      },
      depoValid () {
        if (Number(this.ruleForm.lockamount) >= 0) {
          this.ruleForm.lockamount = this.ruleForm.lockamount.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
          this.ruleForm.lockamount = this.ruleForm.lockamount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.ruleForm.lockamount = this.ruleForm.lockamount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          let newstr
          if (this.ruleForm.lockamount.indexOf('.') !== -1) { // 如果存在小数点
            var pos = this.ruleForm.lockamount.indexOf('.') // 小数点的位置
            newstr = this.ruleForm.lockamount.substring(pos + 1) // 小数点后面的值
            var yong = this.ruleForm.lockamount.substring(0, pos + 1)
            newstr = newstr.replace(/[^0-9]/ig, '')
            if (typeof (this.precision) === 'undefined') {
              this.precision = 2
            }
            if (newstr.length >= this.precision + 1) {
              newstr = newstr.substring(0, this.precision)
            }
            this.ruleForm.lockamount = yong + newstr
          }
        }
        this.priceGet()
      },
      // 获得预计手续费
      feeGet () {
        if (!this.$store.state.userName) {
          this.loading = false
          return
        }
        this.loading++
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'locktoken_update')
          .then((res) => {
            this.feeObj = res
            this.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.zos_balance = res.fee_balance / Math.pow(10, res.precision)
            this.feeZos = Number(this.feeZos).toFixed(this.precision)
            this.zos_balance = Number(this.zos_balance).toFixed(this.precision)
            this.loading--
          })
          .catch((error) => {
            console.log(error)
            this.loading--
          })
      }
    },
    computed: {
      available () {
        let assetsArr = formatAssets.formatAssets(this.symbol)
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (this.symbol && assetsArr.length > 0) {
          this.assetId = assetsArr[0].asset_id
          return assetsArr[0].amount
        }
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
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
  .warning{
    color: #ff0000;
  }
  .demo-ruleForm dt{
    margin-top: 15px!important;
  }
  .demo-ruleForm dl{
    line-height: 24px!important;
  }
  .layout{
     display: flex;
     .main_item{
      flex: 1;
      .el-select{
        width: 100%;
      }
      .el-row{
        margin: 15px 0;
      }
      .warn_text{
        font-size:12px;
        font-weight:400;
        color:#E75441;
        font-family:PingFangSC-Regular,PingFangSC;
      }
    }
    .title_info{
      color:#191A5E;
      font-size:14px;
      font-weight:500;
      font-family:PingFangSC-Medium,PingFangSC;
    }
    .num_info{
      color:#31364F;
      font-size:14px;
      font-weight:400;
      font-family:PingFangSC-Regular,PingFangSC;
    }
  }
  .symbol_unit{
    display:inline-block;
    // width:34px;
    height:16px;
    line-height:16px;
    text-align:center;
    color:#65A3F6;
    font-size:8px;
    border-radius:2px;
    background:rgba(232,242,254,1);
    border:1px solid rgba(231,241,253,1);
    font-family:Helvetica-Bold,Helvetica;
  }
  .confirm_box{
    display: flex;
    margin-top: 26px;
    .cancel_btn{
      flex: 1;
      margin-right: 32px;
      color: #5D5DFF;
      border-radius:4px;
      border: 1px solid#5D5DFF;
    }
    .determine_btn{
      flex: 1;
      margin-left: 32px;
      color: #fff;
      border-radius:4px;
      background: #5D5DFF;
      border:1px solid #5D5DFF;
    }
  }
  .el-tooltip{
    color:#B7BEC6;
  }
</style>

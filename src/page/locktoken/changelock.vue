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
        :disabled="true"
        :placeholder="`${$t('m.lockasseted.minamount')}:${this.locktoken_min},${$t('m.drawDialog.available')}: ${this.zos_balance}`"
        ></el-input>
        <span class="warn_text">{{$t('m.lockasseted.changenotifu')}}</span>
      </el-form-item>
      <!--期限-->
      <div v-if="row.type === 0">
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
      <div v-if="row.type === 0">
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
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.minamount')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{this.row.symbol}}</span>
            {{this.locktoken_min | formatLegalCurrency('', this.row.precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.maxamount')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{this.row.symbol}}</span>
            {{this.locktoken_max | formatLegalCurrency('', this.row.precision)}}
            </el-col>
          </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.drawDialog.available')}}:</el-col>
          <el-col :span="16" class="num_info">
             <span class="symbol_unit">{{this.row.symbol}}</span>
            {{available | formatLegalCurrency('', this.row.precision)}}
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
            {{this.feeZos | formatLegalCurrency('', 5)}}
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
          <el-col :span="16" class="num_info">{{rateInfo}}</el-col>
        </el-row>
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
      <div class="confirm_box">
        <el-button class="cancel_btn" @click="closeEvent()">{{$t('m.cancel')}}</el-button>
        <el-button class="determine_btn" @click="subEvent()">{{$t('m.sure')}}</el-button>
      </div>
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
        let variZos = this.assetId === '1.3.0' ? vari : 0
        if (value === '') {
          callback(new Error(this.$t('m.page.inputAmount')))
        } else if (vari < this.locktoken_min) {
          callback(new Error(this.$t('m.lockasseted.minlock') + this.locktoken_min))
        // } else if (vari > this.available) {
        //   callback(new Error(this.$t('m.borrow.useLess') + (vari - this.available)))
        } else if (Number(this.$store.state.coupon.amount) < this.feeZos && variZos + Number(this.feeZos) > this.zos_balance) {
          callback(new Error(this.$t('m.borrow.useLess') + ' ZOS ' + (vari + Number(this.feeZos) - this.zos_balance)))
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
        titleStr: '',
        loading: 1,
        feed: 1.0,
        feeObj: {},
        feeZos: {},
        zos_balance: {},
        locktoken_min: 0,
        locktoken_max: 0,
        parameters: {},
        lockoptions: {},
        selectSymbol: {},
        subloading: false,
        authenticationDialog: false,
        lockperiodlist: [],
        lockmodelist: [],
        comfirmPassword: false,
        rateString: '',
        periodindex: 0,
        period: 0,
        rate: 0,
        rateSelect: '',
        tr: {},
        row: {},
        assetId: undefined
      }
    },
    computed: {
      available () {
        let assetsArr = formatAssets.formatAssets(this.symbol)
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (this.symbol && assetsArr.length > 0) {
          this.assetId = assetsArr[0].asset_id
          return assetsArr[0].amount.toFixed(assetsArr[0].precision)
        }
      }
    },
    methods: {
      bitlenderLendOrder (data) {
        if (data) {
          this.subloading = true
          ZOSInstance.locktoken_update(this.$store.state.userDataSid, this.row.id, 1, this.assetId, this.ruleForm.lockamount * Math.pow(10, this.precision), this.ruleForm.period, this.Type, this.ruleForm.mode)
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
            this.$emit('changeclose', true)
          })
          .catch((err) => {
            this.subloading = false
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
            this.$emit('changeclose', false)
          })
      },
      subEvent () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.comfirmPassword = true
          }
        })
      },
      closeEvent () {
        this.$emit('changeclose', false)
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
        this.period = this.lockoptions.locktoken_rates[this.periodindex][0]
        this.ruleForm.period = this.period
      },
      getRate () {
        this.getRateInfo(this.ruleForm.lockamount)
        this.getRateByAmount(this.ruleForm.lockamount)
        this.rateString = (Number(this.ruleForm.lockamount) * Number(this.feed) * (Number(this.ruleForm.period)) * Number(this.ruleForm.rate) / (12 * 10000)).toFixed(this.selectSymbol.interest_precision)
      },
      getRateInfo (amount) {
        this.lockperiodlist = []
        if (this.lockoptions) {
          let value = Number(amount) * Math.pow(10, this.selectSymbol.asset_precision)
          this.lockoptions.locktoken_rates.forEach(itemp => {
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
              this.rateSelect = this.period + this.$t('m.months') + ' ' + (item[1] / 10).toFixed(2) + '‰' + '/' + this.$t('m.year')
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
      changeOption (v, p, r) {
        this.loading = 1

        this.ruleForm.lockamount = ''
        this.parameters = p.lockoptions
        this.lockoptions = p.lockoptions
        this.selectSymbol = p
        this.precision = r.precision
        this.symbol = r.symbol
        this.row = r
        this.ruleForm.lockamount = (r.locked.amount / Math.pow(10, this.precision)).toFixed(this.precision)
        // 活期转定期
        if (this.row.type === 0) {
          this.titleStr = this.$t('m.lockasseted.change1') + this.$t('m.orderList.DQ')
          this.locktoken_min = this.parameters.locktoken_min
          this.locktoken_max = this.parameters.locktoken_max
          this.Type = 1
        // 定期转活期
        } else {
          this.titleStr = this.$t('m.lockasseted.change1') + this.$t('m.orderList.HQ')
          this.locktoken_min = this.parameters.locktoken_min
          this.locktoken_max = this.parameters.locktoken_max
          this.Type = 0
        }
        this.titleStr += ' ' + this.row.id
        this.locktoken_min = (Number(this.locktoken_min) / Math.pow(10, this.precision)).toFixed(this.precision)
        this.locktoken_max = (Number(this.locktoken_max) / Math.pow(10, this.precision)).toFixed(this.precision)

        this.feeGet()
        // 活期转定期
        if (this.row.type === 0) {
          this.getPeriodIndex(this.ruleForm.period)
          this.selectedTrading(this.ruleForm.period)
        } else {
          this.period = 1
          this.ruleForm.period = 1
          this.periodindex = 0
        }
        this.priceGet()
        this.loading--
      },
      init () {
        this.lockmodelist = [
          {id: 1, label: this.$t('m.lockasseted.lockmode1')},
          {id: 2, label: this.$t('m.lockasseted.lockmode2')},
          {id: 3, label: this.$t('m.lockasseted.lockmode3')}
        ]
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

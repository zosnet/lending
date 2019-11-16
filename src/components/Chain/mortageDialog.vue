<template>
<div>
<el-dialog
    :title="$t('m.borrow.addCollateral')"
    :visible.sync="ifShowDlg"
    width="45%"
    @close="closeDialog"
  >
    <el-form v-loading="loading"
             :model="ruleForm"
             status-icon
             :rules="rules"
             validate-on-rule-change
             ref="ruleForm"
             label-position="left"
             class="demo-ruleForm">
      <div>
        <!--填写抵押数量-->
        <h3>1.{{$t('m.borrowing.inputNum')}}</h3>
        <!--提示,按照最新-->
        <div style="color: #f9c215;line-height: 40px;padding: 0 12px 0 0;">{{$t('m.borrow.note')}}: {{$t('m.borrowing.according')}}{{$t('m.borrowing.feedPrice')}}
          {{datail.asset_to_collateralize.symbol}}<!--兑-->/<!--{{$t('m.investDetails.exchange')}}-->{{datail.asset_to_loan.symbol}},
          <!--至少需要充值-->
          {{$t('m.borrowing.prepaid')}}
          {{ZDWJ}} {{symbol}}
          {{$t('m.borrowing.deposit')}}
        </div>
        <div  style="display: flex;line-height: 40px;padding: 0 12px 0 0;height: 40px">
          <!--抵押物-->
          <p style="flex: 1" >{{$t('m.borrow.DYW')}}:
            {{datail.amount_to_collateralize.amount / Math.pow(10, datail.asset_to_collateralize.precision) | formatLegalCurrency(datail.asset_to_collateralize.symbol, datail.asset_to_collateralize.precision)}}
          </p>
          <!--最新喂价-->
          <p style="flex: 1">{{$t('m.borrowing.fedPrice')}}: {{this.datail.asset_to_loan.symbol  +'/' +  this.datail.asset_to_collateralize.symbol +'  ' + datail.current_price}}</p>
        </div>
        <!--补仓数量-->
        <el-form-item :label="$t('m.borrowing.cover')" prop="mortgageNum">
          <el-input v-model="num" type="text" @blur="onAddCollBlur();scientificToNumber(num)"  @input="numberJT($event)" @keypress="onAndCollKeypress($event)" @keyup.native="amountValid" style="width: 200px">
          <template slot="append"></template>
          </el-input>
          <!--可用数量, 去充币-->
          <p style="float: right">{{$t('m.orderList.useNum')}}: {{datail.asset_to_collateralize.symbol}} {{chooseCurr}}  <a @click="chargeMoneyDialog = true" :x="true" v-if="symbol !== 'ZOS'">{{$t('m.borrow.toCharge')}}</a></p>
        </el-form-item>
        <div style="font-size: 13px;color: red" v-show="warning">{{title}}</div>
        <div style="font-size: 13px;color: orange" v-show="!warning && cur_collateral_rate > 6">抵押倍数大于6</div>
        <!--抵押倍数-->
        <el-form-item :label="$t('m.borrow.ratio')" label-width="80px">
        <el-slider v-model="cur_collateral_rate" style="width: 200px;"
                     :min="0"
                     :max="6"
                     step="0.001"
                     :show-tooltip="true"
                     :format-tooltip="formatTooltip"
                     @change="DYBChange(value)"
          ></el-slider>
        </el-form-item>
          {{$t('m.borrow.radio')}} : {{(this.minCollateralRate / 1000).toFixed(3)}}   {{$t('m.borrowing.currentMortgage')}}: {{cur_collateral_rate}}
      </div>
      <div>
        <h3>2.{{$t('m.fuelCost')}}</h3>
        <p class="feel">
          <!--(约)-->
          <span> {{$t('m.fuelCost')}}: {{$t('m.transfer.about')}} {{feelX}} ZOS</span>
          <span style="flex:1"></span>
          <span>{{$t('m.orderList.useNum')}}: {{Zosamount}}  ZOS   <a @click="zosDialog=true">{{$t('m.transfer.get')}} ZOS</a></span>
        </p>
        <p class="feel">
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
        <!--关于优惠-->
        <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>

        <div style="font-size: 13px;color: red" v-show="zoswarningflag">{{zoswarningInfo}}</div>

      </div>
      <el-form-item>
        <el-button type="primary" @click="DYbtnClick()">{{$t('m.sure')}}</el-button>
      </el-form-item>

      <!--获得ZOS-->
      <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>

      <!--输入资金密码-->
      <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder" :isAppend="true"></password-dialog>
      <!--增加抵押物信息确认-->
      <el-dialog
        append-to-body="true"
        :title="$t('m.borrowing.confirmed')"
        :visible.sync="conformDialog"
        width="30%"
        :before-close="handleClose">
        <div>
          <!--抵押物-->
          <p>{{$t('m.borrow.DYW')}}: {{this.symbol}}</p>
          <!--抵押数量-->
          <p>{{$t('m.borrow.DYSL')}}:  {{this.collateralizeAmmount}}</p>
          <!--抵押倍数-->
          <p>{{$t('m.borrow.ratio')}}:  {{this.bcollateralRate}}</p>
          <p>{{$t('m.fuelCost')}}: {{feelX}} ZOS</p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="transferCannel">{{$t('m.cancel')}}</el-button>
            <el-button type="primary" @click="transferConfrom()">{{$t('m.sure')}}</el-button>
        </span>
      </el-dialog>
      <!--交易广播失败-->
      <el-dialog
        append-to-body="true"
        :title="$t('m.transfer.failure')"
        :visible.sync="conformfail"
        width="30%"
        :before-close="handleClose">
        <!--你的交易确认超时, 请稍后尝试。-->
        <h3>{{$t('m.transfer.timeout')}}</h3>
        <div>
          <p>{{$t('m.borrow.DYW')}}: {{this.symbol}}</p>
          <p>{{$t('m.borrow.DYSL')}}:  {{this.collateralizeAmmount}}</p>
          <p>{{$t('m.borrow.ratio')}}:  {{this.bcollateralRate}}</p>
          <p>{{$t('m.fuelCost')}}: {{feelX}} ZOS</p>
        </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="conformfail = false">{{$t('m.cancel')}}</el-button>
          </span>
      </el-dialog>
      <recharge-coin style="height:1px" :assetId="datail.amount_to_loan.asset_id" dialogType="deposit" @close='close' :visible="chargeMoneyDialog"></recharge-coin>
    </el-form>
  </el-dialog>
</div>
</template>
<script>
  import RechargeCoin from '/path-components/ChargeCoin'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
  import couponDialog from '/path-components/Chain/couponDialog'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import formatAssets from '/js-api/public'
  import { ChainStore } from 'zosjs/es'
  export default {
    components: {
      getzosdialog, couponDialog, RechargeCoin, passwordDialog, formatAssets
    },
    props: {
      datail: {
        type: Object,
        default: '[一颗小按钮]'
      },
      ifShowDlg: {
        type: [Boolean],
        default: true
      }
    },
    data () {
      return {
        chargeMoneyDialog: false,
        zosDialog: false,
        zosprecision: 5,
        warning: false,
        zoswarningflag: false,
        title: '',
        zoswarningInfo: '',
        cur_collateral_rate: 0,
        symbol: '',
        collateralizeAmmount: 0,
        bcollateralRate: 0,
        num: 0.1,
        ZDWJ: 0,
        oneRatioNum: 0,
        feelX: 0,
        loading: true,
        conformDialog: false,
        comfirmPassword: false,
        conformfail: false,
        Passwordvalid: false,
        minCollateralRate: 0,
        couponVisible: false

      }
    },
    computed: {
      // 当前抵押物的数量够不够
      chooseCurr () {
        let assetsArr = formatAssets.formatAssets(this.datail.asset_to_collateralize.symbol)
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (assetsArr.length > 0) {
          return assetsArr[0].amount
        }
      },
      // zos
      Zosamount () {
        let assetsArr = formatAssets.formatAssets('ZOS')
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (assetsArr.length > 0) {
          this.zosprecision = assetsArr[0].precision
          return assetsArr[0].amount
        }
      }
    },
    methods: {
      scientificToNumber (num) {
        let str = num.toString()
        let reg = /^(\d+)(e)([-]?\d+)$/
        let arr = ''
        let len = ''
        let zero = ''
        // /*6e7或6e+7 都会自动转换数值*/
        if (!reg.test(str)) {
          return num
        } else {
          // /*6e-7 需要手动转换*/
          arr = reg.exec(str)
          len = Math.abs(arr[3]) - 1
          for (var i = 0; i < len; i++) {
            zero += '0'
          }
          return '0.' + zero + arr[1]
        }
      },
      // 关闭dialog
      closeDialog () {
        this.$emit('closeMortage', false)
      },
      couponClose () {
        this.couponVisible = false
      },
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      // 关闭充币弹窗
      close () {
        this.chargeMoneyDialog = false
      },
      onAndCollKeypress (event) {
        if (event.keyCode === 45) {
          event.preventDefault()
        }
      },
      doInputNumVerification () {
        if (typeof this.num === 'string') {
          this.num = parseFloat(this.num)
        }
        if (isNaN(this.num)) {
          this.warning = true
          // '补仓数量格式错误'
          this.title = this.$t('m.borrowing.formatErr')
          return false
        }
        if (this.num <= 0) {
          this.warning = true
          // 补仓数量要大于0'
          this.title = this.$t('m.borrowing.greater')
          return false
        }
        if (this.num > this.chooseCurr) {
          this.warning = true
          // '可用数量不足，请充币'
          this.title = this.$t('m.borrow.useLess')
          return false
        }
        if (this.feelX > this.Zosamount + this.$store.state.coupon.amount) {
          this.zoswarningflag = true
          // 'zos数量不足'
          this.zoswarningInfo = this.$t('m.borrow.numLess')
          return false
        }
        this.num = this.scientificToNumber(this.num)
        this.warning = false
        return true
      },
      onAddCollBlur () {
        return this.doInputNumVerification()
      },
      DYbtnClick () {
        this.getInfoPromise()
        let ver = this.doInputNumVerification()
        if (!ver) {
          return
        }
        this.collateralizeAmmount = this.num
        this.bcollateralRate = this.cur_collateral_rate
        this.comfirmPassword = true
      },
      formatTooltip (val) {
        return val
      },
      numberJT (inputAmount) {
        var input = Number(inputAmount)
        if (input < 0) {
          return
        }
        // 借款金额 /
        let base = this.datail.amount_to_loan.amount
        let quote = input * Math.pow(10, this.datail.asset_to_collateralize.precision) + Number(this.datail.amount_to_collateralize.amount)
        if (this.datail.amount_to_loan.asset_id === this.datail.current_feed.settlement_price.base.asset_id) {
          this.cur_collateral_rate = (quote * this.datail.current_feed.settlement_price.base.amount) / (base * this.datail.current_feed.settlement_price.quote.amount)
        } else {
          this.cur_collateral_rate = (quote * this.datail.current_feed.settlement_price.quote.amount) / (base * this.datail.current_feed.settlement_price.base.amount)
        }
        this.cur_collateral_rate = this.cur_collateral_rate.toFixed(3)
      },
      getCurFeed () {
        ZOSInstance.get_asset_exchange_feed(this.datail.amount_to_loan.asset_id, this.datail.amount_to_collateralize.asset_id).then(res => {
          if (res) {
            this.datail.current_feed = res.current_feed
            this.datail.current_price = LendInstance.calcFeedPriceView(res.current_feed.settlement_price, this.datail.asset_to_loan.id, this.datail.asset_to_loan.precision, this.datail.asset_to_collateralize.id, this.datail.asset_to_collateralize.precision)
            this.minCollateralRate = res.current_feed.maintenance_collateral_ratio * (1 + this.datail.collateral_rate_carrier * 1.0 / 1000).toFixed(3)
          }
        })
      },
      async getInfoPromise () {
        await this.getCurFeed()
      },
      DYBChange () {
        if (this.cur_collateral_rate < this.minCollateralRate / 1000) {
          this.cur_collateral_rate = (this.minCollateralRate / 1000).toFixed(3)
        }
        // 通过借款数量、id和抵押物id,获取当前喂价下的抵押物（数量，id）
        let addNum = ((Number(this.oneRatioNum) * this.cur_collateral_rate).toFixed(0) - this.datail.amount_to_collateralize.amount) / Math.pow(10, this.datail.asset_to_collateralize.precision)
        addNum = addNum.toFixed(this.datail.asset_to_collateralize.precision)
        if (addNum <= 0) {
          addNum = 0
        }
        this.num = addNum
        this.doInputNumVerification()
      },
      init () {
        console.log('init')
        this.num = 0
        this.warning = false
        this.zoswarningflag = false
        this.oneRatioNum = this.datail.amount_to_collateralize.amount
        // 根据当前喂价重新取得最小抵押倍数
        this.getInfoPromise()
        this.symbol = this.datail.asset_to_collateralize.symbol
        // 获取增加抵押相关
        this.loading = true
        ChainStore.setLoginAccount(this.$store.state.userDataSid)
        ZOSInstance.get_loan_collateralize(this.datail.amount_to_loan.asset_id, this.datail.amount_to_loan.amount, this.datail.amount_to_collateralize.asset_id).then((resCollaterAsset) => {
          this.oneRatioNum = resCollaterAsset.amount
          let minRatio = this.minCollateralRate / 1000
          this.ZDWJ = this.oneRatioNum * minRatio - this.datail.amount_to_collateralize.amount
          this.ZDWJ = Number(Number(this.ZDWJ / Math.pow(10, this.datail.asset_to_collateralize.precision)).toFixed(this.datail.asset_to_collateralize.precision))
          // 需要增加的币
          if (this.ZDWJ <= 0) {
            this.ZDWJ = 0
          }
          // 预先估计费用
          ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'bitlender_add_collateral').then(resFee => {
            this.feelX = resFee.feeAmount.amount / Math.pow(10, resFee.precision)
            this.DYBChange()
            this.numberJT(0)
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
      },
      transferCannel () {
        this.conformDialog = false
      },
      transferConfrom () {
        this.loading = true
        this.conformDialog = false
        ZOSInstance.broadcastTransaction(this.tr).then(res => {
          this.loading = false
          this.comfirmPassword = false
          this.$notify({
            // '交易已确认'
            title: this.$t('m.borrowing.trade')
          })
          this.$emit('closeMortage', true)
          // location.reload()
        }).catch(err => {
          console.log(err)
          this.comfirmPassword = false
          this.conformDialog = false
          this.loading = false
          // this.conformfail = true
          this.$message({
            type: 'warning',
            message: err
          })
        })
      },
      bitlenderLendOrder (data) {
        if (data) {
          ZOSInstance.bitlender_add_collateral(this.$store.state.userDataSid, this.datail.id, this.collateralizeAmmount, this.datail.asset_to_collateralize.id, this.datail.asset_to_collateralize.precision, this.cur_collateral_rate)
            .then(res => {
              this.comfirmPassword = false
              this.tr = res.tr
              this.feelX = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
              this.conformDialog = true
              this.loading = false
            })
            .catch((err) => {
              console.log(err)
              this.comfirmPassword = false
            })
        } else {
          this.comfirmPassword = false
        }
      },
      amountValid () {
        if (Number(this.num) >= 0) {
          this.num = this.num.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
          this.num = this.num.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.num = this.num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          let newstr
          if (this.num.indexOf('.') !== -1) { // 如果存在小数点
            var pos = this.num.indexOf('.') // 小数点的位置
            newstr = this.num.substring(pos + 1) // 小数点后面的值
            var yong = this.num.substring(0, pos + 1)
            newstr = newstr.replace(/[^0-9]/ig, '')
            if (newstr.length >= this.datail.asset_to_collateralize.precision + 1) {
              newstr = newstr.substring(0, this.datail.asset_to_collateralize.precision)
            }
            this.num = yong + newstr
          }
        }
      }
    },
    mounted () {
      this.init()
    },
    created () {
    },
    watch: {
    // 如果 `question` 发生改变，这个函数就会运行
      ifShowDlg (newShowDlg, oldShowDlg) {
        console.log(newShowDlg, oldShowDlg)
        if (newShowDlg) {
          this.init()
        }
      }
    }
  }
</script>
<style>
  .el-form-item__label{
    text-align: left;
  }
</style>

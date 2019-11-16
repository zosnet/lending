<template>
    <div v-loading="loading>0" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vw;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          label-position="left"
          width="100%"
          class="demo-ruleForm"
        >
         <el-form-item prop="price" :label="`${$t('m.sell.price')}:`">
          <div class="layout">
          <el-input
          v-model="ruleForm.price"
          @blur="getFormPrice"
          @keyup.native="ruleForm.price === undefined ? ruleForm.price = '0.00' : ruleForm.price = ruleForm.price.replace(/[^\d.]/g, '')"
          :maxlength="20"
          class="write-loan-amount" style="text-align: right;">
          </el-input>
          <span class="margin-l10" style="width: 80px;">{{secondSymbol.symbol}}/{{firstSymbol.symbol}}</span>
          </div>
        </el-form-item>

        <el-form-item prop="sell" :label="`${$t('m.sell.amount')}:`">
          <div class="layout">
          <el-input
          v-model="ruleForm.sell"
          @blur="getFormSell"
          @keyup.native="ruleForm.sell  === undefined ? ruleForm.sell = '0.00' : ruleForm.sell = ruleForm.sell.replace(/[^\d.]/g, '')"
          class="write-loan-amount" style="text-align: right">
          <i slot="prefix">
            <img :src="`/static/images/${firstSymbol.symbol}.png`" width="16" height="16" :onerror="errorImg01" />
          </i>
          </el-input>
          <span class="margin-l10" style="width: 80px;">{{firstSymbol.symbol}}</span>
          </div>
        </el-form-item>

        <hr style="border:1px dashed  #777; height:1px">

        <el-form-item prop="buy" :label="`${$t('m.sell.destamount')}:`">
          <div class="layout">
          <el-input
          v-model="ruleForm.buy"
          @blur="getFormBuy"
          @keyup.native="ruleForm.buy  === undefined ? ruleForm.buy = '0.00' : ruleForm.buy = ruleForm.buy.replace(/[^\d.]/g, '')"
          class="write-loan-amount" style="text-align: right">
          <i slot="prefix">
            <img :src="`/static/images/${secondSymbol.symbol}.png`" width="16" height="16" :onerror="errorImg01" />
          </i>
          </el-input>
          <span class="margin-l10" style="width: 80px;">{{secondSymbol.symbol}}</span>
          </div>
        </el-form-item>
    </el-form>
     <div class="layout">
          <div style="width: 85%;">
          <el-row v-if="isSell">
             <el-row>
            <el-col :span="6">{{$t('m.sell.myamount')}}:</el-col>
            <el-col :span="16">
              <a @click="clickMyAmount()" class="dHMsll gTHKWe" style="text-decoration:underline;">
                {{this.firstBalance / Math.pow(10, this.firstSymbol.precision) | formatLegalCurrency2(this.firstSymbol.symbol, this.firstSymbol.precision)}}
              </a>
            </el-col>
          </el-row>
            <el-col :span="6">{{$t('m.sell.maxprice')}}:</el-col>
            <el-col :span="16">
               <a @click="clickPrice(marketticker.highest_bid)" class="dHMsll gTHKWe"  style="text-decoration:underline;">
                {{marketticker.highest_bid}}
               </a>
              </el-col>
          </el-row>
          <el-row v-if="!isSell">
           <el-row>
            <el-col :span="6">{{$t('m.sell.myamount')}}:</el-col>
            <el-col :span="16">
               <a @click="clickMyAmount()" class="dHMsll gTHKWe"  style="text-decoration:underline;">
               {{this.secondBalance / Math.pow(10, this.secondSymbol.precision) | formatLegalCurrency2(this.secondSymbol.symbol, this.secondSymbol.precision)}}
              </a>
              </el-col>
          </el-row>
            <el-col :span="6">{{$t('m.sell.minprice')}}:</el-col>
            <el-col :span="16">
              <a @click="clickPrice(marketticker.lowest_ask)" class="dHMsll gTHKWe"  style="text-decoration:underline;">
                {{marketticker.lowest_ask}}
               </a>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.expricetime')}}:</el-col>
            <el-col :span="16">

              <el-dropdown @command="selectTime">
                  <span >
                    <a style="text-decoration:underline;">{{ruleForm.exprie.symbol}}</a>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in timeList"
                      :key="item.id"
                      :command="item"
                    >
                      <span>{{item.symbol}}</span>
                    </el-dropdown-item>
                   </el-dropdown-menu>
              </el-dropdown>

               <el-date-picker
                class="timepick"
                @change="changeTime"
                :clearable="false"
                :readonly="ruleForm.exprie.id!==0"
                v-model="ruleForm.exprie.timeDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="$t('m.borrowsuccess.selectDate')">
               </el-date-picker>
              </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.mode')}}:</el-col>
            <el-col :span="16">
                <el-dropdown @command="selectMode">
                  <span >
                    <a style="text-decoration:underline;">{{ruleForm.mode.symbol}}</a>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in modeList"
                      :key="item.id"
                      :command="item"
                    >
                      <span>{{item.symbol}}</span>
                    </el-dropdown-item>
                   </el-dropdown-menu>
                </el-dropdown>

              </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.fee')}}:</el-col>
            <el-col :span="16" v-if="feeEnough"> {{this.feeZos | formatLegalCurrency2('ZOS', this.feeZosP)}} / {{this.zos_balance | formatLegalCurrency2('ZOS', this.feeZosP)}} </el-col>
            <el-col :span="16" v-if="!feeEnough" style="color: red;"> {{this.feeZos | formatLegalCurrency2('ZOS', this.feeZosP)}} / {{this.zos_balance | formatLegalCurrency2('ZOS', this.feeZosP)}} </el-col>
          </el-row>
          </div>
          <div style="width: 15%;" v-if="isSell">
             <el-button class="sell-btn" @click="clicksell()" :disabled="!sellenable">{{$t('m.sell.sell1')}}</el-button>
          </div>
          <div style="width: 15%;" v-if="!isSell">
             <el-button class="buy-btn"  @click="clicksell()" :disabled="!sellenable">{{$t('m.sell.buy1')}}</el-button>
          </div>
    </div>

    <!--申请交易-->
    <el-dialog
      :title="confirmTitle"
      :visible.sync="showconfig"
      width="40%"
    >
      <!--正在提交-->
      <div v-loading="loading>0" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vw;">
          <el-row>
            <el-col :span="6">{{$t('m.sell.price')}}:</el-col>
            <el-col :span="16">{{ruleForm.price}} {{secondSymbol.symbol}}/{{firstSymbol.symbol}} </el-col>
          </el-row>
           <el-row>
            <el-col :span="6">{{$t('m.sell.amount')}}:</el-col>
            <el-col :span="16">{{this.ruleForm.sell  | formatLegalCurrency2(this.firstSymbol.symbol, this.firstSymbol.precision)}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.destamount')}}:</el-col>
            <el-col :span="16">{{this.ruleForm.buy  | formatLegalCurrency2(this.secondSymbol.symbol, this.secondSymbol.precision)}}</el-col>
          </el-row>
           <el-row v-if="isSell">
             <el-row>
            <el-col :span="6">{{$t('m.sell.myamount')}}:</el-col>
            <el-col :span="16">
                {{this.firstBalance / Math.pow(10, this.firstSymbol.precision) | formatLegalCurrency2(this.firstSymbol.symbol, this.firstSymbol.precision)}}
            </el-col>
          </el-row>
            <el-col :span="6">{{$t('m.sell.maxprice')}}:</el-col>
            <el-col :span="16">
                {{highest_bid}}
              </el-col>
          </el-row>
          <el-row v-if="!isSell">
           <el-row>
            <el-col :span="6">{{$t('m.sell.myamount')}}:</el-col>
            <el-col :span="16">
               {{this.secondBalance / Math.pow(10, this.secondSymbol.precision) | formatLegalCurrency2(this.secondSymbol.symbol, this.secondSymbol.precision)}}
              </el-col>
          </el-row>
            <el-col :span="6">{{$t('m.sell.minprice')}}:</el-col>
            <el-col :span="16">
                {{lowest_ask}}
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.expricetime')}}:</el-col>
            <el-col :span="16">{{ruleForm.exprie.timeDate | formatProposalTime}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.mode')}}:</el-col>
            <el-col :span="16">{{ruleForm.mode.symbol}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.sell.fee')}}:</el-col>
            <el-col :span="16"> {{this.feeZos | formatLegalCurrency2('ZOS', this.feeZosP)}} / {{this.zos_balance | formatLegalCurrency2('ZOS', this.feeZosP)}} </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">{{$t('m.transfer.couponsNum')}}:</el-col>
            <el-col :span="16"> {{$store.state.coupon.amountstr}} ZOS</el-col>
          </el-row>
        <p class="text-right">
          <y-button :text="$t('m.cancel')"
            @btnClick="showconfig = false"
          ></y-button>
          <y-button :text="$t('m.sure')"
            classStyle="main-btn"
            @btnClick="borrowSubmit"
          ></y-button>
        </p>
      </div>
    </el-dialog>
    <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="passComfirm"></password-dialog>
    <!--前往kyc-->
    <goto-kyc :kycInfo="kycInfo" :kycurl="kycurl" :authorid="$store.state.admin_id" :kycStatusCode="kycStatusCode" :hintKycDialog="hintKycDialog" :checkinfoDialog="checkinfoDialog" @close="kycclose"></goto-kyc>
    </div>
</template>
<script>
  import { MessageBox } from 'element-ui'
  import YButton from '/path-components/element/YButton'
  import { ZOSInstance } from 'zos-wallet-js'
  import formatAssets from '/js-api/public'
  import {getStore, setStore} from '/js-utils/storage'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import {Apis} from 'zosjs-ws'
  import { ChainStore } from 'zosjs/es'
  import {kycStatus} from '/js-api/index'
  import gotoKyc from '/path-components/KYC'
  export default {
    components: { YButton, formatAssets, passwordDialog, gotoKyc },
    data () {
      var priceV = (rule, value, callback) => {
        if (this.thischeck > 0) {
          this.thischeck--
          callback()
          this.validateData[0] = true
        } else if (!value || Number(value) <= 0) {
          this.validateData[0] = false
          callback(new Error(this.$t('m.bankcardInfo.enter') + this.$t('m.sell.price')))
        } else {
          this.validateData[0] = true
          callback()
        }
      }
      var sellV = (rule, value, callback) => {
        if (this.thischeck > 0) {
          this.thischeck--
          callback()
          this.validateData[1] = true
        } else if (!value || Number(value) <= 0) {
          callback(new Error(this.$t('m.bankcardInfo.enter') + this.$t('m.sell.amount')))
          this.validateData[1] = false
        } if ((this.selltype === 'sell') && (Number(value) > Number(this.firstBalance / Math.pow(10, this.firstSymbol.precision)))) {
          callback(new Error(this.$t('m.borrowsuccess.balance')))
          this.validateData[1] = false
        } else {
          this.validateData[1] = true
          callback()
        }
      }
      var buyV = (rule, value, callback) => {
        if (this.thischeck > 0) {
          this.thischeck--
          callback()
          this.validateData[2] = true
        } else if (!value || Number(value) <= 0) {
          callback(new Error(this.$t('m.bankcardInfo.enter') + this.$t('m.sell.destamount')))
          this.validateData[2] = false
        } if ((this.selltype !== 'sell') && (Number(value) > Number(this.secondBalance / Math.pow(10, this.secondSymbol.precision)))) {
          callback(new Error(this.$t('m.borrowsuccess.balance')))
          this.validateData[2] = false
        } else {
          this.validateData[2] = true
          callback()
        }
      }
      return {
        loading: true,
        feeZos: 0,
        zos_balance: 0,
        firstBalance: 0,
        confirmTitle: '',
        secondBalance: 0,
        modeList: [],
        timeList: [],
        thischeck: true,
        priceprecision: 5,
        validateData: [false, false, false],
        comfirmPassword: false,
        showconfig: false,
        checkinfoDialog: false,
        kycInfo: null, // kyc
        kycStatusCode: -1,
        author_url: '',
        hintKycDialog: false,
        kycurl: '',
        remodeid: undefined,
        marketticker: {},
        needAuthor: true,
        initPrice: true,
        tr: {},
        rules: {
          price: [
            { validator: priceV, trigger: 'change' }
          ],
          sell: [
            {validator: sellV, trigger: 'change'}
          ],
          buy: [
            {validator: buyV, trigger: 'change'}
          ]
        },
        ruleForm: {
          price: 0,
          sell: 0,
          buy: 0,
          exprie: {id: 100, timeDate: new Date()},
          mode: {id: undefined}
        }
      }
    },
    props: {
      visible: {
        type: Boolean,
        defalut: true
      },
      // 资产id
      firstSymbol: {
        type: Object,
        default: undefined
      },
      // 货币精度
      secondSymbol: {
        type: Object,
        default: undefined
      },
      selltype: {
        type: String,
        defalut: 'sell'
      }
    },
    computed: {
      sellenable () {
        if (Number(this.ruleForm.sell <= 0)) return false
        if (Number(this.ruleForm.buy <= 0)) return false
        if (Number(this.ruleForm.price <= 0)) return false
        if (this.ruleForm.exprie.timeDate < this.timeList[1].timeDate) {
          return false
        }
        if (this.ruleForm.mode.id !== 0 && this.ruleForm.mode.id !== 1) {
          return false
        }
        return true
      },
      isSell () {
        return this._isSell()
      },
      feeEnough () {
        if (this.$store.state.coupon.amount < this.feeZos) return this.zos_balance >= this.feeZos
        else return true
      }
    },
    watch: {
    },
    methods: {
      _getTimezoneDate (x) {
        return ZOSInstance.getTimezoneDateByUnix(x)
      },
      addPairDisabled () {
        if (this.firstSymbol === undefined || this.secondSymbol === undefined || this.firstSymbol.id === undefined || this.secondSymbol.id === undefined || this.firstSymbol.id === this.secondSymbol.id) {
          return true
        } else {
          return false
        }
      },
      _isSell () {
        return this.selltype === 'sell'
      },
      getFormPrice () {
        let price = Number(this.ruleForm.price)
        if (price <= 0) return
        let sell = Number(this.ruleForm.sell)
        this.ruleForm.buy = sell * price
        this.ruleForm.buy = this.ruleForm.buy.toFixed(this.secondSymbol.precision)
        this.checkAmount()
      },
      clickPrice (v) {
        if (Number(v) > 0) {
          this.ruleForm.price = v
          this.getFormPrice()
        }
      },
      checkAmount () {
        if (this._isSell()) this.$refs['ruleForm'].validateField('sell')
        else this.$refs['ruleForm'].validateField('buy')
      },
      getFormBuy () {
        let buy = Number(this.ruleForm.buy)
        if (buy <= 0) return
        let sell = Number(this.ruleForm.sell)
        if (sell > 0) this.ruleForm.price = buy / sell
        else this.ruleForm.price = 0.0
        this.ruleForm.price = this.ruleForm.price.toFixed(this.priceprecision)
        this.checkAmount()
      },
      selectTime (v) {
        this.ruleForm.exprie = v
      },
      selectMode (v) {
        this.ruleForm.mode = v
      },
      getFormSell () {
        let price = Number(this.ruleForm.price)
        if (price <= 0) return
        let sell = Number(this.ruleForm.sell)
        this.ruleForm.buy = sell * price
        this.ruleForm.buy = this.ruleForm.buy.toFixed(this.secondSymbol.precision)
        this.checkAmount()
      },
      setdata (sell, buy, price) {
        this.thischeck = 3
        this.ruleForm.sell = sell
        this.ruleForm.buy = buy
        this.ruleForm.price = price
      },
      getPricePrecision () {
        if (this.firstSymbol.precision > this.secondSymbol.precision) this.priceprecision = this.firstSymbol.precision
        else this.priceprecision = this.secondSymbol.precision
        if (this.priceprecision < 5) this.priceprecision = 5
      },
      changesymbol (first, second, needAuthor) {
        this.thischeck = 1
        this.firstSymbol = first
        this.secondSymbol = second
        this.needAuthor = needAuthor
        this.initPrice = true
        this.getPricePrecision()
        this.loading = 1
        this.getBalance()
        this.getPrice()
        this.getAuthorUrl()
        this.loading--
      },
      changeTime (v) {
        if (this.ruleForm.exprie.id === 0) {
          let da = new Date(v + ':00:00')
          this.timeList[0].timeDate = da
          this.timeList[0].time = da.getTime()
          this.ruleForm.exprie = this.timeList[0]
        }
      },
      clickMyAmount () {
        if (this._isSell()) {
          let amount = this.firstBalance / Math.pow(10, this.firstSymbol.precision)
          if (this.firstSymbol.id === '1.3.0' && this.$store.state.coupon.amount < this.feeZos) {
            amount -= this.feeZos
          }
          this.ruleForm.sell = amount
          this.getFormSell()
        } else {
          let amount = this.secondBalance / Math.pow(10, this.secondSymbol.precision)
          if (this.secondSymbol.id === '1.3.0' && this.$store.state.coupon.amount < this.feeZos) {
            amount -= this.feeZos
          }
          this.ruleForm.buy = amount
          this.getFormBuy()
        }
      },
      _getHour (v) {
        let time1 = Number(v)
        time1 = time1 / (3600 * 1000)
        time1 = time1.toFixed(0)
        time1 = time1 * (3600 * 1000)
        return time1
      },
      initDef () {
        let add = {
          id: 0,
          symbol: this.$t('m.sell.mode1') + '      '
        }
        this.modeList.push(add)
        add = {
          id: 1,
          symbol: this.$t('m.sell.mode2') + '      '
        }
        this.modeList.push(add)
        if (this.ruleForm.mode.id !== 0 && this.ruleForm.mode.id !== 1) this.ruleForm.mode = this.modeList[0]

        let timzone = new Date().getTimezoneOffset()
        let nowtime = new Date().getTime()
        let dynGlobalObject = ChainStore.getObject('2.1.0')
        nowtime = new Date(dynGlobalObject.get('time')).getTime() - timzone * 60 * 1000
        add = {
          id: 0,
          time: nowtime + (3600 * 24 * 1000),
          timeDate: new Date(nowtime + (3600 * 24 * 1000)),
          symbol: this.$t('m.sell.custime')
        }
        this.timeList.push(add)
        add = {
          id: 1,
          time: nowtime + (3600 * 24 * 1000),
          timeDate: new Date(nowtime + (3600 * 24 * 1000)),
          symbol: '1 ' + this.$t('m.day')
        }
        this.timeList.push(add)
        add = {
          id: 2,
          time: nowtime + (3600 * 24 * 3 * 1000),
          timeDate: new Date(nowtime + (3600 * 24 * 3 * 1000)),
          symbol: '3 ' + this.$t('m.day')
        }
        this.timeList.push(add)
        add = {
          id: 3,
          time: nowtime + (3600 * 24 * 7 * 1000),
          timeDate: new Date(nowtime + (3600 * 24 * 7 * 1000)),
          symbol: '7 ' + this.$t('m.day')
        }
        this.timeList.push(add)
        add = {
          id: 4,
          time: nowtime + (3600 * 24 * 15 * 1000),
          timeDate: new Date(nowtime + (3600 * 24 * 15 * 1000)),
          symbol: '15 ' + this.$t('m.day')
        }
        this.timeList.push(add)
        add = {
          id: 5,
          time: nowtime + (3600 * 24 * 30 * 1000),
          timeDate: new Date(nowtime + (3600 * 24 * 30 * 1000)),
          symbol: '30 ' + this.$t('m.day')
        }
        this.timeList.push(add)
        this.timeList.forEach(item => {
          item.time = this._getHour(item.time)
          item.timeDate = new Date(item.time)
        })
        if (this.ruleForm.exprie.id >= this.timeList.length) this.ruleForm.exprie = this.timeList[2]
        else this.ruleForm.exprie = this.timeList[this.ruleForm.exprie.id]
        this.marketticker = {
          base: 'CNY',
          base_volume: '',
          highest_bid: '0',
          latest: '0',
          lowest_ask: '0',
          percent_change: '0',
          quote: 'USD',
          quote_volume: '',
          time: '2019-06-14T09:29:37'
        }
      },

      init () {
        this.loading = 1
        this.initDef()
        this.feeGet()
      },
      getAuthorUrl () {
        if (!this.needAuthor || this.author_url !== '') return
        this.loading++
        Apis.instance().db_api().exec('get_author_by_account', [this.$store.state.admin_id]).then((balance) => {
          if (balance && balance.enable === 'identity_enable') this.author_url = balance.url
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

      // get_trade_history
      // get_trade_history_by_sequence
      getBalance () {
        this.loading++
        Apis.instance().db_api().exec('get_account_balances', [this.$store.state.userDataSid, [this.firstSymbol.id, this.secondSymbol.id]]).then((balance) => {
          let banlan1 = balance.filter((val) => {
            return this.firstSymbol.symbol === val.symbol
          })
          if (banlan1 && banlan1.length === 1) {
            formatAssets.updateAssets(this.firstSymbol.symbol, banlan1[0].amount)
            this.firstBalance = banlan1[0].amount
          }
          banlan1 = balance.filter((val) => {
            return this.secondSymbol.symbol === val.symbol
          })
          if (banlan1 && banlan1.length === 1) {
            formatAssets.updateAssets(this.secondSymbol.symbol, banlan1[0].amount)
            this.secondBalance = banlan1[0].amount
          }
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
      getPrice () {
        this.loading++
        Apis.instance().db_api().exec('get_ticker', [this.firstSymbol.symbol, this.secondSymbol.symbol, false]).then((balance) => {
          this.marketticker = balance
          if (Number(this.marketticker.highest_bid) !== 0) this.marketticker.highest_bid = (0.1 / Number(this.marketticker.highest_bid)).toFixed(this.priceprecision)
          else this.marketticker.highest_bid = Number(this.marketticker.highest_bid).toFixed(this.priceprecision)
          if (Number(this.marketticker.lowest_ask) !== 0) this.marketticker.lowest_ask = (0.1 / Number(this.marketticker.lowest_ask)).toFixed(this.priceprecision)
          else this.marketticker.lowest_ask = Number(this.marketticker.lowest_ask).toFixed(this.priceprecision)
          if (Number(this.marketticker.latest) !== 0) this.marketticker.latest = (0.1 / Number(this.marketticker.latest)).toFixed(this.priceprecision)
          else this.marketticker.latest = Number(this.marketticker.latest).toFixed(this.priceprecision)
          if (Number(this.marketticker.base_volume) === 0) this.marketticker.avg_price = Number(0).toFixed(this.priceprecision)
          else this.marketticker.avg_price = (Number(this.marketticker.quote_volume) / Number(this.marketticker.base_volume)).toFixed(this.priceprecision)
          if (this.initPrice) this.ruleForm.price = this.marketticker.avg_price
          this.initPrice = false
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
      // 获得预计手续费和用户的ZOS资产
      feeGet () {
        this.loading++
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'limit_order_create')
          .then((res) => {
            this.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.feeZosP = res.feeAmount.precision
            this.zos_balance = res.fee_balance / Math.pow(10, res.precision)
            formatAssets.updateAssets(res.symbol, res.fee_balance)
            this.loading--
          })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
            this.loading--
          })
      },
      clicksell () {
        this.confirmTitle = this.$t('m.sell.' + this.selltype + '1') + this.firstSymbol.symbol
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            if (this.ruleForm.exprie.timeDate < this.timeList[1].timeDate) {
              this.$message({
                type: 'warning',
                message: this.$t('m.sell.expricetime')
              })
              return 0
            }
            this._isAuthenticator()
          }
        })
      },
      borrowSubmit () {
        this.remodeid = undefined
        this.showconfig = false
        this.comfirmPassword = true
      },
      removeSubmit (v) {
        this.remodeid = v
        this.comfirmPassword = true
      },
      passComfirm (v) {
        this.comfirmPassword = false
        if (v === this.$store.state.userDataSid) {
          if (this.remodeid === undefined) this.sellCreate()
          else this.sellRemove(this.remodeid)
        }
        this.remodeid = undefined
      },
      kycclose () {
        this.hintKycDialog = false
        this.checkinfoDialog = false
      },
      _isAuthenticator () {
        if (!this.needAuthor) {
          this.showconfig = true
          return
        }
        this.showconfig = false
        Apis.instance().db_api().exec('is_authenticator', [this.$store.state.userDataSid, 5, this.firstSymbol.id, this.$store.state.admin_id]).then(status => {
          if (status === 2000) {
            this.kycInfo = {}
            this.kycInfo.name = undefined
            this.showconfig = true
          } else if (status === -5) {
            this.$message({
              message: this.$t('m.kyc.statues5'),
              type: 'error'
            })
          } else {
            if (this.author_url === '' || this.author_url === undefined) {
              this.$message({
                message: this.$t('m.params.noAuthor') + ' url: ' + this.author_url,
                type: 'error'
              })
            } else {
              this.kycurl = this.author_url
              kycStatus(this.kycurl + '/zos-kyc/', {chainid: this.$store.state.userDataSid, authorid: this.$store.state.admin_id}).then(res => {
                this.kycStatusCode = res.ret_code
                if (status > 0) {
                  this.kycInfo = {}
                  this.kycInfo.name = res.name
                  this.showconfig = true
                } else {
                  if (res.ret_code === '0' || res.ret_code === '1') {
                    this.kycInfo = {}
                    this.kycInfo.name = res.name
                    this.kycInfo.ictype = res.ictype
                    this.kycInfo.icno = res.icno
                    this.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
                    this.checkinfoDialog = true
                  } else {
                    this.hintKycDialog = true
                  }
                }
              }).catch(err => {
                console.log(err)
                this.$message({
                  message: this.$t('m.httpUtils.warning') + ' error: ' + err,
                  type: 'error'
                })
              })
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      sellCreate () {
        let mode = 0
        let sell = {}
        let buy = {}
        if (!this._isSell()) { // 卖入
          buy = {amount: (Number(this.ruleForm.sell) * Math.pow(10, this.firstSymbol.precision)).toFixed(0), asset_id: this.firstSymbol.id}
          sell = {amount: (Number(this.ruleForm.buy) * Math.pow(10, this.secondSymbol.precision)).toFixed(0), asset_id: this.secondSymbol.id}
          mode += 1
        } else { // 卖出
          sell = {amount: (Number(this.ruleForm.sell) * Math.pow(10, this.firstSymbol.precision)).toFixed(0), asset_id: this.firstSymbol.id}
          buy = {amount: (Number(this.ruleForm.buy) * Math.pow(10, this.secondSymbol.precision)).toFixed(0), asset_id: this.secondSymbol.id}
        }
        if (this.ruleForm.mode.id === 0) mode += 4
        else mode += 8

        this.$emit('sellloading', true)
        ZOSInstance.limit_order_create(
          this.$store.state.userDataSid,
          sell,
          buy,
          mode,
          this.ruleForm.exprie.time / 1000
        ).then(res => {
          this.feeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
          this.feeZosP = res.fee.fee_precision
          this.tr = res.tr
          this.sellSubmit()
        }).catch((err) => {
          this.$emit('sellloading', false)
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      sellRemove (vid) {
        this.$emit('sellloading', true)
        ZOSInstance.limit_order_cancel(
          this.$store.state.userDataSid,
          vid
        ).then(res => {
          this.tr = res.tr
          this.sellSubmit()
        }).catch((err) => {
          this.$emit('sellloading', false)
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      // 提交借款
      sellSubmit () {
        // 处理广播
        ZOSInstance.broadcastTransaction(this.tr)
          .then((res) => {
            this.$emit('sellevent', true)
            this.$emit('sellloading', false)
            // '提交成功'
            MessageBox.alert(this.$t('m.badloans.subSucc'), {
              confirmButtonText: this.$t('m.sure')
            })
          }).catch((err) => {
            this.$emit('sellloading', false)
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
          })
      }
    },
    destroyed () {
      setStore('sellbase4' + this.selltype, this.ruleForm)
    },
    mounted () {
      this.loading = true
      let selltype = getStore('sellbase4' + this.selltype)
      if (selltype) this.ruleForm = JSON.parse(getStore('sellbase4' + this.selltype))
      this.ruleForm.sell = 0
      this.ruleForm.buy = 0
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
  @import '../../../theme/utils';
  @import '../../../theme/theme';
  .p-lable{
    width: 280px
  }
  .sell-btn{
    margin-top: 30px!important;
    float: right;
    background: red!important;
    color: white!important;
    background-color: red!important;
    border-color: red!important;
    width: 65px;
    height: 50px;
    padding: 1px 20px!important;
  }
  .sell-btn[disabled]{
    background: rgb(176, 98, 98)!important;
    border-color: rgb(218, 87, 87)!important;
  }
  .buy-btn{
    float: right;
    margin-top: 30px!important;
    background: rgb(0, 98, 128)!important;
    background-color: rgb(0, 98, 128)!important;
    border-color: rgb(0, 98, 128)!important;
    color: white!important;
    width: 65px;
    height: 50px;
    padding: 1px 20px!important;
  }
  .buy-btn[disabled]{
    background: rgb(66, 106, 118)!important;
    border-color: rgb(53, 126, 148)!important;
  }
  .timepick {
    width: 180px!important;
    border: 0px!important;
    height: 20px!important;
    line-height: 20px!important;
    text-decoration:underline;
    .el-input__inner {
      border: 0px!important;
      height: 20px!important;
      padding-left: 10px!important;
      padding-right: 10px!important;
      text-decoration:underline!important;
      color: #5079d9!important;
    }
    .el-icon-time:before {
      content: "";
      height: 20px!important;
    }
  }
  </style>

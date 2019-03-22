<template>
  <div class="w store-content" style="max-width: 1152px">
    <div v-loading="loadingmain" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-show="!loadingmain" class="margin-t10">
          <!--第一部分的统计-->
          <div class="feel feel-top margin-b20">
            <div class="feel-0 feel">
              <div class="feel-left">
                <span class="f12 light-grey">{{$t('m.home.borrowNum')}}</span>
                <br>
                <span class="f26 dark-grey">{{loanCount | formatDigitalCurrency}}</span>
              </div>
              <div style="flex: 1"></div>
              <div class="feel-right">
                <img :src="`/static/images/today0${_theme}.png`" width="50" height="30" />
              </div>
            </div>
            <div class="feel-0 feel">
              <div class="feel-left">
                <span class="f12 light-grey">{{$t('m.home.investNum')}}</span>
                <br>
                <span class="f26 dark-grey">{{investCount | formatDigitalCurrency}}</span>
              </div>
              <div style="flex: 1"></div>
              <div class="feel-right">
                <img :src="`/static/images/today1${_theme}.png`" width="50" height="30" />
              </div>
            </div>

            <div class="feel-0 feel">
              <div class="feel-left">
                <span class="f12 light-grey">{{$t('m.home.todayNum')}}</span>
                <br>
                <span class="f26 dark-grey">{{todayLoanCount | formatDigitalCurrency}}</span>
              </div>
              <div style="flex: 1"></div>
              <div class="feel-right">
                <img :src="`/static/images/today2${_theme}.png`" width="50" height="30" />
              </div>
            </div>

            <div class="feel-0 feel">
              <div class="feel-left">
                <span class="f12 light-grey">{{$t('m.home.todayInverNum')}}</span>
                <br>
                <span class="f26 dark-grey">{{todayInvestCount | formatDigitalCurrency}}</span>
              </div>
              <div style="flex: 1"></div>
              <div class="feel-right">
                <img :src="`/static/images/today3${_theme}.png`" width="50" height="30" />
              </div>
            </div>

          </div>
          <!--第二部分的绘图-->
          <div class="feel margin-b20" id="feel-main" style="flex: 1 1 auto">
            <div id="feel-1" class="feel-1" style="position: relative;">
              <!--饼图背景-->
              <div id="my-chart" :style="{width: '300px', height: '300px', position: 'absolute', top: '-20%', right: '-20%'}"></div>
              <div class="chart-data">
                <div class="chart-top">
                  <!--饼图-->
                  <div id="my-chart1" :style="{width: '160px', height: '160px'}"></div>
                  <div class="chart-top-right margin-t10">
                    <div class="pr">
                      <el-select
                        v-model="tradingOnValue"
                        :placeholder="$t('m.pChose')"
                        @change="tradingShow"
                        style="width:160px;z-index: 3; opacity: 0;">
                        <el-option
                          v-for="(item, index) in baseQuote"
                          :key="index"
                          :label="item.market.replace(/\//g, ' ⇋ ')"
                          :value="item">
                        </el-option>
                      </el-select>
                      <!--.replace(/\//g, ' ⇋ ')"-->
                      <div class="trading-on f12 margin-b10 pa" style="left:0; top:10px;z-index: 1; overflow: hidden">
                        <!--<span>CNY</span>-->
                        <!--<i class="el-icon-sort margin-l10"></i>-->
                        <!--<span style="margin-left: -14px">BTC</span>-->
                        <!--之前全取出来时，用的选的index-->
                        {{tradingShowValue.replace(/\//g, ' ⇋ ')}}
                        <i class="el-icon-caret-bottom margin-l10"></i>
                      </div>
                    </div>
                      <p class="f26">{{earningsAmount}}</p>
                    <!--投资人已获收益-->
                      <p class="f12 opacity5">{{$t('m.home.obtained')}}({{baseSymbol}})</p>
                  </div>
                </div>
                <div style="flex:1"></div>
                <div class="chart-bottom">
                  <div class="chart-bottom-0">
                    <span class="f20">
                      {{loanAmount | formatDecimalCurrency}}
                    </span>
                    <br>
                    <!--借款金额-->
                    <span class="f12 opacity5">{{$t('m.home.amount')}}(
                      {{baseSymbol}}
                      )</span>
                  </div>
                  <div class="chart-bottom-0">
                    <span class="f20">
                      {{collateralizeAmount | formatDecimalCurrency}}
                    </span>
                    <br>
                    <!--抵押物数量-->
                    <span class="f12 opacity5">{{$t('m.borrow.pawnNum')}}(
                      {{quoteSymbol}}
                      )</span>
                  </div>
                  <div class="chart-bottom-0">
                    <span class="f20">{{guarantee}}%</span>
                    <br>
                    <!--平均保本率-->
                    <span class="f12 opacity5">{{$t('m.home.average')}}</span>
                  </div>
                </div>
              </div>
            </div>
            <!--曲线图-->
            <div class="feel-2 margin-l20" style="border-radius: 4px">
              <div class="pr">
                <div class="select-fn" style="z-index: 1004">
                  <div class="feel select-type">
                    <el-popover
                      v-for="(item,index) in selectTypeArr"
                      :key="index"
                      popper-class="help"
                      placement="bottom"
                      trigger="hover"
                      :content="item.value"
                    >
                    <span slot="reference">
                      <span :style="item.color" class="type-span"
                            :class="{opacity:Number(chooseed) === index}"
                            @click="selected(item.value, index)"></span>
                    </span>
                    </el-popover>
                  </div>
                </div>
                <div class="select-fns" style="z-index: 1004">
                  <div class="feel select-time">
                    <el-popover
                      v-for="(item,index) in selectTimeArr"
                      :key="index"
                      popper-class="help"
                      placement="right"
                      trigger="hover"
                      :content="item.value">
                      <span slot="reference">
                        <span :style="item.color" class="type-span"
                              :class="{opacity:Number(chooseeds) === index}"
                              @click="selecteds(item.value, index)"></span>
                      </span>
                    </el-popover>
                  </div>
                </div>
                <div id="my-chart2" :style="{width: '650px',  height: '290px'}"></div>
              </div>
            </div>
          </div>
          <!--第三部分的轮播-->
          <div class="feel">
            <div class="carousel">
              <h1 class="text-center dark-grey">{{$t('m.home.investing')}}</h1>
              <el-carousel
                height="170px"
                :autoplay="false"
              >
                <el-carousel-item v-for="(item,index) in tableDataNewInvest" :key="index">
                  <ul class="invest-new">
                    <li v-for="(items, indexs) in item" :key="indexs" @click="newInvestLink(items)" class="curp">
                      <a @click="toGoInvestHis(items)">
                        <span class="isusername margin-l10">{{items.issuer.name}}</span>
                      </a>
                      {{$t('m.home.loan')}}
                      {{items.amount_to_invest.amount / Math.pow(10, items.asset_to_invest.precision) | formatLegalCurrency(items.asset_to_invest.symbol, items.asset_to_invest.precision)}}
                      <div style="flex:1"></div>
                      <span>{{items.invest_time | formatDateStr}}</span>
                    </li>
                  </ul>
                </el-carousel-item>
              </el-carousel>
            </div>

            <div class="carousel1 margin-l20">
              <h1 class="text-center dark-grey">{{$t('m.home.borrowing')}}</h1>
              <el-carousel
                height="140px"
                :autoplay="true"
                indicator-position="none"
              >
                <el-carousel-item v-for="(item, index) in tableDataNew" :key="index">
                  <div class="new-loan" style="margin-top: 30px">
                    <div class="new-loan-left curp" v-for="(items, indexs) in item" :key="indexs" @click="newLoanLink(items)">
                      <div class="new-loan-left-top">
                          <a @click="toGoborrowHis(items)">
                            <span class="isusername">{{items.issuer.name}}</span>
                          </a>
                        {{$t('m.home.mortgage')}}
                        {{(items.amount_to_collateralize.amount / Math.pow(10, items.asset_to_collateralize.precision)) |
                        formatLegalCurrency(items.asset_to_collateralize.symbol, items.asset_to_collateralize.precision)}}
                        {{$t('m.home.borrow')}}
                        <p class="f26 dark-grey" style="margin-top: 5px; margin-bottom: 5px">
                          {{(items.amount_to_loan.amount / Math.pow(10, items.asset_to_loan.precision)) |
                          formatLegalCurrency(items.asset_to_loan.symbol, items.asset_to_loan.precision)}}
                        </p>
                        <span class="light-grey">{{items.loan_time | formatDateStr}}</span>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
              <p class="text-center">
                <!--立即借款-->
                <button class="f12 loan-button" @click="toLoan">{{$t('m.home.toBorrow')}}</button>
              </p>
            </div>
          </div>
        </div>
      <div class="home-index" v-if="!loadingmain">

        <div class="advantage margin-b10">
          <!--业务优势-->
          <h1 class="list f16">{{$t('m.home.business')}}</h1>
          <div class="list">
            <div class="list-item">
              <img :src="`/static/images/advantage01${_theme}.png`" width="100" height="100" />
              <div class="caption">
                <!--借款门槛低-->
                <h3>{{$t('m.home.threshold')}}</h3>
                <!--押币就能借，随时可还-->
                <p>{{$t('m.home.anyTime')}}</p>
              </div>
            </div>
            <div class="list-item">
              <img :src="`/static/images/advantage02${_theme}.png`" width="100" height="100" />
              <div class="caption">
                <!--福利多样-->
                <h3>{{$t('m.home.welfare')}}</h3>
                <!--邀请好友，交易挖矿 月月精彩活动不断-->
                <p>{{$t('m.home.activity')}}</p>
              </div>
            </div>
            <div class="list-item">
              <img :src="`/static/images/advantage03${_theme}.png`" width="100" height="100" />
              <div class="caption">
                <!--种类多样-->
                <h3>{{$t('m.home.diversity')}}</h3>
                <p>USD、CNY、ETH、BTC
                  <!--都支持持币用户短期融资新选择-->
                  {{$t('m.home.financing')}}
                </p>
              </div>
            </div>
            <div class="list-item">
              <img :src="`/static/images/advantage04${_theme}.png`" width="100" height="100" />
              <div class="caption">
                <!--借款收益高-->
                <h3>{{$t('m.home.income')}}</h3>
                <!--100元起投，收益高-->
                <p>{{$t('m.home.investment')}}</p>
              </div>
            </div>
            <div class="list-item">
              <img :src="`/static/images/advantage05${_theme}.png`" width="100" height="100" />
              <div class="caption">
                <!--业务全球化-->
                <h3>{{$t('m.home.globalization')}}</h3>
                <!--轻松享受来自世界各地的金融资源和服务-->
                <p>{{$t('m.home.enjoy')}}</p>
              </div>
            </div>
          </div>

        </div>

        <div class="advantage margin-b10">
          <h1 class="list f16">
            <!--使用流程-->
            {{$t('m.home.process')}}
          </h1>
          <div class="list using-progress">
            <div class="using-progress-list margin-b40">
              <div class="using-progress-left">
                <img :src="`/static/images/using01${_theme}.png`" width="114" height="78" />
                <div class="caption">
                  <!--登录平台-->
                  <h3 class="f16">{{$t('m.home.platform')}}</h3>
                </div>
              </div>

              <ul class="using-progress-right">
                <!--点击右上角的注册/登录，注册您的新账号；如果已有账号，可以直接登录-->
                <li>· {{$t('m.home.corner')}}</li>
                <!--您的账号为区块链上的唯一身份认证，请务必牢记并保持好密码-->
                <li>· {{$t('m.home.identity')}}</li>
                <!--一个账号可以使用zos旗下的多种产品-->
                <li>· {{$t('m.home.products')}}</li>
              </ul>
            </div>

            <div class="using-progress-list margin-b40">
              <div class="using-progress-left">
                <img :src="`/static/images/using02${_theme}.png`" width="114" height="78" />
                <div class="caption">
                  <!--充值/充币-->
                  <h3 class="f16">{{$t('m.home.prepaid')}}</h3>
                </div>
              </div>

              <ul class="using-progress-right">
                <!--进入”资产”模块，可以查看你的资产-->
                <li>· {{$t('m.home.assets')}}</li>
                <!--点击充值/充币，可以把法币或者数字货币充到你的账户中-->
                <li>· {{$t('m.home.account')}}</li>
                <!--充值法币时，需要先做kyc认证-->
                <li>· {{$t('m.home.fiat')}}</li>
              </ul>
            </div>

            <div class="using-progress-list margin-b40">
              <div class="using-progress-left">
                <img :src="`/static/images/using03${_theme}.png`" width="114" height="78" />
                <div class="caption">
                  <!--借款/投资-->
                  <h3 class="f16">{{$t('m.home.investments')}}</h3>
                </div>
              </div>

              <ul class="using-progress-right">
                <!--资产里有数字资产或法币资产时，你就可以借款或者投资-->
                <li>· {{$t('m.home.tender')}}</li>
                <!--借款成功后，你需要按月归还利息以保证抵押物安全和信用-->
                <li>· {{$t('m.home.ensure')}}</li>
                <li>· {{$t('m.home.interest')}}</li>
                <!--如果借方违约，运营商会处理抵押物以保证投资方的权益-->
                <li>· {{$t('m.home.borrower')}}</li>
              </ul>
            </div>

            <div class="using-progress-list">
              <div class="using-progress-left margin-b10">
                <img :src="`/static/images/using04${_theme}.png`" width="114" height="78" />
                <div class="caption">
                  <!--提现/提币-->
                  <h3 class="f16">{{$t('m.home.currency')}}</h3>
                </div>
              </div>

              <ul class="using-progress-right">
                <!--借款所得和投资收益会及时进入你的资产中-->
                <li>· {{$t('m.home.timely')}}</li>
                <!--你可以随时提走你的借款和投资收益-->
                <li>· {{$t('m.home.returns')}}</li>
              </ul>
            </div>
            <div class="using-progress-list" style="padding-bottom: 0">
              <div class="using-progress-left" style="margin-bottom: 0 !important;">
              </div>

              <ul class="using-progress-right" style="background: none;padding-right:0; padding-bottom: 0; margin-bottom: 0">
                <!--点击这里，-->
                <!--查看更多帮助信息-->
                <h2 class="list more" style="padding-bottom: 0"><a>{{$t('m.home.click')}}</a><span style="color: #000">{{$t('m.home.see')}}</span></h2>
              </ul>

            </div>
          </div>

        </div>

        <div class="advantage margin-b10">
          <!--安全保障-->
          <h1 class="list f16">{{$t('m.home.security')}}</h1>
          <div class="security">
            <div class="security-left">
              <div class="security-left-top">
                <span>01</span>
                <!--投资本金有保障-->
                <h3>{{$t('m.home.guaranteed')}}</h3>
              </div>
              <div class="security-left-bottom"></div>
              <!--区块链合约执行运营商承诺的保本率-->
              <p>{{$t('m.home.breakeven')}}</p>
            </div>
            <div class="security-right">
              <img src="/static/images/security01.png" width="400" height="400" />
            </div>
          </div>

          <div class="security">
            <div class="security-right">
              <img src="/static/images/security02.png" width="400" height="400" />
            </div>

            <div class="security-left">
              <div class="security-left-top">
                <span>02</span>
                <!--足额抵押有保障-->
                <h3>{{$t('m.home.specified')}}</h3>
              </div>
              <div class="security-left-bottom"></div>
              <!--由借款方按150%以上足额抵押数字货币-->
              <p>{{$t('m.home.digital')}}</p>
            </div>

          </div>

          <div class="security" style="padding-bottom: 30px">
            <div class="security-left">
              <div class="security-left-top">
                <span>03</span>
                <!--运营商风险拨备-->
                <h3>{{$t('m.home.operators')}}</h3>
              </div>
              <div class="security-left-bottom"></div>
              <!--运营商按业务量比例提供风险拨备，用于投资赔付-->
              <p>{{$t('m.home.provide')}}</p>
            </div>
            <div class="security-right">
              <img src="/static/images/security03.png" width="400" height="400" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--登录-->
    <login-dialog :visible="$store.state.loginPath !== undefined"></login-dialog>
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import { getStore, setStore } from '/js-utils/storage'
  import loginDialog from '/path-page/Login/loginDialog'
  import {Apis} from 'zosjs-ws'
  import { loginToPath } from '/js-utils/until.js'
  export default {
    components: {loginDialog},
    data () {
      return {
        loadingmain: false,
        loanCount: '',
        investCount: '',
        todayLoanCount: '',
        todayInvestCount: '',
        // 交易对的所有数据
        arrayTotal: [],
        arrayToday: [],
        activeName: 'first',
        tableDataNew: [],
        tableDataNewInvest: [],
        startTimes: '',
        intervalTime: null,
        feelLine: '',
        tradingOn: [],
        tradingShowValue: '',
        tradingOnValue: 0,
        tradingOnValue_sel: 10000,
        loanAmount: 0,
        baseSymbol: '',
        collateralizeAmount: 0,
        quoteSymbol: '',
        guarantee: '',
        recycleNum: '',
        loanNum: '',
        earningsAmount: '',
        feedModel: '',
        dayDetail: [],
        weekDetail: [],
        monthDetail: [],
        totalDate: [],
        safeData: [],
        warning: [],
        badData: [],
        currentTime: [],
        currentWeek: [],
        currentMonth: [],
        baseQuote: [],
        baseQuoteId: [],
        // selectTypeArr
        selectTypeArr: [
          {
            value: this.$t('m.home.loanAmount'),
            color: 'background:rgba(144, 238, 144, 1)'
          },
          {
            value: this.$t('m.borrow.pawnNum'),
            color: 'background:rgba(0, 206, 209, 1)'
          },
          {
            value: this.$t('m.home.orderCount'),
            color: 'background:rgba(30, 144, 255, 1)'
          }
        ],
        selectType: this.$t('m.home.loanAmount'),
        selectTimeArr: [
          {
            value: this.$t('m.home.day'),
            color: 'background:rgb(255, 69, 0)'
          },
          {
            value: this.$t('m.home.week'),
            color: 'background:rgb(255, 140, 0)'
          },
          {
            value: this.$t('m.months'),
            color: 'background:rgb(255, 215, 0)'
          }
        ],
        selectTime: this.$t('m.home.day'),
        drawLineData: [],
        collateralPrecision: '',
        loanPrecision: '',
        chooseed: 0,
        chooseeds: 0
      }
    },
    watch: {
      'nowTime': {
        handler: function (oldVal, newVal) {
          console.log(oldVal, newVal)
        }
      },
      '$i18n.locale': {
        handler: function (val, newVale) {
          this.drawLine()
        },
        deep: true
      }
    },
    computed: {
      _theme () {
        return this.$store.state.configTheme
      },
      _themeColor () {
        if (this._theme === '1a1d5c') {
          return '#ffffff'
        } else {
          return '#' + this._theme
        }
      }
    },
    methods: {
      toGoInvestHis (items) {
        event.cancelBubble = true
        let state = 'investsuccess'
        if (items.order_info.order_state === 1 || items.order_info.order_state === 3) state = 'investing'
        this.$router.push({
          path: '/history/investHis/' + state,
          query: {
            accName: items.issuer.name,
            accID: items.issuer.id
          }
        })
      },
      toGoborrowHis (items) {
        event.cancelBubble = true
        let state = 'borrowsuccess'
        if (items.order_state === 1 || items.order_state === 3) state = 'borrowing'
        this.$router.push({
          path: '/history/borrowHis/' + state,
          query: {
            accName: items.issuer.name,
            accID: items.issuer.id
          }
        })
      },
      // item.value
      selected (v, i) {
        if (this.selectType === v && this.chooseed === i) return
        this.selectType = v
        this.chooseed = i
        setStore('selectType', v)
        setStore('chooseed', i)
        this.whichDayData()
      },
      //
      selecteds (v, i) {
        if (this.selectTime === v && this.chooseeds === i) return
        this.selectTime = v
        this.chooseeds = i
        setStore('selectTime', v)
        setStore('chooseeds', i)
        this.whichDayData()
      },
      // 首页去借款
      toLoan () {
        var loginPath = {path: '/borrow/borrows'}
        loginToPath(ZOSInstance, this, loginPath)
      },
      // 选择交易对
      tradingShow () {
        if (this.tradingOnValue_sel === this.tradingOnValue.market) return
        this.tradingOnValue_sel = this.tradingOnValue.market
        if (this.arrayTotal.length > 0) {
          this.tradingShowValue = this.tradingOnValue.market
          setStore('tradingOnValue', this.tradingOnValue)
        }
        this.whichDayData()
      },
      // 设置Y轴数据
      setData (res) {
        this.currentTime = []
        this.currentWeek = []
        this.currentMonth = []
        this.loanPrecision = res[0].base_precision
        this.collateralPrecision = res[0].quote_precision
        let arrSize = [30, 10, 6] // 日，周，月
        let dayDetail = res[0].day_detail
        let weekDetail = res[0].week_detail
        let monthDetail = res[0].month_detail
        this.loanNum = res[0].total_laon_count
        this.recycleNum = res[0].total_recycle_count
        this.loanAmount = res[0].total_laon_amount / Math.pow(10, this.loanPrecision)
        this.collateralizeAmount = res[0].total_collateralize_amount / Math.pow(10, this.collateralPrecision)
        this.earningsAmount = res[0].total_earnings_amount / Math.pow(10, this.loanPrecision)
        this.guarantee = this.loanNum === 0 ? 100 : (((this.loanNum - this.recycleNum) / this.loanNum) * 100).toFixed(2)// 保本率
        // 数组从后往前，取arrSize配置位数,优先从月,周，天
        let loanPre = Math.pow(10, this.loanPrecision)
        let collatePre = Math.pow(10, this.collateralPrecision)

        // '月'
        if (this.selectTime === this.$t('m.months')) {
          monthDetail.slice(-arrSize[2]).forEach(item => {
            // 借款数量
            if (this.selectType === this.$t('m.home.loanAmount')) {
              this.totalDate.push(item.total_loan / loanPre)
              this.warning.push(item.collateral_loan / loanPre)
              this.badData.push(item.squeeze_loan / loanPre)
              this.safeData.push(Number(item.total_loan / loanPre) - Number(item.collateral_loan / loanPre) - Number(item.squeeze_loan / loanPre))
              // '投资数量'
            } else if (this.selectType === this.$t('m.borrow.pawnNum')) {
              this.totalDate.push(item.total_collateralize / collatePre)
              this.warning.push(item.collateral_collateralize / collatePre)
              this.badData.push(item.squeeze_collateralize / collatePre)
              this.safeData.push(Number(item.total_collateralize / collatePre) - Number(item.collateral_collateralize / collatePre) - Number(item.squeeze_collateralize / collatePre))
            } else {
              this.totalDate.push(item.total_count)
              this.warning.push(item.collateral_count)
              this.badData.push(item.squeeze_count)
              this.safeData.push(Number(item.total_count) - Number(item.collateral_count) - Number(item.squeeze_count))
            }
            // X轴
            let days = item.day.toString().substring(0, 4) + '-' + item.day.toString().substring(4)
            this.currentTime.push(days)
          })
        } else if (this.selectTime === this.$t('m.home.week')) {
          weekDetail.slice(-arrSize[1]).forEach(item => {
            // '借款数量'
            if (this.selectType === this.$t('m.home.loanAmount')) {
              this.totalDate.push(item.total_loan / loanPre)
              this.warning.push(item.collateral_loan / loanPre)
              this.badData.push(item.squeeze_loan / loanPre)
              this.safeData.push(Number(item.total_loan / loanPre) - Number(item.collateral_loan / loanPre) - Number(item.squeeze_loan / loanPre))
            } else if (this.selectType === this.$t('m.borrow.pawnNum')) {
              this.totalDate.push(item.total_collateralize / collatePre)
              this.warning.push(item.collateral_collateralize / collatePre)
              this.badData.push(item.squeeze_collateralize / collatePre)
              this.safeData.push(Number(item.total_collateralize / collatePre) - Number(item.collateral_collateralize / collatePre) - Number(item.squeeze_collateralize / collatePre))
            } else {
              this.totalDate.push(item.total_count)
              this.warning.push(item.collateral_count)
              this.badData.push(item.squeeze_count)
              this.safeData.push(Number(item.total_count) - Number(item.collateral_count) - Number(item.squeeze_count))
            }
            // X轴
            this.currentTime.push(this.$t('m.params.the') + item.day + this.$t('m.home.week'))
          })
        } else if (this.selectTime === this.$t('m.home.day')) {
          dayDetail.slice(-arrSize[0]).forEach(item => {
            // '借款数量'
            if (this.selectType === this.$t('m.home.loanAmount')) {
              this.totalDate.push(item.total_loan / loanPre)
              this.warning.push(item.collateral_loan / loanPre)
              this.badData.push(item.squeeze_loan / loanPre)
              this.safeData.push(Number(item.total_loan / loanPre) - Number(item.collateral_loan / loanPre) - Number(item.squeeze_loan / loanPre))
            } else if (this.selectType === this.$t('m.borrow.pawnNum')) {
              this.totalDate.push(item.total_collateralize / collatePre)
              this.warning.push(item.collateral_collateralize / collatePre)
              this.badData.push(item.squeeze_collateralize / collatePre)
              this.safeData.push(Number(item.total_collateralize / collatePre) - Number(item.collateral_collateralize / collatePre) - Number(item.squeeze_collateralize / collatePre))
            } else {
              this.totalDate.push(item.total_count)
              this.warning.push(item.collateral_count)
              this.badData.push(item.squeeze_count)
              this.safeData.push(Number(item.total_count) - Number(item.collateral_count) - Number(item.squeeze_count))
            }
            // X轴
            this.currentTime.push(item.day_tm.substring(0, 10))
          })
        } else {
          if (monthDetail.length > arrSize[2]) {
            monthDetail.slice(-arrSize[2]).forEach(item => {
              if (this.selectType === this.$t('m.home.loanAmount')) {
                this.totalDate.push(item.total_loan / loanPre)
                this.warning.push(item.collateral_loan / loanPre)
                this.badData.push(item.squeeze_loan / loanPre)
                this.safeData.push(Number(item.total_loan / loanPre) - Number(item.collateral_loan / loanPre) - Number(item.squeeze_loan / loanPre))
              } else if (this.selectType === this.$t('m.borrow.pawnNum')) {
                this.totalDate.push(item.total_collateralize / collatePre)
                this.warning.push(item.collateral_collateralize / collatePre)
                this.badData.push(item.squeeze_collateralize / collatePre)
                this.safeData.push(Number(item.total_collateralize / collatePre) - Number(item.collateral_collateralize / collatePre) - Number(item.squeeze_collateralize / collatePre))
              } else {
                this.totalDate.push(item.total_count)
                this.warning.push(item.collateral_count)
                this.badData.push(item.squeeze_count)
                this.safeData.push(Number(item.total_count) - Number(item.collateral_count) - Number(item.squeeze_count))
              }
              // X轴
              let days = item.day.toString().substring(0, 4) + '-' + item.day.toString().substring(4)
              this.currentTime.push(days)
            })
          } else if (weekDetail.length > arrSize[1]) {
            weekDetail.slice(-arrSize[1]).forEach(item => {
              if (this.selectType === this.$t('m.home.loanAmount')) {
                this.totalDate.push(item.total_loan / loanPre)
                this.warning.push(item.collateral_loan / loanPre)
                this.badData.push(item.squeeze_loan / loanPre)
                this.safeData.push(Number(item.total_loan / loanPre) - Number(item.collateral_loan / loanPre) - Number(item.squeeze_loan / loanPre))
              } else if (this.selectType === this.$t('m.borrow.pawnNum')) {
                this.totalDate.push(item.total_collateralize / collatePre)
                this.warning.push(item.collateral_collateralize / collatePre)
                this.badData.push(item.squeeze_collateralize / collatePre)
                this.safeData.push(Number(item.total_collateralize / collatePre) - Number(item.collateral_collateralize / collatePre) - Number(item.squeeze_collateralize / collatePre))
              } else {
                this.totalDate.push(item.total_count)
                this.warning.push(item.collateral_count)
                this.badData.push(item.squeeze_count)
                this.safeData.push(Number(item.total_count) - Number(item.collateral_count) - Number(item.squeeze_count))
              }
              // X轴
              this.currentTime.push(this.$t('m.params.the') + item.day + this.$t('m.home.week'))
            })
          } else {
            dayDetail.slice(-arrSize[0]).forEach(item => {
              if (this.selectType === this.$t('m.home.loanAmount')) {
                this.totalDate.push(item.total_loan / loanPre)
                this.warning.push(item.collateral_loan / loanPre)
                this.badData.push(item.squeeze_loan / loanPre)
                this.safeData.push(Number(item.total_loan / loanPre) - Number(item.collateral_loan / loanPre) - Number(item.squeeze_loan / loanPre))
              } else if (this.selectType === this.$t('m.borrow.pawnNum')) {
                this.totalDate.push(item.total_collateralize / collatePre)
                this.warning.push(item.collateral_collateralize / collatePre)
                this.badData.push(item.squeeze_collateralize / collatePre)
                this.safeData.push(Number(item.total_collateralize / collatePre) - Number(item.collateral_collateralize / collatePre) - Number(item.squeeze_collateralize / collatePre))
              } else {
                this.totalDate.push(item.total_count)
                this.warning.push(item.collateral_count)
                this.badData.push(item.squeeze_count)
                this.safeData.push(Number(item.total_count) - Number(item.collateral_count) - Number(item.squeeze_count))
              }
              // X轴
              this.currentTime.push(item.day_tm.substring(0, 10))
            })
          }
        }
      },
      // 根据交易对取出相关的数据
      whichDayData () {
        this.totalDate = []
        this.warning = []
        this.badData = []
        this.safeData = []
        this.currentTime = []
        this.currentWeek = []
        this.currentMonth = []
        let times = ''

        if (this.selectTime === this.$t('m.home.day')) {
          times = 7
        } else if (this.selectTime === this.$t('m.home.week')) {
          times = 31
        } else {
          times = 31
        }
        if (this.baseQuote.length < 1) return
        Apis.instance().history_api().exec('get_bitlender_loan_history', [this.tradingOnValue.key.base, this.tradingOnValue.key.quote, times])
          .then(res => {
            this.setData(res)
            this.baseSymbol = this.tradingOnValue.base_symbol
            this.quoteSymbol = this.tradingOnValue.quote_symbol
            this.drawpie()
          })
          .catch(err => {
            console.log(err)
          })
      },
      // 绘制饼状的背景
      drawBgPie () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('my-chart'))
        // 绘制图表
        myChart.setOption({
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: 335,
                  itemStyle: {
                    color: 'rgba(255, 255, 255, .1)'
                  }
                }
              ]
            }
          ]
        }, true)
      },
      // 绘制交易对的饼图
      drawpie () {
        let myChart1 = this.$echarts.init(document.getElementById('my-chart1'))
        myChart1.setOption({
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: () => {
                    return this.guarantee + '%'
                  },
                  textStyle: {
                    fontSize: 12,
                    color: '#fff'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: this.loanNum - this.recycleNum,
                  itemStyle: {
                    color: this._themeColor
                  }
                },
                {
                  value: this.recycleNum,
                  itemStyle: {
                    color: 'rgba(200, 200, 200, .1)'
                  }
                }
              ]
            }
          ]
        })
        this.drawLine()
      },
      // 绘制交易对的线
      drawLine () {
        let myChart2 = this.$echarts.init(document.getElementById('my-chart2'))
        myChart2.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            right: 70,
            top: 10,
            data: [this.$t('m.home.highRisk'), this.$t('m.home.lowRish'), this.$t('m.home.safes'), this.$t('m.home.total')] // '高风险', '低风险', '安全', '总量'
          },
          grid: {
            top: 70,
            bottom: 50,
            left: 100,
            right: 100
          },
          xAxis: [
            {
              type: 'category',
              data: this.currentTime,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              splitNumber: 3,
              nameTextStyle: {
                color: 'rgba(175, 175, 177, 1)'
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: this.$t('m.home.highRisk'),
              type: 'line',
              smooth: true,
              data: this.badData,
              lineStyle: {
                color: 'rgba(227,88,30,1)'
              },
              itemStyle: {
                color: 'rgba(227,88,30,1)'
              },
              symbol: 'circle',
              connectNulls: true
            },
            {
              name: this.$t('m.home.lowRish'),
              type: 'line',
              smooth: true,
              data: this.warning,
              lineStyle: {
                color: 'rgba(253, 191, 65, 1)'
              },
              itemStyle: {
                color: 'rgba(253, 191, 65, 1)'
              },
              symbol: 'circle',
              connectNulls: true
            },
            {
              name: this.$t('m.home.safes'),
              type: 'line',
              smooth: true,
              data: this.safeData,
              lineStyle: {
                color: 'rgba(71,175,77,1)'
              },
              itemStyle: {
                color: 'rgba(71,175,77,1)'
              },
              symbol: 'circle',
              connectNulls: true
            },
            {
              name: this.$t('m.home.total'),
              type: 'line',
              smooth: true,
              data: this.totalDate,
              lineStyle: {
                color: 'rgba(64, 48, 161, 1)'
              },
              itemStyle: {
                color: 'rgba(64, 48, 161, 1)'
              },
              symbol: 'circle',
              connectNulls: true
            }
          ]
        }, true)
      },
      init () {
        this.loadingmain = true
        this.tradingOnValue_sel = 1000000
        ZOSInstance.get_bitlender_loan_history_summary(36).then(res => {
          if (res) {
            this.selectTime = getStore('selectTime') ? getStore('selectTime') : this.$t('m.home.day')
            this.selectType = getStore('selectType') ? getStore('selectType') : this.$t('m.home.loanAmount')
            this.chooseed = getStore('chooseed') ? getStore('chooseed') : 0
            this.chooseeds = getStore('chooseeds') ? getStore('chooseeds') : 0

            this.loanCount = res.all_total_loan_count
            this.investCount = res.all_total_invest_count
            this.todayLoanCount = res.all_today_loan_count
            this.todayInvestCount = res.all_today_invest_count
            this.arrayTotal = res.array_total
            this.baseQuote = []
            this.arrayTotal.forEach(item => {
              this.baseQuote.push(item)
            })
            if (res.array_total.length > 0) {
              this.tradingOnValue = getStore('tradingOnValue') ? JSON.parse(getStore('tradingOnValue')) : this.baseQuote[0]
              this.tradingShowValue = this.baseQuote[0].market
            }

            this.arrayToday = res.array_today
            this.tradingShow()
            this.loadingmain = false
            this.newLoan()
            this.newInvestList()
          }
        }).catch(e => {
          this.loadingmain = false
          console.log(e)
        })
      },
      _getAssetId () {
        let assetId = []
        this.$store.state.loanAssetArr.forEach(item => {
          assetId.push(item[0].id)
        })
        return assetId
      },
      // Ella 首页跳转
      newLoan () {
        let arrId = this._getAssetId()
        ZOSInstance.get_loan_orders([], arrId, [], 0, 6).then(res => {
          if (res) {
            let arr = []
            for (let i = 0; i < res.length; i += 2) {
              arr.push(res.slice(i, i + 2))
            }
            this.tableDataNew = arr
          }
        }).catch(e => {
          console.log(e)
        })
      },
      newInvestList () {
        let arrId = this._getAssetId()
        ZOSInstance.get_invest_orders([], arrId, [], 0, 9).then(res => {
          if (res && res.length > 0) {
            let arr = []
            for (let i = 0; i < res.length; i += 3) {
              arr.push(res.slice(i, i + 3))
            }
            this.tableDataNewInvest = arr
          }
        }).catch(e => {
          console.log(e)
        })
      },
      //
      getOrderStatus (orderStatus, arr) {
        return arr.find(item => {
          return orderStatus === item
        })
      },
      _loanLink (toPath, row) {
        if (this.$store.state.userName === row.issuer.name) {
          if (this.getOrderStatus(row.order_state, [1, 3])) {
            toPath = '/history/borrowHis/borrowingdetail'
          }
          if (this.getOrderStatus(row.order_state, [2, 4, 5, 6, 10, 11])) {
            toPath = '/history/borrowHis/borrowsuccessdetail'
          }
          if (this.getOrderStatus(row.order_state, [12, 15])) {
            toPath = '/history/borrowHis/badloandetails'
          }
          return {
            path: toPath,
            query: {
              id: row.id,
              accID: row.issuer.id,
              accName: row.issuer.name
            }
          }
        } else {
          if (this.getOrderStatus(row.order_state, [1, 3])) {
            toPath = '/history/borrowHis/borrowingdetail'
            return {
              path: toPath,
              query: {
                id: row.id,
                accID: row.issuer.id,
                accName: row.issuer.name
              }
            }
          }
          if (this.getOrderStatus(row.order_state, [2, 4, 5, 6, 10, 11])) {
            toPath = '/history/borrowHis/borrowsuccessdetail'
          }
          if (this.getOrderStatus(row.order_state, [12, 15])) {
            toPath = '/history/borrowHis/badloandetails'
          }
          return {
            path: toPath,
            query: {
              id: row.id,
              accID: row.issuer.id,
              accName: row.issuer.name
            }
          }
        }
      },
      newLoanLink (row) {
        var loginPath = this._loanLink('/investDetails', row)
        loginToPath(ZOSInstance, this, loginPath)
      },
      // 最新投资的跳转
      newInvestLink (row) {
        let state = Number(row.order_info.order_state)
        if (state === 1 || state === 3) {
          this.$router.push({
            path: '/history/investHis/investingdetail',
            query: {
              id: row.id,
              accName: row.issuer.name,
              accID: row.issuer.id
            }
          })
        } else if (
          state === 7 ||
          state === 8 ||
          state === 9 ||
          state === 13) {
          this.$router.push({
            path: '/history/investHis/historyInvestdetail',
            query: {
              id: row.id,
              accName: row.issuer.name,
              accID: row.issuer.id
            }
          })
        } else {
          this.$router.push({
            path: '/history/investHis/investsuccessdetail',
            query: {
              id: row.id,
              accName: row.issuer.name,
              accID: row.issuer.id
            }
          })
        }
      }
    },
    created () {
      if (this.$store.state.initFinished) {
        this.init()
      }
    },
    mounted () {
      this.loadingmain = true
      this.$root.$on('initFinished', (data) => {
        this.init()
      })
      this.$nextTick(() => {
        this.drawBgPie()
      })
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .home-index{
    max-width: 1152px;
    margin: 0 auto;
    .advantage{
      background: #fff;
      h1{
        color: #000;
      }
      .list{
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 18px;
        flex-wrap: wrap;
        .list-item,
        .using-progress-left{
          text-align: center;
          margin-bottom: 40px;
          .caption{
            h3{
              color: #000;
            }
            p{
              color: #98999B;
              margin: 0 auto;
            }
          }
        }
      };
      .using-progress {
        flex-direction: column;
        .using-progress-list{
          display: flex;
          flex: 1;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .using-progress-left{
            min-width: 228px;
            margin-bottom: 0;
          }
          .using-progress-right{
            border-radius: 8px;
            color: #fff;
            padding: 20px 36px;
            line-height: 30px;
          }
        }
      }
    };
    .more{
      justify-content: flex-end !important;
      margin-top: -30px;
    }
    .security {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      .security-left {
        display: flex;
        flex: 1;
        flex-direction: column;
        .security-left-top {
          color: #f5f5f5;
          font-size: 150px;
          h3{
            color: #575757;
            font-size: 26px;
            margin-top: -80px;
          }
        }
        .security-left-bottom {
          width: 36px;
          height: 3px;
        }
        p{
          font-size: 14px;
          color: #8D8F98;
        }
      }
    }
  }
  @media (max-width: 767px) {
    .home-index .advantage .list .list-item{
      min-width: 406px;
      p{
        max-width: 204px;
      }
    }
    .using-progress-list{
      flex-direction: column !important;
      flex: 1;
      padding-left: 34px;
      padding-right: 34px;
    }
    .using-progress-left{
      max-width: 228px;
      margin-bottom: 20px !important;
    }
    .using-progress-right{
      width: 100%;
    }
    .more{
      justify-content: center !important;
    }
    /* 安全保障 */
    .security {
      flex-direction: column !important;
    }
    .security .security-left {
      min-width: 300px;
      justify-content: center;
      align-items: center;
      order: -1;
    }
    .security .security-left .security-left-top h3{
      margin-top: -80px;
    }
    .security .security-left .security-left-bottom{
      margin: 20px auto 30px;
    }
    .security .security-left p {
      margin-bottom: 20px;
    }
  }
  @media (min-width: 768px) {
    .home-index .advantage .list .list-item{
      min-width: 330px;
      p{
        max-width: 204px;
      }
    }
    .using-progress-left{
      min-width: 150px!important;
    }
    .using-progress-right{
      min-width: 530px;
      max-width: 652px;
    }
    /* 安全保障 */
    .security .security-left {
      max-width: 300px;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .security .security-left .security-left-top h3{
      margin-left: 35px;
    }
    .security .security-left .security-left-bottom{
      margin: 30px 35px;
    }
    .security .security-left p {
      padding-left: 35px;
    }
  }

  /* 中等屏幕（桌面显示器，大于等于 992px） */
  @media (min-width: 992px) {
    .home-index .advantage .list .list-item{
      min-width: 290px;
      p{
        max-width: 172px;
      }
    }
    .using-progress-left{
      min-width: 228px!important;
    }
    .using-progress-right{
      min-width: 652px;
    }
    /* 安全保障 */
    .security .security-left {
      max-width: 300px;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .security .security-left .security-left-top h3{
      margin-left: 35px;
    }
    .security .security-left .security-left-bottom{
      margin: 30px 35px;
    }
    .security .security-left p {
      padding-left: 35px;
    }
  }

  /* 大屏幕（大桌面显示器，大于等于 1200px） */
  @media (min-width: 1200px) {
    .home-index .advantage .list .list-item{
      min-width: 200px;
      p{
        max-width: 172px;
      }
    }
    .using-progress-left{
      min-width: 228px!important;
    }
    .using-progress-right{
      min-width: 660px;
    }
    /* 安全保障 */
    .security .security-left {
      max-width: 300px;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .security .security-left .security-left-top h3{
      margin-left: 35px;
    }
    .security .security-left .security-left-bottom{
      margin: 30px 35px;
    }
    .security .security-left p {
      padding-left: 35px;
    }
    #my-chart2{
      min-width: 700px;
    }
    #fee-1{
      min-width: 400px;
    }
  }
  #my-chart2{
    height: 295px;
  }


  /*.main{*/
    /*padding: 10px;*/
  /*}*/
  .home-top{
    background: rgba(255, 255, 255, 1);
    padding: 25px;
    border-radius: 6px 6px 0 0;
    .top{
      .title{
        font-size: 16px;
        color: #333333;
      }
      .time{
        font-size: 30px;
        /*letter-spacing: 10px;*/
      }
    }
    .bottom{
      justify-content: space-around;
      text-align: center;
      color: #9BABB0;
      font-size: 12px;
      .count{
        font-size: 26px;
        color: #333333
      }
    }
  }
  .home-content{
    margin: 10px 0 10px;
    padding: 10px 20px;
    background: #fff;
  }
  .home-new{
    margin: 10px 0 10px;
    flex: 1;
    justify-content: space-around;
    .lasted{
      background: #fff;
    }
  }
  .feel-top{
    justify-content: space-between;
    align-items: center;
  }
  .feel-0{
    height: 118px;
    padding: 29px 50px;
    background: #fff;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
  }
  .feel-0:last-child{
    margin-right: 0
  }
  // .feel-1{
  //   height: 310px;
  //   background: #402AA4;
  //   border-radius: 4px;
  //   display: flex;
  //   flex: 1;
  // }
  .chart-data{
    display: flex;
    padding: 50px 15px 32px 15px;
    flex: 1;
    flex-direction: column;
    color: #fff;
  }
  .chart-top-right{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .trading-on{
      height: 18px;
      border-radius: 100px;
      text-align: center;
      padding-right: 10px;
      padding-left: 10px;
    }
  }
  .chart-top{
    flex: 1;
    flex-direction: row;
    display: flex;
    align-items: center;
  }
  .el-icon-sort{
    transform: rotate(90deg);
    transform-origin: left top;
  }
  .chart-bottom{
    display: flex;
    flex:1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .feel-2{
    padding-top: 15px;
    /*padding-left: 40px;*/
    background: #FEFEFF;
  }
  .carousel{
    width: 50%;
    padding-right: 15px;
    background: #FEFEFF;
    border-radius: 4px;
  }
  .carousel1{
    width: 50%;
    background: #FEFEFF;
    border-radius: 4px;
    padding-bottom: 10px;
  }
  .el-carousel__button{
    width: 5px!important;
    height: 5px!important;
    border-radius: 5px!important;
    background: #402AA4!important;
  }
  .el-table tr:last-child td{
    border-bottom: none!important;
  }
  .new-loan{
    display: flex;
    flex:1;
    flex-direction: row;
  }
  .new-loan-left{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #E8EDF6;
    text-align: center;
  }
  .new-loan-left:last-child {
    border-right: none;
  }
  .loan-button{
    padding: 4px 25px;
    border-radius: 100px;
    color: #fff;
    width: 100px;
    height: 26px
  }
  .div-line{
    border-left: 1px solid #E8EDF6;
    height: 62px
  }
  .invest-new{
    padding: 10px 30px;
  }
  .invest-new li{
    line-height: 53px;
    display: flex;
    flex: 1;
    flex-direction: row;
    border-bottom: 1px solid #E7EDF5;
  }
  .invest-new li:last-child{
    border-bottom: none;
  }
  .select-fns {
    position: absolute;
    right: 50px;
    bottom: 45px;
  }
  .select-fn {
    position: absolute;
    left: 60px;
    top: 15px;
  }
  .select-type {
    flex-direction: row; width: 45px; justify-content: space-around; align-items: center;
    .type-span{
      width: 15px;height: 15px;border-radius: 4px;cursor: pointer;display: flex;opacity: .1; border: none!important;
    }
  }
  .select-time{
    flex-direction: column; width: 25px; height: 45px; justify-content: space-around; align-items: center;
    .type-span{
      width: 15px;height: 15px;border-radius: 4px;cursor: pointer;display: flex;opacity: .1;border: none!important;
    }
  }
  .opacity{
    opacity: .6!important;
  }
</style>

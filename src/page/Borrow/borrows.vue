<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ1">
    <div class="feel">
      <!--左侧-->
      <div class="borrow-main">
        <el-form
          :model="ruleForm"
          :validate-on-rule-change="true"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <!--第一部分-->
          <div class="write-amount" style="justify-content: space-between">
            <div class="loan-info">
              <!--借款-->
              <el-form-item>
                <el-dropdown @command="bitlenderEvent">
                  <span class="command" style="width: 300px;min-height: 50px">
                    <img :src="`/static/images/${ruleForm.loanSymbolValue.symbol}.png`" width="30" height="30" :onerror="errorImg01"/>
                    <span class="margin-l20">{{ruleForm.loanSymbolValue.symbol}}</span>
                    <span style="flex: 1"></span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="width: 300px;">
                    <el-dropdown-item
                      v-for="item in loanSymbol"
                      :key="item.id"
                      :command="item"
                      class="margin-t10"
                    >
                      <img :src="`/static/images/${item.symbol}.png`" width="30" height="30" :onerror="errorImg01" />
                      <span class="margin-l20">{{item.symbol}}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>

              <h1 class="margin-b20" style="margin-top: 8px; margin-bottom: 15px">{{$t('m.borrow.loanAmount')}}</h1>
              <el-form-item prop="borrowNum">
                <el-input
                  v-model="ruleForm.borrowNum"
                  @blur="getAmountBlur"
                  @keyup.native="ruleForm.borrowNum < 1 ? ruleForm.borrowNum = '' : ruleForm.borrowNum = ruleForm.borrowNum.replace(/[^\d]/g, '')"
                  :maxlength="maxSupplyLoan.toString().length"
                  class="write-loan-amount" style="text-align: right">
                  <i slot="prefix">
                    <img :src="`/static/images/${ruleForm.loanSymbolValue.symbol}.png`" width="16" height="16" :onerror="errorImg01" />
                  </i>
                </el-input>
                <span class="f14 min-loan">
                  <!--最低借款金额-->
                  {{$t('m.borrow.minimum')}}
                  {{ruleForm.loanSymbolValue.symbol}} {{minLoan}},

                  <!--递增-->
                  {{$t('m.borrow.increasing')}} {{minLoanIncrease}}
                </span>
              </el-form-item>

            </div>

            <div class="exchange-icon">
              <!--小图标，喂价-->
              <el-popover
                popper-class="help"
                placement="bottom"
                width="300"
                trigger="hover"
                :content="ruleForm.collateralValue.symbol + '/' + ruleForm.loanSymbolValue.symbol + $t('m.investDetails.proportion')+': '+ruleForm.mortgagedFeed">
                <span slot="reference">
                  <img src="/static/images/exchange.png" width="30" height="30"/>
                </span>
              </el-popover>
            </div>

            <div class="collateral-info">
              <!--抵押物-->
              <el-form-item prop="collateralValue">
                <el-dropdown @command="mortgagedEvent">
                  <span class="command" style="width: 300px; min-height: 50px">
                    <img :src="`/static/images/${ruleForm.collateralValue.symbol}.png`" width="30" height="30" :onerror="errorImg01"  />
                    <span class="margin-l20">{{ruleForm.collateralValue.symbol}}</span>
                    <span style="flex: 1"></span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="width: 300px;">
                    <el-dropdown-item
                      v-for="item in collateralSymbol"
                      :key="item.symbol"
                      :command="item"
                      class="margin-t10"
                    >
                      <img :src="`/static/images/${item.symbol}.png`" width="30" height="30" :onerror="errorImg01" />
                      <span class="margin-l20">{{item.symbol}}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>

              <h1 class="margin-b20" style="margin-top: 8px; margin-bottom: 15px">{{$t('m.borrow.DYW')}}</h1>
              <el-form-item prop="mortgageNum">
                <el-input v-model="ruleForm.mortgageNum"
                          @change="mortgageNumBlur"
                          @keyup.native="ruleForm.mortgageNum = ruleForm.mortgageNum.replace(/[^\.\d]/g, '')"
                          :maxlength="maxSupplyCollateral.toString().length"
                          class="write-loan-amount" style="text-align: right">
                  <i slot="prefix" style="color: #FFB119; font-size: 20px; font-weight: 500; margin-right: 5px;">
                    {{ruleForm.collateralValue.symbol}}
                  </i>
                </el-input>

                <div class="collateral-notice f14 min-loan">
                  <span>
                    <!--可用数量-->
                  {{$t('m.orderList.useNum')}}:
                  </span>
                  <span style="flex: 1"></span>
                  <span> {{available+' '+ruleForm.collateralValue.symbol}}</span>
                  <div v-show="feeMode === 'fee_invest' ? ruleForm.collFee + ruleForm.collRisk + Number(ruleForm.mortgageNum) : Number(ruleForm.mortgageNum) > available" class="margin-l10">
                    <!--去充币-->
                    <a @click="chargeMoney"> {{$t('m.borrow.toCharge')}}</a>
                  </div>
                </div>
              </el-form-item>

            </div>
          </div>
          <!--第二部分-->
          <el-form-item prop="borrowTimeLimit" style="margin-top: 0">
            <div class="feel loan-period">
              <!--借款期限-->
              <h1 style="margin-top: 0">{{$t('m.borrow.borrowCycle')}}</h1>
              <span style="flex:1"></span>
              <span>{{borrowTimeLimit}}{{$t('m.year')}}</span>
            </div>
            <el-slider
              :min="minBidTime"
              v-model="borrowTimeselect"
              :step="1"
              :max="maxBidTimeIndex + 1"
              show-stops
              :format-tooltip="formatTooltip"
            >
            </el-slider>
          </el-form-item>

          <el-form-item prop="borrowRate" style="margin-top: 0">
            <!--借款利率-->
            <div class="feel loan-rate" style="justify-content: space-between">
              <div class="borrow-rate">
                <h1 style="margin-top: 0">{{$t('m.borrow.borrowRate')}}</h1>
                <span>
                  <el-input v-model="interestRates"
                            maxlength="6"
                          @blur="interestValite"
                          @keyup.native="interestRates < 0 ? interestRates = '' : interestRates = interestRates.replace(/[^.\d]/g, '')"
                          class="write-loan-amount" style="width: 50px;"></el-input>‰ /{{$t('m.year')}}
                </span>
              </div>

              <!--<span>3天内没有投满，抵押物全数返还</span>-->
              <div class="borrow-rate">
                <span style="color: #191A5E; font-weight: 500">
                  {{$t('m.fuelCost')}}
                  <el-popover
                    popper-class="help"
                    placement="bottom"
                    width="320"
                    trigger="hover"
                    :content="$t('m.transfer.useCoupons')">
                    <span slot="reference">
                      <i class="el-icon-question" style="color: #C1C4C7"></i>
                    </span>
                  </el-popover>
                </span>
                <span class="margin-l20">
                {{$t('m.transfer.about')}} {{ruleForm.feeZos}} ZOS
                </span>
              </div>
            </div>
            <!--自定义利率不合规时-->
            <p v-show="interestRatesShow" class="interest-show">
              <i class="el-icon-warning"></i>  {{$t('m.borrow.errDescribe')}} {{otherOptions.max_repayment_rate / 10}}‰
            </p>
          </el-form-item>

          <el-form-item style="margin-bottom: 10px">
            <!--我已阅读并同意相关-->
            <div class="feel">
              <el-checkbox v-model="ruleForm.isRead">{{$t('m.borrow.WYDKCheck')}}<a @click="agreementDialog=true">
                {{$t('m.borrow.agreement')}}
              </a></el-checkbox>
              <!-- <div>-->
                <!--<span>{{$t('m.information.KYC')}}:</span>-->
                <!--<span v-if="$store.state.kycStatusCode==='3'">{{$t('m.information.nokyc')}}</span>-->
                <!--<span v-else-if="$store.state.kycStatusCode==='0'">{{$t('m.information.review')}}</span>-->
                <!--<span v-else-if="$store.state.kycStatusCode==='1'">{{$t('m.information.through')}}</span>-->
                <!--<div v-else>-->
                  <!--<span>{{$t('m.information.nothrough')}}</span>-->
                  <!--<span style="color: #ccc; font-size: 14px;" class="margin-l20">{{kycStatusInfo}}</span>-->
                <!--</div>-->
                <!--<a v-if="isAuthenticator===1 && kycStatusCode!='1'" @click="authenticationDialog=true" class="margin-l20">-->
                  <!--{{$t('m.information.KYC')}}-->
                <!--</a>-->
                <!--<a v-else @click="checkinfoDialog=true" class="margin-l20">-->
                  <!--{{$t('m.information.lookinfo')}}-->
                <!--</a>-->
              <!--</div>-->
              <!--<span v-if="!$store.state.userInfo.phone">-->
                <!--{{$t('m.information.noBind')}}-->
              <!--</span> -->
            </div>

          </el-form-item>
          <el-form-item>
            <div class="feel submit-loan">
              <!--申请借款-->
              <y-button :text="$t('m.borrow.loan')"
                        :classStyle="ruleForm.isRead ?'main-btn':'disabled-btn'"
                        @btnClick="submitForm('ruleForm')"
                        style="flex:1; display: flex; justify-content: center;align-items: center; border-radius: 23px; height: 50px;font-size: 16px"
              ></y-button>
            </div>
          </el-form-item>
          <!--前往kyc-->
          <goto-kyc :kycInfo="kycInfo" :kycurl="kycurl" :authorid="curLendCarrierAccount.lendauthor_account" :kycStatusCode="kycStatusCode" :hintKycDialog="hintKycDialog" :checkinfoDialog="checkinfoDialog" @close="kycclose"></goto-kyc>
        </el-form>
      </div>
      <div class="borrow-show-info">
          <div class="to-hand margin-b20" style="min-height: 72px">
            <div class="top margin-b10">
              <span class="title">{{$t('m.borrow.toAmount')}}</span>
              <span class="title-symbol margin-l10">{{ruleForm.loanSymbolValue.symbol}}</span>
              <span class="to-hand-amount">
                {{(ruleForm.getAmount ? ruleForm.getAmount : 0) | formatLegalCurrencys(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
              </span>
            </div>
            <div class="bottom">
              <span v-if="feeMode === 'fee_invest'">
                <span>
                  {{$t('m.borrow.carrierServiceRate')}}:
                </span>
                <span v-if="ruleForm.carrierServiceRate">
                  {{carrierServiceRate | formatLegalCurrency(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
                </span>
                <span v-else>
                   0
                </span>
              </span>
              <br>
              <span>
                <!--到手金额=借款金额-运营商服务费-->
               {{feeMode === 'fee_invest' ? $t('m.borrow.toMethod') : $t('m.borrow.tohandMethod')}}
              </span>
              <br>
              <span>
                <span :class="ratio > 6 ? 'warning' : ''">{{$t('m.borrow.ratio')}}: {{ratio+$t('m.borrow.times')}}</span>
                <el-popover
                  popper-class="help"
                  placement="bottom"
                  width="320"
                  trigger="hover"
                  :content="$t('m.borrow.radio') + ':' + ruleForm.multiple.toFixed(3)">
                  <!--最小抵押倍数-->
                  <span slot="reference"><i class="el-icon-question" style="color: #C1C4C7"></i></span>
                </el-popover>
              </span>
            </div>
          </div>

        <div class="to-hand margin-b20" style="min-height: 62px">
          <div class="top margin-b10">
            <!--每月还款利息-->
            <span class="title">{{$t('m.borrow.payments')}}</span>
            <span class="title-symbol margin-l10">{{ruleForm.loanSymbolValue.symbol}}</span>
            <span class="to-hand-amount">
                {{repayInterest | formatLegalCurrencys(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
              </span>
          </div>
          <div class="bottom">
            <span>
                <!--先息后本还款方式，你需要在每月还款日之前还款；每月利息=-->
              {{$t('m.borrow.reimbursement')}}
              {{borrowNum | formatLegalCurrencys(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}*{{interestMonth}}‰= {{repayInterest | formatLegalCurrencys(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}；
              <!--本金在最后一期利息到期日还-->
              {{$t('m.borrow.principal')}}
              </span>
          </div>
        </div>

        <div class="to-hand  margin-b20" style="min-height: 90px">
          <div class="top margin-b10">
            <!--费用总计-->
            <span class="title">{{$t('m.borrow.cost')}}</span>
              <img class="margin-l10" :src="`../../static/images/${feeMode === 'fee_invest' ? ruleForm.collateralValue.symbol : ruleForm.loanSymbolValue.symbol}.png`" width="16" height="16" :onerror="errorImg01" />
              <span class="to-hand-amount" v-if="feeMode==='fee_invest'">
                {{total | formatLegalCurrencys(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
              </span>
              <span class="to-hand-amount" v-else>
                {{total | formatLegalCurrencys(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
              </span>
          </div>
          <div class="bottom">
            <!--平台服务费-->
            <span>
              {{$t('m.borrow.service')}}:
              <span v-if="feeMode==='fee_invest'">
                {{collFee | formatLegalCurrency(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
              </span>
              <span v-else>
                {{collFee | formatLegalCurrency(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
              </span>
            </span>
            <br>
            <!--风险准备金-->
            <span>
              {{$t('m.borrow.risk')}}:
              <span v-if="feeMode==='fee_invest'">
                {{collRisk | formatLegalCurrency(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
              </span>
              <span v-else>
                {{collRisk | formatLegalCurrency(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
              </span>
            </span>
          </div>
        </div>
        <!--补仓线-->
        <div class="to-hand" style="min-height: 110px">
          <div class="top margin-b10" style="display: flex;flex-wrap: wrap;">
            <!--补仓线-->
            <span class="title">{{$t('m.borrow.marginLine')}}</span>
            <!--<span style="margin-right: 5px; margin-left: 5px">{{ruleForm.loanSymbolValue.symbol + '/' + ruleForm.collateralValue.symbol}}</span>-->
            <span class="warning" style="margin-right: 5px; margin-left: 5px"> {{cover | formatLegalCurrencys(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
            </span>
            <span style="flex: 1"></span>
            <div>
              <!--平仓线-->
              <span class="title">{{$t('m.borrow.openLine')}}</span>
              <!--{{ruleForm.loanSymbolValue.symbol + '/' + ruleForm.collateralValue.symbol}}-->
              <span class="err">{{unwind | formatLegalCurrencys(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
            </span>
            </div>
          </div>
          <div class="bottom">
            <span>
                <!--当-->{{$t('m.borrow.when')}}
              {{ruleForm.loanSymbolValue.symbol + '/' + ruleForm.collateralValue.symbol}}
              <!--价格降低至-->{{$t('m.borrow.down')}}
              {{cover | formatLegalCurrencys(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
              <!--时，你需要增加额外的-->
              {{$t('m.borrow.additional')}}
              {{ruleForm.collateralValue.symbol}}
              <!--以避免被平仓；当-->{{$t('m.borrow.liquidated')}}
              <br>
              {{$t('m.borrow.when')}}
              {{ruleForm.loanSymbolValue.symbol + '/' + ruleForm.collateralValue.symbol}}
              <!--价格降低至-->{{$t('m.borrow.down')}}
              {{unwind | formatLegalCurrencys(ruleForm.collateralValue.symbol, ruleForm.collateralValue.precision)}}
              <!--时，你的借款将会被平仓-->{{$t('m.borrow.will')}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--协议-->
    <el-dialog
      :title="$t('m.borrow.agreements')"
      :visible.sync="agreementDialog"
      width="30%"
    >
      <p>
        1.{{$t('m.borrow.obligations1')}}<br>
        2.{{$t('m.borrow.obligations2')}}<br>
        3.{{$t('m.borrow.obligations3')}}<br>
        4.{{$t('m.borrow.obligations4')}}<br>
        5.{{$t('m.borrow.obligations5')}}<br>
        6.{{$t('m.borrow.obligations6')}}<br>
        7.{{$t('m.borrow.obligations7')}}<br>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="agreementDialog = false">{{$t('m.sure')}}</el-button>
      </span>
    </el-dialog>

    <!--输入资金密码-->
    <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>

    <!--信息确认-->
    <!--申请借款确认-->
    <el-dialog
      :title="$t('m.borrow.loanSure')"
      :visible.sync="confirmDialog"
      width="30%"
    >
      <!--正在提交-->
      <div v-loading="loading" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vw;">
        <p>{{$t('m.borrow.loanAmount')}}: {{ruleForm.borrowNum | formatLegalCurrency(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}<br>
          {{$t('m.borrow.borrowCycle')}}: {{borrowTimeLimit}}{{$t('m.year')}}<br>
          <!--借款利率-->
          {{$t('m.borrow.borrowRate')}}: {{interestRates}}‰ /{{$t('m.year')}}<br>
          <!--截标时间-->
          {{$t('m.invest.endDate')}}: {{(Date.parse(new Date()) + this.ruleForm.LValue * 24 * 60 * 60 * 1000) | formatProposalTime()}}<br>
          <!--抵押物-->
          {{$t('m.borrow.DYW')}}: {{ruleForm.collateralValue.symbol}}<br>
          <!--抵押数量-->
          {{$t('m.borrow.DYSL')}}: {{ruleForm.mortgageNum}}<br>
          <!--抵押倍数, 倍-->
          {{$t('m.borrow.ratio')}}: {{ruleForm.ratio + ' ' +$t('m.borrow.times')}}<br>
          <!--抵押费用-->
          {{$t('m.borrow.costs')}}: {{ruleForm.collFee | formatLegalCurrency(feeSymbol, feePrecision)}}<br>
          <!--风险准备金-->
          {{$t('m.borrow.risk')}}: {{ruleForm.collRisk | formatLegalCurrency(feeSymbol, feePrecision)}}<br>
          <!--运营商服务费-->
          {{$t('m.borrow.carrierServiceRate')}}:
          <span v-if="ruleForm.carrierServiceRate">
            {{ruleForm.carrierServiceRate | formatLegalCurrency(ruleForm.loanSymbolValue.symbol, ruleForm.loanSymbolValue.precision)}}
          </span>
          <span v-else>
            0
          </span>
          <br>
          <!--燃料费-->
          {{$t('m.fuelCost')}}: {{ruleForm.realFeeZos}} ZOS
        </p>
        <p class="text-right">
          <y-button :text="$t('m.cancel')"
                    @btnClick="confirmDialog = false"
          ></y-button>
          <y-button :text="btnText"
                    classStyle="main-btn"
                    @btnClick="borrowSubmit"
          ></y-button>
        </p>
      </div>
    </el-dialog>
    <!--去充币-->
    <recharge-coin :assetId="ruleForm.collateralValue.id"
                   dialogType="deposit"
                   @close='chargeclose'
                   :visible="chargeMoneyVisible"></recharge-coin>
    <!--确认离开此页面？-->
    <el-dialog
      :title="$t('m.borrow.note')"
      :visible.sync="confirmVisible"
      width="30%"
    >
      <span>{{$t('m.borrow.leaveSure')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isConfirm = false;confirmLeave()">{{$t('m.cancel')}}</el-button>
        <el-button type="primary" @click="isConfirm = true;confirmLeave()">{{$t('m.sure')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  import {ZOSInstance} from 'zos-wallet-js'
  import {getStore, setStore} from '/js-utils/storage'
  import { MessageBox } from 'element-ui'
  import RechargeCoin from '/path-components/ChargeCoin'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import formatAssets from '/js-api/public'
  import deepClone from '/js-utils/deepClone'
  import {Apis} from 'zosjs-ws'
  import { ChainStore } from 'zosjs/es'
  import {kycStatus} from '/js-api/index'
  import gotoKyc from '/path-components/KYC'
  export default {
    components: {
      YButton, RechargeCoin, passwordDialog, formatAssets, gotoKyc},
    data () {
      // 借款数量
      var borrowNumVa = (rule, value, callback) => {
        if (!value) {
          // '请输入借款金额'
          callback(new Error(this.$t('m.borrow.inputNum')))
        } else if (value < this.minLoan || value % this.minLoanIncrease !== 0) {
          // 最低借款金额
          // 递增
          callback(new Error(`${this.$t('m.borrow.minimum') + this.ruleForm.loanSymbolValue.symbol + this.minLoan}，${this.ruleForm.loanSymbolValue.symbol + this.minLoanIncrease + this.$t('m.borrow.increasing')}`))
        } else if (value > this.maxSupplyLoan) {
          // 超过最大借款金额
          callback(new Error(`${this.$t('m.borrow.moreThan') + this.maxSupplyLoan}`))
        } else {
          callback()
        }
      }
      var collateralValueVa = (rule, value, callback) => {
        if (!value) {
          // 请选择抵押物
          callback(new Error(this.$t('m.borrow.mortgage')))
        } else {
          callback()
        }
      }
      var mortgageRatesVa = (rule, value, callback) => {
        if (this.ruleForm.ratio < this.ruleForm.multiple) {
          // 抵押倍数不能小于, 倍
          callback(new Error(`${this.$t('m.borrow.lessThan') + this.ruleForm.multiple + this.$t('m.borrow.times')}`))
        } else {
          callback()
        }
      }
      var mortgageNumVa = (rule, value, callback) => {
        let num = Number(this.ruleForm.mortgageNum)
        if (this.feeMode === 'fee_invest') {
          if ((num + this.ruleForm.collFee + this.ruleForm.collRisk > this.available) && this.ruleForm.collateralValue.symbol) {
            // '抵押物数量不足，请充币'
            callback(new Error(this.$t('m.borrow.unNum')))
          }
        } else {
          if ((num > this.available) && this.ruleForm.collateralValue.symbol) {
            // '抵押物数量不足，请充币'
            callback(new Error(this.$t('m.borrow.unNum')))
          }
        }
        if (value < 0) {
          callback(new Error('请输入大于0的数'))
        }
        if (value > this.maxSupplyCollateral) {
          callback(new Error(this.$t('m.borrow.maxSupplyColl')))
        }
        if (isNaN(value)) {
          // '抵押物数量格式错误
          callback(new Error(this.$t('m.borrow.mortgageWrong')))
        } else if (Number(this.ratio) < Number(this.ruleForm.multiple).toFixed(3)) {
          // 抵押倍数不能小于, 倍
          callback(new Error(`${this.$t('m.borrow.lessThan') + this.ruleForm.multiple.toFixed(3) + this.$t('m.borrow.times')}`))
        } else {
          callback()
        }
      }
      var collRiskVa = (rule, value, callback) => {
        let num = Number(this.ruleForm.mortgageNum)
        if (this.feeMode === 'fee_invest') {
          if ((num + this.ruleForm.collFee + this.ruleForm.collRisk > this.available) && this.ruleForm.collateralValue.symbol) {
            // '抵押物数量不足，请充币'
            callback(new Error(this.$t('m.borrow.unNum')))
          }
        } else {
          if ((num > this.available) && this.ruleForm.collateralValue.symbol) {
            // '抵押物数量不足，请充币'
            callback(new Error(this.$t('m.borrow.unNum')))
          }
        }
        if (this.ruleForm.collFee + this.ruleForm.collRisk + this.ruleForm.mortgageNum > this.available) {
          // '可用数量不足，请充币'
          callback(new Error(this.$t('m.borrow.useLess')))
        } else {
          callback()
        }
      }
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        gatewayConfig: {},
        rules: {
          borrowNum: [
            { validator: borrowNumVa, trigger: 'change' }
          ],
          collateralValue: [
            {validator: collateralValueVa, trigger: 'change'}
          ],
          mortgageNum: [
            {required: true, message: this.$t('m.borrow.inputMortgage')},
            {validator: mortgageNumVa, trigger: ['change', 'blur']}
          ],
          mortgageRates: [
            {validator: mortgageRatesVa, trigger: 'change'}
          ],
          collRisk: [
            {validator: collRiskVa, trigger: 'change'}
          ]
        },
        // 借款币种
        loanSymbol: [],
        loanSymbol_sel: '',
        // 抵押物币种
        collateralSymbol: [],
        collateralSymbol_sel: '',
        ruleForm: {
          // 法币选择后的值
          loanSymbolValue: {
            symbol: 'ZOS'
          },
          // 抵押物选择后的值
          collateralValue: {
            symbol: 'ZOS'
          },
          mortgagedFeedShow: '',
          mortgagedFeed: '',
          // 金额
          borrowNum: '',
          // 到手金额
          getAmount: '',
          // 还款方式
          // borrowWay: '先息后本',
          // 投标期限
          LValue: 3,
          // 抵押数量
          mortgageNum: '',
          // 最小保证金倍数
          multiple: 0, // 这里最小保证金倍数需要大一些，这里需要优化
          // 保证金倍数
          ratio: 0,
          // 预计zos总数
          feeZos: '',
          // 真实手续费
          realFeeZos: '',
          // 广播需要的
          tr: '',
          // zos总数
          zos_balance: '',
          // 已阅读
          isRead: false,
          // 抵押费用
          collFee: '',
          // 风险保证金
          collRisk: '',
          // 运营商服务费
          carrierServiceRate: ''
        },
        borrowTimeLimitOptions: 0,
        // 选择币种后，除利率后，其它的参数
        otherOptions: {},
        // 得到zos的方式弹窗
        zosDialog: false,
        // 协议
        agreementDialog: false,
        // 输入密码
        comfirmPassword: false,
        checkinfoDialog: false,
        authenticationDialog: false,
        kycInfo: null, // kyc
        kycStatusCode: -1,
        btnText: this.$t('m.sure'),
        // 信息确认弹窗
        confirmDialog: false,
        hintKycDialog: false,
        // 广播需要的
        tr: {},
        // 提交借款，加载
        loading: false,
        // 主体加载
        mainloading: true,
        // 后端直接传过来的抵押数量
        copyMortgageNum: '',
        // 充币弹窗
        chargeMoneyVisible: false,
        maxSupplyLoan: 1000000000,
        maxSupplyCollateral: 1000000000,
        confirmVisible: false,
        isConfirm: true,
        nexts: '',
        // 利率的输入值
        interestRates: 0,
        // 基准利率
        copyInterestRate: {},
        // 每月要还多少息
        interest: '',
        repayInterest: 0,
        interestRatesShow: false,
        // poundageData: '',
        copyCollateralSymbol: [],
        feeSymbol: 'ZOS',
        feePrecision: 2,
        feeMode: '',
        curLendCarrierAccount: '',
        feeCarrierPrecision: '',
        collateralRatio: '',
        squeezeRatio: '',
        // 补仓线 08-12-18
        cover: 0,
        // 平仓线
        unwind: 0,
        ratio: 0,
        carrierServiceRate: 0,
        interestMonth: 0,
        borrowNum: 0,
        total: 0,
        collFee: 0,
        collRisk: 0,
        bindPhone: false,
        isAuthenticator: 0,
        gotoAuthor: false,
        getLendingAsset: [],
        minBidTime: 0,
        maxBidTimeIndex: 0,
        borrowTimeLimit: 0,
        borrowTimeselect: 1,
        canloan: '',
        kycurl: ''
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.$store.state.unRouterChange) {
        // '您确定离开此页面?' '提示'
        this.nexts = next
        this.confirmVisible = true
      } else {
        next()
      }
    },
    computed: {
      // 币种
      currency () {
        for (let v of this.optionsB) {
          if (v.value === this.ruleForm.BValue) {
            return v.type
          }
        }
      },
      // 最小借款金额
      minLoan () {
        if (this.ruleForm.loanSymbolValue) {
          return this.otherOptions.min_loan_amount / Math.pow(10, this.ruleForm.loanSymbolValue.precision)
        }
      },
      // 最小借款金额
      minLoanIncrease () {
        if (this.ruleForm.loanSymbolValue) {
          return this.otherOptions.min_loan_increase_range / Math.pow(10, this.ruleForm.loanSymbolValue.precision)
        }
      },
      // 支持的最大金额，超过就不让通过
      maxLimit () {
        if (this.ruleForm.loanSymbolValue) {
          return this.maxSupplyLoan * 0.33
        }
      },
      // 可用资产
      available () {
        let assetsArr = formatAssets.formatAssets(this.ruleForm.collateralValue.symbol)
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else if (this.ruleForm.collateralValue && assetsArr.length > 0) {
          return assetsArr[0].amount / Math.pow(10, assetsArr[0].precision)
        }
      }
    },
    watch: {
      'interestRates': {
        handler: function (newVal) {
          this.repayInterest = (this.ruleForm.borrowNum * (this.interestRates / 1000)).toFixed(2)
          this.interestMonth = this.interestRates
          if (newVal < (this.copyInterestRate.interest_rate / 10) || newVal > (this.otherOptions.max_repayment_rate / 10)) {
            this.interestRatesShow = true
          } else {
            this.interestRatesShow = false
          }
          if (!newVal) {
            this.interestRatesShow = true
          }
        }
      }
    },
    methods: {
      _maxBidTime (max) {
        let first = this.borrowTimeLimitOptions[0][0]
        this.minBidTime = first
        let maxTimeIndex = 0
        for (let [key, val] of this.borrowTimeLimitOptions.entries()) {
          if (first <= max.max_repayment_period) {
            first = val[0]
            maxTimeIndex = key
          }
        }
        return maxTimeIndex
      },
      formatTooltip (val) {
        if (this.borrowTimeLimitOptions.length > 0) {
          this.interestRates = this.borrowTimeLimitOptions[val - 1][1].interest_rate / 10
          // 基准利率
          this.copyInterestRate = {...(this.borrowTimeLimitOptions[val - 1][1])}
          this.borrowTimeLimit = this.borrowTimeLimitOptions[val - 1][0]
          return this.borrowTimeLimit
        }
      },
      // 利率变化，
      watchFee () {
        if (this.ruleForm.borrowNum) {
          this._watchRatio()
          // this.ratio = this.ruleForm.ratio = ((this.ruleForm.mortgageNum * this.ruleForm.mortgagedFeedShow) / this.ruleForm.borrowNum).toFixed(2)
          this.cover = this.ruleForm.borrowNum * this.collateralRatio / this.ruleForm.mortgageNum // 补仓线
          this.unwind = this.ruleForm.borrowNum * this.squeezeRatio / this.ruleForm.mortgageNum // 平仓线
        }
        this.carrierServiceRate = this.ruleForm.carrierServiceRate
        this.borrowNum = this.ruleForm.borrowNum
        this.repayInterest = (this.ruleForm.borrowNum * (this.interestRates / 1000)).toFixed(2)
        this.interestMonth = this.interestRates
        this.collFee = Number(this.ruleForm.collFee)
        this.collRisk = Number(this.ruleForm.collRisk)
        this.total = this.collFee + this.collRisk
        if (this.feeMode === 'fee_invest') {
          this.ruleForm.getAmount = this.ruleForm.borrowNum - this.ruleForm.carrierServiceRate
        } else {
          this.ruleForm.getAmount = this.ruleForm.borrowNum - this.ruleForm.collFee - this.ruleForm.collRisk
        }
      },
      // 禁用科学计数法
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
      // 输入利率保留1位小数
      interestValite () {
        if (this.interestRates) {
          this.interestRates = Number(this.interestRates).toFixed(1)
        }
      },
      kycclose () {
        this.hintKycDialog = false
        this.checkinfoDialog = false
      },
      // 关闭充币弹窗
      chargeclose () {
        this.chargeMoneyVisible = false
      },
      // 确认是否离开
      confirmLeave () {
        this.confirmVisible = false
        if (this.isConfirm) {
          this.nexts()
          this.$store.state.unRouterChange = false
        } else {
          this.nexts(false)
        }
      },
      // 初始化币种，抵押物等
      init () {
        ChainStore.setLoginAccount(this.$store.state.userDataSid)
        this.getLendingAsset = this.$store.state.loanAssetArr
        this.$store.state.loanAssetArr.forEach(item => {
          if (item[1].length > 0) this.loanSymbol.push(item[0])
        })
        if (this.$store.state.loanAssetArr.length <= 0) {
          this.$message({
            message: 'no lend asset set',
            type: 'error'
          })
          this.canloan = 'no asset set '
          return
        }
        this.ipGet() // 借款币种,根据IP获取得到币种
        this.feeGet() // 获取预计手续费
      },
      _isAuthenticator () {
        Apis.instance().db_api().exec('is_authenticator', [this.$store.state.userDataSid, 2, this.ruleForm.loanSymbolValue.id, this.curLendCarrierAccount.lendaccount]).then(status => {
          if (status === 2000) {
            this.kycInfo = {}
            this.kycInfo.name = undefined
            this.comfirmPassword = true
          } if (status === -5) {
            this.$message({
              message: this.$t('m.kyc.statues5') + ' name: ' + this.curLendCarrierAccount.lendauthor_name + ' asset: ' + this.ruleForm.loanSymbolValue.symbol,
              type: 'error'
            })
            this.comfirmPassword = false
          } else {
            if (this.curLendCarrierAccount.lendauthor_url === '' || this.curLendCarrierAccount.lendauthor_url === undefined) {
              this.$message({
                message: this.$t('m.params.noAuthor') + ' url ' + this.curLendCarrierAccount.lendauthor_url,
                type: 'error'
              })
              this.comfirmPassword = false
            } else {
              this.kycurl = this.curLendCarrierAccount.lendauthor_url
              kycStatus(this.kycurl + '/zos-kyc/', {chainid: this.$store.state.userDataSid, authorid: this.curLendCarrierAccount.lendauthor_account}).then(res => {
                this.kycStatusCode = res.ret_code
                if (status > 0) {
                  this.kycInfo = {}
                  this.kycInfo.name = res.name
                  this.comfirmPassword = true
                } else {
                  this.comfirmPassword = false
                  if (res.ret_code === '0' || res.ret_code === '1') {
                    this.kycInfo = {}
                    this.kycInfo.name = res.name
                    this.kycInfo.ictype = res.ictype
                    this.kycInfo.icno = res.icno
                    this.checkinfoDialog = true
                    this.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
                  } else {
                    this.hintKycDialog = true
                  }
                }
              }).catch(err => {
                console.log(err)
                this.$message({
                  message: this.$t('m.httpUtils.warning') + ' url: ' + this.curLendCarrierAccount.lendauthor_url + ' error: ' + err,
                  type: 'error'
                })
              })
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: this.$t('m.httpUtils.warning') + err,
            type: 'error'
          })
        })
      },
      // 获得预计手续费和用户的ZOS资产
      feeGet () {
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'bitlender_lend_order')
          .then((res) => {
            this.ruleForm.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.ruleForm.zos_balance = res.fee_balance / Math.pow(10, res.precision)
            formatAssets.updateAssets(res.symbol, res.fee_balance)
          })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
          })
      },
      // 借款币种,根据IP获取得到币种
      ipGet () {
        let loanSymbol = getStore('loanSymbol')
        this.ruleForm.loanSymbolValue = this.loanSymbol[0]
        for (let i = 0; i < this.loanSymbol.length; i++) {
          if (this.loanSymbol[i].symbol === loanSymbol) {
            this.ruleForm.loanSymbolValue = this.loanSymbol[i]
            break
          }
        }
        this.maxSupplyLoan = this.ruleForm.loanSymbolValue.max_supply * 0.33 / Math.pow(10, this.ruleForm.loanSymbolValue.precision)
        this.bitlenderEvent(this.ruleForm.loanSymbolValue)
      },
      // 获取运营商
      getCarrier () {
        return Apis.instance().admin_api().exec('get_carrier', [this.$store.state.admin_id, this.ruleForm.loanSymbolValue.id, null]).then((account) => {
          if (account === undefined) {
            this.$message({
              message: 'no carrier ' + this.ruleForm.loanSymbolValue.symbol,
              type: 'error'
            })
            this.canloan = 'no carrier '
            return Promise.reject(account)
          }
          this.curLendCarrierAccount = account
          if (!account.lendenable) {
            this.canloan = 'loan carrier stop'
          }
          if (!account.lendvalidate) {
            this.canloan = 'loan carrier not validate in bitlender option'
          }
          return Promise.resolve(account)
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '' + error,
            type: 'error'
          })
          this.canloan = 'no carrier '
          return Promise.reject(this.curLendCarrierAccount)
        })
      },
      // 选择法币
      bitlenderEvent (val) {
        if (this.loanSymbol_sel === val.symbol) {
          return
        }
        this.ruleForm.loanSymbolValue = val
        setStore('loanSymbol', val.symbol)
        this.loanSymbol_sel = val.symbol
        this.collateralSymbol_sel = ''
        // 运营商
        this.getCarrier().then((res) => {
          ZOSInstance.getBitlenderOption(this.ruleForm.loanSymbolValue.id).then((res) => {
            // 重置所有的值
            this.$refs['ruleForm'].resetFields()
            this.ruleForm.getAmount = 0
            this.ratio = 0
            this.carrierServiceRate = 0
            this.cover = 0
            this.unwind = 0
            this.total = 0
            this.collRisk = 0
            this.collFee = 0
            this.interest = 0
            this.feeMode = res.fee_mode
            this.mainloading = false
            // 借款期限，和利率
            this.borrowTimeLimitOptions = res.interest_rate
            // 配置参数
            this.otherOptions = res.options
            if (this.borrowTimeLimitOptions && this.borrowTimeLimitOptions.length > 0) {
              this.maxBidTimeIndex = this._maxBidTime(res.options)
            }
            this.allowedCollateralize(this.ruleForm.loanSymbolValue.id) // 可抵押币
          }).catch((error) => {
            console.log(error)
            this.$message({
              message: error + this.$t('m.borrow.selectOther'),
              type: 'error'
            })
            this.canloan = 'no option '
          })
        })
      },
      // 可抵押币筛选
      allowedCollateralize (val) {
        for (let key of this.getLendingAsset) {
          if (key[0].id === val) {
            this.collateralSymbol = key[1]
            break
          }
        }
        // 抵押物默认值
        let collateralSymbol = getStore('collateralSymbol')
        let selvar = this.collateralSymbol[0]
        for (let i = 0; i < this.collateralSymbol.length; i++) {
          if (this.collateralSymbol[i].symbol === collateralSymbol) {
            selvar = this.collateralSymbol[i]
            break
          }
        }
        this.mortgagedEvent(selvar)
      },
      // 输入借款数量后，得到抵押物的数量
      getAmountBlur () {
        // 借款金额和抵押都有的时候请求
        if (this.ruleForm.borrowNum && Number(this.ruleForm.borrowNum) < this.maxSupplyLoan && this.ruleForm.collateralValue.symbol) {
          this.$refs['ruleForm'].validateField('mortgageNum')
          this.getCollaboration()
          this.getAllFee()
          this.maxSupplyCollateral = this.ruleForm.collateralValue.max_supply * 0.33 / Math.pow(10, this.ruleForm.collateralValue.precision)
        }
      },
      // 抵押物数量输入失去焦点
      mortgageNumBlur () {
        if (Number(this.ruleForm.mortgageNum) === 0) {
          this.ruleForm.mortgageNum = ''
        } else {
          if (this.ruleForm.borrowNum) {
            this._watchRatio()
            // this.ratio = this.ruleForm.ratio = ((this.ruleForm.mortgageNum * this.ruleForm.mortgagedFeedShow) / this.ruleForm.borrowNum).toFixed(3)
            this.cover = this.ruleForm.borrowNum * this.collateralRatio / this.ruleForm.mortgageNum // 补仓线
            this.unwind = this.ruleForm.borrowNum * this.squeezeRatio / this.ruleForm.mortgageNum // 平仓线
          }
        }
      },
      // 得到各种手续费loanSymbolValue collateralValue
      getAllFee () {
        ZOSInstance.get_loan_info(
          this.$store.state.userDataSid,
          this.ruleForm.borrowNum * Math.pow(10, this.ruleForm.loanSymbolValue.precision),
          this.ruleForm.loanSymbolValue.id,
          this.borrowTimeLimit,
          this.interestRates * 10,
          this.ruleForm.LValue * 24 * 3600,
          this.ruleForm.multiple * 1000,
          0,
          this.ruleForm.collateralValue.id
        )
          .then((cid) => {
            // 抵押数量,*倍数 = 实际要抵押的数量
            if (cid.collateralize_fee.asset_id === this.ruleForm.loanSymbolValue.id) {
              this.feeSymbol = this.ruleForm.loanSymbolValue.symbol
              this.feePrecision = this.ruleForm.loanSymbolValue.precision
            } else {
              this.feeSymbol = this.ruleForm.collateralValue.symbol
              this.feePrecision = this.ruleForm.collateralValue.precision
            }
            if (cid.carrier_fee.asset_id === this.ruleForm.loanSymbolValue.id) {
              this.feeCarrierPrecision = this.ruleForm.loanSymbolValue.precision
            } else {
              this.feeCarrierPrecision = this.ruleForm.collateralValue.precision
            }
            // 抵押费用
            this.ruleForm.collFee = cid.collateralize_fee.amount / Math.pow(10, this.feePrecision)
            // 风险准备金
            this.ruleForm.collRisk = cid.collateralize_risk.amount / Math.pow(10, this.feePrecision)
            // 运营商服务费
            this.ruleForm.carrierServiceRate = cid.carrier_fee.amount / Math.pow(10, this.feeCarrierPrecision)
            this.ruleForm.mortgageNum = cid.amount_to_collateralize.amount / Math.pow(10, this.ruleForm.collateralValue.precision)
            this.copyMortgageNum = deepClone(this.ruleForm.mortgageNum)
            this.mortgageNumInput()
            // 到手金额
            this.watchFee()
          })
          .catch((err) => {
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
          })
      },
      _watchRatio () {
        if (this.ruleForm.borrowNum && this.ruleForm.mortgageNum) {
          this.ratio = this.ruleForm.ratio = ((this.ruleForm.mortgageNum * this.ruleForm.mortgagedFeedShow) / this.ruleForm.borrowNum).toFixed(3)
        }
      },
      // 手动输入，抵押物数量，失去焦点时，要改变滑杆的值
      mortgageNumEvent () {
        if (this.ruleForm.borrowNum && !isNaN(this.ruleForm.borrowNum) && !isNaN(this.ruleForm.mortgageNum) && this.ruleForm.collateralValue) {
          this.ratio = this.ruleForm.ratio = Math.round((this.ruleForm.mortgageNum / (this.ruleForm.borrowNum / this.ruleForm.mortgagedFeedShow)) * 1000) / 1000
        }
      },
      // 得到喂价
      getFeed () {
        // 借款金额的币种，抵押物币种
        if (this.ruleForm.loanSymbolValue.symbol && this.ruleForm.collateralValue.symbol) {
          // 获取抵押货币的信息,返回喂价信息和余额
          // 参数:当期用户ID，抵押货币的ID，bitasset_data_id, 抵押物的精度 和法币的喂价信息，法币的精度
          ZOSInstance.getCollateralFeed(
            this.ruleForm.loanSymbolValue.id,
            this.ruleForm.loanSymbolValue,
            this.ruleForm.collateralValue
          )
            .then(res => {
              this.collateralRatio = res.maintenance_collateral_ratio
              this.squeezeRatio = res.maximum_short_squeeze_ratio
              this.getCollaboration()
              this.ruleForm.mortgagedFeedShow = res.feed_price
              this.ruleForm.mortgagedFeed = (1 / res.feed_price).toFixed(this.ruleForm.collateralValue.precision > this.ruleForm.loanSymbolValue.precision ? this.ruleForm.collateralValue.precision : this.ruleForm.loanSymbolValue.precision)
              if (this.ruleForm.mortgagedFeed <= 0) {
                this.$message({
                  message: 'no feed',
                  type: 'error'
                })
                this.canloan = 'no feed'
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message({
                message: error,
                type: 'error'
              })
              this.canloan = 'no feed'
            })
        }
      },
      getAccBalance () {
        return Apis.instance().db_api().exec('get_account_balances', [this.$store.state.userDataSid, [this.ruleForm.collateralValue.id]]).then((balance) => {
          formatAssets.updateAssets(this.ruleForm.collateralValue.symbol, balance[0].amount)
        })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
          })
      },
      getCollaboration () {
        return Apis.instance().admin_api().exec('get_collaboration', [this.curLendCarrierAccount.investaccount, this.ruleForm.loanSymbolValue.id, this.ruleForm.collateralValue.id]).then((account) => {
          if (account === undefined) {
            this.$message({
              message: 'no feed',
              type: 'error'
            })
            this.canloan = 'no feed'
          }
          this.ruleForm.multiple = account.rate / 1000
        })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
            this.canloan = 'no collaboration'
          })
      },
      // 选择抵押物的事件
      mortgagedEvent (v) {
        if (this.collateralSymbol_sel === v.symbol) {
          return
        }
        this.collateralSymbol_sel = v.symbol
        setStore('collateralSymbol', v.symbol)
        this.ruleForm.collateralValue = v
        // 得到喂价
        this.getFeed()
        this.getAmountBlur()
      },
      // 抵押数量小数点位数
      mortgageNumInput () {
        let mortgageNum = this.ruleForm.mortgageNum.toString()
        if (mortgageNum.indexOf('.') !== -1) {
          let nums = mortgageNum.substring(mortgageNum.indexOf('.') + 1)
          if (nums.length > this.ruleForm.collateralValue.precision) {
            this.ruleForm.mortgageNum = Number(this.ruleForm.mortgageNum)
            let into = this.ruleForm.mortgageNum + 5 / Math.pow(10, (this.ruleForm.collateralValue.precision + 1))
            this.ruleForm.mortgageNum = into.toFixed(this.ruleForm.collateralValue.precision)
          }
        }
        this.mortgageNumEvent()
      },
      // 充币
      chargeMoney () {
        this.chargeMoneyVisible = true
      },
      async _CarrierPromise () {
        await this.getCollaboration()
        await this.getAccBalance()
      },
      // 点借款按钮
      submitForm (formName) {
        if (this.canloan !== '') {
          this.$message({
            message: this.canloan,
            type: 'error'
          })
          return
        }
        this._CarrierPromise().then(res => {
          this.$refs[formName].validate((valid) => {
            if (valid && !this.interestRatesShow) {
              if (this.$store.state.login) {
                this._isAuthenticator()
              } else {
                this.$router.push({path: '/login'})
              }
            } else {
              return false
            }
          })
        })
      },
      // 借款请求后台
      bitlenderLendOrder (data) {
        if (data) {
          ZOSInstance.bitlender_lend_order(
            this.$store.state.userDataSid,
            // 运营商
            this.curLendCarrierAccount.lendaccount,
            this.ruleForm.loanSymbolValue.id,
            this.ruleForm.borrowNum,
            this.ruleForm.loanSymbolValue.precision,
            this.borrowTimeLimit,
            this.interestRates * 10,
            this.otherOptions.repayment_type,
            this.ruleForm.LValue,
            this.ruleForm.mortgageNum,
            this.ruleForm.collateralValue.id,
            this.ruleForm.collateralValue.precision,
            this.ruleForm.ratio,
            '1.3.0'
          )
            .then(res => {
              this.comfirmPassword = false
              this.confirmDialog = true
              this.ruleForm.realFeeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
              this.ruleForm.tr = res.tr
            })
            .catch((err) => {
              console.log(err)
              this.$message({
                message: err,
                type: 'error'
              })
              this.comfirmPassword = false
              this.$router.push({name: 'borrowingList'})
            })
        } else {
          this.comfirmPassword = false
        }
      },
      // 提交借款
      borrowSubmit () {
        this.loading = true
        // 处理广播
        ZOSInstance.broadcastTransaction(this.ruleForm.tr)
          .then((res) => {
            this.loading = false
            this.confirmDialog = false
            this.$store.state.unRouterChange = false
            // '提交成功'
            MessageBox.alert(this.$t('m.badloans.subSucc'), {
              confirmButtonText: this.$t('m.sure'),
              callback: _ => {
                this.$router.push({name: 'borrowingList'})
              }
            })
          })
          .catch((err) => {
            this.loading = false
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
            this.confirmDialog = false
            this.btnText = this.$t('m.sure')
          })
      },
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      onCheckinfoClose () {
        this.checkinfoDialog = false
      },
      onCheckinfoSuccess () {
      },
      onAuthenticationClose () {
        this.authenticationDialog = false
      },
      onAuthenticationSuccess () {
      },
      goAuthentication () {
        this.hintKycDialog = false
        this.authenticationDialog = true
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      this.mainloading = true
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
  .el-loading-spinner {
    /*top: 1% !important;*/
    margin-top: -21px !important;
    width: 100%!important;
    text-align: center!important;
    position: absolute!important;
  }
  .el-card{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background: none !important;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
  }
  .borrow-options{
    cursor: pointer;
    float: left;
    margin-right: 9px;
  }
  .borrow-options:last-child{
    cursor: pointer;
    float: left;
    margin-right: 0;
  }
  .borrowselect{
    background: #ff4949;
    border: 1px solid #ff4949;
    border-radius: 2px;
    padding: 5px 10px;
    margin-right: 5px;
    cursor: pointer;
    color: #fff;
  }
  .dialogP{
    margin-top: -20px;
  }
  .dialogP h1 {
    font-size: 16px;
    font-weight: bold;
  }
  .el-radio-button__inner{
    border: 1px solid #dcdfe6 !important;
    border-radius: 2px !important;
    padding: 6px 12px!important;
    box-shadow: none !important;
  }

  #dialog-collateral .el-dialog__body{
    overflow: auto !important;
    height: 60vh !important;
  }
  .interest-show{
    color: #f56c6c;
    font-size: 12px;
  }
  /*11-13改版*/
  .borrow-main{
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 30px 50px 0;
    background: #fff;
    border-radius: 4px;
    .write-amount{
      display: flex;
      flex:1;
      flex-direction: row;
      .loan-info,
      .collateral-info{
        max-width: 300px;
        display: flex;
        flex: 1;
        flex-direction: column;
        .command{
          padding: 5px 20px; display: flex; flex: 1; flex-direction: row; align-items: center; background: rgba(243,244,249,1); border-radius: 3px
        }
        .el-input__inner{
          border: none!important;
          text-align: right!important;
          padding-right: 30px!important;
          font-size: 20px!important;
          color: #3F4040!important;
          font-weight: bold;
        }
        .min-loan{
          font-weight: 400;
          color: #87898D;
        }
        .collateral-notice{
          display: flex;
          flex: 1;
          flex-direction: row;
        }
      }
    }
    .loan-period{
      justify-content: center;
      align-items: center;
    }
    h1{
      color: #191A5E;
      font-size: 14px;
      font-weight:500
    }
    .loan-rate{
      justify-content: space-between;
      align-items: center;
      .el-input__inner{
        border: none!important;
        padding-left: 0!important;
        padding-right: 0!important;
      }
    }
    .write-loan-amount{
      border: none!important;
      border-bottom: 2px solid rgba(215,215,226,1) !important;
      padding-left: 10px;
    }
    .submit-loan{
      .main-btn{
        background: rgba(93,93,255,1);
      }
    }

  }
  .borrow-show-info{
    margin-left: 24px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .to-hand{
      background: #fff;
      border-radius: 3px;
      display: flex;
      /*flex: 1;*/
      flex-direction: column;
      padding: 20px;
      .top,
      .bottom{
        .title{
          color: #191A5E;
          font-size: 14px;
          font-weight: 500;
        }
        .title-symbol{
          background: rgba(232,242,254,1);
          font-size: 10px;
          border-radius: 2px;
          padding:0 5px;
          color: #65A3F6;
        }
      }
      .bottom{
        font-weight: 400;
        color:rgba(135,137,141,1);
      }
      .to-hand-amount{
        font-size: 16px;
        font-weight: 500;
        color:rgba(89,153,229,1);
        margin-left: 5px;
      }
    }
  }
  .jyNVPQ1{
    background: none!important;
  }
  .exchange-icon{
    display: flex; flex:1; justify-content: center;align-items: center; font-size: 18px; margin-top: 50px;
    width: 60px;
  }
  .borrow-rate{
    display: flex; flex: 1; justify-content: space-between; align-items: center; max-width: 300px
  }
  .m-line{
    margin-left: 5px;
    margin-right: 5px;
  }
  .warning{
    color: #e6a23c;
  }
  .err{
    color: #ff0000
  }
</style>

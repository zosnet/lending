<template>
  <div slot="content" class="container-params" v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div v-if="loading<=0">
      <dl>
            <div class="separ">
              <!--借款参数-->
              <dt class="lh40 feel">
                <span>{{$t('m.params.borrowParam')}}</span>
                <div style="flex:1"></div>
                <!--按钮区-->
                <el-button type="primary" v-show="addParams" @click="tableDataParamsShow=!tableDataParamsShow;createParams=true">
                  {{$t('m.params.addParams')}}
                </el-button>
                <el-button type="primary" v-show="!addParams" v-if="tableDataParamsShow && canEditBit" @click="tableDataParamsShow=!tableDataParamsShow;">
                <!-- <el-button type="primary" v-show="!addParams"  @click="tableDataParamsShow=!tableDataParamsShow;"> -->
                  {{$t('m.params.update')}}
                </el-button>
                <div v-if="!tableDataParamsShow">
                  <el-button type="primary" @click="sumbitParms">{{$t('m.params.submit')}} </el-button>
                  <el-button @click="paramsCancel">{{$t('m.cancel')}}</el-button>
                </div>
                <!--按钮区-->
                <!--输入资金密码-->
                <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
              </dt>
              <dd>
                {{options}}
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  stripe
                  id="cancanl"
                >
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <div v-if="scope.row.updatestatus">
                        <el-input v-if="scope.row.key === 'max_repayment_period'"
                                  v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  @keyup.native="scope.row.newValue < 1 || scope.row.newValue > parameter.max_rate_month ? errorMessage(scope.row): scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  style="width: 80%"
                                  :clearable="true"
                                  :placeholder="scope.row.placeholder"
                        ></el-input>
                        <el-input v-else-if="scope.row.key === 'max_repayment_rate'"
                                  v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  @blur="interestFixed(scope.row)"
                                  :placeholder="scope.row.placeholder"
                                  @keyup.native="scope.row.newValue > parameter.max_repayment_rate / 10 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\.\d]/g, '')"
                                  style="width: 80%"
                                  :clearable="true"
                        ></el-input>
                        <el-input v-else-if="scope.row.key === 'max_bid_time'"
                                  v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  :placeholder="scope.row.placeholder"
                                  @keyup.native="scope.row.newValue < 1 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  style="width: 80%"
                        ></el-input>

                        <el-input v-else-if="scope.row.key === 'min_loan_amount'"
                                  v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  @blur="integerTimes(scope.row, scope.row.newValue, $refs.minloanincrease.value)"
                                  :placeholder="scope.row.placeholder"
                                  @keyup.native="scope.row.newValue < 1 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  style="width: 80%"
                                  :clearable="true"
                                  ref="minloan"
                        ></el-input>
                        <el-input v-else-if="scope.row.key === 'min_loan_increase_range'"
                                  v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  @blur="integerTimes(scope.row, $refs.minloan.value, scope.row.newValue)"
                                  :placeholder="scope.row.placeholder"
                                  @keyup.native="scope.row.newValue < 1 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  style="width: 80%"
                                  :clearable="true"
                                  ref="minloanincrease"
                        ></el-input>
                        <el-input v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  @keyup.native="scope.row.newValue < 1 ? scope.row.newValue = '' : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  style="width: 80%"
                                  :clearable="true"
                                  v-else
                                  :placeholder="scope.row.placeholder"
                        ></el-input>
                        <span v-if="scope.row.value.toString().match('%')">
                          %
                        </span>
                        <!--'秒'-->
                        <span v-else-if="scope.row.value.toString().match($t('m.day'))">
                          ({{$t('m.day')}})
                        </span>
                        <span v-else-if="scope.row.value.toString().match('‰')">
                          ‰
                        </span>
                      </div>

                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <!--投资参数-->
              <dt class="lh40 margin-t40">{{$t('m.params.investParam')}}</dt>
              <dd>
                <el-table
                  :data="investData"
                  style="width: 100%"
                  stripe>
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :abel="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <div v-if="scope.row.updatestatus">
                        <el-input v-if="scope.row.key === 'min_invest_amount'"
                                  v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  style="width: 80%"
                                  @blur="integerTimes(scope.row, scope.row.newValue, $refs.mininvestincrease.value)"
                                  @keyup.native="scope.row.newValue < 1 ? scope.row.newValue = '' : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  ref="mininvest"
                                  :placeholder="scope.row.placeholder"
                        ></el-input>
                        <el-input v-model="scope.row.newValue"
                                  v-else
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  style="width: 80%"
                                  @blur="integerTimes(scope.row, $refs.mininvest.value, scope.row.newValue)"
                                  @keyup.native="scope.row.newValue < 1 ? scope.row.newValue = '' : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                  ref="mininvestincrease"
                                  :placeholder="scope.row.placeholder"
                        ></el-input>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

               <!--还款参数-->
              <dt class="lh40 margin-t40">{{$t('m.params.paymentParam')}}</dt>
              <dd>
                <el-table
                  :data="tableDataPay"
                  style="width: 100%"
                  stripe>
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :abel="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <div v-if="scope.row.updatestatus">
                        <el-input v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  style="width: 80%"
                                  @keyup.native="scope.row.newValue < 1 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\.\d]/g, '')"
                                  :placeholder="scope.row.placeholder"
                        ></el-input>
                        <span>
                          ({{$t('m.minutes')}})
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <!--费率参数-->
              <dt class="lh40 margin-t40">{{$t('m.params.rateParam')}}</dt>
              <dd>
                <el-table
                  :data="tableDataRate"
                  style="width: 100%"
                  stripe>
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                    <template slot-scope="scope" class="feel">
                      {{scope.row.value}}
                    </template>
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <!--运营商服务费费率-->
                      <el-input v-if="scope.row.key === 'carrier_service_charge_rate'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus && feeMode !== 'invest' ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                :placeholder="feeMode === 'invest' ? '' : scope.row.placeholder"
                                @keyup.native="scope.row.newValue < 0 || scope.row.newValue > parameter.max_carrier_service_rate ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                      ></el-input>
                      <!--平台服务费费率-->
                      <el-input v-else-if="scope.row.key === 'platform_service_charge_rate'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @keyup.native="scope.row.newValue < 1 || scope.row.newValue > parameter.max_platform_service_rate ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                :placeholder="scope.row.placeholder"
                      ></el-input>
                      <!--风险保证金费率-->
                      <el-input v-else-if="scope.row.key === 'risk_margin_rate'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @keyup.native="scope.row.newValue < 1 || scope.row.newValue > parameter.max_risk_margin_rate ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                :placeholder="scope.row.placeholder"
                      ></el-input>
                      <!--平台服务费上限-->
                      <el-input v-else-if="scope.row.key === 'max_risk_margin' || scope.row.key === 'max_platform_service_charge_rate'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @blur="moreThan(scope.row)"
                                :placeholder="scope.row.placeholder"
                      ></el-input>
                      <!--运营商服务费/风险保证金上限-->
                      <el-input v-else-if="scope.row.key === 'max_carrier_service_charge'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @blur="interestFixed(scope.row, selectedSymbol.precision, 2)"
                      ></el-input>

                      <span v-if="scope.row.value.toString().match('‰')">
                    ‰
                  </span>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <!--运营商服务费分配比例-->
              <dt class="lh40 margin-t40">{{$t('m.params.carrierServer')}}</dt>
              <dd>
                <el-table
                  :data="carrierData"
                  style="width: 100%"
                  stripe>
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                    <template slot-scope="scope" class="feel">
                      {{scope.row.value}}
                    </template>
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <el-input v-if="scope.row.key === 'carrier_service_loan_carrier'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @keyup.native="scope.row.newValue < 0 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                :placeholder="scope.row.placeholder"
                                @blur="totalFn(scope.row, scope.row.newValue, $refs.investcarrier.value)"
                                ref="loancarrier"
                      ></el-input>
                      <el-input v-else
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @blur="totalFn(scope.row, $refs.loancarrier.value, scope.row.newValue)"
                                @keyup.native="scope.row.newValue < 0 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\.\d]/g, '')"
                                :placeholder="scope.row.placeholder"
                                ref="investcarrier"
                      ></el-input>
                      <span v-if="scope.row.value.toString().match('%')">
                    %
                  </span>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <!--平台服务费分配比例-->
              <dt class="lh40 margin-t40">{{$t('m.params.platformServer')}}</dt>
              <dd>
                <el-table
                  :data="platformData"
                  style="width: 100%"
                  stripe>
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                    <template slot-scope="scope" class="feel">
                      {{scope.row.value}}
                    </template>
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <!--平台服务费分配比例-平台方分配比例-->
                      <el-input v-if="scope.row.key === 'platform_service_platform'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @blur="platformService(scope.row)"
                                :placeholder="scope.row.placeholder"
                      ></el-input>
                      <!--借方运营商分配比例/投资方运营商分配比例-->
                      <el-input
                        v-else-if="scope.row.key === 'platform_service_loan_carrier' || scope.row.key === 'platform_service_invest_carrier' || scope.row.key === 'platform_service_invest_refer' || scope.row.key === 'platform_service_gateway' || scope.row.key === 'platform_service_loan_refer'"
                        v-model="scope.row.newValue"
                        :readonly="scope.row.updatestatus ? false : true"
                        :disabled="scope.row.updatestatus ? false : true"
                        :class="{showborder: !tableDataParamsShow}"
                        style="width: 80%"
                        @keyup.native="scope.row.newValue < 0 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                        :placeholder="scope.row.placeholder"
                      ></el-input>

                      <el-input v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @keyup.native="scope.row.newValue < 1 ? scope.row.newValue = '' : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                v-else
                                :placeholder="scope.row.placeholder"
                      ></el-input>

                      <span v-if="scope.row.value.toString().match('%')">
                    %
                  </span>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <!--逾期-->
              <dt class="lh40 margin-t40">{{$t('m.borrowsuccess.withOut')}}</dt>
              <dd>
                <el-table
                  :data="tableDataOverdue"
                  style="width: 100%"
                  stripe>
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                    <template slot-scope="scope" class="feel">
                      {{scope.row.name}}
                      <el-popover
                        popper-class="help"
                        v-if="scope.row.help"
                        placement="bottom"
                        width="320"
                        trigger="hover"
                        class="margin-l10"
                        :content="scope.row.help">
                        <span slot="reference"><i class="el-icon-question" style="color: #409EFF"></i></span>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <el-input v-if="scope.row.key === 'overdue_penalty_date_interest_rate'"
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @blur="interestFixed(scope.row)"
                                :placeholder="scope.row.placeholder"
                      ></el-input>
                      <el-input v-else
                                v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataParamsShow}"
                                style="width: 80%"
                                @keyup.native="scope.row.newValue < 1 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\d]/g, '')"
                                :placeholder="scope.row.placeholder"
                      ></el-input>
                      <span v-if="scope.row.value.toString().match('%')">
                  %
                  </span>
                      <span v-else-if="scope.row.value.toString().match('‰')">
                  ‰
                  </span>
                      <span v-else-if="scope.row.value.toString().match($t('m.minutes'))">
                  ({{$t('m.minutes')}})
                  </span>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <!--运营参数-->
              <dt class="lh40 margin-t40">{{$t('m.params.operating')}}</dt>
              <dd>
                <el-table
                  :data="tableDataCarrier"
                  style="width: 100%"
                  stripe
                >
                  <!--label="参数名称"-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="name"
                  >
                  </el-table-column>
                  <!--参数值-->
                  <el-table-column
                    :label="$t('m.params.paramValue')"
                    style="width: 25%"
                    prop="value"
                  >
                    <template slot-scope="scope" class="feel">
                  <span v-for="(item, i) in scope.row.value" :key="i">
                    <i v-if="scope.row.value.length < 2 || i === scope.row.value.length - 1">
                    {{item}}
                    </i>
                    <i v-else>
                    {{item}},
                    </i>
                  </span>
                    </template>
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataParamsShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <div v-if="scope.row.updatestatus">
                        <el-input v-model="scope.row.newValue"
                                  :readonly="scope.row.updatestatus ? false : true"
                                  :disabled="scope.row.updatestatus ? false : true"
                                  :class="{showborder: !tableDataParamsShow}"
                                  style="width: 80%"
                                  v-if="scope.row.type === 'input'"
                                  @change="isUser(scope.row)"
                        ></el-input>
                        <!-- <el-select v-model="carriersId"
                                  debounce
                                  multiple
                                  :placeholder="$t('m.params.chooseMore')"
                                  v-if="scope.row.type === 'select'">
                          <el-option
                            v-for="item in carrierList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select> -->
                        <el-select v-model="collateId"
                                  @change="chooseCollate"
                                  debounce
                                  multiple
                                  :placeholder="$t('m.params.chooseMore')"
                                  v-if="scope.row.type === 'select1'">
                          <el-option
                            v-for="item in selectedTrading"
                            :key="item.id"
                            :label="item.symbol"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>
            </div>
      </dl>
    </div>
    <!--创建参数修改提案-->
    <el-dialog
      :title="$t('m.params.proposal')"
      :visible.sync="proposalDialog"
      width="45%"
    >
      <div v-loading="loadings" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vh;">
        <dl class="demo-ruleForm">
          <!--复审期开始-->
          <dt>{{$t('m.params.review')}}</dt>
          <dd><el-input value="-" readonly></el-input></dd>
          <!--提案内容-->
          <dt>{{$t('m.params.proposalContent')}}</dt>
          <dd style="padding: 10px">
            {{proposalContent}}
          </dd>
          <dt>
            <!--到期时间-->
            {{$t('m.params.Due')}}
          </dt>
          <dd><el-input :value="proposalTime * 1000 | formatProposalTime()" readonly></el-input></dd>
          <!--付款账户-->
          <dt>{{$t('m.params.payAccount')}}</dt>
          <dd><el-input :value="username" readonly></el-input></dd>
          <dt>2.
            <!--手续费-->
            {{$t('m.params.poundage')}}
          </dt>
          <dd>
            <div class="feel">
              <!--燃料费-->
              <!--(约)-->
              <span>{{$t('m.fuelCost')}}: {{feeZos}} ZOS{{$t('m.transfer.about')}}</span>
              <span style="flex: 1"></span>
              <!--可用数量-->
              <span>{{$t('m.transfer.KYSL')}}: {{available}} ZOS</span>
              <!--获得-->
              <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
            </div>
          </dd>
          <!--数量不足-->
          <dd v-show="zosShow(feeZos)" style="color: #ff0000">ZOS{{$t('m.transfer.numNull')}}</dd>
          <dd>
            <div class="feel">
              <span>
                <!--系统将优先使用优惠券抵扣-->
                {{$t('m.transfer.useCoupons')}}
              </span>
              <span style="flex: 1"></span>
              <span>
                <!--优惠券数量-->
                {{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS</span>
              <a class="margin-l10" @click="couponVisible=true">
                <!--关于优惠券-->
                {{$t('m.transfer.abountCoupons')}}
              </a>
            </div>
          </dd>

          <!--获得ZOS-->
          <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
          <!--关于优惠-->
          <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>

          <dd class="margin-t10 text-right">
            <y-button
              :text="$t('m.cancel')"
              @btnClick="proposalDialog=false"
            ></y-button>
            <!--创建-->
            <y-button
              :text="$t('m.params.create')"
              @btnClick="proposalSubmit"
              :classStyle="zosShow(feeZos) ? 'disabled-btn' : 'main-btn'"
            ></y-button>
          </dd>
        </dl>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import YButton from '/path-components/element/YButton'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import {getStore, setStore} from '/js-utils/storage'
  import formatAssets from '/js-api/public'
  import {Apis} from 'zosjs-ws'
  import deepClone from '/js-utils/deepClone'
  export default {
    name: 'options',
    components: {passwordDialog, YButton, getzosdialog, couponDialog, formatAssets},
    props: {
      optionId: '',
      symbol: '',
      selectedSymbol: {},
      Type: '',
      assetId: ''
    },
    data () {
      return {
        loading: true,
        // 提案
        loadings: false,
        couponVisible: false,
        zosDialog: false,
        author: '',
        optionId: '',
        // 参数
        params: {},
        tableData: [],
        // 参数修改显示
        tableDataParamsShow: true,
        updateInterestShow: false,
        comfirmPassword: false,
        // 提案宣传品
        proposalDialog: false,
        tr: '',
        // 提案内容
        proposalContent: {},
        proposalTime: '',
        username: this.$store.state.userName,
        feeZos: '',
        canEditBit: false,
        loanCarriers: [],
        investCarriers: [],
        allowAssets: [],
        gateways: [],
        gatewaysId: [],
        loanCarriersId: [],
        investCarriersId: [],
        isuerRateName: [],
        // 是否新增参数
        addParams: false,
        isExist: false,
        isuerRateId: '',
        sproduct: '',
        budgetMember: '',
        confirmVisible: false,
        maxRate: '',
        parameter: '',
        getFeeders: '',
        getFeedersParam: [],
        optionKey: {repayment_period_uint: 1, repayment_type: 1, loan_mode: 0, op_type: 0},
        createParams: false,
        selectedTrading: [],
        selectedTradingVal: '',
        feedProducers: [],
        feedOption: {},
        copyGetFeeders: [],
        feeMode: '',
        collateId: [],
        copyCollateId: [],
        // 用户选择的可抵押币
        selectCollate: [],
        // 系统参数中的可抵押币
        allowedCollate: [],
        lastOne: []
      }
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
    methods: {
      // 大于0的数
      moreThan (item) {
        if (item.newValue) {
          if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(item.newValue)) {
            this.$message({
              message: this.$t('m.params.numberGreater'),
              type: 'error'
            })
            item.newValue = ''
          }
        }
      },
      // 金额，整数倍
      integerTimes (row, normal, increase) {
        if (normal && increase) {
          if (normal % increase !== 0) {
            row.newValue = ''
            this.errorMessage(row)
          }
        }
      },
      // 输入错误的提示
      errorMessage (item) {
        item.newValue = ''
        this.$message({
          message: item.errMessage,
          type: 'error'
        })
      },
      // 运营商服务费分配比例，之和100
      totalFn (row, first, second) {
        if (first && second) {
          if (Number(first) + Number(second) !== 100) {
            this.errorMessage(row)
          }
        }
      },
      // 平台方分配比例
      platformService (row) {
        if (row.newValue < this.parameter.min_platform_service_rate && row.newValue !== '') {
          row.newValue = ''
          this.$message({
            message: row.errMessage,
            type: 'warning'
          })
        } else {
          row.newValue = row.newValue.replace(/[^\d]/g, '')
        }
      },
      // 利率最多只能输入一位小数
      interestFixed (item, precision = 1, isZero = 1) {
        if (item.newValue && item.newValue > 0) {
          if (!/^[+]{0,1}([1-9])$|^[+]{0,1}(\d+\.?\d{1})$/.test(item.newValue)) {
            this.$message({
              message: this.$t('m.params.decimal'),
              type: 'error'
            })
            item.newValue = ''
          }
        } else {
          if (isZero === 1 && item.newValue !== '') {
            item.newValue = ''
            this.$message({
              message: this.$t('m.params.greater'),
              type: 'error'
            })
          }
        }
      },
      // 关闭zos
      isVisible () {
        this.zosDialog = false
      },
      // 关闭优惠
      couponClose () {
        this.couponVisible = false
      },
      // 初始数据
      init () {
        this.loading = 1
        this.getCurrencyData()
        this.loading--
      },
      chooseCollate () {
        if (this.collateId.length === 1) {
          this.lastOne = deepClone(this.collateId)
        }
        if (this.collateId.length < 1) {
          this.collateId = []
        }
      },
      canLeave () {
        return this.isEditData() === false
      },
      changeOption (id, assetId, type) {
        this.assetId = assetId
        this.optionId = id
        this.Type = type
        this.loading = 1
        this.getCurrencyData()
        this.loading--
      },
      getfeederData () {
        // 喂价人
        this.getFeeders = []
        this.loading++
        ZOSInstance.get_account(this.feedOption.feeders).then(feederObj => {
          feederObj.forEach((item, index) => {
            this.getFeeders.push({userId: item.get('id'), userName: item.get('name')})
          })
          this.loading--
          this.copyGetFeeders = [...(this.getFeeders)]
        }).catch(feederErr => {
          this.loading--
          console.log(feederErr)
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
            this.tableDataCarrier[6]['value'] = this.getFeedersParam
            // Vue.set(this.tableDataCarrier, 4, {name: this.$t('m.params.getFeeders'), key: 'get_feeders', value: this.getFeeders, newValue: '', updatestatus: false, type: 'input'})
          }
          this.loading--
        }).catch(e => {
          this.loading--
        })
      },
      getCurrencySync () {
        this.getfeederData()
        this.allowedCollate = []
        if (this.params.allowed_collateralize && this.params.allowed_collateralize.length > 0) {
          this.loading++
          Apis.instance().db_api().exec('get_objects', [this.params.allowed_collateralize])
            .then(res => {
              res.forEach(item => {
                let param = {}
                param.id = item.id
                param.symbol = item.symbol
                this.allowedCollate.push(param)
              })
              this.allowAssets = this._allowedCollateInit()
              this.tableDataCarrier[0]['value'] = this.allowAssets
              this.loading--
            })
            .catch(err => {
              this.loading--
              console.log(err)
              this.$message({
                message: err,
                type: 'warning'
              })
            })
        } else {
          // this.allowedCollate = this.selectedTrading
        }
        // 运营商
        this.loading++
        ZOSInstance.get_account(this.params.loan_carriers).then(data => {
          data.forEach(val => {
            this.loanCarriers.push(val.get('name'))
          })
          this.loading--
          this.tableDataCarrier[2]['value'] = this.loanCarriers
        }).catch(feederErr => {
          this.loading--
          console.log(feederErr)
          this.$message({
            message: feederErr,
            type: 'warning'
          })
        })
        // 运营商
        this.loading++
        ZOSInstance.get_account(this.params.invest_carriers).then(data => {
          data.forEach(val => {
            this.investCarriers.push(val.get('name'))
          })
          this.loading--
          this.tableDataCarrier[3]['value'] = this.investCarriers
        }).catch(feederErr => {
          this.loading--
          console.log(feederErr)
          this.$message({
            message: feederErr,
            type: 'warning'
          })
        })
        this.loading++
        ZOSInstance.get_account(this.gatewaysId).then(res => {
          res.forEach(val => {
            this.gateways.push(val.get('name'))
          })
          this.loading--
          this.tableDataCarrier[4]['value'] = this.gateways
        }).catch(err => {
          this.loading--
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        this.loading++
        ZOSInstance.getAuthsFromAccount(this.author).then(result => {
          this.tableDataCarrier[5]['value'] = result
          this.budgetMember = result
          this.loading--
        }).catch(err => {
          this.loading--
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        this.loading++
        ZOSInstance.getAssetList().then(item => {
          if (!item.cash_list || !item.lender_list || item.cash_list.length <= 0 || item.lender_list.length <= 0) {
          } else {
            this.selectedTrading = item.lender_list
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
      },
      // 币种的相当数据
      getCurrencyData () {
        this.loanCarriers = []
        this.investCarriers = []
        this.gateways = []
        this.isuerRateName = []
        this.getFeeders = []
        this.getFeedersParam = []
        this.loading++
        // 参数限制
        this.parameterLimits()
        ZOSInstance.getBitlenderOption(this.selectedSymbol.id, this.Type).then(res => {
          if (!res) {
            this.loading--
            return
          }
          this.author = res.author
          this.optionId = res.id
          // 其它的参数
          this.params = res.options
          this.optionKey = ZOSInstance.getOptionKey(res.options.repayment_type)
          this.feeMode = res.fee_mode
          this.feedOption = res.feed_option
          this.maxRate = this.params.max_repayment_rate / 10
          this.gatewaysId = res.gateways
          this.loanCarriersId = res.loan_carriers
          this.investCarriersId = res.invest_carriers
          this.assetId = res.asset_id
          this.sproduct = res.sproduct
          if (!res.isExiste) {
            this.activeTabName = 'first'
            if (this.$store.state.userDataSid !== '') {
              this.loading++
              ZOSInstance.get_account(this.$store.state.userDataSid).then(acc => {
                if (acc.get('lifetime_referrer') === acc.get('id')) {
                  this.addParams = true
                  this.isExist = false
                  this.tableDataInterest = []
                }
                this.loading--
              }).catch(errmessa => {
                this.$message({
                  message: errmessa,
                  type: 'warning'
                })
                this.loading--
              })
            } else {
              this.addParams = false
              this.isExist = false
              this.canEditBit = false
            }
            // 有修改参数,就修改
          } else {
            this.addParams = false
            this.isExist = true
            // 是否可以修改参数
            if (this.$store.state.userDataSid !== '' && this.optionId !== '') {
              this.loading++
              ZOSInstance.can_edit_bitlender_option(this.optionId, this.$store.state.userDataSid, this.Type).then(edit => {
                this.loading--
                this.canEditBit = edit
              }).catch(errmess => {
                this.loading--
                this.$message({
                  message: errmess,
                  type: 'error'
                })
              })
            } else {
              this.canEditBit = false
            }
            // 利率的查询数据
            this.tableDataInterest = []
            this.issuerRate = res.options.issuer_rate
            res.interest_rate.forEach((val) => {
              let json = {}
              json.bid = val[0]
              // 因为基数为(10000),显示‰
              json.interest_rate = val[1].interest_rate / 10
              // decimalPlaces: '只能输入1位小数,不能为0,不能超过'
              json.errMessage = this.$t('m.params.decimalPlaces') + this.maxRate
              json.newValue = ''
              json.updatestatus = true
              this.tableDataInterest.push(json)
            })
            // 复制一份利率的数据，以区别新增
            this.tableDataInterestCopy = [...this.tableDataInterest]
            this.loading++
            ZOSInstance.get_account(this.params.issuer_rate)
              .then(dataRate => {
                this.isuerRateName.push(dataRate.get('name'))
                this.loading--
              })
              .catch(errors => {
                this.loading--
                console.log(errors)
                this.$message({
                  message: errors,
                  type: 'warning'
                })
              })
            this.getCurrencySync()
          }
          // 数据格式化,借款参数
          this.tableDataForm()
          this.loading--
        }).catch(errors => {
          this.loading--
          console.log(errors)
          this.$message({
            message: errors,
            type: 'warning'
          })
        })
        // this.getFeedDetail()
        // this.allowedCollate = []
      },
      prefixInteger (num, length) {
        if (this.addParams) return num + Array(length - 1).join('0')
        else return num
      },
      // 数据格式化
      tableDataForm () {
        /* 借款参数 */
        this.tableData = [
          // 最小借款金额
          {name: this.$t('m.params.minBorrow'), key: 'min_loan_amount', value: this.prefixInteger(this.params.min_loan_amount, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.Minimum') + this.$t('m.params.minBorrow') + this.$t('m.params.isYes') + this.$t('m.params.minBorrowIn') + this.$t('m.params.integer'), placeholder: this.$t('m.params.thanZero')},
          // 最小借款增加额
          {name: this.$t('m.params.minBorrowIn'), key: 'min_loan_increase_range', value: this.prefixInteger(this.params.min_loan_increase_range, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.MinimumThan') + this.$t('m.params.minBorrow') + this.$t('m.params.isYes') + this.$t('m.params.minBorrowIn') + this.$t('m.params.integer'), placeholder: this.$t('m.params.thanZero')},
          // '最大借款期限/最大投资周期'
          {name: this.$t('m.params.maxTime'), key: 'max_repayment_period', value: this.params.max_repayment_period, newValue: '', updatestatus: true, errMessage: this.$t('m.params.maxTime') + this.$t('m.params.greaterThan') + this.parameter.max_rate_month, placeholder: this.$t('m.params.thanZero')},
          // '借款期限单位'
          {name: this.$t('m.params.timeUnit'), key: 'repayment_period_uint', value: this.$t('m.invest.periodmode' + this.optionKey.repayment_period_uint), newValue: '', updatestatus: false, errMessage: this.$t('m.params.borrowing'), placeholder: this.$t('m.params.thanZero')},
          // '最大投标期限'
          {name: this.$t('m.params.maxInvest'), key: 'max_bid_time', value: this.params.max_bid_time / (24 * 3600) + '(' + this.$t('m.day') + ')', newValue: '', updatestatus: true, errMessage: this.$t('m.params.largest'), placeholder: this.$t('m.params.thanZero')},
          // '最大借款利率'
          {name: this.$t('m.params.maxRate'), key: 'max_repayment_rate', value: this.params.max_repayment_rate / 10 + '‰', newValue: '', updatestatus: true, errMessage: this.$t('m.params.maxRate') + this.$t('m.params.greaterThan') + this.parameter.max_repayment_rate / 10, placeholder: this.$t('m.params.zeroUp')},
          // '每月利率最大值'
          {name: this.$t('m.params.rateVal' + this.optionKey.repayment_period_uint), key: 'max_interest_rate', value: this.prefixInteger(this.params.max_interest_rate, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.monthlyInterest'), placeholder: this.$t('m.params.thanZero')}
        ]
        /* 投资参数 */
        this.investData = [
          // '最小投资金额'
          {name: this.$t('m.params.minInvest'), key: 'min_invest_amount', value: this.prefixInteger(this.params.min_invest_amount, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.minInvest') + this.$t('m.params.isYes') + this.$t('m.params.minInvestIn') + this.$t('m.params.integer'), placeholder: this.$t('m.params.thanZero')},
          // '最小投资增加额'
          {name: this.$t('m.params.minInvestIn'), key: 'min_invest_increase_range', value: this.prefixInteger(this.params.min_invest_increase_range, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.minInvest') + this.$t('m.params.isYes') + this.$t('m.params.minInvestIn') + this.$t('m.params.integer'), placeholder: this.$t('m.params.thanZero')}
        ]
        /* 还款参数 */
        this.tableDataPay = [
          // '还款方式'
          {name: this.$t('m.borrow.HKFS'), key: 'repayment_type', value: this.$t('m.invest.repayment' + this.optionKey.repayment_type), newValue: '', updatestatus: false},
          // '还款提醒时间(距还款日)'
          {name: this.$t('m.params.repayNote'), key: 'notify_overdue_time', value: this.params.notify_overdue_time + '(' + this.$t('m.minutes') + ')', newValue: '', updatestatus: true, errMessage: this.$t('m.params.repayNote') + this.$t('m.params.reminderTime'), placeholder: this.$t('m.params.thanZero')},
          // '还款日期'
          {name: this.$t('m.borrowsuccess.repayment_day'), key: 'repayment_date', value: this.params.repayment_date, newValue: '', updatestatus: false}
        ]
        /* 费率参数 */
        this.tableDataRate = [
          // '风险保证金费率'
          {name: this.$t('m.params.riskRate'), key: 'risk_margin_rate', value: this.params.risk_margin_rate + '‰', newValue: '', updatestatus: true, errMessage: this.$t('m.params.marginRate') + this.$t('m.params.greaterThan') + this.parameter.max_risk_margin_rate, placeholder: this.$t('m.params.thanZero')},
          // '风险保证金上限'
          {name: this.$t('m.params.maxRiskMargin'), key: 'max_risk_margin', value: this.prefixInteger(this.params.max_risk_margin, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.maxRiskMargin') + this.$t('m.params.digital'), placeholder: this.$t('m.params.numberGreater')},
          // '平台服务费费率'
          {name: this.$t('m.params.platformServiceRate'), key: 'platform_service_charge_rate', value: this.params.platform_service_charge_rate + '‰', newValue: '', updatestatus: true, errMessage: this.$t('m.params.platformServiceRate') + this.$t('m.params.chargeRate') + this.$t('m.params.greaterThan') + this.parameter.max_platform_service_rate, placeholder: this.$t('m.params.thanZero')},
          // '平台服务费上限'
          {name: this.$t('m.params.maxPlatformRate'), key: 'max_platform_service_charge_rate', value: this.prefixInteger(this.params.max_platform_service_charge_rate, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.maxPlatformRate') + this.$t('m.params.digitalPlatform'), placeholder: this.$t('m.params.numberGreater')},
          // // '运营商服务费费率'
          {name: this.$t('m.params.carrierRate'), key: 'carrier_service_charge_rate', value: this.params.carrier_service_charge_rate + '‰', newValue: '', updatestatus: true, errMessage: this.$t('m.params.carrierRate') + this.$t('m.params.greaterThan') + this.parameter.max_carrier_service_rate, placeholder: this.$t('m.params.greaterEqual')},
          // '运营商服务费上限'
          {name: this.$t('m.params.maxCarrierService'), key: 'max_carrier_service_charge', value: this.prefixInteger(this.params.max_carrier_service_charge, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.operatorsCap'), placeholder: this.$t('m.params.thanOrEqual')}
        ]
        /* 运营商服务费分配比例 */
        this.carrierData = [
          // '借方运营商分配比例'
          {name: this.$t('m.params.carrierServiceLoan'), key: 'carrier_service_loan_carrier', value: this.params.carrier_service_loan_carrier + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.proportionAs'), placeholder: this.$t('m.params.greaterEqual')},
          // '投资方运营商分配比例'
          {name: this.$t('m.params.carrierServiceInvest'), key: 'carrier_service_invest_carrier', value: this.params.carrier_service_invest_carrier + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.proportionAs'), placeholder: this.$t('m.params.greaterEqual')}
        ]
        /* 平台服务费分配比例 */
        this.platformData = [
          // '借方运营商分配比例'
          {name: this.$t('m.params.platformServiceLoan'), key: 'platform_service_loan_carrier', value: this.params.platform_service_loan_carrier + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.debitOperator'), placeholder: this.$t('m.params.greaterEqual')},
          // '投资方运营商分配比例'
          {name: this.$t('m.params.platformServiceInvest'), key: 'platform_service_invest_carrier', value: this.params.platform_service_invest_carrier + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.investorsOperator'), placeholder: this.$t('m.params.greaterEqual')},
          // '借方推荐人分配比例'
          {name: this.$t('m.params.loanRefer'), key: 'platform_service_loan_refer', value: this.params.platform_service_loan_refer + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.debitRatio'), placeholder: this.$t('m.params.greaterEqual')},
          // '投资方推荐人分配比例'
          {name: this.$t('m.params.investRefer'), key: 'platform_service_invest_refer', value: this.params.platform_service_invest_refer + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.investorReference'), placeholder: this.$t('m.params.greaterEqual')},
          // '平台分配比例'
          {name: this.$t('m.params.platformServicePlatform'), key: 'platform_service_platform', value: this.params.platform_service_platform + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.platformServicePlatform') + this.$t('m.params.lessThan') + this.parameter.min_platform_service_rate + this.$t('m.params.serviceAllocation'), placeholder: this.$t('m.params.moreThan') + this.parameter.min_platform_service_rate + this.$t('m.params.dinteger')},
          // '法币网关分配比例'
          {name: this.$t('m.params.platformServiceGateway'), key: 'platform_service_gateway', value: this.params.platform_service_gateway + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.fiatGateways'), placeholder: this.$t('m.params.greaterEqual')}
        ]
        /* 逾期 */
        this.tableDataOverdue = [
          // '本金逾期变不良资产时间 '
          {name: this.$t('m.params.overdueLiquidation'), key: 'overdue_expiration_time', value: this.params.overdue_expiration_time + '(' + this.$t('m.minutes') + ')', newValue: '', updatestatus: true, errMessage: this.$t('m.params.principalOverdue'), placeholder: this.$t('m.params.thanZero')},
          // '利息逾期罚金比例'
          {name: this.$t('m.params.overdueInterest'), key: 'overdue_penalty_interest_rate', value: this.params.overdue_penalty_interest_rate + '%', newValue: '', updatestatus: true, help: this.$t('m.params.once'), errMessage: this.$t('m.params.overdueFines'), placeholder: this.$t('m.params.thanZero')},
          // '本金逾期罚金比例'
          {name: this.$t('m.params.latePayment'), key: 'overdue_liquidation_rate', value: this.params.overdue_liquidation_rate + '%', newValue: '', updatestatus: true, help: this.$t('m.params.oncePro'), errMessage: this.$t('m.params.thePrincipal'), placeholder: this.$t('m.params.thanZero')},
          // '提前还款违约金比例'
          {name: this.$t('m.params.dueBreach'), key: 'early_repayment_liquidation_rate', value: this.params.early_repayment_liquidation_rate + '%', newValue: '', updatestatus: true, help: this.$t('m.params.insterest'), errMessage: this.$t('m.params.penalty'), placeholder: this.$t('m.params.thanZero')},
          // '利息逾期按天违约金率'
          {name: this.$t('m.params.dueInterest'), key: 'overdue_penalty_date_interest_rate', value: this.params.overdue_penalty_date_interest_rate / 10 + '‰', newValue: '', updatestatus: true, help: this.$t('m.params.overRate'), errMessage: this.$t('m.params.onlyEnter'), placeholder: this.$t('m.params.onlyEnter')},
          // '最大逾期期数'
          {name: this.$t('m.params.overdue'), key: 'max_overdue_period', value: this.params.max_overdue_period, newValue: '', updatestatus: true, help: this.$t('m.params.proOver'), errMessage: this.$t('m.params.overdue') + this.$t('m.params.ShouldBe'), placeholder: this.$t('m.params.thanZero')},
          // '投资者保本率'
          {name: this.$t('m.params.investors'), key: 'principal_guarantee_rate', value: this.params.principal_guarantee_rate + '%', newValue: '', updatestatus: true, errMessage: this.$t('m.params.investors') + this.$t('m.params.ShouldBe'), placeholder: this.$t('m.params.thanZero')}
        ]
        if (this.addParams) {
          /* 运营参数 */
          this.tableDataCarrier = [
            // 抵押币
            {name: this.$t('m.params.allowedCollate'), key: 'allowed_collateralize', value: this.allowAssets, newValue: [], updatestatus: true, type: 'select1'},
            {name: this.$t('m.params.rateUser'), key: 'issuer_rate', value: this.isuerRateName, newValue: '', updatestatus: true, type: 'input'}
            // 运营商'网关''修改利率人', 理事会成员
            // {name: this.$t('m.params.operator'), key: 'carriers', value: this.carriers, newValue: [], updatestatus: true, type: 'select'},
            // {name: this.$t('m.params.gateway'), key: 'gateways', value: this.gateways, newValue: '', updatestatus: false, type: 'input'},
            // {name: this.$t('m.params.getFeeders'), key: 'get_feeders', value: this.getFeedersParam, newValue: '', updatestatus: false, type: 'input'}
          ]
        } else {
          /* 运营参数 */
          this.tableDataCarrier = [
            // 抵押币
            {name: this.$t('m.params.allowedCollate'), key: 'allowed_collateralize', value: this.allowAssets, newValue: [], updatestatus: true, type: 'select1'},
            {name: this.$t('m.params.rateUser'), key: 'issuer_rate', value: this.isuerRateName, newValue: '', updatestatus: true, type: 'input'},
            // 运营商'网关''修改利率人', 理事会成员
            {name: this.$t('m.params.loanCarrier'), key: 'loancarriers', value: this.loanCarriers, newValue: [], updatestatus: true, type: 'select'},
            {name: this.$t('m.params.investCarrier'), key: 'investcarriers', value: this.investCarriers, newValue: [], updatestatus: true, type: 'select'},
            {name: this.$t('m.params.gateway'), key: 'gateways', value: this.gateways, newValue: '', updatestatus: false, type: 'input'},
            {name: this.$t('m.params.budgetMember'), key: 'budget_member', value: this.budgetMember, newValue: '', updatestatus: false, type: 'input'},
            {name: this.$t('m.params.getFeeders'), key: 'get_feeders', value: this.getFeedersParam, newValue: '', updatestatus: false, type: 'input'}
          ]
        }
      },
      _allowedCollateInit () {
        this.collateId = []
        if (this.allowedCollate.length > 0) {
          let arr = this.allowedCollate.map(item => {
            this.collateId.push(item.id)
            this.copyCollateId = [...(this.collateId)]
            return item.symbol
          })
          return arr
        } else {
          let arr = this.getAllowedCollate()
          return arr
        }
      },
      getAllowedCollate () {
        let arr = this.selectedTrading.map(item => {
          // this.collateId.push(item.id)
          /// this.copyCollateId = [...(this.collateId)]
          return item.symbol
        })
        return arr
      },
      // 系统参数限制
      parameterLimits () {
        this.loading++
        return ZOSInstance.get_bitlender_paramers(this.Type).then(res => {
          if (res) this.parameter = res.options
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
      // 用户是否存在
      isUser (value) {
        this.isuerRateId = ''
        if (value.newValue === this.isuerRateName[0]) {
          this.$message({
            message: this.$t('m.params.already'),
            type: 'warning'
          })
          value.newValue = ''
          return
        }
        ZOSInstance.checkAccountExists(value.newValue).then((res) => {
          const isExists = res[0].findIndex(item => {
            return item === value.newValue
          })
          if (isExists < 0) {
            // '没有找到该账户'
            this.$message({
              message: this.$t('m.params.noUser'),
              type: 'warning'
            })
            value.newValue = ''
          } else {
            this.isuerRateId = res[isExists][1]
          }
        }).catch(e => {
          this.$message({
            message: e,
            type: 'warning'
          })
          console.log(e)
        })
      },
      // 参数取消
      paramsCancel () {
        if (this.unRouterChanges) {
          this.nexts = 1
          this.confirmVisible = true
          return
        }
        this.loading = 1
        this.getCurrencyData()
        this.tableDataParamsShow = !this.tableDataParamsShow
        this.createParams = false
        this.loading--
      },
      // 借款参数是否有修改
      isEditData () {
        let newArr = this.tableData.concat(this.tableData, this.investData, this.tableDataPay, this.tableDataRate, this.carrierData, this.platformData, this.tableDataOverdue, this.tableDataCarrier)
        let no = newArr.every((val) => {
          return val !== undefined && val.newValue.length < 1
        })
        if (no && this.copyCollateId.sort().toString() === this.collateId.sort().toString()) {
          return false
        } else {
          return true
        }
      },
      // 平台
      // 参数提交
      sumbitParms () {
        if (!this.isEditData()) {
          this.$message({
            type: 'warning',
            // '没有任何修改'
            message: this.$t('m.params.noupdate')
          })
          return
        }
        let sum = 0
        this.platformData.forEach(item => {
          if (item.newValue !== '') {
            sum += Number(item.newValue)
          } else {
            sum += Number(item.value.substr(0, item.value.length - 1))
          }
        })
        if (sum !== 100) {
          this.$message({
            type: 'warning',
            // '没有任何修改'
            message: this.$t('m.params.platformServer') + this.$t('m.params.sumOf')
          })
          return
        }
        this.comfirmPassword = true
      },
      // 提交参数
      bitlenderLendOrder (data) {
        if (data) {
          this.proposalContent = {}
          let newArr = this.tableData.concat(this.tableData, this.investData, this.tableDataPay, this.tableDataRate, this.carrierData, this.platformData, this.tableDataOverdue, this.tableDataCarrier)
          let options = this.params
          for (let i in options) {
            newArr.forEach((val) => {
              if (i === val.key && val.newValue) {
                let keys = val.name
                if (val.newValue.length !== 0) {
                  this.proposalContent[keys] = val.newValue
                }
                if (val.key === 'min_loan_amount' ||
                  val.key === 'min_loan_increase_range' ||
                  val.key === 'min_invest_amount' ||
                  val.key === 'min_invest_increase_range' ||
                  val.key === 'max_interest_rate' ||
                  val.key === 'max_risk_margin' ||
                  val.key === 'max_platform_service_charge_rate' ||
                  val.key === 'max_carrier_service_charge'
                ) {
                  options[i] = Number(val.newValue) * Math.pow(10, this.selectedSymbol.precision)
                } else if (val.key === 'allowed_collateralize') {
                  if (this.copyCollateId.sort().toString() !== this.collateId.sort().toString()) {
                    let arr = []
                    let arrId = []
                    this.collateId.forEach(items => {
                      this.selectedTrading.forEach(item => {
                        if (items === item.id) {
                          arr.push(item.symbol)
                          arrId.push(item.id)
                        }
                      })
                    })
                    this.proposalContent[keys] = arr
                    options[i] = arrId
                  } else {
                    options[i] = this.collateId
                  }
                } else if (val.key === 'max_repayment_rate' ||
                  val.key === 'overdue_penalty_date_interest_rate') {
                  options[i] = Number(val.newValue) * 10
                } else if (val.key === 'issuer_rate') {
                  options[i] = this.isuerRateId
                } else if (val.key === 'max_bid_time') {
                  options[i] = val.newValue * 24 * 3600
                  this.proposalContent[keys] = val.newValue
                } else {
                  options[i] = Number(val.newValue)
                }
              } else if (i === val.key && !val.newValue) {
                options[i] = this.params[val.key]
              }
            })
          }
          // asset_id, sproduct
          if (this.createParams) {
            options['platform_id'] = '1.2.6'
            options['sproduct'] = 'LENDER'
            this.sproduct = 'LENDER'
            ZOSInstance.bitlender_option_create(
              this.$store.state.userDataSid,
              this.assetId,
              this.sproduct,
              options
            )
              .then(res => {
                this.comfirmPassword = false
                if (res) {
                  this.tr = res.tr
                  this.proposalTime = res.tr.operations[0][1].expiration_time
                  this.feeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
                  this.proposalDialog = true
                }
                this.createParams = false
              })
              .catch(err => {
                this.comfirmPassword = false
                console.log(err)
                this.createParams = false
                this.$message({
                  type: 'warning',
                  message: err
                })
              })
          } else {
            ZOSInstance.bitlender_option_update(this.$store.state.userDataSid,
              this.author,
              this.optionId,
              options
            ).then(d => {
              this.comfirmPassword = false
              if (d) {
                this.tr = d.tr
                this.proposalTime = d.tr.operations[0][1].expiration_time
                this.feeZos = d.fee.fee_amount / Math.pow(10, d.fee.fee_precision)
                this.proposalDialog = true
              }
            }).catch(e => {
              this.comfirmPassword = false
              this.$message({
                type: 'warning',
                message: e
              })
            })
          }
        } else {
          this.comfirmPassword = false
        }
      },
      // 提交提案
      proposalSubmit () {
        this.loadings = true
        ZOSInstance.broadcastTransaction(this.tr)
          .then(res => {
            this.loadings = false
            if (res) {
              this.$message({
                type: 'success',
                // '提交提案成功'
                message: this.$t('m.params.proposalsSucc')
              })
              this.tableDataParamsShow = !this.tableDataParamsShow
              this.proposalDialog = false
              this.init()
            }
          })
          .catch(err => {
            this.loadings = false
            this.proposalDialog = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
          })
      }
    },
    destroyed () {
      setStore('AdminParam', this.activeTabName)
    },
    mounted () {
      this.loading = true
      this.activeTabName = getStore('AdminParam') ? getStore('AdminParam') : 'first'
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
  .el-table .warning-row {
    color: #dedede
  }
  .el-table .warning {
    color: #000
  }
  .container-params {
    padding: 15px !important;
    background: #fff !important;
    border-radius: 4px !important;
    dl dd .showborder .el-input__inner{
      border: 1px solid #dcdfe6!important;
      background: #fff !important;
    }
    dl dd .el-input__inner{
      border: none !important;
      background: none !important;
    }
    dt, dd{
      padding: 0 10px;
    }
    dt{
      overflow: hidden;
    }
    .separ {
      border: 1px solid #dcdfe6; padding: 15px 5px; border-radius: 4px
    }
    .feeder .el-input__inner {
      border: 1px solid #dcdfe6!important;
      background: #fff !important;
    }
  }
  .feeder-dl dt,
  .feeder-dl dd {
    line-height: 40px;
  }
  .feeder-dl dd {
    margin-left: 10px;
  }
</style>

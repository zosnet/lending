<template>
  <div slot="content" class="container-params" v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div v-if="!loading">
      <dl>
        <dt class="lh40">
          <span style="width: 120px; vertical-align: middle; height: 40px">
            <!--选择币种-->
            {{$t('m.transfer.XZBZ')}}
          </span>
          <el-select v-model="selectedSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="paramsGet">
            <el-option
              v-for="item in assetList"
              :key="item.id"
              :label="item.symbol"
              :value="item">
            </el-option>
          </el-select>
          <el-button type="primary" v-show="addParams" @click="tableDataParamsShow=!tableDataParamsShow;updateParamsShow=true;addParams=!addParams;createParams=true">
            {{$t('m.params.addParams')}}
          </el-button>
          <span style="color: #ff0000" v-show="!isExist">该币种暂无借贷参数</span>
        </dt>
        <el-tabs v-model="activeTabName" @tab-click="handleClick" class="margin-t40">
          <!--参数管理-->
          <el-tab-pane :label="$t('m.params.management')" name="first">
            <div class="separ">
              <!--借款参数-->
              <dt class="lh40 feel">
                <span>{{$t('m.params.borrowParam')}}</span>
                <div style="flex:1"></div>
                <!--按钮区-->
                <el-button type="primary" v-show="!addParams" v-if="tableDataParamsShow && canEditBit" @click="tableDataParamsShow=!tableDataParamsShow;updateParamsShow=true">
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
                    v-if="updateParamsShow"
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
              <dt class="lh40 margin-t40">
                {{$t('m.params.investParam')}}
              </dt>
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
                    v-if="updateParamsShow"
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

              <dt class="lh40 margin-t40">
                <!--还款参数-->
                {{$t('m.params.paymentParam')}}
              </dt>
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
                    v-if="updateParamsShow"
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
                    v-if="updateParamsShow"
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
                    v-if="updateParamsShow"
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
                    v-if="updateParamsShow"
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

              <dt class="lh40 margin-t40">
                <!--逾期-->
                {{$t('m.borrowsuccess.withOut')}}
              </dt>
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
                    v-if="updateParamsShow"
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

              <dt class="lh40 margin-t40">
                <!--运营参数-->
                {{$t('m.params.operating')}}
              </dt>
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
                    v-if="updateParamsShow"
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
          </el-tab-pane>
          <!--借款利率-->
          <el-tab-pane :label="$t('m.borrow.borrowRate')" name="second" v-if="!addParams && isExist">
            <div class="separ">
              <dt class="lh40 feel">
            <span>
              <!--借款利率-->
              {{$t('m.borrow.borrowRate')}}
            </span>
                <div style="flex:1"></div>
                <el-button type="primary" v-if="tableDataInterestShow && isUpdateInterest" @click="tableDataInterestShow=!tableDataInterestShow;updateInterestShow=true">
                  <!--修改-->
                  {{$t('m.params.update')}}
                </el-button>
                <div v-if="!tableDataInterestShow">
                  <!--提交-->
                  <el-button type="primary" @click="submitInterest">{{$t('m.params.submit')}}</el-button>
                  <el-button @click="interestCancel">{{$t('m.cancel')}}</el-button>
                </div>
                <!--输入资金密码-->
                <password-dialog :visible="comfirmPasswordInsterest" @bitlenderLendOrder="bitlenderLendInterest"></password-dialog>
              </dt>
              <!--借款利率-->
              <dd>
                <el-table
                  :data="tableDataInterest"
                  style="width: 100%"
                  stripe
                  id="canelInvest"
                >
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="bid"
                  >
                    <template slot-scope="scope">
                      {{$t('m.params.nper')}}
                      <el-input v-model="scope.row.bid"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataInterestShow}"
                                v-if="scope.row.add"
                                @keyup.native="scope.row.bid < 1 || scope.row.bid > parameter.max_rate_month ? scope.row.bid = '' : scope.row.bid = Number(scope.row.bid.replace(/[^\d]/g, ''))"
                                style="width: 70%"
                      ></el-input>
                      <span v-else>
                 {{scope.row.bid}}
                </span>
                      <!--期-->
                      {{$t('m.params.cnper')}}
                    </template>
                  </el-table-column>
                  <!--参数值(年化-->
                  <el-table-column
                    :label="$t('m.params.paramVal')"
                    style="width: 10%"
                    prop="interest_rate"
                  >
                    <template slot-scope="scope" class="feel">
                      {{scope.row.interest_rate}}
                      <span v-if="scope.row.interest_rate !== 'N/A'">
                  ‰
                </span>
                    </template>
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="updateInterestShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <el-input v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataInterestShow}"
                                @blur="interestFixed(scope.row)"
                                @keyup.native="scope.row.newValue > maxRate? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\.\d]/g, '')"
                                style="width: 80%"
                      ></el-input>
                      <span>
                  ‰
                </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="updateInterestShow"
                    width="100px"
                  >
                    <template slot-scope="scope">
                      <!--恢复-->
                      <el-button
                        size="mini"
                        type="primary"
                        @click="scope.row.updatestatus = !scope.row.updatestatus" v-if="!scope.row.updatestatus">{{$t('m.params.restore')}}</el-button>
                      <!--删除-->
                      <el-button
                        size="mini"
                        type="danger"
                        @click="scope.$index >= tableDataInterestCopy.length ? tableDataInterest.splice(scope.$index, 1) : scope.row.updatestatus = !scope.row.updatestatus" v-else-if="scope.row.updatestatus">{{$t('m.params.del')}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

              <dd class="text-center" v-if="!tableDataInterestShow">
                <i class="el-icon-circle-plus-outline margin-t10" style="font-size: 30px" @click="addInterest"></i>
              </dd>

            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('m.params.getFeeders')" name="third" v-if="!addParams && isExist">
            <dl class="feeder-dl">
              <dt class="feel">
                <span>
                  <!--喂价人-->
                  {{$t('m.params.getFeeders')}}
                </span>
                <!-- <div style="flex:1"></div>
                <div>
                  <el-button type="primary" @click="sumbmitFeeders" v-if="canEditBit">{{$t('m.params.submit')}}</el-button>
                </div> -->
                <div style="flex:1"></div>
                <!--按钮区-->
                <el-button type="primary" v-if="tableDatafeederShow && canEditBit" @click="tableDatafeederShow=!tableDatafeederShow;updatefeederShow=true">
                  {{$t('m.params.update')}}
                </el-button>
                <div v-if="!tableDatafeederShow">
                  <el-button type="primary" @click="sumbmitFeeders">{{$t('m.params.submit')}} </el-button>
                  <el-button @click="cancelFeeders">{{$t('m.cancel')}}</el-button>
                </div>
                <!--输入资金密码-->
                <password-dialog :visible="comfirmSumbmitFeeders" @bitlenderLendOrder="bitlenderLendFeeders"></password-dialog>
              </dt>
              <dd class="feel">
                <!--喂价模式-->
                <span>{{$t('m.params.feederFlag')}}:</span>
                <el-radio-group v-model="checks" class="margin-t10 margin-l10" v-if="updatefeederShow">
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
                    v-if="updatefeederShow"
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
              <dd class="feel margin-t40 feeder" v-if="updatefeederShow">
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
                <span class="margin-l10">{{selectedTradingVal.symbol+'/'+selectedSymbol.symbol + $t('m.params.isFeed')}}: {{feedPrice}}</span>
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
                    :label="$t('m.params.clearing')+'('+ selectedTradingVal.symbol+'/'+selectedSymbol.symbol+')'"
                    width="180">
                  </el-table-column>
                  <!--手续费汇率-->
                  <el-table-column
                    prop="coreRate"
                    :label="$t('m.params.handling')+'('+rateTable.quote+'/'+rateTable.base+')'">
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
                      {{scope.row.time | formatLocalTime}}
                    </template>
                  </el-table-column>
                </el-table>
              </dd>

            </dl>
          </el-tab-pane>
          <el-tab-pane :label="$t('m.borrow.radio')" name="four">
            <collateralratio v-if="canEditRatio" ref="upRatio"></collateralratio>
            <div style="min-height: 10vw" v-else>{{$t('m.params.currentUser') + selectedSymbol.symbol + $t('m.params.isCarrier')}}</div>
          </el-tab-pane>
          <el-tab-pane :label="$t('m.params.operator')" name="five">
            <carriers @carriersChange="carriersChange"  ref="upCarriers" :optionId="optionId" :assetId="selectedSymbol.id"> </carriers>
          </el-tab-pane>
        </el-tabs>
      </dl>
    </div>
    <!--创建参数修改提案-->
    <el-dialog
      :title="$t('m.params.proposal')"
      :visible.sync="proposalDialog"
      width="45%"
    >
      <div v-loading="loadings" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
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
    <!--修改利率确认-->
    <el-dialog
      :title="$t('m.params.updateRate')"
      :visible.sync="interestDialog"
      width="45%"
    >
      <div v-loading="loadingss" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
        <dl class="demo-ruleForm">
          <!--修改内容-->
          <dt>{{$t('m.params.updateContent')}}</dt>
          <dd style="padding: 10px">{{interestContent}}</dd>
          <!--修改人-->
          <dt>{{$t('m.params.updateUser')}}</dt>
          <dd>
            <el-input :value="username" readonly></el-input>
          </dd>
          <!--修改时间-->
          <dt>{{$t('m.params.updateTime')}}</dt>
          <dd><el-input :value="Date.parse(new Date()) | formatProposalTime()" readonly></el-input></dd>
          <!--手续费-->
          <dt>2.{{$t('m.params.poundage')}}</dt>
          <dd>
            <div class="feel">
              <!--燃料费-->
              <!--(约)-->
              <span>{{$t('m.fuelCost')}}: {{interestFeeZos}} ZOS{{$t('m.transfer.about')}}</span>
              <span style="flex: 1"></span>
              <!--可用数量-->
              <span>{{$t('m.transfer.KYSL')}}: {{available}} ZOS</span>
              <!--获得-->
              <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
            </div>
          </dd>
          <!--数量不足-->
          <dd v-show="zosShow(interestFeeZos)" style="color: #ff0000">ZOS{{$t('m.transfer.numNull')}}</dd>
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

          <!--获得ZOS-->
          <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
          <!--关于优惠-->
          <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>

          <dd class="margin-t10 text-right">
            <y-button
              :text="$t('m.cancel')"
              @btnClick="interestDialog=false"
            ></y-button>
            <y-button
              :text="$t('m.sure')"
              @btnClick="interestSubmit"
              :classStyle="zosShow(interestFeeZos) ? 'disabled-btn' : 'main-btn'"
            ></y-button>
          </dd>

        </dl>

      </div>
    </el-dialog>
    <!--修改喂价人提案-->
    <el-dialog
      :title="$t('m.params.feederProposal')"
      :visible.sync="feederDialog"
      width="45%"
    >
      <div v-loading="loadingFeeder" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
        <dl class="demo-ruleForm">
          <!--修改内容-->
          <dt>{{$t('m.params.updateContent')}}</dt>
          <dd style="padding: 10px">{{feederContent}}</dd>
          <!--修改人-->
          <dt>{{$t('m.params.updateUser')}}</dt>
          <dd>
            <el-input :value="username" readonly></el-input>
          </dd>
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

          <!--获得ZOS-->
          <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
          <!--关于优惠-->
          <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>

          <dd class="margin-t10 text-right">
            <y-button
              :text="$t('m.cancel')"
              @btnClick="feederDialog=false"
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
    <!--确认离开此页面？-->
    <el-dialog
      :title="$t('m.borrow.note')"
      :visible.sync="confirmVisible"
      width="30%"
    >
      <span>{{$t('m.borrow.giveupSure')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isConfirm = false;confirmLeave()">{{$t('m.cancel')}}</el-button>
        <el-button type="primary" @click="isConfirm = true;confirmLeave()">{{$t('m.sure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getStore, setStore, removeStore} from '/js-utils/storage'
  import {ZOSInstance} from 'zos-wallet-js'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import YButton from '/path-components/element/YButton'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import formatAssets from '/js-api/public'
  import {Apis} from 'zosjs-ws'
  import collateralratio from '/path-page/Admin/Params/collateralratio.vue'
  import carriers from '/path-page/Admin/Params/carriers.vue'
  import deepClone from '/js-utils/deepClone'
  export default {
    components: {passwordDialog, YButton, getzosdialog, couponDialog, formatAssets, collateralratio, carriers},
    data () {
      return {
        loading: true,
        // 提案
        loadings: false,
        // 利率修改确认
        loadingss: false,
        couponVisible: false,
        zosDialog: false,
        copyDialog: false,
        // 选择币种
        assetList: [],
        // 选中的币种
        selectedSymbol: {},
        // selected: {
        //   symbolVal: '',
        //   precision: '',
        //   symbol: ''
        // },
        author: '',
        optionId: '',
        // 参数
        params: {},
        tableData: [],
        // 利率
        tableDataInterest: [],
        // 复制
        tableDataInterestCopy: [],
        tableDataShow: false,
        tableDataPayShow: false,
        tableDataRateShow: false,
        tableDataOverdueShow: false,
        // 利率修改显示
        tableDataInterestShow: true,
        tableDatafeederShow: true,
        updatefeederShow: false,
        // 参数修改显示
        tableDataParamsShow: true,
        updateInterestShow: false,
        updateParamsShow: false,
        comfirmPassword: false,
        comfirmPasswordInsterest: false,
        comfirmSumbmitFeeders: false,
        // 提案宣传品
        proposalDialog: false,
        tr: '',
        // 提案内容
        proposalContent: {},
        proposalTime: '',
        username: this.$store.state.userName,
        feeZos: '',
        delInterest: [],
        updateInterest: [],
        interestDialog: false,
        interestTr: '',
        interestContent: {},
        interestTime: '',
        interestFeeZos: '',
        feederFeeZos: '',
        // 是否可以修改利率
        issuerRate: false,
        // 是否可以借贷参数
        canEditBit: false,
        // 是否有相同的
        same: false,
        isFull: true,
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
        // 运营商列表
        // carrierList: [],
        isuerRateId: '',
        assetId: '',
        sproduct: '',
        budgetMember: '',
        confirmVisible: false,
        isConfirm: true,
        nexts: '',
        maxRate: '',
        parameter: '',
        getFeeders: '',
        getFeedersParam: [],
        createParams: false,
        // Tab标签切换
        activeTabName: 'first',
        checks: 0,
        copyChecks: '',
        iscarriersChange: false,
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
        selectedTrading: [],
        selectedTradingVal: '',
        feedPrice: '',
        feedProducers: [],
        // 增加的喂价人
        addFeeder: '',
        feedOption: {},
        copyGetFeeders: [],
        feederDialog: false,
        loadingFeeder: false,
        feederContent: {},
        feederTr: '',
        feedData: [],
        feeMode: '',
        feederOptionId: '',
        collateId: [],
        copyCollateId: [],
        // 用户选择的可抵押币
        selectCollate: [],
        // 系统参数中的可抵押币
        allowedCollate: [],
        canEditRatio: false,
        lastOne: [],
        rateTable: {
          base: '',
          quote: ''
        }
      }
    },
    computed: {
      available () {
        let assetsArr = formatAssets.formatAssets('ZOS')
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else {
          return assetsArr[0].amount / Math.pow(10, assetsArr[0].precision)
        }
      },
      // zos燃料费，够不够
      zosShow (fee) {
        return function (fee) {
          return this.available + this.$store.state.coupon.amount < fee
        }
      },
      // 是否可是修改利率
      isUpdateInterest () {
        return this.issuerRate === this.$store.state.userDataSid
      },
      // 借款参数是否有修改
      unRouterChanges () {
        return this.isEdit()
      },
      // 利率是否有修改
      unRouterChange () {
        if ((this.delInterest && this.delInterest.length < 1) && (this.updateInterest && this.updateInterest.length < 1)) {
          return false
        } else {
          return true
        }
      }
    },
    carriersChange (val) {
      this.iscarriersChange = val
      console.log(val, 'dddddd')
    },
    // 修改了，离开时的提示
    beforeRouteLeave (to, from, next) {
      if (this.iscarriersChange || this.unRouterChange || this.unRouterChanges) {
        // '您确定离开此页面?' '提示'
        this.nexts = next
        this.confirmVisible = true
      } else {
        next()
      }
    },
    methods: {
      _submitDisable () {
        let cmp = (x, y) => {
          if (x === y) {
            return true
          }
          if (!(x instanceof Object) || !(y instanceof Object)) {
            return false
          }
          if (x.constructor !== y.constructor) {
            return false
          }
          for (let p in x) {
            // Inherited properties were tested using x.constructor === y.constructor
            if (x.hasOwnProperty(p)) {
              // Allows comparing x[ p ] and y[ p ] when set to undefined
              if (!y.hasOwnProperty(p)) {
                return false
              }
              // If they have the same strict value or identity then they are equal
              if (x[ p ] === y[p]) {
                continue
              }
              // Numbers, Strings, Functions, Booleans must be strictly equal
              if (typeof x[p] !== 'object') {
                return false
              }
              // Objects and Arrays must be tested recursively
              // if (!Object.equals(x[p], y[p])) {
              //   return false
              // }
            }
          }
          for (let p in y) {
            // allows x[ p ] to be set to undefined
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
              return false
            }
          }
          return true
        }
        return cmp(this.getFeeders, this.copyGetFeeders) && (this.checks === this.copyChecks)
      },
      // Tab标签切换
      handleClick (tab, event) {
      },
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
      // 确认是否离开
      confirmLeave () {
        this.confirmVisible = false
        if (this.nexts === 1) {
          if (this.isConfirm) {
            this.init()
            this.updateParamsShow = false
            this.tableDataParamsShow = !this.tableDataParamsShow
          }
          this.nexts = ''
        } else {
          if (this.isConfirm) {
            this.nexts()
          } else {
            this.nexts(false)
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
        this.loading = true
        // 用户是否可能修改参数
        ZOSInstance.checkAccountExists(this.$store.state.userName)
          .then(data => {
            const isExists = data[0].findIndex(item => {
              return item === this.$store.state.userName
            })
            if (isExists >= 0) {
              ZOSInstance.getLoanAssetList()
                .then(res => {
                  if (res && res.length > 0) {
                    this.selectedSymbol = (getStore('selectedSymbols') ? JSON.parse(getStore('selectedSymbols')) : res[0])
                    this.assetList = res
                  }
                  return ZOSInstance.getAssetList()
                })
                .then(item => {
                  if (!item.cash_list || !item.lender_list || item.cash_list.length <= 0 || item.lender_list.length <= 0) {
                    this.loading = false
                    return
                  }
                  this.selectedTrading = item.lender_list
                  this.selectedTradingVal = (getStore('selectedTradingSymbols') ? JSON.parse(getStore('selectedTradingSymbols')) : this.selectedTrading[0])
                  // 获取运营商列表
                  this.paramsGet(this.selectedSymbol)
                  this._selectedTrading(this.selectedTradingVal)
                })
                .catch(err => {
                  this.loading = false
                  console.log(err)
                  this.$message({
                    message: err,
                    type: 'warning'
                  })
                })
            } else {
              this.loading = false
              this.$message({
                message: this.$t('m.params.nopermission'),
                type: 'warning'
              })
            }
          }).catch(err => {
            this.loading = false
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      // 是否可以修改最小抵押倍数
      _canEditRatio () {
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['carrierList']]).then(res => {
          if (res && res[0]) {
            let config = JSON.parse(res[0])
            for (let i in config) {
              if (this.selectedSymbol.symbol === i) {
                if (this.$store.state.userName === config[i].investCarrier) {
                  this.canEditRatio = true
                } else {
                  this.canEditRatio = false
                }
              }
            }
          } else {
            this.canEditRatio = false
          }
        })
      },
      // 删除喂价人
      handleDelete (index, row) {
        this.getFeeders.splice(index, 1)
      },
      // 添加喂价人
      addFeedProducers () {
        ZOSInstance.get_account(this.addFeeder).then(acc => {
          if (!acc) {
            this.$message({
              message: this.$t('m.historyinfo.noAccount'),
              type: 'warning'
            })
            return
          }
          let userId = acc.get('id')
          let isAt = this.getFeeders.filter(res => {
            return res.userName === acc.get('name')
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
        if (this._submitDisable()) {
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
      // 提交喂价人到链
      feederSubmit () {
        this.loadingFeeder = true
        // new_feed_option, issuer, author, asset_to_update
        this.bitlenderLendFeedersBroad(this.feederTr)
      },
      bitlenderLendFeedersBroad (tr) {
        ZOSInstance.broadcastTransaction(tr).then(res => {
          if (res) {
            this.getfeederData()
            this.$message({
              message: this.$t('m.params.proposalsSucc'),
              type: 'success'
            })
            this.loadingFeeder = false
            this.feederDialog = false
            this.updatefeederShow = false
            this.tableDatafeederShow = !this.tableDatafeederShow
          }
        })
          .catch(err => {
            console.log(err)
            this.loadingFeeder = false
            this.feederDialog = false
          })
      },
      // 得到当前喂价需要选择交易对,如：CNY/BTC
      _selectedTrading (v) {
        this.selectedTradingVal = v
        removeStore('selectedTradingSymbols')
        // 喂价
        setStore('selectedTradingSymbols', this.selectedTradingVal)
        this.feedData = []
        this.getFeedDetail()
      },
      // 喂价详情
      getFeedDetail () {
        this.feedData = []
        this.feedPrice = ''
        ZOSInstance.get_asset_exchange_feed(this.selectedSymbol.id, this.selectedTradingVal.id, 1)
          .then(res => {
            if (res) {
              let arr = []
              res.feeds.forEach(it => {
                arr.push(it[0])
              })
              let currentPrice = res.current_feed.settlement_price
              if (this.selectedSymbol.id === currentPrice.base.asset_id) {
                this.feedPrice = ((currentPrice.quote.amount / Math.pow(10, this.selectedTradingVal.precision)) /
                  (currentPrice.base.amount / Math.pow(10, this.selectedSymbol.precision))).toFixed(this.selectedTradingVal.precision)
              } else {
                this.feedPrice = ((currentPrice.base.amount / Math.pow(10, this.selectedSymbol.precision)) /
                  (currentPrice.quote.amount / Math.pow(10, this.selectedTradingVal.precision))).toFixed(this.selectedTradingVal.precision)
              }
              ZOSInstance.get_account(arr).then(arrName => {
                if (arrName) {
                  let _arrName = []
                  arrName.forEach(iname => {
                    _arrName.push(iname.get('name'))
                  })
                  let clearing = ''
                  let rate = ''
                  res.feeds.forEach((item, index) => {
                    if (item[1][1].settlement_price.base.amount !== 0) {
                      let params = {}
                      arr.push(item[0])
                      params.username = _arrName[index]
                      if (this.selectedSymbol.id === item[1][1].settlement_price.base.asset_id) {
                        clearing = (item[1][1].settlement_price.quote.amount / Math.pow(10, this.selectedTradingVal.precision)) /
                          (item[1][1].settlement_price.base.amount / Math.pow(10, this.selectedSymbol.precision))
                        params.clearingPrice = clearing.toFixed(this.selectedTradingVal.precision)
                      } else {
                        clearing = (item[1][1].settlement_price.base.amount / Math.pow(10, this.selectedSymbol.precision)) /
                          (item[1][1].settlement_price.quote.amount / Math.pow(10, this.selectedTradingVal.precision))
                        params.clearingPrice = clearing.toFixed(this.selectedTradingVal.precision)
                      }
                      Apis.instance().db_api().exec('get_objects', [[item[1][1].core_exchange_rate.base.asset_id, item[1][1].core_exchange_rate.quote.asset_id]])
                        .then(asset => {
                          if (asset) {
                            this.rateTable.base = asset[0].symbol
                            this.rateTable.quote = asset[1].symbol
                            rate = (item[1][1].core_exchange_rate.quote.amount / Math.pow(10, asset[1].precision)) /
                              (item[1][1].core_exchange_rate.base.amount / Math.pow(10, asset[0].precision))
                            params.coreRate = rate.toFixed(asset[1].precision)
                            params.keep = item[1][1].maintenance_collateral_ratio / 10 + '%'
                            params.unwinding = item[1][1].maximum_short_squeeze_ratio / 10 + '%'
                            params.time = item[1][0]
                            this.feedData.push(params)
                          }
                        }).catch(err => {
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
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      // 选择不同币种，请求不同的参数
      paramsGet (val) {
        this.unRouterChanges = false
        this.unRouterChange = false
        if (this.updateParamsShow) {
          this.paramsCancel()
        }
        if (this.updateInterestShow) {
          this.interestCancel()
        }
        this.selectedSymbol = val
        removeStore('selectedSymbols')
        // 币种的相关数据
        this.getCurrencyData()
      },
      ansyChild () {
        if (!this.loading) {
          this.$refs.upCarriers.changeOption(this.optionId, this.selectedSymbol.id)
        }
      },
      chooseCollate () {
        if (this.collateId.length === 1) {
          this.lastOne = deepClone(this.collateId)
        }
        if (this.collateId.length < 1) {
          this.collateId = []
        }
      },
      getfeederData () {
        // 喂价人
        this.checks = this.feedOption.flags
        this.getFeeders = []
        ZOSInstance.get_account(this.feedOption.feeders).then(feederObj => {
          feederObj.forEach((item, index) => {
            this.getFeeders.push({userId: item.get('id'), userName: item.get('name')})
          })
          this.copyGetFeeders = [...(this.getFeeders)]
        }).catch(feederErr => {
          console.log(feederErr)
          this.$message({
            message: feederErr,
            type: 'warning'
          })
        })
        this.getFeedersParam = []
        ZOSInstance.lookup_feeders(this.selectedSymbol.id).then(data => {
          if (data) {
            data.forEach(item => {
              this.getFeedersParam.push(item.userName)
            })
            this.tableDataCarrier[6]['value'] = this.getFeedersParam
            // Vue.set(this.tableDataCarrier, 4, {name: this.$t('m.params.getFeeders'), key: 'get_feeders', value: this.getFeeders, newValue: '', updatestatus: false, type: 'input'})
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getCurrencySync () {
        this.getfeederData()
        this.allowedCollate = []
        if (this.params.allowed_collateralize && this.params.allowed_collateralize.length > 0) {
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
            })
            .catch(err => {
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
        ZOSInstance.get_account(this.params.loan_carriers).then(data => {
          data.forEach(val => {
            this.loanCarriers.push(val.get('name'))
          })
          this.tableDataCarrier[2]['value'] = this.loanCarriers
        }).catch(feederErr => {
          console.log(feederErr)
          this.$message({
            message: feederErr,
            type: 'warning'
          })
        })
        // 运营商
        ZOSInstance.get_account(this.params.invest_carriers).then(data => {
          data.forEach(val => {
            this.investCarriers.push(val.get('name'))
          })
          this.tableDataCarrier[3]['value'] = this.investCarriers
        }).catch(feederErr => {
          console.log(feederErr)
          this.$message({
            message: feederErr,
            type: 'warning'
          })
        })
        ZOSInstance.get_account(this.gatewaysId).then(res => {
          res.forEach(val => {
            this.gateways.push(val.get('name'))
          })
          this.tableDataCarrier[4]['value'] = this.gateways
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        ZOSInstance.getAuthsFromAccount(this.author).then(result => {
          this.tableDataCarrier[5]['value'] = result
          this.budgetMember = result
        }).catch(err => {
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
        ZOSInstance.getBitlenderOption(this.selectedSymbol.id).then(res => {
          if (!res) {
            return
          }
          // 选择币种之后，缓存上
          setStore('selectedSymbols', this.selectedSymbol)
          this.author = res.author
          this.optionId = res.id
          // 其它的参数
          this.params = res.options
          this.feeMode = res.fee_mode
          this.feedOption = res.feed_option
          this.ansyChild()

          this.checks = res.feed_option.flags
          this.copyChecks = res.feed_option.flags
          this.maxRate = this.params.max_repayment_rate / 10
          this.gatewaysId = res.gateways
          this.loanCarriersId = res.loan_carriers
          this.investCarriersId = res.invest_carriers
          this.assetId = res.asset_id
          this.sproduct = res.sproduct
          // 参数限制
          this.parameterLimits()
          // 可抵押物
          // 修改参数没有，可以增加,isExiste为false时，可增加，为true时，编辑
          if (!res.isExiste) {
            this.activeTabName = 'first'
            ZOSInstance.get_account(this.$store.state.userDataSid).then(acc => {
              if (acc.get('lifetime_referrer') === acc.get('id')) {
                this.addParams = true
                this.isExist = false
                this.tableDataInterest = []
              }
            }).catch(errmessa => {
              this.$message({
                message: errmessa,
                type: 'warning'
              })
            })
            // 有修改参数,就修改
          } else {
            this.addParams = false
            this.isExist = true
            // 是否可以修改参数
            ZOSInstance.can_edit_bitlender_option(this.optionId, this.$store.state.userDataSid).then(edit => {
              this.canEditBit = edit
            }).catch(errmess => {
              this.$message({
                message: errmess,
                type: 'error'
              })
            })
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
            ZOSInstance.get_account(this.params.issuer_rate)
              .then(dataRate => {
                this.isuerRateName.push(dataRate.get('name'))
              })
              .catch(errors => {
                console.log(errors)
                this.$message({
                  message: errors,
                  type: 'warning'
                })
              })
          }
          this.getCurrencySync()
          this.loading = false
          // 数据格式化,借款参数
          this.tableDataForm()
        }).catch(errors => {
          console.log(errors)
          this.loading = false
          this.$message({
            message: errors,
            type: 'warning'
          })
        })
        this._canEditRatio()
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
          {name: this.$t('m.params.timeUnit'), key: 'repayment_period_uint', value: this.params.repayment_period_uint === 1 ? this.$t('m.months') : this.$t('m.params.year'), newValue: '', updatestatus: false, errMessage: this.$t('m.params.borrowing'), placeholder: this.$t('m.params.thanZero')},
          // '最大投标期限'
          {name: this.$t('m.params.maxInvest'), key: 'max_bid_time', value: this.params.max_bid_time / (24 * 3600) + '(' + this.$t('m.day') + ')', newValue: '', updatestatus: true, errMessage: this.$t('m.params.largest'), placeholder: this.$t('m.params.thanZero')},
          // '最大借款利率'
          {name: this.$t('m.params.maxRate'), key: 'max_repayment_rate', value: this.params.max_repayment_rate / 10 + '‰', newValue: '', updatestatus: true, errMessage: this.$t('m.params.maxRate') + this.$t('m.params.greaterThan') + this.parameter.max_repayment_rate / 10, placeholder: this.$t('m.params.zeroUp')},
          // '每月利率最大值'
          {name: this.$t('m.params.rateVal'), key: 'max_interest_rate', value: this.prefixInteger(this.params.max_interest_rate, this.selectedSymbol.precision) / Math.pow(10, this.selectedSymbol.precision), newValue: '', updatestatus: true, errMessage: this.$t('m.params.monthlyInterest'), placeholder: this.$t('m.params.thanZero')}
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
          {name: this.$t('m.borrow.HKFS'), key: 'repayment_type', value: this.params.repayment_type === 1 ? this.$t('m.invest.firstRate') : this.$t('m.invest.profit_after'), newValue: '', updatestatus: false},
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
        ZOSInstance.get_bitlender_paramers().then(res => {
          console.log()
          if (res) this.parameter = res.options
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 用户是否存在
      isUser (value) {
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
      // 利率添加
      addInterest () {
        let interestOne = {
          bid: '',
          interest_rate: 'N/A',
          newValue: '',
          add: true,
          updatestatus: true
        }
        this.tableDataInterest.push(interestOne)
      },
      // 利率的修改取消
      interestCancel () {
        if (this.unRouterChange) {
          this.nexts = 1
          this.confirmVisible = true
          return
        }
        this.init()
        this.updateInterestShow = false
        this.tableDataInterestShow = true
        this.tableDataInterest = this.tableDataInterestCopy
      },
      // 所有元素的bid
      findBid (arr) {
        return arr.map((val) => {
          return val.bid
        })
      },
      // 删除一个数组中在别一个数组中相同的元素
      delSame (arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            if (arr2[j] === arr1[i]) {
              arr2.splice(j, 1)
            }
          }
        }
      },
      // 提交利率修改
      submitInterest () {
        this.updateInterest = []
        this.delInterest = []
        this.interestContent = {}
        let popArr = []
        let copyArr = []
        // let updateArr = []
        let oldArr = []
        // 最后一个，是否很新增
        popArr = [...this.tableDataInterest]
        // 为了得到新增的
        copyArr = [...this.tableDataInterest]
        // 更新的
        // updateArr = [...this.tableDataInterest]
        oldArr = [...this.tableDataInterest]
        // popArr.pop().add最后一个,如果add.true证明有新增的
        if (popArr.pop().add) {
          // 1.有一个新增的为空都返回
          copyArr.splice(0, this.tableDataInterestCopy.length)
          let isNull = copyArr.some((val) => {
            return val.bid === '' || val.newValue === ''
          })
          if (isNull) {
            this.$message({
              type: 'warning',
              // 新增的期数或利率值没有填写
              message: this.$t('m.params.newPeriods')
            })
            return
          }
          // 2。只是新增的两个相同
          if ([...new Set(this.findBid(copyArr))].length !== this.findBid(copyArr).length) {
            this.$message({
              type: 'warning',
              // '有相同的期数'
              message: this.$t('m.params.samePeriods')
            })
            return
          }
          // 新增的与已有
          let isold = oldArr.filter((old) => {
            if (old.updatestatus) {
              return old
            }
          })
          // 3.新增的与已有的没有删除的相同
          if ([...new Set(this.findBid(isold))].length !== this.findBid(isold).length) {
            this.$message({
              type: 'warning',
              // '有相同的期数'
              message: this.$t('m.params.samePeriods')
            })
            return
            // 4.新增的与已有的删除的相同
          } else {
            isold.forEach((pval) => {
              if (pval.newValue !== '') {
                let key = pval.bid
                let param = []
                param[0] = key
                param[1] = {interest_rate: pval.newValue * 10}
                this.updateInterest.push(param)
              }
            })
            let isDel = oldArr.filter((del) => {
              if (!del.updatestatus) {
                return del
              }
            })
            isDel.forEach((iv) => {
              this.delInterest.push(iv.bid)
            })
            if (this.delInterest.length < 1 && this.updateInterest.length < 1) {
              this.$message({
                type: 'warning',
                // '没有任何修改'
                message: this.$t('m.params.noupdate')
              })
              return
            }
            this.comfirmPasswordInsterest = true
          }
        } else {
          this.tableDataInterest.forEach((val, index) => {
            if (!val.updatestatus) {
              this.delInterest.push(val.bid)
            }
            if (val.newValue !== '' && val.updatestatus) {
              let key = val.bid
              let param = []
              param[0] = key
              param[1] = {interest_rate: val.newValue * 10}
              this.updateInterest.push(param)
            }
          })
          if (this.delInterest.length < 1 && this.updateInterest.length < 1) {
            this.$message({
              type: 'warning',
              // '没有任何修改'
              message: this.$t('m.params.noupdate')
            })
            return
          }
          this.comfirmPasswordInsterest = true
        }
        let delInterestCopy = [...this.delInterest]
        let updateInterestCopy = [...this.updateInterest]
        let updateInterestBid = updateInterestCopy.map((val) => {
          return val[0]
        })
        this.delSame(updateInterestBid, delInterestCopy)
        this.delInterest = delInterestCopy
        if (this.delInterest.length < 1 && this.updateInterest.length < 1) {
          this.$message({
            type: 'warning',
            // '没有任何修改'
            message: this.$t('m.params.noupdate')
          })
          return
        }
        this.comfirmPasswordInsterest = true
        this.delInterest.forEach((val) => {
          // '期利率'
          let keys = this.$t('m.params.the') + val + this.$t('m.params.nper') + this.$t('m.params.interestRate')
          // '删除'
          this.interestContent[keys] = this.$t('m.params.deleteFirst')
        })
        this.updateInterest.forEach(val => {
          // '修改第'
          let keys = this.$t('m.params.update') + this.$t('m.params.the') + val[0] + this.$t('m.params.nper') + this.$t('m.params.interestRate')
          this.interestContent[keys] = val[1].interest_rate / 10 + '‰'
        })
      },
      // 提交到链修改
      bitlenderLendInterest (data) {
        if (data) {
          ZOSInstance.bitlender_rate_update(this.optionId, this.$store.state.userDataSid, this.updateInterest, this.delInterest)
            .then(res => {
              if (res) {
                this.comfirmPasswordInsterest = false
                this.interestTr = res.tr
                this.interestFeeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
                this.interestDialog = true
              }
            })
            .catch(err => {
              this.comfirmPasswordInsterest = false
              console.log(err)
              this.$message({
                type: 'warning',
                message: err
              })
            })
        } else {
          this.comfirmPasswordInsterest = false
        }
      },
      // 确认修改利率，并广播
      interestSubmit () {
        this.loadingss = true
        ZOSInstance.broadcastTransaction(this.interestTr)
          .then(res => {
            this.loadingss = false
            if (res) {
              this.$message({
                type: 'success',
                // '提交成功'
                message: this.$t('m.badloans.subSucc')
              })
              this.interestDialog = false
              this.init()
              this.tableDataInterestShow = !this.tableDataInterestShow
              this.updateInterestShow = !this.updateInterestShow
              this.unRouterChange = false
            }
          })
          .catch(err => {
            this.loadingss = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
          })
      },
      cancelFeeders () {
        this.getfeederData()
        this.updatefeederShow = false
        this.tableDatafeederShow = !this.tableDatafeederShow
      },
      // 参数取消
      paramsCancel () {
        if (this.unRouterChanges) {
          this.nexts = 1
          this.confirmVisible = true
          return
        }
        this.init()
        this.updateParamsShow = false
        this.tableDataParamsShow = !this.tableDataParamsShow
      },
      // 借款参数是否有修改
      isEdit () {
        let newArr = this.tableData.concat(this.tableData, this.investData, this.tableDataPay, this.tableDataRate, this.carrierData, this.platformData, this.tableDataOverdue, this.tableDataCarrier)
        let no = newArr.every((val) => {
          return val.newValue.length < 1
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
        if (!this.isEdit()) {
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
          /* let optionss = {
            issuer_rate: '',
            max_repayment_period: '',
            repayment_period_uint: '',
            max_bid_time: '',
            max_overdue_period: '',
            notify_overdue_time: '',
            overdue_expiration_time: '', // 逾期时间
            repayment_type: '', // 还款方式
            repayment_date: '', // 还款日期
            min_invest_amount: '', // 最小投资金额
            min_loan_amount: '', // 最小借款金额
            min_invest_increase_range: '', // 最小投资增加额
            min_loan_increase_range: '', // 最小借款增加额
            max_repayment_rate: '', // 最大利率
            max_interest_rate: '', // 利息封顶值
            risk_margin_rate: '', // 风险准备金率(基数1000)
            max_risk_margin: '',
            carrier_service_charge_rate: '',
            max_carrier_service_charge: '',
            carrier_service_loan_carrier: '',
            carrier_service_invest_carrier: '',
            platform_service_charge_rate: '', // 平台服务费费率(基数1000)
            max_platform_service_charge_rate: '',
            platform_service_loan_carrier: '',
            platform_service_invest_carrier: '',
            platform_service_loan_refer: '',
            platform_service_invest_refer: '',
            platform_service_gateway: '',
            platform_service_platform: '',
            overdue_liquidation_rate: '', // 本金逾期违约金率(基数100)
            overdue_penalty_interest_rate: '', // 利息逾期违约金率(基数10000)
            early_repayment_liquidation_rate: '', // 提前还款违约金率(基数100)
            overdue_penalty_date_interest_rate: '', // 利息逾期按天违约金率(基数10000)
            principal_guarantee_rate: '',
            platform_id: this.params.platform_id, // 平台
            carriers: '',
            // 理事会
            budgetMember: this.budgetMember,
            gateways: '',
            get_feeders: this.getFeeders,
            time_zone: 0
          } */
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
              console.log(e)
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
              this.updateParamsShow = !this.updateParamsShow
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

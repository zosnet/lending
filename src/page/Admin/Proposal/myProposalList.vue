<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div>
        <el-row>
          <el-table
            :data="tableData"
            class="curp"
            style="width: 100%"
            stripe>
            <el-table-column :label="$t('m.proposalList.Bill')" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.proposalList.originator')">
              <template slot-scope="scope">
                <span>{{scope.row.proposer}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" :label="$t('m.params.proposalContent')">
              <template slot-scope="scope">
                <el-button type="text" @click="handleShowInfo(scope.row)">{{scope.row.assetsSymbol}}  {{$t('m.proposalList.edit')}}</el-button>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.proposalList.expiration')" min-width="120px">
              <template slot-scope="scope">
                <span>{{scope.row.expiration_time  | formatData}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.proposalList.agreed')" min-width="150px" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.available_list" :key="index">
                  <div>
                    <span>{{item.available_name}}</span>
                    <i style="color: yellow" class="el-icon-success"></i>
                  </div>
                </div>
                <div v-for="(item,index) in scope.row.available_keys" :key="index">
                  <div>
                    <span>{{item}}</span>
                    <i style="color: yellow" class="el-icon-success"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.orderList.operation')">
              <template slot-scope="scope">
                <el-button v-if="scope.row.can_approve" type="primary" size="mini" @click="handleAgree(scope.row)">{{$t('m.proposalList.agree')}}</el-button>
                <el-button v-if="scope.row.can_reject" type="primary" size="mini" @click="handleCancel(scope.row)">{{$t('m.proposalList.undo')}}</el-button>
              </template>
            </el-table-column>

            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
        </el-row>
      </div>
    </div>

    <el-dialog
      :title="dialogName"
      :visible.sync="agreeDialogVisible"
      width="45%">
      <div v-loading="agreeDialogLoading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw;">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item :label="$t('m.proposalList.agreed')">
            <div style="margin-left: 1rem" v-if="selectData">
              <div v-for="(item,index) in selectData.available_list" :key="index">
                <div>
                  <span>{{item.available_name}}</span>
                  <i style="color: yellow" class="el-icon-success"></i>
                </div>
              </div>
            </div>
            <div style="margin-left: 1rem" v-if="selectData">
              <div v-for="(item,index) in selectData.available_keys" :key="index">
                <div>
                  <span>{{item}}</span>
                  <i style="color: yellow" class="el-icon-success"></i>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('m.proposalList.payment')">
            <el-input :value="getUserName()" readonly="true"></el-input>
          </el-form-item>
          <!--<el-form-item :label="$t('m.proposalList.agreeAdd')" prop="name">-->
            <!--<el-select v-model="ruleForm.name" :placeholder="$t('m.proposalList.account')">-->
              <!--<el-option v-for="item in agreeAddData"-->
                  <!--:key="item"-->
                  <!--:label="item"-->
                  <!--:value="item"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
          <el-form-item :label="$t('m.proposalList.agreeAdd')">
            <el-input :value="getUserName()" readonly="true"></el-input>
          </el-form-item>
            <p class="feel">
              <span>{{$t('m.fuelCost')}}: {{feel}} ZOS ({{$t('m.transfer.about')}})</span>
              <span style="flex:1"></span>
              <span>{{$t('m.transfer.KYSL')}}: {{amount}}  ZOS   <a @click="zosDialog=true">{{$t('m.transfer.get')}} ZOS</a></span>
            </p>
            <p class="feel">
              <span class="gray">{{$t('m.transfer.useCoupons')}}</span>
              <span style="flex:1"></span>
              <span>{{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS
                <a class="margin-l20" @click="couponVisible=true">{{$t('m.transfer.understandCoupons')}}</a>
              </span>
            </p>
            <!--获得ZOS-->
            <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
            <!--关于优惠-->
            <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>

            <div style="font-size: 12px;color: red" v-show="amount < feel && $store.state.coupon.amount < feel">ZOS {{$t('m.transfer.numNull')}}</div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">{{$t('m.cancel')}}</el-button>
        <el-button type="primary" @click="agreeAddOper('ruleForm')">{{selectType === 0 ? $t('m.proposalList.agree') : $t('m.proposalList.undo')}}</el-button>
      </span>
    </el-dialog>
    <confirm-password :visible="passwordDialog" @close='confirmClose' @success="confirmSuccess"></confirm-password>
    <el-dialog
      :title="$t('m.proposalList.confirm')"
      :visible.sync="conformDialog"
      width="30%"
      :before-close="handleClose">
      <div v-loading="conformLoading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw;">
          <span>
            <div>
              <p>{{$t('m.proposalList.Bill')}}: {{selectData.id}}</p>
              <p style="word-wrap: break-word; word-break: break-all; overflow: hidden;">{{$t('m.proposalList.agreeAccount')}}: {{getUserName()}}</p>
              <p>{{$t('m.proposalList.payAccount')}}: {{getUserName()}}</p>
              <p style="word-wrap: break-word; word-break: break-all; overflow: hidden;">{{$t('m.fuelCost')}}: {{feelReal}} ZOS</p>
            </div>
          </span>
          <div slot="footer" class="dialog-footer" style="text-align: right;">
              <el-button @click="conformDialog=false">{{$t('m.cancel')}}</el-button>
              <el-button type="primary" @click="operConfrom()">{{$t('m.sure')}}</el-button>
          </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('m.proposalList.details')"
      :visible.sync="changeInfoDialog"
      width="45%"
      :before-close="handleClose"
      center>
      <div>{{selectData.assetsSymbol + ' ' + $t('m.proposalList.edit')}}</div>
      <div>
          <el-table
          :data="selectData.changeInfo"
          style="width: 100%"
          stripe>
          <el-table-column :label="$t('m.params.name')">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.proposalList.beEdit')">
            <template slot-scope="scope">
              <span>{{scope.row.value}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.params.updateAfter')">
            <template slot-scope="scope">
              <span>{{scope.row.newValue}}</span>
            </template>
          </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer" style="text-align: right;margin-top: 20px">
              <el-button type="primary" @click="changeInfoDialog=false">{{$t('m.sure')}}</el-button>
          </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import 'element-ui/lib/theme-chalk/index.css'
  import {ZOSInstance} from 'zos-wallet-js'
  import ConfirmPassword from '/path-components/Login/ConfirmPassword'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import async from 'async'
  import { ChainValidation } from 'zosjs/es'
  import Vue from 'vue'

  export default {
    components: {
      ConfirmPassword,
      getzosdialog,
      couponDialog
    },
    data () {
      return {
        changeKeyName: {
          carriers: this.$t('m.params.operator'),
          gateways: this.$t('m.params.gateway'),
          issuer_rate: this.$t('m.params.rateUser'),
          budget_member: this.$t('m.params.budgetMember'),
          platform_id: this.$t('m.params.platform'),
          min_loan_amount: this.$t('m.params.minBorrow'),
          min_loan_increase_range: this.$t('m.params.minBorrowIn'),
          min_invest_amount: this.$t('m.params.minInvest'),
          min_invest_increase_range: this.$t('m.params.minInvestIn'),
          max_repayment_period: this.$t('m.params.maxTime'),
          repayment_period_uint: this.$t('m.params.timeUnit'),
          max_bid_time: this.$t('m.params.maxInvest'),
          max_repayment_rate: this.$t('m.params.maxRate'),
          repayment_type: this.$t('m.borrow.HKFS'),
          notify_overdue_time: this.$t('m.params.repayNote'),
          repayment_date: this.$t('m.borrowsuccess.repayment_day'),
          risk_margin_rate: this.$t('m.params.riskRate'),
          platform_service_charge_rate: this.$t('m.params.platformServiceRate'),
          service_charge_rate: this.$t('m.params.platformServiceRate'),
          refer_charge_rate: this.$t('m.params.proposed'),
          service_carrier_charge_rate: this.$t('m.params.carrierServiceLoan'),
          service_platform_charge_rate: this.$t('m.params.platformAllo'),
          service_gateway_charge_rate: this.$t('m.params.platformServiceGateway'),
          invest_charge_rate: this.$t('m.params.debitReference'),
          loan_charge_rate: this.$t('m.params.creditReference'),
          overdue_expiration_time: this.$t('m.params.overdueLiquidation'),
          overdue_penalty_interest_rate: this.$t('m.params.overdueInterest'),
          overdue_liquidation_rate: this.$t('m.params.latePayment'),
          early_repayment_liquidation_rate: this.$t('m.params.dueBreach'),
          recycle_invester_lose_rate: this.$t('m.params.overdue'),
          max_overdue_period: this.$t('m.params.investors'),
          principal_guarantee_rate: this.$t('m.params.investors'),
          overdue_penalty_date_interest_rate: this.$t('m.params.dueInterest'),
          platform_service_gateway: this.$t('m.params.platformServiceGateway'),
          platform_service_platform: this.$t('m.params.platformServicePlatform'),
          platform_service_invest_refer: this.$t('m.params.investRefer'),
          platform_service_loan_refer: this.$t('m.params.loanRefer'),
          platform_service_invest_carrier: this.$t('m.params.platformServiceInvest'),
          platform_service_loan_carrier: this.$t('m.params.platformServiceLoan'),
          carrier_service_invest_carrier: this.$t('m.params.carrierServiceInvest'),
          carrier_service_loan_carrier: this.$t('m.params.carrierServiceLoan'),
          max_carrier_service_charge: this.$t('m.params.maxCarrierService'),
          carrier_service_charge_rate: this.$t('m.params.carrierRate'),
          max_platform_service_charge_rate: this.$t('m.params.maxPlatformRate'),
          max_risk_margin: this.$t('m.params.maxRiskMargin'),
          max_interest_rate: this.$t('m.params.rateVal'),
          flags: this.$t('m.params.feederFlag'),
          feeders: this.$t('m.params.getFeeders'),
          allowed_collateralize: this.$t('m.params.allowedCollate')
        },
        showPrecision: {
          min_loan_amount: true,
          min_loan_increase_range: true,
          min_invest_amount: true,
          min_invest_increase_range: true,
          max_platform_service_charge_rate: true,
          max_risk_margin: true,
          max_interest_rate: true,
          max_carrier_service_charge: true
        },
        ruleForm: {
          name: null
        },
        rules: {
          name: [
            {required: true, message: this.$t('m.proposalList.account'), trigger: 'change'}
          ]
        },
        accountMap: null,
        keyMap: null,
        tableData: [],
        agreeAddData: [],
        loading: true,
        conformLoading: false,
        conformDialog: false,
        agreeDialogLoading: false,
        agreeDialogVisible: false,
        changeInfoDialog: false,
        passwordDialog: false,
        selectData: {},
        selectType: null,
        windowHeight: null,
        windowWidth: null,
        emptyListShow: 0,
        dialogName: '',
        zosDialog: false,
        couponVisible: false,
        amount: 0,
        feel: 0,
        feelReal: 0,
        tr: 0,
        originalData: {}, // 当前货币的链上原始参数,
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
        ayscFeedOption: []
      }
    },
    computed: {
    },
    filters: {
      formatSum: sum => {
        return sum.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      },
      formatPercent: (value, maxValue) => {
        let num = value / maxValue
        return Math.round(num * 100) / 100 + '%'
      },
      formatData: time => {
        return time.toString().replace('T', ' ')
      },
      formatProcess: process => {
        return Math.floor(process)
      }
    },
    methods: {
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      // 关闭优惠
      couponClose () {
        this.couponVisible = false
      },
      getList () {
        let other = this
        this.loading = true
        ZOSInstance.get_proposals(this.$store.state.userDataSid).then(res => {
          if (res.length === 0) {
            this.tableData = res
            this.emptyListShow = 1
            this.loading = false
          }
          async.each(res, function (res, allcallback) {
            ZOSInstance.get_object(res.operations[0][1].option_id).then(optionRes => {
              res['assetsId'] = optionRes.get('asset_id')
              ZOSInstance.get_object(optionRes.get('asset_id')).then(assetRes => {
                res['assetsSymbol'] = assetRes.get('symbol')
                res['assetsPrecision'] = assetRes.get('precision')
                allcallback(null)
              })
            })
          }, function (allerr) {
            other.tableData = res
            other.loading = false
            other.emptyListShow = 2
          })
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
        ZOSInstance.getAccountBalances(this.$store.state.userName).then(res => {
          this.amount = 0
          this.ruleFormTemp = res
          for (let v of res) {
            if (v.symbol === 'ZOS') {
              this.amount = v.amount
            }
          }
        }).catch(err => {
          console.log(err)
        })
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'proposal_update', '').then(res => {
          this.feel = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
        }).catch(err => {
          console.log(err)
        })
      },
      arrayEquals (self, array) {
        if (!self || !array) { return false }
        if (self.length !== array.length) { return false }
        for (var i = 0, l = self.length; i < l; i++) {
          if (self[i] instanceof Array && array[i] instanceof Array) {
            if (!self[i].equals(array[i])) { return false }
          } else if (self[i] !== array[i]) {
            return false
          }
        }
        return true
      },
      // 展示参数变化
      showInfo (originalData, newData, ayscfeed = '') {
        if (newData.changeInfo === undefined) {
          let changeArray = []
          if (newData.operations[0][0] === 87) {
            let newFeedOption = newData.operations[0][1].new_feed_option
            changeArray.push({name: this.changeKeyName.flags, value: this.checksArr[ayscfeed.flags].value, newValue: this.checksArr[newFeedOption.flags].value})
            // 修改后
            let arrName = []
            // 修改前
            let _arrName = []
            ZOSInstance.get_account(newFeedOption.feeders).then(feederName => {
              if (feederName) {
                feederName.forEach(data => {
                  arrName.push(data.get('name'))
                })
              }
              return ZOSInstance.get_account(ayscfeed.feeders)
            }).then(_feederName => {
              if (_feederName) {
                _feederName.forEach(data => {
                  _arrName.push(data.get('name'))
                })
              }
              changeArray.push({name: this.changeKeyName.feeders, value: _arrName, newValue: arrName})
            }).catch(err => console.log(err))
          } else {
            let options = newData.operations[0][1].options
            for (let key in options) {
              let value = originalData[key]
              let newValue = options[key]
              if (this.showPrecision[key]) {
                value = value / Math.pow(10, newData.assetsPrecision)
                newValue = newValue / Math.pow(10, newData.assetsPrecision)
              }
              if (key === 'max_bid_time') {
                value = value / (24 * 3600) + '天'
                newValue = newValue / (24 * 3600) + '天'
              }
              if (key === 'allowed_collateralize') {
                ZOSInstance.get_object(value).then(resold => {
                  if (resold) {
                    let resoldNames = []
                    for (let obj of resold) {
                      resoldNames.push(obj.get('symbol'))
                    }
                    value = resoldNames
                  }
                  return ZOSInstance.get_object(newValue)
                })
                  .then(resnew => {
                    if (resnew) {
                      let resnewNames = []
                      for (let obj of resnew) {
                        resnewNames.push(obj.get('symbol'))
                      }
                      newValue = resnewNames
                      if (Array.isArray(options[key])) {
                        if (Array.isArray(originalData[key]) && !this.arrayEquals(options[key], originalData[key])) {
                          changeArray.push({name: this.changeKeyName[key], value: value, newValue: newValue})
                        }
                      } else {
                        if (options[key] !== originalData[key]) {
                          changeArray.push({name: this.changeKeyName[key], value: value, newValue: newValue})
                        }
                      }
                    }
                  })
              }
              if (key !== 'allowed_collateralize') {
                if (Array.isArray(options[key])) {
                  if (Array.isArray(originalData[key]) && !this.arrayEquals(options[key], originalData[key])) {
                    changeArray.push({name: this.changeKeyName[key], value: value, newValue: newValue})
                  }
                } else {
                  if (options[key] !== originalData[key]) {
                    changeArray.push({name: this.changeKeyName[key], value: value, newValue: newValue})
                  }
                }
              }
            }
          }
          newData.changeInfo = changeArray
        }
        this.selectData = newData
        this.refreshShowInfo()
        this.changeInfoDialog = true
      },
      // 刷新展示的用户名
      refreshShowInfo () {
        let self = this
        this.selectData.changeInfo.forEach((item, index) => {
          if (Array.isArray(item.value)) {
            if (item.value[0]) {
              if (ChainValidation.is_object_id(item.value[0]) && ChainValidation.is_object_id(item.newValue[0])) {
                ZOSInstance.get_object(item.value).then(resold => {
                  let resoldNames = []
                  for (let obj of resold) {
                    resoldNames.push(obj.get('name'))
                  }
                  ZOSInstance.get_object(item.newValue).then(resnew => {
                    let resnewNames = []
                    for (let obj of resnew) {
                      resnewNames.push(obj.get('name'))
                    }
                    Vue.set(self.selectData.changeInfo, index, {name: item.name, value: resoldNames, newValue: resnewNames})
                  })
                })
              }
            }
          } else {
            if (ChainValidation.is_object_id(item.value) && ChainValidation.is_object_id(item.newValue)) {
              ZOSInstance.get_object(item.value).then(resold => {
                ZOSInstance.get_object(item.newValue).then(resnew => {
                  Vue.set(self.selectData.changeInfo, index, {name: item.name, value: resold.get('name'), newValue: resnew.get('name')})
                })
              })
            }
          }
        })
      },
      handleShowInfo (row) {
        this.ayscFeedOption = []
        ZOSInstance.getBitlenderOption(row.assetsId).then(res => {
          this.ayscFeedOption = res.feed_option
          this.originalData[row.assetsId] = res.options
          this.showInfo(this.originalData[row.assetsId], row, this.ayscFeedOption)
        }).catch(err => console.log(err))
      },
      operConfrom () {
        this.conformLoading = true
        ZOSInstance.broadcastTransaction(this.tr).then(res => {
          this.conformDialog = false
          this.conformLoading = false
          this.$message({
            message: this.$t('m.badloans.subSucc'),
            type: 'success'
          })
          this.getList()
        }).catch(err => {
          console.log(err)
          this.conformLoading = false
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      openAgreeDialog (data) {
        this.ruleForm.name = null
        this.agreeAddData.splice(0, this.agreeAddData.length)

        this.selectData = data
        this.agreeDialogVisible = true
        this.agreeDialogLoading = true
        ZOSInstance.get_propos_required_list(data.id, this.selectType).then(res => {
          this.agreeDialogLoading = false
          this.accountMap = res.accounts_map
          this.keyMap = res.keys_map
          this.agreeAddData = res.accounts_ary.concat(res.keys_ary)
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.agreeDialogVisible = false
          this.agreeDialogLoading = false
        })
      },
      handleAgree (row) {
        this.selectType = 0
        this.dialogName = this.$t('m.proposalList.agreePropo')
        this.openAgreeDialog(row)
      },
      handleCancel (row) {
        this.selectType = 1
        this.dialogName = this.$t('m.proposalList.undoPropo')
        this.openAgreeDialog(row)
      },
      agreeAddOper (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.passwordDialog = true
            this.agreeDialogVisible = false
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.agreeDialogVisible = false
      },
      confirmClose () {
        this.passwordDialog = false
      },
      confirmSuccess () {
        this.passwordDialog = false
        this.proposalUpdate()
      },
      proposalUpdate () {
        ZOSInstance.proposal_update(this.selectData.id, this.accountMap, this.keyMap, this.selectType,
          this.selectData.type, this.$store.state.userDataSid, this.$store.state.userName).then(res => {
          this.tr = res.tr
          this.feelReal = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
          this.conformDialog = true
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
        })
      },
      getUserName () {
        return this.$store.state.userName
      }
    },
    mounted () {
      if (this.$store.state.initFinished) {
        this.getList()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.getList()
        })
      }
    },
    created () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "/path-assets/style/mixin";
  @import "/path-assets/style/theme";
  .el-card__body {
    padding: 0 20px !important;
  }
  .el-card{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
  }
  .nav {
    margin-left: 2rem;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #c81623;
          padding: 5px;
          border: .5px solid;
          border-radius: 5px;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }
  .listST{
    display: flex;
    align-items: center;
    padding: 5px;
    margin-top: 25px;
    /*margin-left: 1rem;*/
    background-color: #ffffff;
    >div{
      margin-left: 10px;
    }
    img{
      width: 40px;
      height: 40px;
      margin-left: 1rem;
    }
  }


  .el-pagination{
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }

</style>

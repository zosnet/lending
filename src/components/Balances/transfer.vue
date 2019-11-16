<template>
    <div>
        <!--转账-->
        <el-dialog
        :title="$t('m.transfer.title')"
        :visible.sync="visible"
        width="45%"
        :before-close="formHandleClose">
          <div v-loading="loading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item :label="$t('m.transfer.XZBZ')">
                  <el-select
                    v-model="transferId"
                    :placeholder="$t('m.transfer.selectCurreny')"
                    :disabled="isDisabled">
                    <el-option
                      v-for="item in allBalances.balances"
                      :key="item.asset_id"
                      :label="item.symbol"
                      :value="item.asset_id">
                      <img width="20" height="20" v-bind:src="`/static/images/${item.symbol.toUpperCase()}.png`" :onerror="errorImg01">
                      <span class="margin-l20">{{item.symbol}}</span>
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('m.transfer.ZHM')" prop="accountTo">
                  <el-input v-model="ruleForm.accountTo" @keyup.native="ruleForm.accountTo=ruleForm.accountTo.toLocaleLowerCase()" @blur="checkEncMsg()"></el-input>
              </el-form-item>
              <el-form-item :label="$t('m.transfer.ZZSL')" prop="depositAmount">
                  <el-input v-model="ruleForm.depositAmount" @keyup.native="depoValid"></el-input>
                  <span>{{$t('m.transfer.KY')}}: {{balances.amount | formatLegalCurrencys('',balances.precision)}} {{balances.symbol}}</span>
              </el-form-item>
              <!--到账数量-->
              <!-- <el-form-item :label="$t('m.transfer.accountNum')"  style="width: 300px">
                  <el-input v-model="ruleForm.depositAmount" disabled></el-input>
              </el-form-item> -->
              <el-form-item :label="$t('m.transfer.BZ')" prop="mome">
                  <el-input type="textarea" v-model="ruleForm.mome"></el-input>
                  <span class="warn_block" v-if="isEncMsg == false">{{$t('m.transfer.warn_lock')}}</span>
              </el-form-item>

              <p class="feel margin-l20">
                  <!--燃料费-->
                  <!--(约)-->
                  <span>{{$t('m.fuelCost')}}: {{feel}} ZOS {{$t('m.transfer.about')}}</span>
                  <span style="flex:1"></span>
                  <!--可用数量-->
                  <!--获得-->
                  <span>
                    {{$t('m.orderList.useNum')}}: {{zosAmount | formatLegalCurrencys('', zosPrecision)}} ZOS
                    <a @click="zosDialog=true">{{$t('m.transfer.get')}}ZOS</a>
                  </span>
              </p>
              <p class="feel margin-l20">
                  <!--系统将优先使用优惠券抵扣-->
                  <span class="gray">{{$t('m.transfer.useCoupons')}}</span>
                  <span style="flex:1"></span>
                  <!--优惠券数量-->
                  <span>{{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS
                    <!--了解优惠券-->
                    <a class="margin-l20" @click="couponVisible=true">{{$t('m.transfer.understandCoupons')}}</a>
                  </span>
              </p>
              <!--数量不足-->
              <div style="font-size: 12px;color: red" v-show="zosAmount < feel && $store.state.coupon.amount < feel">ZOS{{$t('m.transfer.numNull')}}</div>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <!--取 消-->
            <el-button @click="resetForm('ruleForm')">{{$t('m.cancel')}}</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('m.transfer.ZZBtn')}}</el-button>
          </span>
        </el-dialog>

        <!--关于优惠-->
        <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>
        <!--获得ZOS-->
        <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>

        <!--转账信息确认-->
        <el-dialog
        v-if="conformDialog"
        :title="$t('m.transfer.transferSure')"
        :visible.sync="conformDialog"
        width="30%"
        append-to-body
        :before-close="handleClose">
        <!--正在验证-->
        <div v-loading="loadingsCon" :element-loading-text="$t('m.transfer.being')" style="min-height: 10vw;">
            <span>
                <div>
                <!--来自-->
                <p>{{$t('m.transfer.from')}}: {{userName}}</p>
                <!--发往-->
                <p style="word-wrap: break-word; word-break: break-all; overflow: hidden;">{{$t('m.transfer.to')}}: {{ruleForm.accountTo}}</p>
                <!--数量-->
                <p>{{$t('m.transfer.num')}}: {{ruleForm.depositAmount}} {{balances.symbol}}</p>
                <!--memo备注-->
                <p style="word-wrap: break-word; word-break: break-all; overflow: hidden;">{{$t('m.transfer.memo')}}: {{ruleForm.mome}}</p>
                <p>{{$t('m.fuelCost')}}: {{feel}} ZOS</p>
                </div>
            </span>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
            <!--取 消-->
            <el-button @click="transferCannel">{{$t('m.cancel')}}</el-button>
            <!--确 定-->
            <el-button type="primary" @click="transferConfrom('ruleForm')">{{$t('m.sure')}}</el-button>
            </div>
        </div>
        </el-dialog>

        <!--交易广播失败-->
        <el-dialog
        :title="$t('m.transfer.failure')"
        :visible.sync="conformfail"
        width="30%"
        :before-close="handleClose">
        <!--你的交易确认超时, 请稍后尝试。-->
        <h3>{{$t('m.transfer.timeout')}}</h3>
        <span slot="footer" class="dialog-footer">
            <!--关 闭-->
            <el-button @click="conformfail = false">{{$t('m.close')}}</el-button>
            </span>
        </el-dialog>

        <confirm-password :visible="accountDialog" @close="accountClose" @success="accountSubmit" :isAppend="true"></confirm-password>
    </div>

</template>
<script>
import { MessageBox } from 'element-ui'
import getzosdialog from '/path-components/Chain/getzosDialog'
import couponDialog from '/path-components/Chain/couponDialog'
import {ZOSInstance} from 'zos-wallet-js'
import ConfirmPassword from '/path-components/Login/ConfirmPassword'
export default {
  props: {
    transferId: {
      type: [Object, String],
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    getzosdialog,
    couponDialog,
    ConfirmPassword
  },
  data () {
    var depositNumVa = (rule, value, callback) => {
      let v = Number(value)
      if (!value) {
        // '请输入转账数量'
        callback(new Error(this.$t('m.transfer.inputNum')))
      } else if (v > this.balances.amount) {
        // 可用, '数量不足，请充币'
        callback(new Error(this.$t('m.transfer.KY') + this.balances.symbol + this.$t('m.transfer.nullNum')))
      } else {
        // 10000   10020
        if (value <= 0 || isNaN(v)) {
          // '转账数量不符合规则
          callback(new Error(this.$t('m.transfer.unRules')))
        } else {
          if (this.zosAmount < this.feel && this.$store.state.coupon.amount < this.feel) {
            // '可用ZOS数量不足，请充币'
            callback(new Error(this.$t('m.transfer.unZos')))
          } else {
            callback()
          }
        }
      }
    }
    var accountToVa = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        // '请输入账户名'
        callback(new Error(this.$t('m.transfer.inputName')))
      } else if (value === this.$store.state.userName) {
        // '不能转账至自己的账户'
        callback(new Error(this.$t('m.transfer.transferOwner')))
      } else {
        ZOSInstance.checkAccountExists(value).then((res) => {
          if (res.length === 0) {
            // '没有找到该账户'
            callback(new Error(this.$t('m.transfer.noName')))
          } else {
            for (const key in res) {
              if (res[key][0] === value) {
                callback()
                break
              }
              if (Number(key) === Number(res.length - 1)) {
                // '没有找到该账户'
                callback(new Error(this.$t('m.transfer.noName')))
              }
            }
          }
        })
      }
    }
    return {
      conformDialog: false,
      conformfail: false,
      accountDialog: false,
      loadingsCon: false,
      dialogVisibleTransfer: false,
      loading: false,
      isDisabled: false,
      SlectValue: '',
      ruleForm: {
        tr: {},
        mome: '',
        accountTo: '',
        amount: '',
        message: '',
        depositAmount: 0,
        aa: 0
      },
      userName: '',
      rules: {
        depositAmount: [
          {validator: depositNumVa, trigger: 'blur'}
        ],
        accountTo: [
          {validator: accountToVa, trigger: 'blur'}
        ]
      },
      zosPrecision: 2,
      zosAmount: 0,
      feel: 0,
      isEncMsg: true,
      couponVisible: false,
      zosDialog: false,
      allBalances: {
        balances: []
      },
      balances: {
        amount: 0
      }
    }
  },
  computed: {
  },
  watch: {
    transferId: {
      handler () {
        this._getBalances()
      },
      deep: true
    }
  },
  methods: {
    _getBalances () {
      this.balances = {amount: 0}
      if (this.allBalances && this.allBalances.balances.length > 0) {
        let arr = this.allBalances.balances.filter(item => {
          return item.asset_id === this.transferId
        })
        if (arr.length > 0) {
          this.balances = arr[0]
          if (this.balances.asset_id === '1.3.0') {
            if (this.allBalances.coupon < this.feel) {
              this.balances.amount = this.balances.amount - this.feel
            }
          }
        }
      }
    },
    _zosAmount (balances) {
      if (balances.length < 1) {
        return 0
      } else {
        let arr = balances.filter((item) => {
          return item.asset_id === '1.3.0'
        })
        this.zosPrecision = arr.length < 1 ? 2 : arr[0].precision
        this.zosAmount = arr.length < 1 ? 0 : arr[0].amount
      }
    },
    getAccBalance () {
      ZOSInstance.get_account_allbalances(this.$store.state.userDataSid, 0).then(res => {
        this.allBalances = res
        if (this.transferId !== null) this._getBalances()
        this._zosAmount(this.allBalances.balances)
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$message({
          message: error,
          type: 'error'
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.visible = false
      this.$emit('closeTransfer')
    },
    formHandleClose () {
      this.$emit('closeTransfer')
    },
    // 获得ZOS的弹窗
    isVisible () {
      this.zosDialog = false
    },
    couponClose () {
      this.couponVisible = false
    },
    transferCannel () {
      this.conformDialog = false
    },
    accountClose () {
      this.accountDialog = false
    },
    depoValid () {
      if (Number(this.ruleForm.depositAmount) >= 0) {
        this.ruleForm.depositAmount = this.ruleForm.depositAmount.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        this.ruleForm.depositAmount = this.ruleForm.depositAmount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        this.ruleForm.depositAmount = this.ruleForm.depositAmount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        let newstr
        if (this.ruleForm.depositAmount.indexOf('.') !== -1) { // 如果存在小数点
          var pos = this.ruleForm.depositAmount.indexOf('.') // 小数点的位置
          newstr = this.ruleForm.depositAmount.substring(pos + 1) // 小数点后面的值
          var yong = this.ruleForm.depositAmount.substring(0, pos + 1)
          newstr = newstr.replace(/[^0-9]/ig, '')
          if (typeof (this.balances.precision) === 'undefined') {
            this.balances.precision = 2
          }
          if (newstr.length >= this.balances.precision + 1) {
            newstr = newstr.substring(0, this.balances.precision)
          }
          this.ruleForm.depositAmount = yong + newstr
        }
      }
    },
    init () {
      this.isDisabled = (this.transferId !== null)
      this.getAccBalance()
      this._getAboutFee()
    },
    _getAboutFee () {
      ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'transfer', '').then(res => {
        this.feel = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm (formName) {
      this.checkEncMsg()
      this.userName = this.$store.state.userName
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.accountDialog = true
        } else {
          return false
        }
      })
    },
    checkEncMsg () {
      ZOSInstance.is_enc_memo(this.$store.state.userDataSid, this.ruleForm.accountTo).then(res => {
        this.isEncMsg = res
      })
    },
    transferConfrom (formName) {
      this.loadingsCon = true
      ZOSInstance.broadcastTransaction(this.tr).then(res => {
        this.loadingsCon = false
        const h = this.$createElement
        this.$notify({
          // '交易已确认'
          title: this.$t('m.transfer.tradeConfirmed'),
          // '将',转账给
          message: h('i', { style: 'color: teal' }, this.userName + ' ' + this.$t('m.transfer.will') + this.ruleForm.depositAmount + this.balances.symbol + ' ' + this.$t('m.transfer.transferTo') + this.ruleForm.accountTo)
        })
        this.conformDialog = false
        this.dialogVisibleTransfer = false
        this._getAboutFee()
        // 转账成功
        MessageBox.alert(this.$t('m.transfer.transferSucc'), {
          // '确定'
          confirmButtonText: this.$t('m.sure')
        })
        this.$refs[formName].resetFields()
        this.ruleForm.mome = ''
        this.visible = false
        this.$emit('closeTransfer')
      }).catch(err => {
        console.log(err)
        this.$message({
          message: err,
          type: 'error'
        })
        this.loadingsCon = false
        this.conformDialog = false
        this.dialogVisibleTransfer = false
        this.visible = false
        this.$refs[formName].resetFields()
      })
    },
    // 输入密码
    accountSubmit () {
      ZOSInstance.transferNoBroadcast(this.$store.state.userName, this.ruleForm.accountTo, Math.round((Number(this.ruleForm.depositAmount) * Math.pow(10, this.balances.precision)) * 10) / 10, this.balances.asset_id, this.ruleForm.mome).then(res => {
        this.accountDialog = false
        this.conformDialog = true
        this.tr = res.tr
        this.feel = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
        this.loadings = false
      }).catch(err => {
        console.log(err)
        this.loadings = false
        this.$message({
          message: err.Error,
          type: 'error'
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
<style scopd>
.warn_block{
  color: #f56c6c;
  font-size: 12px;
}
</style>

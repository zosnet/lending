<template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ1">
      <!--修改手机号-->
      <el-dialog
        :title="$t('m.information.updatePhone')"
        :visible.sync="popupOpen"
        width="35%"
        :before-close="handleClosePhone"
      >
        <el-form :model="mForm" status-icon :rules="mRules" ref="mForm" label-width="100px" class="demo-ruleForm"
                 v-loading="loadingPhone"
                 :element-loading-text="$t('m.borrow.submiting')">
          <!--手机号-->
          <el-form-item :label="$t('m.information.phone')" prop="phone">
            <el-input :placeholder="$t('m.information.inputPhone')" v-model="mForm.phone" class="input-with-select">
              <el-select v-model="mForm.phoneCode" slot="prepend" :placeholder="$t('m.transfer.QXZ')">
                <el-option
                  v-for="(item,index) in code"
                  :label="item.name"
                  :value="item.code"
                  :key="index"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right;">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!--验证码-->
          <el-form-item :label="$t('m.register.vaCode')" prop="keyCode">
            <el-input type="text" v-model="mForm.keyCode" style="width: 50%" auto-complete="off" class="fl"></el-input>
            <y-button v-if="this.$store.state.ucurl !== undefined" :text="labelText"
                      class="fr"
                      :disabled="!isShowSms"
                      :classStyle="'main-btn'"
                      @btnClick="getCode"
            ></y-button>
          </el-form-item>
          <el-form-item>
            <p class="text-right margin-t10">
              <!--重置-->
              <y-button :text="$t('m.information.reset')"
                        @btnClick="resetForm('mForm')"
              ></y-button>
              <y-button :text="$t('m.sure')"
                        :classStyle="mForm.phone && mForm.keyCode && mForm.phoneCode ? 'main-btn' : 'disabled-btn'"
                        @btnClick="submitFormPhone('mForm')"
              ></y-button>
            </p>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--输入资金密码-->
      <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
      </div>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  import { getSmsCode, checkSmsCode } from '/js-api/index'
  import YShelf from '/path-components/element/shelf'
  import YPopup from '/path-components/element/popup'
  import {ZOSInstance} from 'zos-wallet-js'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {
      YButton,
      YShelf,
      YPopup,
      passwordDialog
    },
    props: {
      popupOpen: {
        type: Boolean,
        defalut: true
      }
    },
    data () {
      // 请输入手机号
      const phone = (rule, value, callback) => {
        if (value === '') {
          // '请输入手机号'
          callback(new Error(this.$t('m.information.inputPhone')))
        } else if (this.mForm.phoneCode === '') {
          callback(new Error(this.$t('m.information.selcode')))
        } else if (this.infos.phoneCode === this.mForm.phoneCode && this.infos.phone === value) {
          callback(new Error(this.$t('m.information.sameInput')))
        } else if (!this.checkPhone(value)) {
          callback(this.$t('m.bankcard.phoneFormat'))
        } else {
          callback()
        }
      }
      const keyCodeVa = (rule, value, callback) => {
        if (value === '') {
          // '请输入短信验证码'
          callback(new Error(this.$t('m.information.inputCode')))
        } else {
          callback()
        }
      }
      return {
        // 手机号码
        bindPhoneed: false,
        // 发短信验证码按钮是否高亮
        validDis: false,
        // 短信验证码 '重新发验证码
        labelText: this.$t('m.information.send'),
        // isShowSms是否显示
        isShowSms: true,
        loadingPhone: false,
        mForm: {
          phone: '',
          keyCode: '',
          phoneCode: '0086'
        },
        code: [
          {name: this.$t('m.information.china'), code: '0086'},
          {name: this.$t('m.information.cad'), code: '001'},
          {name: this.$t('m.information.ph'), code: '0063'},
          {name: this.$t('m.information.sg'), code: '0065'}
        ],
        mRules: {
          phone: [
            { validator: phone, trigger: 'blur' }
          ],
          keyCode: [
            { validator: keyCodeVa, trigger: 'blur' }
          ]
        },
        userId: '',
        comfirmPassword: false,
        loading: true,
        // 用户信息
        userName: this.$store.state.userName,
        regTime: '',
        feeZos: '',
        zos_balance: '',
        userInfo: {},
        infos: {}
      }
    },
    watch: {
      'mForm.phone': {
        handler: function () {
          if (this.mForm.phone && this.checkPhone(this.mForm.phone)) {
            this.validDis = true
          } else {
            this.validDis = false
          }
        },
        deep: true
      }
    },
    methods: {
      checkPhone (value) {
        if (this.mForm.phoneCode === '0086') {
          return (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value))
        } else if (this.mForm.phoneCode === '001') {
          return (/^([2-9]\d{2}[2-9](?!11))\d{6}$/.test(value))
        } else if (this.mForm.phoneCode === '0063') {
          return (/^(90[0,5-9]|91[0-9]|92[0-9]|93[0-9]|94[0-9]|95[0156]|96[56]|97[0,3-9]|98[19]|99[2,4-9])\d{7}$/.test(value))
        } else if (this.mForm.phoneCode === '0065') {
          return (/^([89])\d{7}$/.test(value))
        }
      },
      handleClosePhone () {
        this.$emit('BindShowClose', false)
        this.popupOpen = false
      },
      // 获得预计手续费
      feeGet () {
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'account_update')
          .then((res) => {
            this.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.zos_balance = res.zos_balance / Math.pow(10, res.precision)
          })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
          })
      },
      // 解userInfo
      decodeUserInfo () {
        ZOSInstance.get_decode_memo(this.$store.state.userDataSid, this.userInfo).then(info => {
          if (!info) {
          } else {
            let infos = JSON.parse(info)
            this.infos.phone = infos.mobile
            this.infos.phoneCode = infos.zone
            this.infos.mail = infos.mail
            this.mForm.phoneCode = infos.zone
            this.$store.state.userInfo.phone = infos.mobile
          }
        })
      },
      // 获取用户信息,推荐人，注册人
      getAccount () {
        this.loading = true
        this.feeGet()
        ZOSInstance.get_user_baseinfo(this.$store.state.userDataSid).then((res) => {
          if (res) {
            var userinfo = res.user_info
            if (userinfo !== undefined) {
              this.userInfo = {
                'from': userinfo.get('from'),
                'to': userinfo.get('to'),
                'nonce': userinfo.get('nonce'),
                'message': userinfo.get('message')
              }
              this.decodeUserInfo()
            }
            this.loading = false
          }
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      },
      // 短信验证码 倒计时开始
      timing () {
        this.isShowSms = false
        let _this = this
        let i = 60
        let t = setInterval(function () {
          i--
          _this.labelText = _this.$t('m.information.resendTime') + '(' + i + ')'
          if (i === 1) {
            clearInterval(t)
            // '重新发送验证码'
            _this.isShowSms = true
            _this.labelText = _this.$t('m.information.resend')
          }
        }, 1000)
      },
      //
      submitFormPhone (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.checkCode().then((data) => {
              if (data) {
                this.operation = 0
                this.comfirmPassword = true
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 输入密码后修改手机号后的回调
      updatePhoneCall (bool) {
        this.comfirmPassword = false
        if (bool) {
          this.updatePhone()
        }
      },
      // 检查证码
      checkCode () {
        this.loadingPhone = true
        let ucUrl = ZOSInstance.ReplaceAddress(this.$store.state.ucurl)
        return checkSmsCode(ucUrl, {
          captcha: this.mForm.keyCode,
          type: '0003',
          phoneNo: this.mForm.phone})
          .then(res => {
            this.loadingPhone = false
            if (Number(res.ret_code) === 1) {
              return true
            } else {
              this.$message({
                type: 'warning',
                message: this.$t('m.information.codeErr') + res.ret_msg
              })
              return false
            }
          }).catch(err => {
            this.loadingPhone = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
            return false
          })
      },
      // 发验证码
      getCode () {
        this.$refs['mForm'].validateField('phoneCode')
        this.$refs['mForm'].validateField('phone', (valid) => {
          if (!valid && this.mForm.phoneCode) {
            let ucUrl = ZOSInstance.ReplaceAddress(this.$store.state.ucurl)
            console.log(ucUrl, 'this.$store.state.settingsAPIs.sms_send')
            // 到计时
            this.timing()
            const strParams = `${this.mForm.phoneCode},5`
            this.loadingPhone = true
            getSmsCode(ucUrl, {
              data: strParams,
              type: '0003',
              phoneNo: this.mForm.phone,
              nationCode: this.mForm.phoneCode})
              .then(res => {
                if (Number(res.ret_code) === 1) {
                  this.$message({
                    type: 'success',
                    message: this.$t('m.information.sendSucc')
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: this.$t('m.information.sendErr') + res.ret_msg
                  })
                }
                this.loadingPhone = false
              }).catch(err => {
                this.loadingPhone = false
                console.log(err)
                this.$message({
                  type: 'warning',
                  message: err
                })
              })
          }
        })
      },
      // 绑定手机号操作
      updatePhone () {
        let param = {mobile: this.mForm.phone, zone: this.mForm.phoneCode, mail: this.infos.mail}
        this.loadingPhone = true
        ZOSInstance.get_encode_memo(this.$store.state.userDataSid, this.$store.state.adminNotifyId, JSON.stringify(param), 1).then(res => {
          let authorData = {
            from: res.from,
            to: res.to,
            nonce: res.nonce,
            message: res.message
          }
          let params = {
            info: authorData
          }
          return ZOSInstance.account_authenticate(this.$store.state.userDataSid, 9, params)
        })
          .then(ress => {
            ZOSInstance.broadcastTransaction(ress.tr)
              .then(res => {
                if (res) {
                  this.loadingPhone = false
                  this.$store.state.userInfo.phone = this.infos.phone = this.mForm.phone
                  this.infos.phoneCode = this.mForm.phoneCode
                  this.$message({
                    type: 'success',
                    // '提交成功'
                    message: this.$t('m.badloans.subSucc')
                  })
                  this.handleClosePhone()
                }
              }).catch(err => {
                this.loadingPhone = false
                console.log(err)
                this.$message({
                  type: 'warning',
                  message: err
                })
                this.handleClosePhone()
              })
          }).catch(err => {
            this.loadingPhone = false
            console.log(err)
          })
      },
      realTime (data) {
        this.previews = data
        let w = 100 / data.w
        this.option.zoom = w
      },
      // 获取优惠券
      bitlenderLendOrder (data) {
        this.updatePhoneCall(data)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      this.loading = true
      if (this.$store.state.initFinished) {
        this.getAccount()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.getAccount()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "/path-assets/style/mixin";
  .close {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    padding: 0 10px;
    @extend %block-center;
    &:hover {
      svg {
        transition: all 1s;
        transform: rotate(360deg);
        transform-origin: 50% 50%;
      }
      path {
        fill: #8a8a8a;
      }
    }
  }
  .el-dialog__body{
    padding: 5px 30px !important;
  }
  .el-form-item{
    margin-bottom: 12px!important;
  }
  .feezos{
    display: flex; flex:1; flex-direction: row
  }
  .el-select {
    width: 100px !important;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .disabled{
    cursor: not-allowed;
    display: inline-block;
    border: 1px solid #afafaf;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    background-color: #a9a9a9;
  }
</style>

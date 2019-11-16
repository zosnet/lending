<template>
  <div slot="content" v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <!--输入资金密码-->
      <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
      <!--修改邮箱-->
      <el-dialog
        :title="$t('m.information.mail')"
        :visible.sync="popupOpen"
        width="35%"
        :before-close="handleClose"
      >
        <el-form :model="mForms" status-icon ref="mForms" label-width="100px" class="demo-ruleForm"
                 :element-loading-text="$t('m.borrow.submiting')"
                 v-loading="loadingMail">
          <el-form-item :label="$t('m.information.mail')" prop="mail"
                        :rules="[
                         { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                                ]"
          >
            <p class="margin-t10">
              <el-input :placeholder="$t('m.information.mail')" v-model="mForms.mail"></el-input>
            </p>
          </el-form-item>
          <el-form-item>
            <p class="text-right margin-t10">
              <!--重置-->
              <y-button :text="$t('m.information.reset')"
                        @btnClick="resetForm('mForms')"
              ></y-button>
              <y-button :text="$t('m.sure')"
                        classStyle="main-btn"
                        @btnClick="submitFormMail('mForms')"
              ></y-button>
            </p>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>
<script>
  import YButton from '/path-components/element/YButton'
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
      return {
        loadingPhone: false,
        mForms: {
          mail: ''
        },
        feeZos: '',
        zos_balance: '',
        userId: '',
        comfirmPassword: false,
        loading: true,
        userName: this.$store.state.userName,
        userInfo: {},
        infos: {},
        loadingMail: false
      }
    },
    methods: {
      handleClosePhone () {
        this.$emit('MailShowClose', false)
        this.popupOpen = false
      },
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
            this.userPassword = true
          } else {
            let infos = JSON.parse(info)
            this.infos.phone = infos.mobile
            this.infos.phoneCode = infos.zone
            this.infos.mail = infos.mail
            this.mForms.mail = infos.mail
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
      submitFormMail (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.infos.mail === this.mForms.mail) {
              this.$message({
                type: 'warning',
                message: this.$t('m.information.sameInput')
              })
              return false
            }
            this.loadingMail = true
            this.comfirmPassword = true
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 输入密码后修改邮箱后的回调
      updateMailCall (bool) {
        this.comfirmPassword = false
        if (bool) {
          this.updateMail()
        }
      },
      // 绑定邮箱操作
      updateMail () {
        let param = {mobile: this.infos.phone, zone: this.infos.phoneCode, mail: this.mForms.mail}
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
                  this.loadingMail = false
                  this.popupsOpen = false
                  this.infos.mail = this.mForms.mail
                  this.$message({
                    type: 'success',
                    // '提交成功'
                    message: this.$t('m.badloans.subSucc')
                  })
                  this.handleClosePhone()
                }
              })
              .catch(err => {
                this.loadingMail = false
                console.log(err)
                this.$message({
                  type: 'warning',
                  message: err
                })
                this.handleClosePhone()
              })
          })
          .catch(err => {
            this.loadingMail = false
            console.log(err)
          })
      },
      // 获取优惠券
      bitlenderLendOrder (data) {
        this.updateMailCall(data)
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

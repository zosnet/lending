<template>
  <el-dialog
    :title="$t('m.inputPassword')"
    @close="close"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="30%"
    :append-to-body="isAppend"
  >
    <div v-loading="loading" :element-loading-text="$t('m.transfer.being')">
      <span>{{$t('m.investDetails.inputPass')}}</span>
      <el-input type="password" v-model="password" ></el-input>
      <div style="font-size: 12px;color: red" v-show="passwordValid">{{message}}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(); password=''">{{$t('m.cancel')}}</el-button>
      <el-button type="primary" @click="accountSubmit">{{$t('m.sure')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import {requestLoginUserData} from '/js-api/index'

  export default {
    props: {
      // 显示该控件与否
      visible: {
        type: Boolean,
        default: true
      },
      isAppend: {
        type: Boolean,
        defalut: false
      }
    },
    data () {
      return {
        // 是否显示密码操作提示
        passwordValid: false,
        // 密码操作错误提示
        message: '',
        // 输入的密码
        password: '',
        loading: false
      }
    },
    computed: {
    },
    watch: {
      visible (newValue) {
        if (newValue) {
        } else {
          this.reset()
        }
      }
    },
    methods: {
      // 关闭控件
      close () {
        this.$emit('closeLogin', false)
      },
      // 重置控件
      reset () {
        const that = this
        that.password = ''
        that.message = ''
        that.passwordValid = false
        this.loading = false
      },
      accountSubmit () {
        this.passwordValid = false
        if (this.password === '') {
          this.passwordValid = true
          // '密码不能为空'
          this.message = this.$t('m.invest.noPassword')
          return false
        } else {
          this.loading = true
          let ifTrue = ZOSInstance.accountLogin(this.$store.state.userName, this.password)
          if (ifTrue) {
            this.passwordValid = false
            let userId = this.$store.state.userDataSid
            ZOSInstance.signAuthInfo(userId).then(signBuffer => {
              this.pubkey = signBuffer
              requestLoginUserData(this.$store.state.USERDATA_URL, {tx: this.pubkey, account: userId}).then(res => {
                if (res.result === 0) {
                  this.$store.state.userDataSid = res.sid
                  this.$emit('closeLogin', true)
                } else {
                  this.$message({
                    // '验证失败'
                    message: this.$t('m.page.validationFail'),
                    type: 'error'
                  })
                }
                this.loading = false
              }).catch(error => {
                console.log('requestLoginUserData', error)
                this.$message({
                  message: this.$t('m.httpUtils.warning'),
                  type: 'error'
                })
              })
            })
          } else {
            this.message = this.$t('m.invest.passwordErr')
            this.loading = false
            this.passwordValid = true
          }
        }
      }
    },
    created () {
      this.loading = true
    }
  }
</script>

<style>
</style>

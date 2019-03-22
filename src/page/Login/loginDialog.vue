<template>
  <el-dialog
    :title="$t('m.login')"
    :visible.sync="visible"
    width="30%"
    @close="close"
    :append-to-body="isAppend"
  >
    <div v-loading.fullscreen.lock="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 220px">
      <div class="login v2">
        <div class="wrapper">
          <div class="dialog dialog-shadow">
            <div v-if="loginPage" class="content">
              <ul class="common-form">
                <li class="margin-b20">
                  <div class="input">
                    <input type="text" v-model="ruleForm.userName"
                           @keyup="ruleForm.userName = ruleForm.userName.replace(/[^\w\.\-\/]/ig,'');onNameChange()"
                           :placeholder="$t('m.userplaceholder')">
                  </div>
                </li>
                <li class="margin-b40">
                  <div class="input">
                    <input type="password" v-model="ruleForm.userPwd" autocomplete="off" @keyup.enter="login" :placeholder="$t('m.Passplaceholder')">
                  </div>
                </li>


              </ul>
              <!--登陆-->
              <div style="margin-top: 25px; display: flex; flex-direction: column">
                <y-button :text="$t('m.login')"
                          :classStyle="ruleForm.userPwd&& ruleForm.userName?'main-btn':'disabled-btn'"
                          @btnClick="mainloading = true;login()"
                          style="flex:1"
                ></y-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  import {ZOSInstance} from 'zos-wallet-js'
  import {ChainStore} from 'zosjs/es'
  import {setStore, setLocalStore, getLocalStore} from '/js-utils/storage'
  export default {
    props: {
      visible: {
        type: Boolean,
        defalut: true
      },
      isAppend: {
        type: Boolean,
        defalut: false
      }
    },
    data () {
      return {
        loginPage: true,
        ruleForm: {
          userName: '',
          userPwd: '',
          errMsg: ''
        },
        registered: {
          userName: '',
          userPwd: '',
          userPwd2: '',
          errMsg: ''
        },
        autoLogin: false,
        logintxt: this.$t('m.login'),
        mainloading: true
      }
    },
    computed: {
      count () {
        return this.$store.state.login
      }
    },
    watch: {
      visible: {
        handler: function (val, oldVal) {
          if (val === false) {
            this.ruleForm.userPwd = ''
            // this.ruleForm.userName = ''
            this.mainloading = false
          }
        },
        deep: true
      }
    },
    methods: {
      // 关闭dialog
      close () {
        this.$emit('bitlenderLendOrder', false)
        this.$store.state.loginPath = undefined
      },
      onNameChange () {
        ChainStore.getAccount(this.ruleForm.userName, true)
      },
      open (t, m) {
        this.$notify.info({
          title: t,
          message: m
        })
      },
      messageSuccess () {
        this.$message({
          message: this.$t('m.register.regSuc'),
          type: 'success'
        })
      },
      messageSuccessLogin () {
        this.$message({
          message: this.$t('m.register.loginSuc'),
          type: 'success'
        })
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      login () {
        this.logintxt = this.$t('m.login')
        if (!this.ruleForm.userName || !this.ruleForm.userPwd) {
          this.ruleForm.errMsg = this.$t('m.register.nameNull')
          this.mainloading = false
          return false
        }
        let userId = ZOSInstance.accountLogin(this.ruleForm.userName, this.ruleForm.userPwd)
        if (userId) {
          this.$store.state.userDataSid = undefined
          this.$store.state.userName = this.ruleForm.userName
          this.$store.state.login = true
          setStore('userName', this.ruleForm.userName)
          setLocalStore('userNameLast', this.ruleForm.userName)
          ChainStore.getAccount(this.$store.state.userName, true)
          setStore('userId', userId)
          ChainStore.setLoginAccount(userId)
          this.$store.state.userDataSid = userId
          ChainStore.notifySubscribers()
          this.$emit('bitlenderLendOrder', true)
          this.visible = false
          if (this.$store.state.loginPath === undefined || this.$store.state.loginPath.path === '/login' || this.$store.state.loginPath.path === '/register') {
            this.$router.push({path: '/'})
          } else {
            this.$router.push(this.$store.state.loginPath)
          }
          this.$store.state.loginPath = undefined
        } else {
          // '账号或者密码错误!'
          this.$message(this.$t('m.register.nameErr'))
          this.mainloading = false
        }
      },
      init_geetest () {
        this.ruleForm.userName = getLocalStore('userNameLast')
        if (this.ruleForm.userName !== null) ChainStore.getAccount(this.ruleForm.userName, true)
        this.login()
      }
    },
    mounted () {
      // 组件创建完成，属性已绑定，但DOM还没有生成前就要loading,等请求完成后，再显示DOM
      if (this.$store.state.initFinished) {
        this.init_geetest()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init_geetest()
        })
      }
    },
    components: {
      YButton,
      ZOSInstance
    }
  }
</script>
<style lang="scss" scoped>
  .input {
    height: 50px;
    display: flex;
    align-items: center;
    input {
      font-size: 16px;
      width: 100%;
      height: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  }
  .title {
    background: linear-gradient(#fff, #f5f5f5);
    height: auto;
    overflow: visible;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    position: relative;
    background-image: url(/static/images/smartisan_4ada7fecea.jpg);
    background-size: 60px;
    background-position: top center;
    background-repeat: no-repeat;
    height: 50px;
    margin: 23px 0 50px;
    padding: 75px 0 0;
    box-shadow: none;
  }
  h4 {
    padding: 0;
    text-align: center;
    color: #666;
    border-bottom: 1px solid #dcdcdc;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    font-weight: 700;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    margin: 0;
    padding: 0;
    border-bottom: 0;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    line-height: 1em;
    height: auto;
    color: #333;
    font-weight: 400;
  }

</style>

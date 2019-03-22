<template>
  <div class="w store-content" style="max-width: 450px">
  <div v-loading.fullscreen.lock="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 100vh;">
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -320px;">
        <div class="title">
          <div></div>
          <h4>{{$t("m.loginTitle")}}</h4>
        </div>
        <div v-if="loginPage" class="content">
          <ul class="common-form">
            <li class="username border-1p">
              <div class="input">
                <input type="text" v-model="ruleForm.userName"
                       @keyup="ruleForm.userName = ruleForm.userName.replace(/[^\w\.\-\/]/ig,'');onNameChange()"
                       :placeholder="$t('m.userplaceholder')">
              </div>
            </li>
            <li>
              <div class="input">
                <input type="password" v-model="ruleForm.userPwd" autocomplete="off" @keyup.enter="login" :placeholder="$t('m.Passplaceholder')">
              </div>
            </li>
            <li>
              <!--<div id="captcha">-->
                <!--<p id="wait">正在加载验证码...</p>-->
              <!--</div>-->
            </li>
            <li style="text-align: right" class="pr">
              <!--<el-checkbox class="auto-login" v-model="autoLogin">记住密码</el-checkbox>-->
              <!-- <span class="pa" style="top: 0;left: 0;color: #d44d44">{{ruleForm.errMsg}}</span> -->
              <a href="javascript:;" class="register" @click="toRegister">{{$t("m.registerAccount")}}</a>
              <!--<a style="padding: 1px 0 0 10px" @click="open('找回密码','请联系作者邮箱找回密码或使用测试账号登录:test | test')">忘记密码 ?</a>-->
            </li>
          </ul>
          <!--登陆-->
          <div style="margin-top: 25px; display: flex; flex-direction: column">
            <y-button :text="$t('m.login')"
                      :classStyle="isDisabled?'main-btn':'disabled-btn'"
                      @btnClick="mainloading = true;login()"
                      style="flex:1"
                      ></y-button>
            <y-button :text="$t('m.Home')" @btnClick="login_back" class="margin-t10"></y-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>
<script src="/path-static/geetest/gt.js"></script>
<script>
import YFooter from '/path-page/Frame/footer'
import YButton from '/path-components/element/YButton'
import {ZOSInstance} from 'zos-wallet-js'
import {ChainStore} from 'zosjs/es'
import { setStore, setLocalStore, getLocalStore } from '/js-utils/storage'
require('/path-static/geetest/gt.js')
// var captcha
export default {
  data () {
    return {
      cart: [],
      ppppp: 0,
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
      mainloading: true,
      disabledRegs: true
    }
  },
  computed: {
    count () {
      return this.$store.state.login
    },
    // Ella  无效状态有点问题
    isDisabled () {
      if ((this.ruleForm.userPwd && this.ruleForm.userName && this.logintxt === this.$t('m.login')) && this.disabledRegs) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
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
    toRegister () {
      this.$router.push({
        path: '/register'
      })
    },
    // 登录返回按钮
    login_back () {
      this.$router.push({
        path: '/'
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
        this.$store.state.userDataSid = userId
        setStore('userId', userId)
        ChainStore.setLoginAccount(userId)
        ChainStore.notifySubscribers()
        if (this.$router.options.nextpath === undefined || this.$router.options.nextpath.path === '/login' || this.$router.options.nextpath.path === '/register') {
          this.$router.push({path: '/'})
        } else {
          this.$router.push(this.$router.options.nextpath)
        }
        this.$router.options.nextpath = undefined
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
    YFooter,
    YButton,
    ZOSInstance
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
* {
  box-sizing: content-box;
}

.login {
  overflow-x: hidden;
  overflow-y: hidden;
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
  .wrapper {
    background: url(/static/images/bg_9b9dcb65ff.png) repeat;
    background-size: 100px;
    min-height: 800px;
    min-width: 630px;
  }
}

.v2 .dialog {
  width: 450px;
  border: 1px solid #dadada;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  margin-left: -225px;
  position: absolute;
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
  }
  .content {
    padding: 0 40px 22px;
    height: auto;
    .common-form {
      li {
        clear: both;
        margin-bottom: 15px;
        position: relative;
      }
    }
  }
}

.dialog-shadow,
.v2 .bbs .dialog-shadow,
.v2 .dialog-shadow {
  -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
}

@media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
  .wrapper {
    background: url(/static/images/con-bg_04f25dbf8e.jpg) repeat-x;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .dialog {
    background: url(/static/images/dialog-gray-bg.png) #fff bottom repeat-x;
    border-radius: 12px;
    display: none;
    margin: -163px 0 0 -218px;
    width: 436px;
    position: fixed;
    left: 50%;
    top: 50%;
  }
  .dialog .title h4 {
    border-bottom: #d1d1d1 solid 1px;
    box-shadow: 0 2px 6px #d1d1d1;
    color: #666;
    font-size: 20px;
    height: 61px;
    line-height: 61px;
    padding: 0 0 0 35px;
  }
  .common-form li {
    clear: both;
    margin-bottom: 15px;
    position: relative;
  }
  .auto-login {
    position: absolute;
    top: 0px;
    left: 2px;
    color: #999;
  }
  .register {
    padding: 1px 10px 0;
    /*border-left: 1px solid #ccc;*/
  }
  .border {
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
  }
  .other {
    margin: 20px 5px 0 0;
    width: auto;
    color: #bbb;
    font-size: 12px;
    cursor: default;
    color: #999;
  }
  .footer {
    display: flex;
    flex-direction: row;
  }
  .agree {
    margin-bottom: 30px;
    color: #999;
  }
}

.registered {
  h4 {
    padding: 0;
    text-align: center;
    color: #666;
    border-bottom: 1px solid #dcdcdc;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    font-weight: 700;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
  }
}

#wait {
  text-align: left;
  color: #999;
  margin: 0;
}
</style>

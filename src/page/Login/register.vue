<template>
  <div class="w store-content" style="max-width: 450px">
    <div v-loading="loadingmain" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loadingmain">
        <div class="login v2">
          <div>
            <div class="dialog dialog-shadow" style="display: block; margin-top: 20px">
              <div class="registered">
                <h4>{{$t('m.register.title')}}</h4>
                <div class="content" style="margin-top: 20px;">
                  <ul class="common-form">
                    <li class="username border-1p">
                      <!--账户名称-->
                      <div style="margin-top: 40px;" >{{$t('m.register.accountName')}}</div>
                      <div class="input">
                        <el-input type="text" @blur="onUserNameChange()"
                                  v-model="exchangeUserName" :placeholder="$t('m.userplaceholder')"></el-input>
                      </div>
                      <div v-show="showPayAccount" style="color: #ADFF2F">
                        <!--1-11位的纯字母为高级账号名-->
                        <div>{{$t('m.register.specifyAccountName')}}</div>
                        <!--您需要指定已存在账号为高级账号名付费-->
                        <div>{{$t('m.register.specifyAccount')}}</div>
                      </div>
                    </li>
                    <li class="username border-1p">
                      <!--验证码-->
                      <div>{{$t('m.register.vaCode')}}</div>
                      <div class="input">
                        <el-input type="text" style="width: 200px;"
                                  v-model="registered.identifyCode" :placeholder="$t('m.register.vaCode')"></el-input>
                        <!--点击更换-->
                        <img style="margin-left: 20px;" width="80" height="30" @click="loadVerifyingImg" :title="$t('m.register.change')" :src="verifyimgData">
                        <!--换一张-->
                        <el-button style="margin-left: 20px;" type="text" @click="loadVerifyingImg">{{$t('m.register.changeOne')}}</el-button>
                      </div>
                    </li>
                    <li>
                      <div style="display: flex;">
                        <!--生成的密码-->
                        <div>{{$t('m.register.gPassword')}}</div>
                        <el-tooltip  placement="bottom" effect="light">
                          <!--密码由浏览器在本地生成<br/>只有你能看到密码<br/>请将它黏贴到下方并保存到安全的地方-->
                          <div slot="content">{{$t('m.register.browserPass')}}<br/>{{$t('m.register.owner')}}<br/>{{$t('m.register.paste')}}</div>
                          <i style="margin-top: 3px; margin-left: 5px" class="el-icon-info"></i>
                        </el-tooltip>
                      </div>
                      <div class="input">
                        <el-input type="text" readonly="true"  style="width: 300px;"
                                  v-model="registered.userPwd" :placeholder="$t('m.Passplaceholder')"></el-input>
                        <el-button style="margin-left: 10px;" v-clipboard:copy="registered.userPwd" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('m.information.copy')}}</el-button>
                      </div>
                    </li>
                    <li>
                      <!--确认密码-->
                      <div>{{$t('m.register.conPass')}}</div>
                      <div class="input">
                        <el-input type="password"
                                  v-model="registered.userPwd2"
                                  @keyup="registered.userPwd2=registered.userPwd2.replace(/[^\w\.\/]/ig,'')"  :placeholder="$t('m.rePassplaceholder')"></el-input>
                      </div>
                    </li>
                    <div v-show="showPayAccount">
                      <li class="username border-1p">
                        <!--付费账号-->
                        <div>{{$t('m.register.paidAccount')}}</div>
                        <div class="input">
                          <el-input type="text"
                                    v-model="registered.payAccount" :placeholder="$t('m.register.paidAccount')" @keyup.native="onPayAccountChange"></el-input>
                        </div>
                      </li>
                      <li>
                        <!--付费金额-->
                        <div>{{$t('m.register.payAmount')}}</div>
                        <div class="input">
                          <el-input type="text"
                                    v-model="registered.payAmount" :placeholder="$t('m.register.payAmount')" readonly="true"><i slot="suffix" style="line-height: 40px" >{{registered.paySymbol}}</i></el-input>
                        </div>
                      </li>
                    </div>
                  </ul>
                  <div class="feel">
                    <input type="checkbox" name="agreement" v-model="agreement" style="font-size: 50px" />
                    <label for="agreement" class="margin-l10">{{$t('m.register.noRecover')}}</label>
                    <!--<el-checkbox class="agree" v-model="agreement" size="mini">-->
                    <!--&lt;!&ndash;我理解如果我忘记或丢失了密码,没有任何人能帮我恢复&ndash;&gt;-->
                    <!--{{$t('m.register.noRecover')}}-->
                    <!--</el-checkbox>-->
                  </div>
                  <div class="feel">
                    <input type="checkbox" name="agreement1" v-model="agreement1" style="font-size: 50px" />
                    <label for="agreement1" class="margin-l10">{{$t('m.register.safekeeping')}}</label>
                    <!--<el-checkbox class="agree" v-model="agreement1">-->
                    <!--&lt;!&ndash;我已妥善保管了我的用户名和密码&ndash;&gt;-->
                    <!--{{$t('m.register.safekeeping')}}-->
                    <!--</el-checkbox>-->
                  </div>
                  <div class="margin-b40 feel">
                    <input type="checkbox" name="agreement2" v-model="agreement2" size="medium" style="font-size: 50px" />
                    <label for="agreement2" class="margin-l10">{{$t('m.register.isRead')}}
                      <br>
                      <a @click="open($t('m.register.policyTitle'), $t('m.register.policy'))">{{$t('m.register.agreement')}}</a></label>
                    <!--<el-checkbox class="agree" v-model="agreement2">-->
                    <!--&lt;!&ndash;我已阅读并同意遵守&ndash;&gt;-->
                    <!--{{$t('m.register.isRead')}}-->
                    <!--</el-checkbox>-->
                    <!--隐私条款','本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息-->
                    <!--用户协议-->
                  </div>

                  <div style="margin-bottom: 30px; display: flex">
                    <y-button
                      :classStyle="isDisabled?'main-btn':'disabled-btn'"
                      :text="$t('m.register.title')"
                      @btnClick="regist"
                      style="flex:1"
                    >
                    </y-button>
                  </div>
                  <!--<div class="border" style="margin-bottom: 10px;"></div>-->
                  <!--<ul class="common-form pr">-->
                    <!--&lt;!&ndash; <li class="pa" style="left: 0;top: 0;margin: 0;color: #d44d44">{{registered.errMsg}}</li> &ndash;&gt;-->
                    <!--<li style="text-align: center;line-height: 48px;margin-bottom: 0;font-size: 12px;color: #999;">-->
                      <!--<span>{{$t('m.tologinTitle')}}</span>-->
                      <!--<a href="javascript:;"-->
                         <!--style="margin: 0 5px"-->
                         <!--@click="toLogin">{{$t('m.login')}}</a>-->
                    <!--</li>-->
                  <!--</ul>-->
                </div>
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
  import YHeader from '/path-page/Frame/header'
  import YFooter from '/path-page/Frame/footer'
  import YButton from '/path-components/element/YButton'
  import {ZOSInstance} from 'zos-wallet-js'
  import { Apis } from 'zosjs-ws'
  import {ChainStore, ChainValidation} from 'zosjs/es'
  import { setStore, removeStore } from '/js-utils/storage.js'
  import http from '/js-api/public'
  import { checkUsernameLength, checkUsernameBegin, checkRegName } from '/js-utils/validate'
  require('/path-static/geetest/gt.js')
  export default {
    data () {
      return {
        cart: [],
        passsValid: false,
        loginPage: true,
        ruleForm: {
          userName: '',
          userPwd: '',
          errMsg: ''
        },
        registered: {
          userName: '',
          identifyCode: '',
          userPwd: '',
          userPwd2: '',
          payAccount: '',
          payAmount: '',
          paySymbol: '',
          payPassWord: '',
          errMsg: ''
        },
        agreement: false,
        agreement1: false,
        agreement2: false,
        registxt: this.$t('m.register.title'),
        showPayAccount: false,
        verifyimgData: '',
        captchaId: '',
        refer: '',
        disabledReg: true
      }
    },
    computed: {
      count () {
        return this.$store.state.login
      },
      exchangeUserName: {
        get: function () {
          return this.registered.userName
        },
        set: function (val) {
          this.registered.userName = val.toLowerCase()
        }
      },
      isDisabled () {
        if ((this.agreement2 && this.agreement1 && this.agreement) && this.disabledReg) {
          return true
        }
      }
    },
    methods: {
      getUrl () {
        const url = window.location.href
        if (url.indexOf('=') > 0) {
          this.refer = url.split('=')[1]
        }
      },
      open (t, m) {
        this.$notify.info({
          title: t,
          message: m
        })
      },
      messageSuccess () {
        this.$message({
          // 恭喜您，注册成功！赶紧登录体验吧
          message: this.$t('m.register.success'),
          type: 'success'
        })
      },
      messageProposalSuccess () {
        this.$message({
          // 高级账户名申请成功！请等待付费账户付费
          message: this.$t('m.register.proposalSuccess'),
          type: 'success'
        })
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      toLogin () {
        this.$router.push({
          path: '/login'
        })
      },
      onPayAccountChange () {
        ChainStore.getAccount(this.registered.payAccount, true)
      },
      gotoPath () {
        if (this.$router.options.nextpath === undefined || this.$router.options.nextpath.path === '/login' || this.$router.options.nextpath.path === '/register') {
          this.$router.push({path: '/'})
        } else {
          this.$router.push(this.$router.options.nextpath)
        }
        this.$router.options.nextpath = undefined
      },
      regist () {
        this.disabledReg = false
        this.registxt = this.$t('m.registing')
        let userName = this.registered.userName
        let userPwd = this.registered.userPwd
        let userPwd2 = this.registered.userPwd2
        let identifyCode = this.registered.identifyCode
        let payAccount = this.registered.payAccount
        // passsValid

        if (!userName || !userPwd || !userPwd2) {
          // 账号密码不能为空
          this.message(this.$t('m.register.unNull'))
          // 注册
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (checkRegName(userName)) {
          this.message(this.$t('m.register.unReg'))
          this.registxt = this.$t('m.register.title')
          return false
        }
        if (!identifyCode || identifyCode === '' || identifyCode.length !== 4) {
          // '账号密码不能为空!'
          this.message(this.$t('m.register.correctCode'))
          // 注册
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (checkUsernameLength(userName)) {
          // '账户只能输入1-63位字符!'
          this.message(this.$t('m.register.characters'))
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (checkUsernameBegin(userName)) {
          // '账号名必须以字母开头!'
          this.message(this.$t('m.register.letterBegin'))
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        let err = ChainValidation.is_account_name_error(userName, true)
        if (err) {
          // '验证用户名的合法性'
          this.message(err)
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        let strTemp = userName.substr(userName.length - 1, userName.length)
        if (strTemp === '-') {
          // '用户名不能以-结尾!'
          this.message(this.$t('m.register.notEnd'))
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (userPwd2 !== userPwd) {
          // '两次输入的密码不相同!'
          this.message(this.$t('m.register.noSame'))
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (!this.agreement) {
          // '您未勾选同意我们的相关注册协议!'
          this.message(this.$t('m.register.notCheck'))
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (!isNaN(userPwd2)) {
          // '密码不支持纯数字!'
          this.message(this.$t('m.register.notSupport'))
          this.registxt = this.$t('m.register.title')
          this.disabledReg = true
          return false
        }
        if (this.showPayAccount) {
          let payaccount = ChainStore.getAccount(this.registered.payAccount, false)
          if (!payaccount) {
            // '付费账号不存在!'
            this.message(this.$t('m.register.paidAccountNoExists'))
            this.registxt = this.$t('m.register.title')
            this.disabledReg = true
            return false
          }
          let flags = payaccount.get('uaccount_property')
          if ((flags & 0x01000000) !== 0x01000000) {
            // '付费账号不能注册靓号!'
            this.message(this.$t('m.register.paidAccountNoFlags'))
            this.registxt = this.$t('m.register.title')
            this.disabledReg = true
            return false
          }
        }
        ZOSInstance.checkAccountExists(userName)
          .then((res) => {
            for (const key in res) {
              if (res[key][0] === userName) {
                // '账号名已存在!'
                this.message(this.$t('m.register.exists'))
                this.registxt = this.$t('m.register.title')
                this.disabledReg = true
                return false
              }
            }
            ZOSInstance.createAccountWithPassword(userName, userPwd, ZOSInstance.getFaucetAddress(), this.refer, identifyCode, this.captchaId, payAccount)
              .then((res) => {
                if (res) {
                  if (res.proposal) {
                    this.messageProposalSuccess()
                    this.gotoPath()
                  } else {
                    this.messageSuccess()
                    this.$store.state.userDataSid = undefined
                    this.$store.state.userName = this.ruleForm.userName
                    this.$store.state.login = true
                    setStore('userName', userName)
                    let acc = ChainStore.getAccount(userName, true)
                    if (acc) {
                      setStore('userId', acc.get('id'))
                      this.$store.state.userDataSid = acc.get('id')
                      ChainStore.setLoginAccount(this.$store.state.userDataSid)
                    }
                    this.gotoPath()
                  }
                } else {
                  this.$message({
                    // '注册失败'
                    message: this.$t('m.register.regFail'),
                    type: 'error'
                  })
                  this.loadVerifyingImg()
                }
                this.disabledReg = true
              })
              .catch((err) => {
                if (Number(err.code) === 1) {
                  this.$message({
                    message: '[' + err.code + '] ' + (err.msg ? err.msg[0] : this.$t('m.register.errorInfo1')),
                    type: 'error'
                  })
                }
                if (err.msg) {
                  this.registxt = this.$t('m.register.title')
                  this.$message({
                    message: '[' + err.code + '] ' + (err.msg ? err.msg[0] : this.$t('m.register.errorInfo1')),
                    type: 'error'
                  })
                } else {
                  this.$message({
                    message: err,
                    type: 'error'
                  })
                }
                this.disabledReg = true
                this.loadVerifyingImg()
              })
          })
      },
      init_geetest () {
      },
      onCopy (e) {
        this.$message({
          message: this.$t('m.copySuccess'),
          type: 'success'
        })
      },
      onError (e) {
        console.log('onError', e)
      },
      onUserNameChange () {
        if (checkRegName(this.registered.userName)) {
          this.message(this.$t('m.register.unReg'))
          this.registxt = this.$t('m.register.title')
          return false
        }
        ZOSInstance.checkAccountExists(this.registered.userName).then((res) => {
          for (const key in res) {
            if (res[key][0] === this.registered.userName) {
              // '账号名已存在!'
              this.message(this.$t('m.register.exists'))
              this.registxt = this.$t('m.register.title')
              this.showPayAccount = false
              return false
            }
          }
          let err = ChainValidation.is_account_name_error(this.registered.userName, true)
          if (err) {
            this.message(err)
            this.registxt = this.$t('m.register.title')
            this.showPayAccount = false
            return false
          }

          /*
          if (this.registered.userName.length < 3) {
            this.showPayAccount = true
          } else {
            if (this.registered.userName.length < 9) {
              if (/[0-9-]/.test(this.registered.userName) || !/[aeiouy]/.test(this.registered.userName)) {
                this.showPayAccount = false
              } else {
                this.showPayAccount = true
              }
            } else {
              this.showPayAccount = false
            }
          }
          */
          Apis.instance().db_api().exec('is_cheap_name', [this.registered.userName]).then(res => {
            console.log('res', res)
            if (res) {
              this.showPayAccount = false
            } else {
              this.showPayAccount = true
            }
          })
          this.registered.userName = this.registered.userName.toLocaleLowerCase()
          ZOSInstance.getPrettyNameFee(this.registered.userName).then(res => {
            let fee = res[0]
            this.registered.payAmount = parseInt(fee.amount) / Math.pow(10, fee.precision)
            this.registered.paySymbol = fee.symbol
          })
        })
      },
      loadVerifyingImg () {
        http.fetchGet(this.$store.state.settingsAPIs.DEFAULT_FAUCET + '/getcaptcha')
          .then((res) => {
            this.captchaId = res.captchaid
            this.verifyimgData = 'data:image/png;base64, ' + res.img
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // 注册前清空缓存,因为发现同一个浏览器，登录两个账号，数据同步了
      removeLocal () {
        this.login = false
        removeStore('userName')
        removeStore('userId')
      }
    },
    mounted () {
      this.getUrl()
      this.registered.userPwd = ZOSInstance.get_random_password()
      if (this.$store.state.initFinished) {
        this.loadVerifyingImg()
        this.removeLocal()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.loadVerifyingImg()
          this.removeLocal()
        })
      }
    },
    components: {
      YFooter,
      YButton,
      YHeader
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
  }
}
.v2 .dialog {
  width: 450px;
  border: 1px solid #dadada;
  .title {
    background: linear-gradient(#fff, #f5f5f5);
    height: auto;
    overflow: visible;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    position: relative;
    background-image: url(/static/images/smartisan_4ada7fecea.png);
    background-size: 140px;
    background-position: top center;
    background-repeat: no-repeat;
    height: 92px;
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
    width: 436px;
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
    border-right: 1px solid #ccc;
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
    word-break: break-all;
    word-wrap: break-word;
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

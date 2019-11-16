<template>
  <div slot="content" v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div v-show="!loading">
        <h1 class="f16">
          <!--基本信息-->
          {{$t('m.account.basic.title')}}
        </h1>
        <div class="line" style="margin: 15px 0"></div>
        <ul class="basicinfos">
          <!--用户名-->
          <li><span>{{$t('m.information.username')}}:</span> {{userName}}</li>
          <li>
            <span>{{$t('m.information.phone')}}:</span>
            <span v-if="infos.phone">
              {{infos.phone | desensitization}}
            </span>
            <!--<span v-else>{{$t('m.information.noBind')}}</span>-->
            <a @click="$store.state.userDataSid ? popupOpen=true : userPassword = true" :style="phone?{'margin-left': '50px'}: ''">{{phone ? $t('m.information.updatePhone') : $t('m.information.bind')}}</a>
          </li>
          <li>
            <span>{{$t('m.information.mail')}}:</span>
            <span v-if="infos.mail">
              {{infos.mail | desensitizationm}}
            </span>
            <!--<span v-else>{{$t('m.information.noBind')}}</span>-->
            <a @click="popupsOpen = true" :style="infos.mail?{'margin-left': '50px'}: ''">{{infos.mail ? $t('m.information.reBindEmail') : $t('m.information.bindEmail')}}</a>
          </li>
          <!--注册人-->
          <li><span>{{$t('m.information.regName')}}:</span> {{registrant}}</li>
          <!--推荐人-->
          <li><span>{{$t('m.information.referees')}}:</span> {{referees}}</li>
          <li>
            <!--优惠券-->
            <span>{{$t('m.information.coupons')}}:</span> {{$store.state.coupon.amountstr}} ZOS
            <!--领取-->
            <y-button :text="$t('m.information.get')"
                      class="margin-l20 main-btn"
                      v-show="$store.state.coupon.canReceiveCoupon"
                    @btnClick="receiveCoupon"
            ></y-button>
            <!--本月已领取-->
            <!--<span style="color: #ccc; font-size: 14px;" class="margin-l20" v-if="!$store.state.coupon.canReceiveCoupon">{{$t('m.information.geted')}}</span>-->
            <a @click="couponVisibleAbout=true" class="margin-l20">
              <!--了解优惠券-->
              {{$t('m.transfer.understandCoupons')}}
            </a>

          </li>
          <li>
            <a @click="popupPWOpen=true">
              <!--修改登录密码-->
              {{$t('m.information.updatePass')}}
            </a>
            <!--<a @click="popupCodeOpen=true">生成账户二维码</a>-->
          </li>
        </ul>
      <coupon-dialog @couponClose="couponClose" :visible="couponVisibleAbout"></coupon-dialog>
      <!--用户数据中心登录-->
      <!-- login-user-center :visible="userPassword" @close='confirmClose' @success="userCenter"></login-user-center -->
      <!--修改登录密码-->
      <el-dialog
        :title="$t('m.information.updatePass')"
        :visible.sync="popupPWOpen"
        width="40%"
        :before-close="handleClose"
      >
        <el-form :model="passwordForm"
                 status-icon :rules="passwordRules"
                 ref="passwordForm"
                 :label-position="labelPosition"
                 label-width="100px"
                 class="demo-ruleForm"
                 v-loading="loadingPass"
                 :element-loading-text="$t('m.loading')">
          <!--当前密码-->
          <el-form-item :label="$t('m.information.currentPw')" prop="passOld">
            <el-input type="password" v-model="passwordForm.passOld" auto-complete="off"></el-input>
          </el-form-item>
          <!--新密码-->
          <el-form-item :label="$t('m.information.newPw')" prop="pass">
            <el-input type="text" v-model="passwordForm.pass" auto-complete="off" style="width: 78%"></el-input>
            <el-button style="width: 20%; float: right" v-clipboard:copy="passwordForm.pass" v-clipboard:success="onCopy" v-clipboard:error="onError">
              <!--复制-->
             {{$t('m.information.copy')}}
            </el-button>
          </el-form-item>
          <!--重新输入生成的密码-->
          <el-form-item :label="$t('m.information.generated')" prop="checkPass">
            <el-input type="password" v-model="passwordForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <ul style="line-height: 24px">
              <li class="feezos margin-t10">
                <!--燃料费-->
                <!--(约)-->
                <div>{{$t('m.fuelCost')}}: ZOS {{passwordForm.feeZos}} {{$t('m.transfer.about')}}</div>
                <div style="flex:1"></div>
                <!--可用数量-->
                <!--获得-->
                <div>{{$t('m.transfer.KYSL')}}: {{passwordForm.zos_balance}} <a @click="zosDialog=true">{{$t('m.transfer.get')}}ZOS</a></div>
              </li>
              <li class="feezos margin-b20">
                <!--系统将优先使用优惠券抵扣-->
                <div class="pull-left gray">{{$t('m.transfer.useCoupons')}}</div>
                <div style="flex:1"></div>
                <!--优惠券数量-->
                <div class="pull-left margin-l10">{{$t('m.transfer.couponsNum')}} {{$store.state.coupon.amountstr}} ZOS <a @click="couponVisibleAbout=true">
                  <!--查看优惠券-->
                  {{$t('m.borrow.viewCoupon')}}
                </a></div>
              </li>
              <li>
                <el-checkbox v-model="passwordForm.agreement">
                  <!--我理解如果我忘记或丢失了密码，没有任何人能帮我恢复-->
                  {{$t('m.register.noRecover')}}
                </el-checkbox>
                <div><el-checkbox v-model="passwordForm.agreement1">
                  <!--我已妥善保管了我的用户名和密码-->
                  {{$t('m.register.safekeeping')}}
                </el-checkbox></div>
                <span class="gray">
                  <!--修改密码账户私钥会发生变化，请做好私钥备份-->
                {{$t('m.information.backup')}}
                </span>
              </li>
            </ul>
            <!--获得ZOS-->
            <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
          </el-form-item>
          <el-form-item>
            <p class="text-right margin-t10">
              <!--重置-->
              <y-button :text="$t('m.information.reset')"
                        @btnClick="resetForm('passwordForm')"
              ></y-button>
              <y-button :text="$t('m.sure')"
                        :classStyle="passwordForm.passOld && passwordForm.pass && passwordForm.checkPass && passwordForm.agreement && passwordForm.agreement1 ? 'main-btn' : 'disabled-btn'"
                        @btnClick="submitForm('passwordForm')"
              ></y-button>
            </p>
          </el-form-item>
        </el-form>
      </el-dialog>


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
      <!--修改邮箱-->
      <el-dialog
        :title="$t('m.information.mail')"
        :visible.sync="popupsOpen"
        width="35%"
        :before-close="handleClose"
      >
        <el-form :model="mForms" status-icon ref="mForms" label-width="100px" class="demo-ruleForm"
                 :element-loading-text="$t('m.loading')"
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
        <!--生成二维码-->
        <y-popup :open="popupCodeOpen" @close='popupCodeOpen=false' :title="popupTitle">
          <div slot="content">
            <el-form :model="mForm" status-icon :rules="mRules" ref="mForm" label-width="100px" class="demo-ruleForm">
              <!--手机号-->
              <el-form-item :label="$t('m.information.phone')" prop="phone">
                <el-input type="text" v-model="mForm.phone" auto-complete="off"></el-input>
              </el-form-item>
              <!--验证码-->
              <el-form-item :label="$t('m.register.vaCode')" prop="keycode">
                <el-input type="password" v-model="mForm.keycode" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('mForm')">
                  <!--提交-->
                  {{$t('m.params.submit')}}
                </el-button>
                <el-button @click="resetForm('mForm')">
                  <!--重置-->
                  {{$t('m.information.reset')}}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </y-popup>
      <!--输入资金密码-->

      <!--领取优惠-->
      <!--领取优惠券-->
      <el-dialog
        :title="$t('m.information.getCoupon')"
        :visible.sync="couponVisible"
        width="30%"
      >
        <p>{{couponStatus}}</p>
        <span slot="footer" class="dialog-footer">

            <y-button :text="$t('m.sure')" @btnClick="couponVisible = false;" class="main-btn"></y-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  // import loginUserCenter from '@/components/LoginUserCenter'
  import loginUser from '/path-components/Login/passwordLogin'
  import YButton from '/path-components/element/YButton'
  import { getSmsCode, checkSmsCode } from '/js-api/index'
  import YShelf from '/path-components/element/shelf'
  import vueCropper from 'vue-cropper'
  import YPopup from '/path-components/element/popup'
  import {ZOSInstance} from 'zos-wallet-js'
  import couponDialog from '/path-components/Chain/couponDialog'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import { ChainStore, ChainValidation } from 'zosjs/es'
  export default {
    components: {
      couponDialog,
      YButton,
      YShelf,
      vueCropper,
      YPopup,
      passwordDialog,
      getzosdialog,
      // loginUserCenter,
      loginUser
    },
    data () {
      const validatePassOld = (rule, value, callback) => {
        if (value === '') {
          // '请输入密码'
          callback(new Error(this.$t('m.inputPassword')))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          // '请输入密码'
          callback(new Error(this.$t('m.inputPassword')))
        } else if (this.validatePassword(value) !== null) {
          callback(new Error(this.passerror))
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('checkPass')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          // '请再次输入密码'
          callback(new Error(this.$t('m.information.againInput')))
        } else if (value !== this.passwordForm.pass) {
          // '两次输入密码不一致!'
          callback(new Error(this.$t('m.information.notMatch')))
        } else {
          callback()
        }
      }
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
        loadingPass: false,
        loadingPhone: false,
        zosDialog: false,
        // 复制成功的弹窗
        copyDialog: false,
        // 手机号码
        bindPhoneed: false,
        // 发短信验证码按钮是否高亮
        validDis: false,
        // 短信验证码 '重新发验证码
        labelText: this.$t('m.information.send'),
        // isShowSms是否显示
        isShowSms: true,
        // 手机验证码
        mSms: '',
        imgSrc: '',
        editAvatarShow: false,
        cropContext: '',
        cropperImg: '',
        previews: {},
        // 优惠窗口
        couponVisible: false,
        couponVisibleAbout: false,
        couponStatus: '',
        option: {
          img: '',
          zoom: 0
        },
        // 修改密码
        popupPWOpen: false,
        // '修改密码'
        popupPWTitle: this.$t('m.information.updatePw'),
        popupOpen: false,
        popupsOpen: false,
        // '修改资金密码
        popupTitle: this.$t('m.information.updateAsset'),
        labelPosition: 'top',
        passerror: null,
        passwordForm: {
          passOld: '',
          pass: '',
          checkPass: '',
          feeZos: '',
          zos_balance: '',
          agreement: '',
          agreement1: ''
        },
        passwordRules: {
          passOld: [
            { validator: validatePassOld, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        mForm: {
          phone: '',
          keyCode: '',
          phoneCode: '0086'
        },
        mForms: {
          mail: ''
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
        fixedNumber: [1, 1],
        example2: {
          info: true,
          size: 1,
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 300,
          autoCropHeight: 250,
          // 开启宽度和高度比例
          fixed: true
        },
        userId: '',
        token: '',
        comfirmPassword: false,
        userPassword: false,
        loading: true,
        password: '',
        // 用户信息
        userName: this.$store.state.userName,
        nationality: '',
        regphone: '',
        regTime: '',
        registrant: '',
        referees: '',
        userInfo: {},
        infos: {},
        loadingMail: false,
        loginUserVis: false,
        operation: 0
      }
    },
    computed: {
      // 邀请地址
      chargeAdrress () {
        const userId = this.$store.state.userDataSid
        return `${window.location.host}/#/register/${userId}`
      }
    },
    watch: {
      'popupOpen': {
        handler: function (val) {
          if (val === false) {
            this.resetForm('mForm')
          }
        },
        deep: true
      },
      'popupPWOpen': {
        handler: function (val) {
          if (val === false) {
            this.resetForm('passwordForm')
          }
        },
        deep: true
      },
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
    filters: {
      // 手机号脱敏
      desensitization: val => {
        if (val === undefined || val.length < 4) return val
        const phoneNum = val.replace(/^(\d{3})\d+(\d{5})$/, '$1****$2')
        return phoneNum
      },
      // 邮箱脱敏
      desensitizationm: val => {
        if (val === undefined || val.length < 4) return val
        let vals = val.toString()
        let ruten = vals.substring(2, 7)
        return vals.replace(ruten, '*****')
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
      validatePassword (value) {
        let errorstr = null
        if (value === '') {
          errorstr = this.$t('m.register.name_input.empty')
        } else {
          let localePaths = ChainValidation.is_password_error(value)
          if (localePaths) {
            // console.log('error name', localePaths)
            let localePath = localePaths.split('.')
            if (localePath.length === 2) {
              errorstr = this.$t('m.register.name_input.' + localePath[0])
              errorstr += this.$t('m.register.name_input.' + localePath[1])
            } else {
              errorstr = localePaths
            }
          }
        }
        this.passerror = errorstr
        return errorstr
      },
      handleClosePhone () {
        this.popupOpen = false
      },
      message (m) {
        this.$message(m)
      },
      messageSuccess (m) {
        this.$message({
          message: m,
          type: 'success'
        })
      },
      messageFail (m) {
        this.$message.error({
          message: m
        })
      },
      // 关闭用户中心输入密码
      confirmClose () {
        this.userPassword = false
      },
      closeLogin (bool) {
        this.loginUserVis = false
        if (bool) {
          this.popupsOpen = true
        }
      },
      onCopy: function (e) {
        this.$message({
          // '复制成功'
          message: this.$t('m.copySuccess'),
          type: 'success'
        })
      },
      onError: function (e) {
        // '复制失败！
        console.log('复制失败！')
      },
      // 获得预计手续费
      feeGet () {
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'account_update')
          .then((res) => {
            this.passwordForm.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.passwordForm.zos_balance = res.zos_balance / Math.pow(10, res.precision)
          })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
          })
      },
      // 获得ZOS的弹窗
      isVisible () {
        this.zosDialog = false
      },
      couponClose () {
        this.couponVisibleAbout = false
      },
      //  获得用户的密码
      updatePassWord () {
        let isTrue = ZOSInstance.accountLogin(this.$store.state.userName, this.passwordForm.passOld)
        if (!isTrue) {
          this.$message({
            message: this.$t('m.information.errorPwd'),
            type: 'error'
          })
          this.loadingPass = false
          return
        }
        ZOSInstance.set_chain_password(this.$store.state.userName, this.passwordForm.passOld, this.passwordForm.pass)
          .then(res => {
            console.log(res)
            return ZOSInstance.broadcastTransaction(res.tr)
          })
          .then(_ => {
            this.loadingPass = false
            // '修改成功'
            this.$message(this.$t('m.information.updateSucc'))
            this.popupPWOpen = false
            ZOSInstance.accountLoginout()
            this.$router.push({
              path: '/login'
            })
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: err,
              type: 'error'
            })
            this.loadingPass = false
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
            this.mForm.phoneCode = infos.zone
            this.$store.state.userInfo.phone = infos.mobile
          }
        })
      },
      // 获取用户信息,推荐人，注册人
      getAccount () {
        this.loading = true
        this.feeGet()
        ChainStore.setLoginAccount(this.$store.state.userDataSid)
        this.passwordForm.pass = ZOSInstance.get_random_password()
        ZOSInstance.get_user_baseinfo(this.$store.state.userDataSid).then((res) => {
          if (res) {
            this.registrant = res.registrar_name
            this.referees = res.referrer_name
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
      // 点击复制信息弹窗
      copyinfo () {
        let info = document.getElementById('charge-adrress')
        info.select()
        document.execCommand('Copy')// 复制必须放在点击函数里面的外层
        this.copyDialog = true
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
            this.operation = 1
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
            info: authorData,
            key: authorData
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
                }
              })
              .catch(err => {
                this.loadingMail = false
                console.log(err)
                this.$message({
                  type: 'warning',
                  message: err.toString()
                })
              })
          })
          .catch(err => {
            this.loadingMail = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err.toString()
            })
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
            info: authorData,
            key: authorData
          }
          return ZOSInstance.account_authenticate(this.$store.state.userDataSid, 9, params)
        })
          .then(ress => {
            ZOSInstance.broadcastTransaction(ress.tr)
              .then(res => {
                if (res) {
                  this.loadingPhone = false
                  this.popupOpen = false
                  this.$store.state.userInfo.phone = this.infos.phone = this.mForm.phone
                  this.infos.phoneCode = this.mForm.phoneCode
                  this.$message({
                    type: 'success',
                    // '提交成功'
                    message: this.$t('m.badloans.subSucc')
                  })
                }
              }).catch(err => {
                this.loadingPhone = false
                console.log(err)
                this.$message({
                  type: 'warning',
                  message: err.toString()
                })
              })
          }).catch(err => {
            this.loadingPhone = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err.toString()
            })
          })
      },
      editAvatar () {
        this.editAvatarShow = true
      },
      realTime (data) {
        this.previews = data
        let w = 100 / data.w
        this.option.zoom = w
      },
      // 获取优惠券
      bitlenderLendOrder (data) {
        if (this.operation === 0) {
          this.updatePhoneCall(data)
        } else if (this.operation === 1) {
          this.updateMailCall(data)
        } else if (this.operation === 2) {
          this.couponCallback(data)
        }
      },
      couponCallback (data) {
        // Ella
        let zosnum = (10 - this.$store.state.coupon.amount / 100000).toFixed(5)
        if (data) {
          // 领取优惠；不广播，返回Transaction
          ZOSInstance.account_coupon(this.$store.state.userDataSid)
            .then(res => {
              return ZOSInstance.broadcastTransaction(res.tr)
            })
            .then(result => {
              this.comfirmPassword = false
              if (result) {
                // 本月成功领取个
                this.couponStatus = `${this.$t('m.information.getSucc') + zosnum}ZOS,${this.$t('m.information.couponsTotal')}10.00000 ZOS!`
                this.couponVisible = true
                this.$store.state.coupon.canReceiveCoupon = false
                ChainStore.setLoginAccount(this.$store.state.userDataSid)
                ChainStore.notifySubscribers()
              }
            })
            .catch(err => {
              this.comfirmPassword = false
              this.couponStatus = err
              this.couponVisible = true
            })
        } else {
          this.comfirmPassword = false
        }
      },
      accountSubmit () {
        // this.loadings = true
        this.comfirmPassword = true
      },
      // 领取优惠券
      receiveCoupon () {
        this.comfirmPassword = true
        this.operation = 2
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loadingPass = true
            this.updatePassWord()
          } else {
            console.log('error submit!!')
            return false
          }
        })
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
  .basicinfos {
    padding: 0 0 0 50px;
    line-height: 40px;
  }
  .avatar-box {
    height: 124px;
    display: flex;
    margin: 0 30px 30px;
    border-bottom: #dadada solid 1px;
    line-height: 30px;
    display: flex;
    align-items: center;
    .img-box {
      @include wh(80px);
      border-radius: 5px;
      overflow: hidden;
    }
    img {
      display: block;
      @include wh(100%)
    }
    .r-box {
      margin-left: 20px;
      h3 {
        font-size: 18px;
        font-weight: 400;
        color: #333;
      }
    }
  }

  // 修改头像
  .edit-avatar {
    z-index: 9999;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include wh(100%);
    background-color: rgba(0, 0, 0, .5);
    @extend %block-center;
    .content {
      display: flex;
      padding: 45px 100px 0;
    }
    > div {
      box-sizing: content-box;
      @include wh(700px, 500px);
      margin: 0;
    }
    .btn {
      width: 80px;
      height: 30px;
      margin-left: 10px;
      position: relative;
      text-align: center;
      line-height: 30px;
      text-shadow: rgba(255, 255, 255, .496094) 0 1px 0;
      border: 1px solid #E6E6E6;
      border-radius: 10px;
      &:hover {
      }
      a {
        color: #666;
        display: block;
        @include wh(100%);
      }
    }
    input[type=file] {
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      opacity: 0;
      width: 80px;
      height: 30px;
      cursor: pointer;
      box-sizing: border-box;
      border: 15px solid #000;
      overflow: hidden;
    }
    .edit-l {
      width: 100px;
      text-align: center;
    }
    .edit-r {
      margin-left: 20px;
      flex: 1;
      > div {
        border: 1px solid #ccc;
        width: 320px;
        height: 320px;
      }
    }
  }

  .image-container {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
  }

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

  .big {
    display: block;
    width: 320px;
    height: 320px;
  }

  .bootom-btn {
    padding: 0 15px;
    border-top: 1px solid #E6E6E6;
    bottom: 0;
    height: 60px;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

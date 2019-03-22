<template>
  <div>
    <el-dialog
      :title="$t('m.information.updatePhone')"
      :visible.sync="popupOpen"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :model="mForm" status-icon :rules="mRules" ref="mForm" label-width="100px" class="demo-ruleForm"
               v-loading="loading"
               :element-loading-text="$t('m.loading')">
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
          <y-button :text="labelText"
                    class="fr"
                    :classStyle="'main-btn'"
                    @btnClick="getCode"
          ></y-button>
          <!--:classStyle="validDis && isShowSms ? 'main-btn' : 'disabled-btn'"-->
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
    <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder" :append="true"></password-dialog>
  </div>
</template>
<script>
  import { FetchChain } from 'zosjs/es'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    props: {
      popupOpen: {
        default: false,
        type: Boolean
      }
    },
    data () {
      // 请输入手机号
      const phone = (rule, value, callback) => {
        if (value === '') {
          // '请输入手机号'
          callback(new Error(this.$t('m.information.inputPhone')))
        } else if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value)) {
          callback(this.$t('m.bankcard.idNumFormat'))
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
        code: [
          {name: this.$t('m.information.china'), code: '0086'},
          {name: this.$t('m.information.cad'), code: '001'}
        ],
        mForm: {
          phone: '',
          keyCode: '',
          phoneCode: ''
        },
        mRules: {
          phone: [
            { validator: phone, trigger: 'blur' }
          ],
          keyCode: [
            { validator: keyCodeVa, trigger: 'blur' }
          ]
        },
        // 发短信验证码按钮是否高亮
        validDis: false,
        // 短信验证码 '重新发验证码
        labelText: this.$t('m.information.send'),
        // isShowSms是否显示
        isShowSms: true,
        // 手机验证码
        mSms: '',
        loading: false,
        comfirmPassword: false
      }
    },
    methods: {
      init () {
        FetchChain('getAccount', this.$store.state.userDataSid, 5000).then(res => {
          console.log(res)
          this.decodeUserInfo()
        })
      },
      // 解userInfo
      decodeUserInfo () {
        ZOSInstance.get_decode_memo(this.$store.state.userDataSid, this.userInfo).then(info => {
          if (!info) {
            this.userPassword = true
          } else {
            console.log('解密后:', info)
            let infos = JSON.parse(info)
            this.phone = infos.phone
            this.$store.state.userInfo.phone = this.phone
          }
        })
      },
      handleClose () {
        this.popupOpen = false
        this.$emit('_bindPhone', false)
      }
    }
  }
</script>
<style>

</style>

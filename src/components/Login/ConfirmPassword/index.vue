<template>
    <div>
      <el-dialog
        :title="$t('m.inputPassword')"
        @close="close"
        :visible.sync="visible"
        width="30%"
        :before-close="handleClose">
        <div v-loading="loading" :element-loading-text="$t('m.transfer.being')" style="min-height: 4vw;">
          <!--为了确保资金安全，请输入密码-->
          <span>{{$t('m.investDetails.inputPass')}}</span>
          <el-input type="password" v-model="password" ></el-input>
          <div style="font-size: 12px;color: red" v-show="passwordValid">{{message}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close(); password=''">{{$t('m.cancel')}}</el-button>
          <el-button type="primary" @click="accountSubmit">{{$t('m.sure')}}</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import {ZOSInstance} from 'zos-wallet-js'
export default {
  props: {
    // 显示该控件与否
    visible: {
      type: Boolean,
      'default': true
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
      setTimeout(() => {
        this.$emit('close')
      }, 200)
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
          this.loading = false
          this.passwordValid = false
          this.$emit('success')
        } else {
          // '输入密码错误'
          this.message = this.$t('m.invest.passwordErr')
          this.loading = false
          this.passwordValid = true
        }
      }
    }
  },
  created () {
  }
}
</script>

<style>
</style>

<template>
  <el-dialog
    :title="$t('m.inputPassword')"
    :visible.sync="visible"
    width="30%"
    @close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="isAppend"
  >
    <div v-loading="loading" :element-loading-text="$t('m.transfer.being')">
      <div v-show="!loading">
        <!--为了确保资金安全，请输入密码-->
        <span>{{$t('m.investDetails.inputPass')}}</span>
        <el-input v-model="password" type="password"  autocomplete="off" ></el-input>
        <p class="text-right margin-t10">
          <y-button :text="$t('m.cancel')"
                    @btnClick="$emit('bitlenderLendOrder', false)"
          ></y-button>
          <y-button :text="$t('m.sure')"
                    :classStyle="password ? 'main-btn' : 'disabled-btn'"
                    @btnClick="accountSubmit()"
          ></y-button>
        </p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import YButton from '/path-components/element/YButton'
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
    components: { YButton },
    data () {
      return {
        loading: false,
        password: ''
      }
    },
    watch: {
      visible: {
        handler: function (val, oldVal) {
          if (val === false) {
            this.password = ''
            this.loading = false
          }
        },
        deep: true
      }
    },
    methods: {
      // 关闭dialog
      close () {
        this.$emit('bitlenderLendOrder', false)
      },
      // 确定
      accountSubmit () {
        this.loading = true
        let ifTrue = ZOSInstance.accountLogin(this.$store.state.userName, this.password)
        if (ifTrue) {
          this.$emit('bitlenderLendOrder', ifTrue)
          this.loading = false
        } else {
          // '密码错误!'
          this.$message(this.$t('m.invest.passwordErr'))
          this.loading = false
        }
      }
    }
  }
</script>
<style scoped>

</style>

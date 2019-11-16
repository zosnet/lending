<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')" style="min-height: 8vw;" class="jyNVPQ1">
    <div>
      <sellinfo :visible="true"  @sellpairchange="sellpairchange"></sellinfo>
    </div>
    <!--输入资金密码-->
    <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
  </div>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  import {ZOSInstance} from 'zos-wallet-js'
  // import {getStore, setStore} from '/js-utils/storage'
  // import { MessageBox } from 'element-ui'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import sellinfo from '/path-page/Sell/sell/sellinfo.vue'
  import formatAssets from '/js-api/public'
  // import deepClone from '/js-utils/deepClone'
  // import {Apis} from 'zosjs-ws'
  export default {
    components: {
      YButton, passwordDialog, formatAssets, sellinfo},
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        // 主体加载
        mainloading: true,
        sellinfovisible: true,
        comfirmPassword: false
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      // 初始化币种，抵押物等
      init () {
      },
      sellpairchange (v) {
      },
      // 获得预计手续费和用户的ZOS资产
      feeGet () {
        ZOSInstance.getAboutFee(this.$store.state.userName, '1.3.0', 'bitlender_lend_order')
          .then((res) => {
            this.ruleForm.feeZos = res.feeAmount.amount / Math.pow(10, res.feeAmount.precision)
            this.ruleForm.zos_balance = res.fee_balance / Math.pow(10, res.precision)
            formatAssets.updateAssets(res.symbol, res.fee_balance)
          })
          .catch((error) => {
            console.log(error)
            this.$message({
              message: error,
              type: 'error'
            })
          })
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      this.mainloading = false
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
</style>

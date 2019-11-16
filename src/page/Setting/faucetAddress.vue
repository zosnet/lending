<template>
  <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <h1 class="f16">{{$t('m.set.faucetAddress')}}</h1>
    <h2>{{$t('m.set.faucetUse')}}</h2>
    <div class="line" style="margin: 15px 0"></div>
    <el-input type="text" v-model="faucetAddress" style="width: 40%" @blur="faucet"></el-input>
    <h2 class="err-url" v-show="errUrl">{{$t('m.set.faucetUrl')}}</h2>
  </div>
</template>

<script>
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {
    },
    data () {
      return {
        loading: true,
        faucetAddress: '',
        errUrl: false
      }
    },
    methods: {
      init () {
        this.faucetAddress = ZOSInstance.getFaucetAddress()
        this.loading = false
      },
      faucet () {
        if (!/^(http:\/\/|https:\/\/).*$/.test(this.faucetAddress)) {
          this.errUrl = true
          return
        }
        this.errUrl = false
        ZOSInstance.setFaucetAddress(this.faucetAddress)
      }
    },
    mounted () {
      // 组件创建完成，属性已绑定，但DOM还没有生成前就要loading,等请求完成后，再显示DOM
      this.loading = true
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
<style scoped lang="scss">
.err-url{
  color: #ff0000
}
</style>

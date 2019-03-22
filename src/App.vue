<template>
  <div id="app" v-loading.fullscreen.lock="mainloading" :element-loading-text="$t('m.loading')">
    <router-view class="main"></router-view>
    <!--网络初始化失败-->
    <el-dialog
      :title="$t('m.initErr')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <!--所有网络节点连接失败,请调整网络节点或者稍后尝试刷新。-->
      <span>{{$t('m.errInfo')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">{{$t('m.iUnderstand')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.css'
  export default {
    name: 'app',
    data () {
      return {
        dialogVisible: false,
        mainloading: true
      }
    },
    created () {
      this.$root.$on('initFinished', _ => {
        this.mainloading = false
      })
      this.$root.$on('initFail', (data) => {
        this.mainloading = false
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "/path-assets/style/index.scss";
  html, body, #app {
    height: 100%;
  }
</style>

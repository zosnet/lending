<template>
  <el-container class="app-container">
    <el-container>
      <el-header
        :style="{padding: 0}"
        height="auto"
      >
        <y-header></y-header>
      </el-header>
      <el-main
        :style="{'padding': '0px'}"
      >
        <router-view class="main"></router-view>
      </el-main>
      <el-footer height="auto"
                  :style="{padding: 0, flex: '0 0 auto'}">
        <y-footer></y-footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import YHeader from './header'
  import YFooter from './footer'
  export default {
    data () {
      return {}
    },
    computed: {
    },
    methods: {
    },
    components: {
      YHeader,
      YFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "/path-assets/style/mixin";

  .main {
    min-height: calc(100vh - 100px);
    overflow: hidden;
  }

  .app-container {
    position: relative;
    height: 100%;
    background: #f0f2f5;
  }
</style>

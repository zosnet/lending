<template>
  <div>
    <div class="wn margin-b10 secondary">
      <div class="nav-secondary">
        <router-link to="/balance/balances" class="dHMsll gTHKWe">
          <a @click="changePage(1)" class="dHMsll gTHKWe" >
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
              <!--我要借款-->
              <div class="bgdPDV">{{$t('m.zhang')}}</div>
            </div>
          </a>
        </router-link>
        <router-link to="/balance/balanceslist" class="dHMsll gTHKWe">
          <a @click="changePage(2)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
              <!--已发布的借款-->
              <div class="bgdPDV">{{$t('m.zhanglist')}}</div>
            </div>
          </a>
        </router-link>
        <router-link to="/balance/authors" class="dHMsll gTHKWe">
          <a @click="changePage(3)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
              <!--认证人-->
              <div class="bgdPDV">{{$t('m.params.author')}}</div>
            </div>
          </a>
        </router-link>
         <router-link to="/balance/withdrawlock" class="dHMsll gTHKWe">
          <a @click="changePage(4)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===4}">
              <!--提取锁定币-->
              <div class="bgdPDV">{{$t('m.withdrawlock')}}</div>
            </div>
          </a>
        </router-link>
        <router-link to="/balance/operationslist" class="dHMsll gTHKWe">
          <a @click="changePage(5)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===5}">
              <!--操作记录-->
              <div class="bgdPDV">{{$t('m.operlist')}}</div>
            </div>
          </a>
        </router-link>
      </div>
    </div>
    <div class="router-main">
      <router-view></router-view>
    </div>
  </div>

</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    data () {
      return {
        choosePage: 1
      }
    },
    computed: {
    },
    watch: {
      '$route.path': function (val, oldVal) {
        if (val !== oldVal) {
          this.getPage()
        }
      }
    },
    methods: {
      // 导航栏文字样式改变
      changePage (v) {
        let sLogin = !ZOSInstance.accountIsLoginout()
        this.$store.state.login = sLogin
        if (!sLogin) {
          return
        }
        this.choosePage = v
      },
      // 通过路由改变导航文字样式
      getPage () {
        if (this.$route.path === '/balance/balances') {
          this.changePage(1)
        } else if (this.$route.path === '/balance/balanceslist') {
          this.changePage(2)
        } else if (this.$route.path === '/balance/authors') {
          this.changePage(3)
        } else if (this.$route.path === '/balance/withdrawlock') {
          this.changePage(4)
        } else if (this.$route.path === '/balance/operationslist') {
          this.changePage(5)
        }
      }
    },
    mounted () {
      this.getPage()
    }
  }
</script>
<style scoped lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
  .el-card{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
  }
  .w {
    display: flex;
    z-index: 1;
    -webkit-box-direction: normal;
    -webkit-box-orient: horizontal;
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    border-bottom: 2px solid #e8e8e8;
    width: 100%;
    /*justify-content: space-between;*/
    .gTHKWe {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
    }

    .dHMsll:not(:first-child) {
      margin-left: 30px;
    }
    a {
      text-decoration: none;
      cursor: pointer;
      color: #0067c8;
      .rsdjt {
        position: relative;
        align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        padding-bottom: 17px;
        cursor: pointer;
        color: #7d95b6;
      }
      .lineBottom {
        padding-bottom: 15px;
        color: #0667d0;
        border-bottom: 2px solid #0667d0;
      }
      .ftDCsB {
        position: relative;
        -webkit-box-align: center;
        align-items: center;
        cursor: pointer;
        margin-right: 30px;
        color: rgb(6, 103, 208);
      }
      .ftDCsB::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0px;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid rgb(6, 103, 208);
      }
      .gTHKWe {
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;

      }
    }
  }
  .router-main{
    margin: 65px auto 0;
    max-width: 1170px;
  }
</style>

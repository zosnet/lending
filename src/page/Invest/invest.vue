<template>
  <div>
    <div class="w margin-b10 secondary">
      <div class="nav-secondary">
        <router-link to="/invest/investList" class="dHMsll gTHKWe">
          <a @click="changePage(1, 0)" class="dHMsll gTHKWe" >
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
              <!--我要投资-->
              <div class="bgdPDV">{{$t('m.invest.title')}}</div>
            </div>
          </a>
        </router-link>
        <a @click="loginDia('/invest/investingList')" class="dHMsll gTHKWe">
          <a @click="changePage(2)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
              <!--投资中-->
              <div class="bgdPDV">{{$t('m.investList.title')}}</div>
            </div>
          </a>
        </a>
        <a @click="loginDia('/invest/investsuccessList')" class="dHMsll gTHKWe">
          <a @click="changePage(3)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
              <!--投资成功-->
              <div class="bgdPDV">{{$t('m.invest.investSucc')}}</div>
            </div>
          </a>
        </a>
        <a @click="loginDia('/invest/badinvestList')" class="dHMsll gTHKWe">
          <a @click="changePage(4)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===4}">
              <!--投资历史-->
              <div class="bgdPDV">{{$t('m.badloan')}}</div>
            </div>
          </a>
        </a>
        <a @click="loginDia('/invest/historyInvestList')" class="dHMsll gTHKWe">
          <a @click="changePage(5)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===5}">
              <!--投资历史-->
              <div class="bgdPDV">{{$t('m.invest.history')}}</div>
            </div>
          </a>
        </a>
      </div>
    </div>
    <div class="jyNVPQ">
      <el-card>
        <div class="sales-card">
          <div class="account-content">
            <router-view></router-view>
          </div>
        </div>
      </el-card>
    </div>
    <!--登录-->
    <login-dialog :visible="$store.state.loginPath !== undefined"></login-dialog>
  </div>

</template>
<script>
  import loginDialog from '/path-page/Login/loginDialog'
  import { loginToPath } from '/js-utils/until'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {loginDialog},
    data () {
      return {
        choosePage: 1
      }
    },
    watch: {
      '$route.path': function (val, oldVal) {
        if (val !== oldVal) {
          this.getPage()
        }
      }
    },
    filters: {
      formatSum: sum => {
        return sum.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      },
      formatData: time => {
        return time.toString().replace('T', ' ')
      },
      formatProcess: process => {
        return Math.floor(process)
      }
    },
    methods: {
      loginDia (path) {
        var loginPath = {path: path}
        loginToPath(ZOSInstance, this, loginPath)
      },
      // 导航栏文字样式改变
      changePage (v, bool = 1) {
        let sLogin = !ZOSInstance.accountIsLoginout()
        this.$store.state.login = sLogin
        if (bool && !sLogin) {
          return
        }
        this.choosePage = v
      },
      // 通过路由改变导航文字样式
      getPage () {
        if (this.$route.path === '/invest/investList') {
          this.changePage(1)
        } else if (this.$route.path === '/invest/investingList' ||
        this.$route.path === '/invest/investingdetail' ||
        this.$route.path === '/history/investHis/investingList' ||
        this.$route.path === '/history/investHis/investingdetail'
        ) {
          this.changePage(2)
        } else if (this.$route.path === '/invest/investsuccessList' ||
        this.$route.path === '/invest/investsuccessdetail' ||
        this.$route.path === '/history/investHis/investsuccessList' ||
        this.$route.path === '/history/investHis/investsuccessdetail') {
          this.changePage(3)
        } else if (this.$route.path === '/invest/badinvestList' ||
        this.$route.path === '/invest/badinvestdetail' ||
        this.$route.path === '/history/investHis/badinvestList' ||
        this.$route.path === '/history/investHis/badinvestdetail') {
          this.changePage(4)
        } else if (this.$route.path === '/invest/historyInvestList' ||
          this.$route.path === '/invest/historyInvestdetail' ||
          this.$route.path === '/history/investHis/historyInvestList' ||
          this.$route.path === '/history/investHis/historyInvestdetail') {
          this.changePage(5)
        }
      }
    },
    mounted () {
      this.getPage()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "/path-assets/style/mixin";
  @import "/path-assets/style/theme";
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
      /*.rsdjt :hover {*/
      /*color: #f9c215;*/
      /*border-bottom: 1px solid #82848a;*/
      /*}*/
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
  .jyNVPQ{
    background: #fff!important;
  }
</style>

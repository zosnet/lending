<template>
  <div>
    <div class="w margin-b10 secondary">
      <div class="nav-secondary">

        <router-link to="/setting/accessSettings" class="dHMsll gTHKWe">
          <a @click="changePage(1, 0)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
              <div class="bgdPDV">
                <!--接入点-->
                {{$t('m.set.accessPoint')}}
              </div>
            </div>
          </a>
        </router-link>
        <router-link to="/setting/faucetAddress" class="dHMsll gTHKWe">
          <a @click="changePage(7, 0)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===7}">
              <div class="bgdPDV">
                <!--水龙头-->
                {{$t('m.set.faucetAddress')}}
              </div>
            </div>
          </a>
        </router-link>
        <router-link to="/setting/generalSetup" class="dHMsll gTHKWe">
          <a @click="changePage(4, 0)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===4}">
              <div class="bgdPDV">
                <!--接入点-->
                {{$t('m.set.setup')}}
              </div>
            </div>
          </a>
        </router-link>
        <router-link to="/setting/carrier" class="dHMsll gTHKWe">
          <a @click="changePage(8, 0)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===8}">
              <div class="bgdPDV">
                <!--运营商-->
                {{$t('m.params.operator')}}
              </div>
            </div>
          </a>
        </router-link>
        <a @click="loginDia('/setting/information')" class="dHMsll gTHKWe">
          <a @click="changePage(2)" class="dHMsll gTHKWe" >
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
              <!--账号信息-->
              <div class="bgdPDV">{{$t('m.set.accountInfo')}}</div>
            </div>
          </a>
        </a>
        <a @click="loginDia('/setting/permission')" class="dHMsll gTHKWe">
          <a @click="changePage(3)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
              <!--权限信息-->
              <div class="bgdPDV">{{$t('m.set.permission')}}</div>
            </div>
          </a>
        </a>
        <!-- <a @click="loginDia('/setting/support')" class="dHMsll gTHKWe">
          <a @click="changePage(3)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
              <支持信息>
              <div class="bgdPDV">{{$t('m.set.support')}}</div>
            </div>
          </a>
        </a> -->
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
  import {ZOSInstance} from 'zos-wallet-js'
  import { loginToPath } from '/js-utils/until'
  export default {
    components: {loginDialog},
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
        if (this.$route.path === '/setting/accessSettings') {
          this.changePage(1)
        } else if (this.$route.path === '/setting/information') {
          this.changePage(2)
        } else if (this.$route.path === '/setting/permission') {
          this.changePage(3)
        } else if (this.$route.path === '/setting/generalSetup') {
          this.changePage(4)
        // } else if (this.$route.path === '/setting/bankcard') {
        //   this.changePage(5)
        // } else if (this.$route.path === '/setting/addressList') {
        //   this.changePage(6)
        } else if (this.$route.path === '/setting/faucetAddress') {
          this.changePage(7)
        } else if (this.$route.path === '/setting/carrier' || this.$route.path.indexOf('/setting/carrier') === 0) {
          this.changePage(8)
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
</style>

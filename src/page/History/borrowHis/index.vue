<template>
  <div style="margin-top: 10px">
    <div class="w margin-b40">
          <router-link :to="{path:'/history/borrowHis/borrowingList',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(1)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
                <!--已发布的借款-->
                <div class="bgdPDV">{{$t('m.borrow.published')}}</div>
              </div>
            </a>
          </router-link>
          <router-link :to="{path:'/history/borrowHis/borrowsuccess',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(2)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
                <!--正在还款的借款-->
                <div class="bgdPDV">{{$t('m.borrowsuccess.tab_title_repayments')}}</div>
              </div>
            </a>
          </router-link>
          <router-link :to="{path:'/history/borrowHis/badloanList',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(3)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
                <!--不良资产-->
                <div class="bgdPDV">{{$t('m.badloan')}}</div>
              </div>
            </a>
          </router-link>
          <router-link :to="{path:'/history/borrowHis/historyloanList',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(4)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===4}">
                <!--借款历史-->
                <div class="bgdPDV">{{$t('m.borrow.history')}}</div>
              </div>
            </a>
          </router-link>
        </div>

        <div class="account-content">
          <slot>
            <div style="margin-top: -70px">
              <router-view></router-view>
            </div>
          </slot>

        </div>
  </div>
</template>
<script>
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
      },
      '$route': function () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.accountName = this.$store.state.accountName = this.$route.query.accName
          this.accountID = this.$store.state.accountId = this.$route.query.accID
          this.hasSearchAccount = true
        }
      }
    },
    methods: {
      // 导航栏文字样式改变
      changePage (v) {
        if (!this.$store.state.unRouterChange) {
          this.choosePage = v
        }
      },
      // 通过路由改变导航文字样式
      getPage () {
        if (this.$route.path === '/history/borrowHis/borrowingList' ||
          this.$route.path === '/history/borrowHis/borrowingdetail') {
          this.changePage(1)
        } else if (this.$route.path === '/history/borrowHis/borrowsuccess' ||
          this.$route.path === '/history/borrowHis/borrowsuccessdetail') {
          this.changePage(2)
        } else if (this.$route.path === '/history/borrowHis/badloanbadloanList' ||
          this.$route.path === '/history/borrowHis/badloandetails') {
          this.changePage(3)
        } else if (this.$route.path === '/history/borrowHis/historyloanList' ||
          this.$route.path === '/history/borrowHis/historyloandetail') {
          this.changePage(4)
        }
      }
    },
    mounted () {
      this.getPage()
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../theme/utils';
  @import '../../../theme/theme';
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

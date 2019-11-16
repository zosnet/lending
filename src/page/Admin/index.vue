<template>
  <div>
    <div class="wn margin-b10 secondary">
      <div class="nav-secondary">
        <router-link to="/admin/params" class="dHMsll gTHKWe">
          <a @click="changePage(1)" class="dHMsll gTHKWe" >
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
              <!--参数-->
              <div class="bgdPDV">{{$t('m.params.title')}}</div>
            </div>
          </a>
        </router-link>
        <router-link to="/admin/myProposalList" class="dHMsll gTHKWe">
          <a @click="changePage(2)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
              <!--提案-->
              <div class="bgdPDV">{{$t('m.proposal')}}</div>
            </div>
          </a>
        </router-link>
        <router-link :to="{path:'/admin/processBadLoanList',query: {type: 12}}" class="dHMsll gTHKWe">
          <a @click="changePage(3)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
              <!--不良资产(逾期)-->
              <div class="bgdPDV">{{$t('m.badloan_overdue')}}</div>
            </div>
          </a>
        </router-link>
        <router-link :to="{path:'/admin/processBadLoanList',query: {type: 15}}" class="dHMsll gTHKWe">
          <a @click="changePage(4)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===4}">
              <!--不良资产(平仓)-->
              <div class="bgdPDV">{{$t('m.badloan_selling')}}</div>
            </div>
          </a>
        </router-link>
        <router-link :to="{path:'/admin/carriers',query: {type: 15}}" class="dHMsll gTHKWe">
          <a @click="changePage(5)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===5}">
              <!--运营商参数-->
              <div class="bgdPDV">{{$t('m.carrerset')}}</div>
            </div>
          </a>
        </router-link>
         <router-link  v-if="(this.$store.state.loanMode & 0x04) > 0"  :to="{path:'/admin/locktoken',query: {type: 15}}" class="dHMsll gTHKWe">
          <a @click="changePage(6)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===6}">
              <!--运营商参数-->
              <div class="bgdPDV">{{$t('m.params.locktitle')}}</div>
            </div>
          </a>
        </router-link>
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
      '$route': function (val, oldVal) {
        if (val.name === 'processBadLoanList') {
          if (oldVal.name === 'processBadLoanList') {
            if (val.query.type !== oldVal.query.type) {
              this.getPage()
            }
          } else {
            this.getPage()
          }
        } else {
          if (val.path !== oldVal.path) {
            this.getPage()
          }
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
        if (this.$route.path === '/admin/params') {
          this.changePage(1)
        } else if (this.$route.path === '/admin/myProposalList') {
          this.changePage(2)
        } else if ((this.$route.path === '/admin/processBadLoanList' &&
            (this.$route.query.type === 12 || this.$route.query.type === '12')) || (this.$route.path === '/admin/adminBadLoanDetail' && (this.$route.query.type === 12 || this.$route.query.type === '12'))) {
          this.changePage(3)
        } else if ((this.$route.path === '/admin/processBadLoanList' && (this.$route.query.type === 15 || this.$route.query.type === '15')) || (this.$route.path === '/admin/adminBadLoanDetail' && (this.$route.query.type === 15 || this.$route.query.type === '15'))) {
          this.changePage(4)
        } else if (this.$route.path === '/admin/carriers') {
          this.changePage(5)
        } else if (this.$route.path === '/admin/locktoken') {
          this.changePage(6)
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

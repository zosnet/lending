<template>
  <div class="jvhNys">
    <el-card>
      <div class ="search-div">
        <span style="line-height: 40px">{{$t('m.historyinfo.searchAccount')}}</span>
        <el-input class ="search-input" v-model="accountName" @keyup.enter.native="search()" @keyup.native="accountName = accountName.replace(/[^\w\.\-\/]/ig,'');onNameChange()"/>
        <el-button @click = "search()">{{$t('m.historyinfo.search')}}</el-button>
      </div>
      <el-alert
        v-if="inputError"
        :title="inputErrorInfo"
        :closable="false"
        type="error"
        show-icon>
      </el-alert>
      <div class="sales-card" v-if="hasSearchAccount">
        <div class="w margin-b10">
          <router-link :to="{path:'/history/borrowHis',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(1)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
                <!--借款信息-->
                <div class="bgdPDV">{{$t('m.historyinfo.loanInfo')}}</div>
              </div>
            </a>
          </router-link>
          <router-link :to="{path:'/history/investHis',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(2)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
                <!--投资信息-->
                <div class="bgdPDV">{{$t('m.historyinfo.investInfo')}}</div>
              </div>
            </a>
          </router-link>

          <router-link :to="{path:'/history/lockHis',query: {accID: $store.state.accountId, accName: $store.state.accountName}}" class="dHMsll gTHKWe">
            <a @click="changePage(3)" class="dHMsll gTHKWe">
              <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===3}">
                <!--锁仓信息-->
                <div class="bgdPDV">{{$t('m.historyinfo.lockInfo')}}</div>
              </div>
            </a>
          </router-link>

        </div>

        <div class="account-content">
          <router-view></router-view>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {ChainStore} from 'zosjs/es'
  import {setStore} from '/js-utils/storage'
  export default {
    data () {
      return {
        choosePage: 1,
        accountID: '',
        accountName: '',
        inputError: false,
        inputErrorInfo: '',
        hasSearchAccount: false
      }
    },
    computed: {
    },
    beforeRouteLeave (to, from, next) {
      if (this.$store.state.accountName) {
        this.$store.state.accountName = ''
        this.$store.state.accountId = ''
        next()
      } else {
        next()
      }
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
        } else {
          if (this.$route.query.list || this.$route.query.item) {
            this.itemList = JSON.parse(decodeURIComponent(this.$route.query.list))
            this.accountName = this.$store.state.accountName = this.itemList.accName
            this.accountID = this.$store.state.accountId = this.itemList.accID
            this.hasSearchAccount = true
          } else {
            this.hasSearchAccount = false
          }
        }
      }
    },
    methods: {
      init () {
        if (this.$route.query.list) {
          this.itemList = JSON.parse(decodeURIComponent(this.$route.query.list))
          this.accountName = this.$store.state.accountName = this.$route.query.accName = this.itemList.accName
          this.accountID = this.$store.state.accountId = this.$route.query.accID = this.itemList.accID
        } else {
          this.accountName = this.$store.state.accountName = this.$route.query.accName
          this.accountID = this.$store.state.accountId = this.$route.query.accID
        }
        // if (getStore('searchAccount')) {
        //   this.accountName = getStore('searchAccount')
        //   this.accountID = getStore('searchAccountId')
        //   this.search()
        // }
        if (!this.accountName) {
          this.hasSearchAccount = false
        } else {
          this.hasSearchAccount = true
        }
      },
      onNameChange () {
        this.inputError = false
        this.inputErrorInfo = ''
        ChainStore.getAccount(this.accountName, true)
      },
      search () {
        if (!this.accountName) {
          this.inputError = true
          this.inputErrorInfo = this.$t('m.historyinfo.noEmpty')
          this.hasSearchAccount = false
          return
        }
        this.inputError = false
        this.inputErrorInfo = ''
        let acc = ChainStore.getAccount(this.accountName, true)
        if (!acc) {
          this.inputError = true
          this.inputErrorInfo = this.$t('m.historyinfo.noAccount')
          this.hasSearchAccount = false
          return
        }
        this.hasSearchAccount = true
        this.accountID = acc.get('id')
        this.$store.state.accountName = this.accountName
        this.$store.state.accountId = this.accountID
        this.$router.push({
          path: '/history/borrowHis',
          query: {
            accID: this.accountID,
            accName: this.accountName
          }
        })
        setStore('searchAccount', this.accountName)
        setStore('searchAccountId', this.accountID)
      },
      // 导航栏文字样式改变
      changePage (v) {
        if (!this.$store.state.unRouterChange) {
          this.choosePage = v
        }
      },
      // 通过路由改变导航文字样式
      getPage () {
        if (this.$route.path === '/history/borrowHis' ||
          this.$route.path === '/history/borrowHis/borrowingList' ||
          this.$route.path === '/history/borrowHis/borrowsuccess' ||
          this.$route.path === '/history/borrowHis/borrowingdetail' ||
          this.$route.path === '/history/borrowHis/borrowsuccessdetail' ||
          this.$route.path === '/history/borrowHis/historyloanList' ||
          this.$route.path === '/history/borrowHis/historyloandetail' ||
          this.$route.path === '/history/borrowHis/badloanList' ||
          this.$route.path === '/history/borrowHis/badloandetail'
        ) {
          this.changePage(1)
        } else if (this.$route.path === '/history/investHis' ||
          this.$route.path === '/history/investHis/investingList' ||
          this.$route.path === '/history/investHis/investingdetail' ||
          this.$route.path === '/history/investHis/investsuccessList' ||
          this.$route.path === '/history/investHis/investsuccessdetail' ||
          this.$route.path === '/history/investHis/historyInvestList' ||
          this.$route.path === '/history/investHis/investsuccessdetail' ||
          this.$route.path === '/history/investHis/historyInvestList' ||
          this.$route.path === '/history/investHis/historyInvestdetail' ||
          this.$route.path === '/history/investHis/badinvestList' ||
          this.$route.path === '/history/investHis/badinvestdetail'
        ) {
          this.changePage(2)
        } else if (this.$route.path === '/history/lockHis') {
          this.changePage(3)
        }
      }
    },
    mounted () {
      this.$root.$on('initFinished', (data) => {
        this.init()
      })
      this.getPage()
    },
    created () {
      if (this.$store.state.initFinished) {
        this.init()
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
  .search-div{
    display: flex;
    margin: 10px 10px 10px 10px;
  }
  .search-input{
    width: 30%;
    margin: 0 10px 0 10px;
  }
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


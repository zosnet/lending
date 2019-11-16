<template>
   <div class="w store-content" style="max-width: 1440px">
    <div v-loading="loading > 0" :element-loading-text="$t('m.loading')" class="wn margin-b10 ">
       <sellindex :visible="true" v-if="loading <= 0"></sellindex>
    </div>
   </div>
  <!-- <div  v-loading="loading > 0" :element-loading-text="$t('m.loading')" >
    <div class="wn margin-b10 secondary" v-if="loading <= 0">
       <div class="nav-secondary">
        <router-link to="/sell/summary" class="dHMsll gTHKWe">
          <a @click="changePage(1)" class="dHMsll gTHKWe" >
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===1}">
              <div class="bgdPDV">{{$t('m.sell.summary')}}</div>
            </div>
          </a>
        </router-link>
        <router-link to="/sell/sell" class="dHMsll gTHKWe">
          <a @click="changePage(2)" class="dHMsll gTHKWe">
            <div class="rsdjt gTHKWe Navbar__link" :class="{lineBottom:choosePage===2}">
              <div class="bgdPDV">{{$t('m.sell.sell')}}</div>
            </div>
          </a>
        </router-link>
      </div>
    </div>
     <div class="router-main">
      <router-view></router-view>
    </div>
  </div> -->
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import {setStore, getStore} from '/js-utils/storage'
  import {Apis} from 'zosjs-ws'
  import sellindex from '/path-page/Sell/sell.vue'
  export default {
    components: {
      sellindex
    },
    data () {
      return {
        loading: true,
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
      changePage (v) {
        let sLogin = !ZOSInstance.accountIsLoginout()
        this.$store.state.login = sLogin
        if (!sLogin && v !== 1) {
          return
        }
        this.choosePage = v
      },
      init () {
        this.loading = 1
        this._getSellAsset()
        this._getSellPair()
        this.loading--
      },
      _getSellAsset () {
        let bsave = false
        if (getStore('_getSellAsset')) bsave = true
        if (!bsave) this.loading++
        ZOSInstance.getAssetListByType(0x00000080)
          .then(res => {
            if (res) {
              setStore('_getSellAsset', res)
            }
            if (!bsave) this.loading--
          })
          .catch(err => {
            if (!bsave) this.loading--
            console.log(err)
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      },
      _getSellPair () {
        let bsave = false
        if (getStore('_getSellPair')) bsave = true
        if (!bsave) this.loading++
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['sellPair']]).then(res => {
          if (res && res[0]) {
            let sellPairData = JSON.parse(res[0])
            setStore('_getSellPair', sellPairData)
          }
          if (!bsave) this.loading--
        }).catch(err => {
          if (!bsave) this.loading--
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      getPage () {
        if (this.$route.path === '/sell/summary') {
          this.changePage(1)
        } else if (this.$route.path === '/sell/sell') {
          this.changePage(2)
        }
      }
    },
    mounted () {
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
      this.getPage()
    }
  }
</script>
<style scoped lang="scss">
  @import '../../theme/utils';
  @import '../../theme/theme';
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
    max-width: 1420px;
  }
</style>

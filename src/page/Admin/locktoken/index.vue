<template>
  <div slot="content" class="container-params" v-loading="loading > 0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="loading <= 0">
        <el-tabs  v-model="activeTabName" @tab-click="handleClick">
          <!-- 活期 -->
          <el-tab-pane :label="$t('m.locktoken.locktokendy')" name="first">
            <locktokendy ref="locktokendy"></locktokendy>
          </el-tab-pane>
          <!-- 定期 -->
          <el-tab-pane :label="$t('m.locktoken.locktokenfixed')" name="second">
            <locktokenfixed ref="locktokendfixed"></locktokenfixed>
          </el-tab-pane>
          <!-- 节点 -->
          <el-tab-pane :label="$t('m.locktoken.locktokennode')" name="third">
            <!-- <locktokendy ref="locktokendnode"> </locktokendy> -->
          </el-tab-pane>
        </el-tabs>
    </div>
     <!--确认离开此页面？-->
    <el-dialog
      :title="$t('m.borrow.note')"
      :visible.sync="confirmVisible"
      width="30%"
    >
      <span>{{confirmText}}</span>
      <span>{{$t('m.borrow.giveupSure')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isConfirm = false;confirmLeave()">{{$t('m.cancel')}}</el-button>
        <el-button type="primary" @click="isConfirm = true;confirmLeave()">{{$t('m.sure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getStore, setStore} from '/js-utils/storage'
  import {Apis} from 'zosjs-ws'
  import locktokendy from '/path-page/Admin/locktoken/index-dy.vue'
  import locktokenfixed from '/path-page/Admin/locktoken/index-fixed.vue'
  // import locktokennode from '/path-page/Admin/locktoken/index-dy.vue'
  export default {
    components: {locktokendy, locktokenfixed},
    data () {
      return {
        loading: 1,
        initDone: true,
        confirmVisible: false,
        isConfirm: false,
        nexts: -1,
        activeTabName: 'first'
      }
    },
    computed: {
    },
    // 修改了，离开时的提示
    // beforeRouteLeave (to, from, next) {
    //   if (this.loading > 0 || !this.initDone) return
    //   if (this.$store.state.userDataSid !== '') {
    //     if (!this.$refs.locktokendy.canLeave()) {
    //       this.confirmText = this.$t('m.locktoken.locktokendy')
    //       this.nexts = next
    //       this.confirmVisible = true
    //     // } else if (!this.$refs.locktokendfixed.canLeave()) {
    //     //   this.confirmText = this.$t('m.locktoken.locktokenfixed')
    //     //   this.nexts = next
    //     //   this.confirmVisible = true
    //     // } else if (!this.$refs.locktokendnode.canLeave()) {
    //     //   this.confirmText = this.$t('m.locktoken.locktokennode')
    //     //   this.nexts = next
    //     //   this.confirmVisible = true
    //     } else {
    //       next()
    //     }
    //   } else {
    //     next()
    //   }
    // },
    methods: {
      // 确认是否离开
      confirmLeave () {
        this.confirmVisible = false
        if (this.nexts === 1) {
          if (this.isConfirm) {
          }
          this.nexts = ''
        } else {
          if (this.isConfirm) {
            this.nexts()
          } else {
            this.nexts(false)
          }
        }
      },
      initData () {
        if (this.$store.state.accountObj === undefined || this.$store.state.accountObj.id !== this.$store.state.userDataSid) {
          this.loading++
          Apis.instance().db_api().exec('get_objects', [[this.$store.state.userDataSid]]).then(acc => {
            this.$store.state.accountObj = acc[0]
            this.loading--
          }).catch(errmessa => {
            this.loading--
            this.$message({
              message: errmessa,
              type: 'warning'
            })
          })
        }
        this.loading--
      }
    },
    destroyed () {
      setStore('locksetting', this.activeTabName)
    },
    mounted () {
      this.loading = 1
      this.activeTabName = getStore('locksetting') ? getStore('locksetting') : 'first'
      if (this.$store.state.initFinished) {
        this.initData()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.initData()
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-table .warning-row {
    color: #dedede
  }
  .el-table .warning {
    color: #000
  }
  .container-params {
    padding: 1px !important;
    background: #fff !important;
    border-radius: 4px !important;
    dl dd .showborder .el-input__inner{
      border: 1px solid #dcdfe6!important;
      background: #fff !important;
    }
    dl dd .el-input__inner{
      border: none !important;
      background: none !important;
    }
    dt, dd{
      padding: 0 10px;
    }
    dt{
      overflow: hidden;
    }
    .separ {
      border: 1px solid #dcdfe6; padding: 15px 5px; border-radius: 4px
    }
    .feeder .el-input__inner {
      border: 1px solid #dcdfe6!important;
      background: #fff !important;
    }
  }
  .feeder-dl dt,
  .feeder-dl dd {
    line-height: 40px;
  }
  .feeder-dl dd {
    margin-left: 10px;
  }
</style>

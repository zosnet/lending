<template>
<div class="footer">
  <!--<div class="feel footer-div">-->
    <!--<div>-->
      <!--&lt;!&ndash;智能金融开放平台&ndash;&gt;-->
      <!--{{$t('m.page.platform')}}-->
      <!--VERSION 1.1</div>-->
    <div v-if="$store.state.lang === '1' ? $store.state.copyRight : $store.state.copyRightEn">
      <!--智能金融开放平台-->
      {{$store.state.lang === '1' ? $store.state.copyRight : $store.state.copyRightEn}}
    </div>
    <ul style="margin-bottom: 0;" class="friend-link" v-if="$store.state.lang === '1' ? ($store.state.link && [...$store.state.link].length > 0) : ($store.state.linkEn && [...$store.state.linkEn].length > 0)" id="footer">
      <li
        v-for="(item, index) in ($store.state.lang === '1' ? $store.state.link : $store.state.linkEn)" :key="index">
        <a :href="item.url" target="_blank">{{item.name}}</a>
        <span class="margin-l10 margin-r10" v-if="index < linkLength-1">|</span>
      </li>
    </ul>
    <!--区块数据陈旧,请等待数据完成同步.-->
    <div v-show="!synced" class="active">{{$t('m.page.synchronization')}}</div>
    <div class="content-c1">
      <div class="flex-h" style="margin-right: 10px;">
        <div>
          <!--{{$t('m.set.currentlyNode')}}: -->
          <el-dropdown @command="clickNode">
                  <span >
                    <a style="text-decoration:underline;">{{currentNode.url}}</a>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in nodeList"
                      :key="item.id"
                      :command="item"
                    >
                    <span>{{item.symbol}}</span>
                    </el-dropdown-item>
                   </el-dropdown-menu>
          </el-dropdown>
         </div>
        <span class="margin-l20">|</span>
        <!--网络延迟-->
        <div class="margin-l20">{{$t('m.page.latency')}}: {{currentNodePing}}</div>
        <span class="margin-l20">|</span>
        <!--最新区块-->
        <div class="margin-l20">{{$t('m.page.latest')}}: {{block_height}}</div>
      </div>
      <div :class="{active: $store.state.connectionStatus === 'closed' || $store.state.connectionStatus === 'error'}">
        <img :src="$store.state.connectionStatus === 'closed' || $store.state.connectionStatus === 'error' ? '/static/images/no-link.png' : '/static/images/link.png'" width="18" height="18"/>
        {{$store.state.connectionStatus === 'closed' || $store.state.connectionStatus === 'error' ? $t('m.page.connection') : $t('m.page.connected')}}
      </div>
    </div>
  <!--</div>-->
</div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  // import { getTimezoneDate } from '/js-utils/until'
  import { ChainStore } from 'zosjs/es'
  export default {
    data () {
      return {
        synced: this.syncStatus(),
        syncFail: false,
        no_ws_connection: false,
        block_height: 0,
        block_height_: 0,
        currentNodePing: '',
        linkLength: 0,
        timename: undefined,
        nodeList: [],
        currentNode: ''
      }
    },
    filters: {
    },
    methods: {
      syncStatus () {
        let dynGlobalObject = ChainStore.getObject('2.1.0')
        if (dynGlobalObject) {
          let blockTime = dynGlobalObject.get('time')
          if (!/Z$/.test(blockTime)) {
            blockTime += 'Z'
          }
          this.$store.state.curDate = new Date(dynGlobalObject.get('time') + '+00:00')
          this.block_height = dynGlobalObject.get('head_block_number')
          this.currentNodePing = ZOSInstance.getCurrentNodePing()
          this.currentNode = ZOSInstance.getActiveNode()
          let bt = (new Date(blockTime).getTime() + ChainStore.getEstimatedChainTimeOffset()) / 1000
          let now = new Date().getTime() / 1000
          this.synced = Math.abs(now - bt) < 6
        } else {
          this.synced = false
        }
      },
      chainStoreSub () {
        if (this.$store.state.connectionStatus !== 'closed') {
          this.syncStatus()
          if (ChainStore.subscribed !== this.synced || ChainStore.subError) {
            let syncFail = ChainStore.subError && (ChainStore.subError.message === 'ChainStore sync error, please check your system clock')
            console.log('check your system clock')
            this.syncFail = syncFail
          }
        }
      },
      clickNode (v) {
        if (v.symbol !== this.currentNode.url) {
          ZOSInstance.activateNode(v.symbol, this.connectSucess)
        } else {
          this.getNodeList()
        }
      },
      callConnect () {
      },
      checkConnect () {
        if (this.block_height_ === this.block_height) {
          this.currentNode = ''
          this.synced = false
          this.$store.state.connectionStatus = 'closed'
          var defaultNodes = ZOSInstance.getNodelist()
          var ANode = {}
          var ping = 2000000000
          for (var index = 0; index < defaultNodes.length; index++) {
            if (defaultNodes[index].ping === undefined) defaultNodes[index].ping = 1000
            if (defaultNodes[index].ping < ping) {
              ANode = defaultNodes[index]
              ping = defaultNodes[index].ping
              defaultNodes[index].ping += 1000
              if (defaultNodes[index].ping > 2000000000) defaultNodes[index].ping = 100
            }
          }
          if (ping !== 2000000000) {
            ZOSInstance.activateNode(ANode.url, this.callConnect)
          }
        } else {
          this.block_height_ = this.block_height
        }
      },
      connectSucess () {
        this.getNodeList()
      },
      getNodeList () {
        this.nodeList = []
        let defaultNodes = ZOSInstance.getNodelist()
        defaultNodes.forEach((item, index) => {
          let add = {
            id: index,
            symbol: item.url
          }
          this.nodeList.push(add)
        })
      },
      init () {
        this.setListeners()
        this.getNodeList()
      },
      setListeners () {
        this.linkLength = (this.$store.state.lang === '1' ? this.$store.state.link : this.$store.state.linkEn).length
        ChainStore.subscribe(this.chainStoreSub)
        this.timename = setInterval(this.checkConnect, 30000)
      },
      closeListeners () {
        ChainStore.unsubscribe(this.chainStoreSub)
        clearInterval(this.timename)
      }

    },
    components: {
    },
    created () {
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
    },
    destroyed () {
      this.closeListeners()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

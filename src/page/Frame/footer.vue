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
      <div style="flex:1; display: flex; flex-direction: row; margin-right: 10px;">
        <div>
          <!--{{$t('m.set.currentlyNode')}}: -->
          {{currentNode.url}}</div>
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
  import { getTimezoneDate } from '/js-utils/until'
  import { ChainStore } from 'zosjs/es'
  export default {
    data () {
      return {
        synced: this.syncStatus(),
        syncFail: false,
        no_ws_connection: false,
        block_height: 0,
        currentNodePing: '',
        linkLength: 0,
        currentNode: ''
      }
    },
    filters: {
    },
    methods: {
      syncStatus () {
        let synced = false
        let dynGlobalObject = ChainStore.getObject('2.1.0')
        if (dynGlobalObject) {
          let blockTime = dynGlobalObject.get('time')
          if (!/Z$/.test(blockTime)) {
            blockTime += 'Z'
          }
          this.$store.state.curDate = new Date(getTimezoneDate(dynGlobalObject.get('time')) + '+00:00')
          this.block_height = dynGlobalObject.get('head_block_number')
          this.currentNodePing = ZOSInstance.getCurrentNodePing()
          this.currentNode = ZOSInstance.getActiveNode()

          let bt = (new Date(blockTime).getTime() + ChainStore.getEstimatedChainTimeOffset()) / 1000
          let now = new Date().getTime() / 1000
          synced = Math.abs(now - bt) < 6
        }
        return synced
      },
      chainStoreSub () {
        if (this.$store.state.connectionStatus !== 'closed') {
          let synced = this.syncStatus()
          if (synced !== this.synced) {
            this.synced = synced
          }
          if (ChainStore.subscribed !== this.synced || ChainStore.subError) {
            let syncFail = ChainStore.subError && (ChainStore.subError.message === 'ChainStore sync error, please check your system clock')
            console.log('check your system clock')
            this.syncFail = syncFail
          }
        }
      },
      setListeners () {
        this.linkLength = (this.$store.state.lang === '1' ? this.$store.state.link : this.$store.state.linkEn).length
        ChainStore.subscribe(this.chainStoreSub)
      }
    },
    components: {
    },
    beforeCreate () {
      this.$root.$on('RpcConnectionStatus', (data) => {
      })
    },
    created () {
      if (this.$store.state.initFinished) {
        this.setListeners()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.setListeners()
        })
      }
    },
    destroyed () {
      ChainStore.unsubscribe(this.chainStoreSub)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  
</style>

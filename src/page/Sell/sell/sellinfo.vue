<template>
    <div class="feel" v-loading="loading>0" :element-loading-text="$t('m.loading')" style="height: 20px;">
        <div class="flex-h">
          <span style="min-width: 540px;">
           <span class="margin-l10">{{$t('m.params.sellpair')}}:</span>
            <el-dropdown @command="typeGetFirst">
                  <span class="command" style="width: 200px;min-height: 30px">
                    <img :src="`/static/images/${firstSymbol.symbol}.png`" width="20" height="20" :onerror="errorImg01"/>
                    <span class="margin-l20">{{firstSymbol.symbol}}</span>
                    <span style="flex: 1"></span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="width: 200px;">
                    <el-dropdown-item
                      v-for="item in sellPairFirst"
                      :key="item.id"
                      :command="item"
                      class="margin-t10"
                    >
                      <img :src="`/static/images/${item.symbol}.png`" width="20" height="20" :onerror="errorImg01" />
                      <span class="margin-l20">{{item.symbol}}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
            </el-dropdown>
            <el-button type="mini"  @click="exchangePair"> <img src="/static/images/exchange.png" width="10" height="10"/></el-button>
            <el-dropdown @command="typeGetSecond">
                  <span class="command" style="width: 200px;min-height: 30px">
                    <img :src="`/static/images/${secondSymbol.symbol}.png`" width="20" height="20" :onerror="errorImg01"/>
                    <span class="margin-l20">{{secondSymbol.symbol}}</span>
                    <span style="flex: 1"></span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="width: 200px;">
                    <el-dropdown-item
                      v-for="item in sellPairSecond"
                      :key="item.id"
                      :command="item"
                      class="margin-t10"
                    >
                      <img :src="`/static/images/${item.symbol}.png`" width="20" height="20" :onerror="errorImg01" />
                      <span class="margin-l20">{{item.symbol}}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
            </el-dropdown>
            </span>
            <span class="flex-hw">
            <div>
            <span class="margin-l10">{{$t('m.sell.sellamount')}}:{{marketticker.base_volume | formatLegalCurrency2(this.firstSymbol.symbol, this.firstSymbol.precision)}}</span>
            <span class="margin-l10"> {{marketticker.quote_volume | formatLegalCurrency2(this.secondSymbol.symbol, this.secondSymbol.precision)}}</span>
            <span class="margin-l10">{{$t('m.sell.changepercent')}}:{{Number(marketticker.percent_change).toFixed(2)}}%</span>
            <span class="margin-l10">{{$t('m.sell.maxprice')}}:{{marketticker.highest_bid}}</span>
            <span class="margin-l10">{{$t('m.sell.minprice')}}:{{marketticker.lowest_ask}}</span>
            <span class="margin-l10">{{$t('m.sell.lastprice')}}:{{marketticker.latest}}</span>
            </div>   <div>
            <span class="margin-l10">24H {{$t('m.sell.sellamount')}}:{{market_volume.base_volume | formatLegalCurrency2(this.firstSymbol.symbol, this.firstSymbol.precision)}}</span>
            <span class="margin-l10"> {{market_volume.quote_volume  | formatLegalCurrency2(this.secondSymbol.symbol, this.secondSymbol.precision)}}</span>
            <span class="margin-l10">{{$t('m.sell.avgprice')}}:{{market_volume.avg_price}}</span>
            </div>
            </span>
          </div>
    </div>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  // import {ZOSInstance} from 'zos-wallet-js'
  import {getStore, setStore} from '/js-utils/storage'
  import deepClone from '/js-utils/deepClone'
  import {Apis} from 'zosjs-ws'
  export default {
    components: { YButton },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        sellPairData: [],
        sellPairFirst: [],
        sellPairSecond: [],
        sellAssetList: [],
        sellPairList: [],
        priceprecision: 5,
        subscribefirst: undefined,
        subscribesecond: undefined,
        firstSymbol: {id: undefined},
        secondSymbol: {id: undefined},
        firstSymbolId: undefined,
        secondSymbolId: undefined,
        marketticker: {},
        market_volume: {},
        needAuthor: true,
        loading: true
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      addPairDisabled () {
        if (this.firstSymbol === undefined || this.secondSymbol === undefined || this.firstSymbol.id === undefined || this.secondSymbol.id === undefined || this.firstSymbol.id === this.secondSymbol.id) {
          return true
        } else {
          return false
        }
      },
      getPricePrecision () {
        if (this.firstSymbol.precision > this.secondSymbol.precision) this.priceprecision = this.firstSymbol.precision
        else this.priceprecision = this.secondSymbol.precision
        if (this.priceprecision < 5) this.priceprecision = 5
      },
      initDef () {
        this.marketticker = {
          base: 'CNY',
          base_volume: '',
          highest_bid: '0',
          latest: '0',
          lowest_ask: '0',
          percent_change: '0',
          quote: 'USD',
          quote_volume: '',
          time: '2019-06-14T09:29:37'
        }
        this.market_volume = {
          base: 'CNY',
          base_volume: '',
          quote: 'USD',
          quote_volume: '',
          avg_price: 0,
          time: '2019-06-14T09:29:37'
        }
      },
      init () {
        this.initDef()
        this.loading = 1
        if (getStore('_getSellPair')) this.sellPairData = JSON.parse(getStore('_getSellPair'))
        if (getStore('_getSellAsset')) this.sellAssetList = JSON.parse(getStore('_getSellAsset'))
        if (getStore('firstSymbol')) this.firstSymbol = JSON.parse(getStore('firstSymbol'))
        if (getStore('secondSymbol')) this.secondSymbol = JSON.parse(getStore('secondSymbol'))
        this._getSellPairList()
        this._selChange()
        if (this.firstSymbol === undefined) this.firstSymbol = {id: undefined}
        if (this.secondSymbol === undefined) this.secondSymbol = {id: undefined}
        this.getPricePrecision()
        this._getSellPairInfo()
        console.log('sell info init')
        this.loading--
      },
      _needAuthor () {
        this.needAuthor = false
        this.sellPairData.forEach(item => {
          if ((item.first_id === this.firstSymbol.id && item.second_id === this.secondSymbol.id) ||
             (item.second_id === this.firstSymbol.id && item.first_id === this.secondSymbol.id)) {
            this.needAuthor = true
          }
        })
      },
      _selChange () {
        let data = {
          firstSymbol: this.firstSymbol,
          secondSymbol: this.secondSymbol,
          needAuthor: this.needAuthor
        }
        this.$emit('sellpairchange', data)
      },
      typeGetFirst (val) {
        if (this.firstSymbolId === val.id) return
        this.firstSymbolId = val.id
        this.firstSymbol = val
        this.getPricePrecision()
        this._getPairSecond()
        setStore('firstSymbol', this.firstSymbol)
        this.secondSymbolId = undefined
        this.typeGetSecond(this.secondSymbol)
      },
      typeGetSecond (val) {
        if (this.secondSymbolId === val.id) return
        this.secondSymbolId = val.id
        this.secondSymbol = val
        this.getPricePrecision()
        this._getSellPairInfo()
        setStore('secondSymbol', this.secondSymbol)
        this._needAuthor()
        this._subscribe(this.firstSymbol.id, this.secondSymbol.id)
        this._selChange()
      },
      _subInfo (a) {
        let removeLimitOrder = false
        let addLimitOrder = false
        let hasFill = false
        a.forEach(result => {
          result.forEach(notification => {
            if (typeof notification === 'string') {
              let split = notification.split('.')
              if (split.length >= 2 && split[1] === '7') {
                removeLimitOrder = true // 删除记录
              } else {
              }
            } else if (typeof notification === 'object') {
              addLimitOrder = true // 增加记录
            } else {
              if (notification.length === 2 && notification[0] && notification[0][0] === 4) {
                hasFill = true // 撮合记录
              }
            }
          })
        })
        console.log(removeLimitOrder, hasFill, addLimitOrder)
        let add = {
          removeLimitOrder: removeLimitOrder,
          addLimitOrder: addLimitOrder,
          hasFill: hasFill
        }
        if (hasFill) this._getSellPairInfo()
        this.$emit('subinfo', add)
      },
      _subscribe (base, quote) {
        this._unsubscribe()
        Apis.instance().db_api().exec('subscribe_to_market', [this._subInfo, base, quote]).then(res => {
          this.subscribefirst = base
          this.subscribesecond = quote
        }).catch(err => {
          console.log(err)
        })
      },
      _unsubscribe () {
        if (this.subscribefirst !== undefined && this.subscribesecond !== undefined) {
          Apis.instance().db_api().exec('unsubscribe_from_market', [this._subInfo, this.subscribefirst, this.subscribesecond]).then(res => {
            this.subscribefirst = undefined
            this.subscribesecond = undefined
          }).catch(err => {
            console.log(err)
          })
        }
      },
      _getSellPairInfo () {
        if (!this.addPairDisabled()) {
          Apis.instance().db_api().exec('get_ticker', [this.firstSymbol.symbol, this.secondSymbol.symbol]).then(res => {
            this.marketticker = res
            if (Number(this.marketticker.highest_bid) !== 0) this.marketticker.highest_bid = (0.1 / Number(this.marketticker.highest_bid)).toFixed(this.priceprecision)
            else this.marketticker.highest_bid = Number(this.marketticker.highest_bid).toFixed(this.priceprecision)
            if (Number(this.marketticker.lowest_ask) !== 0) this.marketticker.lowest_ask = (0.1 / Number(this.marketticker.lowest_ask)).toFixed(this.priceprecision)
            else this.marketticker.lowest_ask = Number(this.marketticker.lowest_ask).toFixed(this.priceprecision)
            if (Number(this.marketticker.latest) !== 0) this.marketticker.latest = (0.1 / Number(this.marketticker.latest)).toFixed(this.priceprecision)
            else this.marketticker.latest = Number(this.marketticker.latest).toFixed(this.priceprecision)
          })
          Apis.instance().db_api().exec('get_24_volume', [this.firstSymbol.symbol, this.secondSymbol.symbol]).then(res => {
            this.market_volume = res
            if (Number(this.market_volume.base_volume) === 0) this.market_volume.avg_price = Number(0).toFixed(this.priceprecision)
            else this.market_volume.avg_price = (Number(this.market_volume.quote_volume) / Number(this.market_volume.base_volume)).toFixed(this.priceprecision)
          })
        }
      },
      _getPairFirst () {
        let find = false
        this.sellPairFirst = []
        for (var n in this.sellPairList) {
          let assetsArr = this._getAsset(n)
          if (assetsArr && assetsArr.length === 1 && (assetsArr[0].uasset_property & 0x80) > 0) {
            this.sellPairFirst.push(assetsArr[0])
            if (this.firstSymbol.id === assetsArr[0].id) find = true
          }
        }
        if (!find) this.firstSymbol = this.sellPairFirst[0]
        if (this.firstSymbol === undefined) this.firstSymbol = {id: undefined}
      },
      _getAsset (valget) {
        return this.sellAssetList.filter((val) => {
          return valget === val.id
        })
      },
      _getPairSecond () {
        let findList = []
        this.sellPairSecond = []
        if (this.firstSymbol.id === undefined) return
        for (var n in this.sellPairList) {
          if (n === this.firstSymbol.id) {
            findList = this.sellPairList[n]
            break
          }
        }
        let find = false
        findList.forEach(item => {
          let assetsArr = this._getAsset(item)
          if (assetsArr && assetsArr.length === 1 && (assetsArr[0].uasset_property & 0x80) > 0) {
            this.sellPairSecond.push(assetsArr[0])
            if (this.secondSymbol.id === assetsArr[0].id) find = true
          }
        })
        if (!find) this.secondSymbol = this.sellPairSecond[0]
        if (this.secondSymbol === undefined) this.secondSymbol = {id: undefined}
      },
      _getList () {
        this._getPairFirst()
        this._getPairSecond()
        this._subscribe(this.firstSymbol.id, this.secondSymbol.id)
      },
      _getSellPairList () {
        this.sellPairList = {}
        if (this.sellPairData !== undefined && this.sellPairData !== null) {
          this.sellPairData.forEach(item => {
            this.sellPairList[item.first_id] = []
            this.sellPairList[item.second_id] = []
          })
          for (var n in this.sellPairList) {
            let List = {}
            this.sellPairData.forEach(item => {
              if (item.first_id === n) List[item.second_id] = []
              if (item.second_id === n) List[item.first_id] = []
            })
            for (var k in List) {
              this.sellPairList[n].push(k)
            }
          }
        }
        this._getList()
      },
      exchangePair () {
        this.loading = 1
        let exchange = deepClone(this.firstSymbol)
        this.firstSymbol = deepClone(this.secondSymbol)
        this.secondSymbol = deepClone(exchange)
        this._getList()
        setStore('firstSymbol', this.firstSymbol)
        setStore('secondSymbol', this.secondSymbol)
        this._getSellPairInfo()
        this._selChange()
        this.loading--
      }
    },
    destroyed () {
      this._unsubscribe()
    },
    mounted () {
      this.loading = true
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '../../../theme/utils';
  @import '../../../theme/theme';
  .command{
    padding: 1px 20px; display: flex; flex: 1; flex-direction: row; align-items: center; border: 1px solid #d9dce1; border-radius: 3px
  }
</style>

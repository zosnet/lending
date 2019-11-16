<template>
  <dl>
    <!--发布时喂价-->
    <dd class="margin-t10">
      <!--orderFeed: '发布时喂价',-->
      {{$t('m.borrowing.orderFeed')}}: {{this.infoData.asset_to_collateralize.symbol + '/' + this.infoData.asset_to_loan.symbol }}
      {{orderPriceView}}
    </dd>
    <dd>
      <!--发布时价值:-->
      {{$t('m.borrowing.orderVal')}}:
      {{orderCost | formatLegalCurrency(infoData.asset_to_loan.symbol, infoData.asset_to_loan.precision)}}
    </dd>
    <dd>
      <!--发布时抵押倍数:-->
      {{$t('m.borrowing.orderRadio')}}:
      {{orderRate + $t('m.borrow.times')}}
    </dd>
    <div v-show="isFeed">
      <dd class="margin-t10">
        <!--当前喂价:-->
        {{$t('m.borrowing.currentFeed')}}: {{this.infoData.asset_to_collateralize.symbol + '/' + this.infoData.asset_to_loan.symbol }}
       {{currentPriceView}}
      </dd>
      <!--抵押物价值-->
      <dd>
        {{$t('m.borrowing.currentVal')}}:
        {{currentCost | formatLegalCurrency(infoData.asset_to_loan.symbol, infoData.asset_to_loan.precision)}}
      </dd>
      <dd>
        <!--当前抵押倍数:-->
        {{$t('m.borrowing.currentMortgage')}}:
        {{currentRate + $t('m.borrow.times')}}
      </dd>
    </div>
  </dl>
</template>
<script>
  import { LendInstance } from 'zos-wallet-js'
  export default {
    props: {
      infoData: {
        type: Object,
        defalut: ''
      },
      isFeed: {
        type: Boolean,
        defalut: true
      }
    },
    data () {
      return {
        currentPrice: 0,
        currentPriceView: 0,
        currentCost: 0,
        currentRate: 0,
        orderPrice: 0,
        orderPriceView: 0,
        orderCost: 0,
        orderRate: 0
      }
    },
    computed: {
      radio () {
        let collateralize = this.infoData.amount_to_collateralize.amount / Math.pow(10, this.infoData.asset_to_collateralize.precision)
        let loan = this.infoData.amount_to_loan.amount / Math.pow(10, this.infoData.asset_to_loan.precision)
        let getradio = loan * this.currentPrice
        return (collateralize / getradio).toFixed(3)
      }
    },
    methods: {
      _dealFeed () {
        this.currentPrice = LendInstance.calcFeedPrice(this.infoData.current_feed.settlement_price, this.infoData.asset_to_collateralize.id, this.infoData.asset_to_collateralize.precision, this.infoData.asset_to_loan.id, this.infoData.asset_to_loan.precision)
        this.orderPrice = LendInstance.calcFeedPrice(this.infoData.price_settlement.settlement_price, this.infoData.asset_to_collateralize.id, this.infoData.asset_to_collateralize.precision, this.infoData.asset_to_loan.id, this.infoData.asset_to_loan.precision)
        this.currentPriceView = LendInstance.calcFeedPriceView(this.infoData.current_feed.settlement_price, this.infoData.asset_to_collateralize.id, this.infoData.asset_to_collateralize.precision, this.infoData.asset_to_loan.id, this.infoData.asset_to_loan.precision)
        this.orderPriceView = LendInstance.calcFeedPriceView(this.infoData.price_settlement.settlement_price, this.infoData.asset_to_collateralize.id, this.infoData.asset_to_collateralize.precision, this.infoData.asset_to_loan.id, this.infoData.asset_to_loan.precision)
      },
      // 发布时抵押价值
      _dealCost () {
        this.currentCost = this.infoData.amount_to_collateralize.amount / (Math.pow(10, this.infoData.asset_to_collateralize.precision) * this.currentPrice)
        this.orderCost = this.infoData.amount_to_collateralize.amount / (Math.pow(10, this.infoData.asset_to_collateralize.precision) * this.orderPrice)
      },
      _dealRate () {
        if (this.infoData.amount_to_loan.asset_id === this.infoData.current_feed.settlement_price.base.asset_id) {
          this.currentRate = (this.infoData.amount_to_collateralize.amount * this.infoData.current_feed.settlement_price.base.amount) / (this.infoData.amount_to_loan.amount * this.infoData.current_feed.settlement_price.quote.amount)
        } else {
          this.currentRate = (this.infoData.amount_to_collateralize.amount * this.infoData.current_feed.settlement_price.base.amount) / (this.infoData.amount_to_loan.amount * this.infoData.current_feed.settlement_price.quote.amount)
        }
        this.currentRate = this.currentRate.toFixed(3)
        this.orderRate = (this.infoData.collateral_rate / 1000).toFixed(3)
      }
    },
    created () {
      this._dealFeed()
      this._dealCost()
      this._dealRate()
    }
  }
</script>
<style scoped>
dl dd{
  line-height: 30px;
}
</style>

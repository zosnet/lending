<template>
  <dl>
    <dt class="f14">{{$t('m.borrow.cost')}}</dt>
    <dd class="margin-t10">
      {{$t('m.borrow.service')}}: {{data.collateralizeFee | formatLegalCurrency(data.collateralizeFeeSymbol, data.collateralizeFeePrecision)}}
    </dd>
    <dd class="margin-t10">
      {{$t('m.borrow.risk')}}: {{data.riskFee | formatLegalCurrency(data.riskSymbol, data.riskPrecision)}}
    </dd>
    <dd class="margin-t10">
      {{$t('m.borrow.carrierServiceRate')}}: {{data.carrierFee | formatLegalCurrency(data.carrierFeeSymbol, data.carrierFeePrecision)}}
    </dd>
  </dl>
</template>
<script>
  export default {
    props: {
      data: {
        default: '',
        type: Object
      }
    },
    data () {
      return {
      }
    },
    methods: {
    },
    mounted () {
    }
  }
</script>
<style>

</style>

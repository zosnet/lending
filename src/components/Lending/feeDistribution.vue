<template>
  <!--费用分配-->
  <dl>
    <dt>{{$t('m.borrowsuccess.feeDistribution')}}</dt>
    <dd>
      {{$t('m.borrowsuccess.borrowRate')}}：{{(feeDistr.carrier_service_loan_carrier / Math.pow(10, feeDistr.loan_precision)) |
      formatLegalCurrency(feeDistr.loan_symbol, feeDistr.loan_precision)}}
    </dd>
    <dd class="margin-b10">
      {{$t('m.borrowsuccess.invesetRate')}}：{{(feeDistr.carrier_service_invest_carrier / Math.pow(10, feeDistr.loan_precision)) |
      formatLegalCurrency(feeDistr.loan_symbol, feeDistr.loan_precision)}}
    </dd>

    <dd>
      {{$t('m.borrowsuccess.borrowRate1')}}：{{(feeDistr.platform_service_loan_carrier / Math.pow(10, feeDistr.fee_precision)) |
      formatLegalCurrency(feeDistr.fee_symbol, feeDistr.fee_precision)}}
    </dd>
    <dd>
      {{$t('m.borrowsuccess.invesetRate1')}}：{{(feeDistr.platform_service_invest_carrier / Math.pow(10, feeDistr.fee_precision)) |
      formatLegalCurrency(feeDistr.fee_symbol, feeDistr.fee_precision)}}
    </dd>
    <dd>
      {{$t('m.borrowsuccess.borrowincome')}}：{{(feeDistr.platform_service_loan_refer / Math.pow(10, feeDistr.fee_precision)) |
      formatLegalCurrency(feeDistr.fee_symbol, feeDistr.fee_precision)}}
    </dd>
    <dd>
      {{$t('m.borrowsuccess.investincome')}}：{{(feeDistr.platform_service_invest_refer / Math.pow(10, feeDistr.fee_precision)) |
      formatLegalCurrency(feeDistr.fee_symbol, feeDistr.fee_precision)}}
    </dd>
    <dd>
      {{$t('m.borrowsuccess.getway')}}：{{(feeDistr.platform_service_gateway / Math.pow(10, feeDistr.fee_precision)) |
      formatLegalCurrency(feeDistr.fee_symbol, feeDistr.fee_precision)}}
    </dd>
    <dd>
      {{$t('m.borrowsuccess.platform')}}：{{(feeDistr.platform_service_platform / Math.pow(10, feeDistr.fee_precision)) |
      formatLegalCurrency(feeDistr.fee_symbol, feeDistr.fee_precision)}}
    </dd>

  </dl>
</template>
<script>
  export default {
    props: {
      feeDistr: {
        type: Array,
        default: []
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
<style scoped>
  dl dd{
    line-height: 30px;
  }
</style>

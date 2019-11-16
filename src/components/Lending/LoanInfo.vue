<template>
<dl class="loan">
    <!--借款信息-->
    <dt>{{$t('m.investingdetail.JKXX')}}</dt>
    <dd>{{$t('m.transfer.XZMS')}}: {{$t('m.invest.periodmode' + items.repayment_type.repayment_period_uint)}} {{$t('m.invest.repayment' + items.repayment_type.repayment_type)}}</dd>
    <dd>{{$t('m.borrow.loanAmount')}}: {{items.amount_to_loan.amount / Math.pow(10, items.asset_to_loan.precision) | formatLegalCurrency(items.asset_to_loan.symbol, items.asset_to_loan.precision)}}</dd>
    <!--借款时长-->
    <dd>{{$t('m.investingdetail.JKSC')}}: {{items.loan_period}} {{$t('m.invest.perioduint' + items.repayment_type.repayment_period_uint)}}</dd>
    <!--借款利率-->
    <dd>{{$t('m.borrow.borrowRate')}}: {{items.interest_rate | converPercentage}} /{{$t('m.invest.perioduint' + items.repayment_type.repayment_period_uint)}}</dd>
    <!--发布时间-->
    <dd>{{$t('m.investingdetail.FBSJ')}}: {{items.loan_time | formatDateStr}}</dd>
    <!--开始计算时间-->
    <dd>{{$t('m.investingdetail.startTime')}}: {{items.invest_finish_time | formatDateStr}}</dd>
    <div class="line"></div>
    <!--抵押物信息-->
    <dt>{{$t('m.investingdetail.DYXX')}}</dt>
    <!--抵押物-->
    <dd>{{$t('m.borrow.pawnNum')}}: {{items.amount_to_collateralize.amount / Math.pow(10, items.asset_to_collateralize.precision) | formatLegalCurrency(items.asset_to_collateralize.symbol, items.asset_to_collateralize.precision)}}
        <!--增加抵押-->
        <el-button v-if="(items.order_state !== 12 && items.order_state !== 11) && isCurLoginUser" @click="addDYW(items)" type="primary" style="margin-left: 100px">{{$t('m.borrow.addCollateral')}}</el-button>
    </dd>
    <!--选择抵押物-->
    <mortage-dialog :element-loading-text="$t('m.loading')" :datail='appointtemI' :ifShowDlg='addPawnDialog' @closeMortage="closeMortage" v-if="addPawnDialog"></mortage-dialog>
</dl>
</template>

<script>
import mortageDialog from '/path-components/Chain/mortageDialog'
export default {
  components: {
    mortageDialog
  },
  props: {
    items: {
      type: Object,
      default: {}
    },
    isCurLoginUser: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      appointtemI: '',
      // 增加抵押物的弹窗
      addPawnDialog: false
    }
  },
  methods: {
    // 关闭增加抵押物
    closeMortage (v) {
      this.addPawnDialog = false
      this.$emit('closeMortageAdd', v)
    },
    addDYW (item) {
      let itemObj = {}
      itemObj = item
      this.appointtemI = itemObj
      this.addPawnDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.loan dd {
    display: block;
    line-height: 30px;
}
</style>

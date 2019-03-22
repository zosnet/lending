<template>
  <div>
    <!--投标信息-->
    <dl v-if="itemList.interest_book.length > 0">
      <dd v-for='(it,index) in itemList.interest_book' :key='index'>
        <!--从前一个投标人id传过来。走一个接口，就可以得到-->
        <span :style='{color:colors[index % 3]}'>&middot;</span>
        <router-link :to='{path: `/history/investHis?accName=${it[1].name}&accID=${it[1].account}`}'>{{it[1].name}}</router-link>
        {{it[1].invest / Math.pow(10, itemList.asset_to_loan.precision) | formatLegalCurrency(itemList.asset_to_loan.symbol, itemList.asset_to_loan.precision)}}
         {{(it[1].time) | formatDateStr}}
        <a @click='handleClick(it)'>{{$t('m.investDetails.lookInvest')}}</a>
      </dd>
    </dl>
    <dl v-else>
      <dd>
        {{$t('m.noData')}}
      </dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: {
      itemList: {
        type: Object,
        default: {}
      },
      item: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        // 投标信息的列表颜色
        colors: ['#ff0000', '#E6A23C', '#409EFF']
      }
    },
    methods: {
      // Ella 各种跳转，跟首页，其他地方规则是否一致 上面借款人的跳转也不对
      handleClick (it) {
        let isTrue = this.itemList.order_state
        if (isTrue === 1 || isTrue === 3) {
          this.$router.push({
            path: '/history/investHis/investingdetail',
            query: {
              id: it[0],
              accName: it[1].name,
              accID: it[1].account
            }
          })
        } else if (isTrue === 7 || isTrue === 8 || isTrue === 9 || isTrue === 13 || isTrue === 17 || isTrue === 18 || isTrue === 19) {
          this.$router.push({
            path: '/history/investHis/historyInvestdetail',
            query: {
              id: it[0],
              accName: it[1].name,
              accID: it[1].account
            }
          })
        } else if (isTrue === 12 || isTrue === 15) {
          this.$router.push({
            path: '/history/investHis/badinvestdetail',
            query: {
              id: it[0],
              accName: it[1].name,
              accID: it[1].account
            }
          })
        } else {
          this.$router.push({
            path: '/history/investHis/investsuccessdetail',
            query: {
              id: it[0],
              accName: it[1].name,
              accID: it[1].account
            }
          })
        }
      }
    },
    mounted () {
    },
    created () {
    }
  }
</script>
<style scoped>
  dl dd{
    line-height: 30px;
  }
</style>

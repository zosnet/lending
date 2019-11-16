<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loading">
        <el-table
          :data="borrowIng"
          class="curp"
          style="width: 100%"
          stripe
          @row-click="handleClick">
          <el-table-column width="150" :label="$t('m.borrowing.name')">
            <template slot-scope="scope">
              <img :src="'/static/images/' + scope.row.asset_to_collateralize.symbol + '.png'" width="24" :onerror="errorImg01" />
              <span class="margin-l10">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <!-- 投资金额 -->
          <el-table-column width="160" :label="$t('m.investList.investSum')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.amount_to_invest.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol)}}
            </template>
          </el-table-column>
          <!-- 投资时间 -->
          <el-table-column  width="180" :label="$t('m.investList.investTime')">
            <template slot-scope="scope">
              <span>{{scope.row.invest_time | formatDateStr}}</span>
            </template>
          </el-table-column>
          <!-- 借款金额 -->
          <el-table-column width="200" :label="$t('m.investList.allInvestSum')">
            <template slot-scope="scope">
              <span class="currency">{{scope.row.asset_to_loan.symbol}}</span>
              {{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.asset_to_loan.precision) | formatLegalCurrencys(scope.row.asset_to_loan.symbol, scope.row.asset_to_loan.precision)}}
            </template>
          </el-table-column>
          <!-- 投资进度 -->
          <el-table-column  width="200" :label="$t('m.investList.investProgress')">
            <template slot-scope="scope">
              <div style="width: 60%; height:50px">
                <div style="margin-top: 25px">
                  <span>{{investProces(scope.row) | formatProcess}}%</span>
                  <el-progress stroke-width="2" :show-text="false" :percentage="investProces(scope.row) | formatProcess"></el-progress>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button @click="addInvestClick(scope.row.order_info.id)" type="primary" size="mini" round>{{$t('m.investList.addInvest')}}</el-button>
            </template>
          </el-table-column>
          <div slot="empty">
            <p>{{$t('m.noData')}}</p>
          </div>
        </el-table>
        <div style="text-align: right">
          <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {
      mortageDialog
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: null,
        loading: true,
        emptyListShow: 0,
        listQuery: {
          page: 1,
          limit: 10
        },
        borrowIng: [
        ],
        // 增加抵押物的弹窗
        addPawnDialog: false,
        bidderData: {},
        userName: '',
        userId: ''
      }
    },
    computed: {
      showHistory () {
        if (window.location.hash.indexOf('history') !== -1) {
          return false
        } else {
          return true
        }
      }
    },
    filters: {
      formatProcess: process => {
        return Math.floor(process * 100)
      }
    },
    methods: {
      handleClick (row, event, column) {
        this.$router.push({
          path: 'investingdetail',
          query: {
            id: row.id,
            accName: this.userName,
            accID: this.userId
          }
        })
      },
      // 请求数据之后，把数据给data
      getList () {
        this.loading = true
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        let userId = this.userId

        let statusArry = [1, 3]
        ZOSInstance.get_invest_counts([userId], [], statusArry).then(res => {
          var listNum = res
          if (listNum === 0) {
            this.loading = false
            this.emptyListShow = 1
            return
          }
          this.emptyListShow = 2
          let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
          ZOSInstance.get_invest_orders([userId], [], statusArry, startIndex, this.listQuery.limit).then(res => {
            this.borrowIng = res
            this.total = listNum
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.$message.error({
              message: err
            })
            this.loading = false
          })
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      investProces (row) {
        return row.order_info.current_invest.amount / row.amount_to_loan.amount
      },
      addInvestClick (id) {
        // 阻止事件冒泡
        event.cancelBubble = true
        this.$router.push({
          path: '/investDetails',
          query: {
            id: id
          }
        })
      },
      init () {
        this.listQuery.page = 1
        this.getList()
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.listQuery.page = val
        this.getList()
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
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "/path-assets/style/mixin";
  @import "/path-assets/style/theme";
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    padding: 5px 0;
    overflow: hidden;
  }
  .charts{
    width: 300px;
  }
  .basicP{
    padding: 15px;
    background: #f4f4f4;
    div{
      line-height: 45px;
    }
  }
  .basicInfo {
    padding: 5px 0;
    overflow: hidden;
  }
  .Pbox{
    height: 165px;
    margin-top: 3px;
    padding-top: 20px;
    background: #f4f4f4;
    div {
      height: 35px;
      line-height: 35px;
      display: flex;
      align-items: center;
      padding-left: 1rem;
      a {
        margin-left: 10px;
        padding: 0 7px;
        height: 70%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #3695ef;
          padding: 0 7px;
          border: .5px solid;
          border-radius: 5px;
        }
        &:hover {
          color: #5683EA;
        }
      }
    }
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

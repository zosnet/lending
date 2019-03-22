<template>
  <div slot="content">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;background: #fff">
      <div v-if="emptyListShow!==0">
        <div class="w-box1">
        <div>
          <span style="min-width: 60px">{{ $t('m.invest.query_type_currency') }}</span>
          <a style="min-width: 40px" href="javascript:;" @click="sortByPrice(1,'all')" :class="{active:sortType1==='all'}">{{ $t('m.invest.query_type_all') }}</a>
          <div v-for="(item,index) in allCashList" :key="index">
            <a href="javascript:;" @click="sortByPrice(1,item.id)" :class="{active:sortType1===item.id}">{{item.symbol}}</a>
          </div>
        </div>
        <div>
          <span style="min-width: 60px">{{ $t('m.invest.collete_type_currency') }}</span>
          <a style="min-width: 40px" href="javascript:;" @click="sortByPrice(2,'all')" :class="{active:sortType2==='all'}">{{ $t('m.invest.query_type_all') }}</a>
          <div v-for="(item,index) in allLenderList" :key="index">
            <a href="javascript:;" @click="sortByPrice(2,item.id)" :class="{active:sortType2===item.id}">{{item.symbol}}</a>
          </div>
        </div>
        <div>
          <span style="min-width: 60px">{{ $t('m.invest.query_type_term') }}</span>
          <a style="min-width: 40px" href="javascript:;" @click="sortByPrice(3,0)" :class="{active:sortType3===0}">{{ $t('m.invest.query_type_all') }}</a>
          <a href="javascript:;" @click="sortByPrice(3,1)" :class="{active:sortType3===1}">1{{$t('m.month')}}</a>
          <a href="javascript:;" @click="sortByPrice(3,2)" :class="{active:sortType3===2}">2{{$t('m.month')}}</a>
          <a href="javascript:;" @click="sortByPrice(3,3)" :class="{active:sortType3===3}">3{{$t('m.month')}}</a>
          <a href="javascript:;" @click="sortByPrice(3,4)" :class="{active:sortType3===4}">4{{$t('m.month')}}</a>
          <a href="javascript:;" @click="sortByPrice(3,5)" :class="{active:sortType3===5}">5{{$t('m.month')}}</a>
          <a href="javascript:;" @click="sortByPrice(3,6)" :class="{active:sortType3===6}">6{{$t('m.month')}}</a>
        </div>
        <div>
          <span style="min-width: 60px">{{ $t('m.invest.query_type_sort') }}</span>
          <a style="min-width: 40px" href="javascript:;" @click="sortByPrice(4,4)" :class="{active:sortType4===4}">{{ $t('m.invest.query_type_pawnrate') }}</a>
          <a href="javascript:;" @click="sortByPrice(4,2)" :class="{active:sortType4===2}">{{ $t('m.invest.sort_type_sum') }}</a>
          <a href="javascript:;" @click="sortByPrice(4,3)" :class="{active:sortType4===3}">{{ $t('m.invest.sort_type_progress') }}</a>
          <a href="javascript:;" @click="sortByPrice(4,5)" :class="{active:sortType4===5}">{{ $t('m.investingdetail.yujiSYL') }}</a>
        </div>
        </div>
      </div>
      <div>
        <el-row>
          <el-table
            :data="tableData"
            class="curp"
            style="width: 100%"
            stripe
            @row-click="handleClick">
            <!--借款金额/币种-->
            <el-table-column width="200" :label="$t('m.borrowsuccess.borrowSum')" align="center">
              <template slot-scope="scope">
                  <img :src="'/static/images/' + scope.row.collateralize_asset.symbol + '.png'" width="24" :onerror="errorImg01" />
                  <span class="currency">{{scope.row.loan_asset.symbol}}</span>
                  {{scope.row.amount_to_loan.amount / Math.pow(10, scope.row.loan_asset.precision) | formatLegalCurrencys(scope.row.loan_asset.symbol, scope.row.loan_asset.precision) }}
              </template>
            </el-table-column>
            <!--借款利率/期限-->
            <el-table-column width="160" :label="$t('m.borrow.borrowRates')">
              <template slot-scope="scope">
                <div class="fw">
                  <span>{{scope.row.interest_rate.interest_rate / 10}}‰ /{{$t('m.year')}}</span>
                </div>
                <span class="secondaryInfo">{{scope.row.loan_period}}{{$t('m.month')}}</span>
              </template>
            </el-table-column>
            <!--抵押数量/抵押倍数-->
            <el-table-column width="200" :label="$t('m.invest.query_type_pawns')">
              <template slot-scope="scope">
                <span class="currency">{{scope.row.collateralize_asset.symbol}}</span>
                  {{scope.row.amount_to_collateralize.amount / Math.pow(10, scope.row.collateralize_asset.precision) | formatLegalCurrencys(scope.row.collateralize_asset.symbol, scope.row.collateralize_asset.precision)}}
                <br>
                <span class="secondaryInfo">{{(scope.row.collateral_rate / 1000) + $t('m.borrow.times')}}</span>
              </template>
            </el-table-column>
            <!--预计收益率-->

            <el-table-column width="160" :render-header="renderHeader">
              <template slot-scope="scope">{{((scope.row.interest_rate.interest_rate / 10) * scope.row.loan_period).toFixed(1)}}‰</template>
            </el-table-column>
            <!--投资进度-->
            <el-table-column  width="200" :label="$t('m.investList.investProgress')">
              <template slot-scope="scope">
                <div style="width: 60%; height:50px">
                  <div style="margin-top: 25px">
                    <span>{{scope.row.invest_process * 100 | formatProcess}}%</span>
                    <el-progress stroke-width="2" :show-text="false" :percentage="scope.row.invest_process * 100 | formatProcess"></el-progress>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.invest.endDate')">
              <template slot-scope="scope">
                <span>{{scope.row.expiration_time  | formatData}}</span>
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
        </el-row>
      </div>
    </div>
    <!--登录-->
    <login-dialog :visible="$store.state.loginPath !== undefined"></login-dialog>
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import loginDialog from '/path-page/Login/loginDialog'
  import {getStore, setStore} from '/js-utils/storage'
  import { loginToPath } from '/js-utils/until'
  export default {
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: null,
        listQuery: {
          page: -1,
          limit: 10
        },
        allLenderOrderIds: [], // 所有的订单id列表
        tableData: [],
        allCashList: [],
        allLenderList: [],
        allLenderListI: [],
        loading: true,
        sortType1: 'all',
        sortType2: 'all',
        sortType3: 0,
        sortType4: 4,
        windowHeight: null,
        windowWidth: null,
        sort: '',
        sortTypeA1: [],
        sortTypeA2: [],
        ufiletermask: 0,
        emptyListShow: 0,
        getLendingAsset: []
      }
    },
    computed: {
    },
    filters: {
      formatSum: sum => {
        return sum.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      },
      formatPercent: (value, maxValue) => {
        let num = value / maxValue
        return Math.round(num * 100) / 100 + '%'
      },
      formatData: time => {
        return time.toString().replace('T', ' ')
      },
      formatProcess: process => {
        return Math.floor(process)
      }
    },
    methods: {
      renderHeader (h) {
        return h('div', [
          h('span', [this.$t('m.investingdetail.yujiSYL')]),
          h('el-popover', {
            attrs: {
              placement: 'bottom-start',
              width: 'auto',
              trigger: 'hover',
              content: this.$t('m.investingdetail.yield')
            }
          }, [
            h('span', {
              'slot': 'reference'
            }, [
              h('i', {
                'class': 'el-icon-question'
              })
            ])
          ])
        ])
      },
      handleClick (row, event, column) {
        var loginPath = {
          path: '/investDetails',
          query: {
            id: row.id
          }
        }
        loginToPath(ZOSInstance, this, loginPath)
      },
      getSortType () {
        let ufiletermask = 0
        let sortType1 = []
        let sortType2 = []
        if (this.sortType1 !== 'all') {
          sortType1 = []
          this.allLenderList = []
          let find = false
          for (let key of this.getLendingAsset) {
            if (key[0].id === this.sortType1) {
              sortType1 = [key[0].id]
              this.allLenderList = key[1]
              ufiletermask = ufiletermask | 1
              find = true
              break
            }
          }
          if (!find) {
            this.sortType1 = 'all'
            sortType1 = []
            ufiletermask = ufiletermask | 1
            this.allLenderList = this.allLenderListI
            for (let key of this.getLendingAsset) {
              sortType1.push(key[0].id)
            }
          }
        } else {
          this.sortType1 = 'all'
          sortType1 = []
          ufiletermask = ufiletermask | 1
          this.allLenderList = this.allLenderListI
          for (let key of this.getLendingAsset) {
            sortType1.push(key[0].id)
          }
        }
        if (this.sortType2 !== 'all') {
          sortType2 = []
          let find1 = false
          for (let key1 of this.allLenderList) {
            if (key1.id === this.sortType2) {
              sortType2 = [key1.id]
              ufiletermask = ufiletermask | 2
              find1 = true
              break
            }
          }
          if (!find1) {
            sortType2 = []
            this.sortType2 = 'all'
            ufiletermask = ufiletermask | 2
            for (let key1 of this.allLenderList) {
              sortType2.push(key1.id)
            }
          }
        } else {
          sortType2 = []
          this.sortType2 = 'all'
          ufiletermask = ufiletermask | 2
          for (let key1 of this.allLenderList) {
            sortType2.push(key1.id)
          }
        }
        if (this.sortType3 !== 0) {
          ufiletermask = ufiletermask | 4
        }
        this.sortTypeA1 = sortType1
        this.sortTypeA2 = sortType2
        this.ufiletermask = ufiletermask
      },
      init () {
        this.sortType1 = getStore('sortType1')
        this.sortType2 = getStore('sortType2')
        this.sortType3 = getStore('sortType3')
        this.sortType4 = getStore('sortType4')
        this.sort = getStore('sort')

        if (this.sortType1 === null) {
          this.sortType1 = 'all'
        }
        if (this.sortType2 === null) {
          this.sortType2 = 'all'
        }
        if (this.sortType3 === null) {
          this.sortType3 = 0
        } else {
          this.sortType3 = parseInt(this.sortType3)
        }
        if (this.sortType4 === null) {
          this.sortType4 = 4
        } else {
          this.sortType4 = parseInt(this.sortType4)
        }

        if (this.sort === null) {
          this.sort = ''
        }
        // this.loading = true
        this.getLendingAsset = this.$store.state.loanAssetArr

        let allList = []
        let listArr = []
        this.allCashList = []
        this.allLenderList = []
        this.getLendingAsset.forEach(item => {
          this.allCashList.push(item[0])
          listArr = allList.concat(item[1])
        })
        this.allLenderList = [...(new Set(listArr))]
        this.allLenderListI = this.allLenderList

        this.initLenderList()
      },
      initLenderList () {
        this.loading = true
        this.listQuery.page = 1
        this.getSortType()
        ZOSInstance.list_bitlender_order(this.sortTypeA1, this.sortTypeA2, this.sortType3, this.ufiletermask, this.sortType4).then(res => {
          this.allLenderOrderIds = res
          this.getList()
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      getList () {
        this.loading = true
        var listNum = this.allLenderOrderIds.length
        let startIndex = (this.listQuery.page - 1) * this.listQuery.limit
        if (listNum === 0) {
          this.loading = false
          this.emptyListShow = 1
          this.tableData = []
          return
        }
        ZOSInstance.get_loan_orders_by_order(this.allLenderOrderIds.slice(startIndex, startIndex + this.listQuery.limit)).then(res => {
          this.tableData = res
          this.total = listNum
          this.loading = false
          this.emptyListShow = 2
        }).catch(err => {
          this.tableData = []
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading = false
        })
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.listQuery.page = val
        this.getList()
      },
      // 筛选排序
      sortByPrice (flag, v) {
        if (flag === 1) {
          if (this.sortType1 === v) return
          this.sortType1 = v
        } else if (flag === 2) {
          if (this.sortType2 === v) return
          this.sortType2 = v
        } else if (flag === 3) {
          if (this.sortType3 === v) return
          this.sortType3 = v
        } else if (flag === 4) {
          if (this.sortType4 === v) return
          this.sortType4 = v
        } else if (flag === 5) {
          if (this.sortType5 === v) return
          this.sortType4 = v
        }
        this.sort = v
        this.initLenderList()

        setStore('sortType1', this.sortType1)
        setStore('sortType2', this.sortType2)
        setStore('sortType3', this.sortType3)
        setStore('sortType4', this.sortType4)
        setStore('sort', this.sort)
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
    },
    created () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    components: {
      loginDialog
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "/path-assets/style/mixin";
  @import "/path-assets/style/theme";
  .el-card__body {
    padding: 0 20px !important;
  }
  .el-card{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff!important;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
  }
  .nav {
    margin-left: 2rem;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #c81623;
          padding: 5px;
          border: .5px solid;
          border-radius: 5px;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }
  .listST{
    display: flex;
    align-items: center;
    padding: 5px;
    margin-top: 25px;
    /*margin-left: 1rem;*/
    background-color: #ffffff;
    >div{
      margin-left: 10px;
    }
    img{
      width: 40px;
      height: 40px;
      margin-left: 1rem;
    }
  }
  .w-box1 {
    background: #fbfbfb;
    > div {
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


  .el-pagination{
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }
  .noborder {
    border: none;
  }
</style>

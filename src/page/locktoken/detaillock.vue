<template>
  <div v-if="visible">
  <el-dialog
    :title="titleStr"
    :visible.sync="visible"
    width="45%"
    @close="closeEvent"
  >
  <div v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vh;">
  <div class="ZHZZL" >
      <div class="main_item">
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.balance.index')}}:</el-col>
          <el-col :span="16" class="num_info">{{row.id}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.register.accountName')}}:</el-col>
          <el-col :span="16" class="num_info">{{useName}}</el-col>
        </el-row>
      </div>
      <div class="main_item">
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.lockamount')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{row.symbol}}</span>
            {{row.locked.amount | formatLegalCurrency3('', row.precision)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.creattime')}}:</el-col>
          <el-col :span="16" class="num_info">{{row.create_time}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="title_info">{{$t('m.lockasseted.allinterest')}}:</el-col>
          <el-col :span="16" class="num_info">
            <span class="symbol_unit">{{row.interestsymbol}}</span>
            {{row.interest.amount | formatLegalCurrency3('', row.interestprecision)}}
          </el-col>
        </el-row>
        <div v-if="this.row.type === 0">
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.coinDay')}}:</el-col>
            <el-col :span="16" class="num_info">
              <span class="symbol_unit">{{row.interestsymbol}}</span>
              {{row.dy_interest.amount  | formatLegalCurrency3('', row.interestprecision)}}
            </el-col>
          </el-row>
        </div>
        <div v-if="this.row.type === 2">
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.nodetype')}}:</el-col>
            <el-col :span="16" class="num_info"> {{$t('m.lockasseted.nodetype' + row.autolock)}}</el-col>
          </el-row>
        </div>
        <div v-if="this.row.type === 1">
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.lockperiod')}}:</el-col>
            <el-col :span="16" class="num_info"> {{row.period.toString()}}{{$t('m.months')}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.lockmode')}}:</el-col>
            <el-col :span="16" class="num_info">{{$t('m.lockasseted.lockmode'  + row.autolock)}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.rate')}}:</el-col>
            <el-col :span="16" class="num_info"> {{row.rate / 10}}‰</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.exceptinterest')}}:</el-col>
            <el-col :span="16" class="num_info"> 
              <span class="symbol_unit">{{row.interestsymbol}}</span>
              {{row.except_interst | formatLegalCurrency3('', row.interestprecision)}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.exceptime')}}:</el-col>
            <el-col :span="16" class="num_info">{{row.except_time}}</el-col>
          </el-row>
          <el-row v-if="this.mode === 8">
            <el-col :span="8" class="title_info">{{$t('m.lockasseted.removetime')}}:</el-col>
            <el-col :span="16" class="num_info">{{row.remove_time}}</el-col>
          </el-row>
        </div>
      </div>
  </div>
  <div v-if="this.row.type === 2">
    <el-tabs  v-model="activeTabName"   class="margin-t40">
    <el-tab-pane :label="$t('m.locktoken.nodeinterest')" name="first">
    <el-table
        :data="refunding1"
        class="curp"
        style="width: 100%"
        stripe>
          <el-table-column style="width: 50%" :label="$t('m.lockasseted.interesttime')">
            <template slot-scope="scope">
              {{scope.row.time}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.investList.realIncome')">
            <template slot-scope="scope">
              {{scope.row.amount.amount | formatLegalCurrency3('', scope.row.asset.precision)}}
              <span class="symbol_unit">{{scope.row.asset.symbol}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.investList.interestType')">
            <template slot-scope="scope">
              {{scope.row.type}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.investList.fromAccount')">
            <template slot-scope="scope">
              {{scope.row.account.name}}
            </template>
          </el-table-column>
          <div slot="empty">
            <p>{{$t('m.noData')}}</p>
          </div>
      </el-table>
      <div style="text-align: right">
        <el-pagination background @current-change="handleCurrentChange1"  :current-page="listQuery1.page" :page-size="listQuery1.limit" layout="total, prev, pager, next, jumper" :total="total1">
      </el-pagination>
      </div>

      </el-tab-pane>
      <el-tab-pane :label="$t('m.locktoken.interest')" name="second">

      <el-table
        :data="refunding"
        class="curp"
        style="width: 100%"
        stripe>
          <el-table-column style="width: 50%" :label="$t('m.lockasseted.interesttime')">
            <template slot-scope="scope">
              {{scope.row.time}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.investList.realIncome')">
            <template slot-scope="scope">
              {{scope.row.amount | formatLegalCurrency3('', row.interestprecision)}}
              <span class="symbol_unit">{{row.interestsymbol}}</span>
            </template>
          </el-table-column>
          <div slot="empty">
            <p>{{$t('m.noData')}}</p>
          </div>
      </el-table>
      <div style="text-align: right">
        <el-pagination background @current-change="handleCurrentChange"  :current-page="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      </el-tab-pane>
      </el-tabs>
    </div>
   <div v-if="this.row.type !== 2">
     <el-table
      :data="refunding"
      class="curp"
      style="width: 100%"
      stripe>
        <el-table-column style="width: 50%" :label="$t('m.lockasseted.interesttime')">
          <template slot-scope="scope">
            {{scope.row.time}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('m.investList.realIncome')">
          <template slot-scope="scope">
            {{scope.row.amount | formatLegalCurrency3('', row.interestprecision)}}
            <span class="symbol_unit">{{row.interestsymbol}}</span>
          </template>
        </el-table-column>
        <div slot="empty">
          <p>{{$t('m.noData')}}</p>
        </div>
    </el-table>
    <div style="text-align: right">
      <el-pagination background @current-change="handleCurrentChange"  :current-page="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </div>
   </div>
   </div>
  </el-dialog>
  </div>
</template>

<script>
  import {Apis} from 'zosjs-ws'
  export default {
    components: {
    },
    props: {
      visible: {
        type: Boolean,
        defalut: true
      },
      // 资产id
      assetId: {
        type: String,
        default: '1.3.0'
      },
      // 货币精度
      precision: {
        type: Number,
        default: 5
      },
      symbol: {
        type: String,
        defalut: 'ZOS'
      }
    },
    data () {
      return {
        loading: 1,
        total: 0,
        start: 0,
        mode: 0,
        useName: '',
        listQuery: {
          page: 1,
          limit: 5
        },
        row: {},
        refunding: [],
        list: {},
        total1: 0,
        start1: 0,
        listQuery1: {
          page: 1,
          limit: 5
        },
        activeTabName: 'first',
        refunding1: []
      }
    },
    methods: {
      changeOption (v, p) {
        this.loading = false
        this.row = p
        this.mode = v
        if (this.row.type === 1) {
          this.titleStr = this.$t('m.orderList.DQ') + this.$t('m.badloans.detail')
        } else if (this.row.type === 0) {
          this.titleStr = this.$t('m.orderList.HQ') + this.$t('m.badloans.detail')
        } else if (this.row.type === 2) {
          this.titleStr = this.$t('m.orderList.NODE') + this.$t('m.badloans.detail')
        }
        this.total = p.interest_list.length
        this.total1 = p.reward_list.length
        this.getList(1)
        if (this.row.type === 2) this.getList1(1)
        this.getuser()
      },
      closeEvent () {
        this.$emit('detailclose', false)
      },
      getuser () {
        if (this.row.issuer === this.$store.state.userDataSid) {
          this.useName = this.$store.state.userName
        } else {
          Apis.instance().db_api().exec('get_objects', [[this.row.issuer]]).then(res => {
            if (res && res[0]) {
              this.useName = res[0].name
            }
          })
        }
      },
      getList (v) {
        this.listQuery.page = v
        if (v === 1) {
          this.start = 0
        } else {
          this.start = (this.listQuery.page - 1) * this.listQuery.limit
        }
        if (this.total <= 0) {
          this.refunding = []
          return
        }
        let ids = this.row.interest_list.slice(this.start, this.start + this.listQuery.limit)
        this.refunding = []
        ids.forEach(element => {
          let add = {'time': element[0], 'amount': element[1]}
          this.refunding.push(add)
        })
      },
      handleCurrentChange1 (val) {
        if (this.listQuery1.page === val) return
        this.getList1(val)
      },
      getList1 (v) {
        this.listQuery1.page = v
        if (v === 1) {
          this.start1 = 0
        } else {
          this.start1 = (this.listQuery1.page - 1) * this.listQuery1.limit
        }
        if (this.total1 <= 0) {
          this.refunding1 = []
          return
        }
        let ids = this.row.reward_list.slice(this.start1, this.start1 + this.listQuery1.limit)
        this.refunding1 = []
        ids.forEach(element => {
          let id = [element[1].amount.asset_id, element[1].from_id, element[1].from_account]
          Apis.instance().db_api().exec('get_objects', [id]).then(res => {
            console.log(res, id)
            let add = {'time': element[0], 'amount': element[1].amount, 'asset': res[0], 'object': res[1], 'account': res[2], 'type': element[1].type}
            this.refunding1.push(add)
          }).catch(err => {
            console.log(err)
          })
        })
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.getList(val)
      },
      init () {
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
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
<style scoped lang="scss">
.ZHZZL{
  display: flex;
  .main_item{
    flex: 1;
    .el-row{
      margin: 15px 0;
    }
  }
  .title_info{
    color:#191A5E;
    font-size:14px;
    font-weight:500;
    font-family:PingFangSC-Medium,PingFangSC;
  }
  .num_info{
    color:#31364F;
    font-size:14px;
    font-weight:400;
    font-family:PingFangSC-Regular,PingFangSC;
  }
}
.symbol_unit{
  display:inline-block;
  // width:34px;
  height:16px;
  line-height:16px;
  text-align:center;
  color:#65A3F6;
  font-size:8px;
  border-radius:2px;
  background:rgba(232,242,254,1);
  border:1px solid rgba(231,241,253,1);
  font-family:Helvetica-Bold,Helvetica;
}
</style>
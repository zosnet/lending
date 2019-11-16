  <template>
    <div v-loading="loading > 0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="loading <= 0">
        <el-tabs v-model="activeTabName" @tab-click="handleClick">
         <el-tab-pane :label="$t('m.orderList.DQJL')" name="first">
          <el-table
            :data="refunding3"
            class="curp"
            style="width: 100%"
            @row-click="handleClick"
            stripe>
             <el-table-column width="100" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="140"  align="right" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount / Math.pow(10, precision) | formatLegalCurrency('', precision)}}
              </template>
            </el-table-column>
            <el-table-column width="70"  align="right" :label="$t('m.lockasseted.lockperiod')">
              <template slot-scope="scope">
                <span> {{scope.row.period.toString()}}{{$t('m.months')}}</span>
              </template>
            </el-table-column>
            <el-table-column width="90"  align="right" :label="$t('m.lockasseted.lockmode')">
              <template slot-scope="scope">
                <span> {{$t('m.lockasseted.lockmode'  + scope.row.autolock)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.rate')">
              <template slot-scope="scope">
                <span> {{scope.row.rate / 10}}‰</span>
              </template>
            </el-table-column>
            <el-table-column width="165"  align="right" :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
             <el-table-column width="165"  align="right" :label="$t('m.lockasseted.exceptime')">
              <template slot-scope="scope">
                <span>{{scope.row.except_time}}</span>
              </template>
            </el-table-column>
          <el-table-column width="120"  align="right" :label="$t('m.lockasseted.exceptinterest')">
              <template slot-scope="scope">
                {{scope.row.except_interst / Math.pow(10, precision) | formatLegalCurrency('', precision)}}
              </template>
            </el-table-column>
          <el-table-column  align="right" :label="$t('m.orderList.operation')">
              <template slot-scope="scope"  class="flex-h">
                <el-button  class="btn_small"  size="small" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
           <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange3" :current-page="listQuery3.page" :page-size="listQuery3.limit" layout="total, prev, pager, next, jumper" :total="total3">
            </el-pagination>
          </div>
          </el-tab-pane>

           <el-tab-pane :label="$t('m.orderList.HQJL')" name="second">
            <el-table
            :data="refunding1"
            class="curp"
            style="width: 100%;"
            @row-click="handleClick"
            stripe>
             <el-table-column width="100" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="right" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount / Math.pow(10, precision) | formatLegalCurrency('', precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="right"  :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column width="180" align="right"  :label="$t('m.lockasseted.coinDay')">
              <template slot-scope="scope">
                <span>{{(scope.row.dy_interest.amount/ Math.pow(10, precision)).toFixed(precision)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="right"  :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span  v-if="Number(scope.row.rate) > 0">{{Number(scope.row.rate) / 10}}‰</span>
              </template>
            </el-table-column>
          <el-table-column width="140" align="right"  :label="$t('m.lockasseted.allinterest')">
              <template slot-scope="scope">
                {{scope.row.interest.amount / Math.pow(10, precision) | formatLegalCurrency('', precision)}}
              </template>
            </el-table-column>
          <el-table-column align="right"  :label="$t('m.orderList.operation')">
              <template slot-scope="scope" class="flex-h">
                <el-button  class="btn_small" size="small" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange1" :current-page="listQuery1.page" :page-size="listQuery1.limit" layout="total, prev, pager, next, jumper" :total="total1">
            </el-pagination>
          </div>
        </el-tab-pane>

         <el-tab-pane :label="$t('m.orderList.JDJL')" name="third">
            <el-table
            :data="refunding2"
            class="curp"
            style="width: 100%;"
            @row-click="handleClick"
            stripe>
             <el-table-column width="120" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="240" align="right" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount | formatLegalCurrency3(scope.row.symbol, scope.row.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="right"  :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.lockperiod')">
              <template slot-scope="scope">
                <span> {{scope.row.period.toString()}}{{$t('m.months')}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.nodetype')">
              <template slot-scope="scope">
                <span> {{$t('m.lockasseted.nodetype' + scope.row.autolock)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="right"  :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span  v-if="Number(scope.row.rate) > 0">{{Number(scope.row.rate) / 10}}‰</span>
              </template>
            </el-table-column>
          <el-table-column width="240" align="right"  :label="$t('m.lockasseted.allinterest')">
              <template slot-scope="scope">
                {{scope.row.interest.amount | formatLegalCurrency3(scope.row.interestsymbol, scope.row.interestprecision)}}
              </template>
            </el-table-column>
          <el-table-column align="right"  :label="$t('m.orderList.operation')">
              <template slot-scope="scope" class="flex-h">
                <el-button  class="btn_small" size="small" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange2" :current-page="listQuery2.page" :page-size="listQuery2.limit" layout="total, prev, pager, next, jumper" :total="total2">
            </el-pagination>
          </div>
        </el-tab-pane>

          <el-tab-pane :label="$t('m.orderList.HQ') +$t('m.orderList.LSJL')" name="four">
            <el-table
            :data="refunding4"
            class="curp"
            style="width: 100%;"
            @row-click="handleClick"
            stripe>
             <el-table-column width="120" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="210" align="right" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount | formatLegalCurrency3(scope.row.symbol, scope.row.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="right"  :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column width="230" align="right"  :label="$t('m.lockasseted.removetime')">
              <template slot-scope="scope">
               {{ scope.row.remove_time}}
              </template>
            </el-table-column>
            <el-table-column width="100" align="right"  :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span  v-if="Number(scope.row.rate) > 0">{{Number(scope.row.rate) / 10}}‰</span>
              </template>
            </el-table-column>
          <el-table-column width="200" align="right"  :label="$t('m.lockasseted.allinterest')">
              <template slot-scope="scope">
                {{scope.row.interest.amount | formatLegalCurrency3(scope.row.interestsymbol, scope.row.interestprecision)}}
              </template>
            </el-table-column>
          <el-table-column align="right"  :label="$t('m.orderList.operation')">
              <template slot-scope="scope" class="flex-h">
                <el-button  class="btn_small" size="small" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange4" :current-page="listQuery4.page" :page-size="listQuery4.limit" layout="total, prev, pager, next, jumper" :total="total4">
            </el-pagination>
          </div>
        </el-tab-pane>


      <el-tab-pane :label="$t('m.orderList.DQ') + $t('m.orderList.LSJL')" name="five">
           <el-table
            :data="refunding5"
            class="curp"
            style="width: 100%"
            @row-click="handleClick"
            stripe>
            <el-table-column width="100" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="190"  align="right" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount | formatLegalCurrency3(scope.row.symbol, scope.row.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="60"  align="right" :label="$t('m.lockasseted.lockperiod')">
              <template slot-scope="scope">
                <span> {{scope.row.period.toString()}}{{$t('m.months')}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.lockmode')">
              <template slot-scope="scope">
                <span> {{$t('m.lockasseted.lockmode'  + scope.row.autolock)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span> {{scope.row.rate / 10}}‰</span>
              </template>
            </el-table-column>
            <!-- <el-table-column width="165"  align="right" :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column> -->
            <el-table-column width="165" align="right"  :label="$t('m.lockasseted.removetime')">
              <template slot-scope="scope">
               {{ scope.row.remove_time}}
              </template>
            </el-table-column>
             <el-table-column width="165"  align="right" :label="$t('m.lockasseted.exceptime')">
              <template slot-scope="scope">
                <span>{{scope.row.except_time}}</span>
              </template>
            </el-table-column>
          <el-table-column width="150"  align="right" :label="$t('m.lockasseted.exceptinterest')">
              <template slot-scope="scope">
                {{scope.row.except_interst | formatLegalCurrency3(scope.row.interestsymbol, scope.row.interestprecision)}}
              </template>
            </el-table-column>
          <el-table-column  align="right" :label="$t('m.orderList.operation')">
              <template slot-scope="scope"  class="flex-h">
                <el-button  class="btn_small"  size="small" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
           <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange5" :current-page="listQuery5.page" :page-size="listQuery5.limit" layout="total, prev, pager, next, jumper" :total="total5">
            </el-pagination>
          </div>
      </el-tab-pane>

       <el-tab-pane :label="$t('m.orderList.NODE') + $t('m.orderList.LSJL')" name="six">
            <el-table
            :data="refunding6"
            class="curp"
            style="width: 100%;"
            @row-click="handleClick"
            stripe>
             <el-table-column width="100" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="right" :label="$t('m.lockasseted.lockamount')">
              <template slot-scope="scope">
                {{scope.row.locked.amount | formatLegalCurrency3(scope.row.symbol, scope.row.precision)}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="right"  :label="$t('m.lockasseted.creattime')">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column width="165" align="right"  :label="$t('m.lockasseted.removetime')">
              <template slot-scope="scope">
               {{ scope.row.remove_time}}
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.lockperiod')">
              <template slot-scope="scope">
                <span> {{scope.row.period.toString()}}{{$t('m.months')}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80"  align="right" :label="$t('m.lockasseted.nodetype')">
              <template slot-scope="scope">
                <span> {{$t('m.lockasseted.nodetype' + scope.row.autolock)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80" align="right"  :label="$t('m.lockasseted.interestrate')">
              <template slot-scope="scope">
                <span  v-if="Number(scope.row.rate) > 0">{{Number(scope.row.rate) / 10}}‰</span>
              </template>
            </el-table-column>
          <el-table-column width="170" align="right"  :label="$t('m.lockasseted.allinterest')">
              <template slot-scope="scope">
                {{scope.row.interest.amount | formatLegalCurrency3(scope.row.interestsymbol, scope.row.interestprecision)}}
              </template>
            </el-table-column>
          <el-table-column align="right"  :label="$t('m.orderList.operation')">
              <template slot-scope="scope" class="flex-h">
                <el-button  class="btn_small" size="small" @click="operator(0, scope.row)">{{$t('m.lockasseted.detail')}}</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange6" :current-page="listQuery6.page" :page-size="listQuery6.limit" layout="total, prev, pager, next, jumper" :total="total6">
            </el-pagination>
          </div>
        </el-tab-pane>






       </el-tabs>
      </div>
      <detaillock  ref="detailLockRef"  :visible="detailshow" @detailclose='detailclose'></detaillock>
  </div>
</template>
<script>
  import {getStore, setStore} from '/js-utils/storage'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {
      'detaillock': () => import('/path-page/locktoken/detaillock')
    },
    data () {
      return {
        total1: 0,
        listQuery1: {
          page: 1,
          limit: 10
        },
        refundid1: [],
        refunding1: [
        ],
        total2: 0,
        listQuery2: {
          page: 1,
          limit: 10
        },
        refundid2: [],
        refunding2: [
        ],
        total3: 0,
        listQuery3: {
          page: 1,
          limit: 10
        },
        refundid3: [],
        refunding3: [
        ],

        total4: 0,
        listQuery4: {
          page: 0,
          limit: 10
        },
        refundid4: [],
        refunding4: [
        ],

        total5: 0,
        listQuery5: {
          page: 0,
          limit: 10
        },
        refundid5: [],
        refunding5: [
        ],

        total6: 0,
        listQuery6: {
          page: 0,
          limit: 10
        },
        refundid6: [],
        refunding6: [
        ],
        userName: '',
        userId: '',
        start1: 0,
        start2: 0,
        start3: 0,
        start4: 0,
        start5: 0,
        start6: 0,
        activeTabName: 'first',
        detailshow: false,
        addtype: 1,
        precision: 5,
        refershflag: false,
        operatorrow: {},
        operatortype: 0,
        feeZos: 0,
        subloading: false,
        loading: 1
      }
    },
    computed: {
    },
    methods: {
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }
        this.refersh()
      },
      refersh () {
        this.loading = 1
        this.getData()
        this.loading--
      },
      operator (v, row) {
        this.operatorrow = row
        this.operatortype = v
        if (v === 0 || v === 6) {
          this.$refs.detailLockRef.changeOption(v, row)
          this.detailshow = true
        }
      },
      getData () {
        this.loading++
        ZOSInstance.get_locktoken_ids(this.userId, '', 0).then(result => {
          this.refundid1 = result
          this.total1 = result.length
          this.loading--
          this.getList1(1)
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
        this.loading++
        ZOSInstance.get_locktoken_ids(this.userId, '', 1).then(result => {
          this.refundid3 = result
          this.total3 = result.length
          this.loading--
          this.getList3(1)
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })

        this.loading++
        ZOSInstance.get_locktoken_ids(this.userId, '', 2).then(result => {
          this.refundid2 = result
          this.total2 = result.length
          this.loading--
          this.getList2(1)
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })

        this.loading++
        ZOSInstance.get_locktoken_history_count(this.userId, '', 0).then(result => {
          this.total4 = result
          this.getList4(1)
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
        this.loading++
        ZOSInstance.get_locktoken_history_count(this.userId, '', 1).then(result => {
          this.total5 = result
          this.getList5(1)
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
        this.loading++
        ZOSInstance.get_locktoken_history_count(this.userId, '', 2).then(result => {
          this.total6 = result
          this.getList6(1)
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      detailclose () {
        this.detailshow = false
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
        this.loading++
        let ids = this.refundid1.slice(this.start1, this.start1 + this.listQuery1.limit)
        ZOSInstance.get_locktoken_objects(ids).then(result => {
          this.refunding1 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      getList2 (v) {
        this.listQuery2.page = v
        if (v === 1) {
          this.start2 = 0
        } else {
          this.start2 = (this.listQuery2.page - 1) * this.listQuery2.limit
        }
        if (this.total2 <= 0) {
          this.refunding2 = []
          return
        }
        this.loading++
        let ids = this.refundid2.slice(this.start2, this.start2 + this.listQuery2.limit)
        ZOSInstance.get_locktoken_objects(ids).then(result => {
          this.refunding2 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      getList3 (v) {
        this.listQuery3.page = v
        if (v === 1) {
          this.start3 = 0
        } else {
          this.start3 = (this.listQuery3.page - 1) * this.listQuery3.limit
        }
        if (this.total3 <= 0) {
          this.refunding3 = []
          return
        }
        this.loading++
        let ids = this.refundid3.slice(this.start3, this.start3 + this.listQuery3.limit)
        ZOSInstance.get_locktoken_objects(ids).then(result => {
          this.refunding3 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      getList4 (v) {
        if (this.listQuery4.page === v) return
        this.listQuery4.page = v
        if (v === 1) {
          this.start4 = 0
        } else {
          this.start4 = (this.listQuery4.page - 1) * this.listQuery4.limit
        }
        if (this.total4 <= 0) {
          this.refunding4 = []
          return
        }
        this.loading++
        ZOSInstance.get_locktoken_history(this.userId, '', 0, this.start4, this.listQuery4.limit).then(result => {
          this.refunding4 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      getList5 (v) {
        if (this.listQuery5.page === v) return
        this.listQuery5.page = v
        if (v === 1) {
          this.start5 = 0
        } else {
          this.start5 = (this.listQuery5.page - 1) * this.listQuery5.limit
        }
        if (this.total5 <= 0) {
          this.refunding5 = []
          return
        }
        this.loading++
        ZOSInstance.get_locktoken_history(this.userId, '', 1, this.start5, this.listQuery5.limit).then(result => {
          this.refunding5 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      getList6 (v) {
        if (this.listQuery6.page === v) return
        this.listQuery6.page = v
        if (v === 1) {
          this.start6 = 0
        } else {
          this.start6 = (this.listQuery6.page - 1) * this.listQuery6.limit
        }
        if (this.total6 <= 0) {
          this.refunding6 = []
          return
        }
        this.loading++
        ZOSInstance.get_locktoken_history(this.userId, '', 2, this.start6, this.listQuery6.limit).then(result => {
          this.refunding6 = result
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      handleCurrentChange1 (val) {
        if (this.listQuery1.page === val) return
        this.getList1(val)
      },
      handleCurrentChange2 (val) {
        if (this.listQuery2.page === val) return
        this.getList2(val)
      },
      handleCurrentChange3 (val) {
        if (this.listQuery3.page === val) return
        this.getList3(val)
      }
    },
    destroyed () {
      setStore('lockHis', this.activeTabName)
    },
    mounted () {
      this.activeTabName = getStore('lockHis') ? getStore('lockHis') : 'first'
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
  @import '../../../theme/utils';
  @import '../../../theme/theme';
  .btn_small{
    padding: 9px 5px;
    margin-left: 2px;
  }
  .bFuKMc{
    height: 54px;
    padding: 0px 20px;
    border-bottom: 1px solid rgb(218, 225, 233);
  }
  .ZHZZL{
    // position: relative;
    height: 120px;
  }
  .width-100 {
    min-width: 600px;
    color: rgb(199, 51, 51);
  }
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
    flex: 0 0 54px;
    padding: 0px 20px;
    border-bottom: 1px solid rgb(218, 225, 233);
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  a, [role="button"] {
    cursor: pointer;
    color: rgb(6, 103, 208);
    text-decoration: none;
  }
  .jvhNys {
    flex: 0 0 calc(100vh - 200px);
  }
  .UMJSF {
    background-color: rgb(244, 247, 250);
  }
  .VsGOO {
    -webkit-box-align: center;
    align-items: center;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 49.5%;
  }
  .btn-group-account{
    position: absolute; bottom: 10px; right:20px
  }
  #dialog-account .el-dialog__body{
    overflow: auto !important;
    height: 60vh !important;
  }
  .account .el-card{
    background: #fff!important;
  }
  .update-recode-btn{
    position: absolute;
    top: 5px;
    right: 50px;
    height: 30px;
    width: 80px;
  }
</style>

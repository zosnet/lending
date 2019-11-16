  <template>
    <div v-loading="loading>0 || loading1" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
      <div v-if="loading<=0">
        <div>
          <el-table
            :data="refunding"
            class="curp"
            style="width: 100%"
            @row-click="handleClick"
            stripe>
            <!--标题-->
             <el-table-column width="100" :label="$t('m.balance.index')">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column width="180" :label="$t('m.register.accountName')">
              <template slot-scope="scope">
                 {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column width="240" :label="$t('m.set.address')">
              <template slot-scope="scope">
                <span>{{scope.row.url}}</span>
              </template>
            </el-table-column>
            <el-table-column width="240" :label="$t('m.transfer.memo')">
              <template slot-scope="scope">
                <span>{{scope.row.memo}}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" :label="$t('m.orderList.bitType')">
              <template slot-scope="scope">
                <span>{{scope.row.asset}}</span>
              </template>
            </el-table-column>
            <el-table-column width="140" :label="$t('m.orderList.operation')">
              <template slot-scope="scope">
                <el-button size="small" v-if="isauthor(scope.row)" @click="goauthor(scope.row)">{{scope.row.kycStatus}}</el-button>
                 <span v-if="!isauthor(scope.row)">{{scope.row.kycStatus}}</span>
              </template>
            </el-table-column>
            <div slot="empty">
              <p>{{$t('m.noData')}}</p>
            </div>
          </el-table>
          <div style="text-align: right">
            <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
      </div>
      <!--前往kyc-->
      <goto-kyc :kycInfo="kycInfo" :kycurl="kycurl" :authorid="authourAccount" :kycStatusCode="kycStatusCode" :hintKycDialog="hintKycDialog" :checkinfoDialog="checkinfoDialog" @close='SelectKycClose'></goto-kyc>
     </div>
    </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import gotoKyc from '/path-components/KYC'
  import {kycStatus} from '/js-api/index'
  export default {
    components: {
      gotoKyc
    },
    data () {
      return {
        errorImg01: 'this.src="' + require('/path-static/images/no-img.png') + '"',
        total: 20,
        listQuery: {
          page: 1,
          limit: 10
        },
        refundid: [],
        refunding: [
        ],
        userName: '',
        userId: '',
        start: 0,
        hintKycDialog: false,
        checkinfoDialog: false,
        kycInfo: {},
        kycurl: '',
        loading1: false,
        authourAccount: '',
        kycStatusCode: 0,
        loading: 0
      }
    },
    filters: {
      formatSum: sum => {
        return sum.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      },
      formatData: time => {
        return time.toString().replace('T', ' ')
      }
    },
    computed: {
      isauthor (row) {
        return function (row) {
          return row.kycStatusCode !== 4
        }
      }
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
        this.loading = 1
        this.refundid = []
        this.total = 0
        Apis.instance().db_api().exec('lookup_author_accounts', ['', 1000]).then(result => {
          result.forEach(element => {
            this.refundid.push(element[1])
          })
          this.total = this.refundid.length
          this.getList(1)
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
        if (this.$route.query.type !== undefined && this.$route.query.type === 'author') this.doauthor()
      },
      async getOneKycStatus (element) {
        return kycStatus(element.url + '/zos-kyc/', {chainid: this.userId, authorid: element.author_account}).then(res => {
          let status = 1
          if (res.ret_code === '0' || res.ret_code === '1') {
            element.kycStatusCode = res.ret_code
            element.authourAccount = element.author_account
            element.kycInfo = {}
            element.kycInfo.name = res.name
            element.kycInfo.ictype = res.ictype
            element.kycInfo.icno = res.icno
            element.kycInfo.chainstatus = this.$t('m.kyc.statues' + Math.abs(status))
            element.kycInfo.remark = res.remark
            element.checkinfoDialog = true
            element.hintKycDialog = false
            if (res.ret_code === '1') {
              element.kycStatusCode = 4
              element.checkinfoDialog = false
              element.hintKycDialog = false
              element.kycStatus = this.$t('m.information.through')
            } else {
              element.checkinfoDialog = true
              element.hintKycDialog = false
              element.kycStatus = this.$t('m.information.review')
            }
          } else {
            element.kycStatusCode = 3
            element.kycInfo = {}
            element.authourAccount = element.author_account
            element.hintKycDialog = true
            element.checkinfoDialog = false
            element.kycStatus = this.$t('m.transfer.goto')
          }
          return element
        }).catch(err => {
          console.log(err)
          element.kycStatus = this.$t('m.no')
        })
      },
      getKycStatus () {
        this.refunding.forEach(element => {
          this.getOneKycStatus(element)
        })
      },
      SelectKycClose (updateRecode) {
        this.hintKycDialog = false
        this.checkinfoDialog = false
        if (updateRecode) this.getKycStatus()
      },
      doauthor () {
        if (this.hintKycDialog || this.checkinfoDialog) return
        if (this.$store.state.authoradmin === undefined) return
        if (this.loading1) return
        this.loading1 = true
        Apis.instance().db_api().exec('get_objects', [[this.$store.state.authoradmin]]).then(res => {
          if (res && res.length > 0) {
            let element = {
              url: res[0].url,
              author_account: res[0].author_account
            }
            this.getOneKycStatus(element).then((data) => {
              this.kycInfo = element.kycInfo
              this.kycurl = element.url
              this.authourAccount = element.authourAccount
              this.kycStatusCode = element.kycStatusCode
              this.hintKycDialog = element.hintKycDialog
              this.checkinfoDialog = element.checkinfoDialog
              this.loading1 = false
              if (element.kycStatusCode === 4) {
                this.checkinfoDialog = true
                element.kycInfo.chainstatus = element.kycStatus
              }
            }).catch(err => {
              console.log(err)
              this.loading1 = false
            })
          } else {
            this.loading1 = false
          }
        }).catch(err => {
          console.log(err)
          this.loading1 = false
        })
      },
      goauthor (row) {
        if (this.loading1) return
        this.loading1 = true
        this.getOneKycStatus(row).then((data) => {
          this.loading1 = false
          this.kycInfo = row.kycInfo
          this.kycurl = row.url
          this.authourAccount = row.authourAccount
          this.kycStatusCode = row.kycStatusCode
          this.hintKycDialog = row.hintKycDialog
          this.checkinfoDialog = row.checkinfoDialog
        }).catch(err => {
          console.log(err)
          this.loading1 = false
        })
      },
      getList (v) {
        this.loading++
        this.listQuery.page = v
        if (v === 1) {
          this.start = 0
        } else {
          this.start = (this.listQuery.page - 1) * this.listQuery.limit
        }
        if (this.total <= 0) {
          this.refunding = []
          this.loading--
          return
        }
        let ids = this.refundid.slice(this.start, this.start + this.listQuery.limit)
        ZOSInstance.get_authors(ids).then(result => {
          result.forEach(item => {
            this.loading++
            Apis.instance().db_api().exec('get_objects', [[item.author_account]]).then(res => {
              if (res && res.length > 0) item['name'] = res[0].name
              this.loading--
            }).catch(err => {
              console.log(err)
              this.$message.error({
                message: err
              })
              this.loading--
            })
            this.loading++
            item['asset'] = ''
            item['kycStatusCode'] = 4
            item['kycStatus'] = ''
            Apis.instance().db_api().exec('get_objects', [item.allow_asset]).then(res => {
              res.forEach(item1 => {
                if (item['asset'] !== '') item['asset'] += ','
                item['asset'] += item1.symbol
              })
              this.loading--
            }).catch(err => {
              console.log(err)
              this.$message.error({
                message: err
              })
              this.loading--
            })
          })
          this.refunding = result
          this.loading--
          this.getKycStatus()
        }).catch(err => {
          console.log(err)
          this.$message.error({
            message: err
          })
          this.loading--
        })
      },
      handleCurrentChange (val) {
        if (this.listQuery.page === val) return
        this.getList(val)
      }
    },
    destroyed () {
      this.$root.eventHub.$off('author')
    },
    mounted () {
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
      this.$root.eventHub.$on('author', _ => {
        this.doauthor()
      })
    }
  }
</script>
<style scoped lang="scss">
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    padding: 5px 0;
    overflow: hidden;
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

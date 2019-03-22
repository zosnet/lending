<template>
  <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;" class="jyNVPQ">
    <div class="grid-container" v-if="!loading">
      <div class="detail-content pr"> <!-- Ella -->
        <el-button style="position: absolute; right: 30px; top: 25px; z-index: 99"
                   v-show="isCurrentUser"
                   @click="addInvestClick(orderId)"
                   type="primary" size="mini" round>{{$t('m.historyinfo.gotoInvest')}}</el-button>
        <el-tabs activeName="detail">
          <!--标的进度-->
          <el-tab-pane :label="$t('m.investingList.biaodijindu')" name="detail">
            <el-row>
              <el-col :span="6">
                <div class="detail-item">
                  <!--投资金额-->
                  <span>{{$t('m.investList.investSum')}}:</span>
                  <div>{{items.current_invest.amount / Math.pow(10, items.asset_to_loan.precision) | formatLegalCurrency(items.asset_to_loan.symbol, items.asset_to_loan.precision)}}</div>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="detail-item">
                  <!--投资进度-->
                  <span>{{$t('m.investList.investProgress')}}</span>
                  <div>
                    <el-progress :percentage="Math.floor(items.current_invest.amount / items.amount_to_loan.amount * 100)" color="#8e71c7" style="width: 200px; display: inline-block"></el-progress>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <!--距截标剩余时间-->
                  <span>{{$t('m.investList.remainingTime')}}:</span>
                  <div>{{items.expiration_time | dateDiffDay($store.state.curDate)}}</div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-tabs activeName="detail" >
          <!--标的信息-->
          <el-tab-pane :label="$t('m.borrowing.investInfo')" name="detail">
            <el-row>
              <el-col :span="10">
                <div class="detail-item">
                  <span>{{$t('m.borrow.loanAmount')}}:</span>
                  <div>{{items.amount_to_loan.amount / Math.pow(10, items.asset_to_loan.precision)  | formatLegalCurrency(items.asset_to_loan.symbol, items.asset_to_loan.precision)}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <div class="detail-item">
                  <!--借款时长-->
                  <span>{{$t('m.investingdetail.JKSC')}}:</span>
                  <div>{{items.loan_period}}{{$t('m.month')}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <div class="detail-item">
                  <!--利率-->
                  <span>{{$t('m.params.interestRate')}}:</span>
                  <div>{{items.interest_rate | converPercentage}}/{{$t('m.year')}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <div class="detail-item">
                  <!--发布时间-->
                  <span>{{$t('m.investingdetail.FBSJ')}}:</span>
                  <div>{{items.loan_time | formatDateStr}}</div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-tabs activeName="detail">
          <!--抵押信息:-->
          <el-tab-pane :label="$t('m.investingdetail.DYXX')" name="detail">
            <el-row  style="display: flex; flex: 1; flex-direction: row; align-items: center">
              <el-col :span="20">
                <div class="detail-item">
                  <!--抵押物数量-->
                  <span>{{$t('m.borrow.pawnNum')}}:</span>
                  <div>{{items.amount_to_collateralize.amount / Math.pow(10, items.asset_to_collateralize.precision) | formatDigitalCurrency(items.asset_to_collateralize.symbol, items.asset_to_collateralize.precision)}}</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="detail-item">
                  <!--增加抵押-->
                  <el-button type="primary" @click="addDYW(items)" v-show="showHistory">{{$t('m.borrow.addCollateral')}}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="detail-item">
                  <!--抵押物状态-->
                  <span>{{$t('m.borrow.collateralState')}}:</span>
                  <!--已冻结-->
                  <div>{{$t('m.borrow.frozen')}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="detail-item">
                  <collateralize-info :infoData="Object.assign({}, items, itemList)" :isFeed="true"></collateralize-info>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>

        </el-tabs>
        <el-tabs activeName="detail">
          <!--费用-->
          <el-tab-pane :label="$t('m.borrow.cost')" name="detail">
            <fee :data="feeData"></fee>
          </el-tab-pane>
        </el-tabs>
        <el-tabs activeName="detail" v-if="items.interest_book.length > 0">
          <!--投标信息-->
          <el-tab-pane :label="$t('m.investingdetail.toubiaoXX')" name="detail">
            <bidder :itemList="itemList"></bidder>
          </el-tab-pane>
        </el-tabs>
        <!--选择抵押物-->
        <mortage-dialog :element-loading-text="$t('m.loading')"
                        :ifShowDlg='addPawnDialog'
                        :datail="appointtemI"
                        @closeMortage="closeMortage"
                        v-if="addPawnDialog"
        ></mortage-dialog>
      </div>
    </div>
    <!--登录-->
    <login-dialog :visible="$store.state.loginPath !== undefined"></login-dialog>
  </div>
</template>
<script>
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import { loginToPath } from '/js-utils/until'
  import loginDialog from '/path-page/Login/loginDialog'
  export default {
    components: {
      mortageDialog,
      loginDialog,
      'bidder': () => import('/path-components/Lending/bidder'),
      'collateralizeInfo': () => import('/path-components/Lending/collateralizeInfo'),
      'fee': () => import('/path-components/Lending/fee')
    },
    data () {
      return {
        orderId: '',
        userName: '',
        userId: '',
        // 详情
        items: {},
        feeDis: {},
        feeData: {},
        itemList: {},
        // 增加抵押物的弹窗
        addPawnDialog: false,
        loading: true,
        initStatus: false,
        appointtemI: ''
      }
    },
    methods: {
      addInvestClick (orderId) {
        var loginPath = {
          path: '/investDetails',
          query: {
            id: orderId
          }
        }
        loginToPath(ZOSInstance, this, loginPath)
      },
      // 关闭增加抵押物
      closeMortage () {
        this.addPawnDialog = false
      },
      // 请求数据之后，把数据给data
      init () {
        if (this.initStatus === true) return
        this.initStatus = true
        this.orderId = this.$route.query.id
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }

        this.loading = true
        ZOSInstance.get_loan_object(this.orderId).then(res => {
          if (res) this.items = res
          this.feeData = res.feeData
          this.itemList = res.investorsList
          this.loading = false
        }).catch(error => {
          this.$message({
            message: error,
            type: 'error'
          })
          this.loading = false
        })
        // Ella
      },
      addDYW (item) {
        let itemObj = {}
        itemObj = item
        this.appointtemI = itemObj
        this.addPawnDialog = true
      }
    },
    computed: {
      showHistory () {
        if (window.location.hash.indexOf('history') !== -1) {
          return false
        } else {
          return true
        }
      },
      isCurrentUser () {
        return this.$store.state.userDataSid !== this.$route.query.accID
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
<style scoped lang="scss">
  .grid-container{
    height: auto;
    overflow: hidden;
    .detail-content{
      height: auto;
      overflow: hidden;
      padding: 22px 15px;
      background: #fff;
      .detail-item{
        height: auto;
        overflow: hidden;
        line-height: 30px;
        font-size: 14px;
        padding-left: 30px;
        >span{
          float: left;
          color: #333
        }
        >div{
          float: left;
          margin-left: 10px;
          color: #333;
        }
      }
    }
    .action-column{
      text-align: right;
    }
    .color-gred{
      color: #999;
    }
  }
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    background: #dedede;
    padding: 5px ;
  }
  .charts{
    width: 300px;
  }
  .bugpkJ {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    background-color: rgb(255, 255, 255);
    height: 100%;
    max-height: 100%;
    flex: 1 1 0%;
    overflow: hidden;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(218, 225, 233);
    border-image: initial;
  }
  .jvhNys {
    min-height: 300px;
    flex: 0 0 calc(100vh - 200px);
  }
  .UMJSF {
    background-color: rgb(244, 247, 250);
    padding: 24px;
  }
  .VsGOO {
    -webkit-box-align: center;
    align-items: center;
    flex-direction: column;
    flex: 1 1 auto;
  }
  .jyNVPQ{
    padding: 20px;
    background: #fff!important;
  }
</style>

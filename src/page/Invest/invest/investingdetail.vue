<template>
  <div class="grid-container">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div v-if="!loading">
        <div class="page-bread">
          <dt>
            <!--基本信息-->
            {{$t('m.invest.basic')}}
          </dt>
        </div>
        <div class="detail-content">
          <el-tabs activeName="detail">
            <!--收益信息-->
            <el-tab-pane :label="$t('m.orderList.shouyiXX')" name="detail">
              <el-row>
                <el-col :span="6">
                  <div class="detail-item">
                    <!--预计总收益-->
                    <span>{{$t('m.investingdetail.yujiZSY')}}:</span>
                    <div>{{investData.amount_to_invest.amount / Math.pow(10, investData.asset_to_loan.precision) * (investData.order_info.interest_rate / 10000 * investData.order_info.loan_period) | formatLegalCurrency(investData.asset_to_loan.symbol, investData.asset_to_loan.precision)}}</div>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="detail-item">
                    <!--预计收益率-->
                    <span>{{$t('m.investingdetail.yujiSYL')}}:</span>
                    <div>
                      {{(investData.order_info.interest_rate / 10 * investData.order_info.loan_period).toFixed(1)}}‰
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <el-tabs activeName="detail" >
            <!--借款信息-->
            <el-tab-pane :label="$t('m.borrowsuccess.information')" name="detail">
              <el-row>
                <el-col :span="10">
                  <div class="detail-item">
                    <span>{{$t('m.investingdetail.jieKR')}}:</span>
                    <div><router-link :to="{path: `/history/borrowHis?accName=${investData.order_info.issuer_info.name}&accID=${investData.order_info.issuer_info.id}`}">{{investData.order_info.issuer_info.name}}</router-link></div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <div class="detail-item">
                    <!--借款订单-->
                    <span>{{$t('m.investingdetail.borrowOrder')}}: </span>
                    <div><a @click="borrowOrderId">{{investData.order_info.id}}</a></div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <div class="detail-item">
                    <span>{{$t('m.borrow.loanAmount')}}:</span>
                    <div>{{investData.amount_to_loan.amount / Math.pow(10, investData.asset_to_loan.precision)  | formatLegalCurrency(investData.asset_to_loan.symbol, investData.asset_to_loan.precision)}}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <div class="detail-item">
                    <!--借款时长-->
                    <span>{{$t('m.investingdetail.JKSC')}}:</span>
                    <div>{{investData.order_info.loan_period}}{{$t('m.invest.perioduint' + investData.order_info.repayment_type.repayment_period_uint)}}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <div class="detail-item">
                    <!--借款利率-->
                    <span>{{$t('m.borrow.borrowRate')}}:</span>
                    <div>{{investData.interest_rate.interest_rate | converPercentage}}/{{$t('m.invest.perioduint' + investData.order_info.repayment_type.repayment_period_uint)}}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <div class="detail-item">
                    <!--发布时间-->
                    <span>{{$t('m.investingdetail.FBSJ')}}:</span>
                    <div>{{investData.order_info.loan_time | formatDateStr}}</div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>


          <el-tabs activeName="detail">
            <!--抵押信息-->
            <el-tab-pane :label="$t('m.investingdetail.DYXX')" name="detail">
              <el-row>
                <el-col :span="20">
                  <div class="detail-item">
                    <!--抵押物数量-->
                    <span>{{$t('m.borrow.pawnNum')}}:</span>
                    <div>{{investData.amount_to_collateralize.amount / Math.pow(10, investData.asset_to_collateralize.precision)  | formatDigitalCurrency(investData.asset_to_collateralize.symbol, investData.asset_to_collateralize.precision)}}</div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="detail-item">
                  <!--增加投资-->
                    <el-button type="primary" @click="handleClick(investData.order_info.id)">{{$t('m.investList.addInvest')}}</el-button>
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <div class="detail-item">
                    <!--抵押物状态-->
                    <span>{{$t('m.borrowsuccess.pawnState')}}:</span>
                    <div>{{$t('m.orderList.freeze')}}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="detail-item">
                    <collateralize-info :infoData="investData.order_info"></collateralize-info>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>

          </el-tabs>

          <el-tabs activeName="detail">
            <!--投资信息-->
            <el-tab-pane :label="$t('m.invest.info')" name="detail">
              <bidder :itemList="itemList"></bidder>
            </el-tab-pane>
          </el-tabs>
          <el-tabs activeName="detail">
            <!--费用-->
            <el-tab-pane :label="$t('m.borrow.cost')" name="detail">
              <fee :data="feeData"></fee>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import mortageDialog from '/path-components/Chain/mortageDialog'
  import {ZOSInstance, LendInstance} from 'zos-wallet-js'
  export default {
    components: {
      mortageDialog,
      'bidder': () => import('/path-components/Lending/bidder'),
      'collateralizeInfo': () => import('/path-components/Lending/collateralizeInfo'),
      'fee': () => import('/path-components/Lending/fee')
    },
    data () {
      return {
        tablePrincipal: [],
        investData: [],
        orderData: [],
        loading: true,
        feeDis: {},
        itemList: {},
        userName: '',
        userId: '',
        investId: '',
        orderId: '',
        // 费用
        feeData: {},
        addPawnDialog: false
      }
    },
    methods: {
      // 请求数据之后，把数据给data
      init () {
        if (this.$route.query.accName || this.$route.query.accID) {
          this.userName = this.$route.query.accName
          this.userId = this.$route.query.accID
        } else {
          this.userName = this.$store.state.userName
          this.userId = this.$store.state.userDataSid
        }

        this.loading = true
        this.investId = this.$route.query.id
        ZOSInstance.get_invest_object(this.investId).then(res => {
          this.investData = res
          this.orderId = res.order_info.id
          this.orderData = res.order_info
          this.feeData = this.orderData.feeData
          this.tablePrincipal = this.orderData.tablePrincipal
          this.feeDis = this.orderData.feeDis
          this.itemList = this.orderData.investorsList
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.$message.error({
            message: err
          })
        })
      },
      handleClick (orderId) {
        this.$router.push({
          path: '/investDetails',
          query: {
            id: orderId,
            accName: this.userName,
            accID: this.userId
          }
        })
      },
      // 跳借款订单
      borrowOrderId () {
        this.$router.push({
          path: '/history/borrowHis/borrowingdetail',
          query: {
            id: this.investData.order_info.id,
            accName: this.investData.order_info.issuer_info.name,
            accID: this.investData.order_info.issuer_info.id
          }
        })
      },
      expectedTotal (row) {
        return LendInstance.expectedTotal(row)
      }
    },
    mounted () {
      this.loading = true
      if (this.$store.state.initFinished) {
        this.init()
      }
      this.$root.$on('initFinished', (data) => {
        this.init()
      })
    }
  }
</script>
<style scoped lang="scss">
  .el-tab-pane{
    padding: 10px;
  }
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
</style>

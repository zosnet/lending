<template>
  <div slot="content" class="container-params" v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div style="flex:1"></div>
    <div v-if="loading <= 0 ">
    </div>
      <div class="separ">
              <dt class="lh40 feel">
            <span>
              <!--借款利率-->
              {{$t('m.borrow.borrowRate')}}
            </span>
                <div style="flex:1"></div>
                <el-button type="primary" @click="tableDataInterestShow=!tableDataInterestShow">
                <!-- <el-button type="primary"  @click="tableDataInterestShow=!tableDataInterestShow"> -->
                  <!--修改-->
                  {{$t('m.params.update')}}
                </el-button>
                <div v-if="!tableDataInterestShow">
                  <!--提交-->
                  <el-button type="primary" :disabled="!isEdit" @click="submitInterest">{{$t('m.params.submit')}}</el-button>
                  <el-button @click="interestCancel">{{$t('m.cancel')}}</el-button>
                </div>
              </dt>
              <!--借款利率-->
              <dd>
                <el-table
                  :data="tableDataInterest"
                  style="width: 100%"
                  stripe
                  id="canelInvest"
                >
                  <!--参数名称-->
                  <el-table-column
                    :label="$t('m.params.name')"
                    style="width: 45%"
                    prop="bid"
                  >
                    <template slot-scope="scope">
                      {{$t('m.params.nper')}}
                      <el-input v-model="scope.row.bid"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataInterestShow}"
                                v-if="scope.row.add"
                                @keyup.native="scope.row.bid < 1 || scope.row.bid > parameter.max_rate_month ? scope.row.bid = '' : scope.row.bid = Number(scope.row.bid.replace(/[^\d]/g, ''))"
                                style="width: 70%"
                      ></el-input>
                      <span v-else>
                 {{scope.row.bid}}
                </span>
                      <!--期-->
                      {{typeKeyUint}}
                    </template>
                  </el-table-column>
                  <!--参数值(年化-->
                  <el-table-column
                    :label="$t('m.params.interestRate') + '(' + typeKeyUint + ')'"
                    style="width: 10%"
                    prop="interest_rate"
                  >
                    <template slot-scope="scope" class="feel">
                    <span v-if="scope.row.interest_rate !== 'N/A'">{{scope.row.interest_rate}}‰</span>
                    </template>
                  </el-table-column>
                  <!--修改后-->
                  <el-table-column
                    :label="$t('m.params.updateAfter')"
                    style="width: 25%;"
                    prop="newValue"
                    v-if="!tableDataInterestShow"
                  >
                    <template slot-scope="scope" class="feel">
                      <el-input v-model="scope.row.newValue"
                                :readonly="scope.row.updatestatus ? false : true"
                                :disabled="scope.row.updatestatus ? false : true"
                                :class="{showborder: !tableDataInterestShow}"
                                @blur="interestFixed(scope.row)"
                                @keyup.native="scope.row.newValue > maxRate? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/[^\.\d]/g, '')"
                                style="width: 80%"
                      ></el-input>
                      <span>
                  ‰
                </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="!tableDataInterestShow"
                    width="100px"
                  >
                    <template slot-scope="scope">
                      <!--恢复-->
                      <el-button
                        size="mini"
                        type="primary"
                        @click="delRow(scope)" v-if="!scope.row.updatestatus">{{$t('m.params.restore')}}</el-button>
                      <!--删除-->
                      <el-button
                        size="mini"
                        type="danger"
                        @click="resoreRow(scope)" v-else-if="scope.row.updatestatus">{{$t('m.params.del')}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>
              <dd class="text-center" v-if="!tableDataInterestShow">
                <i class="el-icon-circle-plus-outline margin-t10" style="font-size: 30px" @click="addInterest"></i>
              </dd>
            </div>

     <!--修改利率确认-->
    <el-dialog
      :title="$t('m.params.updateRate')"
      :visible.sync="interestDialog"
      width="45%"
    >
      <div v-loading="loadingss" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vh;">
        <dl class="demo-ruleForm">
          <!--修改内容-->
          <dt>{{$t('m.params.updateContent')}}</dt>
          <dd style="padding: 10px">{{interestContent}}</dd>
          <!--修改人-->
          <dt>{{$t('m.params.updateUser')}}</dt>
          <dd>
            <el-input :value="username" readonly></el-input>
          </dd>
          <!--修改时间-->
          <dt>{{$t('m.params.updateTime')}}</dt>
          <dd><el-input :value="Date.parse(new Date()) | formatProposalTime()" readonly></el-input></dd>
          <!--手续费-->
          <dt>2.{{$t('m.params.poundage')}}</dt>
          <dd>
            <div class="feel">
              <!--燃料费-->
              <!--(约)-->
              <span>{{$t('m.fuelCost')}}: {{interestFeeZos}} ZOS{{$t('m.transfer.about')}}</span>
              <span style="flex: 1"></span>
              <!--可用数量-->
              <span>{{$t('m.transfer.KYSL')}}: {{available}} ZOS</span>
              <!--获得-->
              <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
            </div>
          </dd>
          <!--数量不足-->
          <dd v-show="zosShow(interestFeeZos)" style="color: #ff0000">ZOS{{$t('m.transfer.numNull')}}</dd>
          <dd>
            <div class="feel">
          <span>
            <!--系统将优先使用优惠券抵扣-->
            {{$t('m.transfer.useCoupons')}}
          </span>
              <span style="flex: 1"></span>
              <!--优惠券数量-->
              <span>{{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS</span>
              <a class="margin-l10" @click="couponVisible=true">
                <!--关于优惠券-->
                {{$t('m.transfer.abountCoupons')}}
              </a>
            </div>
          </dd>
          <dd class="margin-t10 text-right">
            <y-button
              :text="$t('m.cancel')"
              @btnClick="interestDialog=false"
            ></y-button>
            <y-button
              :text="$t('m.sure')"
              @btnClick="interestSubmit"
              :classStyle="zosShow(interestFeeZos) ? 'disabled-btn' : 'main-btn'"
            ></y-button>
          </dd>
        </dl>
      </div>
    </el-dialog>
    <!--获得ZOS-->
    <getzosdialog @isVisible="isZosVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
          <!--关于优惠-->
    <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>
    <!--输入资金密码-->
    <!-- <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendInterest"></password-dialog> -->
    </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  // import {Apis} from 'zosjs-ws'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import formatAssets from '/js-api/public'
  import YButton from '/path-components/element/YButton'
  export default {
    name: 'rate',
    components: {passwordDialog, getzosdialog, couponDialog, YButton},
    props: {
      optionId: '',
      symbol: '',
      selectedSymbol: {},
      Type: '',
      assetId: '',
      hoptions: ''
    },
    computed: {
      available () {
        let assetsArr = formatAssets.formatAssets('ZOS')
        if (!assetsArr || assetsArr.length === 0) {
          return 0
        } else {
          return assetsArr[0].amount
        }
      },
      // zos燃料费，够不够
      zosShow (fee) {
        return function (fee) {
          return this.available + this.$store.state.coupon.amount < fee
        }
      }
    },
    data () {
      return {
        loading: 1,
        canEdit: false,
        comfirmPassword: false,
        tableDataParamsShow: true,
        author: '',
        maxRate: '',
        parameter: '',
        issuerRate: '',
        tr: '',
        proposalContent: {},
        proposalTime: '',
        feeZos: '',
        loadingss: false,
        tableDataInterestShow: true,
        // 利率
        tableDataInterest: [],
        // 复制
        tableDataInterestCopy: [],
        isuerRateName: [],
        params: {},
        feedOption: {},
        proposalDialog: false,
        zosDialog: false,
        couponVisible: false,
        interestTr: {},
        typeKeyUint: '',
        interestFeeZos: '',
        interestDialog: false,
        isEdit: false,
        ratesMsg: '',
        dialogVisible: false
      }
    },
    methods: {
      // 关闭zos
      isZosVisible () {
        this.zosDialog = false
      },
      // 关闭优惠
      couponClose () {
        this.couponVisible = false
      },
      paramsEdit () {
        this.tableDataParamsShow = !this.tableDataParamsShow
      },
      setEdit (st) {
        this.isEdit = st
      },
      canLeave () {
        return this.isEdit === false
      },
      // 是否可是修改利率
      isUpdateInterest () {
        return this.issuerRate === this.$store.state.userDataSid
      },
      changeOption (id, assetId, type, selectedSymbol) {
        this.assetId = assetId
        this.optionId = id
        this.Type = type
        this.selectedSymbol = selectedSymbol
        this.loading = 1
        // this.parameterLimits()
        this.getConfig()
        this.loading--
      },
      // 系统参数限制
      parameterLimits () {
        this.loading++
        ZOSInstance.get_bitlender_paramers(this.Type).then(res => {
          if (res) this.parameter = res.options
          this.loading--
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
          this.loading--
        })
      },
      // 利率最多只能输入一位小数
      interestFixed (item, precision = 1, isZero = 1) {
        if (item.newValue && item.newValue > 0) {
          if (!/^[+]{0,1}([1-9])$|^[+]{0,1}(\d+\.?\d{1})$/.test(item.newValue)) {
            this.$message({
              message: this.$t('m.params.decimal'),
              type: 'error'
            })
            item.newValue = ''
          } else {
            this.isEdit = true
          }
        } else {
          if (isZero === 1 && item.newValue !== '') {
            item.newValue = ''
            this.$message({
              message: this.$t('m.params.greater'),
              type: 'error'
            })
          }
        }
      },
      getConfig () {
        this.loading++
        // ----------let typeKey = ZOSInstance.getOptionKey(this.Type)
        this.typeKeyUint = this.$t('m.locktoken.locktokenfixed')
        // ----------ZOSInstance.getBitlenderOption(this.assetId, this.Type).then(res => {
        ZOSInstance.getBitlenderOption('1.3.20', '33').then(res => {
          if (!res) {
            this.loading--
            return
          }
          console.log('得到的数据', res)
          this.params = res.options
          this.feedOption = res.feed_option
          // this.maxRate = this.params.max_repayment_rate / 10
          this.maxRate = 50
          // 利率的查询数据
          this.tableDataInterest = []
          this.issuerRate = res.options.issuer_rate
          //   ----------res.interest_rate.forEach((val) => {
          this.hoptions.locktoken_rates.forEach((val) => {
            let json = {}
            json.bid = val[0]
            // 因为基数为(10000),显示‰
            // ----------json.interest_rate = val[1].interest_rate / 10
            json.interest_rate = val[1][0][1] / 10
            // decimalPlaces: '只能输入1位小数,不能为0,不能超过'
            json.errMessage = this.$t('m.params.decimalPlaces') + this.maxRate
            json.newValue = ''
            json.updatestatus = true
            this.tableDataInterest.push(json)
          })
          // 复制一份利率的数据，以区别新增
          this.tableDataInterestCopy = [...this.tableDataInterest]
          ZOSInstance.get_account(this.params.issuer_rate).then(dataRate => {
            this.isuerRateName.push(dataRate.get('name'))
            this.loading--
          }).catch(errors => {
            this.loading--
            console.log(errors)
            this.$message({
              message: errors,
              type: 'warning'
            })
          })
        }).catch(errors => {
          this.loading--
          console.log(errors)
          this.$message({
            message: errors,
            type: 'warning'
          })
        })
      },
      delRow (scope) {
        scope.row.updatestatus = !scope.row.updatestatus
        this.isEdit = true
      },
      resotreRow (scope) {
        scope.$index >= this.tableDataInterestCopy.length ? this.tableDataInterest.splice(scope.$index, 1) : scope.row.updatestatus = !scope.row.updatestatus
        this.isEdit = true
      },
      // 利率添加
      addInterest () {
        let interestOne = {
          bid: '',
          interest_rate: 'N/A',
          newValue: '',
          add: true,
          updatestatus: true
        }
        this.tableDataInterest.push(interestOne)
        this.isEdit = true
      },
      // 利率的修改取消
      interestCancel () {
        if (this.unRouterChange) {
          this.nexts = 1
          this.confirmVisible = true
          return
        }
        this.isEdit = false
        this.setEdit(this.isEdit)
        this.loading = 1
        // this.parameterLimits()
        this.getConfig()
        this.loading--
        this.tableDataInterestShow = true
        this.dialogVisible = false
      },
      // 提交利率修改
      submitInterest () {
        this.updateInterest = []
        this.delInterest = []
        this.interestContent = {}
        let popArr = []
        let copyArr = []
        // let updateArr = []
        let oldArr = []
        // 最后一个，是否很新增
        popArr = [...this.tableDataInterest]
        // 为了得到新增的
        copyArr = [...this.tableDataInterest]
        // 更新的
        // updateArr = [...this.tableDataInterest]
        oldArr = [...this.tableDataInterest]
        // popArr.pop().add最后一个,如果add.true证明有新增的
        if (popArr.pop().add) {
          // 1.有一个新增的为空都返回
          copyArr.splice(0, this.tableDataInterestCopy.length)
          let isNull = copyArr.some((val) => {
            return val.bid === '' || val.newValue === ''
          })
          if (isNull) {
            this.$message({
              type: 'warning',
              // 新增的期数或利率值没有填写
              message: this.$t('m.params.newPeriods')
            })
            return
          }
          // 2.只是新增的两个相同
          if ([...new Set(this.findBid(copyArr))].length !== this.findBid(copyArr).length) {
            this.$message({
              type: 'warning',
              // '有相同的期数'
              message: this.$t('m.params.samePeriods')
            })
            return
          }
          // 新增的与已有
          let isold = oldArr.filter((old) => {
            if (old.updatestatus) {
              return old
            }
          })
          // 3.新增的与已有的没有删除的相同
          if ([...new Set(this.findBid(isold))].length !== this.findBid(isold).length) {
            this.$message({
              type: 'warning',
              // '有相同的期数'
              message: this.$t('m.params.samePeriods')
            })
            return
            // 4.新增的与已有的删除的相同
          } else {
            isold.forEach((pval) => {
              if (pval.newValue !== '') {
                let key = pval.bid
                let param = []
                param[0] = key
                // param[1] = {interest_rate: pval.newValue * 10}
                param[1] = []
                param[1][0] = [1, pval.newValue * 10]
                this.updateInterest.push(param)
              }
            })
            let isDel = oldArr.filter((del) => {
              if (!del.updatestatus) {
                return del
              }
            })
            isDel.forEach((iv) => {
              this.delInterest.push(iv.bid)
            })
            if (this.delInterest.length < 1 && this.updateInterest.length < 1) {
              this.$message({
                type: 'warning',
                // '没有任何修改'
                message: this.$t('m.params.noupdate')
              })
              return
            }
            this.comfirmPassword = true
          }
        } else {
          this.tableDataInterest.forEach((val, index) => {
            if (!val.updatestatus) {
              this.delInterest.push(val.bid)
            }
            if (val.newValue !== '' && val.updatestatus) {
              let key = val.bid
              let param = []
              param[0] = key
              // param[1] = {interest_rate: val.newValue * 10}
              param[1] = []
              param[1][0] = [1, val.newValue * 10]
              this.updateInterest.push(param)
            }
          })
          if (this.delInterest.length < 1 && this.updateInterest.length < 1) {
            this.$message({
              type: 'warning',
              // '没有任何修改'
              message: this.$t('m.params.noupdate')
            })
            return
          }
          this.comfirmPassword = true
        }
        let delInterestCopy = [...this.delInterest]
        let updateInterestCopy = [...this.updateInterest]
        let updateInterestBid = updateInterestCopy.map((val) => {
          return val[0]
        })

        this.ratesMsg = updateInterestCopy
        this.$emit('func', this.ratesMsg, this.dialogVisible)
        this.delSame(updateInterestBid, delInterestCopy)
        this.delInterest = delInterestCopy
        if (this.delInterest.length < 1 && this.updateInterest.length < 1) {
          this.$message({
            type: 'warning',
            // '没有任何修改'
            message: this.$t('m.params.noupdate')
          })
          return
        }
        this.comfirmPassword = true
        this.delInterest.forEach((val) => {
          // '期利率'
          let keys = this.$t('m.params.the') + val + this.$t('m.params.nper') + this.$t('m.params.interestRate')
          // '删除'
          this.interestContent[keys] = this.$t('m.params.deleteFirst')
        })
        this.updateInterest.forEach(val => {
          // '修改第'
          let keys = this.$t('m.params.update') + this.$t('m.params.the') + val[0] + this.$t('m.params.nper') + this.$t('m.params.interestRate')
          this.interestContent[keys] = val[1].interest_rate / 10 + '‰'
        })
      },
      // 所有元素的bid
      findBid (arr) {
        return arr.map((val) => {
          return val.bid
        })
      },
      // 删除一个数组中在别一个数组中相同的元素
      delSame (arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            if (arr2[j] === arr1[i]) {
              arr2.splice(j, 1)
            }
          }
        }
      },
      // 输入错误的提示
      errorMessage (item) {
        item.newValue = ''
        this.$message({
          message: this.$t('m.params.maxRate') + this.maxRate,
          type: 'error'
        })
      },
      // 提交到链修改
      bitlenderLendInterest (data) {
        if (data) {
          // let updateInterestCopy = [...this.updateInterest]
          //   let param = []
          //   param[0] = 1000
          //   param[1] = {interest_rate: Number(this.Type)}
          //   updateInterestCopy.push(param)

        //   ZOSInstance.bitlender_rate_update(this.optionId, this.$store.state.userDataSid, updateInterestCopy, this.delInterest)
        //     .then(res => {
        //       if (res) {
        //         this.comfirmPassword = false
        //         this.interestTr = res.tr
        //         this.interestFeeZos = res.fee.fee_amount / Math.pow(10, res.fee.fee_precision)
        //         this.interestDialog = true
        //       }
        //     })
        //     .catch(err => {
        //       this.comfirmPassword = false
        //       console.log(err)
        //       this.$message({
        //         type: 'warning',
        //         message: err
        //       })
        //     })
        } else {
          this.comfirmPassword = false
        }
      },
      // 确认修改利率，并广播
      interestSubmit () {
        this.loadingss = true
        ZOSInstance.broadcastTransaction(this.interestTr)
          .then(res => {
            this.loadingss = false
            if (res) {
              this.$message({
                type: 'success',
                // '提交成功'
                message: this.$t('m.badloans.subSucc')
              })
              this.interestDialog = false
              this.init()
              this.tableDataInterestShow = !this.tableDataInterestShow
              this.unRouterChange = false
            }
          })
          .catch(err => {
            this.loadingss = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
          })
      },
      init () {
        this.loading = 1
        // this.parameterLimits()
        this.getConfig()
        this.loading--
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
.leftpanel{
      display: flex;
      flex:1;
      width: 50%!important;
      flex-direction: row;
}
.box-card {
   width: 49.5%;
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
.account .el-card{
  background: #fff!important;
}
.layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

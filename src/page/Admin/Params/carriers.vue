<template>
  <div  slot="content" class="container-params" v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div   style="flex:1"></div>
    <div v-if="loading <= 0 ">
     <dt class="lh40 feel">
      <div style="flex:1"></div>
      <!--提交-->
      <el-button type="primary" v-if="tableDataParamsShow && canEdit" @click="paramsEdit()">
      {{$t('m.params.update')}}
      </el-button>
      <div v-if="!tableDataParamsShow">
        <el-button type="primary" :disabled="!isEdit" @click="sumbitParms">{{$t('m.params.submit')}} </el-button>
        <el-button @click="paramsCancel">{{$t('m.cancel')}}</el-button>
      </div>
     </dt>

    </div>
    <div class="jvhNys UMJSF VsGOO account">
      <div class="layout">
        <el-card class="box-card">
          <div  v-if="tableDataParamsShow">{{$t('m.params.loanCarrier')}}</div>
          <div slot="header" class="clearfix" v-if="!tableDataParamsShow">
            <!-- 选择运营商 -->
            <div class="feel">
              <div> {{$t('m.params.loanCarrier')}}
                <el-select v-model="loan_select" :placeholder="$t('m.params.chooseCarrier')">
                  <el-option
                    v-for="item in allCarriers"
                    :key="item.id"
                    :label="item.name"
                    :disabled="!is_loan_enable(item.id)"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <span style="flex:1"></span>
              <div style="flex: 1; margin-right: 20px" class="text-right">
                <!--增加运营商-->
                <el-button size="small" type="primary"  @click="add_loan(loan_select)">{{$t('m.params.addCarrier')}}</el-button>
              </div>
          </div>
          </div>
          <div class="ZHZZL" >
            <div v-for="(item,index) in loan_carriers" :key="index">
              <div class="hgJtCZ">
                <div class="fAptwk">
                  <div style="flex: 1;padding: 2px" >
                    <span style="height: 35px;line-height: 35px">{{item.name}}</span>
                    <span style="flex: 1; float:right; margin-right: 20px" class="text-right" v-if="!tableDataParamsShow">
                    <!--删除运营商-->
                      <el-button size="small" type="danger" @click="del_loan(item.id)">{{$t('m.params.del')}}</el-button>
                     </span>
                  </div>
                </div>
              </div>
            </div>
            <!--暂无数据-->
            <span v-if="loan_carriers.length <=0 ">{{$t('m.noData')}}</span>
          </div>
        </el-card >
        <el-card class="box-card" style="background: #fff">
          <div  v-if="tableDataParamsShow">{{$t('m.params.investCarrier')}}</div>
          <div slot="header" class="clearfix"  v-if="!tableDataParamsShow">
             <!-- 选择运营商 -->
            <div class="feel">
              <div>{{$t('m.params.investCarrier')}}
                <el-select v-model="invest_select" :placeholder="$t('m.params.chooseCarrier')">
                  <el-option
                    v-for="item in allCarriers"
                    :key="item.id"
                    :label="item.name"
                    :disabled="!is_invest_enable(item.id)"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <span style="flex:1"></span>
              <div style="flex: 1; margin-right: 20px" class="text-right" >
                <!--增加运营商-->
                <el-button size="small" type="primary"  @click="add_invest(invest_select)">{{$t('m.params.addCarrier')}}</el-button>
              </div>
          </div>
          </div>
          <div class="ZHZZL" >
            <div v-for="(item,index) in invest_carriers" :key="index">
              <div class="hgJtCZ">
                <div class="fAptwk">
                  <div style="flex: 1;padding: 2px">
                    <span style="height: 35px;line-height: 35px">{{item.name}}</span>
                    <span style="flex: 1; float:right; margin-right: 20px" class="text-right" v-if="!tableDataParamsShow">
                      <el-button size="small" type="danger" @click="del_invest(item.id)">{{$t('m.params.del')}}</el-button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!--暂无数据-->
            <span v-if="invest_carriers.length <=0 ">{{$t('m.noData')}}</span>
          </div>
        </el-card>
      </div>
    </div>
     <!--创建参数修改提案-->
    <el-dialog
      :title="$t('m.params.proposal')"
      :visible.sync="proposalDialog"
      width="45%"
    >
    <div v-loading="commitloadings" :element-loading-text="$t('m.borrow.submiting')" style="min-height: 10vh;">
      <dl class="demo-ruleForm">
          <!--复审期开始-->
          <dt>{{$t('m.params.review')}}</dt>
          <dd><el-input value="-" readonly></el-input></dd>
          <!--提案内容-->
          <dt>{{$t('m.params.proposalContent')}}</dt>
          <dd style="padding: 10px">
            {{proposalContent}}
          </dd>
          <dt>
            <!--到期时间-->
            {{$t('m.params.Due')}}
          </dt>
          <dd><el-input :value="proposalTime * 1000 | formatProposalTime()" readonly></el-input></dd>
          <!--付款账户-->
          <dt>{{$t('m.params.payAccount')}}</dt>
          <dd><el-input :value="$store.state.userName" readonly></el-input></dd>
          <dt>2.
            <!--手续费-->
            {{$t('m.params.poundage')}}
          </dt>
          <dd>
            <div class="feel">
              <!--燃料费-->
              <!--(约)-->
              <span>{{$t('m.fuelCost')}}: {{feeZos}} ZOS{{$t('m.transfer.about')}}</span>
              <span style="flex: 1"></span>
              <!--可用数量-->
              <span>{{$t('m.transfer.KYSL')}}: {{available}} ZOS</span>
              <!--获得-->
              <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
            </div>
          </dd>
          <!--数量不足-->
          <dd v-show="zosShow(feeZos)" style="color: #ff0000">ZOS{{$t('m.transfer.numNull')}}</dd>
          <dd>
            <div class="feel">
              <span>
                <!--系统将优先使用优惠券抵扣-->
                {{$t('m.transfer.useCoupons')}}
              </span>
              <span style="flex: 1"></span>
              <span>
                <!--优惠券数量-->
                {{$t('m.transfer.couponsNum')}}: {{$store.state.coupon.amountstr}} ZOS</span>
              <a class="margin-l10" @click="couponVisible=true">
                <!--关于优惠券-->
                {{$t('m.transfer.abountCoupons')}}
              </a>
            </div>
          </dd>
          <!--获得ZOS-->
          <getzosdialog @isVisible="isZosVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
          <!--关于优惠-->
          <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>
          <dd class="margin-t10 text-right">
            <y-button
              :text="$t('m.cancel')"
              @btnClick="proposalDialog=false"
            ></y-button>
            <!--创建-->
            <y-button
              :text="$t('m.params.create')"
              @btnClick="proposalSubmit"
              :classStyle="zosShow(feeZos) ? 'disabled-btn' : 'main-btn'"
            ></y-button>
          </dd>
        </dl>
      </div>
    </el-dialog>
    <!--输入资金密码-->
    <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="_comfirmPassword"></password-dialog>
    <!-- <password-dialog :visible="submitRatioPW" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog> -->
    <!-- <confirm-dialog :carrierVisible="carrierVisible" @submitCarrier="submitRatioTr" :carrierUpdate="updateContents"></confirm-dialog> -->
  </div>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import formatAssets from '/js-api/public'
  import YButton from '/path-components/element/YButton'
  // import {getStore, setStore} from '/js-utils/storage'
  // import deepClone from '/js-utils/deepClone'
  export default {
    name: 'carriers',
    components: {passwordDialog, getzosdialog, couponDialog, YButton},
    props: {
      optionId: '',
      Type: '',
      assetId: ''
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
        commitloadings: false,
        canEdit: false,
        comfirmPassword: false,
        tableDataParamsShow: true,
        updateParamsShow: false,
        allCarriers: [],
        invest_carriers: [],
        loan_carriers: [],
        invest_carriers_: [],
        loan_carriers_: [],
        loan_select: '',
        invest_select: '',
        options: {},
        author: '',
        tr: '',
        proposalContent: {},
        proposalTime: '',
        feeZos: '',
        proposalDialog: false,
        zosDialog: false,
        couponVisible: false,
        isEdit: false
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
      is_loan_enable (x) {
        let y = this.loan_carriers.filter((val) => {
          return x === val.id
        })
        return y.length === 0
      },
      is_invest_enable (x) {
        let y = this.invest_carriers.filter((val) => {
          return x === val.id
        })
        return y.length === 0
      },
      sumbitParms () {
        if (!this.isEdit) {
          this.$message({
            type: 'warning',
            message: this.$t('m.params.noupdate')
          })
          return
        }
        this.comfirmPassword = true
      },
      // 提交提案
      proposalSubmit () {
        this.commitloadings = true
        ZOSInstance.broadcastTransaction(this.tr)
          .then(res => {
            this.commitloadings = false
            this.proposalDialog = false
            if (res) {
              this.$message({
                type: 'success',
                // '提交提案成功'
                message: this.$t('m.params.proposalsSucc')
              })
              this.updateParamsShow = false
              this.tableDataParamsShow = true
              this.isEdit = false
              this.setEdit(this.isEdit)
            }
          })
          .catch(err => {
            this.commitloadings = false
            this.proposalDialog = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
          })
      },
      _proposalContent () {
        let lc = ''
        for (var i1 = 0; i1 < this.loan_carriers.length; i1++) {
          lc += this.loan_carriers[i1].name + ', '
        }
        this.proposalContent[this.$t('m.params.loanCarrier')] = lc
        let ic = ''
        for (var i2 = 0; i2 < this.invest_carriers.length; i2++) {
          ic += this.invest_carriers[i2].name + ', '
        }
        this.proposalContent[this.$t('m.params.investCarrier')] = ic
      },
      _comfirmPassword (data) {
        if (data) {
          ZOSInstance.bitlender_option_carriers_update(this.$store.state.userDataSid,
            this.author,
            this.optionId,
            this.options,
            this.loan_carriers,
            this.invest_carriers
          ).then(d => {
            this.comfirmPassword = false
            if (d) {
              this.tr = d.tr
              this.proposalTime = d.tr.operations[0][1].expiration_time
              this.feeZos = d.fee.fee_amount / Math.pow(10, d.fee.fee_precision)
              this._proposalContent()
              this.proposalDialog = true
            }
          }).catch(e => {
            this.comfirmPassword = false
            console.log(e)
            this.$message({
              type: 'warning',
              message: e
            })
          })
        } else {
          this.comfirmPassword = false
        }
      },
      paramsEdit () {
        this.tableDataParamsShow = !this.tableDataParamsShow
        this.updateParamsShow = true
        this.invest_carriers_ = [...this.invest_carriers]
        this.loan_carriers_ = [...this.loan_carriers]
      },
      paramsCancel () {
        this.updateParamsShow = false
        this.tableDataParamsShow = true
        this.isEdit = false
        this.setEdit(this.isEdit)
        this.invest_select = ''
        this.loan_select = ''
        this.invest_carriers = [...this.invest_carriers_]
        this.loan_carriers = [...this.loan_carriers_]
      },
      setEdit (st) {
        this.isEdit = st
      },
      canLeave () {
        return this.isEdit === false
      },
      changeOption (id, assetId, type) {
        this.assetId = assetId
        this.paramsCancel()
        this.optionId = id
        this.Type = type
        this.loading = 1
        this._getConfig()
        this._getOptions()
        this.loading--
      },
      add_loan (x) {
        let y = this.allCarriers.filter((val) => {
          return this.loan_select === val.id
        })
        if (y.length === 0) {
          this.$message({
            message: this.$t('m.params.chooseCarrier'),
            type: 'error'
          })
        }
        let object = {
          id: y[0].id,
          name: y[0].name
        }
        this.loan_carriers.push(object)
        this.loan_select = ''
        this.setEdit(true)
      },
      add_invest (x) {
        let y = this.allCarriers.filter((val) => {
          return this.invest_select === val.id
        })
        if (y.length === 0) {
          this.$message({
            message: this.$t('m.params.chooseCarrier'),
            type: 'error'
          })
        }
        let object = {
          id: y[0].id,
          name: y[0].name
        }
        this.invest_carriers.push(object)
        this.invest_select = ''
        this.setEdit(true)
      },
      del_loan (x) {
        this.loan_carriers.forEach((item, index) => {
          if (item.id === x) {
            this.loan_carriers.splice(index, 1)
            this.setEdit(true)
          }
        })
      },
      del_invest (x) {
        this.invest_carriers.forEach((item, index) => {
          if (item.id === x) {
            this.invest_carriers.splice(index, 1)
            this.setEdit(true)
          }
        })
      },
      init () {
        this.loading = 1
        this._getConfig()
        this._getOptions()
        this._getCarriers()
        this.loading--
      },
      _getCarriers () {
        this.loading++
        Apis.instance().db_api().exec('lookup_accounts_by_property', [0x00000002, 1000]).then((carrier) => {
          this.allCarriers = carrier
          this.loading--
        }).catch(errmess => {
          this.loading--
          this.$message({
            message: errmess,
            type: 'error'
          })
        })
      },
      _getOptions () {
        this.loading++
        ZOSInstance.getBitlenderOption(this.assetId, this.Type).then(res => {
          this.options = res.options
          this.author = res.author
          Apis.instance().db_api().exec('get_objects', [res.options.invest_carriers]).then(data1 => {
            this.invest_carriers = []
            data1.forEach(_item => {
              let object = {
                id: _item.id,
                name: _item.name
              }
              this.invest_carriers.push(object)
            })
            this.loading--
          }).catch(errmess => {
            this.loading--
            this.$message({
              message: errmess,
              type: 'error'
            })
          })
          this.loading++
          Apis.instance().db_api().exec('get_objects', [res.options.loan_carriers]).then(data2 => {
            this.loan_carriers = []
            data2.forEach(_item => {
              let object = {
                id: _item.id,
                name: _item.name
              }
              this.loan_carriers.push(object)
            })
            this.loading--
          }).catch(errmess => {
            this.loading--
            this.$message({
              message: errmess,
              type: 'error'
            })
          })
          this.loading--
        }).catch(errmess => {
          this.loading--
          this.$message({
            message: errmess,
            type: 'error'
          })
        })
      },
      _getConfig () {
        if (this.$store.state.userDataSid !== '' && this.optionId !== '') {
          this.loading++
          ZOSInstance.can_edit_bitlender_option(this.optionId, this.$store.state.userDataSid, this.Type).then(edit => {
            this.canEdit = edit
            this.loading--
          }).catch(errmess => {
            this.loading--
            this.$message({
              message: errmess,
              type: 'error'
            })
          })
        } else {
          this.canEdit = false
        }
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

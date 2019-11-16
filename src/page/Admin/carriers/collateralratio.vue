<template>
  <div slot="content" class="container-params" v-loading="loading>0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
  <dl>
    <dt class="feel">
      <span>
        <!--运营商-->
        {{$t('m.borrow.radio')}}
      </span>
      <div style="flex:1"></div>
      <div>
      <div v-if="loading <= 0 ">
        <dt class="lh40 feel">
        <div style="flex:1"></div>
        <!--提交-->
        <el-button type="primary" v-if="tableDataParamsShow && canEditRatio" @click="paramsEdit()">
        {{$t('m.params.update')}}
        </el-button>
        <div v-if="!tableDataParamsShow">
        <el-button type="primary" :disabled="!isEdit" @click="submit">{{$t('m.params.submit')}} </el-button>
        <el-button @click="paramsCancel">{{$t('m.cancel')}}</el-button>
       </div>
       </dt>
      </div>
        <!--输入资金密码-->
      <password-dialog :visible="submitRatioPW" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
      </div>
    </dt>
    <lender-symbol :visible="lenderDialog" @lenderEvent="lenderEvent" :lenderData="lenderData"></lender-symbol>
    <edit-lender-symbol :visible="editLenderDialog" @editLenderEvent="editLenderEvent" :lenderData="editLenderData"></edit-lender-symbol>
    <dd>
      <el-table
        :data="ratioData"
        style="width: 100%">
        <el-table-column
          prop="symbol"
          :label="$t('m.orderList.bitType')"
          width="190">
        </el-table-column>
        <!--增加抵押币-->
        <el-table-column
          width="50"
        >
          <template slot-scope="scope">
            <i class="el-icon-circle-plus-outline"  v-if="!tableDataParamsShow" style="font-size: 30px; vertical-align: middle" @click="lenderDialogShow(scope.$index)"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="newratio"
          :label="$t('m.borrow.radio')"
        >
          <template slot-scope="cash">
            <el-table
              :data="cash.row.newratio"
              :show-header="false"
            >
              <el-table-column
                prop="lenderSymbol"
                :label="$t('m.orderList.bitType')"
                width="120">
              </el-table-column>
              <el-table-column
                prop="lenderRatio"
                :label="$t('m.borrow.radio')"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.lenderRatio }}%</span>
                </template>
              </el-table-column>
              <el-table-column
                align="right"
                v-if="!tableDataParamsShow"
                width="120">
                <template slot-scope="scope">
                  <i class="el-icon-edit curp f26" @click="newRatioEdit(cash.$index, scope.$index, scope.row)"></i>
                  <i class="el-icon-remove-outline margin-l10 curp f26" @click="newRatioDelete(cash.$index, scope.$index)"></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </dd>
    <confirm-dialog :carrierVisible="carrierVisible" @submitCarrier="submitRatioTr" :carrierUpdate="updateContents"></confirm-dialog>
  </dl>
  </div>
</template>
<script>
  import updateDialog from '/path-components/Admin/updateDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import cashSymbol from '/path-components/Admin/cashSymbol'
  import lenderSymbol from '/path-components/Admin/lenderSymbol'
  import editLenderSymbol from '/path-components/Admin/editLenderSymbol'
  import confirmDialog from '/path-components/Admin/confirmDialog'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import deepClone from '/js-utils/deepClone'
  export default {
    name: 'collateralratio',
    components: {updateDialog, cashSymbol, lenderSymbol, editLenderSymbol, confirmDialog, passwordDialog},
    props: {
      optionId: '',
      symbol: '',
      Type: '',
      assetId: ''
    },
    data () {
      return {
        // 提交运营商修改的，弹出密码框
        comfirmSumbmitCarrier: false,
        // 维持抵押率列表
        ratioData: [],
        // 运营商更新弹窗
        carrierVisible: false,
        // 修改时需要传参给更新弹窗
        updateData: '',
        isHas: false,
        cList: [],
        lList: [],
        copyClist: [],
        copyLlist: [],
        cashSymbol: '',
        radioSelect: false,
        lenderSymbol: '',
        symbol: '',
        radioInput: false,
        tableDataParamsShow: true,
        loading: 1,
        // 新
        cashDialog: false,
        lenderDialog: false,
        cashData: {},
        lenderData: {},
        editLenderDialog: false,
        submitRatioPW: false,
        // 提案弹框
        ratioVisible: false,
        ratioConfig: {},
        isEdit: false,
        updateContents: {},
        del: [],
        updates: [],
        canEditRatio: false,
        isModified: false,
        confirmLeaveVisible: false,
        newConfig: [],
        arr: [
          {title: 't',
            bo:
              [
                {h: 'h1', t: 't1'},
                {h: 'h2', t: 't2'}
              ]
          }
        ]
      }
    },
    methods: {
      init () {
        this.loading = 1
        this.canEditRatio = false
        this.isModified = false
        this._canEditRatio()
        this._getAssetList()
        this._getConfig()
        this.loading--
      },
      changeOption (id, assetId, type, symbol) {
        this.assetId = assetId
        this.symbol = symbol
        this.optionId = id
        this.Type = type
        this.paramsCancel()
        this.init()
      },
      paramsEdit () {
        this.tableDataParamsShow = !this.tableDataParamsShow
      },
      paramsCancel () {
        this.tableDataParamsShow = true
        this.isEdit = false
        this._getConfig()
        this.setEdit(this.isEdit)
      },
      setEdit (st) {
        this.isEdit = st
      },
      canLeave () {
        return this.isEdit === false
      },
      // 得到借贷的币种
      _getAssetList () {
        this.loading++
        ZOSInstance.getAssetList().then(res => {
          if (res && (res.cash_list || res.lender_list)) {
            this.cList = deepClone(res.cash_list)
            this.lList = deepClone(res.lender_list)
            this.copyClist = deepClone(res.cash_list)
            this.copyLlist = deepClone(res.lender_list)
            this.cashData = {
              cList: this.cList
            }
          }
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
      _getConfig () {
        if (this.$store.state.userDataSid !== '') {
          this.loading++
          this.ratioData = []
          Apis.instance().db_api().exec('get_account_config', [this.$store.state.userDataSid, ['collateral_ratio_' + ZOSInstance.getOptionIndex(this.Type) + this.symbol]])
            .then(result => {
              if (result && result[0] && result[0] !== '') {
                let config = JSON.parse(result[0])
                let ratioList = config
                for (let i in ratioList) {
                  let params = {}
                  if (i === this.symbol) {
                    params.symbol = this.symbol
                    params.newratio = []
                    for (let ii in ratioList[i]) {
                      let jsons = {}
                      jsons['lenderSymbol'] = ii
                      jsons['lenderRatio'] = ratioList[i][ii]
                      params.newratio.push(jsons)
                    }
                  } else {
                    params.symbol = this.symbol
                    params.newratio = []
                  }
                  this.ratioData.push(params)
                }
              } else {
                // let params = {}
                // params.symbol = this.symbol
                // params.newratio = []
                // this.ratioData.push(params)
              }
              this._isDisabledLender(0)
              this.loading--
            })
            .catch(err => {
              this.loading--
              console.log(err)
              this.$message({
                message: err,
                type: 'warning'
              })
            })
        }
      },
      // 抵押币弹框
      lenderDialogShow (cIndex) {
        this._isDisabledLender(cIndex)
        this.lenderData = {
          lList: this.lList,
          cIndex: cIndex
        }
        this.lenderDialog = true
      },
      // 抵押币弹框回调
      lenderEvent (data) {
        this.lenderDialog = false
        if (data.type) {
          this.addLender(data)
        }
      },
      // 增加一条抵押币数据
      addLender (data) {
        let param = {
          lenderSymbol: data.lenderSymbol,
          lenderRatio: data.lenderRatio
        }
        this.ratioData[data.cIndex].newratio.push(param)
        this._isDisabledLender(data.cIndex)
        this.isEdit = true
      },
      // 抵押币已经有的就禁用
      _isDisabledLender (cIndex) {
        if (cIndex >= this.ratioData.length) return
        this.lList = deepClone(this.copyLlist)
        this.lList.forEach((item, index) => {
          if (this.ratioData[cIndex].newratio) {
            this.ratioData[cIndex].newratio.forEach((_item, _index) => {
              if (_item.lenderSymbol === item.symbol) {
                item['disabled'] = true
              }
            })
          }
        })
      },
      // 编辑新增的抵押币
      newRatioEdit (cIndex, lIndex, row) {
        this.editLenderData = {
          lList: this.lList,
          cIndex: cIndex,
          lIndex: lIndex,
          row: row
        }
        this.editLenderDialog = true
      },
      // 编辑的弹框
      editLenderEvent (data) {
        this.editLenderDialog = false
        if (data.type) {
          this.editSetData(data)
        }
      },
      //
      editSetData (data) {
        let param = {
          lenderSymbol: data.lenderSymbol,
          lenderRatio: data.lenderRatio
        }
        // 因为这个不是动态绑定
        this.ratioData[data.cIndex].newratio[data.lIndex] = param
        this.$set(this.ratioData[data.cIndex].newratio, [data.lIndex], param)
        this._isDisabledLender(data.cIndex)
        this.isEdit = true
      },
      // 删除一条抵押币数据
      newRatioDelete (cIndex, lIndex) {
        this.ratioData[cIndex].newratio.splice(lIndex, 1)
        this._isDisabledLender(cIndex)
        this.isEdit = true
      },
      submit () {
        this.isSubmitUpdate()
      },
      isSubmitUpdate () {
        Promise.all([this.isUpdate()]).then(res => {
          if (!res[0]) {
            this.$message({
              message: this.$t('m.params.noupdate'),
              type: 'warning'
            })
            return
          }
          if (res[0]) {
            let symbol = this.symbol
            let newRatio = this.ratioData[0]['newratio']
            let param = {}
            param[symbol] = {}
            newRatio.forEach(item => {
              param[symbol][item.lenderSymbol] = item.lenderRatio
            })
            let paramString = JSON.stringify(param)
            this.newConfig = [['collateral_ratio_' + ZOSInstance.getOptionIndex(this.Type) + this.symbol, paramString]]
            this.submitRatioPW = true
          }
        })
      },
      _newConfig () {
        let symbol = this.symbol
        let newRatio = this.ratioData[0]['newratio']
        let param = {}
        param[symbol] = {}
        newRatio.forEach(item => {
          param[symbol][item.lenderSymbol] = item.lenderRatio
        })
        let paramString = JSON.stringify(param)
        this.newConfig = [['collateral_ratio_' + ZOSInstance.getOptionIndex(this.Type) + this.symbol, paramString]]
      },
      // 检查用户是否有修改
      isUpdate () {
        return new Promise((resolve, reject) => {
          Apis.instance().db_api().exec('get_account_config', [this.$store.state.userDataSid, ['collateral_ratio_' + ZOSInstance.getOptionIndex(this.Type) + this.symbol]]).then(res => {
            if (res && res[0]) {
              let config = JSON.parse(res[0])
              this._newConfig()
              if (this.newConfig[0][1] === JSON.stringify(config)) {
                this.isModified = false
              } else {
                this.isModified = true
              }
            } else {
              if (this.ratioData[0].newratio.length > 0) {
                this.isModified = true
              } else {
                this.isModified = false
              }
            }
            return resolve(this.isModified)
          })
        })
      },
      // 提交时再检查一下，是否有权限修改
      _canEditRatio () {
        this.loading++
        Apis.instance().db_api().exec('get_account_config', [this.$store.state.admin_id, ['carrierList' + ZOSInstance.getOptionIndex(this.Type)]]).then(res => {
          if (res && res[0]) {
            let config = JSON.parse(res[0])
            for (let i in config) {
              if (this.symbol === i) {
                if (this.$store.state.userName === config[i].investCarrier) {
                  this.canEditRatio = true
                } else {
                  this.canEditRatio = false
                }
              }
            }
          } else {
            this.canEditRatio = false
          }
          this.loading--
        }).catch(err => {
          this.loading--
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
      },
      // 密码正确后，提交到链
      bitlenderLendOrder (bool) {
        this.submitRatioPW = false
        if (bool) {
          ZOSInstance.account_config_operation(this.$store.state.userDataSid, this.newConfig, 5).then(update => {
            if (update) {
              this.updateContents['tr'] = update.tr
              this.updateContents['fee'] = update.fee.fee_amount / Math.pow(10, update.fee.fee_precision)
              this.updateContents['updateContent'] = this.newConfig
            }
            this.carrierVisible = true
          }).catch(error => {
            console.log(error)
            this.$message({
              message: error,
              type: 'warning'
            })
          })
        }
      },
      // 广播的回调
      submitRatioTr (bool) {
        if (bool) {
          this.init()
          this.tableDataParamsShow = true
          this.isEdit = false
        }
        this.carrierVisible = false
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

</style>

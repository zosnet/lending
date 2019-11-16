<template>
  <div slot="content" class="container-params" v-loading="loading > 0 && initDone === false" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div>
        <div style="flex:1">
          <span class="lh40">
            <span style="width: 120px; vertical-align: middle; height: 40px">
              {{$t('m.transfer.XZBZ')}}
            </span>
            <el-select v-model="selectedSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="symbolSelect">
              <el-option
                v-for="item in assetlist"
                :key="item.id"
                :label="item.symbol"
                :value="item">
              </el-option>
            </el-select>
          </span>
          <span style="color: #ff0000" v-show="isNew">{{$t('m.params.nooptions')}}</span>

          <span class="feel" style="float: right;">
            <!--提交-->
            <el-button type="primary" v-if="tableDataParamsShow && canEditRatio"  @click="paramsEdit()">
            <!-- <el-button type="primary"  @click="paramsEdit()"> -->
            {{isNew? $t('m.params.addParams') : $t('m.params.update') }}
            </el-button>
            <el-button type="warning" v-if="isAssign!==0" @click="paramsAssign()">
            {{isAssign===1 ? $t('m.params.cancelassignpayer') : $t('m.params.assignpayer') }}
            </el-button>
            <div v-if="!tableDataParamsShow">
              <el-button type="primary" :disabled="!isEdit" @click="submit">{{$t('m.params.submit')}} </el-button>
              <el-button @click="paramsCancel">{{$t('m.cancel')}}</el-button>
            </div>
          </span>
       </div>
       <el-table
          :data="lockoptions_dynamic"
          style="width: 100%"
          stripe
          id="cancanl"
        >
          <!--参数名称-->
          <el-table-column
            :label="$t('m.params.name')"
            style="width: 45%"
            prop="name"
          >
          </el-table-column>
          <!--参数值-->
          <el-table-column
            :label="$t('m.params.paramValue')"
            style="width: 25%"
            prop="value"
          >
          </el-table-column>
          <!--修改后-->
          <el-table-column
            :label="$t('m.params.updateAfter')"
            style="width: 25%;"
            prop="newValue"
            v-if="!tableDataParamsShow"
          >
            <template slot-scope="scope" class="feel">
              <div >
                <el-input v-if="scope.row.key === 'locktoken_rates'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  @keyup.native="scope.row.newValue < 0 || scope.row.newValue > 1000000000 ? errorMessage(scope.row): scope.row.newValue = scope.row.newValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');isEdit=true"
                  :clearable="true"
                  :placeholder="scope.row.placeholder"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'max_rate'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="scope.row.newValue < 1 || scope.row.newValue > 1000000000 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/^[0]+[0-9]*$/gi,'');isEdit=true"
                  :clearable="true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'locktoken_min'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="scope.row.newValue < 1 || scope.row.newValue > 1000000000 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/^[0]+[0-9]*$/gi,'');isEdit=true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'locktoken_max'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="scope.row.newValue < 1 || scope.row.newValue > 1000000000 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/^[0]+[0-9]*$/gi,'');isEdit=true"
                  :clearable="true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'max_supply'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="scope.row.newValue.replace(/^[0]+[0-9]*$/gi,'');isEdit=true"
                  :clearable="true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'vesting_seconds'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="scope.row.newValue > 31104000 || scope.row.newValue < 0 ? errorMessage(scope.row) : scope.row.newValue = scope.row.newValue.replace(/\D/g,'');isEdit=true"
                  :clearable="true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'pay_asset'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="isEdit=true"
                  :clearable="true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'carrier'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="isEdit=true"
                  :clearable="true"
                ></el-input>
                <el-input v-else-if="scope.row.key === 'payer'"
                  v-model="scope.row.newValue"
                  :disabled="scope.row.updatestatus ? false : true"
                  :class="{showborder: !tableDataParamsShow}"
                  :placeholder="scope.row.placeholder"
                  @keyup.native="isEdit=true"
                  :clearable="true"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
    </div>
      <!--输入资金密码-->
    <password-dialog :visible="submitRatioPW" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>
  </div>
</template>
<script>
  import {getStore, setStore} from '/js-utils/storage'
  import {ZOSInstance} from 'zos-wallet-js'
  import {Apis} from 'zosjs-ws'
  import filters from '/js-filters'
  import deepClone from '/js-utils/deepClone'
  // import { ChainStore } from 'zosjs/es'
  import YButton from '/path-components/element/YButton'
  import passwordDialog from '/path-components/Login/passwordDialog'
  export default {
    components: {YButton, passwordDialog},
    data () {
      return {
        loading: 1,
        initDone: false,
        // 选择币种
        canEditRatio: false,
        tableDataParamsShow: true,
        submitRatioPW: false,
        isEdit: false,
        isNew: false,
        isAssign: 0,
        lockmode: 0,
        optype: 0,
        max_supply: 700000000000,
        // 选中的币种
        selectedSymbol: {id: '1.3.0'},
        asset: {},
        assetlist: [],
        selectedSymbolLast: {},
        username: this.$store.state.userName,
        updateContents: {},
        optionsObj: {},
        options: {
          locktoken_rates: [],
          max_rates: 100000000000000,
          locktoken_min: 1,
          locktoken_max: 100000000000000,
          max_supply: 100000000000000,
          pay_asset: 'ZOS',
          carrier: '1.2.0',
          payer: '1.2.0'
        },
        carrier_id: '',
        carrier_name: '',
        payer_id: '',
        payer_name: '',
        pay_asset_name: '',
        pay_asset_id: '',
        errorMsg: '',
        lockoptions_dynamic: [],
        newValue: []
      }
    },
    computed: {
    },

    methods: {
      // 开始编辑
      paramsEdit () {
        this.tableDataParamsShow = !this.tableDataParamsShow
      },
      // 确认支付人
      paramsAssign () {
        this.optype = 1
        this.submitRatioPW = true
      },
      // 取消编辑，重新取参数
      paramsCancel () {
        this.lockoptions = []
        this.tableDataParamsShow = true
        this.isEdit = false
        this.isAssign = 0
        this.getConfig()
      },
      // 设置编辑状态
      locktokenstate (v) {
        this.isEdit |= v
      },
      // 首页询问是否可以离开编辑页面
      canLeave () {
        return !this.isEdit
      },
      // 提交修改或者新建
      submit () {
        if (this.isEdit) {
          this.tabaleRuleForm()
          this.CheckParam().then(_ => {
            console.log('error', this.errorMsg)
            if (this.errorMsg !== '') {
              this.$message({
                type: 'warning',
                message: this.errorMsg
              })
            } else {
              this.optype = 0
              this.submitRatioPW = true
            }
          })
        }
      },
      // 初始数据
      init () {
        this.loading = 1
        this.loading++
        // 取得所有具备定期活期的资产列表
        ZOSInstance.getAssetListByType(0x00100).then(res => {
          this.assetlist = res
          if (res && res.length > 0) {
            this.selectedSymbol = (getStore('locktokenSymbols') ? JSON.parse(getStore('locktokenSymbols')) : res[0])
            this.symbolSelect(this.selectedSymbol)
          }
          this.initDone = true
          this.loading--
        }).catch(err => {
          this.loading--
          console.log(err)
          this.$message({
            message: err,
            type: 'warning'
          })
        })
        this.loading--
      },
      initCarrier () {
        this.loading++
        return Apis.instance().db_api().exec('get_objects', [[this.options.payer, this.options.carrier, this.options.pay_asset]]).then(res => {
          if (res && res.length >= 3) {
            this.payer_name = res[0].name
            this.carrier_name = res[1].name
            this.pay_asset_name = res[2].symbol
            this.payer_id = res[0].id
            this.carrier_id = res[1].id
            this.pay_asset_id = res[2].id
          }
          this.loading--
        }).catch(error => {
          this.loading--
          console.log(error)
          this.$message({
            message: error,
            type: 'warning'
          })
        })
      },
      getAssetInfo () {
        this.max_supply = 70000000000000
        Apis.instance().db_api().exec('get_objects', [[this.selectedSymbol.id]]).then(res => {
          if (res && res.length === 1) {
            this.max_supply = res[0].options.max_supply
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getConfig () {
        this.loading++
        // 查看该资产的 定期参数是否存在
        this.getAssetInfo()
        Apis.instance().db_api().exec('get_locktoken_option', [this.selectedSymbol.id, this.lockmode, false]).then(res => {
          if (res) {
            this.isNew = false
            this.optionsObj = res
            this.options = res.lockoptions
            this.initCarrier()
            this.loading++
            this.isAssign = 0
            console.log(this.optionsObj)
            if (this.options.payer === this.$store.state.userDataSid) {
              if (this.optionsObj.payer_enable) this.isAssign = 1
              else this.isAssign = 2
            }
            // 查看编辑权限
            Apis.instance().bitlender_api().exec('can_edit_locktoken_option', [this.optionsObj.id, this.selectedSymbol.id, this.$store.state.userDataSid]).then(res1 => {
              this.canEditRatio = res1
              this.ansyChild()
              this.loading--
            }).catch(error => {
              this.loading--
              this.canEditRatio = false
              console.log(error)
              this.$message({
                message: error,
                type: 'warning'
              })
            })
          } else {
            // 参数不存在
            this.isNew = true
            this.optionsObj = {
              asset_precision: this.selectedSymbol.precision
            }
            // 缺省参数
            this.options = {
              lock_mode: 0,
              locktoken_rates: [[0, [[1, 100]]]],
              max_rates: 100000000000000,
              locktoken_min: 1,
              vesting_seconds: 1728000,
              locktoken_max: 100000000000000,
              max_supply: 100000000000000,
              pay_asset: '1.3.0',
              carrier: '1.2.0',
              payer: '1.2.0'
            }
            this.loading++
            // 查看权限，因为参数资产不存在，传一个无效的参数 id
            Apis.instance().bitlender_api().exec('can_edit_locktoken_option', ['1.27.10000000000', this.selectedSymbol.id, this.$store.state.userDataSid]).then(res1 => {
              this.canEditRatio = res1
              this.ansyChild()
              this.loading--
            }).catch(error => {
              this.loading--
              this.canEditRatio = false
              console.log(error)
              this.$message({
                message: error,
                type: 'warning'
              })
            })
          }
          this.loading--
        }).catch(error => {
          this.loading--
          console.log(error)
          this.$message({
            message: error,
            type: 'warning'
          })
        })
      },
      // 取得参数后，设置各种编辑页面
      ansyChild () {
        // 数据格式化,借款参数
        this.tableDataForm(this.options)
      },
      /* 数据格式化 */
      tableDataForm (res) {
        /* 活期参数 */
        if (res.locktoken_rates.length === 0) res.locktoken_rates = [[0, [[1, 100]]]]
        if (res.max_rate === '' || typeof (res.max_rate) === 'undefined') res.max_rate = 0
        if (res.vesting_seconds === '' || typeof (res.vesting_seconds) === 'undefined') res.vesting_seconds = 0
        if (this.pay_asset_name === '' || typeof (this.pay_asset_name) === 'undefined') this.pay_asset_name = this.$t('m.noData')
        if (this.carrier_name === '' || typeof (this.carrier_name) === 'undefined') this.carrier_name = this.$t('m.noData')
        if (this.payer_name === '' || typeof (this.payer_name) === 'undefined') this.payer_name = this.$t('m.noData')
        this.lockoptions_dynamic = [
          // 年化率
          {
            name: this.$t('m.lockasseted.yearinterest'),
            key: 'locktoken_rates',
            value: (Number(res.locktoken_rates[0][1][0][1]) / 1000).toFixed(2) + '‰',
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanZeroDec'),
            newValue: '',
            errMessage: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanZeroDec') + this.$t('m.params.lessMillion'),
            updatestatus: true
          },
          // 最大利息
          {
            name: this.$t('m.params.rateVal3'),
            key: 'max_rate',
            value: filters.formatLegalCurrency3(res.max_rate, '', this.optionsObj.asset_precision),
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanOne'),
            newValue: '',
            errMessage: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanOne') + this.$t('m.params.lessMillion'),
            updatestatus: true
          },
          // 最小值
          {
            name: this.$t('m.params.minSave'),
            key: 'locktoken_min',
            value: filters.formatLegalCurrency3(res.locktoken_min, '', this.optionsObj.asset_precision),
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanZero'),
            newValue: '',
            errMessage: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanZero') + this.$t('m.params.lessMillion'),
            updatestatus: true
          },
          // 最大值
          {
            name: this.$t('m.params.maxSave'),
            key: 'locktoken_max',
            value: filters.formatLegalCurrency3(res.locktoken_max, '', this.optionsObj.asset_precision),
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.moreThan') + this.$t('m.params.minSave') + this.$t('m.params.dinteger'),
            newValue: '',
            errMessage: this.$t('m.bankcardInfo.enter') + this.$t('m.params.moreThan') + this.$t('m.params.minSave') + this.$t('m.params.dinteger') + this.$t('m.params.lessMillion'),
            updatestatus: true
          },
          // 最大供给量
          {
            name: this.$t('m.transaction.trxTypes.asset_create.max_supply'),
            key: 'max_supply',
            value: filters.formatLegalCurrency3(res.max_supply, '', this.optionsObj.asset_precision),
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.moreThan') + this.$t('m.params.maxSave') + this.$t('m.params.dinteger'),
            newValue: '',
            errMessage: '',
            updatestatus: true
          },
          // 锁定时间
          {
            name: this.$t('m.params.lockTime'),
            key: 'vesting_seconds',
            value: res.vesting_seconds + '(' + this.$t('m.minutes') + ')',
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanNum'),
            newValue: '',
            errMessage: this.$t('m.bankcardInfo.enter') + this.$t('m.params.thanNum'),
            updatestatus: true
          },
          // 利率币种
          {
            name: this.$t('m.params.rateCollat'),
            key: 'pay_asset',
            value: this.pay_asset_name,
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.rateCollat'),
            newValue: '',
            errMessage: this.$t('m.params.errMessage'),
            updatestatus: true
          },
          // 运营商
          {
            name: this.$t('m.params.inCarrier'),
            key: 'carrier',
            value: this.carrier_name,
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.inCarrier'),
            newValue: '',
            errMessage: this.$t('m.params.errMessage'),
            updatestatus: true
          },
          // 支付人
          {
            name: this.$t('m.params.payer') + '(' + (this.optionsObj.payer_enable ? this.$t('m.params.hasassig') : this.$t('m.params.noassig')) + ')',
            key: 'payer',
            value: this.payer_name,
            placeholder: this.$t('m.bankcardInfo.enter') + this.$t('m.params.payer'),
            newValue: '',
            errMessage: this.$t('m.params.errMessage'),
            updatestatus: true
          }
        ]
      },
      // 修改后参数校验
      tabaleRuleForm () {
        this.lockoptions_dynamic.forEach(item => { item.newValue.trim() })
        // 活期年化率
        this.options['locktoken_rates'] = (this.lockoptions_dynamic[0].newValue == '') ? this.options['locktoken_rates'] : [[0,[[1,this.lockoptions_dynamic[0].newValue*100]]]] //eslint-disable-line
        // 最大利息
        this.options['max_rate'] = (this.lockoptions_dynamic[1].newValue == '') ? this.options['max_rate'] : this.lockoptions_dynamic[1].newValue * Math.pow(10, this.optionsObj.asset_precision) //eslint-disable-line
        // 活期最小值数额
        this.options['locktoken_min'] = (this.lockoptions_dynamic[2].newValue == '') ? this.options['locktoken_min'] : this.lockoptions_dynamic[2].newValue * Math.pow(10, this.optionsObj.asset_precision) //eslint-disable-line
        // 活期最大值数额
        this.options['locktoken_max'] = (this.lockoptions_dynamic[3].newValue === '') ? this.options['locktoken_max'] : this.lockoptions_dynamic[3].newValue * Math.pow(10, this.optionsObj.asset_precision) //eslint-disable-line
        // 最大供给量
        this.options['max_supply'] = (this.lockoptions_dynamic[4].newValue == '') ? this.options['max_supply'] : this.lockoptions_dynamic[4].newValue * Math.pow(10, this.optionsObj.asset_precision) //eslint-disable-line
        // 活期锁定时间
        this.options['vesting_seconds'] = (this.lockoptions_dynamic[5].newValue == '') ? this.options['vesting_seconds'] : this.lockoptions_dynamic[5].newValue //eslint-disable-line
        // 利率币种
        // this.options['pay_asset'] = (this.lockoptions_dynamic[6].newValue == '') ? this.options['pay_asset'] : this.lockoptions_dynamic[6].newValue //eslint-disable-line
        this.options['pay_asset'] = this.lockoptions_dynamic[6].newValue
        // 运营商
        // this.options['carrier'] = (this.lockoptions_dynamic[7].newValue == '') ? this.options['carrier'] : this.lockoptions_dynamic[7].newValue //eslint-disable-line
        this.options['carrier'] = this.lockoptions_dynamic[7].newValue
        // 支付人
        // this.options['payer'] = (this.lockoptions_dynamic[8].newValue == '') ? this.options['payer'] : this.lockoptions_dynamic[8].newValue //eslint-disable-line
        this.options['payer'] = this.lockoptions_dynamic[8].newValue
      },
      // 输入错误的提示
      errorMessage (item) {
        item.newValue = ''
        this.$message({
          message: item.errMessage,
          type: 'error'
        })
      },
      // 选择资产列表
      symbolSelect (val) {
        if (this.selectedSymbolLast.symbol !== val.symbol) {
          this.selectedSymbol = val
          this.selectedSymbolLast = val
          // 如果是编辑状态，恢复
          if (this.canEditRatio && !this.tableDataParamsShow) {
            this.tableDataParamsShow = true
            this.isEdit = false
            this.isAssign = 0
          }
          setStore('locktokenSymbols', this.selectedSymbol)
          // 重新取得对应参数
          this.getConfig()
        }
      },
      async CheckParam () {
        this.errorMsg = ''
        if (this.options.locktoken_min >= this.options.locktoken_max) {
          this.errorMsg = this.$t('m.params.minSave') + this.$t('m.params.moreThan') + this.$t('m.params.maxSave')
          return false
        }
        if (this.options.locktoken_max > this.options.max_supply) {
          this.errorMsg = this.$t('m.params.errMessage2')
          return false
        }
        if (this.max_supply < this.options.max_supply) {
          this.errorMsg = this.$t('m.params.errMessage3')
          return false
        }
        await this.isAsset(this.options['pay_asset'])
        await this.isCarrier(this.options['carrier'])
        await this.isPayer(this.options['payer'])
        if (!this.errorMsg !== '') return false
        return true
      },
      // 运营商是否存在
      isCarrier (val) {
        if (val === this.carrier_id || val === this.carrier_name || val === '') {
          this.options['carrier'] = this.carrier_id
          return Promise.resolve(this.options['carrier'])
        }
        Apis.instance().db_api().exec('get_account_by_name', [val]).then(account => {
          if (account[0]) {
            if ((account.uaccount_property & 0x00000002) <= 0) {
              this.errorMsg = this.options['carrier'] + this.$t('m.params.nocarrier')
            }
            this.options['carrier'] = account[0].id
          } else {
            this.options['carrier'] = this.carrier_id
            this.errorMsg = val + this.$t('m.params.errcarrier')
          }
          return Promise.resolve(this.options['carrier'])
        }).catch(err => {
          this.options['carrier'] = this.carrier_id
          console.log(err)
          this.errorMsg = this.$t('m.lockasseted.nooption')
          return Promise.reject(this.options['carrier'])
        })
      },
      // 利率币种是否存在
      // isAsset () {
      //   if (this.options['pay_asset'] === this.pay_asset_id || this.options['pay_asset'] === this.pay_asset_name || this.options['pay_asset'] === '') {
      //     this.options['pay_asset'] = this.pay_asset_id
      //     return Promise.resolve(this.options['pay_asset'])
      //   }
      //   return Apis.instance().db_api().exec('get_account_by_name', [this.options['pay_asset']]).then((account) => {
      //     if (account) {
      //       this.options['pay_asset'] = account.id
      //     } else {
      //       this.errorMsg = this.options['pay_asset'] + this.$t('m.params.err_pay_asset')
      //       this.options['pay_asset'] = this.pay_asset_id
      //     }
      //     return Promise.resolve(this.options['pay_asset'])
      //   }).catch(err => {
      //     this.options['pay_asset'] = this.pay_asset_id
      //     console.log(err)
      //     this.errorMsg = this.$t('m.lockasseted.nooption')
      //     return Promise.reject(this.options['pay_asset'])
      //   })
      // },
      isAsset (val) {
        if (val === this.pay_asset_id || val === this.pay_asset_name || val === '') {
          this.options['pay_asset'] = this.pay_asset_id
          return Promise.resolve(this.options['pay_asset'])
        }
        return Apis.instance().db_api().exec('lookup_asset_symbols', [[val]]).then((account) => {
          if (account[0]) {
            this.options['pay_asset'] = account[0].id
          } else {
            this.errorMsg = val + this.$t('m.params.err_pay_asset')
            this.options['pay_asset'] = this.pay_asset_id
          }
          return Promise.resolve(this.options['pay_asset'])
        }).catch(err => {
          this.options['pay_asset'] = this.pay_asset_id
          console.log(err)
          this.errorMsg = this.$t('m.lockasseted.nooption')
          return Promise.reject(this.options['pay_asset'])
        })
      },
      // 支付者是否存在
      isPayer (val) {
        if (val === this.payer_id || val === this.payer_name || val === '') {
          this.options['payer'] = this.carrier_id
          return Promise.resolve(this.options['payer'])
        }
        return Apis.instance().db_api().exec('get_account_by_name', [val]).then((account) => {
          if (account[0]) {
            this.options['payer'] = account[0].id
          } else {
            this.errorMsg = val + this.$t('m.params.errpayer')
            this.options['payer'] = this.payer_id
          }
          return Promise.resolve(this.options['payer'])
        }).catch(err => {
          this.options['payer'] = this.payer_id
          console.log(err)
          this.errorMsg = this.$t('m.lockasseted.nooption')
          return Promise.reject(this.options['payer'])
        })
      },
      // 密码正确后，提交到链
      bitlenderLendOrder (boolset) {
        this.submitRatioPW = false

        if (boolset) {
          if (this.optype === 0) {
            // this.options['op_id'] = (this.isNew) ? '1.26.0' : this.optionsObj.id
            this.options['op_id'] = this.optionsObj.id
            this.options['version'] = 8
            this.options['lock_mode'] = this.lockmode
            let newConfig = JSON.stringify(this.options)
            let assetIssuer = this.selectedSymbol.issuer
            if (assetIssuer === '1.2.3') assetIssuer = '1.2.0'
            console.log('提交参数2', newConfig)
            ZOSInstance.asset_locktoken_operation(this.$store.state.userDataSid, this.selectedSymbol.id, assetIssuer, this.isNew, newConfig).then(update => {
              if (update) {
                this.updateContents['tr'] = update.tr
                this.updateContents['fee'] = update.fee.fee_amount / Math.pow(10, update.fee.fee_precision)
                this.broadcastSubmit()
              }
            }).catch(error => {
              console.log(error)
              this.$message({
                message: error,
                type: 'warning'
              })
            })
          } else if (this.optype === 1) {
            this.options['op_id'] = this.optionsObj.id
            this.options['version'] = 9
            this.options['lock_mode'] = this.lockmode
            let config = deepClone(this.options)
            if (this.optionsObj.payer_enable) config.payer = '1.2.0'
            else config.payer = this.options.payer
            config.carrier = '1.2.0'
            config.pay_asset = '1.3.0'
            let newConfig = JSON.stringify(config)
            console.log('提交参数1', newConfig)
            ZOSInstance.asset_locktoken_assign(this.$store.state.userDataSid, this.selectedSymbol.id, newConfig).then(update => {
              if (update) {
                this.updateContents['tr'] = update.tr
                this.updateContents['fee'] = update.fee.fee_amount / Math.pow(10, update.fee.fee_precision)
                this.broadcastSubmit()
              }
            }).catch(error => {
              console.log(error)
              this.$message({
                message: error,
                type: 'warning'
              })
            })
          }
        }
      },
      broadcastSubmit () {
        this.loading = true
        ZOSInstance.broadcastTransaction(this.updateContents.tr)
          .then(res => {
            this.submitRatioTr(true)
            this.loading = false
            if (res) {
              this.$message({
                type: 'success',
                // '提交提案成功'
                message: this.$t('m.badloans.subSucc')
              })
              this.tableDataForm(this.options)
            }
          })
          .catch(err => {
            this.loading = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
            return false
          })
      },
      // 广播的回调
      submitRatioTr (bool) {
        if (bool) {
          let _self = this
          this.tableDataParamsShow = false
          this.paramsEdit()
          this.isEdit = false
          setTimeout(function () {
            _self.getConfig()
          }, 4000)
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
<style lang="scss">
  .el-table .warning-row {
    color: #dedede
  }
  .el-table .warning {
    color: #000
  }
  .container-params {
    padding: 15px !important;
    background: #fff !important;
    border-radius: 4px !important;
    dl dd .showborder .el-input__inner{
      border: 1px solid #dcdfe6!important;
      background: #fff !important;
    }
    dl dd .el-input__inner{
      border: none !important;
      background: none !important;
    }
    dt, dd{
      padding: 0 10px;
    }
    dt{
      overflow: hidden;
    }
    .separ {
      border: 1px solid #dcdfe6; padding: 15px 5px; border-radius: 4px
    }
    .feeder .el-input__inner {
      border: 1px solid #dcdfe6!important;
      background: #fff !important;
    }
  }
  .feeder-dl dt,
  .feeder-dl dd {
    line-height: 40px;
  }
  .feeder-dl dd {
    margin-left: 10px;
  }
</style>

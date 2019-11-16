<template>
  <el-dialog
    :title="$t('m.params.carrierAdmin')"
    :visible.sync="visible"
    v-if="visible"
    width="50%"
    :before-close="handleClose">
    <div v-loading="loading" :element-loading-text="$t('m.transfer.being')" style="min-height: 10vw;">
      <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
        <el-form-item
          label="网址"
          prop="url"
          :rules="[
          { required: true, message: '请输入URL', trigger: 'blur' },
          { type: 'url', message: '请输入正确的URL地址', trigger: ['blur', 'change'] }
        ]">
          <el-input
            type="text"
            v-model="ruleForm.url"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div v-if="updateData">
          <el-form-item :label="$t('m.transfer.XZBZ')" prop="cashSymbol">
            <template slot-scope="scope">
              <el-select v-model="cashSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="_cashSymbol">
                <el-option
                  v-for="item in cashList"
                  :key="item.id"
                  :label="item.symbol"
                  :value="item">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item
            :label="$t('m.params.carrierAdmin')" prop="carriers"
          >
            <el-input v-model="ruleForm.carriers" type="text"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('m.transfer.XZBZ')" prop="lenderSymbol">
            <el-select v-model="lenderSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="_lenderSymbol">
              <el-option
                v-for="item in lenderList"
                :key="item.id"
                :label="item.symbol"
                :value="item.symbol">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('m.borrow.radio')" prop="radio"
            :rules="[
            { required: true, message: '最小抵押倍数不能为空'},
            { type: 'number', message: '最小抵押倍数应为数字'}
          ]"
          >
            <el-input v-model.number="ruleForm.radio"></el-input>
          </el-form-item>
        </div>
        <!--新增运营商-->
        <div v-if="!updateData">
          <el-form-item :label="$t('m.params.symbolCarrier')" prop="cashSymbol" style="margin-bottom: 0">
            <el-select v-model="cashSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="addCarrierInput" v-show="carrierSelect">
              <el-option
                v-for="item in cashList"
                :key="item.id"
                :label="item.symbol"
                :value="item.symbol">
              </el-option>
            </el-select>
            <i class="el-icon-circle-plus-outline margin-l10" style="font-size: 30px; vertical-align: middle" @click="addCarrierSelect"></i>
          </el-form-item>
          <el-table
            :data="carriersData"
            :show-header="false"
            style="width: 70%;margin-left: 130px;"
            :cell-style="{verticalAlign: 'unset'}"
            v-if="carriersData.length > 0"
            class="margin-b20"
            >
            <el-table-column
              prop="symbol"
              label="币种"
              width="60">
            </el-table-column>
            <el-table-column
              prop="name"
              label="运营商"
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" :placeholder="$t('m.params.enter')"></el-input>
                <div>
                  <!--最小抵押倍数-->
                  <el-form-item :label="$t('m.borrow.radio')" prop="cashSymbol" class="margin-t10" style="margin-left: -30px; margin-bottom: 10px">
                    <el-select v-model="lenderSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="addRadioInput" v-show="radioSelect">
                      <el-option
                        v-for="item in lenderList"
                        :key="item.id"
                        :label="item.symbol"
                        :value="item.symbol">
                      </el-option>
                    </el-select>
                    <i class="el-icon-circle-plus-outline margin-l10" style="font-size: 30px; vertical-align: middle" @click="addRadioSelect"></i>
                  </el-form-item>

                  <el-table
                    :data="radioData[scope.row.name]"
                    :show-header="false"
                    style="width: 70%; margin-left: 80px"
                    v-if="radioData[scope.row.name] > 0"
                    class="margin-b20"
                  >
                    <el-table-column
                      prop="symbolLender"
                      label="币种"
                      width="60">
                    </el-table-column>
                    <el-table-column
                      prop="nameLender"
                      label="最小抵押倍数"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.nameLender" :placeholder="$t('m.params.enter')"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <p class="text-right margin-t10">
          <y-button :text="$t('m.cancel')"
                    @btnClick="handleClose"
          ></y-button>
          <y-button :text="$t('m.sure')"
                    classStyle="main-btn"
                    @btnClick="submit('ruleForm')"
          ></y-button>
        </p>
      </el-form>
    </div>
    <!--输入资金密码-->
    <password-dialog :visible="comfirmSumbmitCarrier" @bitlenderLendOrder="bitlenderLendOrder" :isAppend="true"></password-dialog>
  </el-dialog>
</template>
<script>
  import {ZOSInstance} from 'zos-wallet-js'
  import passwordDialog from '/path-components/Login/passwordDialog'
  import YButton from '/path-components/element/YButton'
  export default {
    components: {passwordDialog, YButton},
    props: {
      updateData: {
        default: null,
        type: Object
      },
      visible: {
        default: false,
        type: Boolean
      }
    },
    data () {
      var validateCarrier = (rule, value, callback) => {
        ZOSInstance.get_account(value).then(acc => {
          if (!acc) {
            callback(this.$t('m.historyinfo.noAccount'))
          } else {
            callback()
          }
        }).catch(err => {
          console.log(err)
        })
      }
      return {
        loading: false,
        visible: false,
        comfirmSumbmitCarrier: false,
        ruleForm: {
          url: '',
          carriers: ''
        },
        cashList: [],
        lenderList: [],
        cList: [],
        lList: [],
        cashSymbol: '',
        lenderSymbol: '',
        rules: {
          carriers: [
            {validator: validateCarrier, trigger: 'blur'},
            {required: true, message: '请输入运营商名称', trigger: 'blur'}
          ]
        },
        carrierSelect: '',
        carriersData: [],
        radioSelect: '',
        radioData: {},
        radioVisible: false
      }
    },
    computed: {
      btnHighlight () {
        // return this.ruleForm.url && this.ruleForm.carriers && this.ruleForm.radio
        return true
      }
    },
    watch: {
      'visible': {
        handler: function (val, newVal) {
          if (this.visible && !this.updateData) {
            this.cashList = this.cList
            this.lenderList = this.lList
            this.cashSymbol = this.cList[0]
            this.lenderSymbol = this.lList[0]
          }
          if (this.visible && this.updateData) {
            this.cashList = this.cList
            this.lenderList = this.lList
            this.setRuleForm()
          }
          // if (!this.visible) {
          //   this.ruleForm = Object.assign(this.ruleForm, this.defaultData)
          //   // this.handleClose()
          // }
        },
        deep: true
      }
    },
    methods: {
      addCarrierSelect () {
        if (this.cashList.length > 0) {
          this.carrierSelect = true
        }
      },
      addCarrierInput () {
        let param = {
          symbol: this.cashSymbol,
          name: ''
        }
        if (this.cashList.length > 0) {
          this.cashList.forEach((item, index) => {
            if (item.symbol === this.cashSymbol) {
              this.cashList.splice(index, 1)
            }
          })
        }
        this.carriersData.push(param)
        this.carrierSelect = false
      },
      addRadioSelect () {
        if (this.lenderList.length > 0) {
          this.radioSelect = true
        }
      },
      addRadioInput () {
        let param = {
          symbol: this.lenderSymbol,
          name: ''
        }
        if (this.lenderList.length > 0) {
          this.lenderList.forEach((item, index) => {
            if (item.symbol === this.lenderSymbol) {
              this.lenderList.splice(index, 1)
            }
          })
        }
        this.radioData.push(param)
        this.radioSelect = false
      },
      // 编辑时的初始值
      setRuleForm () {
        this.ruleForm.url = this.updateData.url
        let cSymbol = this.defaultSymbol(this.updateData.carrierList)
        let lSymbol = this.defaultSymbol(this.updateData.carrierList[cSymbol].maintenance_collateral_ratio_limit)
        this.ruleForm.carriers = this.updateData.carrierList[cSymbol].carrier
        this.ruleForm.radio = this.updateData.carrierList[cSymbol].maintenance_collateral_ratio_limit[lSymbol]
        this.cashSymbol = cSymbol
        this.lenderSymbol = lSymbol
      },
      // 编辑时默认的币种
      defaultSymbol (obj) {
        let i = 0
        for (let a in obj) {
          if (i === 0) {
            return a
          }
          i++
          break
        }
      },
      // 新建时，要过滤掉已经有的运营商
      filterList (cList, carrierList) {
        let arr = []
        for (let a in carrierList) {
          if (!cList.find((item) => { return a === item.symbol })) {
            arr.push(a)
          }
        }
        console.log('arr:', arr)
        return arr
      },
      init () {
        this.getSymbol()
      },
      // 获取所有的可借贷的币种，和抵押币种
      getSymbol () {
        this.loading = true
        ZOSInstance.getAssetList()
          .then(res => {
            this.loading = false
            if (res && (res.cash_list || res.lender_list)) {
              this.cList = res.cash_list
              this.lList = res.lender_list
            } else {
              return false
            }
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      },
      // 选择借款币
      _cashSymbol () {
        this.ruleForm.carriers = this.updateData.carrierList[this.cashSymbol.symbol].carrier
        this._lenderSymbol()
      },
      // 选择抵押币
      _lenderSymbol () {
        this.ruleForm.radio = this.updateData.carrierList[this.cashSymbol.symbol].maintenance_collateral_ratio_limit[this.lenderSymbol]
      },
      // 关闭窗口
      handleClose () {
        this.ruleForm = Object.assign(this.ruleForm, this.defaultData)
        this.updateData = null
        // this.visible = false
        this.$emit('bitCarrier', true)
      },
      // 重置表单
      resetForm (form) {
        this.$refs[form].resetFields()
      },
      // 提交
      submit (form) {
        if (!this.updateData) {
          if (this.carriersData.length > 0) {
            this.carrierData.forEach(item => {
              if (!item.name) {
                this.$message({
                  message: item.symbol + '运营商不能为空',
                  type: 'error'
                })
                return false
              }
            })
          }
          this.radioData.forEach(item => {
            if (!item.name) {
              this.$message({
                message: item.symbol + '最小抵押倍数不能为空',
                type: 'error'
              })
              return false
            }
          })
          this.comfirmSumbmitCarrier = true
        } else {
          this.$refs[form].validate(valid => {
            if (valid) {
              this.comfirmSumbmitCarrier = true
            } else {
              return false
            }
          })
        }
      },
      bitlenderLendOrder (bool) {
        if (bool) {
          this.comfirmSumbmitCarrier = false
          if (!this.updateData) {
            let config = {}
            config[this.ruleForm.url] = this.ruleForm.url
            let carrier = config[this.ruleForm.url].carrierList = {}
            carrier[this.cashSymbol.symbol] = this.ruleForm.carriers
            let radio = config[this.ruleForm.url].maintenance_collateral_ratio_limit = {}
            radio[this.lenderSymbol.symbol] = this.ruleForm.ratio
            ZOSInstance.carrier_create(this.$store.state.userName, this.$store.state.userName, '', config).then(res => {
            })
          }
          // this.$emit('bitCarrier', bool)
        }
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      if (this.$store.state.initFinished) {
        this.init()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.init()
        })
      }
      this.defaultData = JSON.parse(JSON.stringify(this.ruleForm))
    }
  }
</script>
<style scoped lang="scss">
.demo-ruleForm .el-input,
.el-input__inner{
  width: 70%;
}
.el-table--enable-row-transition .el-table__body td{
  vertical-align: unset!important;
}
.el-table td, .el-table th{
  vertical-align: unset!important;
}
</style>

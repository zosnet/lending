scopes.row<template>
  <dl>
    <dt class="feel">
      <span>
        <!--运营商-->
        {{$t('m.params.carrierAdmin')}}
      </span>
      <div style="flex:1"></div>
      <div>
        <!--添加-->
        <el-button type="primary" @click="addRatio">{{$t('m.params.addCarrier')}}</el-button>
        <update-dialog :visible="carrierVisible" @bitCarrier="bitCarrier" :updateData="updateData"></update-dialog>
      </div>

    </dt>
    <dd>
      <el-table
        :data="ratioData"
        style="width: 100%">
        <el-table-column
          prop="symbol"
          label="币种"
          width="190">
          <template slot-scope="scope">
            <el-select v-model="scope.row[cashSymbol]" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change='_cashSelect'>
              <el-option
                v-for="item in cList"
                :key="item.id"
                :label="item.symbol"
                :value="item.symbol">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="ratio"
          label="最小抵押倍数"
          width="180"
        >
          <template slot-scope="scope">
            <span v-for="(item, key) in scope.row.ratio" style="margin-right: 10px">
                {{key}}: {{item}}
              </span>
          </template>
        </el-table-column>
        <el-table-column
          width="50"
        >
          <template slot-scope="scope">
            <i class="el-icon-circle-plus-outline" style="font-size: 30px; vertical-align: middle" @click="addLender"></i>
          </template>
        </el-table-column>


        <el-table-column
          prop="newratio"
          label="修改后"
        >
          <template slot-scope="scope">
            <el-table
              :data="lenderData"
              :show-header="false"
              class="margin-b20"
            >
              <el-table-column
                prop="lenderSymbol"
                label="币种"
                width="120">
                <template slot-scope="scopes">
                  <!--最小抵押倍数-->
                  <el-select v-model="scope.row[scopes.row.lenderSymbol]" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="_lenderSelect">
                    <el-option
                      v-for="item in lList"
                      :key="item.id"
                      :label="item.symbol"
                      :value="item.symbol">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="lenderratio"
                label="最小抵押倍数"
              >
                <template slot-scope="scopes">
                  <el-input v-model="scopes.row.lenderratio" :placeholder="$t('m.params.enter')"></el-input>

                </template>
              </el-table-column>
              <el-table-column
                align="right"
                width="120">
                <template slot-scope="scopes">
                  <i class="el-icon-remove-outline" style="font-size: 30px; vertical-align: middle" @click="addLender"></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">Edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <i class="el-icon-circle-plus-outline" style="font-size: 30px; vertical-align: middle" @click="addRatioSelect"></i>
    </dd>
  </dl>
</template>
<script>
  import updateDialog from '/path-components/Admin/updateDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {updateDialog},
    props: {
      canEditBit: {
        default: false,
        type: Boolean
      }
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
        lenderData: []
      }
    },
    methods: {
      init () {
        this._getAssetList()
        // config是以url为键名的对象
        // let config = res.config
        let aa = {
          'carrier': {
            'www.zos.io': {
              'carrierList': {
                'CNY': {
                  'cashCarrier': 'carrier-cny',
                  'lendCarrier': 'carrier-cny1'
                },
                'USD': {
                  'cashCarrier': 'carrier-cny',
                  'lendCarrier': 'carrier-cny1'
                }
              }
            },
            'lend.zos.io': {
              'carrierList': {
                'CNY': {
                  'cashCarrier': 'carrier-cny',
                  'lendCarrier': 'carrier-cny1'
                },
                'USD': {
                  'cashCarrier': 'carrier-cny',
                  'lendCarrier': 'carrier-cny1'
                }
              }
            }
          },
          'maintenance_collateral_ratio_limit': {
            'www.zos.io': {
              'CNY': {
                'BTC': 1.4,
                'ZOS': 2.1
              },
              'USD': {
                'ETH': 1.5,
                'ZOS': 2.2
              }
            },
            'lend.zos.io': {
              'CNY': {
                'BTC': 1.4,
                'ZOS': 2.1
              },
              'USD': {
                'ETH': 1.5,
                'ZOS': 2.2
              }
            }
          }
        }
        let ratioObj = aa.maintenance_collateral_ratio_limit
        if (ratioObj) {
          for (let i in ratioObj) {
            if (window.location.host === i) {
              this.isHas = true
              let params = {}
              params.symbol = i
              params.ratio = ratioObj[i]
              for (let ii in ratioObj[i]) {
                params.newratio[ii] = ''
              }
              this.ratioData.push(params)
              break
            }
          }
          // if (this.isHas) {
          //   ZOSInstance.carrier_update()
          // } else {
          //   ZOSInstance.carrier_create()
          // }
        }
        // let config = aa.maintenance_collateral_ratio_limit
        // this.ratioData = []
        // for (let index in config) {
        //   let params = {}
        //   params.url = index
        //   params.carrierList = config[index].carrierList
        //   this.carrierData.push(params)
        // }
        // Apis.instance().db_api().exec('get_carrier_by_account', [this.$store.state.userDataSid])
        //   .then(res => {
        //     if (res.config) {
        //       // config是以url为键名的对象
        //       let config = res.config
        //       let params = {}
        //       for (let index in config) {
        //         params.url = index
        //         params.carrierList = config[index].carrierList
        //         params.radio = config[index].maintenance_collateral_ratio_limit
        //         this.carrierData.push(params)
        //       }
        //     }
        //   })
        //   .catch(err => console.log(err))
      },
      // 得到借贷的币种
      _getAssetList () {
        ZOSInstance.getAssetList()
          .then(res => {
            this.loading = false
            if (res && (res.cash_list || res.lender_list)) {
              this.cList = res.cash_list
              this.lList = res.lender_list
              this.copyClist = [...(res.cash_list)]
              this.copyLlist = [...(res.lender_list)]
              this._isDisabled()
              this._isDisabledLender()
            } else {
              return false
            }
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      },
      // 选择借贷币种
      _cashSelect () {
        this._isDisabled()
        this._isDisabledLender()
      },
      // 借贷币已经有的就禁用
      _isDisabled () {
        this.ratioData.map(item => {
          this.cList.forEach(_item => {
            if (item.symbol === _item.symbol) {
              _item.disabled = true
              return item
            }
          })
        })
      },
      // 抵押币已经有的就禁用
      _isDisabledLender () {
        this.ratioData.map(item => {
          this.lList.forEach(_item => {
            if (item.newratio.symbol === _item.symbol) {
              _item.disabled = true
              return item
            }
          })
        })
      },
      // 增加一条运营商的数据
      addRatioSelect () {
        let addRow = {}
        addRow.symbol = ''
        addRow.ratio = ''
        addRow.newratio = ''
        this.ratioData.push(addRow)
      },
      // 选择抵押币新增
      addLender () {
        alert(1)
        let param = {
          symbol: '',
          lenderratio: ''
        }
        this.lenderData.push(param)
      },
      // 删除一条抵押币数据
      newRatioDelete (row, index) {
        this.lenderData.forEach(item => {
          this.lenderData.splice(index, 1)
        })
      },
      // 编辑运营商
      handleEdit (row) {
        this.updateData = row
        console.log(this.updateData, 'this.updateData')
        this.carrierVisible = true
      },
      // 提交了修改运营商后的回调
      bitCarrier (bool) {
        if (bool) {
          this.carrierVisible = false
        }
      },
      // 提交，输入密码框
      sumbmitCarrier () {
        this.comfirmSumbmitCarrier = true
      },
      // 密码正确后，提交到链
      bitlenderLendCarrier () {
        this.comfirmSumbmitCarrier = false
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

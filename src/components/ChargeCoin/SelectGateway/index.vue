<template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <el-dialog
        :title="$t('m.selectGateway.selectGateway')"
        @close="close"
        :visible.sync="visible"
        width="40%"
        :before-close="handleClose"
        append-to-body="isAppend">
        <div style="overflow: auto !important;height: 50vh !important;">
          <el-table
            :data="gatewayArray"
            style="width: 100%">
            <el-table-column
              :label="$t('m.selectGateway.gatewayAccount')">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('m.selectGateway.totalCharge')">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.depositAmount / Math.pow(10, scope.row.precision) | formatLegalCurrency(scope.row.symbol, scope.row.precision) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('m.selectGateway.totalWithdrawal')">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.withdrawAmount / Math.pow(10, scope.row.precision) | formatLegalCurrency(scope.row.symbol, scope.row.precision) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('m.selectGateway.operation')">
              <template slot-scope="scope">
                <el-button v-if="scope.row.enable"
                  size="mini"
                  @click="handleSelectGateway(scope.$index)">{{$t('m.selectGateway.goto')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import {ZOSInstance} from 'zos-wallet-js'
// import {Apis} from 'zosjs-ws'
// import {FetchChain} from 'zosjs/es'

export default {
  props: {
    // 显示该控件与否
    visible: {
      type: Boolean,
      'default': false
    },
    assetId: {
      type: String,
      'default': ''
    }
  },
  data () {
    return {
      gatewayArray: [],
      getDataFlag: false,
      loading: false
    }
  },
  computed: {
  },
  watch: {
    visible (newValue) {
      if (newValue) {
        this.init()
      } else {
        this.reset()
      }
    }
  },
  methods: {
    // 关闭控件
    close () {
      this.getDataFlag = false
      this.$emit('close')
    },
    getData (asset, gateway) {
      this.assetId = asset
      this.getDataFlag = false
      this.gatewayArray = []
      return ZOSInstance.get_gateway(this.$store.state.admin_id, this.assetId).then(res => {
        let gateNum = res.length
        if (gateNum > 0) {
          for (var index = 0; index < res.length; index++) {
            var element = res[index]
            let gateway = {
              assetId: element.asset_id,
              symbol: element.symbol,
              realSymbol: element.real_symbol,
              assetProperty: element.uasset_property,
              gatewayid: element.gateway_id,
              accountId: element.account_id,
              name: element.account_name,
              url: element.gateway_url,
              precision: element.precision,
              depositAmount: element.deposit_amount,
              withdrawAmount: element.withdraw_amount,
              authorId: element.author_id,
              authourUrl: element.author_url,
              authourName: element.author_name,
              authourAccount: element.author_account_id,
              enable: element.enable
            }
            this.gatewayArray.push(gateway)
          }
        }
        this.getDataFlag = true
        if (gateway !== undefined) {
          for (var inde = 0; inde < this.gatewayArray.length; inde++) {
            if (this.gatewayArray[inde].accountId === gateway) {
              return this.gatewayArray[inde]
            }
          }
          this.$message({
            message: this.$t('m.httpUtils.warning'),
            type: 'error'
          })
          return undefined
        } else if (this.gatewayArray.length === 1) {
          return this.gatewayArray[0]
        } else {
          if (this.gatewayArray.length < 1) {
            this.$message({
              message: this.$t('m.selectGateway.noAvailable'),
              type: 'warning'
            })
            return undefined
          } else {
            return 0
          }
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: this.$t('m.httpUtils.warning'),
          type: 'error'
        })
        return undefined
      })
    },
    init () {
      if (!this.getDataFlag) {
        this.loading = true
        this.getData.then(res => {
          if (res === undefined) {
            this.close()
          } else {
            this.loading = false
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: this.$t('m.httpUtils.warning'),
            type: 'error'
          })
          this.loading = false
        })
      }
    },
    // 重置控件
    reset () {
      this.getDataFlag = false
      this.gatewayArray = []
    },
    handleSelectGateway (index) {
      this.getDataFlag = false
      this.$emit('success', this.gatewayArray[index])
    }
  },
  created () {
  }
}
</script>

<style>
</style>

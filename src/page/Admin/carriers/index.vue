<template>
  <div slot="content" class="container-params" v-loading="loading > 0" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <div>
      <dl>
        <dt class="lh40">
          <span style="width: 120px; vertical-align: middle; height: 40px">
            <!--选择币种-->
            {{$t('m.transfer.XZBZ')}}
          </span>
          <el-select v-model="selectedSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="paramsGet">
            <el-option
              v-for="item in assetList"
              :key="item.id"
              :label="item.symbol"
              :value="item">
            </el-option>
          </el-select>
         <span style="width: 120px; vertical-align: middle; height: 40px">
            <!--选择模式-->
            &nbsp;&nbsp;{{$t('m.transfer.XZMS')}}
          </span>
          <el-select v-model="selectedType" value-key="id" :placeholder="$t('m.transfer.XZMS')" @change="typeGet">
            <el-option
              v-for="item in Type"
              :key="item.id"
              :label="$t(item.label)"
              :value="item">
            </el-option>
          </el-select>
        </dt>
        <el-tabs  v-if="initDone" v-model="activeTabName" @tab-click="handleClick" class="margin-t40">
          <el-tab-pane :label="$t('m.borrow.radio')" name="four"  v-if="showChild">
            <collateralratio ref="upRatio" :optionId="optionId" :symbol="selectedSymbol.symbol" :assetId="selectedSymbol.id" :Type="selectedType.id"></collateralratio>
          </el-tab-pane>
          <el-tab-pane :label="$t('m.borrow.addrate')" name="six"  v-if="showChild">
            <addrate ref="upAddrate" :optionId="optionId" :symbol="selectedSymbol.symbol" :assetId="selectedSymbol.id" :Type="selectedType.id"> </addrate>
          </el-tab-pane>
        </el-tabs>
      </dl>
    </div>
    <!--确认离开此页面？-->
    <el-dialog
      :title="$t('m.borrow.note')"
      :visible.sync="confirmVisible"
      width="30%"
    >
      <span>{{confirmText}}</span>
      <span>{{$t('m.borrow.giveupSure')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isConfirm = false;confirmLeave()">{{$t('m.cancel')}}</el-button>
        <el-button type="primary" @click="isConfirm = true;confirmLeave()">{{$t('m.sure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getStore, setStore} from '/js-utils/storage'
  import {ZOSInstance} from 'zos-wallet-js'
  import YButton from '/path-components/element/YButton'
  import addrate from '/path-page/Admin/carriers/addrate.vue'
  import collateralratio from '/path-page/Admin/carriers/collateralratio.vue'
  export default {
    components: {YButton, collateralratio, addrate},
    data () {
      return {
        loading: 1,
        initDone: false,
        // 选择币种
        assetList: [],
        // 选中的币种
        selectedSymbol: {},
        selectedSymbolLast: {},
        selectedType: {},
        selectedTypeLast: '',
        author: '',
        showChild: false,
        optionId: '',
        // 参数
        params: {},
        Type: [],
        username: this.$store.state.userName,
        activeTabName: 'four',
        feeZos: ''
      }
    },
    computed: {
    },
    // 修改了，离开时的提示
    beforeRouteLeave (to, from, next) {
      if (this.loading > 0 || !this.initDone) return
      if (this.$store.state.userDataSid !== '') {
        if (this.showChild && !this.$refs.upAddrate.canLeave()) {
          this.confirmText = this.$t('m.borrow.addradio')
          this.nexts = next
          this.confirmVisible = true
        } else if (this.showChild && !this.$refs.upRatio.canLeave()) {
          this.confirmText = this.$t('m.borrow.radio')
          this.nexts = next
          this.confirmVisible = true
        } else {
          next()
        }
      } else {
        next()
      }
    },
    methods: {
      // 确认是否离开
      confirmLeave () {
        this.confirmVisible = false
        if (this.nexts === 1) {
          if (this.isConfirm) {
            this.init()
            this.updateParamsShow = false
            this.tableDataParamsShow = !this.tableDataParamsShow
          }
          this.nexts = ''
        } else {
          if (this.isConfirm) {
            this.nexts()
          } else {
            this.nexts(false)
          }
        }
      },
      // 初始数据
      init () {
        this.loading = 1
        this.loading++
        this.Type = ZOSInstance.getOptionSupport(this.$store.state.loanMode)
        ZOSInstance.getLoanAssetList().then(res => {
          if (res && res.length > 0) {
            this.selectedSymbol = (getStore('selectedSymbols') ? JSON.parse(getStore('selectedSymbols')) : res[0])
            this.assetList = res
          }
          return ZOSInstance.getAssetList()
        }).then(item => {
          if (!item.cash_list || !item.lender_list || item.cash_list.length <= 0 || item.lender_list.length <= 0) {
            this.loading--
            return
          }
          this.selectedType = getStore('selectedType' + this.selectedSymbol.symbol) ? JSON.parse(getStore('selectedType' + this.selectedSymbol.symbol)) : this.Type[0]
          if (this.Type.length === 1) this.selectedType = this.Type[0]
          // 此处必须延迟调用，否则 showChild 还没有把子页面显示出来，容易出错。
          setTimeout(this.ansyChild, 100)
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
      // 选择不同币种，请求不同的参数
      typeGet (val) {
        if (this.selectedTypeLast !== val) {
          this.selectedTypeLast = val
          setStore('selectedType' + this.selectedSymbol.symbol, this.selectedTypeLast)
          // 此处必须延迟调用，否则 showChild 还没有把子页面显示出来，容易出错。
          setTimeout(this.ansyChild, 1000)
        }
      },
      paramsGet (val) {
        if (this.selectedSymbolLast.symbol !== val.symbol) {
          this.selectedSymbol = val
          this.selectedSymbolLast = val
          setStore('selectedSymbols', this.selectedSymbol)
          // 此处必须延迟调用，否则 showChild 还没有把子页面显示出来，容易出错。
          setTimeout(this.ansyChild, 1000)
        }
      },
      ansyChild () {
        this.showChild = true
        if (this.initDone) {
          if (this.showChild) {
            this.$refs.upAddrate.changeOption(this.optionId, this.selectedSymbol.id, this.selectedType.id, this.selectedSymbol.symbol)
            this.$refs.upRatio.changeOption(this.optionId, this.selectedSymbol.id, this.selectedType.id, this.selectedSymbol)
          }
        }
        this.initDone = true
      }
    },
    destroyed () {
      setStore('ActCarrier', this.activeTabName)
    },
    mounted () {
      this.activeTabName = getStore('ActCarrier') ? getStore('ActCarrier') : 'four'
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

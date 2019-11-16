<template>
  <el-dialog
    :title="$t('m.params.carrierAdmin')"
    :visible.sync="carrierVisible"
    width="45%"
    :before-close="handleClose">
    <div v-loading="loading" :element-loading-text="$t('m.loading')" class="container-params" style="min-height: 10vh;">
      <dl class="demo-ruleForm">
        <!--修改内容-->
        <dt>{{$t('m.params.updateContent')}}</dt>
        <dd style="padding: 10px">{{carrierUpdate.updateContent}}</dd>
        <!--修改人-->
        <dt class="margin-t10">{{$t('m.params.updateUser')}}</dt>
        <dd style="padding: 10px">
          <el-input v-model="userName" readonly></el-input>
        </dd>
        <!--修改时间-->
        <dt class="margin-t10">{{$t('m.params.updateTime')}}</dt>
        <dd style="padding: 10px"><el-input :value="Date.parse(new Date) | formatProposalTime()" readonly></el-input></dd>
        <!--手续费-->
        <dt class="margin-t10">2.{{$t('m.params.poundage')}}</dt>
        <dd style="padding: 10px">
          <div class="feel">
            <!--燃料费-->
            <!--(约)-->
            <span>{{$t('m.fuelCost')}}: {{carrierUpdate.fee}} ZOS{{$t('m.transfer.about')}}</span>
            <span style="flex: 1"></span>
            <!--可用数量-->
            <span>{{$t('m.transfer.KYSL')}}: {{available}} ZOS</span>
            <!--获得-->
            <a class="margin-l10" @click="zosDialog=true"> {{$t('m.transfer.get')}}ZOS</a>
          </div>
        </dd>
        <!--数量不足-->
        <dd v-show="zosShow(carrierUpdate.fee)" style="color: #ff0000">ZOS{{$t('m.transfer.numNull')}}</dd>
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

        <!--获得ZOS-->
        <getzosdialog @isVisible="isVisible" :visible="zosDialog" :isAppend="true"></getzosDialog>
        <!--关于优惠-->
        <coupon-dialog @couponClose="couponClose" :isAppend="true" :visible="couponVisible"></coupon-dialog>

        <dd class="margin-t10 text-right">
          <y-button
            :text="$t('m.cancel')"
            @btnClick="handleClose"
          ></y-button>
          <y-button
            :text="$t('m.sure')"
            @btnClick="carrierSubmit"
            :classStyle="zosShow(carrierUpdate.fee) ? 'disabled-btn' : 'main-btn'"
          ></y-button>
        </dd>

      </dl>

    </div>
  </el-dialog>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  import getzosdialog from '/path-components/Chain/getzosDialog'
  import couponDialog from '/path-components/Chain/couponDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import formatAssets from '/js-api/public'
  export default {
    components: {YButton, getzosdialog, couponDialog, formatAssets},
    props: {
      carrierVisible: {
        default: false,
        type: Boolean
      },
      carrierUpdate: {
        default: null,
        type: Object
      }
    },
    data () {
      return {
        loading: false,
        zosDialog: false,
        couponVisible: false
      }
    },
    computed: {
      userName () {
        return this.$store.state.userName
      },
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
    methods: {
      carrierSubmit () {
        this.loading = true
        ZOSInstance.broadcastTransaction(this.carrierUpdate.tr)
          .then(res => {
            this.loading = false
            if (res) {
              this.$message({
                type: 'success',
                // '提交提案成功'
                message: this.$t('m.badloans.subSucc')
              })
              this.carrierVisible = false
              this.$emit('submitCarrier', true)
            }
          })
          .catch(err => {
            this.loading = false
            console.log(err)
            this.$message({
              type: 'warning',
              message: err
            })
          })
      },
      // 获得ZOS
      isVisible () {
        this.zosDialog = false
      },
      // 优惠
      couponClose () {
        this.couponVisible = false
      },
      handleClose () {
        this.carrierVisible = false
        this.$emit('submitCarrier', false)
      }
    }
  }
</script>
<style scoped lang="scss">
  .container-params {
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

</style>

<template>
  <!--关于优惠券-->
  <el-dialog
    :title="$t('m.transfer.abountCoupons')"
    :visible.sync="visible"
    width="35%"
    :append-to-body="isAppend"
    @close="close"
  >
    <div v-loading="loading" :element-loading-text="$t('m.loading')" class="container-params" style="min-height: 10vh;">
      <dl class="demo-ruleForm">
        <dd>
          <!--优惠券可以抵扣各种操作的燃料费消耗-->
          <p>1.{{$t('m.transfer.deduct')}}</p>
          <!--优惠券每月免费领取1次，10个ZOS-->
          <p>2.{{$t('m.transfer.monthOnce')}}{{couponPer}}{{$t('m.ge')}}/{{$t('m.months')}}</p>
          <!--月底当月未使用的优惠券清零-->
          <p>3.{{$t('m.transfer.couponReset')}}</p>
        </dd>
      </dl>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="visible = false">{{$t('m.sure')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
  import {Apis} from 'zosjs-ws'
  export default {
    props: {
      visible: {
        type: Boolean,
        defalut: true
      },
      isAppend: {
        type: Boolean,
        defalut: false
      }
    },
    data () {
      return {
        couponPer: 0,
        loading: false
      }
    },
    methods: {
      // 关闭dialog
      close () {
        this.$emit('couponClose', false)
      },
      init () {
        this.loading = true
        Apis.instance().db_api().exec('get_objects', [['2.0.0']]).then(res => {
          this.loading = false
          if (res && res[0].parameters) {
            this.couponPer = res[0].parameters.coupon_per_month / Math.pow(10, 5)
          }
        }).catch(err => {
          this.loading = false
          console.log(err)
          this.$message({
            type: 'warning',
            message: err
          })
        })
      }
    },
    mounted () {
      // 组件创建完成，属性已绑定，但DOM还没有生成前就要loading,等请求完成后，再显示DOM
      this.loading = true
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
<style scoped>
</style>

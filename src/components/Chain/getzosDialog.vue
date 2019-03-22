w<template>
  <!--你可以通过以下方式获得ZOS-->
  <el-dialog
    :title="$t('m.transfer.getMethod')"
    :visible.sync="visible"
    width="30%"
    @close="close"
    :append-to-body="isAppend"
  >
    <dl class="demo-ruleForm">
      <dd>
        <!--注册送-->
        <p>1:{{$t('m.transfer.getMethod1')}}</p>
        <!--邀请送-->
        <p>2:{{$t('m.transfer.getMethod2')}}</p>
        <!--还款送-->
        <p>3:{{$t('m.transfer.getMethod3')}}</p>
        <!--投资送-->
        <p>4:{{$t('m.transfer.getMethod4')}}</p>
        <!--好友转账-->
        <p>5:{{$t('m.transfer.getMethod5')}}</p>
      </dd>
    </dl>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('isVisible')">{{$t('m.sure')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
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
      }
    },
    methods: {
      close () {
        this.$emit('isVisible')
      }
    },
    mounted () {
    }
  }
</script>
<style scoped>
</style>

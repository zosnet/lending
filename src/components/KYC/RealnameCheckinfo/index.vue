<template>
    <div>
      <el-dialog
        :title="$t('m.authentication.title')"
        @close="close"
        :visible.sync="visible"
        width="30%"
        append-to-body="isAppend"
        >
          <div v-loading="loading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw;">
            <div v-if="kycStatus==='0'">{{$t('m.authentication.kycState1')}}</div>
            <div v-else-if="kycStatus==='2'">{{$t('m.authentication.kycState3')}}:{{remark}}</div>
            <div v-else>{{$t('m.authentication.kycState2')}}</div>
            <!--姓名-->
            <div>{{$t('m.authentication.name')}}:{{kycName}}</div>
            <!--证件类型-->
            <div>{{$t('m.authentication.IDsType')}}:{{kycType === '1' ? $t('m.authentication.IDCard'):$t('m.authentication.passport')}}</div>
            <!--证件号码-->
            <div>{{$t('m.authentication.IDsCode')}}:{{kycNumBer}}</div>
             <!--证件号码-->
            <div>{{$t('m.authentication.Chainstatus')}}:{{chainstatus}}</div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close()">{{$t('m.page.confirm')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
  props: {
    // 显示该控件与否
    visible: {
      type: Boolean,
      'default': true
    },
    kycInfo: {
      type: Object,
      'default': null
    },
    kycStatus: {
      type: String,
      'default': '-1'
    }
  },
  data () {
    return {
      kycName: '',
      kycType: '',
      kycNumBer: '',
      chainstatus: '',
      remark: '',
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
      this.$emit('close')
    },
    // 重置控件
    reset () {
      const that = this
      that.kycName = ''
      that.kycType = ''
      that.kycNumBer = ''
      that.remark = ''
    },
    // 获取充值地址
    init () {
      console.log('kycInfo', this.kycInfo)
      if (this.kycInfo) {
        const that = this
        that.kycName = this.kycInfo.name
        that.kycType = this.kycInfo.ictype
        that.kycNumBer = this.kycInfo.icno
        that.chainstatus = this.kycInfo.chainstatus
        that.remark = this.kycInfo.remark
      }
    }
  },
  created () {
  }
}
</script>

<style>
</style>

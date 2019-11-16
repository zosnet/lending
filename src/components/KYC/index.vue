<template>
    <div>     <!--剝往kyc-->
      <el-dialog
      :title="$t('m.information.KYC')"
      :visible.sync="hintKycDialog"
      @close="close"
      width="30%">
      <h3 v-loading="loading" :element-loading-text="$t('m.applyWaiting')" >{{$t('m.authentication.noKyc')}}</h3>
      <span slot="footer" class="dialog-footer" >
          <!--坖 消-->
          <el-button @click="closeAuthentication()">{{$t('m.cancel')}}</el-button>
          <el-button type="primary" @click="goAuthentication()">{{$t('m.transfer.goto')}}</el-button>
      </span>
      </el-dialog>
      <!--KYC-->
      <realname-checkinfo :visible="checkinfoDialog" :kycInfo="kycInfo" :kycStatus="kycStatusCode" @close='onCheckinfoClose' @success="onCheckinfoSuccess"></realname-checkinfo>
      <realname-authentication :visible="authenticationDialog" :authorid="authorid" :kycUrl="kycurl" @close='onAuthenticationClose'  @success="onAuthenticationSuccess"></realname-authentication>
    </div>
</template>
<script>
import realnameAuthentication from '/path-components/KYC/RealnameAuthentication'
import realnameCheckinfo from '/path-components/KYC/RealnameCheckinfo'
export default {
  components: {realnameAuthentication, realnameCheckinfo},
  props: {
    hintKycDialog: {
      type: Boolean,
      default: false
    },
    kycInfo: {
      type: Object,
      default: null
    },
    kycStatusCode: {
      type: Number,
      default: -1
    },
    checkinfoDialog: {
      type: Boolean,
      default: false
    },
    kycurl: {
      type: String,
      default: ''
    },
    authorid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkinfoDialog: false,
      loading: false,
      updateRecode: false,
      authenticationDialog: false
    }
  },
  methods: {
    close (updateRecode) {
      this.$emit('close', updateRecode)
    },
    onCheckinfoClose () {
      this.checkinfoDialog = false
      this.$parent.checkinfoDialog = false
      this.close(false)
    },
    onCheckinfoSuccess () {
    },
    onAuthenticationClose (updateRecode) {
      this.authenticationDialog = false
      this.hintKycDialog = false
      this.$parent.hintKycDialog = false
      this.close(updateRecode)
      console.log('onAuthenticationClose', updateRecode)
    },
    onAuthenticationSuccess () {
    },
    closeAuthentication () {
      this.hintKycDialog = false
      this.$parent.hintKycDialog = false
    },
    goAuthentication () {
      this.hintKycDialog = false
      this.$parent.hintKycDialog = false
      this.authenticationDialog = true
    }
  },
  mounted () {
  }
}
</script>
<style>

</style>



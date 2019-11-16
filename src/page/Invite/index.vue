<template>
  <div slot="content" class="container" v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div v-if="!loading">
      <!--邀请方式-->
      <h1>{{$t('m.invite.title')}}</h1>
      <ul class="basicinfos">
        <!--<li>-->
          <!--&lt;!&ndash;APP邀请码&ndash;&gt;-->
          <!--<span class="pull-left" style="width: 12%">{{$t('m.invite.inviteCode')}}</span>-->
          <!--<el-input v-model="chargeCode" id="charge-code" class="pull-left" style="width: 30%" readonly></el-input>-->
          <!--&lt;!&ndash;复制邀请码&ndash;&gt;-->
          <!--<el-button type="primary" @click="copyinfo('charge-code')" style="margin-left: 30px">{{$t('m.invite.copyInvite')}}</el-button>-->
        <!--</li>-->
        <li>
          <!--WEB邀请链接-->
          <span class="pull-left" style="width: 12%">{{$t('m.invite.inviteUrl')}}</span>
          <el-input v-model="chargeAdrress" id="charge-adrress" class="pull-left" style="width: 30%" readonly></el-input>
          <!--复制链接-->
          <el-button type="primary" @click="copyinfo('charge-adrress')" style="margin-left: 30px">{{$t('m.invite.copyUrl')}}</el-button>
        </li>
        <!--复制信息-->
        <!-- 复制成功 -->
        <el-dialog
          :visible.sync="copyDialog"
          width="30%"
          center>
          <!-- 信息已经复制到剪贴板，可直接粘贴 -->
          <!--地址已经复制到你的剪贴板！-->
          <p class="text-center">{{$t('m.invite.copySucc')}}</p>
          <span slot="footer" class="dialog-footer">
              <!-- 确定 -->
              <el-button type="primary" @click="copyDialog = false">{{$t('m.sure')}}</el-button>
            </span>
        </el-dialog>
      </ul>
    </div>
    <div v-else class="un-login">
      <!--邀请好友注册，轻松获得交易收益-->
      <p>{{$t('m.invite.inviteFriends')}}</p>
      <el-button type="primary" @click="login">{{$t('m.login')}}</el-button>
    </div>
    <h1>
      <!--活动细则-->
      {{$t('m.invite.activity1')}}
    </h1>
    <p style="margin-top: 30px">
      {{$t('m.invite.inviteAct1')}}<br>
      {{$t('m.invite.inviteAct2')}}<br>
    </p>
    <h1>
      <!--活动细则-->
      {{$t('m.invite.activity')}}
    </h1>
    <p style="margin-top: 30px">
      1. {{$t('m.invite.inviteContent')}}<br>
      2. {{$t('m.invite.inviteContent1')}}<br>
      3. {{$t('m.invite.inviteContent2')}}<br>
      4. {{$t('m.invite.inviteContent3')}}<br>
      <!--5. {{$t('m.invite.inviteContent4')}}-->
    </p>
    <!--登录-->
    <login-dialog :visible="!this.$store.state.login" ></login-dialog>
  </div>
</template>
<script>
  import loginDialog from '/path-page/Login/loginDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  export default {
    components: {loginDialog},
    data () {
      return {
        loading: false,
        copyDialog: false
      }
    },
    computed: {
      // 邀请地址
      chargeAdrress () {
        const userName = this.$store.state.userName
        return `${window.location.origin}/#/register?refer=${userName}`
      },
      chargeCode () {
        return 'ACBC'
      }
    },
    methods: {
      // 点击复制信息弹窗
      copyinfo (val) {
        let info = document.getElementById(val)
        info.select()
        document.execCommand('Copy')// 复制必须放在点击函数里面的外层
        this.copyDialog = true
      },
      login () {
        let sLogin = !ZOSInstance.accountIsLoginout()
        this.$store.state.login = sLogin
        if (!sLogin) {
          this.$store.state.loginPath = this.$router.options.nextpath
        }
      }
    },
    mounted () {
      this.loading = false
    }
  }
</script>
<style scoped lang="scss">
  .container {
    margin-top: 10px;
    padding: 50px;
    background: #fff;
    border-radius: 4px;
    max-width: 1170px;
    h1{
      font-size: 15px;
      font-weight: bold;
    }
  }
  .basicinfos {
    padding: 0 0 0 50px;
    line-height: 60px;
  }
  .un-login{
    text-align: center; line-height: 50px;
  }
</style>

<template>
  <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
    <div slot="content" style="padding: 0 15px 0 10px" v-show="!loading">
      <el-row :gutter="20" class="lh50">
        <el-col :span="2" class="f16">
          <!--主控密钥-->
          {{$t('m.permission.masterKey')}}
        </el-col>
        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :span="16">
              <!--Owner key,仅能理本账户其他权限-->
              {{$t('m.permission.ownerKey')}}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <!--公钥-->
            <el-col :span="16">{{$t('m.permission.publicKey')}}:</el-col>
          </el-row>
          <div v-for="(item, index) in owner.ownerPublicKey">
            <el-row :gutter="20" >
              <el-col :span="14">{{item}}</el-col>
              <el-col :span="6">
                <el-button type="primary" @click="showPrivateKey(item, 1);">
                  <!--'查看私钥': '隐藏私钥'-->
                  {{!mainqcodeShow ? $t('m.permission.privateKeyShow') : $t('m.permission.privateKeyHidden')}}
                </el-button>
              </el-col>
            </el-row>
            <div v-show="mainqcodeShow">
              <el-row :gutter="20">
                <!--私钥-->
                <el-col :span="16">{{$t('m.permission.privateKey')}}:</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">{{owner.ownerPrivateKey}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <!--id是公钥-->
                <el-col :span="16"><div :id="item + 'mainqcodeShow'"></div></el-col>
              </el-row>
            </div>
          </div>

        </el-col>
      </el-row>
      <div class="line"></div>
      <!--输入资金密码-->
      <password-dialog :visible="comfirmPassword" @bitlenderLendOrder="bitlenderLendOrder"></password-dialog>

      <el-row :gutter="20" class="lh50 margin-t10">
        <el-col :span="2" class="f16">
          <!--资金密钥-->
          {{$t('m.permission.assetKey')}}
        </el-col>
        <el-col :span="18">
          <el-row :gutter="20">
            <!--Active Key，可控制转帐、管理零钱权限-->
            <el-col :span="16">{{$t('m.permission.activeKey')}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <!--公钥-->
            <el-col :span="16">{{$t('m.permission.publicKey')}}:</el-col>
          </el-row>
          <div v-for="(item, index) in active.activePublicKey">
            <el-row :gutter="20" >
              <el-col :span="14">{{item}}</el-col>
              <el-col :span="6">
                <el-button type="primary" @click="showPrivateKey(item, 2);">
                  <!--'查看私钥': '隐藏私钥'-->
                  {{!moneyqcodeShow ? $t('m.permission.privateKeyShow') : $t('m.permission.privateKeyHidden')}}
                </el-button>
              </el-col>
            </el-row>
            <div v-show="moneyqcodeShow">
              <el-row :gutter="20">
                <el-col :span="16">
                  <!--私钥-->
                  {{$t('m.permission.privateKey')}}:</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">{{active.activePrivateKey}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <!--id是公钥-->
                <el-col :span="16"><div :id="item+'moneyqcodeShow'"></div></el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="20" class="lh50 margin-t10">
        <el-col :span="2" class="f16">
          <!--备注密钥-->
          {{$t('m.permission.momeKey')}}
        </el-col>
        <el-col :span="18">
          <el-row :gutter="20">
            <!--Active Key，可控制转帐、管理零钱权限-->
            <el-col :span="16">{{$t('m.permission.memoKey')}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <!--公钥-->
            <el-col :span="16">{{$t('m.permission.publicKey')}}:
            <span v-if="!isEncMemo(memo.memoPublicKey)" style="color: red">{{$t('m.permission.noEncKey')}}</span></el-col>
          </el-row>
            <el-row :gutter="20" >
              <el-col :span="14">{{memo.memoPublicKey}}</el-col>
              <el-col :span="6">
                <el-button type="primary" @click="showPrivateKey(memo.memoPublicKey, 3);">
                  <!--'查看私钥': '隐藏私钥'-->
                  {{!momqcodeShow ? $t('m.permission.privateKeyShow') : $t('m.permission.privateKeyHidden')}}
                </el-button>
              </el-col>
            </el-row>
            <div v-show="momqcodeShow">
              <el-row :gutter="20">
                <!--私钥-->
                <el-col :span="16">{{$t('m.permission.privateKey')}}:</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">{{memo.memoPrivateKey}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <!--id是公钥-->
                <el-col :span="16"><div :id="memo.memoPublicKey+'momqcodeShow'"></div></el-col>
              </el-row>
            </div>


        </el-col>
      </el-row>

      <el-row :gutter="20" class="lh50 margin-t10">
        <el-col :span="2" class="f16">
          <!--信息密钥-->
          {{$t('m.permission.authKey')}}
        </el-col>
        <el-col :span="18">
          <el-row :gutter="20">
            <!--Active Key，可控制转帐、管理零钱权限-->
            <el-col :span="16">{{$t('m.permission.authorKey')}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <!--公钥-->
            <el-col :span="16">{{$t('m.permission.publicKey')}}:</el-col>
          </el-row>
            <el-row :gutter="20" >
              <el-col :span="14">{{auth.authPublicKey}}</el-col>
              <el-col :span="6">
                <el-button type="primary" @click="showPrivateKey(auth.authPublicKey, 4);">
                  <!--'查看私钥': '隐藏私钥'-->
                  {{!authqcodeShow ? $t('m.permission.privateKeyShow') : $t('m.permission.privateKeyHidden')}}
                </el-button>
              </el-col>
            </el-row>
            <div v-show="authqcodeShow">
              <el-row :gutter="20">
                <!--私钥-->
                <el-col :span="16">{{$t('m.permission.privateKey')}}:</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">{{auth.authPrivateKey}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <!--id是公钥-->
                <el-col :span="16"><div :id="auth.authPublicKey+'authqcodeShow'"></div></el-col>
              </el-row>
            </div>


        </el-col>
      </el-row>

    </div>
  </div>
</template>
<script>
  import passwordDialog from '/path-components/Login/passwordDialog'
  import {ZOSInstance} from 'zos-wallet-js'
  import QRCode from 'qrcodejs2'
  export default {
    components: {passwordDialog},
    data () {
      return {
        mainqcodeShow: false,
        moneyqcodeShow: false,
        momqcodeShow: false,
        authqcodeShow: false,
        // 整体加载中
        loading: true,
        owner: {
          ownerPublicKey: '',
          ownerPrivateKey: ''
        },
        active: {
          activePublicKey: '',
          activePrivateKey: ''
        },
        memo: {
          memoPublicKey: '',
          memoPrivateKey: ''
        },
        auth: {
          authPublicKey: '',
          authPrivateKey: ''
        },
        // 输入密码弹窗
        comfirmPassword: false,
        password: '',
        // 输入密码加载中
        loadings: ''
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      // 生成二维码
      qcode (id, val) {
        document.getElementById(id).innerHTML = ''
        let code = new QRCode(id, {
          width: 128,
          height: 128
        })
        code.makeCode(val)
      },
      // 获取公钥
      getAccountPublicKey () {
        this.loading = true
        ZOSInstance.getAccountPublicKey(this.$store.state.userDataSid)
          .then(res => {
            this.loading = false
            if (res) {
              this.owner.ownerPublicKey = res.owner // 数组
              this.active.activePublicKey = res.active // 数组
              this.memo.memoPublicKey = res.memo
              this.auth.authPublicKey = res.auth
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      bitlenderLendOrder (data) {
        let publicKey = localStorage.getItem('publicKey')
        let publicKeyIndex = localStorage.getItem('publicKeyIndex')
        if (data) {
          let privateKey = ZOSInstance.getAccountPrivateKey(publicKey)
          if (privateKey) {
            this.comfirmPassword = false
            if (publicKeyIndex === '1') {
              this.owner.ownerPrivateKey = privateKey
              this.mainqcodeShow = !this.mainqcodeShow
              this.qcode(publicKey + 'mainqcodeShow', privateKey)
            } else if (publicKeyIndex === '2') {
              this.active.activePrivateKey = privateKey
              this.moneyqcodeShow = !this.moneyqcodeShow
              this.qcode(publicKey + 'moneyqcodeShow', privateKey)
            } else if (publicKeyIndex === '3') {
              this.memo.memoPrivateKey = privateKey
              this.momqcodeShow = !this.momqcodeShow
              this.qcode(publicKey + 'momqcodeShow', privateKey)
            } else if (publicKeyIndex === '4') {
              this.auth.authPrivateKey = privateKey
              this.authqcodeShow = !this.authqcodeShow
              this.qcode(publicKey + 'authqcodeShow', privateKey)
            }
          }
        } else {
          this.comfirmPassword = false
        }
      },
      isEncMemo (val) {
        if (/111111111111111111111/.test(val) || /6FUsQ2hYRj1JSvabewWfUWTXyoDq6btmfLFjmXwby5GJgzEvT5/.test(val)) return false
        else return true
      },
      // 显示对应的私钥
      showPrivateKey (val, publicKeyIndex) {
        if (publicKeyIndex === 1) {
          if (!this.mainqcodeShow) {
            this.comfirmPassword = true
          } else {
            this.mainqcodeShow = !this.mainqcodeShow
          }
        } else if (publicKeyIndex === 2) {
          if (!this.moneyqcodeShow) {
            this.comfirmPassword = true
          } else {
            this.moneyqcodeShow = !this.moneyqcodeShow
          }
        } else if (publicKeyIndex === 3) {
          if (!this.momqcodeShow) {
            if (this.isEncMemo(val)) this.comfirmPassword = true
            else this.bitlenderLendOrder(true)
          } else {
            this.momqcodeShow = !this.momqcodeShow
          }
        } else if (publicKeyIndex === 4) {
          if (!this.authqcodeShow) {
            this.comfirmPassword = true
          } else {
            this.authqcodeShow = !this.authqcodeShow
          }
        }
        localStorage.setItem('publicKeyIndex', publicKeyIndex)
        localStorage.setItem('publicKey', val)
      }
    },
    mounted () {
      // mounted挂载结束后，如果已经初始化成功，initFinished是true就直接请求。
      this.loading = true
      if (this.$store.state.initFinished) {
        this.getAccountPublicKey()
      } else {
        this.$root.$on('initFinished', (data) => {
          this.getAccountPublicKey()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "/path-assets/style/mixin";
  .basicinfos {
    padding: 0 0 0 50px;
    line-height: 40px;
  }
  .avatar-box {
    height: 124px;
    display: flex;
    margin: 0 30px 30px;
    border-bottom: #dadada solid 1px;
    line-height: 30px;
    display: flex;
    align-items: center;
    .img-box {
      @include wh(80px);
      border-radius: 5px;
      overflow: hidden;
    }
    img {
      display: block;
      @include wh(100%)
    }
    .r-box {
      margin-left: 20px;
      h3 {
        font-size: 18px;
        font-weight: 400;
        color: #333;
      }
    }
  }

  // 修改头像
  .edit-avatar {
    z-index: 9999;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include wh(100%);
    background-color: rgba(0, 0, 0, .5);
    @extend %block-center;
    .content {
      display: flex;
      padding: 45px 100px 0;
    }
    > div {
      box-sizing: content-box;
      @include wh(700px, 500px);
      margin: 0;
    }
    .btn {
      width: 80px;
      height: 30px;
      margin-left: 10px;
      position: relative;
      text-align: center;
      line-height: 30px;
      text-shadow: rgba(255, 255, 255, .496094) 0 1px 0;
      border: 1px solid #E6E6E6;
      border-radius: 10px;
      &:hover {
      }
      a {
        color: #666;
        display: block;
        @include wh(100%);
      }
    }
    input[type=file] {
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      opacity: 0;
      width: 80px;
      height: 30px;
      cursor: pointer;
      box-sizing: border-box;
      border: 15px solid #000;
      overflow: hidden;
    }
    .edit-l {
      width: 100px;
      text-align: center;
    }
    .edit-r {
      margin-left: 20px;
      flex: 1;
      > div {
        border: 1px solid #ccc;
        width: 320px;
        height: 320px;
      }
    }
  }

  .image-container {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    padding: 0 10px;
    @extend %block-center;
    &:hover {
      svg {
        transition: all 1s;
        transform: rotate(360deg);
        transform-origin: 50% 50%;
      }
      path {
        fill: #8a8a8a;
      }
    }
  }

  .big {
    display: block;
    width: 320px;
    height: 320px;
  }

  .bootom-btn {
    padding: 0 15px;
    border-top: 1px solid #E6E6E6;
    bottom: 0;
    height: 60px;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

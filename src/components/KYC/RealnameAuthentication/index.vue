<template>
      <el-dialog
        :title="$t('m.authentication.title')"
        @close="close"
        :visible.sync="visible"
        width="45%"
        append-to-body="isAppend"
        >
          <div v-loading="loading" :element-loading-text="$t('m.applyWaiting')" :style="{'height': iframeHeight + 'px'}">
                <iframe
                    id="iframe"
                    ref="iframe"
                    :src="kycAddress"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    vspace="0"
                    hspace="0"
                    allowtransparency="true"
                    scrolling="yes"
                    allowfullscreen="true"
                ></iframe>
          </div>
        </el-dialog>
</template>

<script>
import axios from 'axios'
import {ZOSInstance} from 'zos-wallet-js'
import {getStore, getLocalStore, setLocalStore} from '/js-utils/storage'
import {getKycAddress} from '/js-api/index'
export default {
  components: {
  },
  props: {
    // 显示该控件与否
    visible: {
      type: Boolean,
      'default': true
    },
    kycUrl: {
      type: String,
      'default': ''
    },
    authorid: {
      type: String,
      'default': ''
    }
  },
  data () {
    return {
      dialogVisible: true,
      gatewayConfig: '',
      loading: true,
      username: '',
      userid: '',
      kycAddress: '',
      iframeHeight: 100,
      loadTimeout: null,
      updateRecode: false
    }
  },
  computed: {
  },
  watch: {
    visible (newValue) {
      if (newValue) {
        this.init()
      }
    }
  },
  methods: {
    // 关闭控件
    close () {
      window.removeEventListener('message', this.windowEventListener)
      this.kycAddress = ''
      this.kycUrl = ''
      this.$emit('close', this.updateRecode)
    },
    windowEventListener (event) {
      console.log('windowEventListener', event)
      if (this.kycAddress.indexOf(event.origin) !== -1) {
        let data = event.data
        switch (data.type) {
          case 'autoHeight':
            this.loading = false
            this.iframeHeight = data.value
            if (this.loadTimeout) {
              clearTimeout(this.loadTimeout)
              this.loadTimeout = null
            }
            console.log('6', Date.now())
            break
          case 'closeDialog':
            this.loading = false
            this.close()
            break
          case 'completeKyc':
            if (data.url) {
              this.updateRecode = true
              let statusStr = getLocalStore(this.$store.state.userName + 'kycStatus')
              let kycStatus = statusStr !== null ? JSON.parse(statusStr) : []
              if (!kycStatus) {
                kycStatus = []
              }
              let kyc = null
              for (let index = 0; index < kycStatus.length; index++) {
                let element = kycStatus[index]
                if (element.url === data.url) {
                  kyc = element
                  break
                }
              }
              if (!kyc) {
                kycStatus.unshift({url: data.url})
                setLocalStore(this.$store.state.userName + 'kycStatus', kycStatus)
              }
            }
            break
          case 'showMessage':
            this.$message({
              message: data.value,
              type: data.messageType
            })
            break
          default:
            break
        }
      }
    },
    init () {
      if (this.kycUrl.charAt(this.kycUrl.length - 1) !== '/') {
        this.kycUrl = this.kycUrl + '/'
      }
      window.addEventListener('message', this.windowEventListener)
      this.loading = true
      this.username = getStore('userName')
      this.userid = getStore('userId')
      let token = Number((new Date().getTime() / 30000).toFixed(0)) + 12356
      let kycUrl = this.kycUrl + '/zos-kyc/'
      getKycAddress(kycUrl, {module: 'WEB'}).then(res => {
        let kycWebUrl = res.url
        kycWebUrl = ZOSInstance.ReplaceAddress(kycWebUrl)
        console.log('2', Date.now(), kycWebUrl)
        if (kycWebUrl && kycWebUrl !== '') {
          this.kycAddress = kycWebUrl + '/?userName=' + this.username +
          '&userId=' + this.userid + '&kycUrl=' + kycUrl + '&lang=' + this.$i18n.locale +
          '&authorid=' + this.authorid + '&theme=' + this.$store.state.configTheme + '&token=' + token
          console.log('kycAddress', this.kycAddress)
          let timeout = () => {
            this.$message({
              message: this.$t('m.httpUtils.warning'),
              type: 'error'
            })
            this.close()
          }
          this.loadTimeout = setTimeout(timeout, axios.defaults.timeout * 2)
          let iframe = this.$refs.iframe
          if (iframe.attachEvent) {
            iframe.attachEvent('onload', function () {
              console.log('iframe onload')
              // clearTimeout(t)
            })
            iframe.attachEvent('onerror', function () {
              console.log('iframe onerror')
              clearTimeout(this.loadTimeout)
              timeout()
            })
          } else {
            iframe.onload = function () {
              console.log('iframe onload')
              // clearTimeout(t)
            }
            iframe.onerror = function () {
              console.log('iframe onerror')
              clearTimeout(this.loadTimeout)
              timeout()
            }
          }
        } else {
          this.$message({
            message: this.$t('m.httpUtils.warning'),
            type: 'error'
          })
          this.close()
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: this.$t('m.httpUtils.warning'),
          type: 'error'
        })
        this.loading = false
        this.close()
      })
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
  .kyc-dialog {
    z-index: 9999;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
  }
</style>

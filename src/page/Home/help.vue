<template>
  <div v-loading="mainloading" :element-loading-text="$t('m.loading')"  style="min-height: 10vw;" class="jyNVPQ">
  <div class="w store-content">
    <div v-html="html"></div>
  </div>
  </div>
</template>
<script>
  import { getHtml } from '/js-api/index'
  export default {
    data () {
      return {
        // 主体加载
        mainloading: true,
        lang: 100000,
        html: ''
      }
    },
    watch: {
      '$i18n.locale': {
        handler: function (val, newVale) {
          this.getHtml(this.$store.state.lang)
        },
        deep: true
      }
    },
    methods: {
      getHtml (langv) {
        this.mainloading = true
        if (this.lang !== langv) {
          this.lang = langv
          var html = langv === '1' ? this.$store.state.logo : this.$store.state.logoen
          getHtml(html).then(res => {
            this.html = res
          })
        }
        this.mainloading = false
        this.dialogVisible = true
      },
      init () {
        this.getHtml(this.$store.state.lang)
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
<style>

</style>

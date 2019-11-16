<template>
    <div v-loading="loading" :element-loading-text="$t('m.loading')" style="min-height: 10vw;">
      <el-tabs v-model="curName" @tab-click="handleClick">
        <!--当前使用节点-->
        <el-tab-pane :label="$t('m.set.currentlyNode')" name="default">
          <div style="min-height: 8vw;">
            <el-row :gutter="20" class="lh">
              <el-col :span="6"><div>{{currentNode.name}}</div></el-col>
              <el-col :span="6"><div>{{currentNode.ping | pingDelay}}({{currentNode.ping}})</div></el-col>
            </el-row>
            <el-row :gutter="20" class="lh">
              <el-col :span="18"><div>{{currentNode.url}}</div></el-col>
            </el-row>
            <div class="line"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--可用节点-->
        <el-tab-pane :label="$t('m.set.availableNode')" name="default">
          <div style="min-height: 8vw;" v-for="(item,index) in defaultNodes" :key="index">
            <el-row :gutter="20" class="lh">
              <el-col :span="6"><div>{{item.name}}</div></el-col>
              <el-col :span="6"><div>{{item.ping | pingDelay}}({{item.ping}})</div></el-col>
            </el-row>
            <el-row :gutter="20" class="lh">
              <el-col :span="18"><div>{{item.url}}</div></el-col>
              <el-col :span="6"><div>
                <el-button :loading="connectLoad === item.url" @click="connectNode(item.url)" type="success" plain>
                  <!--连接-->
                 {{$t('m.set.connection')}}
                </el-button>
                <el-button v-if="!chackInDefault(item.url)" type="danger" plain @click="removeWebsocketNode(index)">
                  <!--删除-->
                  {{$t('m.params.del')}}
                </el-button>
              </div></el-col>
            </el-row>
            <div class="line"></div>
          </div>
          <el-button type="success" @click="addWebsocketNode">
            <!--添加节点-->
            {{$t('m.set.addNode') }}
          </el-button>
        </el-tab-pane>
      </el-tabs>
      <!--添加节点-->
      <el-dialog
      :title="$t('m.set.addNode')"
      :visible.sync="addWebsocketDialogVisible"
      width="30%"
      :before-close="formHandleClose">
        <div v-loading="loading" :element-loading-text="$t('m.applyWaiting')" style="min-height: 10vw">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
            <!--名称-->
            <el-form-item :label="$t('m.set.name')">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <!--地址-->
            <el-form-item :label="$t('m.set.address')" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')">{{$t('m.cancel')}}</el-button>
          <el-button type="primary" @click="onAddSubmit('ruleForm')">{{$t('m.sure')}}</el-button>
        </span>
      </el-dialog>
      <!--删除节点-->
      <el-dialog
      :title="$t('m.set.delNode')"
      :visible.sync="removeWebsocketDialogVisible"
      width="30%"
      :before-close="handleClose">
        <!--确定要删除,节点吗-->
        <span>{{$t('m.set.confirmDel')}}{{removeNodeName}}{{$t('m.set.isNode')}}?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="removeWebsocketDialogVisible=false">{{$t('m.cancel')}}</el-button>
          <el-button type="primary" @click="onRemoveSubmit">{{$t('m.sure')}}</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import {ZOSInstance} from 'zos-wallet-js'

  export default {
    components: {
    },
    data () {
      var nodeAddressVa = (rule, value, callback) => {
        if (value === undefined) {
          // '请输入节点地址'
          callback(new Error(this.$t('m.set.inputNode')))
        } else if (value.indexOf('wss://') !== 0 && value.indexOf('ws://') !== 0) {
          // '节点地址必须以wss://或ws://开头'
          callback(new Error(this.$t('m.set.mustNode')))
        } else {
          let isExist = false
          for (let index = 0; index < this.defaultNodes.length; index++) {
            const element = this.defaultNodes[index]
            if (element.url === value) {
              isExist = true
              break
            }
            let elementPos = element.url.indexOf('s://')
            let elementDomain = element.url.substring(elementPos + 4)
            let valuePos = value.indexOf('s://')
            let valueDomain = value.substring(valuePos + 4)
            if (elementDomain === valueDomain) {
              isExist = true
              break
            }
          }
          if (this.currentNode.url === value) {
            isExist = true
          }
          let elementPos = this.currentNode.url.indexOf('s://')
          let elementDomain = this.currentNode.url.substring(elementPos + 4)
          let valuePos = value.indexOf('s://')
          let valueDomain = value.substring(valuePos + 4)
          if (elementDomain === valueDomain) {
            isExist = true
          }
          if (isExist) {
            // '地址已经存在,请不要重复添加'
            callback(new Error(this.$t('m.set.exsit')))
          } else {
            callback()
          }
        }
      }
      return {
        connectLoad: '',
        loadingDialog: false,
        itemList: '',
        mortgageNum: '',
        emptyListShow: 0,
        removeIndex: -1,
        removeNodeName: '',
        loading: true,

        curName: 'default',
        activeName: 'default',
        currentNode: {},
        defaultNodes: [],
        personalNodes: [],
        addWebsocketDialogVisible: false,
        removeWebsocketDialogVisible: false,
        ruleForm: {
          name: '',
          address: ''
        },
        rules: {
          address: [
            {validator: nodeAddressVa, trigger: 'blur'}
          ]
        }
      }
    },
    filters: {
      pingDelay: ping => {
        if (ping < 400) {
          // '低延迟'
          return window.vm.$t('m.set.lowLatency')
        } else if (ping >= 400 && ping < 800) {
          // '中延迟'
          return window.vm.$t('m.set.delayIn')
        } else {
          // '高延迟'
          return window.vm.$t('m.set.hignDelay')
        }
      }
    },
    computed: {
    },
    methods: {
      formHandleClose (done) {
        this.resetForm('ruleForm')
      },
      resetForm (formName) {
        this.ruleForm.name = ''
        this.$refs[formName].resetFields()
        this.addWebsocketDialogVisible = false
      },
      chackInDefault (url) {
        let apiServer = this.$store.state.settingsAPIs.WS_NODE_LIST
        for (let index = 0; index < apiServer.length; index++) {
          const element = apiServer[index]
          if (element.url === url) {
            return true
          }
        }
        return false
      },
      handleClick (tab, event) {
        console.log(tab, event)
      },
      connectSucess () {
        this.getNodeData()
        this.connectLoad = ''
      },
      connectNode (url) {
        this.connectLoad = url
        ZOSInstance.activateNode(url, this.connectSucess, () => {
        }, () => {
          this.connectFail(url)
        })
      },
      connectFail (url) {
        this.$message({
          type: 'error',
          // '无法连接到 API 节点'
          // 正在尝试使用其他在线节点
          message: this.$t('m.set.unConnect') + url + ', ' + this.$t('m.set.trying')
        })
      },
      addWebsocketNode () {
        this.addWebsocketDialogVisible = true
      },
      removeWebsocketNode (index) {
        this.removeIndex = index
        this.removeNodeName = this.defaultNodes[index].location
        this.removeWebsocketDialogVisible = true
      },
      onAddSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let node = {url: this.ruleForm.address, location: this.ruleForm.name}
            ZOSInstance.addNode(node)
            this.getNodeData()
            this.resetForm('ruleForm')
            this.addWebsocketDialogVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onRemoveSubmit () {
        if (this.removeIndex !== -1) {
          ZOSInstance.deleteNode(this.defaultNodes[this.removeIndex].url)
          this.getNodeData()
        }
        this.removeWebsocketDialogVisible = false
      },
      getNodeData () {
        this.loading = true
        this.defaultNodes = ZOSInstance.getNodelist()
        this.currentNode = ZOSInstance.getActiveNode()
        this.loading = false
      }
    },
    destroyed () {
      this.$root.$off('RpcConnectionStatus')
    },
    mounted () {
      this.getNodeData()
      this.$root.$on('RpcConnectionStatus', (data) => {
        this.connectSucess()
      })
    }
  }
</script>
<style scoped lang="scss">
  .el-tab-pane{
    padding: 10px;
  }
  .basicInfo {
    padding: 5px 0;
    overflow: hidden;
  }
</style>

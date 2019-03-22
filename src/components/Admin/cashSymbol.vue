<template>
  <el-dialog
    :title="$t('m.borrow.note')"
    :visible.sync="visible"
    width="30%"
    v-if="visible"
    :before-close="handleClose">
    <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item
        :label="$t('m.transfer.XZBZ')"
        :rules="[
            { required: true, message: $t('m.transfer.selectCurreny')}
          ]"
        prop="cashSymbol">
        <el-select v-model="ruleForm.cashSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')">
          <el-option
            v-for="item in cList"
            :key="item.id"
            :label="item.symbol"
            :disabled="item.disabled"
            :value="item.symbol">
          </el-option>
        </el-select>
      </el-form-item>
      <p class="text-right margin-t10" style="height: 40px">
        <y-button :text="$t('m.cancel')"
                  @btnClick="handleClose"
        ></y-button>
        <y-button :text="$t('m.sure')"
                  classStyle="main-btn"
                  @btnClick="submitCash('ruleForm')"
        ></y-button>
      </p>

    </el-form>
  </el-dialog>
</template>
<script>
  import YButton from '/path-components/element/YButton'
  export default {
    components: {YButton},
    props: {
      cashData: {
        default: [],
        type: Array
      },
      visible: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {
        ruleForm: {
          cashSymbol: ''
        },
        cList: []
      }
    },
    watch: {
      'visible': {
        handler: function (val, newVal) {
          this.cList = this.cashData.cList
          if (this.visible && this.cashData.cashSymbol) {
            this.setRuleForm()
          }
        },
        deep: true
      }
    },
    computed: {
      isEidt () {
        if (this.cashData.cashSymbol) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      // 编辑时的初始值
      setRuleForm () {
        this.ruleForm.cashSymbol = this.cashData.cashSymbol
      },
      // 重置表单
      resetForm (form) {
        this.$refs[form].resetFields()
      },
      handleClose () {
        this.visible = false
        let param = {
          type: false
        }
        this.resetForm('ruleForm')
        this.$emit('cashEvent', param)
      },
      submitCash (form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.visible = false
            let param = {
              type: true,
              cashSymbol: this.ruleForm.cashSymbol,
              cIndex: this.cashData.cIndex,
              isEdit: this.isEidt
            }
            this.ruleForm = Object.assign(this.ruleForm, this.defaultData)
            this.resetForm('ruleForm')
            this.$emit('cashEvent', param)
          } else {
            return false
          }
        })
      }
    },
    created () {
      this.defaultData = JSON.parse(JSON.stringify(this.ruleForm))
    }
  }
</script>
<style>

</style>

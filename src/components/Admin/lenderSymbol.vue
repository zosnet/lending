<template>
  <el-dialog
    :title="$t('m.borrow.note')"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose">
    <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
      <el-form-item
        :label="$t('m.transfer.XZBZ')"
        prop="lenderSymbol">
        <el-select v-model="ruleForm.lenderSymbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" v-if="lenderData.lList">
          <el-option
            v-for="item in lenderData.lList"
            :key="item.id"
            :label="item.symbol"
            :disabled="item.disabled"
            :value="item.symbol">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('m.borrow.radio')" prop="ratio"
      >
        <el-input v-model.number="ruleForm.ratio" @change="_ratio" type="number" max-length="6">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>

      <p class="text-right margin-t10">
        <y-button :text="$t('m.cancel')"
                  @btnClick="handleClose"
        ></y-button>
        <y-button :text="$t('m.sure')"
                  classStyle="main-btn"
                  @btnClick="submitLender('ruleForm')"
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
      lenderData: {
        default: {},
        type: Object
      },
      visible: {
        default: false,
        type: Boolean
      }
    },
    data () {
      var vallenderSymbol = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('m.transfer.selectCurreny')))
        } else {
          callback()
        }
      }
      var valiRatio = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('m.transfer.selectCurreny')))
        } else {
          if (value < 0 || value > 100) {
            callback(new Error(this.$t('m.params.valiRatio')))
          } else {
            callback()
          }
        }
      }
      return {
        ruleForm: {
          lenderSymbol: '',
          ratio: ''
        },
        rules: {
          lenderSymbol: [
            {
              required: true, message: this.$t('m.transfer.selectCurreny')
            },
            {
              validator: vallenderSymbol, trigger: 'blur'
            }
          ],
          ratio: [
            {required: true, message: this.$t('m.params.ratioNull')},
            {validator: valiRatio, trigger: ['blur', 'change']}
          ]
        }
      }
    },
    methods: {
      _ratio () {
        this.ruleForm.ratio = Number(this.ruleForm.ratio).toFixed(2)
      },
      handleClose () {
        this.visible = false
        let param = {
          type: false
        }
        this.$emit('lenderEvent', param)
        this.resetForm('ruleForm')
      },
      // 重置表单
      resetForm (form) {
        this.$refs[form].resetFields()
      },
      submitLender (form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.visible = false
            let param = {
              type: true,
              lenderSymbol: this.ruleForm.lenderSymbol,
              lenderRatio: this.ruleForm.ratio,
              cIndex: this.lenderData.cIndex
            }
            this.$emit('lenderEvent', param)
            this.ruleForm = Object.assign(this.ruleForm, this.defaultData)
            this.resetForm('ruleForm')
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

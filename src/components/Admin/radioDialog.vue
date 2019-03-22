<template>
  <div v-if="visible">
    <el-dialog
      :title="$t('m.borrow.radio')"
      :visible.sync="visible"
      width="30%"
      :append-to-body="isAppend"
      :before-close="handleClose">
      <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
        <el-form-item :label="$t('m.transfer.XZBZ')" prop="symbol">
          <el-select v-model="ruleForm.symbol" value-key="id" :placeholder="$t('m.transfer.XZBZ')" @change="addRadioInput">
            <el-option
              v-for="item in data"
              :key="item.id"
              :label="item.symbol"
              :value="item.symbol">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('m.borrow.radio')" prop="name"
          :rules="[
            { required: true, message: $t('m.params.ratioNull')},
            { type: 'number', message: $t('m.params.ratioNumber')}
          ]"
        >
          <el-input v-model.number="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="dialog-footer">
                      <el-button @click="resetForm('ruleForm')">{{$t('m.cancel')}}</el-button>
                      <el-button type="primary" @click="submit('ruleForm')">{{$t('m.sure')}}</el-button>
                    </span>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      visible: {
        default: false,
        type: Boolean
      },
      data: {
        default: null,
        type: Array
      },
      isAppend: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {
        radioData: [],
        lenderList: [],
        ruleForm: {
          symbol: '',
          name: ''
        }
      }
    },
    methods: {
      handleClose () {
        this.$emit('radioEvent', {type: false})
      },
      // 重置表单
      resetForm (form) {
        this.$refs[form].resetFields()
      },
      addRadioSelect () {
        if (this.lenderList.length > 0) {
          this.radioSelect = true
        }
      },
      addRadioInput () {
        this.ruleForm.name = ''
      },
      submit (form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            let params = {
              radio: {
                symbol: this.ruleForm.symbol,
                name: this.ruleForm.name
              },
              type: true
            }
            this.$emit('radioEvent', params)
            this.resetForm('ruleForm')
            this.visible = false
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style>

</style>

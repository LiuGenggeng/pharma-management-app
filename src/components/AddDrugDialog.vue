<template>
  <el-dialog
      v-model="dialogVisible"
      title="Add Drug"
      width="600px"
      @close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="150px"
        label-position="right"
    >
      <el-form-item label="Drug Name" prop="name">
        <el-input v-model="formData.name" placeholder="place input" />
      </el-form-item>

      <el-form-item label="Limit" prop="limit">
        <el-input-number
            v-model="formData.limit"
            :min="1"
            placeholder="place input"
        />
      </el-form-item>

      <el-form-item label="Manufacturer" prop="manufacturer">
        <el-input v-model="formData.manufacturer" placeholder="place input" />
      </el-form-item>

      <el-form-item label="Batch" prop="batch">
        <el-input v-model="formData.batch" placeholder="place input" />
      </el-form-item>

      <el-form-item label="Expiry" prop="expiry">
        <el-date-picker
            v-model="formData.expiry"
            type="date"
            placeholder=""
            value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="Stock" prop="stock">
        <el-input-number
            v-model="formData.stock"
            :min="0"
            placeholder="place input"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">cancel</el-button>
        <el-button type="primary" @click="handleConfirm">confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const formRef = ref()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value)
  }
})
const formData = reactive({
  name: '',
  limit: null,
  manufacturer: '',
  batch: '',
  expiry: '',
  stock: null
})

const formRules = {
  name: [{ required: true, message: 'required', trigger: 'blur' }],
  limit: [{ required: true, message: 'required', trigger: 'blur' }],
  manufacturer: [{ required: true, message: 'required', trigger: 'blur' }],
  batch: [{ required: true, message: 'required', trigger: 'blur' }],
  expiry: [{ required: true, message: 'required', trigger: 'change' }],
  stock: [{ required: true, message: 'required', trigger: 'blur' }]
}

const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('confirm', { ...formData })
    resetForm()
    dialogVisible.value = false
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>
<style scoped>

</style>
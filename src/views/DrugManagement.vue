<template>
  <div class="drug-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>药品管理</span>
          <el-button type="primary" @click="showAddForm = true">
            <el-icon><Plus /></el-icon>
            添加药品
          </el-button>
        </div>
      </template>

      <!-- 药品列表表格 -->
      <el-table
          :data="drugStore.drugs"
          v-loading="drugStore.loading"
          style="width: 100%"
      >
        <el-table-column prop="id" label="药品ID" width="100" />
        <el-table-column prop="name" label="药品名称" width="150" />
        <el-table-column prop="manufacturer" label="制造商" width="150" />
        <el-table-column prop="batch" label="批次" width="120" />
        <el-table-column label="过期日期" width="120">
          <template #default="{ row }">
            <el-tag
                :type="drugStore.isDrugExpired(row.expiry) ? 'danger' : 'success'"
            >
              {{ row.expiry }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="limit" label="限额" width="80" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag v-if="drugStore.isDrugExpired(row.expiry)" type="danger">
              已过期
            </el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加药品对话框 -->
    <el-dialog
        v-model="showAddForm"
        title="添加新药品"
        width="500px"
        @close="resetForm"
    >
      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="100px"
      >
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入药品名称" />
        </el-form-item>

        <el-form-item label="制造商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入制造商" />
        </el-form-item>

        <el-form-item label="批次" prop="batch">
          <el-input v-model="form.batch" placeholder="请输入批次号" />
        </el-form-item>

        <el-form-item label="过期日期" prop="expiry">
          <el-date-picker
              v-model="form.expiry"
              type="date"
              placeholder="选择过期日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="库存数量" prop="stock">
          <el-input-number
              v-model="form.stock"
              :min="0"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="限额" prop="limit">
          <el-input-number
              v-model="form.limit"
              :min="0"
              style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddForm = false">取消</el-button>
        <el-button
            type="primary"
            @click="submitForm"
            :loading="drugStore.loading"
        >
          确认添加
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useDrugStore } from '@/stores/drug'
import dayjs from 'dayjs'

const drugStore = useDrugStore()
const showAddForm = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  name: '',
  manufacturer: '',
  batch: '',
  expiry: '',
  stock: 0,
  limit: 0
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入药品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  manufacturer: [
    { required: true, message: '请输入制造商', trigger: 'blur' }
  ],
  batch: [
    { required: true, message: '请输入批次号', trigger: 'blur' }
  ],
  expiry: [
    { required: true, message: '请选择过期日期', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (dayjs(value).isBefore(dayjs())) {
          callback(new Error('过期日期不能早于今天'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量不能小于0', trigger: 'blur' }
  ],
  limit: [
    { required: true, message: '请输入限额', trigger: 'blur' },
    { type: 'number', min: 0, message: '限额不能小于0', trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      const result = await drugStore.addDrug(form)
      if (result.success) {
        ElMessage.success('药品添加成功！')
        showAddForm.value = false
        resetForm()
      } else {
        ElMessage.error('添加失败，请重试')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    name: '',
    manufacturer: '',
    batch: '',
    expiry: '',
    stock: 0,
    limit: 0
  })
}

// 页面加载时获取数据
onMounted(() => {
  drugStore.fetchDrugs()
})
</script>

<style scoped>
.drug-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
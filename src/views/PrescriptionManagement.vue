<template>
  <div class="prescription-management">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card>
          <el-statistic
              title="待处理处方"
              :value="prescriptionStore.pendingCount"
              class="statistic-card"
          >
            <template #suffix>
              <el-icon color="#E6A23C"><Clock /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic
              title="已履行处方"
              :value="prescriptionStore.fulfilledCount"
              class="statistic-card"
          >
            <template #suffix>
              <el-icon color="#67C23A"><Check /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic
              title="履行失败"
              :value="prescriptionStore.failedCount"
              class="statistic-card"
          >
            <template #suffix>
              <el-icon color="#F56C6C"><Close /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主内容卡片 -->
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span>处方管理</span>
          <div class="filter-controls">
            <el-select v-model="statusFilter" placeholder="按状态筛选" style="width: 150px">
              <el-option label="全部" value="ALL" />
              <el-option label="待处理" value="PENDING" />
              <el-option label="已履行" value="FULFILLED" />
              <el-option label="履行失败" value="FAILED" />
            </el-select>
          </div>
        </div>
      </template>

      <!-- 处方列表 -->
      <el-table
          :data="filteredPrescriptions"
          v-loading="prescriptionStore.loading"
          style="width: 100%"
          @row-click="handleRowClick"
          row-style="cursor: pointer"
      >
        <el-table-column prop="id" label="处方ID" width="100" />
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="pharmacyName" label="药房" width="150" />
        <el-table-column label="药品数量" width="100">
          <template #default="{ row }">
            {{ row.drugs.length }} 种
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click.stop="viewPrescriptionDetail(row.id)"
            >
              查看详情
            </el-button>
            <el-button
                v-if="row.status === 'PENDING'"
                type="success"
                size="small"
                @click.stop="handleFulfill(row)"
                :loading="prescriptionStore.loading"
            >
              履行
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 处方详情对话框 -->
    <el-dialog
        v-model="showDetailDialog"
        :title="`处方详情 - ${prescriptionStore.currentPrescription?.id || ''}`"
        width="900px"
        @close="handleDialogClose"
    >
      <div v-if="prescriptionStore.currentPrescription" class="prescription-detail">
        <!-- 基本信息 -->
        <el-descriptions title="处方信息" :column="3" border>
          <el-descriptions-item label="处方ID">
            {{ prescriptionStore.currentPrescription.id }}
          </el-descriptions-item>
          <el-descriptions-item label="患者姓名">
            {{ prescriptionStore.currentPrescription.patientName }}
          </el-descriptions-item>
          <el-descriptions-item label="药房">
            {{ prescriptionStore.currentPrescription.pharmacyName }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(prescriptionStore.currentPrescription.status)">
              {{ getStatusText(prescriptionStore.currentPrescription.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(prescriptionStore.currentPrescription.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间" v-if="prescriptionStore.currentPrescription.updatedAt">
            {{ formatDateTime(prescriptionStore.currentPrescription.updatedAt) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 处方药品详情 -->
        <div class="drugs-section">
          <h3>处方药品详情</h3>
          <el-table :data="currentDrugDetails" style="width: 100%">
            <el-table-column prop="drugId" label="药品ID" width="100" />
            <el-table-column prop="drugName" label="药品名称" width="150" />
            <el-table-column prop="dosage" label="需求数量" width="100">
              <template #default="{ row }">
                {{ row.dosage }} 单位
              </template>
            </el-table-column>
            <el-table-column label="可用性" width="120">
              <template #default="{ row }">
                <el-tag :type="row.available ? 'success' : 'danger'">
                  {{ row.available ? '可用' : '不可用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="300">
              <template #default="{ row }">
                <span v-if="!row.available" class="error-reason">
                  {{ row.reason }}
                </span>
                <span v-else class="success-text">状态正常</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 履行按钮 -->
        <div class="action-section" v-if="prescriptionStore.currentPrescription.status === 'PENDING'">
          <el-button
              type="success"
              size="large"
              @click="handleFulfill(prescriptionStore.currentPrescription)"
              :loading="prescriptionStore.loading"
              :disabled="!canFulfill"
          >
            <el-icon><Check /></el-icon>
            履行处方
          </el-button>
          <span v-if="!canFulfill" class="fulfill-disabled-hint">
            * 存在不可用药品，无法履行
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, Check, Close, Document } from '@element-plus/icons-vue'
import { usePrescriptionStore } from '@/stores/prescription'
import { useDrugStore } from '@/stores/drug'
import { usePharmacyStore } from '@/stores/pharmacy'
import type { PrescriptionDetail } from '@/types'
import dayjs from 'dayjs'

const prescriptionStore = usePrescriptionStore()
const drugStore = useDrugStore()
const pharmacyStore = usePharmacyStore()

const statusFilter = ref('ALL')
const showDetailDialog = ref(false)

// 过滤后的处方列表
const filteredPrescriptions = computed(() => {
  return prescriptionStore.filterByStatus(statusFilter.value)
})

// 当前处方的药品详情
const currentDrugDetails = computed(() => {
  if (!prescriptionStore.currentPrescription) return []
  return prescriptionStore.getPrescriptionDrugDetails(prescriptionStore.currentPrescription)
})

// 是否可以履行（所有药品都可用）
const canFulfill = computed(() => {
  return currentDrugDetails.value.every(drug => drug.available)
})

// 状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'FULFILLED': return 'success'
    case 'FAILED': return 'danger'
    default: return 'info'
  }
}

// 状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING': return '待处理'
    case 'FULFILLED': return '已履行'
    case 'FAILED': return '履行失败'
    default: return '未知'
  }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

// 行点击处理
const handleRowClick = (row: PrescriptionDetail) => {
  viewPrescriptionDetail(row.id)
}

// 查看处方详情
const viewPrescriptionDetail = async (prescriptionId: string) => {
  const result = await prescriptionStore.fetchPrescriptionById(prescriptionId)
  if (result) {
    showDetailDialog.value = true
  } else {
    ElMessage.error('获取处方详情失败')
  }
}

// 对话框关闭处理
const handleDialogClose = () => {
  prescriptionStore.currentPrescription = null
}

// 处理履行处方
const handleFulfill = async (prescription: PrescriptionDetail) => {
  try {
    await ElMessageBox.confirm(
        `确定要履行处方 ${prescription.id} 吗？`,
        '确认履行',
        {
          confirmButtonText: '确定履行',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )

    const result = await prescriptionStore.fulfillPrescription(prescription.id)

    if (result.success) {
      ElMessage.success('处方履行成功！')
      showDetailDialog.value = false
    } else {
      ElMessage.error('处方履行失败：' + (result.errors?.join(', ') || '未知错误'))
    }
  } catch {
    // 用户取消操作
  }
}

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([
    prescriptionStore.fetchPrescriptions(),
    drugStore.fetchDrugs(),
    pharmacyStore.fetchPharmacies()
  ])
})
</script>

<style scoped>
.prescription-management {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.statistic-card {
  text-align: center;
}

.main-card {
  margin-top: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.prescription-detail {
  padding: 20px 0;
}

.drugs-section {
  margin-top: 30px;
}

.drugs-section h3 {
  margin-bottom: 15px;
  color: #409eff;
  font-size: 16px;
}

.action-section {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.fulfill-disabled-hint {
  margin-left: 10px;
  color: #F56C6C;
  font-size: 12px;
}

.error-reason {
  color: #F56C6C;
  font-weight: 500;
}

.success-text {
  color: #67C23A;
}

.el-table .el-table__row {
  transition: background-color 0.3s;
}

.el-table .el-table__row:hover {
  background-color: #f5f7fa;
}
</style>
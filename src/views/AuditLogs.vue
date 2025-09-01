
<template>
  <div class="audit-logs">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card>
          <el-statistic
              title="总审计记录"
              :value="auditStore.totalLogs"
              class="statistic-card"
          >
            <template #suffix>
              <el-icon color="#409EFF"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic
              title="成功记录"
              :value="auditStore.successLogs"
              class="statistic-card"
          >
            <template #suffix>
              <el-icon color="#67C23A"><CircleCheck /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic
              title="失败记录"
              :value="auditStore.failedLogs"
              class="statistic-card"
          >
            <template #suffix>
              <el-icon color="#F56C6C"><CircleClose /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主内容卡片 -->
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span>审计日志</span>
        </div>
      </template>

      <!-- 筛选器 -->
      <CommonFilter
          v-model="filters"
          :filters="filterConfig"
          :show-reset-button="true"
          reset-button-text="重置筛选"
          @change="handleFiltersChange"
          @reset="handleFiltersReset"
      />
      <!-- 审计日志表格 -->
      <el-table
          :data="filteredLogs"
          v-loading="auditStore.loading"
          style="width: 100%"
          @row-click="handleRowClick"
          :row-style="{cursor: 'pointer'}"
      >
        <el-table-column prop="prescriptionId" label="处方ID" width="120" />
        <el-table-column prop="patientName" label="患者" width="120" />
        <el-table-column prop="pharmacyName" label="药房" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ row.status === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求药品" width="200">
          <template #default="{ row }">
            <div class="drug-tags">
              <el-tag
                  v-for="drug in row.drugsRequested"
                  :key="drug.drugId"
                  size="small"
                  class="drug-tag"
              >
                {{ auditStore.getDrugName(drug.drugId) }} ({{ drug.dosage }})
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click.stop="viewLogDetail(row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 审计日志详情对话框 -->
    <el-dialog
        v-model="showDetailDialog"
        :title="`审计日志详情 - ${auditStore.currentAuditLog?.prescriptionId || ''}`"
        width="900px"
        @close="handleDialogClose"
    >
      <div v-if="auditStore.currentAuditLog" class="audit-detail">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="3" border>
          <el-descriptions-item label="处方ID">
            {{ auditStore.currentAuditLog.prescriptionId }}
          </el-descriptions-item>
          <el-descriptions-item label="患者">
            {{ auditStore.currentAuditLog.patientName }}
          </el-descriptions-item>
          <el-descriptions-item label="药房">
            {{ auditStore.currentAuditLog.pharmacyName }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="auditStore.currentAuditLog.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ auditStore.currentAuditLog.status === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="时间">
            {{ formatDateTime(auditStore.currentAuditLog.timestamp) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 请求的药品 -->
        <div class="drugs-section">
          <h3>请求的药品</h3>
          <el-table :data="auditStore.currentAuditLog.drugsRequested" style="width: 100%">
            <el-table-column prop="drugId" label="药品ID" width="100" />
            <el-table-column label="药品名称" width="150">
              <template #default="{ row }">
                {{ auditStore.getDrugName(row.drugId) }}
              </template>
            </el-table-column>
            <el-table-column prop="dosage" label="请求数量" width="120">
              <template #default="{ row }">
                {{ row.dosage }} 单位
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分发的药品 -->
        <div class="drugs-section" v-if="auditStore.currentAuditLog.drugsDispensed.length > 0">
          <h3>实际分发的药品</h3>
          <el-table :data="auditStore.currentAuditLog.drugsDispensed" style="width: 100%">
            <el-table-column prop="drugId" label="药品ID" width="100" />
            <el-table-column label="药品名称" width="150">
              <template #default="{ row }">
                {{ auditStore.getDrugName(row.drugId) }}
              </template>
            </el-table-column>
            <el-table-column prop="dosage" label="分发数量" width="120">
              <template #default="{ row }">
                {{ row.dosage }} 单位
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 失败原因 -->
        <div class="failure-section" v-if="auditStore.currentAuditLog.failureReasons.length > 0">
          <h3>失败原因</h3>
          <el-alert
              v-for="(reason, index) in auditStore.currentAuditLog.failureReasons"
              :key="index"
              :title="reason"
              type="error"
              :closable="false"
              class="failure-alert"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, CircleCheck, CircleClose, Refresh } from '@element-plus/icons-vue'
import CommonFilter from '@/components/Filter.vue'
import { useAuditStore } from '@/stores/audit'
import { useDrugStore } from '@/stores/drug'
import type { AuditLogDetail, AuditLogFilters } from '@/types'
import dayjs from 'dayjs'

const auditStore = useAuditStore()
const drugStore = useDrugStore()

const showDetailDialog = ref(false)

// 筛选条件
const filters = reactive<AuditLogFilters>({
  patientId: 'ALL',
  pharmacyId: 'ALL',
  status: 'ALL',
  startDate: '',
  endDate: ''
})

// 过滤后的日志
const filteredLogs = ref<AuditLogDetail[]>([])

// 应用筛选
const applyFilters = (filterValues = filters) => {
  filteredLogs.value = auditStore.filterAuditLogs(filterValues)
  console.log(filteredLogs.value);
}

// 重置筛选
const resetFilters = () => {
  filters.patientId = 'ALL'
  filters.pharmacyId = 'ALL'
  filters.status = 'ALL'
  filters.startDate = ''
  filters.endDate = ''
  applyFilters()
}
// 筛选条件
const filterConfig = computed(() => [
  {
    key: 'patientId',
    type: 'select',
    placeholder: '选择患者',
    clearable: true,
    options: [
      { label: '全部患者', value: 'ALL' },
      ...auditStore.patients.map(patient => ({
        label: patient.name,
        value: patient.id
      }))
    ],
    defaultValue: ''
  },
  {
    key: 'pharmacyId',
    type: 'select',
    placeholder: '选择药房',
    clearable: true,
    options: [
      { label: '全部药房', value: 'ALL' },
      ...auditStore.pharmaciesForFilter.map(pharmacy => ({
        label: pharmacy.name,
        value: pharmacy.id
      }))
    ],
    defaultValue: ''
  },
  {
    key: 'status',
    type: 'select',
    placeholder: '选择状态',
    clearable: true,
    options: [
      { label: '全部状态', value: 'ALL' },
      { label: '成功', value: 'SUCCESS' },
      { label: '失败', value: 'FAILED' }
    ],
    defaultValue: ''
  }
])
// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

// 行点击处理
const handleRowClick = (row: AuditLogDetail) => {
  viewLogDetail(row.id)
}

// 查看日志详情
const viewLogDetail = async (logId: string) => {
  const result = await auditStore.fetchAuditLogById(logId)
  if (result) {
    showDetailDialog.value = true
  } else {
    ElMessage.error('获取审计日志详情失败')
  }
}

// 对话框关闭处理
const handleDialogClose = () => {
  auditStore.currentAuditLog = null
}

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([
    auditStore.fetchAuditLogs(),
    drugStore.fetchDrugs()
  ])
  applyFilters() // 初始化显示所有数据
})

// 处理筛选条件变化
const handleFiltersChange = (newFilters) => {
  // 这里执行你的筛选逻辑
  applyFilters(newFilters)
}

// 处理重置筛选
const handleFiltersReset = (resetFilters) => {
  // 这里执行重置后的逻辑
  applyFilters(resetFilters)
}
</script>

<style scoped>
.audit-logs {
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

.filters-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.audit-detail {
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

.failure-section {
  margin-top: 30px;
}

.failure-section h3 {
  margin-bottom: 15px;
  color: #F56C6C;
  font-size: 16px;
}

.failure-alert {
  margin-bottom: 10px;
}

.drug-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.drug-tag {
  margin: 0;
}

.el-table .el-table__row {
  transition: background-color 0.3s;
}

.el-table .el-table__row:hover {
  background-color: #f5f7fa;
}
</style>
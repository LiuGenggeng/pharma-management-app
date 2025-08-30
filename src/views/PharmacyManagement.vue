<template>
  <div class="pharmacy-management">
    <!-- 头部信息卡片 -->
    <el-row :gutter="20" class="header-stats">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总药房数量" :value="pharmacyStore.totalPharmacies">
            <template #suffix>
              <el-icon><OfficeBuilding /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主内容卡片 -->
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span>药房管理</span>
          <div class="header-actions">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索药房名称或ID"
                style="width: 300px; margin-right: 10px"
                clearable
                @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <!-- 药房列表 -->
      <el-table
          :data="filteredPharmacies"
          v-loading="pharmacyStore.loading"
          style="width: 100%"
          @row-click="handleRowClick"
          row-style="cursor: pointer"
      >
        <el-table-column prop="id" label="药房ID" width="120" />
        <el-table-column prop="name" label="药房名称" width="200" />
        <el-table-column label="分配药品数量" width="150">
          <template #default="{ row }">
            <el-tag type="info">{{ row.allocatedDrugs.length }} 种</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分配药品" min-width="300">
          <template #default="{ row }">
            <el-tag
                v-for="drug in row.allocatedDrugs"
                :key="drug.drugId"
                size="small"
                style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ drug.drugName }} (限{{ drug.limit }})
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click.stop="viewPharmacyDetail(row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 药房详情对话框 -->
    <el-dialog
        v-model="showDetailDialog"
        :title="`药房详情 - ${pharmacyStore.currentPharmacy?.name || ''}`"
        width="800px"
        @close="handleDialogClose"
    >
      <div v-if="pharmacyStore.currentPharmacy" class="pharmacy-detail">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="药房ID">
            {{ pharmacyStore.currentPharmacy.id }}
          </el-descriptions-item>
          <el-descriptions-item label="药房名称">
            {{ pharmacyStore.currentPharmacy.name }}
          </el-descriptions-item>
          <el-descriptions-item label="分配药品总数">
            {{ pharmacyStore.currentPharmacy.allocatedDrugs.length }} 种
          </el-descriptions-item>
        </el-descriptions>

        <!-- 分配药品详情表格 -->
        <div class="allocated-drugs-section">
          <h3>分配药品详情</h3>
          <el-table
              :data="pharmacyStore.currentPharmacy.allocatedDrugs"
              style="width: 100%"
          >
            <el-table-column prop="drugId" label="药品ID" width="100" />
            <el-table-column prop="drugName" label="药品名称" width="150" />
            <el-table-column prop="limit" label="分配限额" width="120">
              <template #default="{ row }">
                <el-tag type="warning">{{ row.limit }} 单位</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="库存状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStockStatusType(row.drugId)">
                  {{ getStockStatusText(row.drugId) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="200">
              <template #default="{ row }">
                {{ getDrugRemark(row.drugId, row.limit) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-loading="pharmacyStore.loading" v-if="pharmacyStore.loading">
        加载中...
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, Search } from '@element-plus/icons-vue'
import { usePharmacyStore } from '@/stores/pharmacy'
import { useDrugStore } from '@/stores/drug'
import type { Pharmacy } from '@/types'

const pharmacyStore = usePharmacyStore()
const drugStore = useDrugStore()

const searchKeyword = ref('')
const showDetailDialog = ref(false)

// 过滤后的药房列表
const filteredPharmacies = computed(() => {
  if (!searchKeyword.value.trim()) {
    return pharmacyStore.pharmacies
  }
  return pharmacyStore.searchPharmacies(searchKeyword.value)
})

// 搜索处理
const handleSearch = (keyword: string) => {
  // 实时搜索，这里可以添加防抖逻辑
}

// 行点击处理
const handleRowClick = (row: Pharmacy) => {
  viewPharmacyDetail(row.id)
}

// 查看药房详情
const viewPharmacyDetail = async (pharmacyId: string) => {
  const result = await pharmacyStore.fetchPharmacyById(pharmacyId)
  if (result) {
    showDetailDialog.value = true
  } else {
    ElMessage.error('获取药房详情失败')
  }
}

// 对话框关闭处理
const handleDialogClose = () => {
  pharmacyStore.currentPharmacy = null
}

// 获取库存状态类型（用于标签颜色）
const getStockStatusType = (drugId: string) => {
  const drug = drugStore.drugs.find(d => d.id === drugId)
  if (!drug) return 'info'

  if (drugStore.isDrugExpired(drug.expiry)) return 'danger'
  if (drug.stock < drug.limit * 0.2) return 'warning'
  return 'success'
}

// 获取库存状态文本
const getStockStatusText = (drugId: string) => {
  const drug = drugStore.drugs.find(d => d.id === drugId)
  if (!drug) return '未知'

  if (drugStore.isDrugExpired(drug.expiry)) return '已过期'
  if (drug.stock < drug.limit * 0.2) return '库存不足'
  return '库存充足'
}

// 获取药品备注信息
const getDrugRemark = (drugId: string, allocatedLimit: number) => {
  const drug = drugStore.drugs.find(d => d.id === drugId)
  if (!drug) return '药品信息未找到'

  const remarks = []

  if (drugStore.isDrugExpired(drug.expiry)) {
    remarks.push(`已过期 (${drug.expiry})`)
  }

  if (drug.stock < allocatedLimit) {
    remarks.push(`库存不足 (仅剩${drug.stock}，需要${allocatedLimit})`)
  }

  if (drug.stock > drug.limit) {
    remarks.push('库存过剩')
  }

  return remarks.length > 0 ? remarks.join(', ') : '状态正常'
}

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([
    pharmacyStore.fetchPharmacies(),
    drugStore.fetchDrugs()
  ])
})
</script>

<style scoped>
.pharmacy-management {
  padding: 20px;
}

.header-stats {
  margin-bottom: 20px;
}

.main-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.pharmacy-detail {
  padding: 20px 0;
}

.allocated-drugs-section {
  margin-top: 30px;
}

.allocated-drugs-section h3 {
  margin-bottom: 15px;
  color: #409eff;
  font-size: 16px;
}

.el-table .el-table__row {
  transition: background-color 0.3s;
}

.el-table .el-table__row:hover {
  background-color: #f5f7fa;
}
</style>
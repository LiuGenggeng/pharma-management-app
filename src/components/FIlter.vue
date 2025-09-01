<template>
  <div class="common-filter">
    <el-row :gutter="20">
      <!-- 渲染筛选条件（最多5个） -->
      <el-col
          v-for="(item, index) in displayFilters"
          :key="item.key"
          :span="getColSpan()"
      >
        <!-- Select 类型筛选器 -->
        <el-select
            v-if="item.type === 'select'"
            v-model="filterValues[item.key]"
            :placeholder="item.placeholder"
            :clearable="item.clearable !== false"
            @change="handleChange"
        >
          <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />
        </el-select>

        <!-- Input 类型筛选器 -->
        <el-input
            v-else-if="item.type === 'input'"
            v-model="filterValues[item.key]"
            :placeholder="item.placeholder"
            :clearable="item.clearable !== false"
            @input="handleChange"
        />
      </el-col>

      <!-- 重置按钮 -->
      <el-col
          v-if="showResetButton"
          :span="getColSpan()"
      >
        <el-button type="primary" @click="handleReset">
          <el-icon><Refresh /></el-icon>
          {{ resetButtonText }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 筛选器配置
  filters: {
    type: Array,
    required: true,
    default: () => []
  },
  // 是否显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true
  },
  // 重置按钮文字
  resetButtonText: {
    type: String,
    default: '重置筛选'
  },
  // 初始值
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'change', 'reset'])

// 响应式数据
const filterValues = ref({ ...props.modelValue })

// 计算属性：显示的筛选器（最多5个）
const displayFilters = computed(() => {
  return props.filters.slice(0, 5)
})

// 计算栅格列宽
const getColSpan = () => {
  const filterCount = displayFilters.value.length
  const totalCols = props.showResetButton ? filterCount + 1 : filterCount
  return Math.floor(24 / totalCols)
}

// 处理筛选变化
const handleChange = () => {
  emit('update:modelValue', { ...filterValues.value })
  emit('change', { ...filterValues.value })
}

// 处理重置
const handleReset = () => {
  // 重置所有筛选值
  const resetValues = {}
  props.filters.forEach(filter => {
    resetValues[filter.key] = filter.defaultValue || ''
  })

  filterValues.value = resetValues
  emit('update:modelValue', { ...resetValues })
  emit('reset', { ...resetValues })
}

// 监听外部传入的值变化
watch(() => props.modelValue, (newVal) => {
  filterValues.value = { ...newVal }
}, { deep: true })
</script>

<style scoped>
.common-filter {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.el-select,
.el-input {
  width: 100%;
}
</style>
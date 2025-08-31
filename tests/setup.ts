import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 完全Mock Element Plus，避免复杂的组件导入
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn().mockResolvedValue(true)
  },
  ElNotification: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn((date?: string) => ({
    format: vi.fn((fmt: string) => {
      if (fmt === 'YYYY-MM-DD HH:mm:ss') return '2024-11-15 10:30:00'
      return '2024-11-15'
    }),
    isBefore: vi.fn((other: any) => {
      if (date && date.includes('2023')) return true
      return false
    }),
    isAfter: vi.fn(() => true)
  }))
  return { default: mockDayjs }
})

// 全局配置
config.global.stubs = {
  // Element Plus 组件全部stub
  'el-card': true,
  'el-button': true,
  'el-table': true,
  'el-table-column': true,
  'el-dialog': true,
  'el-form': true,
  'el-form-item': true,
  'el-input': true,
  'el-input-number': true,
  'el-date-picker': true,
  'el-select': true,
  'el-option': true,
  'el-tag': true,
  'el-icon': true,
  'el-statistic': true,
  'el-descriptions': true,
  'el-descriptions-item': true,
  'el-alert': true,
  'el-row': true,
  'el-col': true
}
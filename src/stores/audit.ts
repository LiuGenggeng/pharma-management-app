import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuditLogDetail, AuditLogFilters } from '@/types'
import { mockAuditLogs } from '@/services/mockData'
import { useDrugStore } from './drug'

export const useAuditStore = defineStore('audit', () => {
  const auditLogs = ref<AuditLogDetail[]>([...mockAuditLogs])
  const currentAuditLog = ref<AuditLogDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const drugStore = useDrugStore()
  
  // 计算统计信息
  const totalLogs = computed(() => auditLogs.value.length)
  const successLogs = computed(() =>
    auditLogs.value.filter(log => log.status === 'SUCCESS').length
  )
  const failedLogs = computed(() =>
    auditLogs.value.filter(log => log.status === 'FAILED').length
  )
  
  // 获取所有患者列表（用于筛选）
  const patients = computed(() => {
    const patientMap = new Map()
    auditLogs.value.forEach(log => {
      if (!patientMap.has(log.patientId)) {
        patientMap.set(log.patientId, {
          id: log.patientId,
          name: log.patientName || log.patientId
        })
      }
    })
    return Array.from(patientMap.values())
  })
  
  // 获取所有药房列表（用于筛选）
  const pharmaciesForFilter = computed(() => {
    const pharmacyMap = new Map()
    auditLogs.value.forEach(log => {
      if (!pharmacyMap.has(log.pharmacyId)) {
        pharmacyMap.set(log.pharmacyId, {
          id: log.pharmacyId,
          name: log.pharmacyName || log.pharmacyId
        })
      }
    })
    return Array.from(pharmacyMap.values())
  })
  
  // 获取审计日志列表
  const fetchAuditLogs = async () => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      // auditLogs.value 已经有数据
    } catch (err) {
      error.value = '获取审计日志失败'
    } finally {
      loading.value = false
    }
  }
  
  // 根据ID获取审计日志详情
  const fetchAuditLogById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const auditLog = auditLogs.value.find(log => log.id === id)
      if (auditLog) {
        currentAuditLog.value = auditLog
        return auditLog
      } else {
        throw new Error('审计日志不存在')
      }
    } catch (err) {
      error.value = '获取审计日志详情失败'
      currentAuditLog.value = null
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 过滤审计日志
  const filterAuditLogs = (filters: AuditLogFilters) => {
    let filtered = [...auditLogs.value]
    
    if (filters.patientId && filters.patientId !== 'ALL') {
      filtered = filtered.filter(log => log.patientId === filters.patientId)
    }
    
    if (filters.pharmacyId && filters.pharmacyId !== 'ALL') {
      filtered = filtered.filter(log => log.pharmacyId === filters.pharmacyId)
    }
    
    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(log => log.status === filters.status)
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filters.startDate!)
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filters.endDate!)
    }
    
    return filtered.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }
  
  // 创建审计日志（处方履行时调用）
  const createAuditLog = async (
    prescriptionId: string,
    patientId: string,
    patientName: string,
    pharmacyId: string,
    pharmacyName: string,
    drugsRequested: any[],
    success: boolean,
    drugsDispensed: any[] = [],
    failureReasons: string[] = []
  ) => {
    try {
      const newAuditLog: AuditLogDetail = {
        id: `AL${(auditLogs.value.length + 1).toString().padStart(3, '0')}`,
        prescriptionId,
        patientId,
        patientName,
        pharmacyId,
        pharmacyName,
        status: success ? 'SUCCESS' : 'FAILED',
        drugsRequested,
        drugsDispensed: success ? drugsRequested : drugsDispensed,
        failureReasons,
        timestamp: new Date().toISOString()
      }
      
      auditLogs.value.unshift(newAuditLog) // 添加到开头
      return newAuditLog
    } catch (err) {
      console.error('创建审计日志失败:', err)
      return null
    }
  }
  
  // 根据处方ID查找审计日志
  const getLogsByPrescriptionId = (prescriptionId: string) => {
    return auditLogs.value.filter(log => log.prescriptionId === prescriptionId)
  }
  
  // 获取药品名称（用于显示）
  const getDrugName = (drugId: string) => {
    const drug = drugStore.drugs.find(d => d.id === drugId)
    return drug?.name || drugId
  }
  
  return {
    auditLogs,
    currentAuditLog,
    loading,
    error,
    totalLogs,
    successLogs,
    failedLogs,
    patients,
    pharmaciesForFilter,
    fetchAuditLogs,
    fetchAuditLogById,
    filterAuditLogs,
    createAuditLog,
    getLogsByPrescriptionId,
    getDrugName
  }
})
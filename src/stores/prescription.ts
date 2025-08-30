import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PrescriptionDetail, PrescriptionDrugDetail, ValidationError, FulfillmentResponse } from '@/types'
import { mockPrescriptions } from '@/services/mockData'
import { useDrugStore } from './drug'
import { usePharmacyStore } from './pharmacy'
import { useAuditStore } from './audit'

export const usePrescriptionStore = defineStore('prescription', () => {
  const prescriptions = ref<PrescriptionDetail[]>([...mockPrescriptions])
  const currentPrescription = ref<PrescriptionDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const drugStore = useDrugStore()
  const pharmacyStore = usePharmacyStore()
  
  // 计算统计信息
  const pendingCount = computed(() =>
    prescriptions.value.filter(p => p.status === 'PENDING').length
  )
  
  const fulfilledCount = computed(() =>
    prescriptions.value.filter(p => p.status === 'FULFILLED').length
  )
  
  const failedCount = computed(() =>
    prescriptions.value.filter(p => p.status === 'FAILED').length
  )
  
  // 获取处方列表
  const fetchPrescriptions = async () => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // prescriptions.value 已经有数据
    } catch (err) {
      error.value = '获取处方列表失败'
    } finally {
      loading.value = false
    }
  }
  
  // 根据ID获取处方详情
  const fetchPrescriptionById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const prescription = prescriptions.value.find(p => p.id === id)
      if (prescription) {
        currentPrescription.value = prescription
        return prescription
      } else {
        throw new Error('处方不存在')
      }
    } catch (err) {
      error.value = '获取处方详情失败'
      currentPrescription.value = null
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 验证处方 - 核心业务逻辑
  const validatePrescription = (prescription: PrescriptionDetail): ValidationError[] => {
    const errors: ValidationError[] = []
    
    prescription.drugs.forEach(prescDrug => {
      const drug = drugStore.drugs.find(d => d.id === prescDrug.drugId)
      const drugErrors: string[] = []
      
      if (!drug) {
        drugErrors.push('药品不存在')
        errors.push({
          drugId: prescDrug.drugId,
          drugName: '未知药品',
          errors: drugErrors
        })
        return
      }
      
      // 检查药品是否过期
      if (drugStore.isDrugExpired(drug.expiry)) {
        drugErrors.push(`药品已过期 (${drug.expiry})`)
      }
      
      // 检查库存是否充足
      if (drug.stock < prescDrug.dosage) {
        drugErrors.push(`库存不足 (需要${prescDrug.dosage}，仅有${drug.stock})`)
      }
      
      // 检查药房分配限额
      const pharmacyLimit = pharmacyStore.getPharmacyDrugLimit(prescription.pharmacyId, prescDrug.drugId)
      if (pharmacyLimit === 0) {
        drugErrors.push('该药房未分配此药品')
      } else if (prescDrug.dosage > pharmacyLimit) {
        drugErrors.push(`超出药房分配限额 (需要${prescDrug.dosage}，限额${pharmacyLimit})`)
      }
      
      if (drugErrors.length > 0) {
        errors.push({
          drugId: prescDrug.drugId,
          drugName: drug.name,
          errors: drugErrors
        })
      }
    })
    
    return errors
  }
  
  // 获取处方药品详情（包含验证信息）
  const getPrescriptionDrugDetails = (prescription: PrescriptionDetail): PrescriptionDrugDetail[] => {
    const validationErrors = validatePrescription(prescription)
    
    return prescription.drugs.map(prescDrug => {
      const drug = drugStore.drugs.find(d => d.id === prescDrug.drugId)
      const drugErrors = validationErrors.find(e => e.drugId === prescDrug.drugId)
      
      return {
        ...prescDrug,
        drugName: drug?.name || '未知药品',
        available: !drugErrors || drugErrors.errors.length === 0,
        reason: drugErrors ? drugErrors.errors.join(', ') : undefined
      }
    })
  }
  
  // 履行处方
  const fulfillPrescription = async (prescriptionId: string): Promise<FulfillmentResponse> => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)) // 模拟处理时间
      
      const prescription = prescriptions.value.find(p => p.id === prescriptionId)
      if (!prescription) {
        throw new Error('处方不存在')
      }
      
      // 验证处方
      const validationErrors = validatePrescription(prescription)
      const auditStore = useAuditStore()
      if (validationErrors.length > 0) {
        // 履行失败
        prescription.status = 'FAILED'
        prescription.updatedAt = new Date().toISOString()
        // 创建失败的审计日志
        await auditStore.createAuditLog(
          prescription.id,
          prescription.patientId,
          prescription.patientName || '',
          prescription.pharmacyId,
          prescription.pharmacyName || '',
          prescription.drugs,
          false, // 失败
          [], // 没有分发药品
          validationErrors.flatMap(e => e.errors)
        )
        return {
          success: false,
          errors: validationErrors.flatMap(e => e.errors)
        }
      } else {
        // 履行成功 - 更新库存
        prescription.drugs.forEach(prescDrug => {
          const drug = drugStore.drugs.find(d => d.id === prescDrug.drugId)
          if (drug) {
            drug.stock -= prescDrug.dosage
          }
        })
        
        prescription.status = 'FULFILLED'
        prescription.updatedAt = new Date().toISOString()
        // 创建成功的审计日志
        await auditStore.createAuditLog(
          prescription.id,
          prescription.patientId,
          prescription.patientName || '',
          prescription.pharmacyId,
          prescription.pharmacyName || '',
          prescription.drugs,
          true, // 成功
          prescription.drugs, // 成功分发的药品
          []
        )
        return { success: true }
      }
    } catch (err) {
      error.value = '履行处方失败'
      return {
        success: false,
        errors: ['系统错误，请稍后重试']
      }
    } finally {
      loading.value = false
    }
  }
  
  // 按状态过滤处方
  const filterByStatus = (status: string) => {
    if (status === 'ALL') {
      return prescriptions.value
    }
    return prescriptions.value.filter(p => p.status === status)
  }
  
  return {
    prescriptions,
    currentPrescription,
    loading,
    error,
    pendingCount,
    fulfilledCount,
    failedCount,
    fetchPrescriptions,
    fetchPrescriptionById,
    validatePrescription,
    getPrescriptionDrugDetails,
    fulfillPrescription,
    filterByStatus
  }
})
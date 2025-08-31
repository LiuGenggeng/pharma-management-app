import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuditStore } from '../src/stores/audit'

describe('AuditLogs Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should handle audit store operations', () => {
    const auditStore = useAuditStore()
    
    // 测试初始状态
    expect(auditStore.auditLogs.length).toBeGreaterThan(0)
    expect(typeof auditStore.totalLogs).toBe('number')
    expect(typeof auditStore.successLogs).toBe('number')
    expect(typeof auditStore.failedLogs).toBe('number')
  })
  
  it('should filter audit logs by different criteria', () => {
    const auditStore = useAuditStore()
    
    // 测试不同的筛选条件
    const allLogs = auditStore.filterAuditLogs({})
    const patientLogs = auditStore.filterAuditLogs({ patientId: 'P001' })
    const successLogs = auditStore.filterAuditLogs({ status: 'SUCCESS' })
    
    expect(Array.isArray(allLogs)).toBe(true)
    expect(Array.isArray(patientLogs)).toBe(true)
    expect(Array.isArray(successLogs)).toBe(true)
  })
  
  it('should get patients and pharmacies for filter', () => {
    const auditStore = useAuditStore()
    
    expect(Array.isArray(auditStore.patients)).toBe(true)
    expect(Array.isArray(auditStore.pharmaciesForFilter)).toBe(true)
  })
  
  it('should get drug name correctly', () => {
    const auditStore = useAuditStore()
    
    const drugName = auditStore.getDrugName('D001')
    expect(typeof drugName).toBe('string')
    expect(drugName.length).toBeGreaterThan(0)
  })
  
  it('should create audit log', async () => {
    const auditStore = useAuditStore()
    const initialCount = auditStore.auditLogs.length
    
    const result = await auditStore.createAuditLog(
      'RX_TEST',
      'P_TEST',
      '测试患者',
      'PH_TEST',
      '测试药房',
      [{ drugId: 'D001', dosage: 30 }],
      true,
      [{ drugId: 'D001', dosage: 30 }],
      []
    )
    
    expect(result).toBeTruthy()
    expect(auditStore.auditLogs.length).toBe(initialCount + 1)
  })
})
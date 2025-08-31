import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePharmacyStore } from '../src/stores/pharmacy'

describe('PharmacyManagement Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should handle pharmacy store operations', async () => {
    const pharmacyStore = usePharmacyStore()
    
    // 测试初始状态
    expect(pharmacyStore.pharmacies.length).toBeGreaterThan(0)
    expect(pharmacyStore.totalPharmacies).toBe(pharmacyStore.pharmacies.length)
    
    // 测试搜索功能
    const searchResults = pharmacyStore.searchPharmacies('成都')
    expect(Array.isArray(searchResults)).toBe(true)
    
    // 测试获取药房药品限额
    const limit = pharmacyStore.getPharmacyDrugLimit('PH001', 'D001')
    expect(typeof limit).toBe('number')
  })
  
  it('should fetch pharmacy by id', async () => {
    const pharmacyStore = usePharmacyStore()
    
    const pharmacy = await pharmacyStore.fetchPharmacyById('PH001')
    expect(pharmacy).toBeTruthy()
    expect(pharmacy?.id).toBe('PH001')
  })
})
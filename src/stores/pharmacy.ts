import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Pharmacy } from '@/types'
import { mockPharmacies } from '@/services/mockData'

export const usePharmacyStore = defineStore('pharmacy', () => {
  const pharmacies = ref<Pharmacy[]>([...mockPharmacies])
  const currentPharmacy = ref<Pharmacy | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算总药房数量
  const totalPharmacies = computed(() => pharmacies.value.length)
  
  // 获取所有药房列表
  const fetchPharmacies = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 400))
      // pharmacies.value 已经有数据了
    } catch (err) {
      error.value = '获取药房列表失败'
    } finally {
      loading.value = false
    }
  }
  
  // 根据ID获取药房详情
  const fetchPharmacyById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const pharmacy = pharmacies.value.find(p => p.id === id)
      if (pharmacy) {
        currentPharmacy.value = pharmacy
        return pharmacy
      } else {
        throw new Error('药房不存在')
      }
    } catch (err) {
      error.value = '获取药房详情失败'
      currentPharmacy.value = null
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 搜索药房（按名称）
  const searchPharmacies = (keyword: string) => {
    if (!keyword.trim()) {
      return pharmacies.value
    }
    return pharmacies.value.filter(pharmacy =>
      pharmacy.name.toLowerCase().includes(keyword.toLowerCase()) ||
      pharmacy.id.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  // 获取药房分配的特定药品信息
  const getPharmacyDrugLimit = (pharmacyId: string, drugId: string) => {
    const pharmacy = pharmacies.value.find(p => p.id === pharmacyId)
    if (!pharmacy) return 0
    
    const allocatedDrug = pharmacy.allocatedDrugs.find(d => d.drugId === drugId)
    return allocatedDrug?.limit || 0
  }
  
  return {
    pharmacies,
    currentPharmacy,
    loading,
    error,
    totalPharmacies,
    fetchPharmacies,
    fetchPharmacyById,
    searchPharmacies,
    getPharmacyDrugLimit
  }
})
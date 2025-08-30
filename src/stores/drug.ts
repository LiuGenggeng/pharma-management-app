import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Drug } from '@/types'
import { mockDrugs } from '@/services/mockData'
import dayjs from 'dayjs'

export const useDrugStore = defineStore('drug', () => {
  const drugs = ref<Drug[]>([...mockDrugs])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算过期药品
  const expiredDrugs = computed(() =>
    drugs.value.filter(drug => dayjs(drug.expiry).isBefore(dayjs()))
  )
  
  // 获取所有药品
  const fetchDrugs = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      // drugs.value 已经有数据了
    } catch (err) {
      error.value = '获取药品列表失败'
    } finally {
      loading.value = false
    }
  }
  
  // 添加药品
  const addDrug = async (drugData: Omit<Drug, 'id'>) => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newDrug: Drug = {
        ...drugData,
        id: `D${(drugs.value.length + 1).toString().padStart(3, '0')}`
      }
      
      drugs.value.push(newDrug)
      return { success: true }
    } catch (err) {
      error.value = '添加药品失败'
      return { success: false }
    } finally {
      loading.value = false
    }
  }
  
  // 检查药品是否过期
  const isDrugExpired = (expiry: string) => {
    return dayjs(expiry).isBefore(dayjs())
  }
  
  return {
    drugs,
    loading,
    error,
    expiredDrugs,
    fetchDrugs,
    addDrug,
    isDrugExpired
  }
})
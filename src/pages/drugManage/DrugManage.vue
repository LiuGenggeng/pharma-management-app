<template>
  <div>
    <el-button  @click="showAddDialog = true;" type="primary">Add Drug</el-button>
    <el-table :data="tableData">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="limit" label="Limit" width="180" />
      <el-table-column prop="manufacturer" label="Manufacturer" width="180" />
      <el-table-column prop="batch" label="Batch" width="180" />
      <el-table-column prop="expiry" label="Expiry" width="300" />
      <el-table-column prop="stock" label="Stock"/>
    </el-table>
    <AddDrugDialog
      v-model:visible="showAddDialog"
      @confirm="handleConfirm"
    ></AddDrugDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddDrugDialog from "@components/AddDrugDialog.vue";
import {ElMessage} from "element-plus";
const originData = [
  {
    "id": "D001",
    "name": "Ibuprofen",
    "manufacturer": "ACME Pharma",
    "batch": "B202403",
    "expiry": "2026-01-01",
    "stock": 150,
    "limit": 200
  },
  {
    "id": "D002",
    "name": "Bsajijaoiwd",
    "manufacturer": "ACME Pharma",
    "batch": "B202406",
    "expiry": "2026-05-01",
    "stock": 170,
    "limit": 300
  }
]
const tableData : any = ref([]);
const showAddDialog = ref(false);


onMounted(() => {
  tableData.value = originData;
})

const handleConfirm = (formData:any) => {
  console.log('接收到的表单数据:', formData)
  tableData.value.push(formData)
  ElMessage.success('药品信息添加成功！')
}

</script>
<style scoped lang="scss">

</style>
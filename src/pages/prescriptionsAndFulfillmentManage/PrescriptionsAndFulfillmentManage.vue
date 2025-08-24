<template>
  <el-table :data="tableData">
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="patientId" label="patientId" width="180" />
    <el-table-column label="Status" width="180">
      <template #default="scope">
        {{STATUS_TEXT[scope.row.status]}}
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="handleDetailClick(scope.row.id)">
          Detail
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <PrescriptionDrawer
      ref="prescriptionDrawerRef"
      :id="activeId"
      @refresh="handleTableRefresh"
  ></PrescriptionDrawer>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import PrescriptionDrawer from "@components/PrescriptionDrawer.vue";

const STATUS_TEXT: any = {
  'PENDING': 'PENDING',
  'FAILED': 'FAILED',
  'SUCCESS': 'SUCCESS',
}
const originData = [
  {
    "id": "RX123",
    "patientId": "P001",
    "pharmacyId": "ACME Pharma",
    "drugs": [
      { "drugId": "D001", "dosage": 400 },
      { "drugId": "D002", "dosage": 500 }
    ],
    "status": "PENDING"
  },
  {
    "id": "RX124",
    "patientId": "P002",
    "pharmacyId": "ACME Pharma ABC",
    "drugs": [
      { "drugId": "D001", "dosage": 400 },
      { "drugId": "D003", "dosage": 600 }
    ],
    "status": "SUCCESS"
  }
]
const tableData : any = ref([]);
const activeId = ref('');
const prescriptionDrawerRef = ref();
onMounted(() => {
  tableData.value = originData;
})

const handleDetailClick = (prescriptionId: string) => {
  activeId.value = prescriptionId;
  prescriptionDrawerRef.value.openDrawer();
}
const handleTableRefresh = () => {
  tableData.value = originData;
}
</script>

<style scoped>

</style>
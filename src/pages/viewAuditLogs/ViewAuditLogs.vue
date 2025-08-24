<template>
  <AuditSearchForm
    @search="handleSearch"
  />
  <el-table :data="tableData">
    <el-table-column prop="prescriptionId" label="PrescriptionId" width="180" />
    <el-table-column prop="patientId" label="PatientId" width="180" />
    <el-table-column prop="pharmacyId" label="PharmacyId" width="180" />
    <el-table-column fixed="right" label="Status" min-width="120">
      <template #default="scope">
        {{STATUS_TEXT[scope.row.status]}}
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="handleDetailClick(scope.row)">
          Detail
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <LogDetailDrawer
      ref="logDetailDrawerRef"
      :data="curPrescription"
  />
</template>
<script setup lang="ts">
import AuditSearchForm from "@/pages/viewAuditLogs/components/AuditSearchForm.vue";
import {onMounted, ref} from "vue";
import LogDetailDrawer from "@components/LogDetailDrawer.vue";
const originData = [
  {
    "prescriptionId": "RX123",
    "patientId": "P001",
    "pharmacyId": "PH001",
    "status": "FAILED",
    "drugsRequested": [{
      drugId: 'D001',
      drugName: 'Ibuprofen',
      dosage: 200
    }, {
      drugId: 'D002',
      drugName: 'Suascjasc',
      dosage: 300
    }],
    "drugsDispensed": [
      {
        drugId: 'D003',
        drugName: 'Ibuprofen',
        dosage: 200
      }, {
        drugId: 'D004',
        drugName: 'Suascjasc',
        dosage: 300
      }
    ],
    "failureReasons": ["Drug expired", "Over allocation"]
  }
]
const STATUS_TEXT: any = {
  'PENDING': 'PENDING',
  'FAILED': 'FAILED',
  'SUCCESS': 'SUCCESS',
}
const tableData : any = ref([]);
const curPrescription = ref({});
const logDetailDrawerRef = ref();

onMounted(() => {
  tableData.value = originData;
})
const handleSearch = (formData) => {
  tableData.value = originData;
}
const handleDetailClick = (prescriptionInfo: any) => {
  curPrescription.value = prescriptionInfo;
  logDetailDrawerRef.value.openDrawer();
}
</script>

<style scoped>

</style>
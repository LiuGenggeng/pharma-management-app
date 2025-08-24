<template>
  <el-drawer
      v-model="drawerVisible"
      title="View Detail"
      direction="rtl"
      size="50%"
  >
    <el-row>
      ID: {{prescriptionDetail.id}}
    </el-row>
    <el-row>
      patientId: {{prescriptionDetail.patientId}}
    </el-row>
    <el-row>
      pharmacyId: {{prescriptionDetail.pharmacyId}}
    </el-row>
    <el-table :data="prescriptionDetail.drugs">
      <el-table-column property="drugId" label="Id" width="150" />
      <el-table-column property="dosage" label="dosage"  />
    </el-table>
    <el-button
        :disabled="loading"
        class="btn-fulfill"
        type="primary"
        v-if="prescriptionDetail.status === PENDING"
        @click="handleFulfill"
    >
      Fulfill
    </el-button>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['refresh'])
const drawerVisible = ref(false);
const loading = ref(true);
const PENDING = 'PENDING';
const prescriptionDetail = ref({
  id: '',
  patientId: '',
  pharmacyId: '',
  drugs: [] as any,
  status: ''
});

const queryPrescriptionDetailById = (id: string) => {
  prescriptionDetail.value =   {
    "id": "RX123",
    "patientId": "P001",
    "pharmacyId": "ACME Pharma",
    "drugs": [
      { "drugId": "D001", "dosage": 400 },
      { "drugId": "D002", "dosage": 500 }
    ],
    "status": "PENDING"
  }
}
const openDrawer = () => {
  drawerVisible.value = true;
  queryPrescriptionDetailById(props.id);
}
const handleFulfill = () => {
  loading.value = true;
  setTimeout(() => {
    emit('refresh');
    loading.value = false;
    drawerVisible.value = false;
  }, 1000)
}
defineExpose({
  openDrawer
})
</script>
<style scoped lang="scss">
.btn-fulfill {
  margin-top: 16px;
  float: right;
}
</style>
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
import {prescriptionApi} from "@/apis/api.ts";
import {ElMessage} from "element-plus";
const emit = defineEmits(['refresh'])
const drawerVisible = ref(false);
const loading = ref(false);
const PENDING = 'PENDING';
const prescriptionDetail = ref({
  id: '',
  patientId: '',
  pharmacyId: '',
  drugs: [] as any,
  status: ''
});

const queryPrescriptionDetailById = (id: string) => {
  prescriptionApi.getPrescription(id).then(res => {
    prescriptionDetail.value = res;
  })
}
const openDrawer = (id: string) => {
  drawerVisible.value = true;
  queryPrescriptionDetailById(id);
}
const handleFulfill = () => {
  loading.value = true;
  prescriptionApi.fulfillPrescription(prescriptionDetail.value.id).then(res => {
    loading.value = false;
    emit('refresh');
    drawerVisible.value = false;
    if (res.success) {
      ElMessage.success('Fulfillment success!')
    } else {
      const errStr = res.errors.join(',')
      ElMessage.error('Fulfillment failed! ' + errStr);
    }
  })
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
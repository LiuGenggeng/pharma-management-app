<template>
  <el-drawer
      v-model="drawerVisible"
      title="View Detail"
      direction="rtl"
      size="50%"
  >
    <el-row>
      prescriptionId: {{data.prescriptionId}}
    </el-row>
    <el-row>
      patientId: {{data.patientId}}
    </el-row>
    <el-row>
      pharmacyId: {{data.pharmacyId}}
    </el-row>
    <div>drugsRequested List</div>
    <el-table :data="data.drugsRequested">
      <el-table-column property="drugId" label="Id" width="150" />
      <el-table-column property="dosage" label="Dosage"  />
    </el-table>
    <div>drugsDispensed List</div>
    <el-table :data="data.drugsDispensed">
      <el-table-column property="drugId" label="Id" width="150" />
      <el-table-column property="dosage" label="Dosage"  />
    </el-table>
    <div v-if="data.status === STATUS_TEXT.FAILED">
      Fail Reason:
      <div v-for="item in data.failureReasons">
        {{item}}
      </div>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
defineProps(['data'])
const drawerVisible = ref(false);
const openDrawer = () => {
  drawerVisible.value = true;
}
const STATUS_TEXT: any = {
  'PENDING': 'PENDING',
  'FAILED': 'FAILED',
  'SUCCESS': 'SUCCESS',
}
defineExpose({
  openDrawer
})
</script>
<style scoped>

</style>
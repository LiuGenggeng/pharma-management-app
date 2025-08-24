<template>
  <el-drawer
      v-model="drawerVisible"
      title="View Detail"
      direction="rtl"
      size="50%"
  >
    <el-row>
      ID: {{pharmaciesDetail.id}}
    </el-row>
    <el-row>
      Name: {{pharmaciesDetail.name}}
    </el-row>
    <el-table :data="pharmaciesDetail.allocatedDrugs">
      <el-table-column property="drugId" label="Id" width="150" />
      <el-table-column property="drugName" label="Name" width="200" />
      <el-table-column property="limit" label="Limit" />
    </el-table>
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
const drawerVisible = ref(false);

const pharmaciesDetail = ref({
  id: '',
  name: '',
  allocatedDrugs: [] as any
});

const queryPharmaciesDetailById = (id: string) => {
  pharmaciesDetail.value = {
    "id": "PH001",
    "name": "Chengdu Main Branch",
    "allocatedDrugs": [
      { "drugId": "D001", "drugName": "Ibuprofen", "limit": 200 },
      { "drugId": "D002", "drugName": "Paracetamol", "limit": 100 }
    ]
  }
}
const openDrawer = () => {
  drawerVisible.value = true;
  queryPharmaciesDetailById(props.id);
}
defineExpose({
  openDrawer
})
</script>
<style scoped>

</style>
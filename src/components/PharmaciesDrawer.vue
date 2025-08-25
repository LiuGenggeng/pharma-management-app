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
import {type Pharmacy, pharmacyApi} from "@/apis/api.ts";
const drawerVisible = ref(false);

const pharmaciesDetail = ref({
  id: '',
  name: '',
  allocatedDrugs: [] as any
});

const queryPharmaciesDetailById = (id: string) => {
  pharmacyApi.getPharmacy(id).then((res: Pharmacy) => {
    pharmaciesDetail.value = res;
  })
}
const openDrawer = (id: string) => {
  drawerVisible.value = true;
  queryPharmaciesDetailById(id);
}
defineExpose({
  openDrawer
})
</script>
<style scoped>

</style>
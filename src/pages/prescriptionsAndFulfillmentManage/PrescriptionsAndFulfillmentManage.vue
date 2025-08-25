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
      @refresh="handleTableRefresh"
  ></PrescriptionDrawer>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import PrescriptionDrawer from "@components/PrescriptionDrawer.vue";
import {prescriptionApi} from "@/apis/api.ts";

const STATUS_TEXT: any = {
  'PENDING': 'PENDING',
  'FAILED': 'FAILED',
  'SUCCESS': 'SUCCESS',
}

const tableData : any = ref([]);
const activeId = ref('');
const prescriptionDrawerRef = ref();
onMounted(() => {
  queryData();
})
const queryData = () => {
  prescriptionApi.getPrescriptions().then(res => {
    tableData.value = res;
  })
}
const handleDetailClick = (prescriptionId: string) => {
  activeId.value = prescriptionId;
  prescriptionDrawerRef.value.openDrawer(activeId.value);
}
const handleTableRefresh = () => {
  queryData();
}
</script>

<style scoped>

</style>
<template>
  <div>
    <el-table style="width: 100%" :data="tableData">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" width="400" />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="handleDetailClick(scope.row.id)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <PharmaciesDrawer
        ref="pharmaciesDrawerRef"
    ></PharmaciesDrawer>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PharmaciesDrawer from "@components/PharmaciesDrawer.vue";
import { pharmacyApi } from "@/apis/api.ts";
const tableData : any = ref([]);
const activeId = ref('');
const pharmaciesDrawerRef = ref();

onMounted(() => {
  queryData();
})
const queryData = () => {
  pharmacyApi.getPharmacies().then(res => {
    tableData.value = res;
  })
}
const handleDetailClick = (pharmaciesId: string) => {
  activeId.value = pharmaciesId;
  pharmaciesDrawerRef.value.openDrawer(activeId.value);
}

</script>
<style scoped lang="scss">

</style>
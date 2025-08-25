<template>
  <div>
    <el-button  @click="showAddDialog = true;" type="primary">Add Drug</el-button>
    <el-table :data="tableData">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="limit" label="Limit" width="180" />
      <el-table-column prop="manufacturer" label="Manufacturer" width="180" />
      <el-table-column prop="batch" label="Batch" width="180" />
      <el-table-column prop="expiry" label="Expiry" width="300" >
        <template #default="scope">
          {{scope.row.expiry}}
          <el-tag v-if="scope.row.isExpired" type="warning">expired</el-tag>
        </template>
      </el-table-column>
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
import {drugApi} from "@/apis/api.ts";
const tableData : any = ref([]);
const showAddDialog = ref(false);


onMounted(() => {
  queryDrugs();
})
const queryDrugs = () => {
  drugApi.getDrugs().then(res => {
    if (res) {
      tableData.value = res;
    }
  }, (err) => {
    console.log('error', err);
  })
}
const handleConfirm = (formData:any) => {
  console.log('formData', formData);
  drugApi.addDrug(formData).then((res) => {
    if (res?.success) {
      ElMessage.success('Add drug successful!！')
      queryDrugs();
    } else {
      ElMessage.success(`Add drug failed！${err}`)
    }
  }, (err) => {
    ElMessage.success(`Add drug failed！${err}`)
  })
}

</script>
<style scoped lang="scss">

</style>
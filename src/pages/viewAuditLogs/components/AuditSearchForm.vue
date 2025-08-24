<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline">
    <el-form-item label="drug">
      <el-input v-model="searchForm.drug" placeholder="Approved by" />
    </el-form-item>
    <el-form-item label="pharmacy">
      <el-input v-model="searchForm.pharmacy" placeholder="Approved by" />
    </el-form-item>
    <el-form-item label="status">
      <el-select
          v-model="searchForm.status"
          placeholder="status"
          style="width: 192px"
      >
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="reset">Reset</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Query</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref } from "vue";
const originFrom = {
  drug: '',
  pharmacy: '',
  status: 'ALL'
}
const statusOptions: any = [
  {label: 'ALL', value: 'ALL'},
  {label: 'PENDING', value: 'PENDING'},
  {label: 'REJECTED', value: 'REJECTED'},
  {label: 'SUCCESS', value: 'SUCCESS'},
]
const searchForm = ref({
  ...originFrom
});
const emit = defineEmits(['search'])
const onSubmit = () => {
  emit('search', searchForm.value);
}
const reset = () => {
  searchForm.value = {
    ...originFrom
  }
}
</script>
<style scoped lang="scss">

</style>
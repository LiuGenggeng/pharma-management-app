<template>
<el-button type="primary" @click="handleResetClick">reset mock data</el-button>
<el-button type="primary" @click="handleRemoveClick">remove mock data</el-button>
</template>
<script setup lang="ts">
import {storage} from "@/common/utils/storage.ts";
import {DEFAULT_DATA, MOCK_LOCALSTORAGE_KEY} from "@/mocks/initMockData.ts";
import {ElMessage} from "element-plus";

const handleResetClick = () => {
  storage.set(MOCK_LOCALSTORAGE_KEY, DEFAULT_DATA)
  ElMessage.success('Reset mock data successfully!');
}
const handleRemoveClick = () => {
  storage.del(MOCK_LOCALSTORAGE_KEY)
  ElMessage.success('Remove mock data successfully!');
}
</script>
<style scoped lang="scss">

</style>
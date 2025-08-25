<template>
  <el-menu
      :default-active="curActive"
      class="menu"
      router
  >
    <el-menu-item index="1" route="/drugManage">
      <el-icon><Shop /></el-icon>
      <span>Manage Drugs</span>
    </el-menu-item>
    <el-menu-item index="2" route="/pharmaciesManage">
      <el-icon><house /></el-icon>
      <span>Manage Pharmacies</span>
    </el-menu-item>
    <el-menu-item index="3" route="/prescriptionsAndFulfillmentManage">
      <el-icon><Document /></el-icon>
      <span>Prescriptions</span>
    </el-menu-item>
    <el-menu-item index="4" route="/viewAuditLogs">
      <el-icon><DocumentChecked /></el-icon>
      <span>Audit Logs</span>
    </el-menu-item>
    <el-menu-item index="5" route="/setting">
      <el-icon><Setting /></el-icon>
      <span>Setting</span>
    </el-menu-item>
  </el-menu>
</template>
<script setup lang="ts">
import {
  Shop,
  House,
  Document,
  DocumentChecked,
  Setting,
} from '@element-plus/icons-vue'
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
const route = useRoute();
const curPath = route.path;

defineProps<{ }>()
const curActive = ref('1');
onMounted(() => {
  if (curPath === '/drugManage') {
    curActive.value = '1';
  } else if (curPath === '/pharmaciesManage') {
    curActive.value = '2';
  } else if (curPath === '/prescriptionsAndFulfillmentManage') {
    curActive.value = '3';
  } else if (curPath === '/viewAuditLogs') {
    curActive.value = '4';
  } else if (curPath === '/setting') {
    curActive.value = '5';
  }
})
</script>
<style scoped lang="scss">
.menu {
  height: 100%;
}
</style>

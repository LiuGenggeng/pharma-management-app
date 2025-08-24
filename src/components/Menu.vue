<template>
  <el-menu
      default-active="1"
      class="menu"
      router
  >
    <el-menu-item index="1" route="/drugManage">
      <el-icon><Shop /></el-icon>
      <span>管理药品</span>
    </el-menu-item>
    <el-menu-item index="2" route="/pharmaciesManage">
      <el-icon><house /></el-icon>
      <span>管理药房</span>
    </el-menu-item>
    <el-menu-item index="3" route="/prescriptionsAndFulfillmentManage">
      <el-icon><Document /></el-icon>
      <span>管理处方和履行</span>
    </el-menu-item>
    <el-menu-item index="4" route="/viewAuditLogs">
      <el-icon><DocumentChecked /></el-icon>
      <span>查看审计日志</span>
    </el-menu-item>
  </el-menu>
</template>
<script setup lang="ts">
import {
  Shop,
  House,
  Document,
  DocumentChecked,
} from '@element-plus/icons-vue'
defineProps<{ }>()

</script>
<style scoped lang="scss">
.menu {
  height: 100%;
}
</style>

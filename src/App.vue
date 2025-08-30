<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <el-menu
          :default-active="$route.path"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="/drugs">
          <el-icon><Sugar /></el-icon>
          <span>药品管理</span>
        </el-menu-item>
        <el-menu-item index="/pharmacies">
          <el-icon><OfficeBuilding /></el-icon>
          <span>药房管理</span>
        </el-menu-item>
        <el-menu-item index="/prescriptions">
          <el-icon><Document /></el-icon>
          <span>处方管理</span>
        </el-menu-item>
        <el-menu-item index="/audit">
          <el-icon><List /></el-icon>
          <span>审计日志</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { Sugar, OfficeBuilding, Document, List } from '@element-plus/icons-vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.el-aside {
  background-color: #545c64;
}

.el-main {
  background-color: #f5f5f5;
}
</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="sidebar" width="200px" >
        <Menu />
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Menu from "@components/Menu.vue";
</script>

<style scoped lang="scss">
.sidebar {
  height: 100vh;
}
</style>

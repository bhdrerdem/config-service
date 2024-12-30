<template>
  <div class="panel">
    <Header />
    <ConfigsTable />
  </div>
</template>

<script setup>
import ConfigsTable from "./ConfigsTable.vue";
import Header from "../../components/Header.vue";
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="panel">
    <PanelHeader />
    <ConfigsTable />
  </div>
</template>

<script setup>
import ConfigsTable from "./ConfigsTable.vue";
import PanelHeader from "./PanelHeader.vue";
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

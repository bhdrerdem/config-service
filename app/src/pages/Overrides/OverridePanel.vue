<template>
  <div class="panel">
    <Header />
    <OverrideTable />
  </div>
</template>

<script setup>
import OverrideTable from "./OverrideTable.vue";
import Header from "../../components/Header.vue";
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

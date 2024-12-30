<template>
  <div class="panel">
    <Header />
    <AudienceTable />
  </div>
</template>

<script setup>
import AudienceTable from "./components/Table.vue";
import Header from "../../components/Header.vue";
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

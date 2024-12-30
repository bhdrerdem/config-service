<template>
  <div class="panel">
    <Header />
    <AudiencesTable />
  </div>
</template>

<script setup>
import AudiencesTable from "./AudiencesTable.vue";
import Header from "../../components/Header.vue";
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="panel">
    <Header />
    <Table />
  </div>
</template>

<script setup>
import Table from "./components/Table.vue";
import Header from "../../components/Header.vue";
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <table class="table-view">
    <thead>
      <tr>
        <th class="table-title">
          <h3>Parameter Key</h3>
        </th>
        <th class="table-title">
          <h3>Value</h3>
        </th>
        <th class="table-title">
          <h3>Description</h3>
        </th>
        <th class="table-title" @click="toggleSortOrder">
          <div style="display: flex; align-items: center">
            <h3 style="cursor: pointer">
              Create Date
              <span v-if="sortOrder === 'descending'">&#9660;</span>
              <span v-else>&#9650;</span>
            </h3>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <ConfigRow
        v-for="(configuration, index) in configurations"
        :key="index"
        :config="configuration"
      />
      <ConfigAddRow />
    </tbody>
  </table>
</template>

<script setup>
import ConfigRow from "./ConfigRow.vue";
import ConfigAddRow from "./ConfigAddRow.vue";
import { useConfig } from "../../composables/useConfig";
import { onMounted, ref } from "vue";

const { configurations, fetchConfigurations } = useConfig();

const sortOrder = ref("desc");
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
};

onMounted(async () => {
  await fetchConfigurations();
});
</script>

<style scoped>
.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media only screen and (max-width: 768px) {
  .table-view {
    display: none;
  }
  .card-view {
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
}
@media only screen and (min-width: 769px) {
  .card-view {
    display: none;
  }
  .table-view {
    width: 100%;
    padding: 24px 80px 24px 24px;
  }
}

.table-title h3 {
  text-align: left;
  margin: 0;
  color: #c8c8cd;
}

.table-title span {
  color: #c8c8cd;
}
</style>

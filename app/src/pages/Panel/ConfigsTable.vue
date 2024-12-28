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
              <FontAwesomeIcon
                :icon="faArrowDown"
                v-if="sortOrder === 'desc'"
              />
              <FontAwesomeIcon :icon="faArrowUp" v-else />
            </h3>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <Spinner v-if="isLoading" />
      <ConfigRow
        v-else
        v-for="(config, index) in sortedConfigs"
        :key="index"
        :config="config"
      />
      <ConfigAddRow />
    </tbody>
  </table>
</template>

<script setup>
import ConfigRow from "./ConfigRow.vue";
import ConfigAddRow from "./ConfigAddRow.vue";
import { useConfig } from "../../composables/useConfig";
import { computed, onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Spinner.vue";

const { configurations, fetchConfigurations, isLoading } = useConfig();

const sortOrder = ref("desc");
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
};

const sortedConfigs = computed(() => {
  return configurations.value.sort((a, b) => {
    return sortOrder.value === "desc"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt;
  });
});

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
  font-family: "Poppins", sans-serif;
  font-size: 22px;
  font-weight: 300;
  color: #74879f;
  margin: 0px;
}
</style>

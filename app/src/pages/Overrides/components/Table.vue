<template>
  <table class="table-view">
    <thead>
      <tr>
        <th class="table-title">
          <h3>Parameter Key</h3>
        </th>
        <th class="table-title">
          <h3>Audience</h3>
        </th>
        <th class="table-title">
          <h3>Value</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <Spinner v-if="isLoading" />
      <Row
        v-else
        v-for="(override, index) in customOverrides"
        :key="index"
        :override="override"
      />
      <AddRow />
    </tbody>
  </table>
</template>

<script setup>
import { onMounted } from "vue";
import Spinner from "../../../components/Spinner.vue";
import Row from "./Row.vue";
import AddRow from "./AddRow.vue";
import { useOverride } from "../../../composables/useOverride";

const { customOverrides, fetchOverrides, isLoading } = useOverride();

onMounted(async () => {
  try {
    await fetchOverrides();
  } catch (error) {
    alert(error.message);
  }
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

.table-view th,
.table-view td {
  width: auto;
  min-width: 200px;
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

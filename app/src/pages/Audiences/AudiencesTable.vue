<template>
  <table class="table-view">
    <thead>
      <tr>
        <th class="table-title">
          <h3>Name</h3>
        </th>
        <th class="table-title" style="width: 50%">
          <h3>Description</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <Spinner v-if="isLoading" />
      <AudienceRow
        v-else
        v-for="(audience, index) in audiences"
        :key="index"
        :audience="audience"
      />
      <AudienceAddRow />
    </tbody>
  </table>
</template>

<script setup>
import AudienceRow from "./AudienceRow.vue";
import AudienceAddRow from "./AudienceAddRow.vue";
import { onMounted } from "vue";
import Spinner from "../../components/Spinner.vue";
import { useAudience } from "../../composables/useAudience";

const { audiences, fetchAudiences, isLoading } = useAudience();

onMounted(async () => {
  try {
    await fetchAudiences();
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

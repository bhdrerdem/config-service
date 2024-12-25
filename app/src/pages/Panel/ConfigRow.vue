<template>
  <tr class="config-row">
    <td class="config-data">{{ config.parameterKey }}</td>
    <td class="config-data">{{ config.value }}</td>
    <td class="config-data">{{ config.description }}</td>
    <td class="config-data">{{ formattedCreatedAt }}</td>
    <td>
      <div class="action-btn-container"></div>
    </td>
  </tr>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});

const formattedCreatedAt = computed(() => {
  const date = new Date(props.config.createdAt);
  return date.toLocaleString();
});
</script>

<style scoped>
.action-btn-container {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  max-width: 160px;
}

.config-cell {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.config-cell h3 {
  margin-right: 4px;
}

@media only screen and (max-width: 768px) {
  .config-row {
    display: none;
  }
  .config-card {
    background: inherit;
    border-radius: 10px;
    padding: 20px;
    border: 1px solid;
    border-color: white;
    margin-bottom: 20px;
    color: white;
  }
  .action-btn-container {
    margin: auto;
  }
}
@media only screen and (min-width: 769px) {
  .config-card {
    display: none;
  }
  .config-row {
    height: 30px;
    margin-bottom: 10px;
  }
}

.config-data {
  font-size: medium;
  font-weight: 200;
  color: white;
}
</style>

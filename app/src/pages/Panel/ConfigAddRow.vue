<template>
  <tr class="config-input-row">
    <td>
      <Input
        id="parameter_key"
        class="config-input"
        placeholder="New Parameter"
        type="text"
        v-model="parameterKey"
      />
    </td>
    <td>
      <Input
        id="value"
        class="config-input"
        placeholder="Value"
        type="text"
        v-model="value"
      />
    </td>
    <td colspan="2">
      <Input
        id="description"
        class="config-input config-input-description"
        placeholder="New Description"
        type="text"
        v-model="description"
      />
    </td>
    <td>
      <div class="action-btn-container"></div>
    </td>
  </tr>
</template>

<script setup>
import { ref } from "vue";
import Input from "../../components/Input.vue";

const parameterKey = ref("");
const value = ref("");
const description = ref("");
</script>

<style scoped>
.config-input {
  border-radius: 6px;
  padding: 8px;
  background-color: inherit;
  border: 1px solid;
  border-color: #2a324f;
  color: white;
  width: 88%;
}

@media only screen and (max-width: 768px) {
  .config-input-row {
    display: none;
  }
  .config-input-card {
    background: inherit;
    border-radius: 10px;
    padding: 20px;
    border: 1px solid;
    border-color: white;
    margin-bottom: 20px;
    color: white;
  }

  .config-input {
    width: 80%;
  }

  .config-cell {
    margin-bottom: 8px;
    width: 100%;
  }

  .action-btn-container {
    text-align: center;
  }
}
@media only screen and (min-width: 769px) {
  .config-input-card {
    display: none;
  }
  .config-input-row {
    height: 30px;
    margin-bottom: 10px;
  }

  .action-btn-container {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    max-width: 160px;
  }
}
</style>

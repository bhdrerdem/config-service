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
      <div class="action-btn-container">
        <ActionButton text="Add" kind="info" :onClick="handleCreate" />
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref } from "vue";
import Input from "../../components/Input.vue";
import ActionButton from "../../components/Button.vue";
import { useConfig } from "../../composables/useConfig";

const parameterKey = ref("");
const value = ref("");
const description = ref("");

const handleCreate = async () => {
  try {
    await useConfig().createConfiguration({
      parameterKey: parameterKey.value,
      value: value.value,
      description: description.value,
    });

    parameterKey.value = "";
    value.value = "";
    description.value = "";
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
.config-input {
  width: 90%;
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
    gap: 10px;
    max-width: 160px;
  }
}
</style>

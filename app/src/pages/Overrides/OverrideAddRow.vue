<template>
  <tr class="config-input-row">
    <td>
      <select v-model="selectedConfig" class="styled-select config-input">
        <option value="">Select Parameter Key</option>
        <option
          v-for="configuration in configurations"
          :value="configuration.id"
        >
          {{ configuration.parameterKey }}
        </option>
      </select>
    </td>
    <td>
      <select v-model="selectedAudience" class="styled-select config-input">
        <option value="">Select Audience</option>
        <option v-for="audience in audiences" :value="audience.name">
          {{ audience.name }}
        </option>
      </select>
    </td>
    <td>
      <Input
        id="override-value"
        class="config-input"
        placeholder="Value"
        type="text"
        v-model="value"
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
import { onMounted, ref } from "vue";
import Input from "../../components/Input.vue";
import ActionButton from "../../components/Button.vue";
import { useAudience } from "../../composables/useAudience";
import { useConfig } from "../../composables/useConfig";
import { useOverride } from "../../composables/useOverride";

const { audiences } = useAudience();
const { configurations } = useConfig();

const selectedAudience = ref("");
const selectedConfig = ref("");
const value = ref("");

const handleCreate = async () => {
  try {
    await useOverride().createOverride({
      audience: {
        name: selectedAudience.value,
      },
      configuration: {
        id: selectedConfig.value,
      },
      value: value.value,
    });

    selectedAudience.value = "";
    selectedConfig.value = "";
    value.value = "";
  } catch (error) {
    alert(error.message);
  }
};

onMounted(async () => {
  try {
    await useAudience().fetchAudiences();
    await useConfig().fetchConfigurations();
  } catch (error) {
    alert(error.message);
  }
});
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
    text-align: left;
    max-width: 160px;
  }
}

.styled-select {
  border: 1px solid #74879f;
  border-radius: 4px;
  background-color: transparent;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  color: #74879f;
  outline: none;
  padding: 6px 10px;
  transition: border-color 0.3s ease;
}
</style>

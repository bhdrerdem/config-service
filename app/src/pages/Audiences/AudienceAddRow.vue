<template>
  <tr class="config-input-row">
    <td>
      <Input
        id="audience-name"
        class="config-input"
        placeholder="Name"
        type="text"
        v-model="audienceName"
      />
    </td>
    <td>
      <Input
        id="audience-description"
        class="config-input"
        placeholder="Description"
        type="text"
        v-model="audienceDescription"
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
import { useAudience } from "../../composables/useAudience";

const audienceName = ref("");
const audienceDescription = ref("");

const handleCreate = async () => {
  try {
    await useAudience().createAudience({
      name: audienceName.value,
      description: audienceDescription.value,
    });

    audienceName.value = "";
    audienceDescription.value = "";
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
</style>

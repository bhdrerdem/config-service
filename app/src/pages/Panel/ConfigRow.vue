<template>
  <tr class="config-row">
    <td class="config-data">{{ config.parameterKey }}</td>
    <td class="config-data">{{ config.value }}</td>
    <td class="config-data" style="width: 30%">{{ config.description }}</td>
    <td class="config-data">{{ formattedCreatedAt }}</td>
    <td v-if="!hideButtons">
      <div class="action-btn-container">
        <ActionButton text="Edit" kind="secondary" :onClick="openEditModal" />
        <ActionButton text="Delete" kind="primary" :onClick="handleDelete" />
      </div>
    </td>
  </tr>
  <EditModal
    v-if="isEditModalOpen"
    :visible="isEditModalOpen"
    :config="config"
    @close="closeEditModal"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import ActionButton from "../../components/Button.vue";
import { useConfig } from "../../composables/useConfig";
import EditModal from "./EditModal.vue";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  hideButtons: Boolean,
});

const isEditModalOpen = ref(false);

const openEditModal = () => {
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const saveChanges = async (editedConfig) => {
  await useConfig().updateConfiguration(editedConfig);
  closeEditModal();
};

const formattedCreatedAt = computed(() => {
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(props.config.createdAt));
});

const handleDelete = async () => {
  await useConfig().deleteConfiguration(props.config);
};
</script>

<style scoped>
.action-btn-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
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
    height: 40px;
    margin-bottom: 10px;
  }
}

.config-data {
  text-align: left;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #c8c8d1;
  margin: 0px;

  max-width: 300px;
  word-wrap: break-word;
  white-space: normal;
}
</style>

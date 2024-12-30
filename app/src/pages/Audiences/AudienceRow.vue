<template>
  <tr class="config-row">
    <td class="config-data">{{ audience.name }}</td>
    <td class="config-data" style="width: 50%">{{ audience.description }}</td>
    <td>
      <div class="action-btn-container">
        <ActionButton text="Edit" kind="secondary" :onClick="openEditModal" />
        <ActionButton text="Delete" kind="primary" :onClick="handleDelete" />
      </div>
    </td>
  </tr>
  <EditModal
    v-if="isEditModalOpen"
    :visible="isEditModalOpen"
    :audience="audience"
    @close="closeEditModal"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import ActionButton from "../../components/Button.vue";
import { useAudience } from "../../composables/useAudience";
import EditModal from "./EditModal.vue";

const props = defineProps({
  audience: {
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

const handleDelete = async () => {
  if (confirm("Are you sure you want to delete this audience?")) {
    try {
      await useAudience().deleteAudience(props.audience);
    } catch (error) {
      alert(error.message);
    }
  }
};
</script>

<style scoped>
.action-btn-container {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
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

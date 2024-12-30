<template>
  <BaseModal :visible="visible" @close="emitClose">
    <template #header>
      <h2>Edit Configuration</h2>
    </template>
    <div class="modal-content">
      <form @submit.prevent="saveChanges" class="modal-form">
        <label for="parameterKey">Parameter Key:</label>
        <Input
          type="text"
          class="config-input"
          id="parameterKey"
          placeholder="Edit parameter key"
          v-model="editedConfig.parameterKey"
          style="background-color: #fff; color: #000"
          required
        />

        <label for="value">Value:</label>
        <Input
          type="text"
          class="config-input"
          id="value"
          placeholder="value"
          v-model="editedConfig.value"
          style="background-color: #fff; color: #000"
          required
        />

        <label for="description">Description:</label>
        <Input
          type="text"
          class="config-input"
          id="description"
          placeholder="Edit description"
          style="background-color: #fff; color: #000"
          v-model="editedConfig.description"
        />
      </form>
    </div>
    <template #footer>
      <ActionButton
        type="submit"
        text="Save Changes"
        kind="primary"
        fullWidth
      />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../../components/Modal.vue";
import Input from "../../components/Input.vue";
import ActionButton from "../../components/Button.vue";
import { useConfig } from "../../composables/useConfig";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const editedConfig = ref({ ...props.config });

const emit = defineEmits(["close"]);

const emitClose = () => {
  emit("close");
};

const saveChanges = async () => {
  await useConfig().updateConfiguration(editedConfig.value);
  emitClose();
};
</script>

<style></style>

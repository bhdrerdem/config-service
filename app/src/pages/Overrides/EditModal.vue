<template>
  <BaseModal :visible="visible" @close="emitClose">
    <template #header>
      <h2>Edit Override</h2>
    </template>
    <div class="modal-content">
      <form ref="formRef" @submit.prevent="saveChanges" class="modal-form">
        <label for="name">Audience:</label>
        <Input
          type="text"
          class="audience-input"
          id="name"
          placeholder="Edit name"
          v-model="editedOverride.audience"
          style="background-color: #fff; color: #000"
          required
          readonly
        />

        <label for="name">Configuration:</label>
        <Input
          type="text"
          class="audience-input"
          id="name"
          placeholder="Edit name"
          v-model="editedOverride.parameterKey"
          style="background-color: #fff; color: #000"
          required
          readonly
        />

        <label for="value">Value:</label>
        <Input
          type="text"
          class="override-input"
          id="value"
          placeholder="Edit value"
          style="background-color: #fff; color: #000"
          v-model="editedOverride.value"
        />
      </form>
    </div>
    <template #footer>
      <ActionButton
        text="Save Changes"
        kind="primary"
        fullWidth
        @click="submitForm"
      />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../../components/Modal.vue";
import Input from "../../components/Input.vue";
import ActionButton from "../../components/Button.vue";
import { useOverride } from "../../composables/useOverride";

const props = defineProps({
  override: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const editedOverride = ref({ ...props.override });
const formRef = ref(null);

const emit = defineEmits(["close"]);

const emitClose = () => {
  emit("close");
};

const saveChanges = async () => {
  try {
    await useOverride().updateOverride(editedOverride.value);
    emitClose();
  } catch (error) {
    alert(error.message);
  }
};

const submitForm = () => {
  if (formRef.value) {
    formRef.value.requestSubmit();
  }
};
</script>

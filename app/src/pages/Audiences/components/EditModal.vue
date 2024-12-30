<template>
  <BaseModal :visible="visible" @close="emitClose">
    <template #header>
      <h2>Edit Audience</h2>
    </template>
    <div class="modal-content">
      <form ref="formRef" @submit.prevent="saveChanges" class="modal-form">
        <label for="name">Name:</label>
        <Input
          type="text"
          class="audience-input"
          id="name"
          placeholder="Edit name"
          v-model="editedAudience.name"
          style="background-color: #fff; color: #000"
          required
          readonly
        />

        <label for="description">Description:</label>
        <Input
          type="text"
          class="audience-input"
          id="description"
          placeholder="Edit description"
          style="background-color: #fff; color: #000"
          v-model="editedAudience.description"
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
import BaseModal from "../../../components/Modal.vue";
import Input from "../../../components/Input.vue";
import ActionButton from "../../../components/Button.vue";
import { useAudience } from "../../../composables/useAudience";

const props = defineProps({
  audience: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const editedAudience = ref({ ...props.audience });
const formRef = ref(null);

const emit = defineEmits(["close"]);

const emitClose = () => {
  emit("close");
};

const saveChanges = async () => {
  try {
    await useAudience().updateAudience(editedAudience.value);
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

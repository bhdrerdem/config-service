<template>
  <div class="modal-background" v-if="visible">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">
          <slot name="header"></slot>
        </h3>
        <span class="btn-close" @click="closeModal">X</span>
      </div>
      <div class="modal-content">
        <slot> </slot>
      </div>
      <div class="modal-footer" v-if="showFooter">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ActionButton from "./Button.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.modal {
  background-color: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-close {
  cursor: pointer;
}

.modal-title {
  margin: 0;
}

.modal-footer {
  margin-top: 20px;
}
</style>

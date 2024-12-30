<template>
  <input
    :id="id"
    :placeholder="placeholder"
    :required="required"
    :autofocus="autofocus"
    v-model="model"
  />
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
});

const model = defineModel();
</script>

<style scoped>
input {
  width: 100%;
  padding: 10px 0px;
  margin-bottom: 1px;
  border: 1px solid #2a3451;
  border-radius: 4px;
  background-color: #1e1e2e;
  color: #fff;
  text-align: left;
  text-indent: 10px;
}

input::placeholder {
  color: #697179;
}

input:focus {
  border: 1px solid #993c8f;
  outline: none;
}
</style>

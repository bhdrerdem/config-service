<template>
  <button :class="buttonClasses" :type="buttonType" @click="handleClick">
    {{ text }}
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  fullWidth: {
    type: Boolean,
  },
  kind: {
    type: String,
    default: "primary",
  },
  onClick: {
    type: Function,
  },
});

const buttonType = computed(() => {
  return props.type === "submit" ? "submit" : "button";
});

const buttonClasses = computed(() => {
  return [
    "btn-action",
    `btn-${props.type}`,
    { "btn-full-width": props.fullWidth },
    `btn-kind-${props.kind}`,
  ];
});

const handleClick = (event) => {
  if (props.onClick) {
    props.onClick(event);
  }
};
</script>

<style>
.btn-action {
  cursor: pointer;
  border-radius: 8px;
  height: 35px;
  width: 70px;
  color: #fff;
  border: none;
  box-sizing: border-box;
}

.btn-kind-primary {
  background: linear-gradient(to top right, #c52e47, #ea546c);
}
.btn-kind-primary:hover {
  background: #c52e47;
}

.btn-kind-secondary {
  background: linear-gradient(to top right, #2a3fa9, #4764f5);
}
.btn-kind-secondary:hover {
  background: #2a3fa9;
}

.btn-full-width {
  width: 100%;
}
</style>

<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<script setup>
import { useAuth } from "./composables/useAuth";
import Spinner from "./components/Spinner.vue";

const { isLoading } = useAuth();
</script>

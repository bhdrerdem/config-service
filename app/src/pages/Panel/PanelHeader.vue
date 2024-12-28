<template>
  <div class="header">
    <div class="header-logo">
      <img src="@/assets/icon.png" alt="Codeway Logo" />
    </div>

    <div class="header-user" @click.stop="toggleSignout">
      <FontAwesomeIcon :icon="faUser" />
      <FontAwesomeIcon :icon="faCaretDown" v-if="showSignout === false" />
      <FontAwesomeIcon :icon="faCaretUp" v-else />
      <div v-if="showSignout" class="signout-dropdown">
        <ActionButton text="Sign out" :onClick="handleSignout" fullWidth />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUser,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../composables/useAuth";
import ActionButton from "../../components/Button.vue";

const { signout } = useAuth();

const showSignout = ref(false);

const toggleSignout = () => {
  showSignout.value = !showSignout.value;
};

const handleSignout = async () => {
  try {
    await signout();
  } catch (error) {
    console.error("failed to signout");
  }
};

const handleClickOutside = (event) => {
  const dropdown = document.querySelector(".signout-dropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    showSignout.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
}

.header-logo img,
.header-user img {
  height: 30px;
}

.header-user {
  color: white;
  position: relative;
  cursor: pointer;
}

.signout-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  width: 100px;
  margin-top: 2px;
}
</style>

<template>
  <div class="header">
    <div class="header-left">
      <div v-if="!isMobileView" class="header-actions">
        <div class="header-action">
          <span class="header-route-link" @click="$router.push('/audiences')"
            >AUDIENCES</span
          >
        </div>
        <div class="header-action">
          <span class="header-route-link" @click="$router.push('/overrides')"
            >OVERRIDES</span
          >
        </div>
      </div>
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
import { useAuth } from "../composables/useAuth";
import ActionButton from "./Button.vue";
import { useViewport } from "../composables/useViewport";

const { signout } = useAuth();
const { isMobileView } = useViewport();

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

.header-logo {
  cursor: pointer;
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

.header-actions {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.header-action {
  background-color: transparent;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 6px;
  cursor: pointer;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-route-link {
  color: #c8c8d1;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
}
</style>

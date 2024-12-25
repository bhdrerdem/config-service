<template>
  <div class="header">
    <div class="header-logo">
      <img src="@/assets/icon.png" alt="Codeway Logo" />
    </div>

    <div class="header-user" @click="toggleSignout">
      <FontAwesomeIcon :icon="faUser" />
      <span v-if="showSignout === false">&#9660;</span>
      <span v-else>&#9650;</span>
      <div v-if="showSignout" class="signout-dropdown">
        <button class="signout-button" @click="Signout">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../composables/useAuth";

const { signout } = useAuth();

const showSignout = ref(false);

const toggleSignout = () => {
  showSignout.value = !showSignout.value;
};

const Signout = async () => {
  try {
    await signout();
  } catch (error) {
    console.error("failed to signout");
  }
};
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
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 100px;
  margin-top: 2px;
}

.signout-button {
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
</style>

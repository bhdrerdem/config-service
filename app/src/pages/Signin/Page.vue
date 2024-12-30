<template>
  <div class="card">
    <div class="image-container">
      <img src="../../assets/icon.png" alt="codeway-icon" />
    </div>
    <div class="signin-header">
      <h3>Please sign in</h3>
    </div>
    <div class="signin-container">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <form @submit.prevent="handleSignin">
        <div class="input-container">
          <Input
            type="email"
            id="email"
            placeholder="E-mail address"
            v-model="email"
            required
          />
          <Input
            type="password"
            id="password"
            placeholder="Password"
            v-model="password"
            required
          />
        </div>
        <div class="btn-container">
          <Button type="submit" text="Sign in" fullWidth kind="secondary" />
        </div>
      </form>
    </div>
    <footer>Codeway © 2024</footer>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import { useAuth } from "../../composables/useAuth";

const email = ref("");
const password = ref("");

const { signin, isLoading, error } = useAuth();

const handleSignin = async () => {
  try {
    await signin(email.value, password.value);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

<style scoped>
.signin-header {
  color: #32325d;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-weight: lighter;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding-top: 70px;
  max-width: 400px;
}

.image-container img {
  max-width: 50%;
  margin: auto;
  display: block;
  margin-bottom: 20px;
}

.signin-container {
  width: 60%;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.btn-container {
  margin-top: 10px;
}
footer {
  color: #697179;
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: small;
}

.error-message {
  color: red;
  margin-bottom: 10px;
  text-align: center;
}
</style>

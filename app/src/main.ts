import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./composables/useAuth";

onAuthStateChanged(auth, async (user) => {
  useAuth().setUser(user);
  if (!user) {
    router.push("/signin");
  } else {
    router.push("/");
  }
  useAuth().setIsLoading(false);
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");

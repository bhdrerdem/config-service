import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";
import SigninPage from "@/pages/SigninPage.vue";
import PanelPage from "@/pages/Panel/Panel.vue";
import { useAuth } from "../composables/useAuth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/signin",
    name: "Signin",
    component: SigninPage,
  },
  {
    path: "/",
    name: "Panel",
    component: PanelPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const isAuthenticated = !!useAuth().user.value;

  if (!isAuthenticated && to.path !== "/signin") {
    next("/signin");
  } else if (isAuthenticated && to.path === "/signin") {
    next("/");
  } else {
    next();
  }
});

export default router;

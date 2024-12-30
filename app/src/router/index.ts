import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";
import SigninPage from "@/pages/SigninPage.vue";
import PanelPage from "@/pages/Panel/Panel.vue";
import AudiencePanel from "../pages/Audiences/AudiencePanel.vue";
import { useAuth } from "../composables/useAuth";
import OverridePanel from "../pages/Overrides/OverridePanel.vue";

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
  {
    path: "/audiences",
    name: "Audiences",
    component: AudiencePanel,
  },
  {
    path: "/overrides",
    name: "Overrides",
    component: OverridePanel,
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

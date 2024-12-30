import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";
import SigninPage from "@/pages/Signin/Page.vue";
import PanelPage from "@/pages/Configurations/Page.vue";
import AudiencePage from "../pages/Audiences/Page.vue";
import OverridePage from "../pages/Overrides/Page.vue";

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
    component: AudiencePage,
  },
  {
    path: "/overrides",
    name: "Overrides",
    component: OverridePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

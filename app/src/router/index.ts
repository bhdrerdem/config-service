import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";
import SigninPage from "@/pages/Signin/Page.vue";
import ConfigurationsPage from "@/pages/Configurations/Page.vue";
import AudiencePage from "@/pages/Audiences/Page.vue";
import OverridePage from "@/pages/Overrides/Page.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/signin",
    name: "Signin",
    component: SigninPage,
  },
  {
    path: "/",
    name: "Configurations",
    component: ConfigurationsPage,
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
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

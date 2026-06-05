import { createRouter, createWebHashHistory } from "vue-router";

// Using WebHashHistory is highly compatible for static hosting (like GitHub pages or simple local development)
// and avoids route-reload issues in Vite dev server.
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../screens/HomeScreen.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../screens/LoginScreen.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../screens/RegisterScreen.vue"),
  },
  {
    path: "/explore",
    name: "explore",
    component: () => import("../screens/ExploreScreen.vue"),
  },
  {
    path: "/spot/:id",
    name: "spot-detail",
    component: () => import("../screens/DetailScreen.vue"),
  },
  {
    path: "/booking",
    name: "booking",
    component: () => import("../screens/BookingScreen.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../screens/DashboardScreen.vue"),
  },
  {
    path: "/owner",
    name: "owner",
    component: () => import("../screens/OwnerScreen.vue"),
  },
  // Catch all redirecting to home
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;

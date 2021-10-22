import { createRouter, createWebHistory } from "vue-router";
import Main from "@/renderer/pages/Main.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
      children: [
        {
          path: "/document",
          component: () => {},
        },
        {
          path: "/view",
          component: () => {},
        },
        {
          path: "/setting",
          component: () => {},
        },
        {
          path: "/schedule",
          component: () => {},
        },
        {
          path: "/dashboard",
          component: () => {},
        },
        {
          path: "/graphview",
          component: () => {},
        },
      ],
    },
  ],
});

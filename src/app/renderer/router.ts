import Vue from "vue";
import Router from "vue-router";

import Index from "@/view/Index.vue";
import Loading from "@/view/Loading/Index.vue";
import Files from "@/view/Layout/SideBar/Files.vue";
import Search from "@/view/Layout/SideBar/Search.vue";
import Marks from "@/view/Layout/SideBar/Marks.vue";
import Tags from "@/view/Layout/SideBar/Tags.vue";
import Settings from "@/view/Setting/Index.vue";

Vue.use(Router);

export const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Index,
      children: [
        {
          path: "/files",
          name: "files",
          component: Files,
        },
        {
          path: "/search",
          name: "search",
          component: Search,
        },
        {
          path: "/bookmarks",
          name: "bookmarks",
          component: Marks,
        },
        {
          path: "/tags",
          name: "tags",
          component: Tags,
        },
        {
          path: "/settings",
          name: "settings",
          component: Settings,
        },
        {
          path: "/loading",
          name: "loading",
          component: Loading,
        },
        {
          path: "*",
          redirect: "/files",
        },
      ],
    },
  ],
});

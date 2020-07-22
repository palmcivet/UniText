import Vue from "vue";
import Router from "vue-router";

import Index from "@/views/containers/Index.vue";
import Loading from "@/views/animations/Loading.vue";
import Files from "@/views/containers/SideBar/Files.vue";
import Search from "@/views/containers/SideBar/Search.vue";
import Bookmarks from "@/views/containers/SideBar/Bookmarks.vue";
import Tags from "@/views/containers/SideBar/Tags.vue";
import Settings from "@/views/settings/Index.vue";

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
          component: Bookmarks,
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

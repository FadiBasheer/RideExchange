import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ListingDetails from "../pages/ListingDetails.vue";
import CreateListing from "../pages/CreateListing.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/listing/:id", component: ListingDetails },
  { path: "/create-listing", component: CreateListing },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
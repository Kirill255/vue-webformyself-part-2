import Vue from "vue";
import Router from "vue-router";
import AuthGuard from "./auth-guard";
import Home from "@/components/Home";
import Login from "@/components/Auth/Login";
import Registration from "@/components/Auth/Registration";
import AdList from "@/components/Ads/AdList";
import NewAd from "@/components/Ads/NewAd";
import Ad from "@/components/Ads/Ad";
import Orders from "@/components/User/Orders";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/list",
      name: "List",
      component: AdList,
      beforeEnter: AuthGuard
    },
    {
      path: "/new",
      name: "NewAd",
      component: NewAd,
      beforeEnter: AuthGuard
    },
    {
      path: "/ad/:id",
      name: "Ad",
      component: Ad,
      props: true
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/registration",
      name: "Registration",
      component: Registration
    },
    {
      path: "/orders",
      name: "Orders",
      component: Orders,
      beforeEnter: AuthGuard
    }
  ]
});

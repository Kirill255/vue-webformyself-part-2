import Vue from "vue";
import Vuex from "vuex";

import user from "./modules/user.js";
import ads from "./modules/ads.js";
import shared from "./modules/shared.js";
import orders from "./modules/orders.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    ads,
    shared,
    orders
  }
  // strict: process.env.NODE_ENV !== "production"
});

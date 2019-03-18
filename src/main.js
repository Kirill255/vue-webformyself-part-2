// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import firebaseConfig from "../firebaseConfig";

// если хотим переопределить цвета, то нужно подключить helper и при инициализации переопределить их
// import colors from "vuetify/es5/util/colors";

// если хотим подключить stylus, npm install stylus-loader stylus --save-dev и подключаем файл с нашими стилями
// import "./assets/stylus/main.styl";

// глобально подклбчили потому что он много где используется, хотя можно и локально в компонентах подключить
import BuyModalComponent from "@/components/Shared/BuyModal";

// import * as fb from "firebase";
// import firebase from "firebase";
// import firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Vuetify);

// переопределяем primary цвет, теперь везде где у нас использовался primary(синий), будет красный
// Vue.use(Vuetify, {
//   theme: {
//     primary: colors.red.darken1 // #E53935
//   }
// });

Vue.component("BuyModal", BuyModalComponent);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
  created() {
    // firebase.initializeApp({
    //   apiKey: "YOUR_API_KEY",
    //   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    //   databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    //   projectId: "YOUR_PROJECT_ID",
    //   storageBucket: "YOUR_PROJECT_ID.appspot.com",
    //   messagingSenderId: "YOUR_MESSAGING_SEND_ID"
    // });

    // вынес настройки в отдельный файл
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      // console.log("user ", user);
      if (user) {
        this.$store.dispatch("user/autoLoginUser", user);
      }
    });

    this.$store.dispatch("ads/fetchAds");
  }
});

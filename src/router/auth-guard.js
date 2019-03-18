import store from "../store";

export default function (to, from, next) {
  if (store.getters["user/user"]) {
    next();
  } else {
    next("/login?loginError=true");
  }
}

// import * as fb from "firebase";
// import firebase from "firebase";
// import firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/auth";

class User {
  constructor(id) {
    this.id = id;
  }
}

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    user(state) {
      return state.user;
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    // registerUser({ commit }, { email, password }) { // тут также деструктуризация и второго аргумента, payload.email и payload.password
    //   commit("shared/clearError", null, { root: true });
    //   commit("shared/setLoading", true, { root: true });
    //   firebase.auth().createUserWithEmailAndPassword(email, password) // регестрируемся в fb
    //     .then(({ user }) => { // приходит объект у которого есть поле user, у которого есть поле uid, это id пользователя, ну или res.user.uid
    //       console.log(user.uid);
    //       commit("setUser", new User(user.uid));
    //       commit("shared/setLoading", false, { root: true });
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       commit("shared/setLoading", false, { root: true });
    //       commit("shared/setError", err.message, { root: true });
    //     });
    // }

    // на async/await
    async registerUser({ commit }, { email, password }) { // тут также деструктуризация и второго аргумента, payload.email и payload.password
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      try {
        const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password); // регестрируемся в fb
        commit("setUser", new User(user.uid));
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    async loginUser({ commit }, { email, password }) {
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      try {
        const { user } = await firebase.auth().signInWithEmailAndPassword(email, password); // логинимся в fb
        commit("setUser", new User(user.uid));
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    autoLoginUser({ commit }, payload) {
      commit("setUser", new User(payload.uid));
    },

    logoutUser({ commit }) {
      firebase.auth().signOut();
      commit("setUser", null);
    },
    // github auth
    async signWithGithub({ commit }) {
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      const provider = new firebase.auth.GithubAuthProvider();
      try {
        const { user, credential } = await firebase.auth().signInWithPopup(provider);

        let token = null;
        if (credential) {
          token = credential.accessToken;
        }
        console.log(token);
        console.log(user);
        // console.log(user.email);
        // console.log(user.photoURL);

        // при регистрации через провайдеров, почему-то работает и без этой мутации, но на всякий случай оставил, мало ли где-то проявится баг
        commit("setUser", new User(user.uid));
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },
    // google auth
    async signWithGoogle({ commit }) {
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const { user, credential } = await firebase.auth().signInWithPopup(provider);

        let token = null;
        if (credential) {
          token = credential.accessToken;
        }
        console.log(token);
        console.log(user);
        // console.log(user.email);
        // console.log(user.photoURL);

        // при регистрации через провайдеров, почему-то работает и без этой мутации, но на всякий случай оставил, мало ли где-то проявится баг
        commit("setUser", new User(user.uid));
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    }
  }
};

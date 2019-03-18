// import * as fb from "firebase";
// import firebase from "firebase";
// import firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/database";
// import "firebase/storage";

class Order {
  constructor(name, phone, adId, done = false, id = null) {
    this.name = name;
    this.phone = phone;
    this.adId = adId;
    this.done = done;
    this.id = id;
  }
}

export default {
  namespaced: true,
  state: {
    orders: []
  },
  getters: {
    orders(state, getters) {
      return getters.undoneOrders.concat(getters.doneOrders); // будет выводить сначала не выполненные, а после выполненные
    },
    doneOrders(state) {
      return state.orders.filter(order => order.done);
    },
    undoneOrders(state) {
      return state.orders.filter(order => !order.done);
    }
  },
  mutations: {
    loadOrders(state, payload) {
      state.orders = payload;
    },
    removeOrder(state, payload) {
      const orderId = payload;
      state.orders = state.orders.filter(order => order.id !== orderId);
    }
  },
  actions: {
    // async createOrder({ commit }, payload) {
    //   await new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve();
    //     }, 4000);
    //   });
    // }

    async createOrder({ commit }, { name, phone, adId, ownerId }) {
      const order = new Order(name, phone, adId);
      commit("shared/clearError", null, { root: true });
      // сдесь мы не используем глобальный лоадинг, сдесь у нас есть локальный лоадинг внутри модального окна, что бы не перезагружалась страница

      try {
        // создаём таблицу и кладём в неё наш заказ, таблица создаётся по пути users/N7BKecrGx4WMq1WDmHleSt06Yl93/orders
        // (теперь в базе у нас уже две таблицы ads и users)
        // запись создаётся под id владельца объявления, тоесть вы что-то покупаете, и у владельца появляется заказ, а не у вас
        // грубо говоря, владельцу сообщается что его товар хотят купить (отправляются контакты: имя, телефон)
        await firebase.database().ref(`users/${ownerId}/orders`).push(order);
      } catch (err) {
        // console.log(err);
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    async fetchOrders({ commit, rootGetters }, payload) {
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      const resultOrders = [];

      try {
        // получаем все данные (все заказы) из базы из таблицы users с id текущего залогиненного пользователя, тоесть свои заказы
        // const userId = rootGetters["user/user"].id;
        // console.log(userId);
        // console.log(rootGetters["user/user"].id);
        // const fbVal = await firebase.database().ref(`users/${userId}/orders`).once("value");
        const fbVal = await firebase.database().ref(`users/${rootGetters["user/user"].id}/orders`).once("value"); // просто в одну строку
        const orders = fbVal.val(); // будет null, если нет заказов, поэтому это нужно обработать
        // console.log(orders);

        if (orders) { // если есть ли заказы
          Object.keys(orders).forEach(key => {
            const order = orders[key];

            resultOrders.push(
              new Order(
                order.name,
                order.phone,
                order.adId,
                order.done,
                key
              )
            );
          });
        }

        commit("loadOrders", resultOrders);
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    async markOrderDone({ commit, rootGetters }, id) { // id - это payload
      commit("shared/clearError", null, { root: true });

      try {
        await firebase.database().ref(`users/${rootGetters["user/user"].id}/orders`).child(id).update({
          done: true
        });
      } catch (err) {
        // console.log(err);
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    async removeOrder({ commit, rootGetters }, id) {
      commit("shared/clearError", null, { root: true });

      try {
        await firebase.database().ref(`users/${rootGetters["user/user"].id}/orders`).child(id).remove();
        commit("removeOrder", id);
      } catch (err) {
        // console.log(err);
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    }
  }
};

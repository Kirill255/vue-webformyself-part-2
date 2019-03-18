// import * as fb from "firebase";
// import firebase from "firebase";
// import firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

class Ad {
  constructor(title, description, ownerId, imageSrc = "", promo = false, id = null) {
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.imageSrc = imageSrc;
    this.promo = promo;
    this.id = id;
  }
}

export default {
  namespaced: true,
  state: {
    // это временные данные, потом мы будет использовать firebase
    // ads: [
    //   {
    //     id: "123",
    //     title: "First Ad",
    //     description: "Hello i'am description",
    //     promo: false,
    //     imageSrc: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg"
    //   },
    //   {
    //     id: "1234",
    //     title: "Second Ad",
    //     description: "Hello i'am description",
    //     promo: true,
    //     imageSrc: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg"
    //   },
    //   {
    //     id: "12345",
    //     title: "Third Ad",
    //     description: "Hello i'am description",
    //     promo: true,
    //     imageSrc: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
    //   }
    // ]
    ads: []
  },
  getters: {
    ads(state) {
      return state.ads;
    },
    promoAds(state) {
      return state.ads.filter(ad => ad.promo);
    },
    myAds(state, _, rootGetters) {
      // console.log(rootGetters);
      // return state.ads; // выводили всё, теперь выводим только свои объявления
      // является ли текущий залогиненный пользователь владельцем объявлений
      return state.ads.filter(ad => ad.ownerId === rootGetters.user.user.id);
    },
    adById(state) {
      return adId => {
        return state.ads.find(ad => ad.id === adId);
      };
    }
  },
  mutations: {
    createAd(state, payload) {
      state.ads.push(payload);
    },
    loadAds(state, payload) {
      state.ads = payload;
    },
    updateAd(state, { title, description, id }) {
      const ad = state.ads.find(ad => ad.id === id);

      ad.title = title;
      ad.description = description;
    }
  },
  actions: {
    // createAd({ commit }, payload) {
    //   payload.id = String(Math.ceil(Math.random() * 10));
    //   console.log("payload", payload);
    //   commit("createAd", payload);
    // }

    async createAd({ commit, rootGetters }, payload) {
      // console.log("payload", payload);
      // console.log(rootGetters);
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      const image = payload.image; // наш файл(картинка)
      // console.log(image);
      // console.log(image.name);
      const imageExt = image.name.slice(image.name.lastIndexOf(".")); // car.jpg --> .jpg (с точкой)

      try {
        const newAd = new Ad(
          payload.title,
          payload.description,
          rootGetters["user/user"].id,
          "", // теперь мы не передаём payload.imageSrc, у нас там целый файл, а не url как раньше
          payload.promo
        );
        // суть такая, мы в качестве imageSrc сначала передаём "", как бы резервируем место для этого параметра, но на данный момент у нас просто ещё нет ссылки на изображение, у нас есть только целый файл(картинка)
        // после мы закинем эту картинку в firebase.storage и уже там получим ссылку на нашу загруженную в storage картинку
        // и дальше просто обновим наш объект (наше объявление(ad)), обновим у него это поле imageSrc с "" на полученную нами ссылку
        // console.log("newAd ", newAd);

        const ad = await firebase.database().ref("ads").push(newAd); // пушим новый объект в таблицу ads
        // в базе создаётся таблица(если её ещё нет), и засовывается туда наш новый объект
        // console.log(ad);

        const fileData = await firebase.storage().ref(`ads/${ad.key}${imageExt}`).put(image); // кидаем картинку в storage
        // в storage создаётся картинка в папке ads/имя_файла_это_наш_ключ.ext_name (ads/-LSypcogrkglPU6ccVBz.jpg)
        // console.log("fileData ", fileData);

        // const imageSrc = fileData.metadata.downloadURLs[0]; // ссылка на нашу картинку из storage (deprecated) https://stackoverflow.com/questions/50657758/how-to-get-url-of-uploaded-image-in-firebase-5-0-4

        const imageSrc = await fileData.ref.getDownloadURL(); // ссылка на нашу картинку из storage
        // console.log("imageSrc ", imageSrc);

        await firebase.database().ref("ads").child(ad.key).update({ // обновляем запись в базе
          imageSrc // imageSrc: imageSrc, es6 сократили
        });

        commit("createAd", {
          ...newAd, // сейчас у нас id = null (по умолчанию),
          id: ad.key, // и мы присваиваем id = ad.key
          // imageSrc: imageSrc // перепресваиваем imageSrc, была у нас там "", а присваиваем ссылку из storage
          imageSrc // просто сократили, es6
        });
        // грубо говоря, мы добавили в наш объект 'newAd' пару полей
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    async fetchAds({ commit }) {
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      const resultAds = [];

      try {
        const fbVal = await firebase.database().ref("ads").once("value"); // получаем все данные из базы из таблицы ads
        const ads = fbVal.val(); // грубо говоря парсим данные, это спец. метод в firebase
        // console.log(ads);

        if (ads) {
          Object.keys(ads).forEach(key => {
            const ad = ads[key];
            // console.log("ad ", ad);
            resultAds.push(
              new Ad(
                ad.title,
                ad.description,
                ad.ownerId,
                ad.imageSrc,
                ad.promo,
                key
              )
            );
          });
        }

        commit("loadAds", resultAds);
        commit("shared/setLoading", false, { root: true });
      } catch (err) {
        // console.log(err);
        commit("shared/setLoading", false, { root: true });
        commit("shared/setError", err.message, { root: true });
        throw new Error(err);
      }
    },

    async updateAd({ commit }, { title, description, id }) {
      commit("shared/clearError", null, { root: true });
      commit("shared/setLoading", true, { root: true });

      try {
        await firebase.database().ref("ads").child(id).update({
          title,
          description
        });

        commit("updateAd", { title, description, id });
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

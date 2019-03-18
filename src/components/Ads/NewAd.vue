<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12
              sm6
              offset-sm3>
        <h1 class="text--secondary mb-3">Create New Ad</h1>
        <v-form class="mb-3"
                ref="form"
                v-model="valid"
                validation>
          <v-text-field name="title"
                        label="Ad title"
                        type="text"
                        :rules="[v => !!v || 'Title is requared']"
                        v-model="title"
                        required></v-text-field>
          <v-textarea name="description"
                      label="Ad description"
                      no-resize
                      :rules="[v => !!v || 'Description is requared']"
                      v-model="description"
                      required></v-textarea>
        </v-form>

        <v-layout row
                  class="mb-3">
          <v-flex xs12>
            <v-btn class="warning"
                   @click="triggerUploud">
              Upload
              <v-icon right
                      dark>cloud_upload</v-icon>
            </v-btn>

            <input ref="fileInput"
                   type="file"
                   style="display: none;"
                   accept="image/*"
                   @change="onFileChange">

          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <img v-if="imageSrc"
                 :src="imageSrc"
                 height="100">
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <v-switch label="Add to promo?"
                      color="primary"
                      v-model="promo"></v-switch>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <v-spacer></v-spacer>
            <v-btn color="success"
                   :loading="loading"
                   :disabled="!valid || !image || loading"
                   @click="createNewAd">Create ad</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NewAd",
  data() {
    return {
      valid: false,
      title: "",
      description: "",
      promo: false,
      image: null,
      imageSrc: ""
    };
  },
  computed: {
    ...mapGetters("shared", ["loading"])
  },
  methods: {
    ...mapActions("ads", ["createAd"]),
    createNewAd() {
      if (this.$refs.form.validate() && this.image) {
        const ad = {
          title: this.title,
          description: this.description,
          image: this.image,
          promo: this.promo
        };
        // console.log("ad ", ad);

        this.createAd(ad)
          .then(() => {
            this.$router.push("/list"); // в случае успеха
          })
          // .catch(err => console.log(err));
          .catch(() => {}); // чтобы в консоль не выводились
      }
    },
    triggerUploud() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      // console.log(file);
      // file without ext
      if (file.name.lastIndexOf(".") <= 0) {
        return alert("Невалидный файл");
      }
      // type: "image/jpeg", "image/png", "image/webp"
      if (file.type.indexOf("image/") < 0) {
        return alert("Нужна картинка");
      }

      const reader = new FileReader();

      reader.onload = e => {
        this.imageSrc = reader.result;
      };
      // or
      // reader.addEventListener("load", e => {
      //   this.imageSrc = reader.result;
      // });

      reader.readAsDataURL(file);
      this.image = file;
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
  <v-container fluid
               fill-height>
    <v-layout align-center
              justify-center>
      <v-flex xs12
              sm8
              md6>
        <v-card class="elevation-12">
          <v-toolbar dark
                     color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
            <!--  -->
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn slot="activator"
                     icon
                     large
                     color="white"
                     light
                     @click="onSignWithGithub">
                <v-icon large>fab fa-github</v-icon>
              </v-btn>
              <span>Github</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn slot="activator"
                     icon
                     large
                     color="white"
                     @click="onSignWithGoogle">
                <v-icon large
                        color="red darken-2">fab fa-google</v-icon>
              </v-btn>
              <span>Google</span>
            </v-tooltip>
            <!--  -->
          </v-toolbar>
          <v-card-text>
            <v-form ref="form"
                    v-model="valid"
                    validation>
              <v-text-field prepend-icon="person"
                            name="email"
                            label="Email"
                            type="text"
                            :rules="emailRules"
                            v-model="email"></v-text-field>
              <v-text-field id="password"
                            prepend-icon="lock"
                            name="password"
                            label="Password"
                            type="password"
                            :counter="6"
                            :rules="passwordRules"
                            v-model="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   :loading="loading"
                   :disabled="!valid || loading"
                   @click="submit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      valid: "",
      emailRules: [
        v => !!v || "E-mail is required",
        // v => /.+@.+/.test(v) || "E-mail must be valid", // простая регулярка
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length >= 6) ||
          "Password must be equal or more than 6 characters"
      ]
    };
  },
  computed: {
    ...mapGetters("shared", ["loading"])
  },
  methods: {
    ...mapActions("user", ["loginUser", "signWithGithub", "signWithGoogle"]),
    ...mapActions("shared", ["setError"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        };
        // console.log(user);
        this.loginUser(user)
          .then(() => {
            this.$router.push("/"); // в случае успеха логина
          })
          // .catch(err => console.log(err));
          .catch(() => {}); // чтобы в консоль не выводились
      }
    },
    onSignWithGithub() {
      this.signWithGithub()
        .then(() => {
          this.$router.push("/"); // в случае успеха логина
        })
        // .catch(err => console.log(err));
        .catch(() => {}); // чтобы в консоль не выводились;
    },
    onSignWithGoogle() {
      this.signWithGoogle()
        .then(() => {
          this.$router.push("/"); // в случае успеха логина
        })
        // .catch(err => console.log(err));
        .catch(() => {}); // чтобы в консоль не выводились;
    }
  },
  created() {
    if (this.$route.query["loginError"]) {
      this.setError("Please log in to access this page.");
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

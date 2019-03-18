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
            <v-toolbar-title>Registration form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form"
                    v-model="valid"
                    lazy-validation>
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
              <v-text-field id="confirmPassword"
                            prepend-icon="lock"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            :counter="6"
                            :rules="confirmPasswordRules"
                            v-model="confirmPassword"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   :loading="loading"
                   :disabled="!valid || loading"
                   @click="submit">Registration</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Registration",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
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
      ],
      confirmPasswordRules: [
        v => !!v || "Password is required",
        v => (v && v === this.password) || "Password should match"
      ]
    };
  },
  computed: {
    ...mapGetters("shared", ["loading"])
  },
  methods: {
    ...mapActions("user", ["registerUser"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        };
        // console.log(user);
        this.registerUser(user)
          .then(() => {
            this.$router.push("/"); // в случае успеха регистрации
          })
          // .catch(err => console.log(err));
          .catch(() => {}); // чтобы в консоль не выводились
      }
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

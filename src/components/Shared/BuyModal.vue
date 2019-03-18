<template>
  <div>
    <v-dialog v-model="dialog"
              width="400px">

      <v-btn flat
             class="primary"
             slot="activator">Buy</v-btn>

      <v-card>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <v-card-title>
                <h1 class="text--primary">Do you wan't to buy it?</h1>
              </v-card-title>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row>
            <v-flex xs12>
              <v-card-text>

                <v-form class="mb-3"
                        ref="form"
                        v-model="valid"
                        validation>

                  <v-text-field name="name"
                                label="Your name"
                                type="text"
                                :rules="[v => !!v || 'Name is requared']"
                                v-model="name"
                                required></v-text-field>

                  <v-text-field name="phone"
                                label="Your phone"
                                type="text"
                                :rules="[v => !!v || 'Phone is requared']"
                                v-model="phone"
                                required></v-text-field>

                </v-form>

              </v-card-text>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row>
            <v-flex xs12>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat
                       :disabled="localLoading"
                       @click="onCancel">Close</v-btn>
                <v-btn class="success"
                       :disabled="!valid || localLoading"
                       :loading="localLoading"
                       @click="onSave">Buy it!</v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "BuyModal",
  props: ["ad"],
  data() {
    return {
      valid: false,
      dialog: false,
      name: "",
      phone: "",
      localLoading: false
    };
  },
  methods: {
    ...mapActions("orders", ["createOrder"]),
    onCancel() {
      this.name = "";
      this.phone = "";
      this.dialog = false;
    },
    onSave() {
      if (this.$refs.form.validate()) {
        this.localLoading = true;

        this.createOrder({
          name: this.name,
          phone: this.phone,
          adId: this.ad.id,
          ownerId: this.ad.ownerId
        }).finally(() => {
          this.name = "";
          this.phone = "";
          this.localLoading = false;
          this.dialog = false;
        });
      }
    }
  }
};
</script>

<style scoped>
</style>

<template>
  <div>
    <v-dialog v-model="dialog"
              width="400px">

      <v-btn flat
             class="warning"
             slot="activator">Edit</v-btn>

      <v-card>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <v-card-title>
                <h1 class="text--primary">Edit Ad</h1>
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

                  <v-text-field name="title"
                                label="Title"
                                type="text"
                                :rules="[v => !!v || 'Title is requared']"
                                v-model="editTitle"
                                required></v-text-field>

                  <v-textarea name="description"
                              label="Description"
                              no-resize
                              :rules="[v => !!v || 'Description is requared']"
                              v-model="editDescription"
                              required></v-textarea>

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
                       @click="onCancel">Cancel</v-btn>
                <v-btn class="success"
                       :disabled="!valid"
                       @click="onSave">Save</v-btn>
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
  name: "EditAdModal",
  props: ["ad"],
  data() {
    return {
      valid: false,
      dialog: false,
      editTitle: this.ad.title,
      editDescription: this.ad.description
    };
  },
  methods: {
    ...mapActions("ads", ["updateAd"]),
    onCancel() {
      this.editTitle = this.ad.title;
      this.editDescription = this.ad.description;
      this.dialog = false;
    },
    onSave() {
      if (this.$refs.form.validate()) {
        this.updateAd({
          title: this.editTitle,
          description: this.editDescription,
          id: this.ad.id
        });
        this.dialog = false;
      }
    }
  }
};
</script>

<style scoped>
</style>

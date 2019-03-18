<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>Ad</h1>

        <v-card v-if="!loading">
          <v-img height="300px"
                 :src="ad.imageSrc">
          </v-img>

          <v-card-text>
            <h1 class="text--primary">{{ad.title}}</h1>
            <p>{{ad.description}}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <EditAdModal v-if="isOwner"
                         :ad="ad"></EditAdModal>

            <!-- Перенесли внутрь компонента EditAdModal -->
            <!-- <v-btn flat
                   class="warning"
                   :to="'/edit/' + ad.id">Edit</v-btn> -->

            <BuyModal :ad="ad"></BuyModal>

            <!-- Перенесли внутрь BuyModal, компонент подключен глобально -->
            <!-- <v-btn class="primary"
                     raised>Buy</v-btn> -->

          </v-card-actions>
        </v-card>
        <div v-else
             class="text-xs-center pt-5">
          <v-progress-circular :size="100"
                               :width="4"
                               color="purple"
                               indeterminate></v-progress-circular>
        </div>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EditAdModal from "./EditAdModal";
import { mapGetters } from "vuex";

export default {
  name: "Ad",
  components: { EditAdModal },
  props: ["id"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("ads", ["adById"]),
    ...mapGetters("shared", ["loading"]),
    ...mapGetters("user", ["user"]),
    ad() {
      // return this.adById(this.id);
      const id = this.id;
      return this.adById(id);
    },
    isOwner() {
      // return this.ad.ownerId === this.user.id;

      // проверка нужна, потому что пользователь может быть вообще незалогинен, тоесть user = null
      if (this.user) {
        return this.ad.ownerId === this.user.id;
      }
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

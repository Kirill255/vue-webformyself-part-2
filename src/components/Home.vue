<template>
  <div v-if="!loading">
    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-carousel>
            <v-carousel-item v-for="ad in promoAds"
                             :key="ad.id"
                             :src="ad.imageSrc">
              <div class="carousel-link">
                <v-btn class="error"
                       :to="'/ad/' + ad.id">{{ ad.title }}</v-btn>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container grid-list-lg>
      <v-layout row
                wrap>
        <v-flex xs12
                sm6
                md4
                v-for="ad in ads"
                :key="ad.id">
          <v-card>
            <v-img :src="ad.imageSrc"
                   aspect-ratio="2.75"></v-img>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ad.title}}</h3>
                <!-- Первые 30 символов описания, в принципе title тоже можно ограничить -->
                <div>{{ad.description.substring(0, 30)}}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat
                     :to="'/ad/' + ad.id">Open</v-btn>

              <BuyModal :ad="ad"></BuyModal>

              <!-- Перенесли внутрь BuyModal, компонент подключен глобально -->
              <!-- <v-btn class="primary"
                     raised>Buy</v-btn> -->

            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
  <div v-else>
    <v-container>
      <v-layout row>
        <v-flex xs12
                class="text-xs-center pt-5">
          <v-progress-circular :size="100"
                               :width="4"
                               color="purple"
                               indeterminate></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("ads", ["ads", "promoAds"]),
    ...mapGetters("shared", ["loading"])
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>
.carousel-link {
  position: absolute;
  bottom: 50px;
  left: 50%;
  background: rgba(0, 0, 0, 0.5);
  transform: translate(-50%, 0);
  padding: 5px 15px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
</style>


<!--  Use stylus -->
<!--
<style lang="stylus" scoped>
$bg-color = rgba(0, 0, 0, 0.5);

.carousel-link
  position: absolute
  bottom: 50px
  left: 50%
  background: $bg-color
  transform: translate(-50%, 0)
  padding: 5px 15px
  border-top-right-radius: 5px
  border-top-left-radius: 5p
</style>
-->

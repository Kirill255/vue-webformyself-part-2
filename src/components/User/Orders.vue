<template>
  <v-container fluid>
    <v-layout row>
      <v-flex v-if="!loading && orders.length !== 0"
              xs12
              sm6
              offset-sm3>
        <h1 class="text--secondary mb-3">Orders</h1>
        <v-list two-line
                subheader>
          <v-list-tile avatar
                       v-for="order in orders"
                       :key="order.id">
            <v-list-tile-action>
              <v-checkbox color="success"
                          :input-value="order.done"
                          @click="markDone(order)"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{order.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{order.phone}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn class="primary"
                     :to="'/ad/' + order.adId">Open</v-btn>
            </v-list-tile-action>

            <v-list-tile-action>
              <v-btn class="error"
                     :disabled="localLoading"
                     :loading="localLoading"
                     @click="onRemoveOrder(order)">Delete</v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex v-else-if="!loading && orders.length === 0"
              xs12
              class="text-xs-center">
        <h1 class="text--primary">You have no orders!</h1>
      </v-flex>
      <v-flex v-else
              xs12
              class="text-xs-center pt-5">

        <v-progress-circular :size="100"
                             :width="4"
                             color="purple"
                             indeterminate></v-progress-circular>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      // orders: [
      //   {
      //     id: "fds3",
      //     name: "Vladilen",
      //     phone: "8-921-121-12-12",
      //     adId: "123",
      //     done: false
      //   }
      // ]
      localLoading: false
    };
  },
  computed: {
    ...mapGetters("shared", ["loading"]),
    ...mapGetters("orders", ["orders"])
  },
  methods: {
    ...mapActions("orders", ["fetchOrders", "markOrderDone", "removeOrder"]),
    markDone(order) {
      // console.log(order.done);
      // order.done = true; // почему-то не работает как ожидалось, чекбокс не должен сниматься, он всегда по идее true, но нет!
      // order.done = !order.done; // поэтому временно использую этот вариант, возможно что-то с реализацией самого vuetify
      // console.log(order.done);

      this.markOrderDone(order.id)
        .then(() => {
          order.done = true;
        })
        // .catch(err => console.log(err));
        .catch(() => {});
    },
    onRemoveOrder(order) {
      this.localLoading = true;
      this.removeOrder(order.id)
        .then(() => {
          this.localLoading = false;
        })
        // .catch(err => console.log(err));
        .catch(() => {});
    }
  },
  created() {
    this.fetchOrders();
  }
};
</script>

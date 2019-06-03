import Vue from "vue";
import App from "./App.vue";
import AlgoPlugins from "./utils/algo.js";
import StorePlugins from "./utils/store.js";

Vue.use(AlgoPlugins);
Vue.use(StorePlugins);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

import Vue from "vue";
import App from "./App.vue";
import AlgoPlugins from "./algo.js";

Vue.use(AlgoPlugins);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

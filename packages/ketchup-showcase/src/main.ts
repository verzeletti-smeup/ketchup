import Vue from 'vue';
import App from './App.vue';

import KetchupVue from 'ketchup-vue';

import { defineCustomElements } from 'ketchup/dist/loader';
defineCustomElements(window);

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/[ketchup|app]-\w*/];

// css
import '@mdi/font/css/materialdesignicons.min.css';

Vue.use(KetchupVue);

const instance = new Vue({
    render: (h) => h(App),
}).$mount('#app');
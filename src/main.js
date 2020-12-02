import Vue from 'vue'
import App from './App.vue'
import './components/js/component'
import router from './components/router/index'
import AppupHttp from '@appup/appup-components-dynamic/plugins/appup-http'; // This.start
import VeeValidate from 'vee-validate'; // Form validate
import { Workflow } from '@appup/components/src/mixins/workflow'; // Handlers
import BootstrapVue from 'bootstrap-vue';
import FullCalendar from 'vue-full-calendar';
import 'fullcalendar/dist/fullcalendar.min.css';

Vue.use(AppupHttp);
Vue.use(VeeValidate);
Vue.mixin(Workflow);
Vue.use(FullCalendar);
Vue.use(BootstrapVue);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

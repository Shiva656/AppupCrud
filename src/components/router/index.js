import Vue from 'vue'
import Crud from '../crud/Crud';
import CrudJson from '../js/crud';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/view', component: Crud, props: CrudJson }
];
const router = new VueRouter({
  routes
});
export default router;

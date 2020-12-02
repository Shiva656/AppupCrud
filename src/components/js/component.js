/* eslint-disable no-unused-vars */
import Vue from 'vue';
import modal from '../Appup Components/appup-modal'
// Import AppupControls from '@appup/components';
// Import Dynamic from '@appup/appup-components-dynamic';
import { genericHandlers } from '../../genericshandlers';
import crudJson from './crud'
import moment from 'moment';
import 'moment-timezone';
// Import AcExcelTable from '@appup/appup-components-dynamic/components/ac-excel-table';
window.moment = moment;
const Dynamic = {};
const AppupControls = {};
// Vue.component('appup-modal', AppupControls['appup-modal']);
window.Vue = Vue;

// Handlers
const workflowJSON = []
genericHandlers.forEach(handler => {
  if (!(window.workflowJSON || []).includes(handler)) {
    workflowJSON.push(handler);
  }
});
window.WorkflowJSON = [...(window.WorkflowJSON || []), ...workflowJSON];
// Modal appending to dom
const template = '<appup-modal></appup-modal>';
window.modalData = {};
window.modalData.title = 'Hello there';
var vm = new Vue({
  template: template,
  propsData: window.modalData,
  data: window.modalData,
});
vm.$mount('#modals');

const CrudJson = {};
crudJson.blocks.forEach(z => {
  const i = z.split('v-')[1][0].toUpperCase() + z.split('v-')[1].substring(1, z.length - 1);
  // eslint-disable-next-line no-template-curly-in-string
  CrudJson[z] = () => import(/* webpackChunkName: "c-b" */ '../view/Crud-' + i);
});
for (var keys in crudJson.templateParams) {
  console.log('keys', keys);
  if (crudJson.templateParams.ad) {
    CrudJson.AddButton = () => import(/* webpackChunkName: "c-b" */ '../view/Add-Button');
  }
  if (crudJson.templateParams.s) {
    CrudJson.Search = () => import(/* webpackChunkName: "c-b" */ '../view/Search');
  }
  if (crudJson.templateParams.f) {
    CrudJson.CrudSimpleFilter = () => import(/* webpackChunkName: "c-b" */ '../view/Crud-Simple-Filter');
  }
}
// For modal in crud component
CrudJson.CrudModal = () => import(/* webpackChunkName: "c-b" */ '../view/View-Modal');
CrudJson.CrudBulk = () => import(/* webpackChunkName: "c-b" */ '../view/Crud-Bulk');
console.log('componentObj', CrudJson);
console.log('appup', Dynamic);
console.log('AppupControls', AppupControls);
export { AppupControls, Dynamic, CrudJson }

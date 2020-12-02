<template>
  <div>
    <div class="d-flex justify-content-between header-body mb-4">
      <div>
        <h1 class="header-title mb-2">{{ entity }}</h1>
        <h6 class="header-pretitle mb-0">header-pretitle</h6>
      </div>
      <span class="d-flex"
        >  <CrudSimpleFilter :templateParams="templateParams"  v-if='templateParams.f==="t"' :entity="entity" :fields="fields"  @filter_form="filterForm">

        </CrudSimpleFilter>

        <Search :column="searchColumn" v-if="templateParams.s === 't'" :entity="entity" @search_value="filterSearch"></Search>
        <div>
          <b-button-group class="ml-3 nav d-inline-flex">
          <b-button v-b-tooltip.hover :id="item + '-id'" @click="toggle(item)" v-for="item in blocks" :v-if="blocks.length > 1" v-bind:key="item" variant="white">
            <i class="far fa-bars" aria-hidden="true" v-if="item == 'v-table' || item == 'v-grouped-table' || item == 'v-grouped' || item == 'v-sheet' || item == 'v-accordion-table'"></i>
            <i class="fas fa-th-large" aria-hidden="true" v-if="item == 'v-cards' || item == 'v-grouped-card' || item == 'v-accordion-card'"></i>
            <i class="fa fa-calendar" aria-hidden="true" v-if="item == 'v-calendar'"></i>
            <i class="far fa-th" v-if="item == 'v-kanban'"></i>
          </b-button>
          </b-button-group>
        </div>
        <AddButton v-bind="{ templateParams, entity }" @add_click="openModal" v-if="templateParams.ad === 't'"></AddButton>
      </span>
    </div>
    <CrudModal modal_id="crud-modal" v-bind="{ callbacks, templateParams, entity }" :form_key="formKey" :block_params="blockParams" :dynamic_label="dynamicLabel" :edit_value="passId" :re_renderkey="renderkey"> </CrudModal>
    <div>
      <CrudBulk v-if="count.length > 0" v-bind="{ componentRef, count, templateParams, entity, callbacks, bulkOptions }"></CrudBulk>

      <component
        ref="view_component_ref"
        @option_select="optionSelected"
        @check_value="bulkSelected"
        check_value
        :is="componentName"
        v-bind="{
          finalCondition,
          componentName,
          collection,
          blockParams: componentParams,
          templateParams,
          entity,
          callbacks,
        }"
      >
      </component>
    </div>
  </div>
</template>
<script>
import { CrudJson } from '../js/component';
import { getDisplayableColumns, deleteDataUrl, getData } from '../js/global';
export default {
  components: {
    ...CrudJson,
  },
  props: ['blocks', 'blockDetails', 'templateParams', 'props', 'entity', 'fields', 'callbacks', 'dropdown', 'bulkOptions'],
  mounted () {
    console.log('crud', CrudJson);
    this.filter();
    this.componentName = this.blocks[0];
    this.componentRef = this.blocks[0] + '-ref';
    this.componentParams = this.blockDetails[0].blockParams;
    this.$set(this.collection, 'dropdownOptions', this.dropdown);
    getDisplayableColumns(this.entity, this.fields, '_v').then(res => {
      this.$set(this.collection, 'columns', res);
    });
    deleteDataUrl().then(res => {
      this.deleteUrl = res;
    });
    getData(this.b_entity).then(res => {
      this.getUrl = res;
    });
    window.cv_block_ref = this;
  },
  data () {
    return {
      componentName: '',
      dynamicLabel: '',
      passId: '',
      deleteUrl: '',
      searchKey: '',
      getUrl: '',
      verticalKey: '',
      filterKey: '',
      count: 0,
      searchColumn: this.templateParams.sk,
      componentRef: '',
      renderkey: 0,
      formKey: {
        componentName: 'c-f',
        formFields: this.fields,
      },
      componentParams: {},
      finalCondition: {},
      collection: {
        loadingImage: '',
        dropdownOptions: [],
        buttonOptions: {
          icon: 'fe fe-more-vertical text-muted',
          variant: 'bg-transparent p-0',
          size: 'lg',
          right: true,
        },
        columns: [],
      },
    };
  },
  methods: {
    toggle: function (value) {
      this.componentName = value;
      this.componentRef = value + '-ref';
      this.componentParams = this.blockDetails.find(item => {
        return item.block === value;
      }).blockParams;
      this.bulkHide();
    },
    /*
     * When we kepup or click on enter after entering the text in the search field.
     */
    filterSearch: function (value) {
      this.searchKey = value;
      this.filter();
    },
    /*
     * When we click on horizontal filter
     */
    filterForm: function (value) {
      this.filterKey = value;
      this.filter();
    },
    /** It will do filter on collection */
    filter: function () {
      console.log('filter')
      const defaultObj = {};
      const obj = {};
      defaultObj.l = this.templateParams.lm;
      defaultObj.offset = 0;
      if (this.templateParams.ob !== 'f') {
        defaultObj.order_by = this.templateParams.ob ? this.templateParams.ob : 'created_date desc';
      }
      var key = '';
      if (this.filterKey || this.verticalKey) {
        if (this.filterKey && this.verticalKey) {
          obj.horizontalFilter = this.filterKey;
          obj.verticalFilter = this.verticalKey;
          key = '(' + this.filterKey + ' or ' + this.verticalKey + ')';
        } else {
          if (this.filterKey) {
            key = this.filterKey;
            obj.horizontalFilter = this.filterKey;
          } else {
            key = this.verticalKey;
            obj.verticalFilter = this.verticalKey;
          }
        }
      }
      if (this.searchKey) {
        obj.search = this.searchKey;
        key = key ? key + ' and ' + this.searchKey : this.searchKey;
      }
      if (key) {
        defaultObj.where = key;
      }
      this.finalCondition = defaultObj;
      // This.bulkHide();
    },
    /*
     *  When we check a checkbox in the table bulkSelected method will be called.
     */
    bulkSelected: function (items) {
      /* To fetch this id's in handler in order to avoid $parent */
      console.log(items);
      this.count = items;
    },
    /** It opens the tempates or new form based on condition */
    openModal: function (key) {
      this.viewEntity = this.entity;
      if (this.templateParams.pt === 't') {
        this.$bvModal.show('modal-tab');
      } else {
        this.newFormModal(key);
      }
    },
    /** It opens  new form in modal */
    newFormModal: function (key) {
      if (this.templateParams.k === 'slideout') {
        this.rowClicked();
      } else {
        this.formKey.componentName = this.templateParams.nbn ? this.templateParams.nbn : 'c-f';
        this.formKey.option = {};
        if (this.templateParams.ad.split(':')[1]) {
          this.formKey.option.size = this.templateParams.ad.split(':')[1].split(';')[0];
        }
        this.formKey.formFields = key ? key.fields : this.fields;
        this.passId = '';
        this.$set(this.formKey, 'entity', this.entity);
        if (key) {
          this.formKey.entity = key.entity;
        }
        this.renderkey = this.renderkey === 0 ? 1 : 0;
        this.$bvModal.show('crud-modal');
      }
    },
    /** It opens the modal in edit mode */
    editModal: function (value, ptFieldsKey, option) {
      this.formKey.componentName = this.templateParams.nbn ? this.templateParams.nbn : 'c-f';
      this.formKey.formFields = this.fields;
      this.$set(this.formKey, 'option', option);
      this.passId = value;
      this.renderkey = this.renderkey === 0 ? 1 : 0;
      this.$bvModal.show('crud-modal');
      this.viewEntity = this.entity;
    },

    /** It will be invoked from handler,and call function based on type */
    updateUi: function (type, item) {
      if (type === 'insert') {
        this.insertRow(item);
      } else if (type === 'update') {
        this.updateRow(item);
      } else if (type === 'delete') {
        this.deleteRow(item);
      }
    },
    /** It will insert the new item in collections */
    insertRow: function (item) {
      if (this.componentRef === 'v-cards-ref' || this.componentRef === 'v-table-ref') {
        const obj = Array.isArray(item) ? item : [item];
        obj.forEach(res => {
          this.$refs.view_component_ref.$refs[this.componentRef].actual_data.unshift(res);
          if (this.$refs.view_component_ref.$refs[this.componentRef].actual_data.length > (this.templateParams.lm || 10)) {
            this.$refs.view_component_ref.$refs[this.componentRef].actual_data.pop();
          }
        });
      } else if (this.componentRef === 'v-calendar-ref') {
        this.$refs.view_component_ref.$refs[this.componentRef].events.push(item);
      } else if (this.componentRef === 'v-kanban-ref') {
        var stages = this.$refs.view_component_ref.$refs['v-kanban-ref'].limitedStages;
        const obj = Array.isArray(item) ? item : [item];
        obj.forEach(newData => {
          var index = stages.findIndex(stage => {
            return stage.id === newData[this.componentParams.ik];
          });
          if (index >= 0) {
            this.$refs.view_component_ref.$refs['v-kanban-ref'].$refs.acCollections[index].data.unshift(newData);
          }
        });
      } else if (this.componentRef === 'v-grouped-ref') {
        const itemObj = Array.isArray(item) ? item : [item];
        var obj = JSON.parse(JSON.stringify(this.$refs.view_component_ref.$refs[this.componentRef].stages));
        itemObj.forEach(i => {
          let count = 1;
          obj.forEach(j => {
            if (obj[this.componentParams.sk] === i[this.componentParams.ik]) {
              count = 0;
              const index = j.actual.findIndex(z => {
                return z.id === i.id;
              });
              j.actual[index] = i;
            }
          });
          const z = {};
          // Creating an object
          if (count) {
            z.total_count = 1;
            z.count_key = 'count';
            z.id = i[this.componentParams.ik];
            z.actual = [];
            z.name = 'sss';
            z.actual.push(i);
            // eslint-disable-next-line no-template-curly-in-string
            z.itemUrl = this.$refs.view_component_ref.$refs[this.componentRef].item_url.split('${id}').join(z.id);
            // eslint-disable-next-line no-template-curly-in-string
            z.data_count_url = this.$refs.view_component_ref.$refs[this.componentRef].data_count_url.split('${id}').join(z.id);
            // Pagination status
            this.$refs.view_component_ref.$refs[this.componentRef].pagination_status[z.id] = { offset: 0, page_number: 0 };
          }
          if (z) { obj.unshift(z); }
        });
        this.$set(this.$refs.view_component_ref.$refs[this.componentRef], 'stages', obj);
      } else if (this.componentRef === 'v-accordion-table-ref') {
        const obj = this.$refs.view_component_ref.$refs[this.componentRef].stages;
        const itemObj = Array.isArray(item) ? item : [item];
        itemObj.forEach(i => {
          obj.forEach(s => {
            const ind = this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data.findIndex(a => {
              return a.id === i.id;
            });
            if (ind >= 0) {
              this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data[ind] = i;
              this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data = [...this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data]
            }
          });
        });
      } else {
        const itemObj = Array.isArray(item) ? item : [item];
        let obj = JSON.parse(JSON.stringify(this.$refs.view_component_ref.$refs[this.componentRef].actual_data));
        const groupKey = this.componentParams.gk;
        itemObj.forEach((i, index) => {
          let count = 0;
          for (var key in obj) {
            if (key === i[groupKey] + '') {
              obj[key].unshift(i);
              count = 1;
            }
          }
          if (count === 0) {
            const z = {};
            z[i[groupKey]] = [];
            z[i[groupKey]].push(i);
            obj = { ...z, ...obj };
          }
        });
        this.$set(this.$refs.view_component_ref.$refs[this.componentRef], 'actual_data', JSON.parse(JSON.stringify(obj)));
      }
      this.bulkHide();
    },
    /** It will update the item in collections */
    updateRow: function (item) {
      if (this.componentRef === 'v-table-ref' || this.componentRef === 'v-cards-ref') {
        const obj = Array.isArray(item) ? item : [item];
        obj.forEach(item => {
          const index = this.$refs.view_component_ref.$refs[this.componentRef].actual_data.findIndex(ind => {
            return ind.id === item.id;
          });
          if (index >= 0) {
            this.$set(this.$refs.view_component_ref.$refs[this.componentRef].actual_data, index, item);
          } else {
            this.$refs.view_component_ref.$refs[this.componentRef].actual_data.push(item);
          }
        });
      } else if (this.componentRef === 'v-kanban-ref') {
        var stages = this.$refs.view_component_ref.$refs[this.componentRef].limitedStages;
        const obj = Array.isArray(item) ? item : [item];
        obj.forEach(newData => {
          var index = stages.findIndex(stage => {
            return stage.id === newData[this.componentParams.ik];
          });
          if (index >= 0) {
            const innerObj = this.$refs.view_component_ref.$refs[this.componentRef].$refs.acCollections[index].data;
            const innerIndex = innerObj.findIndex(i => {
              return i.id === newData.id;
            });
            this.$set(this.$refs.view_component_ref.$refs[this.componentRef].$refs.acCollections[index].data, innerIndex, newData);
          }
        });
      } else if (this.componentRef === 'v-grouped-ref') {
        const itemObj = Array.isArray(item) ? item : [item];
        var obj = JSON.parse(JSON.stringify(this.$refs.view_component_ref.$refs[this.componentRef].stages));
        itemObj.forEach(i => {
          obj.forEach((j, index) => {
            if (obj[index][this.componentParams.sk] === i[this.componentParams.ik]) {
              const innerIndex = obj[index].actual.findIndex(z => {
                return z.id === i.id;
              });
              obj[index].actual[innerIndex] = i;
            }
          });
        });
        this.$refs.view_component_ref.$refs[this.componentRef].stages = [...obj];
      } else if (this.componentRef === 'v-accordion-table-ref') {
        const obj = this.$refs.view_component_ref.$refs[this.componentRef].stages;
        const itemObj = Array.isArray(item) ? item : [item];
        itemObj.forEach(i => {
          obj.forEach(s => {
            const ind = this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data.findIndex(a => {
              return a.id === i.id;
            });
            if (ind >= 0) {
              this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data[ind] = i;
              this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data = [...this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data]
            }
          });
        });
      } else {
        const itemObj = Array.isArray(item) ? item : [item];
        const obj = JSON.parse(JSON.stringify(this.$refs.view_component_ref.$refs[this.componentRef].actual_data));
        const groupKey = this.componentParams.gk;
        itemObj.forEach(i => {
          for (var key in obj) {
            if (key === i[groupKey] + '') {
              const index = obj[key].findIndex(z => {
                return z.id === i.id;
              });
              this.$set(obj[key], index, i);
            }
          }
        });
        this.$set(this.$refs.view_component_ref.$refs[this.componentRef], 'actual_data', JSON.parse(JSON.stringify(obj)));
      }
      this.bulkHide();
    },
    deleteRow (item) {
      const arr = (item + '').split(',');
      if (this.componentRef === 'v-table-ref' || this.componentRef === 'v-cards-ref') {
        arr.forEach(i => {
          const index = this.$refs.view_component_ref.$refs[this.componentRef].actual_data.findIndex(z => {
            return z.id + '' === i;
          });
          this.$refs.view_component_ref.$refs[this.componentRef].actual_data.splice(index, 1);
        });
      } else if (this.componentRef === 'v-kanban-ref') {
        var stages = this.$refs.view_component_ref.$refs[this.componentRef].$refs.acCollections;
        arr.forEach(i => {
          stages.forEach((j, ind) => {
            const index = j.data.findIndex(z => {
              return z.id + '' === i;
            });
            if (index >= 0) {
              this.$refs.view_component_ref.$refs[this.componentRef].$refs.acCollections[ind].data.splice(index, 1);
            }
          });
        });
      } else if (this.componentRef === 'v-grouped-ref') {
        var obj = JSON.parse(JSON.stringify(this.$refs.view_component_ref.$refs[this.componentRef].stages));
        console.log(obj);
        arr.forEach(i => {
          obj.forEach((k, index) => {
            k.actual.forEach((j, ind) => {
              if (j.id + '' === i) {
                obj[index].actual.splice(ind, 1);
              }
            });
          });
        });
        this.$refs.view_component_ref.$refs[this.componentRef].stages = [...obj];
      } else if (this.componentRef === 'v-accordion-table-ref') {
        const obj = this.$refs.view_component_ref.$refs[this.componentRef].stages;
        arr.forEach(i => {
          obj.forEach(s => {
            const ind = this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data.findIndex(a => {
              return (a.id + '') === i;
            });
            if (ind >= 0) {
              this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data.splice(ind, 1);
              this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data = [...this.$refs.view_component_ref.$refs[this.componentRef].$refs['accordion' + s.id][0].actual_data]
            }
          });
        });
      } else {
        const obj = JSON.parse(JSON.stringify(this.$refs.view_component_ref.$refs[this.componentRef].actual_data));
        arr.forEach(i => {
          for (var key in obj) {
            const index = obj[key].findIndex(z => {
              return z.id + '' === i;
            });
            if (index >= 0) {
              obj[key].splice(index, 1);
              if (obj[key].length === 0) {
                delete obj[key];
              }
            }
          }
        });
        this.$refs.view_component_ref.$refs[this.componentRef].actual_data = { ...obj };
      }
      this.bulkHide();
    },
    /** It will call function based on tye */
    optionSelected: function (value) {
      // This.rowIndex = value.index;
      debugger;
      if (value.type && value.type.toLowerCase() === 'edit') {
        this.editModal('id=' + value.item[this.templateParams.fp || 'id'], '', value.option);
      } else if (value.type && value.type.toLowerCase() === 'delete') {
        this.start('delete', { id: value.item.id, ref: this.componentRef, getUrl: this.getUrl, deleteUrl: this.deleteUrl });
      } else {
        console.log('iam in optionselect');
      }
    },
    // It is to hide bulk options
    bulkHide: function () {
      this.count = [];
      try {
        if (this.componentRef === 'v-table-ref' || this.componentRef === 'v-kanban-ref' || this.componentRef === 'v-cards-ref' || this.componentRef === 'v-grouped-table-ref') {
          this.$refs.view_component_ref.$refs[this.componentRef].selected = [];
          this.$refs.view_component_ref.$refs[this.componentRef].bulk_selected = false;
          this.$refs.view_component_ref.$refs[this.componentRef].select_all = false;
        } else if (this.componentRef === 'v-accordion-table-ref') {
          this.$refs.view_component_ref.$refs[this.componentRef].selected_items = [];
        }
      } catch (err) {}
      this.$bvModal.hide('crud-modal');
    },
  },
};
</script>

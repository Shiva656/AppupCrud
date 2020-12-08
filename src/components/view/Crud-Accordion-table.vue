<template>
  <div>
    <ac-accordion-table
      :stages_url="stageUrl"
      toggle_variant="transparent"
      :append_key="blockParams.appendKey"
      :loading_image="collection.loadingImage"
      :columns="collection.columns"
      :item_key="blockParams.ik"
      :bulk="blockParams.b ? true : false"
      :dropdown="blockParams.d ? true : false"
      show_dropdown_icons="false"
      :dropdown_options="collection.dropdownOptions"
      :dropdown_button_options="collection.buttonOptions"
      :item_url="itemUrl"
      :ac_cursor="acCursor"
      @row-clicked="rowClicked"
      @dropdown-clicked="dropdownClick"
      @selected-checkbox="bulkCheck"
      :ref="componentName + '-ref'"
      v-if="itemUrl"
    >
      <template #accordion_header="{ item }">
        <div class="d-flex mt-1">
          <!-- <component v-if="accordionHheader" :is="accordionHheader" :item="item"></component> -->
          <h4 class="float-left mb-0">{{ item['name'] }}</h4>
        </div>
      </template>
      <template #stages_empty_state>
        <p @click="emptyStateClcik($event)" v-html="empty_state"></p>
      </template>
      <template slot='option' slot-scope="data">
        <ac-material-dropdown :button_options="collection.buttonOptions" :options="dropdownJson(data.data.item)" right="true" @item_click="dropdownClick" show_icon="true"></ac-material-dropdown>
      </template>
      <!-- <template :slot="block.key" slot-scope="data" v-for="block in tableData.columnSlot">
        <component :is="block.slot" :componentRef='component_ref' :entity='b_entity' :blockParams='blockParams' :templateParams='templateParams' :item="data.item" :key_value="block.key" v-if="block.slot && block.slot != '0'" :key="block"></component>
        <template v-else>{{ data.item[block.key] }}</template>
      </template> -->
    </ac-accordion-table>
  </div>
</template>
<script>
// Import { getData } from '../js/global';
import AccordionTable from '../Appup Components/ac-accordion-table';
import MaterialDropdown from '../Appup Components/ac-material-dropdown';
import { crudMixin } from '../../mixins/crud';
export default {
  components: {
    'ac-accordion-table': AccordionTable,
    'ac-material-dropdown': MaterialDropdown,

  },
  mixins: [crudMixin],
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  data () {
    return {
      appName: '',
      accordionHheader: '',
      responseUrl: '',
      columns: [],
      columnKey: '',
      slideout: 'f',
      stageUrl: this.blockParams.su,
      itemUrl: '',
      acCursor: {
      },
    };
  },
  mounted () {
    console.log('Accordion table')
    this.getUrl();
  },

  watch: {
    finalCondition (after, before) {
      this.getUrl(after, true);
    },
    empty_state: {
      handler (after, before) {
        this.empty_state = after;
      },
      deep: true,
    },
  },
  methods: {
    rowClicked: function (data) {
      if (this.slideout === 't') {
        this.$emit('row_click', data);
      }
    },
    getUrl: function (after, enable) {
      /** AppendFilter is used to append where clause to stage url  */
      if (this.blockParams.appendFilter) {
        this.stageUrl = this.blockParams.su + ((after || {}).where ? ('&where=' + after.where) : '')
      }
      this.itemUrl = this.blockParams.iu;
      let obj = {};
      // eslint-disable-next-line no-template-curly-in-string
      const where = this.finalCondition.where ? (this.blockParams.ik + "='${id}'" + ' and ' + this.finalCondition.where) : (this.blockParams.ik + "='${id}'");
      this.$set(obj, 'where', where);
      obj = { ...this.finalCondition, ...obj };
      this.acCursor = JSON.parse(JSON.stringify(obj));
      if (enable) {
        this.$refs[this.componentName + '-ref'].get_data();
      }
    },
    dropdownClick: function (data) {
      this.$emit('option_select', { ...data, ...{ item: data.item, type: data.type } });
    },
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },
    emptyStateClcik: function (event) {
      // eslint-disable-next-line no-unused-expressions
      event.target.type && event.target.type === 'button' ? this.$emit('add_row', '') : '';
    },
  },
};
</script>

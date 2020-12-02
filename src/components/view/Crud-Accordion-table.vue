<template>
  <div>
    <ac-accordion-table
      :stages_url="blockParams.su"
      toggle_variant="white"
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
        <div class="d-flex">
          <!-- <component v-if="accordionHheader" :is="accordionHheader" :item="item"></component> -->
          <div class="float-left">{{ item['name'] }}</div>
        </div>
      </template>
      <template #stages_empty_state>
        <p @click="emptyStateClcik($event)" v-html="empty_state"></p>
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
export default {
  components: {
    'ac-accordion-table': AccordionTable,
  },
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  data () {
    return {
      appName: '',
      accordionHheader: '',
      responseUrl: '',
      columns: [],
      columnKey: '',
      slideout: 'f',
      stagesUrl: '',
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
      this.$emit('option_select', { item: data.item, type: data.type });
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

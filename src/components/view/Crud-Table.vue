<template>
  <div>
    <ac-collection-table class="test"
      :ref="componentName + '-ref'"
      :bulk="blockParams.b ? true : false"
      :dropdown="blockParams.d ? true : false"
      :dropdown_options="collection.dropdownOptions"
      :dropdown_button_options="collection.buttonOptions"
      :columns="collection.columns"
      :url="url"
      v-if="url"
      method="GET"
      :limit="templateParams.lm"
      limit_key="l"
      :isLoading="true"
      offset_key="offset"
      pagination_type="scroll"
      load_more_type="infiniScroll"
      :scroll_style="scrollClass"
      show_pagination="true"
      :sticky_header="stickyHeader"
      :loading_image="collection.loadingImage"
      :data_count_url="dataCountUrl"
      :total_count="totalCount || totalCount === 0 ? totalCount : loadmoreCount"
      count_key="count"
      :ac_cursor="finalCondition"
      @selected_checkbox="bulkCheck"
      @row_clicked="rowClick"
      @row-dblclicked="rowDoubleClick"
      @dropdown_click="dropdownClick"
      :static_data="staticData"
    >
      <template #empty_state>
        <p @click="emptyStateClcik($event)" v-html="empty_state"></p>
      </template>
      <!-- <template :slot='block.key' slot-scope="data" v-for="block in tableData.columnSlot">
          <component :is='block.slot'  :item="data.item" :key_value="block.key" :componentRef='component_ref' :entity='b_entity' :blockParams='blockParams' :templateParams='template_params' v-if='block.slot && block.slot!="0"' :key='block'></component>
          <template v-else>{{data.item[block.key]}}</template>
        </template> -->
    </ac-collection-table>
  </div>
</template>
<script>
import { getData } from '../js/global';
import CollectionTable from '../Appup Components/ac-collection-table';
export default {
  components: {
    'ac-collection-table': CollectionTable,
  },
  props: [
    'entity',
    'collection',
    'componentName',
    'finalCondition',
    'empty_state',
    't_count',
    'templateParams',
    'blockParams',
    'component_data',
  ],
  data () {
    return {
      isLoading: this.is_loading,
      staticData: [],
      loadmoreCount: 0,
      stickyHeader: 'true',
      emptyContent: 'No Data Found',
      actualCount: this.t_count,
      totalCount: this.t_count,
      dataCountUrl: '',
      optionsSlot: false,
      url: '',
      slideout: 'f',
      slideotDb: 'f',
      isModal: 'f',
      isNavigate: 'f',
      appName: null,
      fieldKey: '',
      scrollClass: { 'over-flow': 'auto', 'max-height': '360px' },
      columns: [],
      acCursor: {},
    };
  },
  mounted () {
    console.log('iam in table');
    getData(this.entity).then((url) => {
      this.url = url;
    });
  },

  methods: {
    /**
     * To emit method when click on bulkcheck
     * @param {Object} data
     */
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },

    /**
     * To emit method when click on row item
     * @param {Object} item
     */
    rowClick: function (item) {
      if (this.slideout === 't') {
        this.$emit('row_click', item);
      }
      if (this.isModal === 't') {
        window.crd = item;
        this.dropdownClick({ item: item, type: this.blockParams.blk.split(':')[0], index: 0 });
      }
      if (this.isNavigate === 't') {
        window.crd = item;
        this.$parent.editModal(0, 'crd');
      }
    },

    /**
     * Execute on double click of row
     * @param {Object} item
     */
    rowDoubleClick: function (item) {
      if (this.slideotDb === 't') {
        this.$emit('row_double_click', item);
      }
    },

    /**
     * To emit method when click on table ellipsis option
     * @param {Object} data
     */
    dropdownClick: function (data) {
      this.$emit('option_select', { item: data.item, option: data.option, index: data.index, type: data.type });
    },

    /**
     * To emit method when click on favourite option
     * @param {Object} form
     * @param {Object} data
     */
    updatedStatus: function (form, data) {
      this.$emit('slot_status', form, data);
    },

    emptyStateClcik: function (event) {
      // eslint-disable-next-line no-unused-expressions
      event.target.type && event.target.type === 'button' ? this.$emit('add_row', '') : '';
    },
  },
};
</script>

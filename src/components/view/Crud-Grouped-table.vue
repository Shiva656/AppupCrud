<template>
  <div>
    <b-card body-class="p-0" class="border-0">
    <ac-collection-grouped-table
      :ref="componentName+'-ref'"
      :columns="collection.columns"
      :dropdown="blockParams.d"
      :dropdown_options="collection.dropdownOptions"
      :dropdown_button_options="collection.buttonOptions"
      :bulk="blockParams.b"
      header_class=''
      :url="url"
      v-if='url'
      :method="collection.method"
      :loading_image="collection.loadingImage"
      :ac_cursor="finalCondition"
      :group_key="blockParams.gk"
      @grouped_bulkaction="bulkCheck"
      @bulkaction="bulkCheck"
      @checkbox_clicked="bulkCheck"
      @row_clicked="rowClick"
      @dropdown_click="dropdownClick"
    >
      <template v-slot:group_header="{ groupItem }">
        <h5 class="py-1 ml-2 mb-0 text-capitalize">{{ groupItem[blockParams.gk] }}</h5>
      </template>
      <template #emptyState>
        <p><center>No Data</center></p>
      </template>
      <template slot="option" slot-scope="data">
        <ac-material-dropdown :button_options="collection.buttonOptions" :options="dropdownJson(data.data.item)" right="true" @item_click="dropdownClick" show_icon="true"></ac-material-dropdown>
      </template>
    </ac-collection-grouped-table>
    </b-card>
  </div>
</template>
<script>
import { getData } from '../js/global';
import GroupedTable from '../Appup Components/ac-collection-grouped-table';
import { crudMixin } from '../../mixins/crud';
import MaterialDropdown from '../Appup Components/ac-material-dropdown';
export default {
  components: {
    'ac-collection-grouped-table': GroupedTable,
    'ac-material-dropdown': MaterialDropdown,
  },
  mixins: [crudMixin],
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  data: function () {
    return {
      url: ''
    };
  },
  mounted () {
    console.log('grouped-table')
    getData(this.entity).then((url) => {
      this.url = url;
    });
  },
  methods: {
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },
    rowClick: function (item) {
      if (this.slideout === 't') {
        this.$emit('row_click', item);
      }
    },
    dropdownClick: function (data) {
      this.$emit('option_select', { ...data, ...{ item: data.item, type: data.type, option: data.option } });
    }
  },
};
</script>

<style></style>

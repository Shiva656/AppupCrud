<template>
  <div>
    <b-card body-class="p-0" class="border-0">
    <ac-grouped-view
      :view="blockParams.v"
      :ref="componentName+'-ref'"
      :stage_url="stageUrl"
      :item_url="itemUrl"
      :stage_append_key="blockParams.sk?blockParams.sk:'id'"
      :item_append_key="blockParams.ik"
      :dropdown="blockParams.d ? true : false"
      :dropdown_options="collection.dropdownOptions"
      :dropdown_button_options="collection.buttonOptions"
      :columns="collection.columns"
      :ac_cursor="acCursor"
      show_dropdown_icons="true"
      method="GET"
      limit="10"
      limit_key="l"
      offset_key="offset"
      :total_count="totalCount"
      :data_count_url="dataCountUrl"
      count_key="count"
     :bulk="blockParams.b ? true : false"
      grouped_bulk=true
      is_loading="true"
      @selected_checkbox="bulkCheck"
      loading_image="collection.loadingImage"
      @row-clicked="rowClick"
      @dropdown_click="dropdownClick"
      pagination_type="loadMore"
      load_more_type="loadMoreButton"
      v-if='itemUrl'
    >
      <template v-slot:group_header="{ groupItem }">
     <h5 class="mb-0"> {{groupItem.name}}</h5>
      </template>
      <template v-slot:header>
        <!--Main Header      :group_key="blockParams.gk"
-->
      </template>
      <template v-slot:footer>
        <!--Main footer-->
      </template>
      <template #empty_state>
        <p v-html="empty_state"></p>
      </template>
      <template #empty_group>
        <p v-html="empty_state"></p>
      </template>

      <template v-slot:card_body="{ item }">
        <div class="media align-items-center">
          <h5 class="mb-0 ml-2 text-capitalize">{{item.name}}</h5>
        </div>
      </template>

      <!-- <template :slot="block.key" slot-scope="data" v-for="block in tableData.columnSlot">
        <component :is="block.slot" :componentRef='component_ref' :entity='entity' :blockParams='blockParams' :templateParams='template_params' :item="data.item" :key_value="block.key" v-if="block.slot && block.slot != '0'" :key="block"></component>
        <template v-else>{{ data.item[block.key] }}</template>
      </template> -->
       <template slot="option" slot-scope="data">
        <ac-material-dropdown :button_options="collection.buttonOptions" :options="dropdownJson(data.data.item)" right="true" @item_click="dropdownClick" show_icon="true"></ac-material-dropdown>
      </template>
    </ac-grouped-view>
    </b-card>
  </div>
</template>
<script>
import GroupedView from '../Appup Components/ac-grouped-view';
import { crudMixin } from '../../mixins/crud';
import MaterialDropdown from '../Appup Components/ac-material-dropdown';
export default {
  components: {
    'ac-grouped-view': GroupedView,
    'ac-material-dropdown': MaterialDropdown,
  },
  mixins: [crudMixin],
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  data () {
    return {
      dataCountUrl: '',
      stageUrl: this.blockParams.su,
      totalCount: this.t_count,
      itemUrl: '',
      acCursor: { order_by: this.finalCondition.order_by },
      slideout: 'f',
    };
  },
  mounted () {
    console.log('v-grouped')
    // eslint-disable-next-line no-template-curly-in-string
    this.dataCountUrl = this.blockParams.iu + '?where=' + this.blockParams.ik + '=%27${id}%27&fields=count(*)%20as%20count'; ;
    this.getUrl(this.finalCondition);
  },
  watch: {
    finalCondition (after) {
      this.getUrl(after, true)
    }
  },
  methods: {
    getUrl: function (after, enable) {
      /** AppendFilter is used to append where clause to stage url  */
      if (this.blockParams.appendFilter) {
        this.stageUrl = this.blockParams.su + ((after || {}).where ? ('&where=' + after.where) : '')
      }
      if (after.where) {
        // eslint-disable-next-line no-template-curly-in-string
        this.itemUrl = this.blockParams.iu + '?where=' + this.blockParams.ik + '=${id} and ' + after.where;
      } else {
        // eslint-disable-next-line no-template-curly-in-string
        this.itemUrl = this.blockParams.iu + '?where=' + this.blockParams.ik + '=${id}';
      }
      if (enable) {
        this.$refs[this.componentName + '-ref'].getdata_byStage_url();
      }
    },
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },
    rowClick: function (item) {
      if (this.slideout === 't') {
        this.$emit('rowClick', item);
      }
    },
    dropdownClick: function (data) {
      this.$emit('option_select', { ...data, ...{ item: data.item, type: data.type, index: data.index } });
    }
  }
};
</script>

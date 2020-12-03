<template>
  <div>
     <ac-collection-grouped
      :ref="componentName+'-ref'"
      :url="url"
      v-if="url"
      method="GET"
      :loading_image="collection.loadingImage"
      :ac_cursor="finalCondition"
      :group_key="blockParams.gk"
      pagination_type="loadMore"
      :data_count_url="countUrl"
      count_key="count"
      :total_count="totalCount"
      :limit="finalCondition.l"
      limit_key="l"
      offset_key="offset"
      show_tooltip=true
      tooltip_message="search here ..."
    >
      <template v-slot:group_header="{ groupItem }">
       <h3 class="py-4 mb-0">Group {{groupItem[blockParams.gk]}}</h3>
      </template>
      <template v-slot:body="{ data }" class="item">
        <div class="row">
          <div v-for="(value, key) in data" :key="key" :class="'col-md-' + cardClass + ' mb-3 px-2'">
              <b-card  class="shadow-none border-0 mb-0" no-body>
              <SimpleCard @dropdownClick="dropdownClick" :collection='collection' :blockParams='blockParams' :templateParams="templateParams"   :item="{ item: value, index: key }" :componentName="componentName"></SimpleCard>
            </b-card>
          </div>
        </div>
      </template>
    </ac-collection-grouped>

  </div>
</template>
<script>
import { getData } from '../js/global';
import SimpleCard from './Crud-Simple-Card'
import GroupedCard from '../Appup Components/ac-collection-grouped';

export default {
  components: {
    'ac-collection-grouped': GroupedCard,
    SimpleCard
  },
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  data () {
    return {
      actualCount: this.t_count,
      cardClass: '4',
      slideout: 'f',
      groupHeader: '',
      appName: '',
      emptyContent: 'No Data Found',
      dataUrl: '',
      groupKey: '',
      countUrl: '',
      url: '',
      totalCount: this.t_count,
      groupCol: true,
      showDefaultGroup: false,
      formFields: '',
      isPropsLoaded: false,
    };
  },
  mounted () {
    console.log('grouped-cards');
    this.cardClass = this.blockParams.cl ? this.blockParams.cl : '4';
    // This.slideout = this.blockParams.so ? this.blockParams.so : this.slideout;
    getData(this.entity).then(res => {
      this.url = res
    });
  },

  methods: {
    dropdownClick: function (data) {
      this.$emit('option_select', { item: data.item.item ? data.item.item : data.item, type: data.type, index: data.index, option: data.option });
    },
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },
    rowClick: function (item) {
      if (this.slideout === 't') {
        this.$emit('row_click', item);
      }
    },
    emptyStateClcik: function (event) {
      if (event.target.type && event.target.type === 'button') {
        this.$emit('add_row', '');
      }
    },
  },
};
</script>

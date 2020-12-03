<template>
  <div>
    <ac-collection-grouped-accordion v-if="url" :ref="componentName + '-ref'" :url="url" method="GET" :loading_image="collection.loadingImage" :ac_cursor="finalCondition" :group_key="blockParams.gk">
      <template v-slot:group_accordion_label="{ groupItem }">
        <h4 class="mb-0 mt-1">{{ groupValue(groupItem) }}</h4>
        </template>
      <template v-slot:body="{ data }" class="item">
        <b-row class="m-0 py-3">
        <div v-for="(value, key) in data" :key="key" :class="'mb-2 col-md-'+blockParams.cl">
          <b-card class="mb-0 shadow-none border-0" no-body>
             <SimpleCard @dropdownClick="dropdownClick" :collection='collection' :blockParams='blockParams' :templateParams="templateParams"   :item="{ item: value, index: key }" :componentName="componentName"></SimpleCard>
          </b-card>
        </div>
       </b-row>
      </template>
    </ac-collection-grouped-accordion>
  </div>
</template>
<script>
import { getData } from '../js/global';
import SimpleCard from './Crud-Simple-Card'
import AccordionCard from '../Appup Components/ac-collection-grouped-accordion';
export default {
  components: {
    'ac-collection-grouped-accordion': AccordionCard,
    SimpleCard
  },
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  mounted: function () {
    console.log('accordion cards')
    getData(this.entity).then(res => {
      this.url = res;
    });
  },
  data () {
    return {
      url: '',
      countUrl: '',
      totalCount: '',
      groupCol: true,
    };
  },
  methods: {
    groupValue: function (key) {
      return key[this.blockParams.gk];
    },
    dropdownClick: function (data) {
      this.$emit('option_select', { item: data.item.item ? data.item.item : data.item, type: data.type, index: data.index });
    },
  },
};
</script>

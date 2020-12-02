<template>
  <div>
    <ac-card-collection
      :ref="componentName + '-ref'"
      :url="url"
      v-if="url"
      :bulk="blockParams.b ? true : false"
      method="GET"
      :data_count_url="countUrl"
      count_key="count"
      :show_pagination="true"
      :loading_image="collection.loadingImage"
      :ac_cursor="finalCondition"
      :responsive_class="
        'col-lg-' + classKey + ' col-md-' + classKey + ' col-xl-' + classKey + ' col-xs-12 col-sm-12 px-2'
      "
      :limit="finalCondition.l"
      offset_key="offset"
      limit_key="l"
      :show_dropdown="blockParams.d ? true : false"
      :dropdown_button_options="collection.buttonOptions"
      pagination_type="loadMore"
      :dropdown_options="collection.dropdownOptions"
      @dropdown_click="dropdownClick"
      @selected_checkbox="bulkCheck"
      load_more_type="loadMoreButton"
      :static_data="staticData"
    >
      <!-- <template #card_header="{  }">
        <div class="card-header header-card"></div>
      </template>
      @click="cardClick"
      @card_dbclick="cardDbclick"
      -->
      <template #card_body="{ item }">
        <div class="card-body p-0 border-0">
         <b-card  class="shadow-none border-0  mb-0">
              <b-img src="https://dashkit.goodthemes.co/assets/img/kanban/kanban-2.jpg" alt="..." class="card-img-top" />
                  <div class="card-body p-0">
                      <!-- Body -->
                      <p class="mt-3">
                          Finish the design for blog listings and articles, including mixed media
                      </p>
                      <p class="card-text small text-muted d-flex align-items-center">
                          <i class="fe fe-message-circle mr-2"></i> {{ item.name }}
                          <i class="fe fe-clock ml-4 mr-2"></i> Sep 9
                      </p>
                  </div>
                </b-card>
          <!-- <component :is="componentName" :item="item" :appName="appName" :portal_users='portal_users' :entity="b_entity"></component> -->
        </div>
      </template>
      <!-- <template #empty_state>
        <p  @click="emptyStateClcik($event)" v-html="empty_state"></p>
      </template> -->

      <!-- <template v-if="optionsSlot && blockParams.d == 't'" slot="option" slot-scope="data">
        <v-material-dropdown
          class="top"
          :data="data"
          :options="tableData.options"
          :app="appName"
          :template_params="template_params"
          :b_entity="b_entity"
          @dropdown_click="dropdownClick"
        ></v-material-dropdown>
      </template> -->
    </ac-card-collection>
  </div>
</template>
<script>
import { getData } from '../js/global';
import cardComponent from '../Appup Components/ac-card-collection';
export default {
  components: {
    'ac-card-collection': cardComponent,
  },
  props: [
    'componentName',
    'tableData',
    'collection',
    'finalCondition',
    'component_ref',
    'b_entity',
    'c_name',
    't_count',
    'filter_count',
    'empty_state',
    'template_params',
    'blockParams',
    'component_data',
  ],
  data () {
    return {
      staticData: [],
      result: {},
      totalCount: this.t_count,
      defaultComponentName: 'sample-card',
      slideout: 'f',
      loadmoreCount: 0,
      slideotDb: 'f',
      optionsSlot: false,
      portal_users: [],
      classKey: 12,
      url: '',
      appName: '',
      dataUrl: null,
      countUrl: null,
      buttonOptions: {
        icon: 'fal fa-ellipsis-h',
        variant: 'bg-transparent p-0',
        size: 'lg',
        right: true,
      },
    };
  },
  mounted () {
    console.log('cards')
    getData(this.entity).then((url) => {
      this.url = url;
    });

    this.classKey = (this.blockParams || {}).cl ? (this.blockParams || {}).cl : 12;
  },

  methods: {
    dropdownClick: function (data) {
      this.$emit('option_select', { item: data.item, option: data.option, index: data.index, type: data.type });
    },
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },
    cardClick: function (data) {
      if (this.slideout === 't') {
        this.$emit('row_click', data);
      }
    },
    cardDbclick: function (data) {
      if (this.slideotDb === 't') {
        this.$emit('row_double_click', data);
      }
    },
    emptyStateClcik: function (event) {
      if (event.target.type && event.target.type === 'button') {
        this.$emit('add_row', '');
      }
    },
  }
};
</script>

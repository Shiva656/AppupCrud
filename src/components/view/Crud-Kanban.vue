<template>
  <div>
    <div>
      <ac-dynamic-kanban
        :dropdown="blockParams.d ? true : false"
        :dropdown_options="collection.dropdownOptions"
        :dropdown_button_options="collection.buttonOptions"
        :bulk="blockParams.b ? true : false"
        show_dropdown_icons=true
        :stage_url="stageUrl"
        :show_loadmore="showLoadmore"
        v-if="url"
        limit="5"
        :key="renderUpdate"
        limit_key="l"
        offset_key="offset"
        :item_url="url"
        :ac_cursor="acCursor"
        stage_append_key="id"
        :item_append_key="blockParams.ik ? blockParams.ik : 'name'"
        bulk_action=true
        :data_count_url="dataCountUrl"
        :ref="componentName + '-ref'"
        @emitDrop="kanbanDrop"
        @bulkChkboxChange="bulkCheck"
        @card-click="cardClick"
        @card-dbclick="cardDbclick"
        @dropdown_click="dropdownClick"
        load_more_type="infiniScroll"
        pagination_type="scroll"
        :scroll_style="scrollClass"
        count_key="count"
      >
        <template slot="header" scope="{ headItem }">
          <h4 class="card-header-title ml-1 text-truncate">{{ headItem.name }}</h4>
        </template>
        <template slot="body" scope="{ item }">
          <div class="card-body pb-2" :key="renderUpdate">
            <b-card no-body class="shadow-none border-0  mb-0">
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
            <!-- <component :is="cardName" :item="item"></component> -->
            <p></p>
          </div>
        </template>
        <template slot="option" slot-scope="data">
        <ac-material-dropdown :button_options="collection.buttonOptions" :options="dropdownJson(data.data.item)" right="true" @item_click="dropdownClick" show_icon="true"></ac-material-dropdown>
        </template>
        <p slot="empty_state">This is empty state slot</p>
      </ac-dynamic-kanban>
    </div>
  </div>
</template>
<script>
import kanban from '../Appup Components/ac-dynamic-kanban';
import { crudMixin } from '../../mixins/crud';
import MaterialDropdown from '../Appup Components/ac-material-dropdown';

export default {
  components: {
    'ac-dynamic-kanban': kanban,
    'ac-material-dropdown': MaterialDropdown,
  },
  mixins: [crudMixin],
  props: ['entity', 'finalCondition', 'templateParams', 'blockParams', 'componentName', 'collection'],
  data () {
    return {
      cardName: '',
      slideout: 'f',
      slideot_db: 'f',
      result: {},
      kanbanKey: '',
      scrollClass: { overflow: 'auto', 'max-height': '450px' },
      appDyn: '',
      acCursor: {},
      dropdown: 'f',
      kanbanFlag: false,
      showLoadmore: true,
      stageUrl: this.blockParams.su,
      appName: '',
      url: '',
      dataCountUrl: '',
      actualUrl: '',
      renderKanban: false,
      rid: 'id',
      kv: '',
      renderUpdate: 1,
    };
  },
  mounted () {
    console.log('v-kanban');
    this.result = this.blockParams ? this.blockParams : this.result;
    this.cardName = this.result.c ? this.result.c : this.appDyn + '-' + this.entity + '-kanban';
    this.kanbanKey = this.result.k;
    this.kv = this.kanbanKey;

    this.rid = this.templateParams.rid ? this.templateParams.rid : this.rid;
    this.kv = this.templateParams.kv ? this.templateParams.kv : this.kv;
    // eslint-disable-next-line no-template-curly-in-string
    this.dataCountUrl = this.blockParams.iu + '?where=' + this.blockParams.ik + '=%27${id}%27&fields=count(*)%20as%20count';
    this.getUrl(this.finalCondition);
  },
  methods: {
    kanbanDrop: function (item) {
      console.log('kanban dragdrop');
      item.dragObj[this.kanbanKey] = ((item || {}).toStageObj || {}).name || '';
      var updateItem = {};
      updateItem.id = item.dragObj[this.rid];
      updateItem[this.kv] = item.toStageObj.id;
      this.$emit('option_select', updateItem, 'kanban_update');
    },
    bulkCheck: function (data) {
      this.$emit('check_value', data);
    },
    cardClick: function (item) {
      if (this.slideout === 't') {
        this.$emit('row_click', item);
      }
    },
    cardDbclick: function (item) {
      if (this.slideot_db === 't') {
        this.$emit('row_double_click', item);
      }
    },
    getUrl: function (after) {
      if (after.where) {
        // eslint-disable-next-line no-template-curly-in-string
        this.url = this.blockParams.iu + '?where=' + this.blockParams.ik + '=%27${id}%27 and ' + after.where;
      } else {
        // eslint-disable-next-line no-template-curly-in-string
        this.url = this.blockParams.iu + '?where=' + this.blockParams.ik + '=%27${id}%27';
      }
      /** AppendFilter is used to append where clause to stage url  */
      if (this.blockParams.appendFilter) {
        this.stageUrl = this.blockParams.su + ((after || {}).where ? ('&where=' + after.where) : '')
      }
    },
    dropdownClick: function (data) {
      this.$emit('option_select', { item: data.item, type: data.type, index: data.index });
    },
  },
  watch: {
    finalCondition: {
      handler (after) {
        this.getUrl(after);
        this.$refs['v-kanban-ref'].getdata_byStage_url();
      },
      deep: true,
    },
  },
};
</script>

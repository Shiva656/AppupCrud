<template>
  <div class=" ">
    <!-- <div class="d-flex flex-row-reverse py-3 icon bg-white border-muted" v-if="limitedStages && limitedStages.length">
    <a :class="{'disabled-arrows':right_length == stages.length}"><i class="material-icons rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mr-3"  :class="{'bg-secondary':right_length == stages.length}" style="font-size: 20px; cursor: pointer;" @click="arrow_right">keyboard_arrow_right</i> </a>
    <a :class="{'disabled-arrows':right_length <= 4}"><i class="material-icons rounded-circle bg-primary d-flex text-white justify-content-center align-items-center mr-3" :class="{'bg-secondary':right_length <= 4}"  style="font-size: 20px; cursor: pointer;" @click="arrow_left">keyboard_arrow_left</i></a>
    </div>-->
    <div class="container-fluid kanban-container pl-0" :class="main_class">
      <div class="row">
        <div class="col-12 custom-ticket-bg" v-for="(stg,stgIndex) in limitedStages" :key="stgIndex">
          <b-card class="custom-odd-color" no-body>
              <b-card-header class=" card-header-flush  kanban-header">
              <div class="d-flex align-items-center">
                <template v-if="bulk_action">
                  <b-form-checkbox
                    :class="header_class"
                    :id="`checkboxs${stg[stage_append_key]}${stgIndex}`"
                    @change="bulk_actions($event,stg,'S',stgIndex)"
                    ></b-form-checkbox>
                  </template>
                  <!-- slot for header -->
                  <slot name="header" :headItem="stg"></slot>
              </div>
            </b-card-header>
            <b-card-body>
            <div class="scroll-area-css p-0">
              <ac-collection
                ref="acCollections"
                :key="stgIndex + '_' + render_count"
                :total_count="stg.count"
                :pagination_type="pagination_type"
                :load_more_type="load_more_type"
                :data_count_url="stg.data_count_url"
                :count_key="count_key"
                :limit="limit"
                :limit_key="limit_key"
                :offset_key="offset_key"
                :url="stg.itemUrl"
                :ac_cursor="ac_cursor"
                :loading_image="loading_image"
                sort_key="name"
                class="shadow-none border-0 mb-0 rounded-0"
                v-if="stg.itemUrl"
                :scroll_style="scroll_style"
              >
                <template #body="{ data }">
                  <div
                    class="items"
                    @dragover.stop="on_drag_over"
                    @drop.stop="on_drop($event,stgIndex)"
                  >
                    <div
                      class="card draggable cursor-pointer shadow-none"
                      id="cd1"
                      v-for="(item,blkIndex) in data"
                      :key="blkIndex"
                      draggable="true"
                      @dragstart.stop="on_drag_start($event,blkIndex,stgIndex,item)"
                      @click="$emit('card-click',item)"
                      @dblclick="$emit('card-dbclick',item)"
                    >
                    <div class="d-flex align-items-center justify-content-between card-header border-bottom-0 card-header-flush">
                      <div v-if="bulk_action">
                        <b-form-checkbox
                          :id="`checkboxb${stg[stage_append_key]}${blkIndex}`"
                          v-model="selected"
                          :value="item"
                          @change="checkbox_click(item,stgIndex)"
                          :class="checkbox_class"
                        ></b-form-checkbox>
                      </div>
                      <div v-if="dropdown">
                       <slot name="option" :data="{item:item,stage_index:stgIndex}">
                        <ac-material-dropdown
                          :options="dropdown_options"
                          :button_options="dropdown_button_options"
                          :right="dropdown_button_options.right"
                           @item_click="on_dropdown_item_click($event,item,stgIndex,blkIndex)"
                          :show_icon="show_dropdown_icons"
                          :from_data="item"
                        >
                          <!-- renders slot for material dropdown -->
                          <template
                            :slot="dropdown.key"
                            slot-scope="data"
                            v-for="dropdown in dropdown_options"
                          >
                            <slot :name="dropdown.key" :item="data.data"></slot>
                          </template>
                        </ac-material-dropdown>
                        </slot>
                      </div>
                    </div>
                      <slot name="body" :item="item" :list="data"></slot>
                    </div>
                    <div class="card draggable cursor-pointer mb-0  dz-default dz-message p-0 rounded" v-if="!data.length">
                      <div v-if="show_stg_empty_slot">
                        <!-- Empty stage slot -->
                        <slot name="stg_empty_state"></slot>
                      </div>
                      <div class="card-body p-3 dz-button dz-default dz-message" v-else>Drag Here</div>
                    </div>
                  </div>
                </template>
              </ac-collection>
            </div>
            </b-card-body>
        </b-card>
      </div>
      </div>
      <!-- Empty state slot -->
      <div
        class="empty_state_class w-100"
        v-if="limitedStages && !limitedStages.length && stages_loaded == true"
      >
        <slot name="empty_state"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import AppPreload from '../../mixins/ac-preload';
import collection from './ac-collection';
import MaterialDropdown from './ac-material-dropdown'

/**
 * @requires ac-preload.js
 * @inherits ac-preload
 */

export default {
  components: {
    'ac-collection': collection,
    'ac-material-dropdown': MaterialDropdown
  },
  name: 'ac-dynamic-kanban',
  mixins: [AppPreload],
  props: {
    /**
     * Url to fetch stage data
     * @param {String} -stagesUrl
     * @category_name 1_General
     * @label Stage url
     */
    stage_url: {
      type: String
    },
    /**
     * Static data for stages
     * @param {array} - stages_data
     * @category_name 1_General
     * @label Static Stages
     */
    stages_data: {
      type: Array
    },
    /**
     * Url to fetch collections data
     * @param {String} -item_url
     * @category_name 1_General
     *  @label Item url
     */
    item_url: {
      type: String
    },
    /**
     * Keyvalue to append dynamically to stagesUrl
     * @param {String} -stage_append_key
     * @category_name 1_General
     *  @label Stage append key
     */
    stage_append_key: {
      type: String
    },
    /**
     * Keyvalue to append dynamically to itemUrl
     * @param {String} -item_append_key
     * @category_name 1_General
     * @label Item append key
     */
    item_append_key: {
      type: String
    },
    /**
     * Object for generating url query params params
     * @param {string|number} ac_cursor
     * @label Ac Cursor
     * @category_name 1_General
     */
    ac_cursor: {
      type: Object,
      default: () => ({})
    },
    /**
     * To enable bulkoptions
     * @param {Boolean} -bulk_action
     * @category_name 3_Advanced
     * @label Bulk action
     */
    bulk_action: {
      type: Boolean,
      default: false
    },
    /**
     * Drag and drop
     * @param {Booolean} -noDrop
     * @category_name 1_General
     * @label No drop
     */
    no_drop: {
      type: Boolean,
      default: false
    },
    /**
     * To enable empty slot
     * @param {Boolean} -show_stg_empty_slot
     * @category_name 3_Advanced
     * @label Show stage empty slot
     */
    show_stg_empty_slot: {
      type: Boolean,
      default: false
    },
    /**
     * Whenever true show dropdown in the last column
     * @param {boolean} dropdown
     * @label Dropdown
     * @category_name 1_General
     */
    dropdown: {
      type: Boolean,
      default: false
    },
    /**
     * If true - display dropdown options icon
     * @param {boolean} show_dropdown_icons
     * @label Show Dropdown Icons
     * @category_name 1_General
     */
    show_dropdown_icons: {
      type: Boolean,
      default: false
    },

    /**
     * Options for dropdown menu for each row
     * @param {Array} dropdown_options
     * @properties {"label": {"type": "String","description":"Give label name of option"}, "type": {"type": "String","description":"Type of the option Eg:edit,submit..etc"}, "icon": {"type": "String","description":"Give icon class for option"},"key":{"type": "String"}, "__slot__": {"type": "String"},
       "inside_grid": {
           "name":"options",
           "handler_name":{"type": "String"},
           "handler_params":{"type": "String"}
           }}
     * @label Dropdown Options
     * @category_name 1_General
     */
    dropdown_options: {
      type: Array,
      required: false,
      default: () => []
    },

    /**
     * Dropdown Button Options is a object with keys icon, variant, size, right. It shows three dots based upon icon in each row
     * @param {object} dropdown_button_options
     * @properties
        {
          "icon": {"type": "String", "default": "fas fa-ellipsis-v","description":"Give button icon class"},
          "variant": {"type": "String", "default": "outline-secondary", "description":"Give variant class for button", "values": ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "outline-primary", "outline-secondary", "outline-success", "outline-danger", "outline-warning", "outline-info", "outline-light", "outline-dark"]},
          "size": {"type": "String", "default": "sm", "description":"Give size of the button Eg:sm,lg,md", "values": ["sm", "md", "lg"]},
          "right": {"type": "Boolean", "default": "true", "description":"To display dropdown options right or left"}
        }
      * @label Dropdown Button Options
      * @category_name 1_General
     */
    dropdown_button_options: {
      type: Object,
      required: false
    },
    /**
     * Type of pagination
     * @param {string} pagination_type
     * @properties {"label":"Pagination Type", "type": "List", "default": "deselect", "values": ["deselect", "loadMore","scroll"]}
     * @default "deselect"
     * 'deselect, pagination, loadMore'
     * @label Pagination Type
     * @category_name 3_Advanced
     */
    pagination_type: {
      type: String,
      default: 'deselect',
      validator: value =>
        ['deselect', 'loadMore', 'scroll'].indexOf(value) !== -1
    },
    /**
     * Type for loadmore
     * @param {String} -load_more_type
     * @category_name 3_Advanced
     * @label Load more type
     */
    load_more_type: {
      type: String,
      required: false,
      default: 'loadMoreButton'
    },
    /**
     * Enable loadmore
     * @param {Boolean} -show_loadmore
     * @category_name 3_Advanced
     * @label Show load more
     */
    show_loadmore: {
      type: Boolean,
      default: false
    },
    /**
     * Fetch data count with given url
     * @param {string} data_count_url
     * @label Data Count Url
     * @category_name 3_Advanced
     */
    data_count_url: {
      type: String,
      required: false
    },
    /**
     * This key will be used to get count from data_count_url
     * @param {string} count_key
     * @label Count Key
     * @category_name 3_Advanced
     */
    count_key: {
      type: String,
      required: false
    },
    /**
     * Limit for loadmore
     * @param {Number} -limit
     * @category_name 3_Advanced
     * @label Limit
     */
    limit: {
      type: Number,
      required: false
    },
    /**
     * Key for limit
     * @param {String} -limit_key
     * @category_name 3_Advanced
     * @label Limit key
     */
    limit_key: {
      type: String,
      required: false
    },
    /**
     * Key for offset
     * @param {String} -offset_key
     * @category_name 3_Advanced
     * @label Offset key
     */
    offset_key: {
      type: String,
      required: false
    },
    /**
     * Css class for header
     * @param {String} -header_class
     * @category_name 4_Style
     * @label Header class
     */
    header_class: {
      type: String,
      required: false
    },
    /**
     * Class for checkbox
     * @param {String} -checkbox_class
     * @category_name 4_Style
     * @label Check box class
     */
    checkbox_class: {
      type: String,
      required: false
    },
    /**
     * Class for empty state
     * @param {String} -empty_state_class
     * @category_name 4_Style
     * @label Empty state class
     */
    empty_state_class: {
      type: String,
      required: false
    },
    /**
     * Style for sroll bar eg:{"over-flow" : "auto","max-height" : "350px"}
     * @param {Object} scroll_style
     * @label Scroll Style
     * @category_name 4_Style
     */
    scroll_style: {
      type: Object,
      required: false
    },
    /**
     * Image to show while loading data
     * @param {string} loading_image
     * @label Loading Image
     * @category_name 4_Style
     */
    loading_image: {
      type: String,
      default:
        'https://cdn.500apps.io/images/icons/infinity-loading.png'
    },
  },
  data () {
    return {
      stages: [],
      limitedStages: [],
      right_length: null,
      dragging_obj: {},
      from_stg_object: {},
      to_stg_object: {},
      item_Index_befor_drop: null,
      stage_Index_befor_drop: null,
      stage_Index_after_drop: null,
      bulkIds: {},
      render_count: 1,
      main_class: 'd-flex m-0 custom-kb-view',
      selected: [],
      stages_loaded: false,
      items_count: 0,
      stage_indexes: {}
    };
  },
  computed: {
    /*  Pagination_type(){
      if(this.show_loadmore){
        return 'loadMore';
      }else{
        return 'deselect'
      }
    } */
  },
  watch: {
    stage_url: function (oldValue, newValue) {
      this.getdata_byStage_url();
      this.bulkIds = {};
    },
    selected (newval, oldval) {
      this.select_checkbox(newval);
    }
  },
  created () {
    this.getdata_byStage_url();
  },
  mounted () {},
  methods: {
    /**
     * Executes on click of dropdown option
     * @public
     * @param {object} option - selected option events
     * @param {object} item - row info related to clicked dropdown
     */
    on_dropdown_item_click (option, item, stgIndex, index) {
      // Executes multi handlers functionality
      if (option.options && option.options.length) {
        var handlersArray = [];
        option.options.forEach(element => {
          const handlerObject = {};
          handlerObject.name = element.handler_name;
          if (element.handler_params) {
            let custom = {};
            try {
              if (typeof element.handler_params === 'object') {
                custom = element.handler_params;
              } else {
                custom = JSON.parse(element.handler_params);
              }
            } catch (error) {
              custom = {};
            }

            handlerObject.params = {
              helper: {
                component: this,
                custom: custom || {},
                item: item,
                index: index
              }
            };
          }
          // Forming array of objects
          handlersArray.push(handlerObject);
        });
        this.start(handlersArray);
      } else if (option.handler && this.start) { // Executes functionality without multihandlers
        let custom = {};
        if (option.handler_params) {
          try {
            custom = JSON.parse(option.handler_params);
          } catch {
            if (typeof option.handler_params === 'object') {
              custom = option.handler_params;
            }
          }
        }
        this.start(option.handler, {
          helper: {
            component: this,
            item: item,
            index: index,
            custom: custom
          }
        });
      }

      // It fires when Dropdown Click
      this.$emit('dropdown_click', {
        type: option.type,
        option,
        item,
        index,
        stg_index: stgIndex
      });
    },
    // Returns total count of items
    get_total () {
      debugger;
      this.stages.forEach((key, index) => {
        this.items_count = this.items_count + this.$refs.acCollections[index].total_count;
      })
      return this.items_count;
    },
    /**
     * Append dynamic append key to item_url
     */
    async get_blocks_from_stages () {
      for (var i = 0; i < this.stages.length; i++) {
        var compiledUrl = this.stage_url;

        if (this.stages[i][this.stage_append_key]) {
          compiledUrl = this.item_url.replace(
            /\${.*}/,
            this.stages[i][this.stage_append_key]
          );
          var compiledUrl2 = this.data_count_url
            ? this.data_count_url.replace(
              /\${.*}/,
              this.stages[i][this.stage_append_key]
            )
            : '';
        } else {
          compiledUrl = this.item_url.replace(
            /=%27\${(.*)}%27/,
            ' is null '
          );
          // eslint-disable-next-line no-redeclare
          var compiledUrl2 = this.data_count_url
            ? this.data_count_url.replace(/=%27\${(.*)}%27/, ' is null ')
            : '';
        }

        this.stages[i].itemUrl = compiledUrl;
        this.stages[i].data_count_url = compiledUrl2;
        this.stages = [...this.stages];
        this.stage_indexes[this.stages[i][this.stage_append_key]] = i;

        // Change key to force rerender
        this.render_count++;

        console.log('get_blocks_from_stages ', this.stages);
      }
    },

    /**
     * Triggers when a user starts dragging an element or text
     */
    on_drag_start: function (
      event,
      itemIndexBfrDrop,
      stageIndexBfrDrop,
      itemObj
    ) {
      event.dataTransfer.dropEffect = 'move';
      this.item_Index_befor_drop = itemIndexBfrDrop;
      this.stage_Index_befor_drop = stageIndexBfrDrop;
      this.dragging_obj = itemObj;
      this.from_stg_object = Object.assign({}, this.stages[stageIndexBfrDrop]);
    },

    /**
     *  Triggers on being dragged over a valid drop target
     */
    on_drag_over: function (event) {
      event.preventDefault();
    },

    /**
     *  Triggers after drag and drop
     * @param {Object} event -Event
     * @param {Number} stageIndexAftrDrop -Index of new Stage
     */
    on_drop: function (event, stageIndexAftrDrop) {
      this.stage_Index_after_drop = stageIndexAftrDrop;

      if (!this.no_drop) this.on_confirm_drop();

      this.to_stg_object = Object.assign({}, this.stages[stageIndexAftrDrop]);

      var emitObj = {
        fromStageObj: Object.assign({}, this.from_stg_object),
        toStageObj: Object.assign({}, this.to_stg_object),
        dragObj: Object.assign({}, this.dragging_obj)
      };

      console.log(emitObj);
      this.$emit('emitDrop', emitObj);
    },

    /**
     * After Drop is confirmed
     */
    on_confirm_drop: function () {
      this.$refs.acCollections[this.stage_Index_after_drop].actual_data.unshift(
        Object.assign({}, this.dragging_obj)
      );
      this.$refs.acCollections[this.stage_Index_befor_drop].actual_data.splice(
        this.item_Index_befor_drop,
        1
      );

      this.stages = [...this.stages];
    },
    /**
     * Executes on click of checkbox
     */
    checkbox_click (item, stgIndex) {
      item.stgIndex = stgIndex;
      if (
        stgIndex !== -1 &&
        !Array.isArray(
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
        )
      ) { this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]] = []; }

      if (stgIndex !== -1) {
        if (event.target.checked) {
          this.bulkIds[
            this.limitedStages[stgIndex][this.stage_append_key]
          ].push(item[this.item_append_key]);
        } else {
          this.bulkIds[
            this.limitedStages[stgIndex][this.stage_append_key]
          ].splice(
            this.bulkIds[
              this.limitedStages[stgIndex][this.stage_append_key]
            ].findIndex(obj => obj === item[this.stage_append_key]),
            1
          );
        }
        console.log(
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
            .length,
          this.$refs.acCollections[stgIndex].actual_data.length
        );
        if (
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
            .length === this.$refs.acCollections[stgIndex].actual_data.length
        ) {
          document.querySelector(
            `#checkboxs${
              this.limitedStages[stgIndex][this.stage_append_key]
            }${stgIndex}`
          ).checked = true;
        } else {
          document.querySelector(
            `#checkboxs${
              this.limitedStages[stgIndex][this.stage_append_key]
            }${stgIndex}`
          ).checked = false;
        }
      }

      // Fires event
      this.$emit('checkbox_clicked', {
        item: item,
        checked: event.target.checked
      });
    },

    /**
     * Checkbox checked
     * @param {Object} evnt -event
     * @param {Object} item - Data
     * @param {String} stgOrBlock - Specifes whather stage on item
     * @param {Number} stgIndex - Stage index of clicled item
     */
    bulk_actions (event, item, stgOrBlock, stgIndex) {
      // This.selected = [];
      // This.bulkIds={}
      if (
        stgIndex !== -1 &&
        !Array.isArray(
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
        )
      ) { this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]] = []; }

      if (stgIndex !== -1) {
        if (event) {
          this.bulkIds[
            this.limitedStages[stgIndex][this.stage_append_key]
          ] = this.$refs.acCollections[stgIndex].actual_data.map(obj => {
            return obj[this.item_append_key];
          });
        } else {
          delete this.bulkIds[
            this.limitedStages[stgIndex][this.stage_append_key]
          ];
        }
      }

      const bulkData = this.$refs.acCollections[stgIndex].actual_data;
      if (event) {
        bulkData.forEach(object => {
          // This.selected.push(object);
          const index = this.selected.findIndex(p => p.id === object.id);
          if (index === -1) {
            object.stgIndex = stgIndex;
            this.selected.push(object);
          }
        });
      } else {
        bulkData.forEach(object => {
          const index = this.selected.findIndex(p => p.id === object.id);
          if (index !== -1) {
            this.selected.splice(index, 1);
          }
        });
      }
      this.$emit('bulk_actions', this.selected);
    },
    // Emits on selecting checkbox
    select_checkbox (newval) {
      this.$emit('bulkChkboxChange', newval);
    },
    /**
     * Append checkbox selected data to an array
     * @public
     * @returns {array} array id's of checked data
     */
    get_selected () {
      const selected = [];
      if (this.selected && this.selected.length) {
        this.selected.forEach(object => {
          selected.push(object.id);
        });
      }
      return selected;
      // Return [...this.selected];
    },
    /*  Bulk_chkbox_chng: function(evnt, data, stgOrBlock, stgIndex) {
      if (
        stgIndex != -1 &&
        !Array.isArray(
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
        )
      )
        this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]] = [];

      if (stgIndex != -1 && stgOrBlock == "B") {
        if (evnt)
          this.bulkIds[
            this.limitedStages[stgIndex][this.stage_append_key]
          ].push(data[this.item_append_key]);
        else
          this.bulkIds[
            this.limitedStages[stgIndex][this.stage_append_key]
          ].splice(
            this.bulkIds[
              this.limitedStages[stgIndex][this.stage_append_key]
            ].findIndex(item => item == data[this.stage_append_key]),
            1
          );
        console.log(
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
            .length,
          this.$refs.acCollections[stgIndex].actual_data.length
        );
        if (
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
            .length == this.$refs.acCollections[stgIndex].actual_data.length
        )
          document.querySelector(
            `#checkboxs${
              this.limitedStages[stgIndex][this.stage_append_key]
            }${stgIndex}`
          ).checked = true;
        else
          document.querySelector(
            `#checkboxs${
              this.limitedStages[stgIndex][this.stage_append_key]
            }${stgIndex}`
          ).checked = false;
      } else if (stgIndex != -1 && stgOrBlock == "S") {
        let blcksData = this.$refs.acCollections[stgIndex].actual_data || [];
        if (blcksData.length) {
          blcksData.forEach((item, index) => {
            if (evnt) {
              document.querySelector(
                `#checkboxb${
                  this.limitedStages[stgIndex][this.stage_append_key]
                }${index}`
              ).checked = true;
              this.bulkIds[
                this.limitedStages[stgIndex][this.stage_append_key]
              ].push(item[this.item_append_key]);
              console.log(this.bulkIds);
            } else {
              document.querySelector(
                `#checkboxb${
                  this.limitedStages[stgIndex][this.stage_append_key]
                }${index}`
              ).checked = false;
              this.bulkIds[
                this.limitedStages[stgIndex][this.stage_append_key]
              ].splice(
                this.bulkIds[
                  this.limitedStages[stgIndex][this.stage_append_key]
                ].findIndex(e => e == item[this.item_append_key]),
                1
              );
            }
          });
        }
      }

      this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]] = [
        ...new Set(
          this.bulkIds[this.limitedStages[stgIndex][this.stage_append_key]]
        )
      ];

      this.$emit("bulkChkboxChange", data);
    }, */

    /**
     * @return {Number} -Index of stage
     * @param {Number} id -Value of stage
     */
    get_stgIndex_byId: function (id) {
      return this.stages.findIndex(item => item[this.stage_append_key] === id);
    },

    /**
     * Get Stage data from stage_url
     */
    getdata_byStage_url: function () {
      this.bulkIds = {};
      if (this.stage_url) {
        fetch(this.stage_url, {})
          .then(res => res.json())
          .then(res => {
            // If (res.length) {
            this.stages = res;
            console.log('get from stage url ', this.stages);
            this.get_blocks_from_stages();
            this.display_view_portStgs();
            // }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {});
      } else if (this.stages_data) {
        this.stages = this.stages_data;
        this.get_blocks_from_stages();
        this.display_view_portStgs();
      }
    },

    /**
     * Set number of stages to display
     */
    display_view_portStgs: function () {
      this.leftlength = 0;
      this.right_length = 4;
      this.limitedStages = [];
      // This.limitedStages = this.stages.slice(this.leftlength, this.right_length);
      this.limitedStages = this.stages;
      this.stages_loaded = true;
      this.has_empty_state_slot(this.stages);
    },

    /**
     * Triggers on click of right arrow
     * Displays new stage to right if exists
     */
    arrow_right () {
      this.leftlength = this.leftlength + 1;
      this.right_length = this.right_length + 1;
      this.limitedStages = this.stages.slice(
        this.leftlength,
        this.right_length
      );
    },

    /**
     * Triggers on click of left arraow
     * Displays new stage to left if exists
     */
    arrow_left () {
      this.leftlength = this.leftlength - 1;
      this.right_length = this.right_length - 1;
      this.limitedStages = this.stages.slice(
        this.leftlength,
        this.right_length
      );
    },

    /**
     * Append dynamic class based on data
     * @param {Array} data -Stages data
     */
    has_empty_state_slot (data) {
      if (!data.length) {
        this.main_class = 'd-flex m-0 custom-kb-view w-100';
        return !!this.$slots.empty_state;
      } else {
        this.main_class = 'd-flex m-0 custom-kb-view';
      }
      console.log('main calss is -- ', this.main_class);
    },
    /**
     * Return all the object of kanban view as bulkactions
     */
    get_bulk_selected () {
      this.selected = [];
      this.limitedStages.forEach((obj, index) => {
        // Console.log(obj,index);
        document.querySelector(
          `#checkboxs${
            this.limitedStages[index][this.stage_append_key]
          }${index}`
        ).checked = true;
        this.$refs.acCollections[index].actual_data.forEach(object => {
          this.selected.push(object);
        });
      });
      this.$emit('bulk_select', this.selected);
    }
  }
};
</script>

<style scoped>
.disabled-arrows {
  pointer-events: none;
  color: "#fff";
}
</style>

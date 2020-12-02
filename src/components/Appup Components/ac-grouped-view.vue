<template>
    <div>
        <div class="table-responsive" v-if="loaded_data && stages && stages.length">
            <table class="table border" v-if="view == 'table'">
                <thead :class="header_class">
                    <tr>
                        <!-- Check for bluk prop -->
                        <th scope="col" :class="checkbox_class">
                            <b-form-checkbox v-if="bulk" v-model="select_all" @change="bulk_actions($event)" />
                        </th>
                        <!-- Render the table header labels -->
                        <template v-for="(table_column, index) in table_columns">
                            <th scope="col" :class="rclass + table_column.class" :key="index">
                                <div v-if="table_column.label">{{ table_column.label }}</div>
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody
                   @drop.stop="on_drop($event,stg_key)"
                   @dragover.stop="on_drag_over"
                   v-for="(value, stg_key) in stages" :key="key + '_' + render_count+value?'':''"  >
                    <tr>
                        <!-- Check for group wise bluk actions prop -->
                        <td v-if="grouped_bulk">
                            <b-form-checkbox v-model="group_form[value[item_append_key]]" @change.native="grouped_bulk_actions(value)" />
                        </td>
                        <td :colspan="col_span" class="align-middle">
                            <!-- Use this slot group_header for each item in response -->
                            <slot name="group_header" :groupItem="{name:value[stage_append_key],id:value[item_append_key]}"></slot>
                        </td>
                    </tr>
                    <template v-if="value.actual.length == 0">
                        <tr>
                            <td :colspan="col_span+1" class="align-middle">
                                <!-- Use this slot group_header for each item in response -->
                                <slot name="empty_group"></slot>
                            </td>
                        </tr>
                    </template>
                    <!-- if data availble renders data value.actual -->
                    <template v-else>
                        <tr
                            :draggable="enable_drag"
                            @dragstart.stop="on_drag_start($event,key,innerObject,stg_key)"
                            v-for="(innerObject, key) in value.actual" :key="key">
                            <td scope="col" class="align-middle" v-if="bulk || grouped_bulk">
                                <!-- checkbox display -->
                                <b-form-checkbox v-model="selected" :value="innerObject" @change.native="checkbox_click(innerObject)" />
                            </td>
                            <template v-for="(column, index) in columns">
                                <td scope="col" class="align-middle" @click="$emit('row-clicked',innerObject)" @dblclick="$emit('row-dblclicked',innerObject)" :key="index">
                                    <div>
                                        <!-- column slot -->
                                        <slot :name="column.key" :item="innerObject">{{innerObject[column.key]}}</slot>
                                    </div>
                                </td>
                            </template>
                            <td scope="col" class="align-middle" v-if="dropdown">
                                <!-- ellipsis slot -->
                                <slot name="option" :data="{item:innerObject,index:key}">
                                    <ac-material-dropdown
                                        :options="dropdown_options_handler"
                                        :button_options="dropdown_button_options"
                                        :right="dropdown_button_options.right"
                                        :show_icon="show_dropdown_icons"
                                        @item_click="on_dropdown_item_click($event, innerObject,key,stg_key)"
                                    />
                                </slot>
                            </td>
                        </tr>
                        <!-- Render loadmore button for pagination  -->
                        <tr>
                            <div v-if="pagination_type === 'loadMore' && load_more_type == 'loadMoreButton'" ref="loader_div" class="load-more text-center">
                                <slot name="load_more_button">
                                    <button type="button" class="btn btn-link" :class="load_option(value) ?'d-none':''" @click="loadmore_click_fun(value,stg_key)">Load More...</button>
                                </slot>
                            </div>
                        </tr>
                    </template>
                </tbody>
            </table>
            <!-- Card View -->
            <div v-if="view == 'card'">
                <div
                 @drop.stop="on_drop($event,stg_key)"
                 @dragover.stop="on_drag_over"
                 v-for="(value, stg_key) in stages" :key="stg_key + '_' + render_count">
                    <div class="media ml-1 align-items-center">
                        <b-form-checkbox v-if="grouped_bulk && value.actual.length != 0" v-model="group_form[value[item_append_key]]" @change.native="grouped_bulk_actions(value)" />
                        <div class="media-body">
                            <slot name="group_header" :groupItem="{name:value[stage_append_key],id:value[item_append_key]}"></slot>
                        </div>
                    </div>
                    <template v-if="value.actual.length == 0">
                        <div class="align-middle">
                            <!-- Use this slot group_header for each item in response -->
                            <slot name="empty_group"><div class="card-body p-3">Drag Here</div></slot>
                        </div>
                    </template>
                    <!-- Use this slot for body, If this slot is used then card-header, card-body, card-footer slots will be ignored.  -->
                    <slot name="body" :data="value.actual">
                        <b-row>
                            <b-col
                             :draggable="enable_drag"
                             @dragstart.stop="on_drag_start($event,key,innerObject,stg_key)"
                             v-for="(innerObject, key) in value.actual" :key="key" :class="response_class">
                                <div class="card h-100 card-head-bg w-100">
                                  <div class="card-header d-flex align-items-center justify-content-between" v-if="check_card_header">
                                    <div class="media align-items-center">
                                      <b-form-checkbox v-if="grouped_bulk || bulk" v-model="selected" :value="innerObject" @change.native="checkbox_click(innerObject)" />
                                       <div class="media-body">
                                         <slot name="card_header" :item="innerObject"></slot>
                                       </div>
                                    </div>
                                    <div class="" v-if="dropdown">
                                      <slot name="option" :data="{item:innerObject,index:key}">
                                        <ac-material-dropdown
                                            :options="dropdown_options_handler"
                                            :button_options="dropdown_button_options"
                                            :right="dropdown_button_options.right"
                                            :show_icon="show_dropdown_icons"
                                            @item_click="on_dropdown_item_click($event, innerObject,key,stg_key)"
                                        />
                                        </slot>
                                    </div>
                                </div>
                                    <div class="card-body d-flex align-items-center justify-content-between">
                                        <div class="media">
                                            <b-form-checkbox v-if="(grouped_bulk || bulk) && !$scopedSlots['card_header']" v-model="selected" :value="innerObject" @change.native="checkbox_click(innerObject)" />
                                            <div class="media-body">
                                                <slot name="card_body" :item="innerObject">
                                                    <h5 class="card-title">
                                                        <slot name="card_title" :item="innerObject"></slot>
                                                    </h5>
                                                    <h6 class="card-subtitle mb-2">
                                                        <slot name="card_subtitle" :item="innerObject"></slot>
                                                    </h6>
                                                </slot>
                                            </div>
                                            </div>
                                            <div class="" v-if="dropdown && !$scopedSlots['card_header']">
                                              <slot name="option" :data="{item:innerObject,index:key}">
                                                <ac-material-dropdown
                                                    :options="dropdown_options_handler"
                                                    :button_options="dropdown_button_options"
                                                    :right="dropdown_button_options.right"
                                                    :show_icon="show_dropdown_icons"
                                                    @item_click="on_dropdown_item_click($event, innerObject,key,stg_key)"
                                                />
                                                </slot>
                                            </div>
                                    </div>
                                    <div class="card-footer" v-if="!!$scopedSlots['card_footer']">
                                      <slot name="card_footer" :item="innerObject"></slot>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>
                        <div v-if="pagination_type === 'loadMore' && load_more_type == 'loadMoreButton'" ref="loader_div" class="load-more text-center">
                                <slot name="load_more_button">
                                    <button type="button" class="btn btn-link" :class="load_option(value) ?'d-none':''" @click="loadmore_click_fun(value,stg_key)">Load More...</button>
                                </slot>
                            </div>
                    </slot>
                </div>
            </div>
        </div>
        <!-- loader image -->
        <div v-else-if="is_loading" class="loader row">
            <img :src="loading_image" class="loader__image m-auto" alt="loader" />
        </div>

        <!-- Empty state slot -->
        <div class="empty_state_class w-100" v-if="stages && !stages.length && loaded_data">
            <slot name="empty_state"></slot>
        </div>
    </div>
</template>

<script>
import AppData from '../../mixins/ac-data';
import MaterialDropdown from './ac-material-dropdown'
// Import group by from lodash
const _groupBy = require('lodash.groupby');
/**
 * Ac grouped table component used to display data from API in grouped table view
 *
 * Fires event on row click and row double click
 * @event row_clicked
 * @event row_dblclicked
 * @type {object} row data
 *
 * @event checkbox_clicked
 * @type {object} row data
 *
 * @author Reshma
 */

export default {
  components: { 'ac-material-dropdown': MaterialDropdown },
  name: 'ac-grouped-view',
  mixins: [AppData],
  props: {
    view: {
      type: String
    },
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
     * List of table columns.
     * @param {array} columns
     * @properties {"label": {"type": "String","description":"Give label name of table header"}, "key": {"type": "String","description":"Give key name from the data"}, "sortable": {"type": "Boolean","description":"Give true or false for sort option"}, "__slot__": {"type": "String","description":"write HTML code and data-scope:item"}}
     * @label Columns
     * @category_name 1_General
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * Whenever true show checkbox in the first column
     * @param {boolean} bulk
     * @label Bulk
     * @category_name 1_General
     */
    bulk: {
      type: Boolean,
      default: false
    },
    /**
     * Whenever true show checkbox for every group
     * @param {boolean} grouped_bulk
     * @label Grouped Bulk
     * @category_name 1_General
     */
    grouped_bulk: {
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
     * Options for dropdown menu for each row
     * @param {object} dropdown_options
     * @properties {"label": {"type": "String","description":"Give label name of option"}, "type": {"type": "String", "description":"Type of the option Eg:edit,submit..etc"}, "icon": {"type": "String", "description":"Give icon class for option"},
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
      required: false
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
     * Dropdown Button Options is a object with keys icon, variant, size, right. It shows three dots based upon icon in each row
     * @param {object} dropdown_button_options
     * @properties
        {
          "icon": {"type": "String", "default": "fas fa-ellipsis-v","description":"Give button icon class"},
          "variant": {"type": "String", "default": "outline-secondary","description":"Give variant class for button", "values": ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "outline-primary", "outline-secondary", "outline-success", "outline-danger", "outline-warning", "outline-info", "outline-light", "outline-dark"]},
          "size": {"type": "String", "default": "sm", "description":"Give size of the button Eg:sm,lg,md", "values": ["sm", "md", "lg"]},
          "right": {"type": "Boolean", "default": "true" , "description":"To display dropdown options right or left"}
        }
     * @label Dropdown Button Options
     * @category_name 1_General
     */
    dropdown_button_options: {
      type: Object,
      required: false
    },
    /**
     * Data from every request will be grouped with this key
     * @param {string} group_key
     * Required
     * @label Group Key
     * @category_name 1_General
     */
    group_key: {
      type: String,
      required: false
    },
    /**
     * Type of pagination
     * @param {string} pagination_type
     * @properties {"label":"Pagination Type", "type": "List", "default": "deselect", "values": ["deselect","pagination", "loadMore","scroll"]}
     * @default "deselect"
     * 'deselect, pagination, loadMore'
     * @label Pagination Type
     * @category_name 3_Advanced
     */
    pagination_type: {
      type: String,
      default: 'deselect',
      validator: value =>
        ['deselect', 'pagination', 'loadMore', 'scroll'].indexOf(value) !== -1
    },
    /**
     * If true displays loader image
     * @param {string} is_loading
     * @label Display Loader
     * @category_name 4_Style
     */
    is_loading: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * Type of loading more information
     * @param {string} load_more_type
     * @properties {"label":"Load More Type", "type": "List", "default": "deselect", "values": ["deselect","loadMoreButton", "infiniScroll"]}
     * @default loadMoreButton
     * 'loadMoreButton, infiniScroll'
     * @label Load More Type
     * @category_name 3_Advanced
     */
    load_more_type: {
      type: String,
      default: 'loadMoreButton',
      validator: value =>
        ['deselect', 'loadMoreButton', 'infiniScroll'].indexOf(value) !== -1
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
     * When pagination is true displays the rows based on limit
     * @param {Number} limit
     * @label Limit
     * @category_name 3_Advanced
     * @private
     */
    limit: {
      type: Number,
      required: false
    },
    /**
     * When pagination is true limit should apply for which key in ac_cursor
     * @param {Number} limit_key
     * @label Limit Key
     * @category_name 3_Advanced
     * @private
     */
    limit_key: {
      type: String,
      required: false
    },
    /**
     * When pagination is true offset should apply for which key in ac_cursor
     * @param {Number} offset_key
     * @label Offset Key
     * @category_name 3_Advanced
     * @private
     */
    offset_key: {
      type: String,
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
    /**
     * Whenever true enables the drag and drop functionality
     * @param {boolean} enable_drag
     * @label Enable Drag
     * @category_name 1_General
     */
    enable_drag: {
      type: Boolean,
      default: false
    },
    /**
     * Header class
     * @param {string} header_class
     * Required
     * @label Header Class
     * @category_name 4_Style
     */
    header_class: {
      type: String,
      required: false,
      default: 'bg-light'
    },
    /**
     * Bootstrap class to change UI look Eg. col-12 col-md-12
     * @param {String} responsive_class - bootstrap class to change UI look
     * @label Responsive Class
     * @category_name 4_Style
     */
    responsive_class: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      stages: [],
      render_count: 1,
      loaded_data: false,
      selected: [],
      select_all: false,
      rclass: 'border-bottom-0 text-nowrap ',
      checkbox_class: 'border-bottom-0 text-nowrap ',
      group_form: {},
      offset: 0,
      pagination_status: {},
      drag_from_index: '',
      stage_index_befor_drop: null,
      stage_index_after_drop: null,
      dargged_obj: {}
    };
  },
  watch: {
    stages: {
      handler (val) {
        this.render_count++;
      },
      deep: true
    },
    ac_cursor: {
      handler (val) {
        this.get_blocks_from_stages();
      },
      deep: true
    },
    /* Watcher for checkbox selected */
    selected (newval, oldval) {
      if (this.grouped_bulk) {
        // Making group checkbox checked if we select all the rows one by one
        const selectedGroup = _groupBy(this.selected, this.group_key);
        if (Object.keys(selectedGroup).length > 0) {
          for (var key in selectedGroup) {
            for (var i = 0; i < this.stages.length; i++) {
              if (
                this.stages[i][this.item_append_key] === key &&
                selectedGroup[key].length === this.stages[i].actual.length
              ) {
                this.group_form[key] = true;
                break;
              } else {
                this.group_form[key] = false;
              }
            }
          }
        } else {
          for (const key in this.group_form) {
            this.group_form[key] = false;
          }
        }
      }
      this.select_checkbox(newval);
    }
  },
  created () {
    this.getdata_byStage_url();
  },
  computed: {
    check_card_header () {
      debugger;
      console.log(this.$scopedSlots.card_header)
      return !!this.$scopedSlots.card_header;
    },
    /**
     * Colspan for td
     * @return {Integer}
     */
    col_span () {
      let tdata = this.columns.length + 1;
      if (this.bulk) {
        tdata += 1;
      }
      return tdata;
    },
    /**
     * Returning css class as per users chaoice
     * @return {String}
     */
    response_class () {
      return this.responsive_class + ' ac__item mb-3';
    },
    /**
     * Adds column depending on bulk and dropdown props
     * @private
     */
    table_columns () {
      var cols = [...this.columns];
      // Identifies checkbox or options type
      var checkbox = cols.find(c => c.key === 'checkbox');
      var optionsClass = cols.find(c => c.key === 'options');
      var option = {
        label: 'options',
        key: 'options',
        ...(optionsClass || {})
      };
      if (checkbox || optionsClass) {
        for (var i = 0; i < cols.length; i++) {
          if (cols[i].key === 'checkbox') {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.checkbox_class = this.checkbox_class + checkbox.class;
            cols.splice(i, 1);
          }
          if (cols[i].key === 'options') {
            option.class = optionsClass.class;
            option.width = optionsClass.width;
          }
        }
      }

      if (this.dropdown) {
        const optionIndex = cols.findIndex(c => c.key === 'options');
        if (optionIndex >= 0) {
          cols.splice(optionIndex, 1, option);
        }
      }

      return cols;
    },
    /**
     * Not used
     * Depends on dropdown_options prop
     * If dropdown prop is true - checks for dropdown_options presense
     * @private
     */
    dropdown_options_handler () {
      if (!this.dropdown) return [];

      if (this.dropdown && !this.dropdown_options) {
        console.error(
          'dropdown_options is required when dropdown prop is true'
        );
        return [];
      }

      return [...this.dropdown_options];
    }
  },
  methods: {
    /**
     *  Triggers on being dragged over a valid drop target
     */
    on_drag_over: function (event) {
      event.preventDefault();
    },
    /**
     *  Triggers after drag and drop
     * @param {Object} event -Event
     * @param {Number} stg_key -Index of new Stage
     */
    on_drop: function (event, stgKey) {
      this.stage_index_after_drop = stgKey;

      if (this.stage_index_after_drop === this.stage_index_befor_drop) {
        const tempObj = this.stages[stgKey].actual[this.drag_from_index];
        this.stages[stgKey].actual.splice(this.drag_from_index, 1);
        // eslint-disable-next-line no-undef
        this.stages[stgKey].actual.splice(key, 0, tempObj);
      } else {
        this.stages[this.stage_index_after_drop].actual.unshift(Object.assign({}, this.dargged_obj));
        this.stages[this.stage_index_befor_drop].actual.splice(this.drag_from_index, 1);
      }

      this.render_count++;
      this.$emit('drag-drop', {
        item: this.dargged_obj,
        from_group: this.stages[this.stage_index_befor_drop][this.item_append_key],
        to_group: this.stages[this.stage_index_after_drop][this.item_append_key]
      });
    },
    /**
     * After Drop is confirmed
     */
    on_drag_start: function (event, key, data, stgKey) {
      event.dataTransfer.dropEffect = 'move';
      this.drag_from_index = key;
      this.stage_index_befor_drop = stgKey;
      this.dargged_obj = data;
    },
    /**
     * Disable load more option by comparing dara length
     * @return Integer - Page Number
     * @param {array} value - grouped data
     */
    load_option (value) {
      const p = this.pagination_status[value[this.item_append_key]].page_number;
      const l = parseInt(value.total_count);
      const s = parseInt(this.limit);
      if (l % s !== 0) return p >= Math.floor(l / s);
      else return p >= Math.floor(l / s) - 1;
    },
    /**
     * Execute on checking the checkboxes
     * Fires selected_checkbox event
     * @param {array} newval - selected row data
     */
    select_checkbox (newval) {
      // It fires when checkboxes are selected
      this.$emit('selected_checkbox', newval);
    },
    /**
     * Executes onclick of dropdown option
     * @public
     * @param {string} type - type of click e.g. 'edit'
     * @param {object} item - row info related to clicked dropdown
     */
    on_dropdown_item_click (option, item, index, stgKey) {
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
      } else if (option.handler && this.start) { // Execute appup handler workflow
        let custom = {};
        if (option.handler_params) {
          try {
            custom = JSON.parse(option.handler_params);
          } catch (error) {
            if (typeof option.handler_params === 'object') {
              custom = option.handler_params;
            }
          }
        }
        this.start(option.handler, {
          helper: {
            component: this,
            item: item,
            custom: custom,
            index: index
          }
        });
      }
      // It fires when Dropdown Click
      this.$emit('dropdown_click', {
        type: option.type,
        option,
        item,
        index,
        stg_index: stgKey
      });
    },
    /**
     * Executes on click of checkbox to select all from table header
     * when checkbox is selected saves data in a selected array
     * @public
     */
    bulk_actions (target) {
      this.selected = [];
      if (!this.select_all || target) {
        // Since data is object here, so need to get key
        for (const key in this.stages) {
          this.stages[key].actual.forEach(object => {
            this.selected.push(object);
          });
        }
      }
      // It fires array of checked rows
      this.$emit('bulkaction', this.selected);
    },
    /** F
     * It fires when click on each row checkbox
     * @param  {number} id - id of selected row's data
     */
    checkbox_click (item) {
      // It fires when click on row checkbox
      this.$emit('checkbox_clicked', item);
    },
    /**
     * Executes on click of checkbox to select all grouped data from group header checkbox
     * when checkbox is selected saves data in a selected array
     * @public
     */
    grouped_bulk_actions (value) {
      var item = value.actual;
      // If checkbox checked push the objects in selected array else removes the objects
      if (this.group_form[value[this.item_append_key]]) {
        // To avoid duplicates in selected array when click on each row and bulk check
        for (var i = 0, len = item.length; i < len; i++) {
          for (var j = 0, len2 = this.selected.length; j < len2; j++) {
            if (
              item[i][this.item_append_key] ===
              this.selected[j][this.item_append_key]
            ) {
              this.selected.splice(j, 1);
              break;
            }
          }
        }
        // Push the grouped data in selected
        item.forEach(object => {
          this.selected.push(object);
        });
      } else {
        // Removes groouped data from selected array on checkbox uncheck
        for (let i = 0, len = item.length; i < len; i++) {
          for (let j = 0, len2 = this.selected.length; j < len2; j++) {
            if (
              item[i][this.item_append_key] ===
              this.selected[j][this.item_append_key]
            ) {
              this.selected.splice(j, 1);
              break;
            }
          }
        }
      }
      // Emits on check of grouped bulk actions
      this.$emit('grouped_bulkaction', this.selected);
    },
    /**
     * Onclick of loadmore to load with the new data
     */
    loadmore_click_fun (value, index) {
      this.pagination_status[value[this.item_append_key]].page_number++;
      try {
        this.$set(
          this.pagination_status[value[this.item_append_key]],
          this.offset_key,
          this.pagination_status[value[this.item_append_key]][this.offset_key] +
            parseInt(this.limit)
        );
      } catch (error) {
        console.log(error);
      }
      this.handler_data(value.itemUrl, index, value[this.item_append_key]);
    },
    /**
     * Get data from url and assign to specific group based on index
     * when pgination exist
     */
    async handler_data (url, index, status) {
      const itemData = await this.fetch_data(
        this.appendto_url(url, status),
        'GET',
        {}
      );
      this.stages[index].actual = this.stages[index].actual.concat(
        itemData
      );
      // Change key to force rerender
      this.render_count++;
    },
    /**
     * Get data fro group names from stage url
     */
    getdata_byStage_url () {
      if (this.stage_url) {
        fetch(this.stage_url, {})
          .then(res => res.json())
          .then(res => {
            if (res.length) {
              this.stages = res;
              console.log('get from stage url ', this.stages);
              this.get_blocks_from_stages();
            } else {
              this.is_loading = false;
              this.loaded_data = true;
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {});
      }
    },
    /**
     * Maps grouped wise details for items data, total count, pagination numbers, offset
     */
    async get_blocks_from_stages () {
      // Assign ac_cursor
      this.ac_cursor = typeof this.ac_cursor === 'string' ? JSON.parse(this.ac_cursor) : this.ac_cursor;
      if (Object.keys(this.ac_cursor).length !== 0) {
        var params = []
        Object.keys(this.ac_cursor).forEach((key) => {
          if (this.ac_cursor[key]) {
            params.push(`${key}=${this.ac_cursor[key]}`)
          }
        })
        // Assign ac_cursor params
        const urlHasParams = this.item_url.split('?').length > 1
        const urlParams = params.length ? `${urlHasParams ? '&' : '?'}${params.join('&')}` : params
        this.item_url = `${this.item_url}${urlParams}`
        this.data_count_url = `${this.data_count_url}${urlParams}`
      }

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
        this.stages[i].count_key = this.count_key;
        this.stages = [...this.stages];
        this.group_form[this.stages[i][this.stage_append_key]] = false;
        this.pagination_status[this.stages[i][this.stage_append_key]] = {};
        this.pagination_status[this.stages[i][this.stage_append_key]][
          this.offset_key
        ] = 0;
        this.pagination_status[this.stages[i][this.stage_append_key]].page_number = 0;
      }
      this.get_items_data();
    },
    /**
     *  If pagination is selected then assign limit and offset to the url
     * */
    appendto_url (url, status) {
      if (this.pagination_type === 'loadMore') {
        const urlHasParams = url.split('?').length > 1;
        url = urlHasParams
          ? url +
            '&' +
            this.limit_key +
            '=' +
            this.limit +
            '&' +
            this.offset_key +
            '=' +
            this.pagination_status[status][this.offset_key]
          : url +
            '?' +
            this.limit_key +
            '=' +
            this.limit +
            '&' +
            this.offset_key +
            '=' +
            this.pagination_status[status][this.offset_key];
      }
      return url;
    },
    /**
     * Get the group wise items data and store in actual key of each stage
     */
    get_items_data () {
      Promise.all(
        this.stages.map(obj =>
          fetch(this.appendto_url(obj.itemUrl, obj[this.item_append_key]))
            .then(this.check_status)
            .then(res => res.json())
            .catch(err => {
              console.log(err);
            })
        )
      ).then(data => {
        data.forEach((obj, index) => {
          this.stages[index].actual = obj;
        });
        if (this.pagination_type === 'deselect') { this.loaded_data = true; this.is_loading = false; this.render_count++ };
        if (this.pagination_type === 'loadMore') {
          this.get_total_count();
        }
      });
    },
    /**
     * Get the total count from data_count_url and assign to each group data
     */
    get_total_count () {
      Promise.all(
        this.stages.map(obj =>
          fetch(obj.data_count_url)
            .then(this.check_status)
            .then(res => res.json())
            .catch(err => {
              console.log(err);
            })
        )
      ).then(data => {
        const _this = this;
        data.forEach((obj, index) => {
          if (obj && Array.isArray(obj)) {
            _this.stages[index].total_count = _this.count_key
              ? obj[0][_this.count_key]
              : obj;
          } else if (obj && typeof obj === 'object') {
            _this.stages[index].total_count = _this.count_key
              ? obj[_this.count_key]
              : obj;
          }
          this.loaded_data = true;
          this.is_loading = false;
          this.render_count++;
        });
      });
    },
    /**
     * Check status of response and return resolve or reject
     */
    check_status (response) {
      if (response.ok) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }
  }
};
</script>

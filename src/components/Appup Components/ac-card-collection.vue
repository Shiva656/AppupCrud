<template>
  <div ref="collection_wrapper" :style="{maxHeight: max_height}" :class="add_class" >
    <!-- loader image -->
    <div v-show="is_loading" class="loader row">
      <!--onError is to handle the broken image of loader -->
      <img
        :src="loading_image"
        class="loader__image m-auto"
        :onError="onerror_handle_loader"
        alt="loader"
      >
    </div>
    <!-- Serachbar option -->
    <template v-if="show_searchbar">
      <div class="float-right">
        <b-form-input
          size="sm"
          class="row col-md-4 m-0 my-3 float-right mr-3 form-control form-control-sm"
          @keyup.enter="search_results()"
          @keyup.delete="search_results()"
          v-model="search_value"
          :placeholder="searchbar_placeholder"
        ></b-form-input>
      </div>
    </template>
    <header class="ac-card-collection-header">
      <!-- Use this slot for header -->
      <slot name="header"></slot>
    </header>
    <main class="ac__body">
      <div
        v-if="actual_data && actual_data.length"
        :class="add_body_class"
        @scroll="infiniteScroll"
        :style="{...scroll_style}"
        :key="update_key"
      >
        <!-- Use this slot for body, If this slot is used then card-header, card-body, card-footer slots will be ignored.  -->
        <slot name="body" :data="actual_data">
          <b-row>
            <!-- <b-col v-for="(item,index) in data" :key="index" :class="response_class" :md="column_size"> -->
            <b-col v-for="(item,index) in actual_data" :key="index" :class="response_class">
              <div class="card mb-0 card-head-bg w-100" @click="card_click(item)" @dblclick="$emit('card-dbclick',item)">
               <div class="d-flex align-items-center card-header card-header-flush">
                <div><!-- Use this slot for each card header-->
                  <template v-if="bulk">
                    <b-form-checkbox
                      :class="checkbox_class"
                      class="cursor-pointer"
                      v-model="selected"
                      :value="item"
                      @change.native="checkbox_click(item)"
                    ></b-form-checkbox>
                  </template>
                  <slot name="card_header" :item="item"></slot>
                </div>
                <div><slot name="option" :data="{item:item,index:index}">
                  <ac-material-dropdown
                    v-if="show_dropdown"
                    :options="dropdown_options"
                    :button_options="dropdown_button_options"
                    :right="dropdown_button_options.right"
                    :show_icon="show_dropdown_icons"
                    @item_click="on_dropdown_item_click($event, item,index)"
                  />
                </slot>
                </div>
               </div>
                <!-- Use this slot for each card body-->
                <slot name="card_body" :item="item"></slot>
                <!-- Use this slot for each card footer-->
                <slot name="card_footer" :item="item"></slot>
              </div>
            </b-col>
          </b-row>
        </slot>
      </div>
      <div
        v-if="data && !data.length && data_loaded == true &&  !is_loading"
        class="ac-card-collection-emptystate"
      >
        <!-- Use this slot to show empty state. Whenever data is empty, this slot will be shown.-->
        <slot name="empty_state"></slot>
      </div>
      <!-- pagination option -->
      <template v-if="pagination_type=='pagination'">
        <div class="overflow-auto my-3">
          <!-- Use text in props -->
          <b-pagination
            v-model="page_number"
            align="right"
            :total-rows="total_count"
            :per-page="limit"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            @input="pagenumber_click(page_number)"
          ></b-pagination>
        </div>
      </template>
      <div
        v-show="load_more_type === 'loadMoreButton'"
        v-if="pagination_type === 'loadMore'"
        ref="loader_div"
        class="load-more text-center"
      >
        <!--
          Use this slot for load more button, shown only if load_more_type is 'loadMoreButton'
          and there is more data to fetch
        -->
        <slot name="load_more_button">
          <button
            type="button"
            class="btn btn-link"
            :class="page_number >= load_option ?'d-none':''"
            @click="loadmore_click_fun()"
          >Load More...</button>
        </slot>
      </div>
    </main>
    <footer class="ac-card-collection-footer">
      <!-- Use this slot for footer -->
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
// Import AcCollection from "./ac-collection.vue";

import AppData from '../../mixins/ac-data';
import AppPreload from '../../mixins/ac-preload';
import MaterialDropdown from './ac-material-dropdown'
/**
 * @requires VueBootstrap
 * @requires ac-data.js,ac-preload.js
 * @inherits ac-data,ac-preload
 */
export default {
  name: 'ac-card-collection',
  components: {
    'ac-material-dropdown': MaterialDropdown
  },
  mixins: [AppData, AppPreload],
  props: {
    /**
     * Will statis data instead from url
     * @label Data
     * @category_name 1_General
     */
    static_data: {
      type: Array,
      required: false
    },
    /**
     * Whenever true show checkbox in the card
     * @param {boolean} bulk
     * @label Bulk
     * @category_name 1_General
     */
    bulk: {
      type: Boolean,
      default: false,
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
     * If Show Dropdown is true then only dropdown will be shown
     * @label Show Dropdown
     * @category_name 1_General
     */
    show_dropdown: {
      type: Boolean,
      default: false
    },

    /**
     * Options for dropdown menu for each card
     * @param {object} dropdown_options
     * @properties {"label": {"type": "String","description":"Give label name of option"}, "type": {"type": "String","description":"Type of the option Eg:edit,submit..etc"}, "icon": {"type": "String", "description":"Give icon class for option"},
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
     * Dropdown click button option like ellipsis
     * @param {object} dropdown_button_options
     * @properties
        {
          "icon": {"type": "String", "default": "fas fa-ellipsis-v", "description":"Give button icon class"},
          "variant": {"type": "String", "default": "outline-secondary", "description":"Give variant class for button", "values": ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "outline-primary", "outline-secondary", "outline-success", "outline-danger", "outline-warning", "outline-info", "outline-light", "outline-dark"]},
          "size": {"type": "String", "default": "sm", "description":"Give size of the button Eg:sm,lg,md", "values": ["sm", "md", "lg"]},
          "right": {"type": "Boolean", "default": "true", "description":"To display dropdown options right or left"}
        }
     * @label  Dropdown Button Options
     * @category_name 1_General
     */
    dropdown_button_options: {
      type: Object,
      required: false
    },
    /**
     * To show how many columns for each row, by default it is 3.
     * @label No of Columns
     * @category_name 4_Style
     */
    no_of_columns: {
      type: Number,
      default: 3
    },
    /**
     * To display searchbar, Whenever true show searchbar above the collection.
     * @param {boolean} search bar
     * @label Show Searchbar
     * @category_name 3_Advanced
     */
    show_searchbar: {
      type: Boolean,
      default: false
    },
    /**
     * To change default place holder
     * @param {string} searchbar placeholder
     * @label Searchbar Placeholder
     * @category_name 3_Advanced
     */
    searchbar_placeholder: {
      type: String,
      default: 'Search'
    },
    /**
     * Search Key to perform search action, based on what key search should be performed.
     * @param {String} search key
     * @label Search Key
     * @category_name 3_Advanced
     */
    search_key: {
      type: String,
      required: false
    },
    /**
     * Whenever true, show pagination buttons below the collection.
     * @param {boolean} pagination buttons
     * @label Show Pagination
     * @category_name 3_Advanced
     * @private
     */
    show_pagination: {
      type: Boolean,
      default: false
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
     * When pagination type is true displays the data based on limit
     * @param {Number} limit
     * @label Limit
     * @category_name 3_Advanced
     */
    limit: {
      type: Number,
      required: false
    },
    /**
     * When Show Load More is true limit should append for which key in url
     * @param {Number} limit_key
     * @label Limit Key
     * @category_name 3_Advanced
     */
    limit_key: {
      type: String,
      required: false
    },
    /**
     * Key to apply offset which support url Eg. offset , _start etc
     * @param {Number} offset_key - When pagination is true offset should apply for which key in ac_cursor
     * @label Offset Key
     * @category_name 3_Advanced
     */
    offset_key: {
      type: String,
      required: false
    },
    /**
     * If true displays loader image
     * @param {string} is_loading
     * @label Display Loader
     * @category_name 4_Style
     */
    is_loading: {
      type: Boolean,
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
     * Bootstrap class to change UI look Eg. col-12 col-md-12
     * @param {String} responsive_class - bootstrap class to change UI look
     * @label Responsive Class
     * @category_name 4_Style
     */
    responsive_class: {
      type: String,
      required: false
    },
    /**
     * User defined class, It will add main div of this helper
     * @param {String} main_class
     * @label Main Class
     * @category_name 4_Style
     */
    main_class: {
      type: String,
      required: false,
      default: ''
    },
    /**
     * User defined class, It will add to card body
     * @param {String} body_class
     * @label Body Class
     * @category_name 4_Style
     */
    body_class: {
      type: String,
      required: false,
      default: ''
    },
    /**
     * If it is true show load more option
     * @param {string} show_loadmore
     * @label Show Load More
     * @category_name 3_Advanced
     * @private
     */
    show_loadmore: {
      type: Boolean,
      default: false
    },
    /**
     * When Pagination Type is true give total count of data for loading with limit
     * @param {Number} total_count
     * @label Total Count
     * @category_name 3_Advanced
     */
    total_count: {
      type: Number,
      required: false,
      default: 0
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
     * Max height of component
     * @param {string} max_height
     * @label Maximum Height
     * @category_name 4_Style
     */
    max_height: {
      type: String,
      required: false,
      default: '100%'
    }
  },

  data () {
    return {
      selected: [],
      update_key: 0,
      actual_data: [],
      current_item: null,
      stored_data: [],
      search_value: '',
      offset: 0,
      page_number: '',
      pages: [],
      restrict_call: 0,
      data_loaded: false,
      from_load_more: false
    };
  },

  computed: {
    /**
     * Disable load more option by comparing dara length
     * @return Integer - Page Number
     */
    load_option () {
      const l = parseInt(this.total_count);
      const s = parseInt(this.limit);
      if (l % s !== 0) return Math.floor(l / s);
      else return Math.floor(l / s) - 1;
    },
    // Not usnig
    column_size () {
      return this.no_of_columns >= 1 && 12 % this.no_of_columns === 0
        ? parseInt(12 / this.no_of_columns)
        : 2;
    },
    /**
     * Returning css class as per users chaoice
     * @return {String}
     */
    response_class () {
      return this.responsive_class + ' ac__item mb-3';
    },
    /**
     * To handle the broken image of loader
     * @return {String}
     */
    onerror_handle_loader () {
      if (this.loading_image) {
        return "this.onerror=null;this.src='" + this.loading_image + "';";
      } else { return "this.onerror=null;this.src='https://cdn.500apps.io/images/icons/infinity-loading.png';"; }
    },
    /**
     * Custom class for the component
     * @return {String}
     */
    add_class () {
      return 'ac-card-collection d-flex flex-column ' + this.main_class;
    },
    /**
     * Custom class for the component body slot
     * @return {String}
     */
    add_body_class () {
      return 'ac-card-collection-body b-padding ' + this.body_class;
    },
    /**
     * Getting count of loaded data
     */
    loaded_data_count () {
      debugger;
      // Return this.actual_data.length;
      return parseInt(this.limit) + parseInt(this.offset);
    }
  },

  watch: {
    selected (newval, oldval) {
      this.select_checkbox(newval);
    },
    actual_data: {
      handler () {
        debugger;
      }
    },
    /**
     * To keep tracking changes from user
     */
    ac_cursor: {
      handler (val) {
        this.handler_data();
      },
      deep: true
    },
    body_data (newval, oldval) {
      this.body_data = newval;
    },
    pagination_type (newval, oldval) {
      this.pagination_type = newval;
      this.handler_data();
    },
    show_searchbar (newval, oldval) {
      this.show_searchbar = newval;
      this.handler_data();
    },
    total_count (newval, oldval) {
      this.set_pages();
    },
    static_data: {
      handler (val) {
        this.data = val;
      },
      deep: true
    },
    data: {
      handler (val) {
        debugger;
        this.data_loaded = true;
        if (
          (this.pagination_type === 'loadMore' ||
            this.pagination_type === 'scroll') &&
          this.page_number
        ) {
          // Check for data
          if (this.data && this.data.length) {
            this.actual_data = this.actual_data.concat(this.data);
          } else {
            this.actual_data = this.data;
          }
        } else this.actual_data = this.data;
        // This.data = val;
        this.update_key++;
      },
      deep: true
    }
  },

  created () {
    /**
     * Calling function to get data
     */
    if (this.static_data && this.static_data.length) {
      this.data = this.static_data;
    } else {
      this.data_loaded =
        !!(this.static_data && !this.static_data.length && !this.url);
      this.handler_data();
    }
    this.get_total_data_count();

    if (
      this.pagination_type === 'scroll' &&
      this.load_more_type === 'infiniScroll'
    ) {
      this.scroll_style =
        typeof this.scroll_style === 'string'
          ? JSON.parse(this.scroll_style)
          : this.scroll_style;
    }
  },

  methods: {
    /**
     * Execute selected checkbox
     */
    select_checkbox (newval) {
      // It fires when Row Click
      this.$emit('selected_checkbox', newval);
    },
    /**
     * To get all the bulk ids from data
     */
    get_bulk_selected () {
      // To get all the data selected
      if (this.url) {
        const urlHasParams = this.url.split('?').length > 1;
        if (this.total_count) {
          var url = urlHasParams
            ? this.url + '&' + this.limit_key + '=' + this.total_count
            : this.url + '?' + this.limit_key + '=' + this.total_count;
        }
        // Fetch the data
        fetch(url, {})
          .then(res => res.json())
          .then(res => {
            if (res.length) {
              this.selected = res;
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {});
      }
    },
    /**
     * It fires when click on each row checkbox
     * @param  {number} id - id of selected row's data
     */
    checkbox_click (item) {
      // It fires when click on row checkbox
      this.$emit('checkbox_clicked', {
        item: item,
        checked: event.target.checked
      });
    },
    /**
     * Executes onclick of dropdown options
     * @public
     * @param {string} type - type of click e.g. 'edit'
     * @param {object} item - row info related to clicked dropdown
     */
    on_dropdown_item_click (option, item, index) {
      // Executes multi handler functionality
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
      // Event fires whenever the click on the dropdown
      this.$emit('dropdown_click', {
        type: option.type,
        option,
        item,
        index
      });
    },
    /**
     * Executes on click of card
     * @param {string} item - card data
     */
    card_click (item) {
      this.current_item = item;
      // This event fire whenever the click action on card
      this.$emit('click', item);
    },
    /**
     * Get the data from url
     */
    async handler_data () {
      if (
        this.pagination_type === 'pagination' ||
        this.pagination_type === 'scroll'
      ) {
        this.append_to_ac_cursor();
      }
      // If show loadmore true appends limit and offset key to url
      if (this.pagination_type === 'loadMore') {
        if (!this.from_load_more) {
          this.page_number = 0;
          this.offset = 0;
        }
        // Forming params with limit and offset
        this.append_to_ac_cursor();
        this.from_load_more = false;
      }
      debugger;
      // eslint-disable-next-line no-unused-vars
      const MESSAGE = await this.set_ajax();
      this.stored_data =
        this.pagination_type !== 'loadMore'
          ? this.data
          : this.stored_data.concat(this.data);
    },
    /**
     * Search based on the search_value entered from searchbar
     * @return {Array} - filteres data based on search
     */
    search_results () {
      this.actual_data = this.stored_data.filter(item => {
        if (this.search_value) {
          return item[this.search_key]
            .toLowerCase()
            .includes(this.search_value.toLowerCase());
        } else return this.stored_data;
      });
    },
    /**
     * Get total page numbers to be displayed in UI
     */
    set_pages () {
      const numOfPages = Math.ceil(this.total_count / this.limit);
      for (var i = 1; i <= numOfPages; i++) {
        this.pages.push(i);
      }
    },
    /**
     * Invoke onclick of page number
     * Set offset according to the page number to fetch data
     */
    pagenumber_click (page) {
      this.restrict_call += 1;
      if (page && page != null && this.restrict_call !== 2) {
        this.offset = parseInt(this.limit) * (page - 1);
        this.append_to_ac_cursor();
        this.handler_data();
      }
    },
    /**
     * Appending limit and offset values when pagination is true
     */
    append_to_ac_cursor () {
      this.changed_ac_cursor[this.limit_key] = this.limit;
      this.changed_ac_cursor[this.offset_key] = this.offset;
    },
    /**
     * @function @async get_total_data_count - local function to get count of data from API
     * @public
     */
    async get_total_data_count () {
      if (this.data_count_url && this.data_count_url !== '') {
        const bodyData =
          this.body_data && typeof this.body_data === 'object'
            ? this.body_data
            : JSON.parse(this.body_data);
        const dataCount = await this.fetch_data(
          this.data_count_url,
          this.method,
          bodyData
        );
        if (dataCount && Array.isArray(dataCount)) {
          this.total_count = this.count_key
            ? dataCount[0][this.count_key]
            : dataCount;
        } else if (dataCount && typeof dataCount === 'object') {
          this.total_count = this.count_key
            ? dataCount[this.count_key]
            : dataCount;
        }
      } else {
        console.log('Provide data_count_url to get length of data');
      }
    },
    preventScroll: function () {
      event.stopPropagation();
      event.preventDefault();
    },
    /**
     * Get data when scroll reaches end
     */
    async infiniteScroll (event) {
      if (this.load_more_type === 'infiniScroll') {
        this.preventScroll(event)
        if (
          Math.ceil(event.target.scrollTop) >=
          event.target.scrollHeight - event.target.clientHeight
        ) {
          if (this.loaded_data_count < this.total_count) {
            this.preventScroll(event)
            this.page_number++;
            this.offset = parseInt(this.limit) * this.page_number;
            this.handler_data();
            // Const result = await this.loadmore_click_fun();
            // This.stored_data = this.actual_data.concat(this.data);
          }
        }
      }
    },
    /**
     * Onclick of loadmore to load with the new data
     */
    loadmore_click_fun: function () {
      this.loadmore_icon = true;
      this.page_number++;
      this.from_load_more = true;
      try {
        this.offset += parseInt(this.limit);
      } catch (error) {
        console.log(error);
      }
      this.handler_data();
    }
  }
};
</script>

<style>

</style>

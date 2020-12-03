<template>
  <div class="ac-collection-grouped" :key="render_key">
    <!-- loader image -->
    <div v-if="is_loading" class="loader row">
      <!--onError is to handle the broken image of loader -->
      <img
        :src="loading_image"
        class="loader__image m-auto"
        :onError="onerror_handle_loader"
        alt="loader"
      >
    </div>

    <header class="ac__header">
      <!-- Use this slot for header -->
      <slot name="header"></slot>
    </header>
    <!-- Serachbar option -->
    <div v-if="show_searchbar" class="w-25 grouped_searchbar">
      <b-input-group>
        <b-input
          v-model="search_value"
          :placeholder="searchbar_placeholder"
          @keyup="search_results()"
        />
        <b-input-group-append
          is-text
          class="search-symbol cursor-pointer"
          v-b-tooltip.hover
          :title="(show_tooltip)?tooltip_message:''"
        >
          <i class="fal fa-search" @click="on_input"></i>
        </b-input-group-append>
      </b-input-group>
    </div>
    <main
      class="ac__body"
      :class="{'row m-0':group_as_col}"
      @scroll="infiniteScroll"
      :style="scroll_style"
    >
      <div class="ac__item" :class="columns" v-if="has_default_slot">
        <!-- Use this slot to show default card -->
        <slot name="default_group"></slot>
      </div>

      <div v-for="(value, key) in actual_data" :key="key" class="ac__item" :class="columns">
        <div class="group-header">
          <!-- Use this slot group_header for each item in response -->
          <slot name="group_header" :group-item="value[0]"></slot>
        </div>

        <div class="ac__item__body">
          <!-- Use this slot body for each item in response -->
          <slot name="body" :data="value"></slot>
        </div>

        <!-- Use this slot group_footer for each item in response -->
        <div class="group-footer">
          <slot name="group_footer"></slot>
        </div>
      </div>
      <div class="w-100" v-if="checkfor_empty_state">
        <!-- Use this slot to display something if no data available -->
        <slot name="empty_state"></slot>
      </div>
      <div v-if="loadmore_icon" class="text-center">
        <img
          src="https://cdn.500apps.io/images/icons/loadmore.gif"
          class="loader__image m-auto"
          alt="loading"
        >
      </div>
    </main>

    <div
      v-show="load_more_type === 'loadMoreButton'"
      v-if="pagination_type === 'loadMore' && Object.keys(actual_data).length"
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

    <footer class="ac__footer">
      <!--  Use this slot for footer -->
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
import AppCollection from './ac-collection.vue'
/**
 * Ac Grouped component which can be used to display items in grid, accordion, table
 * @requires VueBootstrap
 * @requires ac-collection.vue
 * @inherits ac-collection,ac-data,ac-preload
 *
 */
export default {
  name: 'ac-collection-grouped',

  extends: AppCollection,

  props: {
    /**
     * Give key name from the data for grouping the data
     * @param {string} group_key - Data from every request will be grouped with this key
     * Required
     * @label Group Key
     * @category_name 1_General
     */
    group_key: {
      type: String,
      required: true
    },
    /**
     * If true displays grouped data as columns wise else row wise
     * @param {boolean} group_col
     * @label Group Columns
     * @category_name 4_Style
     */

    group_col: {
      type: Boolean,
      default: false
    },

    /**
     * Custom class for the grouped columns size Eg.col-md-3
     * @param {string} cols_class
     * @label Columns Classname
     * @category_name 4_Style
     */

    cols_class: {
      type: String,
      required: false
    },

    /**
     * If true displays the default slot data
     * @param {boolean} show_default_group
     * @label Show Default Group
     * @category_name 3_Advanced
     */
    show_default_group: {
      type: Boolean,
      default: false
    },
    /**
     * To display searchbar
     * @param {boolean} search bar - Whenever true show searchbar above the collection table
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
     * Field key to perform search action
     * @param {String} search key - indicates based on what key search should be performed
     * @label Search Key
     * @category_name 3_Advanced
     */
    search_key: {
      type: String,
      required: false
    },
    /**
     * To display tooltip for search icon
     * @param {Boolean} show_tooltip
     * @label Show Tooltip
     * @category_name 3_Advanced
     */
    show_tooltip: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * To display tooltip message search icon
     * @param {string} tooltip_message
     * @label Tooltip Message
     * @category_name 3_Advanced
     */
    tooltip_message: {
      type: String,
      required: false,
      default: 'Search'
    },
  },

  data () {
    return {
      group_as_col: false,
      search_value: '',
      stored_data: [],
      render_key: 0,
    }
  },

  computed: {
    /**
     * Append column class for card
     */
    // eslint-disable-next-line vue/return-in-computed-property
    columns () {
      if (this.group_as_col) { return this.cols_class ? this.cols_class : 'col-md-3' }
    },
    // HasHeaderslot() {
    //   Return !!this.$slots.header
    // },
    /**
     * To display load more slot on condition
     */
    has_loadmore_slot () {
      return !!this.$slots.load_more_button
    },
    // HasFooterslot() {
    //   Return !!this.$slots.footer
    // },
    // HasGroupheaderslot() {
    //   Return !!this.$slots.group_header
    // },
    // HasGroupfooterslot() {
    //   Return !!this.$slots.group_footer
    // },
    /**
     * To display default slot when data available and show_default_option true
     * @return {Boolean} - True or False
     */
    has_default_slot () {
      if (
        this.show_default_group &&
        (this.actual_data && Object.keys(this.actual_data).length)
      ) return true
      return false
    },
    /**
     * To display empty state slot on condition
     * @return {Boolean} - True or False
     */
    checkfor_empty_state () {
      return (
        this.actual_data &&
        !Object.keys(this.actual_data).length &&
        this.data_loaded === true &&
        !this.is_loading
      )
    },
    /**
     * To handle the broken image of loader
     * @return {String} - loading image
     */
    onerror_handle_loader () {
      if (this.loading_image) {
        return `this.onerror=null;this.src='${this.loading_image}';`
      } return "this.onerror=null;this.src='https://cdn.500apps.io/images/icons/infinity-loading.png';"
    },
  },

  created () {
    if (this.group_col) {
      this.group_as_col = true
    }
  },
  watch: {
    actual_data: {
      handler (newVal, oldVal) {
        this.actual_data = newVal
      },
      deep: true
    },
    data: {
      handler (val) {
        this.is_loading = false;
        if ((this.pagination_type === 'loadMore' ||
              this.pagination_type === 'scroll') &&
            this.page_number) {
          this.store_original_data = this.store_original_data.concat(this.original_data);
        } else {
          this.store_original_data = this.original_data;
        }
        this.actual_data = this.group_array(this.sort_array(this.store_original_data)); ;
        // This.actual_data = this.data;
      },
      deep: true
    },
  },
  methods: {
    /**
     * Executes to form the data as grouped based on group key
     */
    get_grouped_data () {
      this.actual_data = this.group_array(this.static_data)
    },
    /**
     * Search based on the search_value entered from searchbar
     * @return {Array} - filteres data based on search
     */
    search_results () {
      const SEARCHDATA = []
      for (const key in this.original_data) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.original_data.hasOwnProperty(key)) {
          SEARCHDATA.push(this.original_data[key])
        }
      }
      this.stored_data = SEARCHDATA.filter((item) => {
        if (this.search_value) {
          return item[this.search_key]
            .toLowerCase()
            .includes(this.search_value.toLowerCase())
        } return SEARCHDATA
      })
      this.actual_data = this.group_array(this.sort_array(this.stored_data))
    },
    /**
     * Executes on click of searchbar icon and emits event
     */
    on_input () {
      this.$emit('search_button_click', this.search_value)
    },
  },
}
</script>

<style>

.loader {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.65);
}

.px-custom-card {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.grouped_searchbar {
  position: absolute;
  top: -9px;
  right: 45px;
  z-index: 1;
}
</style>

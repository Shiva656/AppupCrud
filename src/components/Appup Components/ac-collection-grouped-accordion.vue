<template>
  <div class="app-collection grouped accordion">
    <!-- loader image -->
    <div v-show="is_loading" class="loader">
      <img :src="loading_image" class="loader__image" alt="loader" />
    </div>

    <header class="ac__header">
      <!-- Use this slot for header -->
      <slot name="header"></slot>
    </header>

    <main class="ac__body container-fluid p-0">
      <div v-for="(value, key) in actual_data" :key="key" class="ac__item card border mb-3 rounded">
        <div class="group-header">
          <!--  Use this slot group_header for each item in response -->
          <slot name="group_header" :group-item="value[0]"></slot>
        </div>

        <div class="ac__item__body">
          <b-card-body class="p-0">
            <div class="card-header px-3 bg-transparent">
              <b-button
                block
                class="text-left p-0"
                variant="transparent"
                v-b-toggle="`accordion${key+group_key+value[0][group_key]}`"
                @click="show_collapse_class(key)"
              >
                <span class="when-opened float-right text-muted">
                  <i class="fas fa-chevron-up"></i>
                </span>
                <span class="when-closed float-right text-muted">
                  <i class="fas fa-chevron-down"></i>
                </span>
                <!-- Use this slot group_accordian_label for each item in response -->
                <slot name="group_accordion_label" :group-item="value[0]"></slot>
              </b-button>
            </div>
            <b-collapse
              :id="`accordion${key+group_key+value[0][group_key]}`"
              accordion="my-accordion"
              role="tabpanel"
              :class="append_class(key) ? 'active-accordion' : ''"
              :visible="visible_accordian"
            >
              <!-- Use this slot body for each item in response -->
              <slot name="body" :data="value"></slot>
            </b-collapse>
          </b-card-body>
        </div>

        <div class="group-footer">
          <!-- Use this slot group_footer for each item in response -->
          <slot name="group_footer"></slot>
        </div>
      </div>
      <!-- pagination option -->
      <template v-if="show_pagination">
        <div class="my-3 float-right">
          <b-button
            class="mr-2"
            variant="outline-secondary"
            :disabled="page_number === 0"
            @click="prev_page"
          >
            <i class="fal fa-angle-left fa-lg"></i>
          </b-button>
          <b-button
            class
            variant="outline-secondary"
            :disabled="page_number >= page_count"
            @click="next_page"
          >
            <i class="fal fa-angle-right fa-lg"></i>
          </b-button>
        </div>
      </template>
    </main>
    <div v-if="checkfor_empty_state">
      <!-- Use this slot to display something if no data available -->
      <slot name="empty_state"></slot>
    </div>
    <div
      v-show="load_more_type === 'loadMoreButton'"
      ref="loader_div"
      class="load-more text-center mt-2"
    >
      <!-- Slot for load more buttom, shown only if load_more_type is 'loadMoreButton' -->
      <slot name="load_more_button"></slot>
    </div>

    <footer class="ac__footer">
      <!-- Use this slot for footer -->
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
import AppCollection from './ac-collection.vue';
/**
 * Ac Grouped component which can be used to display items in grid, accordion, table
 * @requires VueBootstrap
 * @requires ac-collection.vue
 * @inherits ac-collection,ac-data
 *
 */
export default {
  name: 'ac-collection-grouped-accordion',

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
     * Whenever true show pagination buttons
     * @param {boolean} pagination buttons
     * @label Show Pagination
     * @category_name 3_Advanced
     */
    show_pagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show_collapse: 1,
      offset: 0,
      page_number: 0,
      actual_data: []
    };
  },
  watch: {
    data: {
      handler (val) {
        this.actual_data = val;
      },
      deep: true
    }
  },
  computed: {
    /**
     * To make accordion label active
     * @return {Boolean} - True or False
     */
    visible_accordian () {
      var count = 0;
      if (count === 0) {
        return true;
        // eslint-disable-next-line no-unreachable
        count++;
      } else {
        return false;
      }
    },
    // HasHeaderslot() {
    //
    //     Return !!this.$slots.header
    // },
    /**
     * To display empty state slot on condition
     * @return {Boolean} - True or False
     */
    checkfor_empty_state () {
      return this.actual_data && !Object.keys(this.actual_data).length && !this.is_loading;
    },
    /**
     * Diabling previous and next buttons based on data length
     * @return {Integer} - pagination number
     */
    page_count () {
      const l = this.total_count;
      const s = this.limit;
      return Math.floor(l / s);
    }
  },
  created () {
    this.handler_data();
  },
  methods: {
    /**
     * Get collapsed label reference key
     */
    show_collapse_class (keyRef) {
      this.show_collapse = keyRef;
    },
    /**
     * Append dynamic class for collapsed label using reference key
     * @return {Boolean} - True or False
     */
    append_class (key) {
      // eslint-disable-next-line eqeqeq
      if (this.show_collapse == key) return true;
      else return false;
    },
    /**
     * Get data from url
     */
    async handler_data () {
      if (this.show_pagination) {
        this.append_to_ac_cursor();
      }
      // eslint-disable-next-line no-unused-vars
      const msg = await this.set_ajax();
      // This.actual_data = this.data;
    },
    /**
     * Invoke by clicking on next button when pagination is true
     * increments page number and offset value
     */
    next_page () {
      this.page_number++;
      this.offset += JSON.parse(this.limit);
      this.append_to_ac_cursor();
      this.handler_data();
    },
    /**
     * Invoke by clicking on previous button when pagination is true
     * decrement pagenumber and offset value
     */
    prev_page () {
      this.page_number--;
      this.offset -= JSON.parse(this.limit);
      this.append_to_ac_cursor();
      this.handler_data();
    },
    /**
     * Appending limit and offset values when pagination is true
     */
    append_to_ac_cursor () {
      this.ac_cursor[this.limit_key] = this.limit;
      this.ac_cursor[this.offset_key] = this.offset;
    }
  }
};
</script>

<style>
.ac__item {
  flex-direction: column;
}

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
.collapsed .fa-angle-up {
  transform: rotate(180deg);
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
</style>

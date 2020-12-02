<template>
  <div>
    <b-dropdown
      :split="split"
      :size="size"
      :split-variant="split_variant"
      :variant="variant"
      :split-href="split_href"
      :split-button-type="split_button_type"
      :text="dropdown_header"
      :class="dropdown_header_class"
      :no-caret="no_caret"
      :lazy="lazy"
    >
      <b-dropdown-item
        v-for="(item, index) in JSON_data"
        :key="index"
        :href="item.link"
        @click.passive="get_data(item)"
      >
        <span v-if="item.key && item.__slot__">
          <slot :name="item.key" :data="from_data"></slot>
        </span>
        {{item.label}}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
/**
 * Ac dropdown component which can be used to disply normal/split dropdown
 * @author Dharma teja TV
 */
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
export default {
  name: 'ac-dropdown',
  props: {
    /**
     * Url to fetch dropdown items
     * @param {String} - url
     * @category_name 1_General
     * @label Url
     */
    url: {
      type: String,
      required: false
    },
    /**
     * Base_url
     * @param {string} base_url
     * @label Base URL
     * @category_name 1_General
     */
    base_url: {
      type: String,
      required: false
    },
    /**
     * Dropdown items
     * @param {object} options - Options for dropdown menu for each row
     * @properties {"label": {"type": "String"}, "link": {"type": "String"},"key":{"type": "String"}, "__slot__": {"type": "String"},"handler_name": {"type": "String"}, "handler_params": {"type": "String"}}
     * @label Items
     */
    items: {
      type: Array,
      required: false
    },
    /**
     * Split button is shows when split is true
     * @param {String} split
     * @category_name 3_Advanced
     * @label Split
     */
    split: {
      type: Boolean,
      required: true,
      default: false
    },
    /**
     * Link for left split button when split prop is true
     * @param {String} split_href
     * @category_name 3_Advanced
     * @label Split href
     */
    split_href: {
      type: String,
      required: false
    },
    /**
     * Header for dropdown
     * @param {String} dropdown_header
     * @category_name 2_Data
     * @label Dropdown header
     */
    dropdown_header: {
      type: String,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: false
    },
    /**
     * Header for dropdown
     * @param {String} dropdown_header_class
     * @category_name 4_Style
     * @label Dropdown header class
     */
    dropdown_header_class: {
      type: String,
      required: false,
      default: 'm-2'
    },
    /**
     * Left side Button type, like submit and button
     * @param {String} split_button_type
     * @category_name 3_Advanced
     * @label Split button type
     */
    split_button_type: {
      type: String,
      required: false
    },
    /**
     * Size of the button
     * @param {String} size
     * @category_name 3_Advanced
     * @label Size
     */
    size: {
      type: String,
      required: false
    },
    /**
     * Dropdown color variant
     * @param {String} variant
     * @category_name 4_Style
     * @label Variant
     */
    variant: {
      type: String,
      required: false
    },
    /**
     * Split button color variant when split is true
     * @param {String} split_variant
     * @category_name 4_Style
     * @label Split variant
     */
    split_variant: {
      type: String,
      required: false
    },
    /**
     * Hidden caret
     * @param {Boolean} no_caret
     * @category_name 3_Advanced
     * @label No caret
     */
    no_caret: {
      type: Boolean,
      required: false
    },
    /**
     * Lazy is true then dropdown items are not loaded in DOM, it will be loaded when header is selected  ref-https://bootstrap-vue.js.org/docs/components/dropdown/#lazy-dropdown
     * @param {Boolean} lazy
     * @category_name 3_Advanced
     * @label Lazy
     */
    lazy: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      JSON_data: []
    };
  },
  created () {
    var _this = this;
    if (_this.url && !_this.items) {
      this.$appupajax
        .get2(
          _this.url,
          {},
          {},
          { withCredentials: true, credentials: 'include' }
        )
        // This.$appupajax.get2(_this.url, {}, { withCredentials: true, credentials: "include" }).
        .then(this.$appupajax.handleResponse)
        .then(response => {
          // Append JSON data to items from url
          _this.JSON_data = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      _this.JSON_data = _this.items;
    }
  },
  methods: {
    /**
     * Trigger item clicked event
     * @param {Object} item -Clicked drorpdown item
     */

    get_data (item) {
      // Pass data using emit
      this.$emit('d_item_clicked', item);
      this.on_item_click(item);
    },
    /**
     * Triggers on dropdown option click
     * @param {Object} item - Data of clicked dropdown item
     */
    on_item_click (item) {
      if (item.handler_name) {
        this.start(item.handler_name, {
          helper: {
            component: this,
            item: item,
            helperParams: this.params ? this.params : {}
          }
        });
        console.log('we call handler here ', { component: this, item: item });
      } else {
        this.item_clicked(item);
      }
    }
  }
};
</script>

<style>
.dropdown-toggle::after {
  margin-left: 0.5rem !important;
}
</style>

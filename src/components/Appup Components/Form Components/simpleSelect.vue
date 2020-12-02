<template>
  <div class="d-flex">
    <b-form-select
      :id="id"
      :name="name"
      class="appup-dropdown"
      :options="dropdownItems"
      :state="state"
      v-model="selected"
      @change="onSelect"
      v-bind="$attrs"
    />
    <i class="fal fa-redo-alt m-2" v-if="refresh_icon == 'true'" @click="fetch_url_data"></i>
  </div>
</template>

<script>
import { AjaxRequests } from '../../../mixins/ajaxRequests';
import { Conversions } from '../../../mixins/conversions';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
// Handlebars
import Handlebars from 'handlebars/dist/handlebars.js';
// eslint-disable-next-line no-unused-vars
const prefixCls = 'appup-dropdown';
/**
 * Appup Dropdown to load static options or dynamic options from API call
 *
 * TODOs:
 *
 * Dynamic Options from API call
 */
export default {
  mixins: [AjaxRequests, Conversions],
  components: {},
  props: {
    /**
     * Id of input elements.
     */
    id: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    /**
     * Options that should be displayed in the dropdown
     *
     * Array should include objects with label & value properties
     */
    options: {
      type: Array,
      required: false
    },
    /**
     * Validation state of the component
     */
    state: {
      type: Boolean,
      required: false,
      default: null
    },
    /**
     * Value for v-model binding. Not to be binded directly
     */
    value: {
      required: false
    },
    /**
     * Url from which data should be populated in dropdown
     */
    url: {
      type: String,
      required: false
    },
    key_value: {
      type: String,
      required: false
    },
    key_label: {
      type: String,
      required: false
    },

    /**
     * Flag to check type of add element or valid the value.
     *
     * `true, false`
     */
    addElement: {
      type: Boolean,
      required: false,
      default: false
    },
    // Use to re render the component
    re_render_key: {
      type: Number,
      default: 0
    },
    refresh_icon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    options (val) {
      this.getData();
    },
    value (newVal, oldVal) {
      this.selected = newVal;
    },
    url (val) {
      console.log('in url watcher');
      if (val) {
        var template = Handlebars.compile(this.url);
        // Compile and assign to this.compileUrl
        let compileData = {};
        compileData = {
          ...window.UIJSON,
          ...this.$route.params,
          ...window.APPUP
        };
        this.compileUrl = template(compileData);
      }
      this.getData();
    }
  },
  data: function () {
    return {
      dropdownItems: [],
      selected: this.value,
      compileUrl: null
    };
  },
  created: function () {
    // Compile based on router context
    if (this.url) {
      this.compile_data();
    }
    // Convert options to b-form-select specific
    this.getData();
    if (this.value) {
      this.selected = this.value;
    } else {
      // Set default values
      this.selected = this.setDefaultValues(this.options);
    }
  },
  methods: {
    onSelect (selected) {
      this.$emit('input', selected);
      if (this.addElement) {
        this.dropdownItems.forEach(element => {
          if (element.value === selected) {
            this.$emit('dropdownChange', element, this.id, 'dropdown');
          }
        });
      }
    },
    loadData () {
      // Get options dropdown with url
      console.log('url', this.url);
      if (this.compileUrl) {
        this.getDropdownData(this.compileUrl, {}, response => {
          this.options = response;
        });
      }
    },
    compile_data () {
      var template = Handlebars.compile(this.url);
      // Compile and assign back to this.url
      let compileData = {};
      compileData = {
        ...window.UIJSON,
        ...this.$route.params,
        ...window.APPUP
      };
      this.compileUrl = template(compileData);
    },
    fetch_url_data: function () {
      this.compile_data();
      this.getData();
    },
    getData () {
      if (this.compileUrl) {
        var that = this;
        console.log(this.url);
        // Axios
        //   .get(this.compileUrl, { withCredentials: true, credentials: "include" })
        //   .then(function(response) {
        // That.$appupajax
        //   .get2(
        //     This.compileUrl,
        //     {},
        //     { withCredentials: true, credentials: "include" }
        //   )
        this.$appupajax
          .get2(
            this.compileUrl,
            {},
            {},
            { withCredentials: true, credentials: 'include' }
          )
          .then(that.$appupajax.handleResponse)
          .then(response => {
            that.dropdownItems = that.convert_Dynamic_Options_To_BootstrapVue_Options(
              response.data,
              that.key_value,
              that.key_label
            );
            if (that.options && that.options.length > 0) {
              that.dropdownItems = that
                .convert_Options_To_BootstrapVue_Options(that.options)
                .concat(that.dropdownItems);
              that.selected = that.setDefaultValues(that.options);
            }
            // Set value after dropdown loaded
            if (that.value) {
              that.selected = that.value;
            }
          });
      } else {
        if (this.options && this.options.length > 0) {
          this.dropdownItems = this.convert_Options_To_BootstrapVue_Options(
            this.options
          );
        }
      }
    }
  }
};
</script>
<style scoped>
.appup-dropdown {
  cursor: pointer !important;
}
</style>

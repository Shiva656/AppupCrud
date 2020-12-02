<template>
  <div :class="{ 'invalid' : isInvalid}">
    <vue-multiselect :id="id" :multiple="true" class="appup-multiselect" v-model="selected.selectedObjects"
      track-by="value" label="text" @input="onInput" :taggable="taggable" @tag="emitTag" :placeholder="placeholder"
      :options="dropdownItems" :searchable="true" v-bind="$attrs">
      <span slot="noResult">{{emptysatemessage}}</span>
    </vue-multiselect>
  </div>
</template>
<script>
// Botstrap specific styles
import './_vue-multiselect-bootstrap4.scss';

import { AjaxRequests } from '../../../mixins/ajaxRequests';
import { Conversions } from '../../../mixins/conversions';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import VueMultiselect from 'vue-multiselect';
import Handlebars from 'handlebars/dist/handlebars.js';

/**
   * Appup Multiselect to load static options or dynamic options from API call
   */
export default {
  name: 'appup-multiselect',
  mixins: [AjaxRequests, Conversions],
  components: {
    VueMultiselect
  },
  props: {
    /**
       * Id of input elements.
       */
    id: {
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
       * To enable tagging functionality
       */
    taggable: {
      type: Boolean,
      required: false,
      default: false
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

    /**
       * Placeholder if needed
       */
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    key_value: {
      type: String,
      required: false
    },
    key_label: {
      type: String,
      required: false
    },
    emptysatemessage: {
      type: String,
      default: 'No data found'
    }
  },
  data: function () {
    return {
      dropdownItems: [],
      selected: {
        selectedObjects: [],
        selectedValues: []
      }
    };
  },
  computed: {
    isInvalid () {
      return !(this.state === null || this.state);
    }
  },
  watch: {
    options: {
      immediate: true,
      handler (val) {
        this.get_options();
      }
    },
    value: {
      immediate: true,
      handler (val = []) {
        this.$set(this.selected, 'selectedValues', val);
        this.set_default_values();
      }
    },
    dropdownItems (val) {
      this.dropdownItems.forEach(obj => {
        if (Object.keys(obj).includes('disabled')) {
          obj.$isDisabled = obj.disabled;
          delete obj.disabled;
        }
      });
    }
  },
  created: function () {
    if (this.url) {
      var template = Handlebars.compile(this.url);
      let compileData = {};
      compileData = {
        ...window.UIJSON,
        ...this.$route.params,
        ...window.APPUP
      };
      this.url = template(compileData);
    }
    this.get_options();
  },
  mounted: function () {
    if (this.url) {
      var that = this;
      that.$appupajax
        .get2(
          that.url,
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
            that.dropdownItems = that.dropdownItems = that
              .convert_Options_To_BootstrapVue_Options(that.options)
              .concat(that.dropdownItems);
          }
          that.set_default_values();
        });
    } else {
      this.set_default_values();
    }
  },
  methods: {
    onInput (val) {
      var selected = val.map(obj => obj.value);
      this.$set(this.selected, 'selectedValues', selected);
      this.$emit('input', this.selected.selectedValues);
    },
    emitTag (tag) {
      this.$emit('add_tag', tag);
    },
    addToOptions (obj) {
      const objArr = [];
      objArr.push(obj);
      this.dropdownItems = this.convert_Dynamic_Options_To_BootstrapVue_Options(
        objArr,
        this.key_value,
        this.key_label
      ).concat(this.dropdownItems);
      if (this.url) {
        this.value.push(obj[this.key_value]);
      } else {
        this.value.push(obj.value);
      }
    },
    get_options () {
      if (this.options && this.options.length > 0 && this.dropdownItems && this.dropdownItems.length > 0) {
        this.dropdownItems = this.convert_Options_To_BootstrapVue_Options(this.options)
          .concat(this.dropdownItems);
      } else if (this.options && this.options.length > 0) {
        this.dropdownItems = this.convert_Options_To_BootstrapVue_Options(
          this.options
        );
      }
    },
    generateModel () {
      this.selected.selectedObjects = [];
      this.selected.selectedValues.forEach(element => {
        this.selected.selectedObjects.push(
          // eslint-disable-next-line eqeqeq
          this.dropdownItems.find(item => item.value == element)
        );
      });
    },
    set_default_values () {
      if (
        this.selected.selectedValues &&
          this.selected.selectedValues.length > 0
      ) {
        this.generateModel();
      // eslint-disable-next-line eqeqeq
      } else if (this.selected.selectedValues && this.selected.selectedValues.length == 0) {
        this.selected.selectedObjects = [];
        this.selected.selectedValues = [];
      } else {
        if (this.dropdownItems) {
          this.set_default_values_multiselect(this.dropdownItems).then(() => {
            // eslint-disable-next-line no-self-assign
            this.selected.selectedObjects = this.selected.selectedObjects;
          });
        }
      }
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
  .multiselect.appup-multiselect {
    cursor: pointer !important;
  }
</style>

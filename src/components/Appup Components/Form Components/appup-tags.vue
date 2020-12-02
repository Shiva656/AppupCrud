<template>
  <div :class="{ 'invalid' : isInvalid}">
    <vue-multiselect
      :id="id"
      :multiple="true"
      :taggable="true"
      class="appup-tags"
      v-model="selectedObjects"
      track-by="text"
      label="text"
      :placeholder="placeholder"
      :options="dropdownItems"
      :searchable="true"
      @tag="addTag"
      @input="emitValue"
      v-bind="$attrs"
    ></vue-multiselect>
  </div>
</template>
<script>
import { AjaxRequests } from '../../../mixins/ajaxRequests';
import { Conversions } from '../../../mixins/conversions';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import VueMultiselect from 'vue-multiselect';

/**
 * Appup Tag component to load static options or dynamic options from API call
 *
 * Tags values are always name based only. Values sent will be comma seperated list of labels received in options.
 *
 * If a new tag is added, then its name will be added to the selected labels.
 */
export default {
  name: 'appup-tags',
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
    }
  },
  data: function () {
    return {
      dropdownItems: [],
      selectedObjects: [],
      selectedValues: this.value
    };
  },
  computed: {
    isInvalid () {
      return !(this.state === null || this.state);
    }
  },
  watch: {
    value (newval, oldval) {
      this.selectedValues = newval;
      this.generateModel();
    }
  },
  created: function () {
    // Convert options to b-form-select specific
    if (this.options && this.options.length > 0) {
      this.dropdownItems = this.convert_Options_To_Multiselect_Options(
        this.options
      );
    }
  },
  mounted: function () {
    if (this.url) {
      var that = this;
      // Axios
      //   .get(this.url, { withCredentials: true, credentials: "include" })
      //   .then(function(response) {
      // That.$appupajax
      // .get2(
      //   This.url,
      //   {},
      //   { withCredentials: true, credentials: "include" }
      // )
      that.$appupajax.get2(that.url, {}, {}, { withCredentials: true, credentials: 'include' })
        .then(that.$appupajax.handleResponse)
        .then(response => {
          that.dropdownItems = that.convert_Dynamic_Options_To_BootstrapVue_Options(
            response.data,
            that.key_value,
            that.key_label
          );
          that.set_default_values();
        });
    } else {
      this.set_default_values();
    }
  },
  methods: {
    emitValue () {
      this.selectedValues = this.selectedObjects.map(obj => obj.value);
      this.$emit('input', this.selectedValues);
    },

    // Method to be invoked on adding a new tag
    addTag (newTag) {
      const tag = {
        text: newTag,
        value: newTag
        // Generate dynamic value for the provided tag
        // Value: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.dropdownItems.push(tag);
      this.selectedObjects.push(tag);
      this.emitValue();
    },
    generateModel () {
      this.selectedObjects = [];
      this.selectedValues.forEach(element => {
        this.selectedObjects.push(
          // eslint-disable-next-line eqeqeq
          this.dropdownItems.find(item => item.value == element)
        );
      });
    },
    set_default_values () {
      if (this.selectedValues && this.selectedValues.length > 0) {
        this.generateModel();
      } else {
        if (this.dropdownItems) {
          this.set_default_values_multiselect(this.dropdownItems).then(
            selectedObjects => {
              console.log('obj is ---', selectedObjects);
              this.selectedObjects = selectedObjects;
              this.emitValue();
            }
          );
        }
      }
    }
  }
};
</script>

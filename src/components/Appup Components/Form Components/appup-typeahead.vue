<template>
  <div :class="{ 'invalid' : isInvalid}">
    <vue-multiselect
      :id="id"
      :multiple="true"
      class="appup-multiselect"
      v-model="selectedObjects"
      track-by="value"
      label="text"
      :placeholder="placeholder"
      :options="dropdownItems"
      :searchable="true"
      @search-change="asyncFind"
      @remove="remove"
      @select="select"
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
      default: 'Enter value ..'
    },
    /**
     *
     * Reference key to be taken from the url data
     * use to display data in dropdown
     */
    key_value: {
      type: String,
      required: false
    },
    /**
     *
     * Referance kye to be taken as label from the url data
     * use to display data in dropdown
     *
     */
    key_label: {
      type: String,
      required: false
    },
    /**
     * QueryParam is to add to url as query parama
     */
    query_param_key: {
      type: String,
      default: 'q'
    },

    /**
     * Respose  data name getting from api hit
     */

    response_key: {
      type: String
    },

    /**
     * Custom query if needed
     */
    custom_query: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      dropdownItems: [],
      selectedObjects: [],
      selectedValues: [],
      hitUrl: ''
    };
  },
  created () {
    var parse = require('url-parse');
    var hit = parse(this.url);
    this.hitUrl = hit.origin + '' + hit.pathname;
    // eslint-disable-next-line eqeqeq
    if (hit.query != '') {
      this.hitUrl = this.hitUrl + '' + hit.query;
    // eslint-disable-next-line eqeqeq
    } else if (this.query_param_key != 'q') {
      this.hitUrl = this.hitUrl + '?' + this.query_param_key + '=';
    } else {
      this.hitUrl = this.hitUrl + '' + '?where=';
    }
  },
  computed: {
    isInvalid () {
      return !(this.state === null || this.state);
    }
  },
  watch: {
    selectedObjects (newValues) {
      this.selectedValues = newValues.map(obj => obj.value);
      this.$emit('input', this.selectedValues);
    }
  },
  methods: {
    remove (removedOption, id) {
      this.$emit('remove', removedOption, id);
    },

    select (selectedOption, id) {
      this.$emit('select', selectedOption, id);
    },

    asyncFind (query) {
      if (this.url) {
        var _this = this;
        let url = this.hitUrl;
        if (this.custom_query) {
          url += "'%" + query + "%'";
        } else {
          url = this.hitUrl + '' + query;
        }
        url = encodeURI(url);
        // Axios.get(url, { withCredentials: true, credentials: 'include' }).then(function(response) {
        // _this.$appupajax
        //   .get2(
        //     Url,
        //     {},
        //     {
        //       WithCredentials: true,
        //       Credentials: "include"
        //     }
        //   )
        _this.$appupajax.get2(url, {}, {}, { withCredentials: true, credentials: 'include' })
          .then(_this.$appupajax.handleResponse)
          .then(response => {
            if (_this.response_key) {
              // eslint-disable-next-line no-new-object
              const responseObject = new Object();
              responseObject[_this.response_key] = response.data;
              response.data = responseObject;
            }
            _this.dropdownItems = _this.convert_Dynamic_Options_To_BootstrapVue_Options(
              response.data,
              _this.key_value,
              _this.key_label
            );
          });
      }
    }
  }
};
</script>

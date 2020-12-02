<template>
  <div>
    <b-form-checkbox-group
      :id="id"
      class="appup-checkbox"
      :options="checkboxGroupOptions"
      :state="state"
      v-model="selected"
      @change="onSelect"
    ></b-form-checkbox-group>
  </div>
</template>
<script>
import { Conversions } from '../../../mixins/conversions'
// Import { Conversions } from "../../mixins/conversions";
import Handlebars from 'handlebars/dist/handlebars.js';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';

/**
 * Appup Checbox - Can be used for single or group checboxes
 */
export default {
  name: 'appup-checkbox',
  mixins: [Conversions],
  components: {},
  props: {
    /**
     * Id of input elements.
     */
    id: {
      type: String,
      required: false
    },

    /**
     * Options that should be displayed in checkbox group
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
     * Url from which data should be populated in checkbox
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
    }
  },
  data: function () {
    return {
      checkboxGroupOptions: [],
      selected: this.value === '' ? [] : this.value // Must be an array reference!
    };
  },
  created: function () {
    // Compile based on router context
    if (this.url) {
      var template = Handlebars.compile(this.url);

      // Compile and assign back to this.url
      let compileData = {};
      compileData = {
        ...window.UIJSON,
        ...this.$route.params,
        ...window.APPUP
      };
      this.url = template(compileData);
    }
    this.getData();

    if (this.value) {
      this.selected = this.value;
    } else {
      // Set default values
      this.selected = this.setDefaultValues(this.options, 'multiple');
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (typeof newVal === 'undefined') {
        this.selected = [];
      } else {
        this.selected = newVal;
      }
    },
    options (val) {
      this.getData();
    },
    url (val) {
      this.getData();
    }
  },
  computed: {},
  methods: {
    onSelect (selected) {
      this.$emit('input', selected);
      const result = [];
      selected.forEach(item => {
        this.options.forEach(element => {
          if (element.value === item) {
            result.push(element);
          }
        });
      });
      console.log(result);
      this.$emit('checkboxChange', result, this.id, 'checkbox');
    },
    getData () {
      if (this.url) {
        var _this = this;
        console.log(this.url);
        // Axios
        //   .get(this.url, { withCredentials: true, credentials: "include" })
        //   .then(function(response) {
        // _this.$appupajax
        //   .get2(_this.url, {}, { withCredentials: true, credentials: "include" })
        _this.$appupajax.get2(_this.url, {}, {}, { withCredentials: true, credentials: 'include' })
          .then(_this.$appupajax.handleResponse)
          .then(response => {
            _this.checkboxGroupOptions = _this.convert_Dynamic_Options_To_BootstrapVue_Options(
              response.data,
              _this.key_value,
              _this.key_label
            );
            if (_this.options && _this.options.length > 0) {
              _this.checkboxGroupOptions = _this
                .convert_Options_To_BootstrapVue_Options(_this.options)
                .concat(_this.checkboxGroupOptions);
              _this.selected = _this.setDefaultValues(
                _this.options,
                'multiple'
              );
            }
            // Set value after checkbox data loaded
            if (_this.value) {
              _this.selected = _this.value;
            }
          });
      } else {
        if (this.options && this.options.length > 0) {
          this.checkboxGroupOptions = this.convert_Options_To_BootstrapVue_Options(
            this.options
          );
        }
      }
    }
  }
};
</script>

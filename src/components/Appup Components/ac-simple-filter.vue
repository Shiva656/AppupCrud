<template>
  <div>
    <b-button
      :class="button_class"
      v-if="show_filter_button"
      :variant="variant"
      @click="show_filter=!show_filter"
    >
      {{button_label}}
      <i :class="button_icon"></i>
    </b-button>
    <appup-form
      v-if="show_filter"
      :form-json="formJson"
      ref="appupForm"
      :inline="inline"
      :inline-labels="inline_labels"
      v-model="modelJson"
      :form-data="modelJson"
      :form_group_class="form_group_class"
      :button_group_class="button_group_class"
      :direction="direction"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { Workflow } from '../../mixins/workflow';
import AppupForm from './appup-form';

export default {
  components: {
    'appup-form': AppupForm
  },
  props: {
    /**
     * FiltersJson is object with fields, ex:{"fields":[{"type":"input","label":"name", "name":"first"}]}
     * @label Filter JSON
     * @category_name 1_General
     */
    filter_json: {
      type: [Object, Array],
      required: true
    },
    /**
     * To prefill the filter JSON, ex: {"name":"prefill"}
     * @label Value
     * @category_name 1_General
     */
    value: Object,
    /**
     * Show field and it's label in Inline.
     * @label Inline Labels
     * @category_name 1_General
     */
    inline_labels: {
      type: Boolean,
      required: false
    },
    /**
     * Show fields in Inline.
     * @label Inline
     * @category_name 1_General
     */
    inline: {
      type: Boolean,
      required: false
    },
    buttons: {
      type: Array,
      required: false
    },
    form_group_class: {
      type: String
    },
    button_group_class: {
      type: String
    },
    direction: {
      type: String,
      required: false,
      default: 'right'
    },
    preload: {
      type: Array
    },
    button_class: {
      type: String,
      required: false
    },
    button_label: {
      type: String,
      required: false,
      default: 'Filter'
    },
    variant: {
      type: String,
      required: false
    },
    show_filter_button: {
      type: Boolean,
      required: false,
      default: false
    },
    button_icon: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      modelJson: this.value,
      show_filter: !this.show_filter_button,
      condition: '',
      formJson: { fields: [], buttons: [] }
    };
  },
  watch: {
    value: {
      handler (val) {
        this.modelJson = val;
      },
      deep: true
    },
    modelJson: {
      handler (val) {
        this.formInput();
      },
      deep: true
    },
    filter_json (val) {
      this.conver_to_formJson(val);
    }
  },
  created () {
    this.modelJson = this.value;
    this.conver_to_formJson(this.filter_json);
    this.formJson.buttons = this.buttons;
    // Preload with multiple handlers
    if (this.preload && this.start) {
      const handlers = this.preload;
      const handlersList = [];
      for (let i = 0; i < handlers.length; i++) {
        handlersList[i] = {};
        handlersList[i].name = handlers[i].name;

        let handlersParams = {};
        try {
          if (typeof handlers[i].params === 'object') {
            handlersParams = handlers[i].params;
          } else {
            handlersParams = JSON.parse(handlers[i].params);
          }
        } catch (error) {
          handlersParams = {};
        }
        handlersList[i].params = {
          helper: {
            component: this,
            custom: handlersParams
          }
        };
      }
      if (handlersList.length > 0) {
        this.start(handlersList);
      }
    }
  },
  methods: {
    conver_to_formJson (filterJson) {
      if (Array.isArray(filterJson)) {
        this.formJson.fields = JSON.parse(JSON.stringify(filterJson));
      } else this.formJson = JSON.parse(JSON.stringify(filterJson));
    },
    formInput () {
      console.log('from simple filter emit', this.modelJson);
      this.condition = '';
      if (this.modelJson) {
        var keys = Object.keys(this.modelJson);
        for (var key = 0; key < keys.length; key++) {
          if (typeof this.modelJson[keys[key]] === 'object') {
            // Form condtion for date-range-picker
            // eslint-disable-next-line no-prototype-builtins
            if (this.modelJson[keys[key]].hasOwnProperty('startDate')) {
              this.condition +=
                keys[key] +
                " between '" +
                this.modelJson[keys[key]].startDate +
                "'" +
                ' and ' +
                "'" +
                this.modelJson[keys[key]].endDate +
                "'";
            }
            this.condition += ' and ';
          } else {
            if (
              // eslint-disable-next-line eqeqeq
              this.modelJson[keys[key]] != 'deselect' &&
              ((typeof this.modelJson[keys[key]] === 'string' &&
                this.modelJson[keys[key]].length > 0) ||
                typeof this.modelJson[keys[key]] === 'number')
            ) {
              if (typeof this.modelJson[keys[key]] === 'string') {
                this.condition +=
                  keys[key] + "='" + this.modelJson[keys[key]] + "'";
                this.condition += ' and ';
              } else if (typeof this.modelJson[keys[key]] === 'number') {
                this.condition += keys[key] + '=' + this.modelJson[keys[key]];
                this.condition += ' and ';
              }
            }
          }
          // If (
          //   Key < keys.length - 1 &&
          //   This.modelJson[keys[key]] != "deselect" && this.modelJson[keys[key]].length > 0 &&
          //   This.modelJson[keys[key+1]] != "deselect" && this.modelJson[keys[key+1]].length > 0
          // ) {
          // This.condition += " and ";
          // }
        }
        this.condition = this.condition.substring(0, this.condition.length - 5);
        // Console.log("final condition", this.condition);
      }
      const emitParams = {};
      emitParams.json = this.modelJson;
      emitParams.condition = this.condition;
      emitParams.filterJSON = this.filter_json;
      // Event will be fired on input of any field.
      this.$emit('input', emitParams);
    }
  }
};
</script>

<style>
</style>

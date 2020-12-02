<template>
  <div>
    <draggable
      v-model="rules"
      group="people"
      @change="section_drag_input"
      @start="drag=true"
      @end="drag=false"
    >
      <div
        class="form-group col-md-12"
        v-for="(rule,rinx) in rules"
        v-modal="prefill_data"
        :key="rinx"
      >
        <div class="row">
          <b-form-radio v-if="radio && radio_alignment == 'left'"  v-b-popover.hover.top="radio_tooltip" :name="'section-radio'+rule.controls[0].name" :id="'section-radio'+rule.controls[0].name+rinx" :value="rinx" v-model="default_section" @change="sectionDefaultValue(rinx)"/>
          <div class="col-md-3" v-for="(control,ctrlInx) in rule.controls" :key="ctrlInx">
            <b-form @submit="preventMethod($event)" id="section-form">
              <template v-if="control.label">
                <label>{{control.label}}:</label>
              </template>
              <div v-if="control.controlType == 'text' || control.controlType == 'email'">
                <b-form-input
                  :id="'input_'+control.name+ctrlInx"
                  :type="control.controlType"
                  @input="on_section_input(rule,rinx,control)"
                  :class="control.class"
                  :name="control.name"
                  v-model="control.value"
                  v-validate="fetchValidationRules(control)"
                  :data-vv-as="control.label"
                  :state="errors.has(control.name) ? false : null"
                  :placeholder="control.placeholder"
                ></b-form-input>
              </div>
              <div
                v-if="control.controlType == 'date' || control.controlType == 'time'|| control.controlType == 'datetime'|| control.controlType == 'daterange'"
              >
                <appup-datetime
                  type="date"
                  :name="control.name"
                  :class="control.class"
                  :config="control.custom"
                  @input="on_section_input(rule,rinx,control)"
                  v-validate="fetchValidationRules(control)"
                  :data-vv-as="control.label"
                  :state="errors.has(control.name) ? false : null"
                  :placeholder="control.placeholder"
                  v-model="control.value"
                  :id="'appupdate'+ctrlInx"
                ></appup-datetime>
              </div>
              <div v-if="control.controlType == 'number'">
                <b-form-input
                  type="number"
                  :name="control.name"
                  :class="control.class"
                  @input="on_section_input(rule,rinx,control)"
                  v-validate="fetchValidationRules(control)"
                  :data-vv-as="control.label"
                  :state="errors.has(control.name) ? false : null"
                  v-model="control.value"
                  :placeholder="control.placeholder"
                ></b-form-input>
              </div>

              <div v-if="control.controlType == 'select'">
                <simpleSelect
                  :name="control.name"
                  v-validate="fetchValidationRules(control)"
                  :data-vv-as="control.label"
                  :state="errors.has(control.name) ? false : null"
                  :class="control.class"
                  :options="control.options"
                  v-model="control.value"
                  @input="on_section_input(rule,rinx,control)"
                  :url="control.url"
                  :key_value="control.key_value"
                  :key_label="control.key_label"
                  v-bind="$attrs"
                />
              </div>
              <span
                v-show="errors.has(control.name)"
                class="invalid-feedback"
                style="display: block"
              >{{ errors.first(control.name) }}</span>
            </b-form>
          </div>
          <b-form-radio v-if="radio && radio_alignment == 'right'" v-b-popover.hover.top="radio_tooltip" :name="'section-radio'+rule.controls[0].name"  :id="'section-radio'+rule.controls[0].name+rinx" :value="rinx" v-model="default_section" @change="sectionDefaultValue(rinx)"/>
         <button v-if="rules.length > 1"
            class="btn btn-xs btn-purple-outline btn-radius btn-purple-round"
            @click.prevent="delete_rule(rinx)"
          >
            <i
              :class="button_options.close_icon"
              class="mr-1"
              v-if="button_options.show_close_icon"
            />
            <span v-if="show_close_label">{{button_options.close_label}}</span>
          </button>
        </div>
      </div>
      <button class="btn float-right" @click.prevent="enable_add_rule()" :class="limited_rules">
        <i :class="button_options.add_icon" class="mr-1" v-if="button_options.show_add_icon" />
        <span v-if="show_add_label">{{button_options.add_label}}</span>
      </button>
    </draggable>
  </div>
</template>
<script>
import simpleSelect from './simpleSelect';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import draggable from 'vuedraggable';
// eslint-disable-next-line no-unused-vars
import VeeValidate from 'vee-validate';

export default {
  name: 'appup-section',
  components: {
    draggable,
    simpleSelect,
  },
  props: {
    /**
     * Json Data for sections
     * @param {object} rule_json
     * @label Rule Json
     * @category_name 1_Data
     */
    rule_json: {
      type: Object,
    },
    /**
     * Default Key for radio
     * @param default_key
     * @label Default Key
     * @category_name 1_Data
     */
    default_key: {
      type: String,
      required: false,
      default: 'default'
    },
    /**
     * Data to prefilled
     * @param {array} prefill_data
     * @label Prefill Data
     * @category_name 1_Data
     */
    prefill_data: {
      type: Array,
      default: () => [],
    },
    /**
     * Json Data for sections
     * @param {object} rule_json
     * @label Rule Json
     * @category_name 1_Data
     */
    button_options: {
      type: Object,
      default: () => ({
        close_label: 'Close',
        add_label: 'Add Rule',
      }),
    },
    show_add_label: {
      type: Boolean,
      default: true,
    },
    radio: {
      type: Boolean,
      default: false,
    },
    radio_alignment: {
      type: String,
      required: false,
      default: 'right'
    },
    radio_tooltip: {
      type: String,
      required: false,
      default: 'set as default'
    },
    show_close_label: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      rules: [],
      section_val: this.value,
      section_values: [],
      terminate: false,
      default_section: 0
    };
  },
  computed: {
    limited_rules () {
      // eslint-disable-next-line eqeqeq
      if (this.rule_json.limit && this.rule_json.limit == this.rules.length) {
        return 'd-none';
      }
      return this.button_options.add_label_class
        ? this.button_options.add_label_class
        : 'btn-success';
    },
  },
  created () {
    if (this.prefill_data && this.prefill_data.length) {
      this.prefilling_values();
    } else {
      this.adding_rule();
    }
    this.$emit('input', this.formInputObjects(this.section_values));
  },
  watch: {
    value: {
      handler (val) {
        this.section_val = val;
      },
      deep: true,
    },
    prefill_data: {
      handler (val) {
        if (val && val.length) {
          this.rules = [];
          this.prefilling_values();
        }
      },
      deep: true,
    },
    section_values: {
      handler (newval, oldval) {
        this.value = newval;
      },
      deep: true,
    },
  },

  mounted () {},

  methods: {
    preventMethod: function (event) {
      event.preventDefault();
    },
    sectionDefaultValue (index) {
      this.default_section = index;
      const _this = this;
      this.section_values.forEach((key, indx) => {
        // eslint-disable-next-line eqeqeq
        if (index == indx) {
          _this.section_values[indx][_this.default_key + indx] = true;
        } else {
          _this.section_values[indx][_this.default_key + indx] = false;
        }
      });
      this.$emit('input', this.formInputObjects(this.section_values));
    },
    prefilling_values () {
      var availData = JSON.parse(JSON.stringify(this.prefill_data));

      var formPrefillObj = [];
      for (var key in availData) {
        var obj = {};
        for (var item in availData[key]) {
          if (this.radio && availData[key][this.default_key]) {
            this.default_section = key;
          }
          obj[item + key] = availData[key][item];
        }
        formPrefillObj.push(obj);
      }
      this.section_values = formPrefillObj;
      // eslint-disable-next-line no-redeclare
      for (var key in formPrefillObj) {
        this.adding_rule();
      }
    },
    fetchValidationRules (field) {
      let rule = {};

      if (field.validation) {
        try {
          rule = JSON.parse(field.validation);
        } catch {
          rule = field.validation;
        }
      }
      // eslint-disable-next-line eqeqeq
      if (field.controlType == 'email') {
        rule.email = true;
      }
      // Set Required
      if (field.required) {
        rule.required = JSON.parse(field.required)
          ? field.required
          : JSON.parse(field.required);
      }
      return rule;
    },
    validate_fields () {
      this.$validator.validateAll().then((result) => {
        var status;
        if (result) {
          status = true;
        } else {
          status = false;
        }
        return status;
      });
    },
    section_drag_input (e) {
      this.$emit('drag-drop', e.moved);
    },
    /**
     * Invoke on click of add rule button
     * @function add_rule - To add new section
     */
    enable_add_rule () {
      this.terminate = false;
      this.adding_rule();
    },
    changeRuleJsonNames (rule, index) {
      var rules = JSON.parse(JSON.stringify(rule));
      for (var key in rules.controls) {
        rules.controls[key].name = rules.controls[key].name + index;
      }
      if (this.radio && this.default_key.length) {
        var obj = {};
        obj.name = this.default_key + index;
        rules.controls.push(obj);
      }
      return rules;
    },
    /**
     * Invoke on click of add rule button
     * @function add_rule - To add new section
     */
    adding_rule () {
      if (typeof this.rule_json === 'string') {
        this.rule_json = JSON.parse(this.rule_json);
      }
      var ruleJson = JSON.parse(
        JSON.stringify(
          this.changeRuleJsonNames(
            Object.assign({}, this.rule_json),
            this.rules.length
          )
        )
      );
      var rules = JSON.parse(JSON.stringify(this.rules));
      for (var key in ruleJson.controls) {
        if (this.section_values[this.rules.length]) {
          var prefillData = this.section_values[this.rules.length];
          for (var item in prefillData) {
            // eslint-disable-next-line eqeqeq
            if (ruleJson.controls[key].name == item) {
              ruleJson.controls[key].value = prefillData[item];
            }
          }
        } else {
          ruleJson.controls[key].value = '';
          if (!this.terminate) {
            this.form_object(ruleJson);
          }
        }
      }
      this.rules = [...rules, ruleJson];
    },

    on_section_input (rule, index, control) {
      for (var key in this.section_values[index]) {
        // eslint-disable-next-line eqeqeq
        if (key == control.name) {
          this.section_values[index][key] = control.value;
        }
      }
      this.$emit('input', this.formInputObjects(this.section_values));
    },
    formInputObjects (sectionValue) {
      var sectionValues = JSON.parse(JSON.stringify(sectionValue));
      var formedValues = [];
      for (var key in sectionValues) {
        var obj = {};
        for (var item in sectionValues[key]) {
          obj[item.replace(key, '')] = sectionValues[key][item];
        }
        formedValues.push(obj);
      }
      return formedValues;
    },
    form_object (rule) {
      var obj = {};
      rule.controls.map((key) => {
        if (key.defaultValue && key.defaultValue.length > 0) {
          obj[key.name] = key.defaultValue;
        } else {
          obj[key.name] = '';
        }
      });
      if (this.radio && this.default_key && this.default_key.length > 0) {
        // eslint-disable-next-line eqeqeq
        if (this.section_values.length == 0) {
          obj[this.default_key + '0'] = true;
        } else {
          obj[this.default_key + this.section_values.length] = false;
        }
      }
      this.section_values.push(obj);
      this.$emit('input', this.formInputObjects(this.section_values));
      this.terminate = true;
    },

    /**
     * Invoke on click of close button
     * @function delete_rule - To delete the added section
     */
    delete_rule (index) {
      this.rules.splice(index, 1);
      this.section_values = this.formInputObjects(this.section_values);
      this.section_values.splice(index, 1);
      // eslint-disable-next-line eqeqeq
      if (this.radio && this.default_section == index) {
        // eslint-disable-next-line eqeqeq
        if (index == 0) this.default_section = index;
        else this.default_section = index - 1;
      }
      for (var key in this.section_values) {
        // eslint-disable-next-line eqeqeq
        if (key == this.default_section) {
          this.section_values[key][this.default_key] = true;
        }
      }
      this.$emit('input', this.section_values);
    },
    /**
     * To Get the selected controls
     * @function get_selected_data
     */
    get_selected_data () {
      const rules = this.$refs.rules || [];
      const sectionOutputsList = [];
      rules.map((ruleItem, ruleIndex) => {
        const newObj = {};
        const controls = ruleItem.rule.controls;
        if (controls && controls.length) {
          controls.map((item) => {
            newObj[item.name] = item.value;
          });
          sectionOutputsList.push(newObj);
        }
        return ruleItem;
      });
      return sectionOutputsList;
    },
    async get_select_list () {
      try {
        this.rule = this.rule_json[0];
        if (this.rule.controls && this.rule.controls.length) {
          // Filter Selected and Unselected controls
          const selectTypeCtrls = this.rule.controls.filter(
            // eslint-disable-next-line eqeqeq
            (item) => item.controlType == 'select'
          );
          const unselectTypeCtrls = this.rule.controls.filter(
            // eslint-disable-next-line eqeqeq
            (item) => item.controlType != 'select'
          );

          if (selectTypeCtrls.length) {
            for (var i = 0; i < selectTypeCtrls.length; i++) {
              if (!selectTypeCtrls[i].url) continue;
              // If control type is of select then fetch data from url and map the options
              const dropdownList = await fetch(selectTypeCtrls[i].url, {
                withCredentials: true,
                credentials: 'include',
              }).then((res) => res.json());
              if (dropdownList && dropdownList.length) {
                selectTypeCtrls[i].options = dropdownList.map((obj) => {
                  var newObj = {};
                  newObj.text = obj[selectTypeCtrls[i].keytext];
                  newObj.value = obj[selectTypeCtrls[i].keyvalue];
                  return newObj;
                });
              }
            }
          }
          this.rule.controls = [...selectTypeCtrls, ...unselectTypeCtrls];
        }
      } catch (e) {}
    },
  },
};
</script>
<style>
.header-circle {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: darkblue;
  color: white;
}
</style>

<template>
  <div>
    <div v-for="(control, index) in controls" :key="control">
      <div class="row m-0">
        <template v-for="(field, findex) in control.merges">
          <div :class="field.class" class="merge-class pl-0 pr-0">
            <b-form class="merge-fields-form text-left" @submit="preventMethod($event)" inline>
              <template v-if="field.label">
                <label>{{ field.label }}:</label>
              </template>
              <b-form-input
                v-if="field.controlType == 'text' || field.controlType == 'email'"
                :id="'input_' + field.name + index"
                :type="field.controlType"
                :name="field.name"
                v-model="field.value"
                @input="on_input(control, field, findex)"
                :placeholder="field.placeholder"
                class="input_fields"
                v-validate="{ required: true }"
                :data-vv-as="field.label"
                :state="findex == 0 ? validate_state : null"
              ></b-form-input>
              <simpleSelect
                v-if="field.controlType == 'select'"
                :name="field.name"
                :options="field.options"
                v-model="field.value"
                :url="field.url"
                :key_value="field.key_value"
                :key_label="field.key_label"
                @input="on_input(control, field, findex)"
                class="input_fields"
                v-bind="$attrs"
                v-validate="{ required: true }"
                :data-vv-as="field.label"
                :state="findex == 0 ? validate_state : null"
              />
              <b-form-input
                v-if="field.controlType == 'number'"
                type="number"
                :name="field.name"
                v-model="field.value"
                :placeholder="field.placeholder"
                @input="on_input(control, field, findex)"
                class="input_fields"
                v-validate="{ required: true }"
                :data-vv-as="field.label"
                :state="findex == 0 ? validate_state : null"
              ></b-form-input>
              <!-- <span
            v-show="errors.has(control.name)"
            class="invalid-feedback"
            style="display: block"
          >{{ errors.first(control.name) }}</span> -->
            </b-form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import simpleSelect from './simpleSelect.vue';
export default {
  name: 'appup-merge-fields',
  components: {
    simpleSelect,
  },
  props: {
    controls: {
      type: Array,
    },
    value: {
      type: Object,
      default: () => {},
    },
    append_key: {
      type: String,
    },
    validate_state: {
      type: Boolean,
    },
  },
  data () {
    return {
      form: {},
    };
  },
  watch: {
    value (newval, oldval) {
      this.controls[0].merges[0].value = this.value[this.controls[0].name];
    },
  },
  mounted () {
    if (this.value) this.controls[0].merges[0].value = this.value[this.controls[0].name];
    this.initial_value = this.controls[0].merges[0].value;
  },
  methods: {
    preventMethod: function (event) {
      event.preventDefault();
    },
    on_input (control, field, fIndex) {
      debugger;
      // eslint-disable-next-line eqeqeq
      if (control.append_key == field.name) {
        this.form[control.name] = field.value;
      } else {
        this.form[control.name] = this.form[control.name] !== undefined ? this.form[control.name] + field.value : control.merges[0].value + field.value;
      }
      control.merges[0].value = this.form[control.name];

      // Let obj = {};
      // Obj[control.name] = control.merges[0].value;
      this.$emit('input', this.form);
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
        rule.required = JSON.parse(field.required) ? field.required : JSON.parse(field.required);
      }
      return rule;
    },
  },
};
</script>
<style>
.merge-class .input_fields {
  width: 100% !important;
}
.merge-class .custom-select {
  width: 100% !important;
}
</style>

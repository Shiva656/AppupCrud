<template>
  <b-form-checkbox
    v-model="selected"
    :disabled="disabled"
    @input="onInput($event)"
    @change="onChange($event);"
    switch
  ></b-form-checkbox>
</template>
<script>
export default {
  name: 'ac-switch-button',
  components: {},

  props: {
    /**
     * To enable or disable switcher
     * @param { Boolean } disabled
     * @label Disabled
     * @category_name 2_Data
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Value for v-model binding. Not to be binded directly
     * @label Value
     * @category_name 2_Data
     */
    value: {
      type: [Number, String, Boolean],
      default: 0
    },
    /**
     * Value for v-model dynamic values Eg.{"true_val":"enable","false_val":"disable"}
     * @label Values Object
     * @category_name 2_Data
     */
    vaules_ob: {
      type: Object,
      default: () => ({ true_val: 1, false_val: 0 }),
    }
  },
  data: function () {
    return {
      selected: ''
    };
  },
  created () {
    // Converting boolean to number because while inserting in db getting issue with boolean values.
    this.selected = this.convertToBoolean(this.value);
  },
  watch: {
    value () {
      this.selected = this.convertToBoolean(this.value);
    }
  },
  methods: {
    onInput (event) {
      this.$emit('input', this.convertToNumber(event));
    },
    onChange (event) {
      this.$emit('change', this.convertToNumber(event));
    },
    convertToNumber (val) {
      if (val) return this.vaules_ob.true_val;
      else return this.vaules_ob.false_val;
    },
    convertToBoolean (val) {
      // eslint-disable-next-line eqeqeq
      if (val == this.vaules_ob.true_val) return true;
      // eslint-disable-next-line eqeqeq
      else if (val == this.vaules_ob.false_val) return false;
      else return false;
    }
  }
};
</script>

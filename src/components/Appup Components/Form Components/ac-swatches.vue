<template>
  <div>
    <div class="form__field">
      <div class="form__label">
        <strong>
          <!-- Use this slot for giving title -->
          <slot name="title"></slot>
        </strong>
        <swatches
          :colors="colors"
          inline
          v-model="value"
          @input="$emit('input', $event)"
        ></swatches>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Ac swatches component
 * @requires vue-swatches - Forked from https://github.com/saintplay/vue-swatches
 */
import Swatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.min.css';

export default {
  name: 'ac-swatches',
  components: {
    Swatches
  },
  props: {
    /**
     * Give custom colors to override default colors Eg.["#F64272", "#F6648B", "#F493A7", "#F891A6", "#FFCCD5"]
     * You should always use 6-digits hex colors.
     * @param {string, object, array} colors
     * @label Colors
     * @category_name 1_General
     */
    colors: {
      type: [String, Object, Array],
      default: 'basic'
    },
    /**
     * Key from the data to check the selected value
     * @param {string} color_v_model
     * @label v-model-color
     * @category_name 1_General
     */
    color_v_model: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      value: '',
    }
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.value = newValue;
      },
      deep: true
    },
    color_v_model (newval, oldval) {
      this.value = newval;
    }
  },
  mounted () {
    if (this.color_v_model) {
      this.value = this.color_v_model;
    }
  }
};
</script>

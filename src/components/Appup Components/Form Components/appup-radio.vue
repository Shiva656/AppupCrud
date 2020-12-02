<template>
    <b-form-radio-group
        :id=id
        class="appup-radio"
        :options=radioGroupOptions
        :state=state
        v-model=selected
        @change="onSelect"
    >
    </b-form-radio-group>
</template>
<script>
import { Conversions } from '../../../mixins/conversions'

/**
     * Appup Radio - Can be used for single or group radios
     */
export default {
  name: 'appup-radio',
  mixins: [Conversions],
  components: {
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
             * Options that should be displayed in radio group
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
    }
  },
  data: function () {
    return {
      radioGroupOptions: [],
      selected: this.value
    }
  },
  created: function () {
    if (this.options && this.options.length > 0) {
      this.radioGroupOptions =
                    this.convert_Options_To_BootstrapVue_Options(this.options);

      if (this.value) {
        this.selected = this.value;
      } else {
        // Set default values
        this.selected = this.setDefaultValues(this.options);
      }
    }
  },
  computed: {

  },
  watch: {
    value (newVal, oldVal) {
      this.selected = newVal;
    }
  },
  methods: {
    onSelect (selected) {
      this.$emit('input', selected)
      this.options.forEach(element => {
        if (element.value === selected) {
          this.$emit('radioChange', element, this.id, 'radio')
        }
      });
    }
  }
};
</script>

<template>
    <b-form-file
        :id=id
        class="appup-file"
        :state=state
        :multiple=multiple
        v-model=file
        :placeholder=placeholder
        :accept="accept ? accept : null"
        @change="onSelect">
    </b-form-file>
</template>
<script>
/**
     * Appup File - Can select any file or specific file with provided extensions
     *
     * TODO: Testing with API for file upload
     */
export default {
  name: 'appup-file',
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
             * Set multiple=true if multiple files should be uploaded
             * TODO - seems there is issue with multiple - https://github.com/bootstrap-vue/bootstrap-vue/issues/1526
            multiple: {
                type: Boolean,
                required: false,
                default: false
            },
            */

    /**
             * Placeholder to be displayed
             */
    placeholder: {
      type: String,
      required: false
    },

    /**
             * Supported formats to be selected by extension
             *
             * Example: ['.jpg', '.pdf', '.docx'] etc..
             */
    supportedFormats: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      accept: null,
      file: null,
      multiple: false
    }
  },
  created: function () {
    // Join array with comma
    if (this.supportedFormats) {
      this.accept = this.supportedFormats.join(',');
    }
  },
  computed: {

  },
  methods: {
    onSelect (selected) {
      this.$emit('input', selected)
    }
  }
};
</script>

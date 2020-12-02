<template>
  <tinymce-editor
    :api-key="apiKey"
    v-model="content"
    :toolbar="toolbar"
    :disabled="disabled"
    :id="id"
    :inline="inline"
    :plugins="plugins"
    :tag-name="tag-name"
    :init="init"
    @onKeyUp="handlerFunction"
    @onSelectionChange="handlerChangeFunction"
  ></tinymce-editor>
</template>
<script>
/**
 * @author Dharma
 * tinymce-editor component is using tinymce-editor api
 * ref: https://github.com/tinymce/tinymce-vue
 * Tiny ref: https://www.tiny.cloud/docs/integrations/vue/
 * TODO: Add more props
 */
import Editor from '@tinymce/tinymce-vue';
export default {
  name: 'appup-tinymce',
  components: {
    'tinymce-editor': Editor
  },
  data () {
    return {
      content: this.value
    };
  },
  props: {
    /**
     * Set the editor into a "disabled" readonly mode or into the normal editable mode
     */
    disabled: {
      type: Boolean,
      required: false
    },
    /**
     * API-KEY for tinymce to enable user account
     */
    apiKey: {
      type: String,
      required: true
    },
    /**
     * An id for the editor so you can later grab the instance
     * by using the tinymce.get('ID') method on tinymce
     */
    id: {
      type: String,
      required: false
    },
    /**
     * Shorthand for setting that the editor should be inline,
     * <tinymce-editor inline></tinymce-editor>
     * is the same as setting {inline: true} in the init.
     */
    inline: {
      type: Boolean,
      required: false
    },
    /**
     * Shorthand for setting what plugins you want to use,
     * <tinymce-editor plugins="foo bar"></tinymce-editor>
     * is the same as setting {plugins: 'foo bar'} in the init
     */
    plugins: {
      type: String,
      default: 'wordcount',
      required: false
    },
    /**
     * Only used if the editor is inline, decides what element
     * to initialize the editor on, defaults to div
     */
    'tag-name': {
      type: String,
      required: false,
      default: 'div'
    },
    /**
     * Shorthand for setting what toolbar items you want to show,
     * <tinymce-editor toolbar="foo bar"></tinymce-editor>
     * is the same as setting {toolbar: 'foo bar'} in the init.
     */
    toolbar: {
      type: String,
      required: false
    },
    /**
     * Value for v-model binding. Not to be binded directly
     */
    value: {
      required: false
    },
    init: {
      type: Object,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  methods: {
    handlerFunction: function () {
      this.$emit('input', this.content);
    },
    handlerChangeFunction: function () {
      this.$emit('change', this.content);
    },
  },
  mounted () {},
  watch: {
    value: function (newVal, oldVal) {
      this.content = newVal;
    }
  }
};
</script>

<style>
</style>

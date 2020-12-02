<template>
  <div v-if="render" class="ac-email-builder_wrapper">
    <div id="ac-email-builder" ref="email_builder_container"></div>
  </div>
</template>
<script>
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css';
import grapesjs from 'grapesjs';
import 'grapesjs-preset-newsletter';

export default {
  name: 'ac-email-builder',
  props: {
    /**
     * Html string
     * @param {string} data
     * @label Data
     * @category_name 2_Data
     */
    data: {
      type: String,
      required: false,
      default: ''
    },
    /**
     * Render of the component
     */
    value: {
      required: false
    },

    render: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      html: '',
      editor: null
    };
  },
  watch: {
    value: {
      handler: function (newValue, oldValue) {
        try {
          // eslint-disable-next-line no-undef
          this.html = newval;
          // eslint-disable-next-line no-undef
          this.$emit('input', newval);
        } catch (e) {
          this.html = '';
        }
      },
      deep: true
    },
    render: {
      handler: function (newValue) {
        this.render = newValue;
      },
      deep: true
    }
  },
  mounted () {
    // SetTimeout(function(){_this.init()},3000)
    var _this = this;
    setTimeout(function () {
      console.log('This is from email builder');
      try {
        if (_this.data) {
          _this.html = _this.data;
        } else if (_this.value) {
          _this.html = _this.value
        } else {}
      } catch (e) {
        console.log(e);
      }
      // This.init();
      _this.init();
    }, 1500);
  },
  methods: {
    /**
     * @function onEditorChange - editor change event handler
     */
    onEditorChange () {
      const html = this.editor.getHtml();
      const css = this.editor.getCss();
      this.html = `${html}<style>${css}</style>`;
      this.$emit('export', this.html);
      this.$emit('input', this.html);
    },
    /**
     * @function init - editor object initialization
     */
    init () {
      if (this.editor) {
        return;
      }
      this.editor = grapesjs.init({
        container: this.$refs.email_builder_container,
        fromElement: false,
        components: this.html,
        height: '100%',
        width: '100%',
        storageManager: false,
        assetManager: {
          assets: [],
          upload: 0,
          uploadText: 'Uploading is not available'
        },
        panels: {
          defaults: []
        },
        colorPicker: {
          appendTo: 'parent',
          offset: { top: 26, left: -166 }
        },
        plugins: [
          // 'gjs-plugin-ckeditor',
          'gjs-preset-newsletter'
        ],
        pluginsOpts: {
          'gjs-preset-newsletter': {
            modalLabelImport: 'Paste all your code here below and click import',
            modalLabelExport: 'Copy the code and use it wherever you want',
            codeViewerTheme: 'material',
            importPlaceholder:
              '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
            cellStyle: {
              'font-size': '12px',
              'font-weight': 300,
              'vertical-align': 'top',
              color: 'rgb(111, 119, 125)',
              margin: 0,
              padding: 0
            }
          }
        }
      });

      const panels = this.editor.Panels;
      const md = this.editor.Modal;

      panels.addPanel({
        id: 'devices',
        buttons: [
          {
            active: true,
            id: 'deviceDesktop',
            className: 'fa fa-desktop',
            command: 'set-device-desktop',
            attributes: { title: 'Desktop' }
          },
          {
            id: 'deviceTablet',
            className: 'fa fa-tablet-alt',
            command: 'set-device-tablet',
            attributes: { title: 'Tablet' }
          },
          {
            id: 'deviceMobile',
            className: 'fa fa-mobile-alt',
            command: 'set-device-mobile',
            attributes: { title: 'Mobile' }
          }
        ]
      });

      panels.addPanel({
        id: 'options',
        buttons: [
          {
            active: true,
            id: 'sw-visibility',
            className: 'far fa-square',
            command: 'sw-visibility',
            context: 'sw-visibility',
            attributes: { title: 'View components' }
          },
          {
            id: 'fullscreen',
            className: 'fa fa-arrows',
            attributes: { title: 'Fullscreen' },
            command: 'fullscreen'
          },
          {
            id: 'gjs-open-import-template',
            className: 'fa fa-download',
            command: 'gjs-open-import-template',
            attributes: { title: 'Import template' }
          },
          {
            id: 'export-template',
            className: 'fa fa-code',
            command: 'export-template',
            attributes: { title: 'View code' }
          },
          {
            id: 'undo',
            className: 'fa fa-undo',
            attributes: { title: 'Undo' },
            command: 'core:undo'
          },
          {
            id: 'redo',
            className: 'fa fa-redo',
            attributes: { title: 'Redo' },
            command: 'core:redo'
          },
          {
            id: 'clear-all',
            className: 'fa fa-trash-alt',
            attributes: { title: 'Clear canvas' },
            command: {
              run (editor, sender) {
                if (sender) sender.set('active', false);
                if (confirm('Are you sure to clean the canvas?')) {
                  editor.DomComponents.clear();
                  setTimeout(() => {
                    localStorage.clear();
                  }, 0);
                }
              }
            }
          }
        ]
      });

      panels.addPanel({
        id: 'views',
        buttons: [
          {
            id: 'open-sm',
            className: 'fa fa-paint-brush',
            command: 'open-sm',
            active: true,
            togglable: 0,
            attributes: { title: 'Open Style Manager' }
          },
          {
            id: 'open-tm',
            className: 'fa fa-cog',
            command: 'open-tm',
            togglable: 0,
            attributes: { title: 'Settings' }
          },
          {
            id: 'open-layers',
            className: 'fa fa-bars',
            command: 'open-layers',
            togglable: 0,
            attributes: { title: 'Open Layer Manager' }
          },
          {
            active: true,
            id: 'open-blocks',
            className: 'fa fa-th-large',
            command: 'open-blocks',
            togglable: 0,
            attributes: { title: 'Open Blocks' }
          }
        ]
      });

      md.getModel().on('change:open', function () {
        debugger;
        const htmlCollection = document.getElementsByClassName('gjs-btn-prim gjs-btn-import')[0];
        if (htmlCollection && !htmlCollection.hasAttribute('type')) {
          document.getElementsByClassName('gjs-btn-prim gjs-btn-import')[0].setAttribute('type', 'button');
        }
      });

      this.editor.on('change:changesCount', this.onEditorChange);
    }
  }
};
</script>
<style>
.ac-email-builder_wrapper,
#ac-email-builder {
  height: 100vh;
}
#ac-email-builder .gjs-cv-canvas {
  width: calc(100% - 220px);
}
#ac-email-builder .gjs-pn-views,
#ac-email-builder .gjs-pn-views-container {
  width: 220px;
}
#ac-email-builder .gjs-pn-options {
  right: 220px;
}
#ac-email-builder .gjs-field-arrows {
  z-index: 1;
}
#ac-email-builder .fa-trash-o:before {
  content: "\f2ed";
}
#ac-email-builder .fa.fa-clone:before {
  font-weight: 400;
}
#ac-email-builder .fa.fa-check-square-o:before {
  content: "\f14a";
}
</style>

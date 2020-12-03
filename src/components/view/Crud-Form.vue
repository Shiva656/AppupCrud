<template>
  <div>
    <div>
      <div class="d-flex align-items-center">
        <button type="button" v-if="backButton" class="btn btn-outline-secondary mb-4" @click="goBack">
          <i class="fal fa-arrow-left"></i>
        </button>
        <h3 class="mb-4 ml-2" v-if="backButton">
          {{ dispFormLabel }} {{ template_params.bn ? template_params.bn : sentenceCase(getMenuName(appName)) }}
          <!--{{(sentenceCase($route.params.entity)[sentenceCase($route.params.entity).length-1]=="y")?"":(sentenceCase($route.params.entity)+'s')}}-->
        </h3>
        <h3 class="mb-4 ml-2" v-else-if="labelDisplay">
          {{ template_params.bn ? template_params.bn : getMenuName(appName, template_params.bn) }}
        </h3>
      </div>
      <template>
        <appup-form
          class="hip-form"
          @input="formChange"
          :form-json="formFields"
          preload="preload"
          submit="submit"
          v-model="form"
          :form-data="form"
          ref="form"
          v-if="isPropsLoaded && isPreview"
        >
        </appup-form>
        <ac-form-preview
          class="form-preview"
          @input="formChange"
          preload="preload"
          :fields="formFields.fields"
          v-model="form"
          ref="form-preview"
          :buttons="formFields.buttons"
          submit="submit"
          v-else-if="isPropsLoaded && !isPreview"
        >
          <template #form_preview="{ data }">
            <component :is="componentName" :item="data.form_data"></component>
          </template>
          <template #empty_state>pls fill the form</template>
        </ac-form-preview>
      </template>
    </div>
  </div>
</template>
<script>
// Import { propsFromParams } from '../../js/templates';
import { getData, saveDataUrl, updateDataUrl, getDisplayableColumns, getApp, data } from '../js/global';

import { getCustomValidations } from '../js/customValidation';
import Form from '../Appup Components/appup-form'
export default {
  components: {
    'appup-form': Form,
  },
  props: ['fields', 'entity', 'block_params', 'template_params', 'callbacks'],
  mounted: function () {
    console.log('c-f');
    // Get app
    this.appName = getApp();
    window.scrollTo(0, 0);
    // Get entity
    this.entity = this.entity || this.$route.params.entity;

    // Get template params
    const tempParam =
      this.$route.params.template_params !== '0' && this.$route.params.template_params
        ? this.$route.params.template_params
        : this.template_params;
    const key = tempParam;
    // If (typeof (tempParam) === 'string') { key = propsFromParams(tempParam); }

    this.template_params = key;
    // Process template params
    this.processTemplateParams(key);

    // Get preload url
    getData(this.entity).then((url) => {
      this.getUrl = url;
    });

    // Get post url
    saveDataUrl(this.entity, key.mi || null).then((url) => {
      this.postUrl = url;
    });

    // Get update url
    updateDataUrl(this.entity, key.mi || null).then((url) => {
      this.putUrl = url;
    });

    // Process form to match appup-form required json format
    this.fields = this.processForm();

    // Process portal users
    this.processPortalUserFields();
  },
  data () {
    return {
      form: {},
      appName: '',
      formLabel: { a: 'Add', e: 'Edit' },
      dispFormLabel: 'Add',
      isPreview: 1,
      customFieldData: [],
      backButton: false,
      labelDisplay: false,
      isUpdate: 0,
      isMi: false,
      componentName: '',
      preloadColumn: false,
      isPropsLoaded: false,
      buttonDisable: false,
      serverUrl: `/v2/${this.entity}`,
      postUrl: null,
      putUrl: null,
      getUrl: null,
      formFields: {
        fields: this.fields,
        buttons: [
          {
            label: `${this.block_params.id ? 'Update' : 'Save'}`,
            variant: 'primary',
            type: 'submit',
          },
          {
            label: 'cancel',
            variant: 'danger',
            type: 'button',
            handlerName: 'form_cancel',
            handlerParams: { modal_id: this.template_params.lhsModalId },
          },
        ],
      },
    };
  },
  methods: {
    // Route -1
    goBack: function () {
      // For active tab in dynamic tabs
      window._isRouteBack = true;
      this.$router.go(-1);
    },
    // Processsing template params
    processTemplateParams: function (key) {
      if (key.fb && key.fb === 't') {
        this.backButton = true;
      }

      if (key.fl === 't') {
        this.labelDisplay = true;
      }

      if (key.f === 'preview') {
        this.isPreview = 0;
      }

      if (key.cf) {
        this.getCustomFields(key.cf);
      }

      if (key.c) {
        this.componentName = key.c;
      }

      if (key.mi) {
        this.isMi = key.mi;
      }

      if (key.fp) {
        this.preloadColumn = key.fp;
      }

      if ((this.block_params || {}).id) {
        this.isUpdate = 1;
      }

      if ((this.block_params || {}).e) {
        // eslint-disable-next-line no-eval
        this.fields = eval(this.block_params.e);
      }

      // Assigning add or edit label
      if ((this.block_params || {}).fl) {
        this.dispFormLabel = this.formLabel[this.block_params.fl]
          ? this.formLabel[this.block_params.fl]
          : this.block_params.fl;
      }

      // Get form custom buttons
      //   If (key.fcb === 't') {
      //     Var customButtons = getFormButtons(this.entity, this.appName);
      //     If (customButtons.length !== 0) {
      //       //   This.formFields.buttons=this.formFields.buttons.concat(customButtons);
      //       This.formFields.buttons = customButtons;
      //     }
      //   }
    },
    // Process portal user as dropdown
    processPortalUserFields: function () {
      try {
        if (window[`${this.entity}-${this.appName}`].form.formFields && !this.template_params.pt) {
          return this.processDisplayableFields(window[`${this.entity}-${this.appName}`].form.formFields);
        }

        this.processDisplayableFields(this.fields);
        // ProcessPortalUserIds(this.fields)
        //   .then(fields => {
        //     Window[`${this.entity}-${this.appName}`].form.formFields = fields;
        //     This.processDisplayableFields(fields);
        //   })
      } catch (err) {
        this.processDisplayableFields(this.fields);
      }
    },
    // To get displayble fields
    processDisplayableFields: function (fields) {
      // Get displayable columns
      getDisplayableColumns(this.entity, fields, '_f')
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          this.$set(this.formFields, 'fields', res);
          // Add custom validations for the fields
          getCustomValidations(this.fields);
          // Check the fields for the type and get designer json if required
          this.processWorkflow();
        });
    },

    // Converting form to required appup-form required json
    processForm: function () {
      const fields = this.fields.map((item) => {
        if (!(this.block_params || {}).e) {
          if (item.type !== 'checkbox' && item.type !== 'dropdown') {
            item.value = '';
          }
        }
        switch (item.type) {
          case 'checkbox':
            if (item._cb_l === false) {
              item.option = item.option.map((i) => {
                i.label = '';
                return i;
              });
            }
            return item;
          case 'email-builder':
            return { ...item, render: false };
          case 'designer':
            return { ...item, type: 'workflow', render: false };
          case 'build':
            return {
              ...item,
              type: 'designer',
              src: 'https://builder-buildly.appup.com',
              height: 800,
              width: 1100,
              render: false,
            };
          case 'mock':
            return {
              ...item,
              type: 'designer',
              src: 'https://builder-mockly.appup.com',
              height: 800,
              width: 800,
              render: false,
            };
          case 'code-editor':
            return { ...item, height: '1000px', width: '95%', rows: '10', 'max-row': '100' };
          case 'java-code-editor':
            return {
              ...item,
              type: 'code-editor',
              lang: 'javascript',
              height: '300px',
              width: '95%',
              rows: '10',
              'max-row': '100',
              value:
                'package com.appup.apps.' +
                window.appup_app_name +
                '\nimport com.appup.core.workflow.step.Context;\nimport com.appup.core.workflow.step.executor.CodeExecutor;\npublic class Myclass implements CodeExecutor{\n\t@Override\n\tpublic Map execute(Map workflowMap, Context wokflowContext) throws Exception{\n\n\treturn workflowMap;\n\n\t}\n}',
            };
          case 'js-code-editor':
            return {
              ...item,
              type: 'code-editor',
              lang: 'javascript',
              label: 'Add your Javascript here',
              height: '600px',
              width: '95%',
              rows: '10',
              'max-row': '100',
              class: 'col-sm-12 border-bottom mb-4',
              container: 'settings',
              'container-name': 'JS',
            };
          case 'css-code-editor':
            return {
              ...item,
              type: 'code-editor',
              lang: 'scss',
              label: 'Add your CSS here',
              height: '600px',
              width: '95%',
              rows: '10',
              'max-row': '100',
              class: 'col-sm-12 border-bottom mb-4',
              container: 'settings',
              'container-name': 'CSS',
            };
          case 'app-js-code-editor':
            return {
              ...item,
              type: 'code-editor',
              lang: 'javascript',
              label: 'Add your Javascript here',
              height: '600px',
              width: '95%',
              rows: '10',
              'max-row': '100',
              class: 'col-sm-12 border-bottom mb-4',
            };
          case 'app-css-code-editor':
            return {
              ...item,
              type: 'code-editor',
              lang: 'scss',
              label: 'Add your CSS here',
              height: '600px',
              width: '95%',
              rows: '10',
              'max-row': '100',
              class: 'col-sm-12 border-bottom mb-4',
            };
          case 'html-code-editor':
            return {
              ...item,
              type: 'code-editor',
              lang: 'html',
              label: 'Add your HTML here',
              height: '600px',
              width: '95%',
              rows: '10',
              'max-row': '100',
              class: 'col-sm-12 border-bottom mb-4',
              container: 'settings',
              'container-name': 'Template',
              'container-active': 'true',
            };
          case 'json-code-editor':
            if (item.name === 'builder_json') {
              return {
                ...item,
                id: 'uibuilder',
                type: 'designer',
                label: 'Builder',
                class: 'col-md-12 border-bottom mb-4',
                container: 'settings',
                'container-name': 'builder',
                src: 'https://builder-buildly.appup.com',
                render: true,
                width: '500',
                height: '500',
              };
            } else {
              return {
                ...item,
                type: 'code-editor',
                lang: 'javascript',
                label: 'Add you JSON here',
                height: '600px',
                width: '95%',
                rows: '10',
                'max-row': '100',
                class: 'col-sm-12 border-bottom mb-4',
                container: 'settings',
                'container-name': item.label,
              };
            }
          default:
            return item;
        }
      });
      return fields;
    },
    // Check if the type workflow exists and get desiner json
    processWorkflow: function () {
      try {
        if (this.fields.filter((item) => item.type === 'workflow').length > 0) {
          this.processWfNodes((data) => {
            var appIndx = this.fields.findIndex((item) => item.type === 'workflow');
            if (appIndx >= 0) {
              this.fields[appIndx] = {
                ...data.props.workflow_JSON,
                ...this.fields[appIndx],
              };

              this.formFields.fields = this.fields;
            }

            this.isPropsLoaded = true;
          });
        } else {
          this.isPropsLoaded = true;
        }
      } catch (err) {
        this.isPropsLoaded = true;
      }
    },
    // Preloading the form in case of edit and add
    preloadForm: function (lhsData) {
      if (!(this.block_params || {}).id) {
        this.form = null;
        const form = {};
        if ((((window.fcf || {})[this.appName] || {})[this.entity] || {}).preload) {
          try {
            // eslint-disable-next-line no-eval
            var fn = eval(window.fcf[this.appName][this.entity].preload);
            const data = fn(this.formFields.fields, this);
            this.formFields.fields = data || this.formFields.fields;
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        this.formFields.fields = this.formFields.fields.map((i) => {
          if (i.type === 'workflow' || i.type === 'designer' || i.type === 'email-builder') {
            i.render = true;
          }
          if ((lhsData || {})[i.name]) {
            form[i.name] = lhsData[i.name];
          }
          return i;
        });

        this.form = { ...form, ...this.form };
        this.buttonDisable = true;
        return;
      }
      this.form = null;
      const url = `${this.getUrl}${
        this.preloadColumn
          ? `?w=${this.preloadColumn}=${this.block_params.id ? this.block_params.id : 0}`
          : `/${this.block_params.id ? this.block_params.id : 0}`
      }`;

      data(
        url,
        {},
        (res) => {
          const prefillData = res[0];
          let form = {};
          this.formFields.fields = this.formFields.fields.map((i) => {
            form[i.name] = prefillData[i.name];
            if (i.type === 'workflow' || i.type === 'designer' || i.type === 'email-builder') {
              i.render = true;
            }
            if (i.type === 'multiselect' && prefillData[i.name]) {
              form[i.name] = (prefillData[i.name] + '').split(',').map((item) => {
                return Number(item);
              });
            }
            // eslint-disable-next-line no-undef
            if (i.type === 'datetime' && prefillData[i.name]) {
              // eslint-disable-next-line no-undef
              form[i.name] = getFormatDate(prefillData[i.name], i.config.dateFormat);
            }
            // eslint-disable-next-line no-undef
            if (i.type === 'date' && prefillData[i.name]) {
              // eslint-disable-next-line no-undef
              form[i.name] = getFormatDate(prefillData[i.name], i.config.dateFormat);
            }

            if ((lhsData || {})[i.name]) {
              form[i.name] = lhsData[i.name];
            }

            return i;
          });
          // Callback functions for preload
          if ((((window.fcf || {})[this.appName] || {})[this.entity] || {}).edit_preload) {
            try {
              // eslint-disable-next-line no-eval
              var fn = eval(window.fcf[this.appName][this.entity].edit_preload);
              const data = fn(prefillData, this);
              form = data || form;
              // eslint-disable-next-line no-empty
            } catch (e) {}
          }
          for (var key in form) {
            if (typeof form[key] === 'boolean') {
              form[key] = form[key] ? 1 : 0;
            }
          }

          this.form = { ...form };
          this.buttonDisable = true;
          // eslint-disable-next-line handle-callback-err
        },
        (err) => { console.log(err) }
      );
    },
    // Get designer json from local storage if not make rest call
    processWfNodes: function (res) {
      if (((window[`${this.appName}-${this.entity}`] || {})._workflow || {})._nodes) {
        return res(window[`${this.appName}-${this.entity}`]._workflow._nodes);
      }

      // eslint-disable-next-line no-undef
      getDesignerUrl(this.entity).then((url) => {
        fetch(url, {})
          .then((data) => data.json())
          .then((resp) => {
            if (!resp) {
              return res({ props: { workflow_JSON: { src: ' /designer/designer.html' } } });
            }
            window[`${this.appName}-${this.entity}`] = window[`${this.appName}-${this.entity}`] || {};
            window[`${this.appName}-${this.entity}`] = {
              ...window[`${this.appName}-${this.entity}`],
              _workflow: {
                _nodes: resp,
              },
            };
            // Window._workflow._nodes = resp;
            res(resp);
          })
          .catch((error) => {
            console.log(error)
            res({ props: { workflow_JSON: { src: ' /designer/designer.html' } } });
          });
      });
    },
    // Calling callback function in configuration before insert call
    before_submit: function (form, ui) {
      if ((this.callbacks || {}).before_submit) {
        try {
          // eslint-disable-next-line no-eval
          var fn = eval(this.callbacks.before_submit);
          return fn(form, ui);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      return form;
    },
    // Calling callback function in configuration after insert call
    after_submit: function (form, ui) {
      if ((this.callbacks || {}).after_submit) {
        try {
          // eslint-disable-next-line no-eval
          var fn = eval(this.callbacks.after_submit);
          return fn(form, ui);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      return form;
    },
    // Calling callback function in configuration before update call
    before_put: function (form, ui) {
      if ((this.callbacks || {}).before_put) {
        try {
          // eslint-disable-next-line no-eval
          var fn = eval(this.callbacks.before_put);
          return fn(form, ui);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      return form;
    },
    // Calling callback function in configuration after update call
    after_put: function (form, ui) {
      if ((this.callbacks || {}).after_put) {
        try {
          // eslint-disable-next-line no-eval
          var fn = eval(this.callbacks.after_put);
          return fn(form, ui);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      return form;
    },
    // This function is for custom fields
    getCustomFields: function (entity) {
      getData('custom_fields').then((url) => {
        data(
          url,
          {},
          function (res) {
            this.customFieldData = res;
          }.bind(this)
        );
      });
      getData(`ui/${entity}/cf`).then((url) => {
        data(
          url,
          {},
          function (res) {
            this.formFields.fields = [...this.formFields.fields, ...res.fields];
          }.bind(this)
        );
      });
    },
    formChange: function () {
      if (this.formFields.buttons[0].disabled) {
        this.formFields.buttons[0].disabled = false;
        this.formFields.buttons = [...this.formFields.buttons];
      }
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    buttonDisable: function (after, before) {
      this.formFields.buttons[0].disabled = true;
      this.formFields.buttons = [...this.formFields.buttons];
    },
  },
};
</script>

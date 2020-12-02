<template>
  <div :class="addclass">
    <c-dynamic
      v-if="f_flag"
      :block="form_key.componentName"
      :block_params="editForm"
      :appProps="{
        fields: form_key.formFields,
        block_params: editForm,
        entity: form_key.entity ? form_key.entity : entity,
        template_params: templateParams,
      }"
      :key="re_renderkey"
    />
    <b-modal
      :id="modal_id"
      v-else
      :size="size"
      hide-footer
      :title="form_key.componentName.includes('c-f') ? (edit_value ? 'Edit ' : 'Add ') + name : name"
    >
      <component
        :is="form_key.componentName"
        :key="re_renderkey"
        v-bind="{
          callbacks,
          fields: form_key.formFields,
          block_params: editForm,
          entity: form_key.entity ? form_key.entity : entity,
          template_params: templateParams,
          r_entity: r_entity,
        }"
      ></component>
    </b-modal>
  </div>
</template>

<script>
import { propsFromParams } from '../js/global';
import Form1 from '../view/Crud-Form';
export default {
  components: {
    'c-f': Form1,
  },
  props: [
    'entity',
    'callbacks',
    'form_fields',
    'edit_value',
    'form_key',
    're_renderkey',
    'dynamic_label',
    'modal_id',
    'block_params',
    'templateParams',
    'r_entity',
  ],
  mounted () {
    this.name = this.entity;
    console.log('view-modal');
  },
  computed: {
    editForm: function () {
      return propsFromParams(this.edit_value);
    },
  },
  data () {
    return {
      addclass: '',
      name: '',
      modalSize: ['sm', 'md', 'lg', 'xl'],
      optionJson: [],
      size: 'md',
      f_flag: 0,
    };
  },
  watch: {
    dynamic_label: {
      // eslint-disable-next-line no-unused-vars
      handler (after, before) {
        this.name = this.entity;
      },
      deep: true,
    },
    form_key: {
      // eslint-disable-next-line no-unused-vars
      handler (after, before) {
        this.size = 'md';
        // eslint-disable-next-line no-unused-expressions
        this.f_flag === 1 ? (this.f_flag = 0) : '';
        if (this.block_params && this.block_params.blk && this.block_params.blk.split(':')[0] === after.componentName) {
          this.size = this.block_params.blk.split(':')[1];
          this.f_flag = this.block_params.blk.split(':')[1] === 'n' ? 1 : 0;
        }
        // This condition is mainly used to check whether to open modal or not.
        // We need to pass or=some name:nm where nm is no modal and also size of the modal
        if ((this.optionJson.find((i) => i.includes(after.componentName)) || '').split(':')[1]) {
          //   This.f_flag = (this.optionJson.find(i => i.includes(after.componentName)).split(':')[1] || '').toLowerCase() === 'nm' ? 1 : 0;
          const val = (this.optionJson.find((i) => i.includes(after.componentName)).split(':')[1] || '').toLowerCase();
          this.f_flag = val === 'nm' ? 1 : 0;
          this.size = this.modalSize.includes(val) ? val : 'md';
        }

        this.size = after.option && after.option.size ? after.option.size : this.size;

        this.addclass = this.size === 'xl' ? 'fscreen' : '';
      },
      deep: true,
    },
  },
};
</script>

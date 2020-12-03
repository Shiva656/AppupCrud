<template>
  <div ref="bulk-ref" class="list-alert alert alert-dark border
   fade show d-flex align-items-center justify-content-between">
    <div >
      <!-- <span class="items-selected">{{ key2.length }} items selected</span> | -->
      <span class="cursor-pointer" @click="getAllIds(lengthMatches)">{{lengthMatches}}</span>
      ({{ count.length }})
    </div>
    <div class="d-flex align-items-center">
      <!--Button Group Starts-->
      <ac-button-group :data="bulkForm" :key="bulkForm" @click="buttonClick">
        <i class="fas fa-circle"></i>
      </ac-button-group>
    </div>
  </div>
</template>

<script>
import { deleteDataUrl, getData } from '../js/global';
import ButtonGroup from '../Appup Components/ac-button-group';

export default {
  components: {
    'ac-button-group': ButtonGroup,
  },
  props: ['count', 'componentRef', 'fields', 'entity', 'templateParams', 'bulkOptions', 'callbacks'],
  data () {
    return {
      formData: '',
      bulkForm: [],
      lengthMatches: 'Select all',
      finalCount: true,
      getFilteredFields: [],
      getUrl: '',
      totalCount: '',
      deleteEntityUrl: '',
    };
  },
  mounted () {
    deleteDataUrl(this.b_entity).then(url => {
      this.deleteEntityUrl = url;
    });
    getData(this.b_entity).then(res => {
      this.getUrl = res;
    });
    this.bulkForm = JSON.parse(JSON.stringify(this.bulkOptions));
    if (!this.templateParams.bd) {
      this.bulkForm.push({ label: 'Delete', name: 'delete', type: 'delete', variant: 'white-20 ml-2 rounded btn-sm is_active' });
    }
  },
  methods: {
    buttonClick ({ item }) {
      if (item.type === 'delete') {
        this.start('delete', { ref: this.componentRef, id: this.count.map(i => i.id), deleteUrl: this.deleteEntityUrl, getUrl: this.getUrl });
      }
    },
    // Calling callback function in configuration before delete call
    before_delete: function (form, ui) {
      if ((this.callbacks || {}).before_delete) {
        try {
          // eslint-disable-next-line no-eval
          var fn = eval(this.callbacks.before_delete);
          return fn(form, ui);
        } catch (e) {}
      }
      return form;
    },
    // Calling callback function in configuration after delete call
    after_delete: function (form, ui) {
      if ((this.callbacks || {}).after_delete) {
        try {
          // eslint-disable-next-line no-eval
          var fn = eval(this.callbacks.after_delete);
          return fn(form, ui);
        } catch (e) {}
      }
      return form;
    },
  },
};
</script>

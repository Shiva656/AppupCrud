<template>
       <b-modal ref='ref1'
        v-bind="data"
         id="appup-modal"
    >

  <component v-bind:is="component" v-for="component in components" :key='component'></component>

    <slot></slot>
    </b-modal>

</template>
<script>
/**
     * Appup Modal with option to display message, confirm or form
     *
     * Based on type of display, buttons will be displayed.
     *
     * TODO:
     * > handle ok button when type is confirm - invoking url or function etc..
     * > handle closing the form when the form is submitted upon successful operation.
    */
export default {
  name: 'appup-modal',
  data: function () {
    return {
      components: [],
      data: {}
    };
  },
  methods: {
    // Sets the component to be shown in the modal dynamically
    setComponent: function (component) {
      // Set to only one component
      this.components = [];
      this.components.push(component);
    },
    // Set the props data for the modal like cancel title, ok title etc.
    setData (data) {
      // Possible keys
      this.data = {};

      // Set keys to b-modal if key starts with modal
      Object.keys(data).forEach(key => {
        if (key.startsWith('modal-')) {
          // Remove modal-
          this.data[key.replace('modal-', '')] = data[key]
        }
      });
    },
    // From handler workflows, user will provide b-modal vue props as config - https://bootstrap-vue.js.org/docs/components/modal/
    setConfig (config) {
      // Merge config in data, props are automatically added using v-bind
      Object.assign(this.data, config);
    }
  },
  // Create Modal instance and store it in window - workflow will show this instance
  mounted: function () {
    console.log('Modal mounted')
    window.AppupModalInstance = this
  }
};
</script>

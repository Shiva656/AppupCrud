<template>
  <div>
    <b-input-group class=" input-group-merge">
      <b-input-group-prepend
        is-text
        v-if="search_symbol"
        class="search-symbol cursor-pointer"
        v-b-tooltip.hover
        :title="(show_tooltip)?tooltip_message:''"
      >
        <i class="fe fe-search" @click="onInput"></i>
      </b-input-group-prepend>
       <b-input-group-prepend v-else v-b-tooltip.hover :title="(show_tooltip)?tooltip_message:''">
        <b-button variant="outline-secondary" @click="onInput">search</b-button>
      </b-input-group-prepend>
      <b-input
        v-model="searchValue"
        class="form-control-prepended search"
        :placeholder="placeholder"
        @keypress.enter="searchResults"
        @keyup='$emit("keyup", $event)'
      />
    </b-input-group>
  </div>
</template>
<script>
export default {
  name: 'ac-simpleSearch',
  props: {
    /**
     * Placeholder for the searchbar
     * @param {Boolean} placeholder - placeholder for input
     * @label Placeholder
     */
    placeholder: {
      type: String,
      required: false,
      default: 'Search'
    },
    /**
     * Displays search symbol
     * @param {Boolean} search_symbol - default symbol
     * @label Search Symbol
     */
    search_symbol: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * To display tooltip for search icon
     * @param {Boolean} show_tooltip
     * @label Show Tooltip
     */
    show_tooltip: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * To display tooltip message search icon
     * @param {string} tooltip_message
     * @label Tooltip Message
     */

    tooltip_message: {
      type: String,
      required: false,
      default: 'Search'
    }
  },
  data: function () {
    return {
      searchValue: ''
    };
  },
  methods: {
    searchResults () {
      this.$emit('enter', this.searchValue);
    },
    onInput () {
      this.$emit('button_click', this.searchValue);
    }
  }
};
</script>
<style>
</style>

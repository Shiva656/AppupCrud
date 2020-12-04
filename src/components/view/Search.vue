<template>
  <div>
    <SimpleSearch
      ref="searchRef"
      :placeholder="sPlaceholder"
      search_symbol="true"
      @enter="Search"
      @keyup="Search"
    ></SimpleSearch>
  </div>
</template>
<script>
import acSimpleSearch from '../Appup Components/ac-simple-search';
export default {
  components: {
    SimpleSearch: acSimpleSearch,
  },
  props: ['column', 'entity'],
  mounted () {
    //   This.getLabels();
  },
  data () {
    return {
      sPlaceholder: '',
    };
  },
  methods: {
    Search: function (value) {
      if (value.key !== 'Shift' && value.key !== 'Alt' && value.key !== 'Control') {
        if (typeof value !== 'string') {
          value = value.target.value;
        }
        let key = '';
        if (value.length > 0 && this.column !== undefined) {
          const columnKey = this.column.split('.');
          for (var i = 0; i < columnKey.length; i++) {
            key = `${key}${i === 0 ? '' : ' or '}${columnKey[i]} like '%25${value}%25'`;
          }
        }
        this.$emit('search_value', `${key.length > 0 ? `(${key})` : `${key}`}`, value);
      }
    },
    getLabels: function () {
      var tempColumn = this.column;
      tempColumn = tempColumn.split('.').map((name) => {
        return { name: name };
      });
      console.log(tempColumn);
    },
  },
};
</script>

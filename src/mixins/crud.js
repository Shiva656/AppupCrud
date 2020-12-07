/**
 * @mixin
 */
export const crudMixin = {
  methods: {
    dropdownJson (item) {
      const obj = JSON.parse(JSON.stringify(this.collection.dropdownOptions));
      obj.forEach(r => {
        r.item = item;
      });
      if (this.collection.dropdownOptions && this.collection.dropdownOptions[0].condition) {
        // eslint-disable-next-line no-eval
        const z = eval(this.collection.dropdownOptions[0].condition);
        const options = (obj || []).filter(i => {
          return (i.value || '').includes(z);
        });
        return options;
      } else {
        return obj;
      }
    }
  }
};

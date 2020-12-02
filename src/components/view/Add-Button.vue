<template>
  <div>
    <ac-button-group :data="buttonJson" v-if='buttonJson.length>0' @click="buttonClick"></ac-button-group>
  </div>
</template>
<script>
// Import { propsFromType } from '../../js/templates';
// Import { getMenuName, sentenceCase } from '../../js/util'
// Import { getDisplayableColumns } from '../../js/data'
import ButtonGroup from '../Appup Components/ac-button-group';
export default {
  components: {
    'ac-button-group': ButtonGroup,
  },
  props: ['templateParams', 'entity'],
  data () {
    return {
      buttonJson: [],
    };
  },
  mounted () {
    let count = 0;
    if (this.templateParams.adb) {
      this.buttonJson = this.templateParams.adb
        .split('.')
        .filter((item) => {
          if (item === 'f') {
            count = 1;
          }
          return !(item === 'f');
        })
        .map((item) => {
          return {
            // Name: `Add ${sentenceCase(item)}`,
            labelname: '',
            type: item,
            variant: 'outline-secondary px-4 text-nowrap mr-2',
          };
        });
    }
    if (!count) {
      this.buttonJson.push({
        name: `Add ${this.entity}`,
        labelname: '',
        type: '',
        variant: 'primary text-nowrap',
      });
    }
  },

  methods: {
    buttonClick: function (key) {
      if (key.item.type) {
        this.getFields(key.item.type);
      } else {
        this.$emit('add_click');
      }
    },
    getFields: function () {
      // PropsFromType('d', key, '')
      //   .then(res => {
      //     GetDisplayableColumns(key, res.fields, '_f')
      //       .then(response => {
      //         This.$emit('add_click', {
      //           Fields: response,
      //           Entity: key
      //         });
      //       });
      //   });
    },
  },
};
</script>

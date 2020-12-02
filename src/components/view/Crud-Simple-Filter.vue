<template>
  <div>
    <ac-simple-filter :filter_json="filterFields" @input="filterForm"></ac-simple-filter>
  </div>
</template>

<script>
import { getApp, getDisplayableColumns } from '../js/global';

// Import { getCookie, parseJwt } from '../../js/tenant'

export default {
  props: ['fields', 'entity', 'templateParams'],
  mounted () {
    console.log('iam in filter');
    this.appName = getApp();
    this.filterjson();
  },
  data () {
    return {
      flag: false,
      appName: '',
      count: 0,
      strCondition: {
        '=': ' in ',
        '!=': ' not in ',
      },
      filterFields: [
        {
          type: 'dropdown',
          name: 'title',
          inlineClass: 'col-md-4',
          option: [
            {
              value: 'deselect',
              label: 'All',
              checked: true,
            },
          ],
          required: true,
        },
      ],
    };
  },
  methods: {
    filterjson: function () {
      getDisplayableColumns('', this.fields, '_sf').then((res) => {
        this.filterFields = res;
      });
    },
    preloadFilter: function (key) {
      if (key.lhs_pid) {
        if (key.url.includes('?') && !key.url.includes(this.$route.params.lhs_pid.split('=')[0])) {
          key.url += ` and ${this.$route.params.lhs_pid.split(':').join('=')}`;
        } else if (!key.url.includes('?')) {
          key.url += `?where=${this.$route.params.lhs_pid.split(':').join('=')}`;
        }
      }
    },
    filterForm: function (value) {
      let z = '';
      if (value.condition) {
        for (var key in value.json) {
          var condition = '=';
          if (value.json[key] === 'my' || value.json[key] === '') {
            z = `${z.length > 0 ? `${z} and ` : ''}`;
            // Z = `${z}${key}='${parseJwt(getCookie('token')).user_id}'`;
          } else {
            if (value.json[key] !== 'deselect') {
              var count = 1;
              var _a = '';
              z = `${z.length > 0 ? `${z} and ` : ''}`;
              // It is for daterange
              if (
                value.filterJSON.find((i) => {
                  return i.name === key;
                }).type === 'daterange'
              ) {
                if (value.json[key].includes('to')) {
                  let a = '';
                  value.json[key].split(' ').forEach((i, index) => {
                    if (index === 0 || index === 2) {
                      a = a + `${i.split('-')[2]}-${i.split('-')[1]}-${i.split('-')[0]}`;
                    }
                    if (index === 1) {
                      a = `${a}' and '`;
                    }
                  });

                  _a = z + `date(${key}) between '${a}'`;
                  count = -1;
                } else {
                  count = 0;
                  z = z.substring(0, z.length - 5);
                }
              }

              if (count > 0) {
                _a = `${key}${
                  (value.json[key] + '').includes(',')
                    ? `${this.strCondition[condition]}("${(value.json[key] + '').replace(',', '","')}")`
                    : ` ${condition} ${key.includes('date') ? '' : "'"}${value.json[key] + ''}'`
                }`;
              }
              z = `${(value.json[key] + '').length > 0 ? `${z}${_a}` : ''}`;
              z = key.includes('((') ? z.slice(0, -1) : z;
            }
          }
        }
      }
      // If(z)
      if (this.count > 1 || z) {
        this.$emit('filter_form', z);
      }
      this.count++;
    },
  },
};
</script>

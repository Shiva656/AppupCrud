<template>
  <div>
    <b-row class="my-1" v-for="(component, index) in formSchema.fields" :key="index">
      <b-col sm="3">
        <label for="input-none">{{component.label}}:</label>
      </b-col>
      <b-col sm="9">
        <appup-datetime
          :type="component.input"
          :placeholder="component.placeholder"
          v-model="formJson[component.name]"
          :config="component.custom"
        ></appup-datetime>
        {{formJson}}
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formSchema: {
        fields: [
          {
            type: 'appup-datetime',
            name: 'date',
            input: 'date',
            label: 'Date Picker',
            placeholder: 'Date here',
            custom: {
              disable: [
                function (date) {
                  // Return true to disable
                  return date > new Date();
                }
              ],
              dateFormat: 'Y-m-d'
            }
          },
          {
            type: 'appup-datetime',
            name: 'time',
            input: 'time',
            label: 'Time Picker',
            placeholder: 'Time here',
            custom: {
              dateFormat: 'i:H:S'
            }
          },
          {
            type: 'appup-datetime',
            name: 'date_time',
            input: 'datetime',
            label: 'Datetime Picker',
            placeholder: 'DateTime here',
            custom: {
              disable: [
                function (date) {
                  // Return true to disable
                  return date >= new Date('2020-04-28 00:00:00');
                }
              ],
              dateFormat: 'Y-m-d h:i:s',
            }
          },
          {
            type: 'appup-datetime',
            name: 'date_range',
            input: 'daterange',
            label: 'Datetime Picker',
            placeholder: 'DateTime here',
            custom: {
              disable: [
                function (date) {
                  // Return true to disable
                  return date >= new Date('2020-04-28');
                }
              ],
              dateFormat: 'Y-m-d',
            }
          }
        ]
      },
      formJson: {
        date: '',
        time: '',
        date_time: '',
        date_range: ''
      }
    };
  },
  computed: {},
  methods: {}
};
</script>

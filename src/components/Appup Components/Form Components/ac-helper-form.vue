<template>
  <div>
    <div class="row">
      <!-- Load from JSON Link-->
      <div class="col-6">
        <a href @click.prevent="showJsonModel('JSON')" class>Import from JSON</a>
      </div>

      <!-- Load from DB Link-->
      <div class="col-6">
        <a href @click.prevent="showJsonModel('DB')" class>Import from db</a>
      </div>
    </div>

    <!-- modal for loading fields json based on type(db or Json)-->
    <b-modal ref="my-modal" hide-footer>
      <template slot="modal-title">
        <p v-if="usertype == 'JSON'">Import from JSON</p>
        <p v-if="usertype == 'DB'">Import from DB</p>
      </template>

      <div class="d-block text-center">
        <div v-if="usertype == 'JSON'" class="form-group">
          <label id="label">JSON</label>

          <!--user will give here Array-of-JSONS -->
          <b-form-textarea v-model="userJSON" placeholder="Enter JSON..."></b-form-textarea>
        </div>

        <!--rest call for import from DB -->
        <div v-if="usertype == 'DB'" class="form-group">
          <label id="label">URL</label>
          <b-input type="text" v-model="userURL"></b-input>

          <!-- Token for rest call-->
          <label id="label">Token</label>
          <b-input type="text" v-model="authtoken"></b-input>
        </div>

        <!-- load from json submit button-->
        <b-button
          v-if="usertype == 'JSON'"
          class="mt-3"
          variant="primary"
          @click="loadFromJSON(usertype)"
        >submit</b-button>

        <!-- Load from db submit button-->
        <b-button
          v-if="usertype == 'DB'"
          class="mt-3"
          variant="primary"
          @click="loadFromDB(usertype)"
        >submit</b-button>
      </div>
    </b-modal>

    <!--user can add fields here -->
    <appup-grid
      ref="appupGrid"
      :columns="columns"
      :form-json="formJson"
      v-model="gridModelJson"
      @saveRecord="onSaveRecord"
      @input="deleteRecord"
        @copy="copyRecord"
    />
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import axios from 'axios';

// Importing form-json which is having all fields types and props input for appup-grid component.
import formjson from './form.json';
const lodash = require('lodash');

export default {
  props: {
    /**
     * Result of appup-grid(array-of-jsons)
     */
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      /**
       * When user add a field using appup-grid or load from json or db -- will show label and type of the field.
       */
      columns: [
        {
          key: 'label',
          label: 'Label',
          class: 'text-center'
        },
        {
          key: 'type',
          label: 'Type',
          class: 'text-center'
        },
        {
          key: 'actions',
          label: ''
        }
      ],
      formJson: {},
      userJSON: '',
      userURL: '',
      usertype: '',
      authtoken: '',
      gridModelJson: []
    };
  },
  created () {
    this.formJson = {};
    this.formJson = JSON.parse(JSON.stringify(formjson));
    const grdiFormJson = {
      id: 'formJson',
      type: 'grid',
      name: 'formJson',
      label: 'FormJson',
      columns: [
        {
          key: 'label',
          label: 'Label'
        },
        {
          key: 'type',
          label: 'Type'
        },
        {
          key: 'required',
          label: 'equired'
        },
        {
          key: 'actions',
          label: ''
        }
      ],
      formJson: this.formJson,
      condition: "this.form.type != null && this.form.type == 'grid'",
      required: true,
      container: 'settings',
      'container-name': 'Info',
      'container-active': 'true',
      'tab-order': '2'
    };
    this.formJson.fields.push(grdiFormJson);
    this.formJson.fields = lodash.sortBy(this.formJson.fields, [
      function (o) {
        return o['tab-order'];
      }
    ]);
    this.formJson.fields.push({ type: 'hidden', name: 'last' });
    this.convert_to_array(this.value);
  },
  methods: {
    convert_to_array (val) {
      if (typeof val === 'string') {
        const value = JSON.parse(val);
        if (value.fields) this.gridModelJson = value.fields;
        else this.gridModelJson = value;
      } else {
        if (val.fields) this.gridModelJson = val.fields;
        else this.gridModelJson = val;
      }
    },
    // To show modal on click load from JSON or DB
    showJsonModel: function (type) {
      this.usertype = type;
      this.$refs['my-modal'].show();
    },

    // Method for load from DB will do axios call and append the response data to appup-grid data
    loadFromDB: function (type) {
      // eslint-disable-next-line eqeqeq
      if (type == 'DB') {
        console.log('this is from DB' + this.userURL);
        // Let config = {
        //   Headers: {
        //     Token: this.authtoken
        //   }
        // };
        var self = this;
        // Axios
        //   .get(this.userURL, config)
        //   .then(function(response) {
        self.$appupajax
          .get2(
            self.userURL,
            {},
            {},
            {
              token: self.authtoken,
              withCredentials: true,
              credentials: 'include'
            }
          )
          // Self.$appupajax
          //   .get2(
          //     Self.userURL,
          //     {},
          //     {
          //       Token: self.authtoken,
          //       WithCredentials: true,
          //       Credentials: "include"
          //     }
          //   )
          .then(self.$appupajax.handleResponse)
          .then(response => {
            console.log(response);
            self.$refs.appupGrid.addData(
              response.data[0].all_form_fields['fields:']
            );
            this.$refs['my-modal'].hide();
          })
          .catch(function (error) {
            // Handle error
            console.log(error);
            this.$refs['my-modal'].hide();
          })
          .finally(function () {
            this.userURL = '';
            this.authtoken = '';
          });
      } else {
        console.log('check load type');
      }
    },

    // User will give the formJson(Array-of-JSONS) it will append to appup-grid data.
    loadFromJSON: function (type) {
      // eslint-disable-next-line eqeqeq
      if (type == 'JSON') {
        var jsonParse = JSON.parse(this.userJSON);
        console.log(this.$refs.appupGrid);
        this.$refs.appupGrid.addData(jsonParse);
        this.$refs['my-modal'].hide();
      } else {
        console.log('check load type');
      }
      this.userJSON = '';
    },
    onSaveRecord () {
      this.$emit('saveRecord');
    },
    deleteRecord () {
      this.$emit('deleteItem');
    },
    copyRecord () {
      this.$emit('copyItem');
    }
  },
  watch: {
    value (val) {
      this.convert_to_array(val);
    },
    gridModelJson (val) {
      /**
       * In formJson fields like checkbox,dropdown,..etc have prop option for that used grid component.
       * Result of grid will be array-of-jsons in string format so parsing the array-of-jsons
       *
       */
      val.map(field => {
        if (field.formJson) {
          if (typeof field.formJson === 'string') { field.formJson = JSON.parse(field.formJson); }
          // To support backward compatability (before formjson saved as object with fields array)
          // eslint-disable-next-line eqeqeq
          if (field.type == 'grid' && field.formJson.fields) {
            const arr = field.formJson.fields;
            delete field.formJson;
            field.formJson = arr;
          }
        }
        return field;
      });
      this.$emit('input', val);
    }
  }
};
</script>

<style>
#label {
  display: flex;
}
</style>

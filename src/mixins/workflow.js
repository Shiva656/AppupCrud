// Import handlebars
import * as Cookie from 'tiny-cookie'

// Handlebars
import Handlebars from 'handlebars/dist/handlebars.js'

// Default HTTP in vuejs - could not understand how to do default method. Hence, axios
import HTTP from 'axios'

// Notifications for alerts
import Vue from 'vue'
import Notifications from 'vue-notification'

// Import jsonp dependency
const jsonpAdapter = require('axios-jsonp');

// Import transform-node dependency
const dataTransform = require('node-json-transform').DataTransform
Vue.use(Notifications)

// Related to geolocation node
var geoProps = {};
var geoJson = {};
var geoData = {};

// JSON data comes as [Object object] in handlebars. Hence json helper.
Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

// Helper to Parse JSON string
// Usage {{json-parse jsonStr key}}
Handlebars.registerHelper('json-parse', function (jsonStr, key) {
  var obj = JSON.parse(jsonStr);
  return obj[key];
});

// Form Encoded
Handlebars.registerHelper('form-encoded', function (context) {
  var query = '';

  // Form encode each key
  Object.keys(context).forEach(function (key, index) {
    query += encodeURIComponent(key) + '=' + encodeURIComponent(context[key]) + '&';
  });

  // Remove last &, otherwise, it is sending empty
  if (query.endsWith('&')) { query = query.slice(0, -1) }

  /* For (key in context) {
        query += encodeURIComponent(key)+"="+encodeURIComponent(context[key])+"&";
    } */
  return query;
});

/**
 * @mixin
 */
export const Workflow = {
  // Props for ui elements to send while initiating the route. we will send entity etc. if not from route params
  props: {
    workflow_params:
        {
        }
  },
  data () {
    return {
      handlerList_: [],
      // This data variable is used to exchange data between two or more workflows when executed in chain
      map: {},
    }
  },
  methods: {

    /**
         * Add alias to run workflow for public API
         * Temporary workaround
         *
         */

    _start (id, data = {}) {
      this.start(id, data);
    },

    /**
        * This is the start of the workflow. It looks at the workflow id and starts executing the workflow
        *
        * @param {String|Array} id - The id of the workflow
        * Array example:
            [
                {
                    name: "",
                    params: {}
                },
                {
                    name: "",
                    params: {}
                },
                {
                    name: "",
                    params: {}
                }
            ]
        */
    start (id, data = {}) {
      var handlerName;

      if (Array.isArray(id)) {
        this.handlerList_ = id.slice(0);
        const handler = this.handlerList_.shift();
        handlerName = (handler) ? handler.name : '';
        if (handler) {
          // This solves form submit handler params string issue
          if (typeof handler.params === 'string') {
            try {
              data = JSON.parse(handler.params);
            } catch (error) {
              data = {};
            }
          } else if (typeof handler.params === 'object') {
            data = { ...handler.params };
          }
        } else {
          data = {}
        }
        // If data is provided as JSON string format
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (error) {
            data = {};
          }
        }
      } else {
        this.handlerList_ = id.split(',');
        handlerName = this.handlerList_.shift();
      }
      let WorkflowJSON = {}
      WorkflowJSON = window.WorkflowJSON;
      console.log(WorkflowJSON)
      console.log(data)

      // Clone as handlebars changes the objects
      var workflowJsonCopy = this.cloneObject(WorkflowJSON)

      // Get start workflow id
      var actions = workflowJsonCopy.find(item => {
        // eslint-disable-next-line eqeqeq
        return item.id == handlerName
      })

      if (handlerName && !actions) {
        this.$notify({
          group: 'toaster',
          title: 'Error',
          type: 'error',
          text: 'Workflow not found'
        });
        console.log('Workflow not found');
        return;
      }

      // Get start node
      var json = actions.workflow;
      var nextCode = json.find(item => {
        // eslint-disable-next-line eqeqeq
        return item.type == 'start'
      })

      // Execute next code
      this.execute_next_code(json, nextCode.next.success, data)
    },
    /**
         * Clones an object
         *
         * @param {Object} object - Object to clone
         */
    cloneObject (object) {
      // eslint-disable-next-line no-undef
      return JSON.parse(JSON.stringify(WorkflowJSON));
    },
    /**
         * Get handlebar compiled data from global UIjson, form data and workflow data
         *
         * @param {Object} data - Workflow data which is passed in each loop
         */
    get_hb_json (data) {
      // Mix both data and form
      var hb = data;

      // Add route params
      hb.route = {};

      if (this.$route && this.$route.params) { hb.route.params = this.$route.params; }

      // Add app_ui json
      if (window.UIJSON) { hb.ui_json = window.UIJSON }

      // Add Settings
      if (window.Settings) { hb.settings = window.Settings }

      // Add form data
      if (this.form) { hb.form = this.form; }

      // Add Appup global object
      if (window.APPUP) { hb.appup = window.APPUP; }

      return hb;
    },
    /**
        * Compiles the keys in object with HB
        *
        * @param {Object} object - Object (template to compile)
        * @param {Object} data - data to compile with
        */
    hb_compile (object, data) {
      // Apply handlebars on each key/value pairs
      var $s = this;
      Object.keys(object).forEach(function (keyValue) {
        // Skip if the key is an object. We should reiterate
        if (typeof object[keyValue] !== 'object') {
          var value = object[keyValue];

          // Handlebars compile all the data
          var template = Handlebars.compile(value);
          value = template($s.get_hb_json(data))

          // We will compile again as the key may also be handlebars
          template = Handlebars.compile(value)
          object[keyValue] = template($s.get_hb_json(data))

          // Console.log("Compiling handlebars " + keyValue + " " + value + " with " + JSON.stringify($s.get_hb_json(data)) + " " + next_code[keyValue]);
        }
      });

      return object;
    },
    /**
         * Executes next code
         *
         * @param {Object} json - Workflow json
         * @param {Object} node_id - Node id in workflow (branch - success, failure)
         * @param {Object} data - Workflow data
         */
    execute_next_code (json, nodeId, data) {
      // Console.log('Executing ' + node_id + " " + JSON.stringify(data))

      // Find next node from id (success, failure)
      var nextCode = json.find(item => {
        // eslint-disable-next-line eqeqeq
        return item.id == nodeId
      })

      // Exit if not found
      if (!nextCode) {
        console.log('Not found ' + nodeId);
        // Run chained workflow
        if (this.handlerList_.length > 0) {
          this.start(this.handlerList_);
        }
        return;
      }

      // Compile the next code keys with HB
      nextCode = this.hb_compile(nextCode, data);

      // Execute Get next node
      // eslint-disable-next-line no-eval
      eval('this.' + nextCode.type)(json, nextCode, data);
    },
    /**
         * Validates a form and executes next node based on the result
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    async validate (json, props, data) {
      console.log('validate ' + JSON.stringify(props))

      // Validate
      var $s = this;
      const result = await this.$validator.validateAll()

      if (result && $s.designer_save) {
        // We need to call save in the form because of the designer component
        // This has to be async way
        var sectionValidation = [];
        // If sections fields available more than
        if ($s.$parent.$children[0].$refs.appupSection && $s.$parent.$children[0].$refs.appupSection.length) {
          const sectionsArr = $s.$parent.$children[0].$refs.appupSection;
          for (var j = 0; j < sectionsArr.length; j++) {
            if (sectionsArr[j].rule_json.controls && sectionsArr[j].rule_json.controls.length) {
              const validateStatus = await sectionsArr[j].$validator.validateAll();
              sectionValidation.push(validateStatus);
            }
          }
          console.log('result', sectionValidation);
          // Check if sections validation is true or not and execute the next node
          if (!sectionValidation.includes(false)) {
            console.log('form validated');
            $s.designer_save(function () {
              $s.builder_save(function () {
                $s.bm_save(function () {
                  $s.execute_next_code(json, props.next.success, data)
                });
              });
            });
          } else {
            console.log('Form not validated')
            $s.execute_next_code(json, props.next.failure, data)
          }
        } else {
          $s.designer_save(function () {
            $s.builder_save(function () {
              $s.bm_save(function () {
                $s.execute_next_code(json, props.next.success, data)
              });
            });
          });
        }
      } else {
        if ($s.$parent.$children[0].$refs.appupSection) {
          $s.$parent.$children[0].$refs.appupSection[0].$validator.validateAll();
        }
        console.log('Form not validated')
        $s.execute_next_code(json, props.next.failure, data)
      }
    },
    /**
         * Sets a cookie and executes next node (key, value)
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    set_cookie (json, props, data) {
      console.log('set_cookie ' + JSON.stringify(props))

      // Set Cookie
      const cookiesData = props.cookie_key_grid[0];
      const keys = Object.keys(cookiesData)
      for (var i = 0; i < keys.length; i++) {
        Cookie.setRaw(keys[i], cookiesData[keys[i]]);
      }

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Gets a cookie (key) and sets to variable
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    get_cookie (json, props, data) {
      data[props.var] = Cookie.get(props.key);

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Deletes a cookie (key)
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    delete_cookie (json, props, data) {
      Cookie.remove(props.key);

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Ajax call - calls url via method (PUT, POST, GET, DELETE or UPDATE), posts data and sets
         * the response to var. (You should call var.data to get the actual message)
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    ajax (json, props, data) {
      // Loader image will be visible
      this.$root.loader = true;
      console.log('ajax ' + JSON.stringify(props))
      console.log(props)

      // Set content-type if defined
      var headers = {};

      if (props.headers != null) {
        for (var i = 0; i < props.headers.length; i++) {
          headers = Object.assign(headers, props.headers[i])
        }
      }

      // Create a default axios object
      const axiosObject = {
        method: props.method,
        url: props.url,
        data: props.data,
        headers: headers,
        withCredentials: true,
        credentials: 'include'
      }

      // Add adapter and callback if jsonp is true
      // eslint-disable-next-line eqeqeq
      if (props.jsonp == 'true') {
        // eslint-disable-next-line no-unused-expressions
        axiosObject.adapter = jsonpAdapter; // Added jsonp callback
        axiosObject.callbackParamName = 'jsonp' // Name of the callback param
      }

      /* This.$http.get(props.url, {}) */
      if (props.method && props.method.toUpperCase() === 'GET') {
        this.$appupajax.get2(props.url, props.data, {}, { ...headers, withCredentials: true, credentials: 'include' })
          .then(this.$appupajax.handleResponse).then(response => {
            data[props.var] = response;
            // Hiding loader image
            this.$root.loader = false;
            console.log(response);

            // Call success
            this.execute_next_code(json, props.next.success, data)
          }, (error) => {
            data[props.var] = error.response;
            console.log(error);
            this.$root.loader = false;
            // Call failure
            this.execute_next_code(json, props.next.failure, data)
          })
      } else {
        HTTP(axiosObject).then((response) => {
          data[props.var] = response;
          // Hiding loader image
          this.$root.loader = false;
          console.log(response);

          // Call success
          this.execute_next_code(json, props.next.success, data)
        }, (error) => {
          data[props.var] = error.response;
          console.log(error);
          this.$root.loader = false;
          // Call failure
          this.execute_next_code(json, props.next.failure, data)
        })
      }
    },
    /**
         * Navigates to the next route
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    navigate (json, props, data) {
      this.$router.push(props.url);
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Sets a var
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    set_var (json, props, data) {
      data[props.output] = props.value;
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Sets local storage
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    set_local_storage (json, props, data) {

    },
    /**
         * Gets local storage
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    get_local_storage (json, props, data) {

    },
    /**
         * Shows alert - title, alert_type (Error, success, warning) and message
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    alert (json, props, data) {
      console.log('alert ' + JSON.stringify(props))

      var notifyConfig = {
        group: 'toaster',
        title: props.title,
        type: props.variant,
        text: props.message
      };
      // Check for duration
      if (props.duration) {
        notifyConfig.duration = parseFloat(props.duration);
      }
      // Set default variant to undefinded value
      // eslint-disable-next-line   no-prototype-builtins
      if (props.hasOwnProperty('variant') === false) {
        notifyConfig.type = 'default';
      }

      this.$notify(notifyConfig);

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Executes javascript code. Data is resetted to the data returned from function.
         * Ensure that the javascript function returns the original data also and NOT just the changed attributes.
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    js (json, props, data) {
      console.log('js ' + JSON.stringify(props))
      // eslint-disable-next-line no-eval
      var jsFunction = eval('(' + props.code + ')');
      var ret = jsFunction(data, this);
      if (ret) { data = ret; }

      console.log(data);

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
         * Deserializes the current form with the data
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    deserialize_form (json, props, data) {
      console.log('deserialize ' + JSON.stringify(props))

      // Parse the json message
      // Var response = JSON.parse(props.data);
      var response = data[props.data];

      console.log('Deserializing')

      // This.form=response;

      if (this.$options && this.$options.name === 'appup-form') {
        this.formFields.forEach(field => {
          // eslint-disable-next-line no-prototype-builtins
          if (response.hasOwnProperty(field.name)) {
            this.$set(this.form, field.name, response[field.name]);
          }
        });
      } else if (this.$options && this.$options.name === 'appup-form2') {
        this.formFields.forEach(section => {
          section.forEach(subSection => {
            subSection.forEach(group => {
              group.forEach(field => {
                // eslint-disable-next-line no-prototype-builtins
                if (response.hasOwnProperty(field.name)) {
                  this.$set(this.form, field.name, response[field.name]);
                }
              });
            });
          });
        });
      }

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
        * Shows the modal with props
        *
        * @param {Object} json - Workflow json
        * @param {Object} props - Properties of the node in the workflow json (title, component name, similar to bootstrap vue modal)
        * @param {Object} data - Workflow data
        */
    modal (json, props, data) {
      console.log('modal ' + JSON.stringify(props))

      // Create VueJS Component with the body
      const component = window.Vue.component('handler-modal',
        {
          template: props.body
        }
      );

      // Check if Appup Modal is valid
      if (!window.AppupModalInstance) {
        console.log('Error modal not found')
        return;
      }

      if (props['modal-no-close-on-backdrop'] && typeof (props['modal-no-close-on-backdrop']) === 'string') {
        // eslint-disable-next-line eqeqeq
        props['modal-no-close-on-backdrop'] = props['modal-no-close-on-backdrop'] == 'true';
      }
      if (props['modal-no-close-on-esc'] && typeof (props['modal-no-close-on-esc']) === 'string') {
        // eslint-disable-next-line eqeqeq
        props['modal-no-close-on-esc'] = props['modal-no-close-on-esc'] == 'true';
      }

      // Set Props - this copies all props starting with 'modal-'
      window.AppupModalInstance.setData(props);

      // Set b-modal configs - ref: https://bootstrap-vue.js.org/docs/components/modal/
      if (props.config) {
        window.AppupModalInstance.setConfig(JSON.parse(props.config));
      }

      // Set the component and show the modal
      window.AppupModalInstance.setComponent(component)
      window.AppupModalInstance.$root.$emit('bv::show::modal', 'appup-modal')

      // Holding reference of this,so that we can reference it in "ok" and "cence"
      const that = this;

      // Set the event handlers
      window.AppupModalInstance.$refs.ref1.$off('ok')
      window.AppupModalInstance.$refs.ref1.$on('ok', function (e) {
        // eslint-disable-next-line eqeqeq
        if (props.preventOk == 'true') e.preventDefault();
        else console.log('OK');
        console.log('OK')
        that.execute_next_code(json, props.next.success, data)
      })

      // Register for cancel
      window.AppupModalInstance.$refs.ref1.$off('cancel')
      window.AppupModalInstance.$refs.ref1.$on('cancel', function () {
        console.log('Cancel')
        that.execute_next_code(json, props.next.failure, data)
      })
    },
    modal_hide (json, props, data) {
      // eslint-disable-next-line no-undef
      close(modal)
    },
    /**
         * Shows the modal with props
         *
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json (title, component name, similar to bootstrap vue modal)
         * @param {Object} data - Workflow data
         */
    serialize (json, props, data) {
      // Handlebars - get the form encoded data
      const template = Handlebars.compile('{{{form-encoded form}}}');
      const value = template(this.get_hb_json(data))

      // Set the variable
      data[props.output] = value;
      this.execute_next_code(json, props.next.success, data)
    },

    /**
        * Node used for conditional check
        *
        * @param {Object} json - Workflow json
        * @param {Object} props - Properties of the node in the workflow json
        * {
                "id": "PBXXOW4sClPGS",
                "type": "if_condition",
                "next": {
                    "success": "PBX9nUDsTk1N9",
                    "failure": "PBXdTkBZRwopG"
                },
                "nodename": "If Condition",
                "if_type": "value",
                "variable1": "{{var1}}",
                "comparator": "<",
                "variable2": "{{var2}}"
            }
        * @param {Object} data - Workflow data if any
        */
    if_condition (json, props, data) {
      try {
        if (props.if_type === 'value') {
          // eslint-disable-next-line no-eval
          if (eval(props.variable1 + ' ' + props.comparator + ' ' + props.variable2)) {
            this.execute_next_code(json, props.next.success, data);
            return;
          }
        } else if (props.if_type === 'strlen') {
          var conditionStr = 'false';
          if (isNaN(props.variable2)) {
            conditionStr = props.variable1 + ' ' + props.comparator + " '" + props.variable2 + "'.length";
          } else {
            conditionStr = "'" + props.variable1 + "'.length " + props.comparator + ' ' + props.variable2;
          }
          // eslint-disable-next-line no-eval
          if (eval(conditionStr)) {
            this.execute_next_code(json, props.next.success, data);
            return;
          }
        }
      } catch (e) {
        this.execute_next_code(json, props.next.failure, data);
        return;
      }

      this.execute_next_code(json, props.next.failure, data);
    },

    /**
        * Node used for switch case
        *
        * @param {Object} json - Workflow json
        * @param {Object} props - Properties of the node in the workflow json
        * {
                "id": "PBXaEQ5RCzxqn",
                "type": "switch_case",
                "next": {
                    "two": "PBXF8IHgGweMH",
                    "one": "hangup"
                },
                "nodename": "Switch Case",
                "variable": "{{var1}}",
                "cases": [
                    {}
                ]
            }
        * @param {Object} data - Workflow data if any
        */
    switch_case (json, props, data) {
      if (props.next[props.variable]) {
        this.execute_next_code(json, props.next[props.variable], data);
        return;
      }
      console.log(props.variable + ' not found in Switch case');
    },

    /**
         * Node use for transforming given json into a map configuration provided
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in workflow json
         * {
            "id": "PBXwxNGNNN0Uf",
            "type": "transform",
            "next": {
              "success": "hangup"
            },
            "nodename": "Transform",
            "transform_data_variable": "response",
            "transform_data_variable_key": "data",
            "transform_map_variable": "",
            "transform_map_variable_key": "",
            "transform_output_variable": "out",
            "transform_data": "{\r\n    \"posts\" : [\r\n        {\r\n            \"title\" : \"title1\",\r\n            \"description\": \"description1\",\r\n            \"blog\": \"This is a blog.\",\r\n            \"date\": \"11/4/2013\",\r\n            \"extra\" : {\r\n                \"link\" : \"http://goo.cm\"\r\n            },\r\n            \"list1\":[\r\n                {\r\n                    \"name\":\"mike\"\r\n                }\r\n            ],\r\n            \"list2\":[\r\n                {\r\n                    \"item\": \"thing\"\r\n                }\r\n            ],\r\n            \"clearMe\": \"text\"\r\n        }\r\n    ]\r\n}",
            "transform_map": "{\r\n    \"list\" : \"data\",\r\n    \"item\": {\r\n        \"id\": \"postId\"\r\n    }\r\n}",
            "transform_operations": [
              {
                "id": "function(val){\nreturn val+\" appended by transform\";\n}"
              }
            ]
          }
         * @param {Object} data - Workflow data if any
         */
    transform (json, props, data) {
      // Initialize data and map variables for json-transform-node
      // Default empty objects
      let DATA = {};
      let MAP = {};

      // If input data variable exists in node
      if (props.transform_data_variable) {
        // Update DATA from data with input data variable key
        DATA[props.transform_data_variable_key] = data[props.transform_data_variable][props.transform_data_variable_key];
      } else {
        // Else consider data from advance config
        DATA = JSON.parse(props.transform_data);
      }

      // If input map variable exists in node
      if (props.transform_map_variable) {
        // Update MAP from data with input map variable key
        MAP[props.transform_data_variable_key] = data[props.transform_map_variable][props.transform_map_variable_key];
      } else {
        // Else consider map from advance config
        MAP = JSON.parse(props.transform_map);
      }

      // If MAP operations exists in node
      if (props.transform_operations.length > 0) {
        // Initialize operate key which will be array of map operations
        MAP.operate = [];

        // Initialize empty object for operation to be pushed in map_operations array
        const operation = {};

        // Get all the keys for map operations
        // eslint-disable-next-line camelcase
        const operation_keys = Object.keys(props.transform_operations[0]);

        // Loop through all keys in map operations
        for (let i = 0; i < operation_keys.length; i++) {
          // Conditional check in operations array using operation keys

          // If the value starts with function use eval ()
          if (props.transform_operations[0][operation_keys[i]].startsWith('function')) {
            // If inside then it is a function, so need to evaluate it.
            // eslint-disable-next-line no-eval
            operation.run = eval('(' + props.transform_operations[0][operation_keys[i]] + ')')
          } else { // If inside then simply keep the same value
            operation.run = props.transform_operations[0][operation_keys[i]]
          }

          // Assign key to operation object
          operation.on = operation_keys[i];

          // Push this operation to operate array in MAP
          MAP.operate.push(operation);
        }
      }

      // Update workflow data with transform_output_variable
      data[props.transform_output_variable] = dataTransform(DATA, MAP).transform();

      // Execute next node
      this.execute_next_code(json, props.next.success, data);
    },

    /**
         * Ask permission to send notifications
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    notiRequestAccess (json, props, data) {
      // Show the notification popup with allow and block
      window.AppupPluginsManager.exec('AppupNotification', 'askPermission');

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },

    /**
         * Create notification with title, body, image and badge
         * @param {Object} json - Workflow json
         * @param {Object} props - Properties of the node in the workflow json
         * @param {Object} data - Workflow data
         */
    createNotification (json, props, data) {
      // Send notification
      window.AppupPluginsManager.exec('AppupNotification', 'sendNotification', props);

      // Call next
      this.execute_next_code(json, props.next.success, data)
    },
    /**
        * Show and asssign the current location to variables.
        *
        * @param {Object} json - Workflow json
        * @param {Object} props - Properties of the node in the workflow json (title, component name, similar to bootstrap vue modal)
        * @param {Object} data - Workflow data
        */
    get_current_position (json, props, data) {
      // eslint-disable-next-line no-unused-expressions
      geoProps = props; geoJson = json; geoData = data;

      // Call getCurrentLocation in Geolocation.js
      window.AppupPluginsManager.exec('AppupGeolocation', 'getCurrentLocationCordinates', this.geoSuccessCallBack, this.geoFailureCallBack);
    },

    /**
         * Success callback from geolocation plugin
         * @param {string} latitude
         * @param {string} longitude
         */
    geoSuccessCallBack (latitude, longitude) {
      geoData[geoProps.latitude] = latitude;
      geoData[geoProps.longitude] = longitude;

      // Execute sucess node
      this.execute_next_code(geoJson, geoProps.next.success, geoData);
    },

    /**
         * Failure callback from geolocation plugin
         * @param {Object} error
         */
    geoFailureCallBack (error) {
      console.log(error);

      // Execute failure node
      this.execute_next_code(geoJson, geoProps.next.failure, geoData);
    },

    /**
        * Node used for modal helper
        *
        * @param {Object} json - Workflow json
        * @param {Object} props - Properties of the node in the workflow json
        * {
                "id": "PBXpTCkm768pd",
                "type": "modal_helper",
                "next": {
                    "success": "hangup"
                },
                "nodename": "Modal Helper",
                "helper": "file",
                "modal-title": "Title",
                "modal-ok-title": "OK",
                "modal-cancel-title": "Cancel2",
                "modal-ok-variant": "danger",
                "modal-no-close-on-esc": "false",
                "modal-no-close-on-backdrop": "false",
                "config": ""
            }
        * @param {Object} data - Workflow data if any
        */
    modal_helper (json, props, data) {
      if (props.helper.length > 0) {
        props.body = '<div> <component is=' + '"' + props.helper + '"' + '></component> </div>'
      }

      // Create VueJS Component with the body
      const component = window.Vue.component('handler-modal',
        {
          template: props.body
        }
      );

      // Check if Appup Modal is valid
      if (!window.AppupModalInstance) {
        console.log('Error modal not found')
        return;
      }

      if (props['modal-no-close-on-backdrop'] && typeof (props['modal-no-close-on-backdrop']) === 'string') {
        props['modal-no-close-on-backdrop'] = props['modal-no-close-on-backdrop'] === 'true';
      }
      if (props['modal-no-close-on-esc'] && typeof (props['modal-no-close-on-esc']) === 'string') {
        props['modal-no-close-on-esc'] = props['modal-no-close-on-esc'] === 'true';
      }

      // Set Props - this copies all props starting with 'modal-'
      window.AppupModalInstance.setData(props);

      // Set b-modal configs - ref: https://bootstrap-vue.js.org/docs/components/modal/
      if (props.config) {
        window.AppupModalInstance.setConfig(JSON.parse(props.config));
      }

      // Set the component and show the modal
      window.AppupModalInstance.setComponent(component)
      window.AppupModalInstance.$root.$emit('bv::show::modal', 'appup-modal')

      // Holding reference of this,so that we can reference it in "ok" and "cence"
      const that = this;

      // Set the event handlers
      window.AppupModalInstance.$refs.ref1.$off('ok')
      window.AppupModalInstance.$refs.ref1.$on('ok', function (e) {
        console.log('OK');
        if (props.preventOk === 'true') e.preventDefault();
        else console.log('OK');
        that.execute_next_code(json, props.next.success, data)
      })

      // Register for cancel
      window.AppupModalInstance.$refs.ref1.$off('cancel')
      window.AppupModalInstance.$refs.ref1.$on('cancel', function () {
        console.log('Cancel')
        that.execute_next_code(json, props.next.failure, data)
      })
    }
  }
};

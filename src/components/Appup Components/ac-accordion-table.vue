<template>
  <div role="tablist">
    <b-card no-body class="mb-3" v-for="(item,index) in stages" :key="index">
      <b-card-header header-tag="header" class="p-0"  role="tab">
        <b-button class=" border-0 h-100"
          v-b-toggle="`accordion${index}`"
          :variant="toggle_variant"
          @click="show_collapse_class(index)"
        >
          <span class="when-opened float-right text-muted">
            <i class="fas fa-chevron-up"></i>
          </span>
          <span class="when-closed float-right text-muted">
            <i class="fas fa-chevron-down"></i>
          </span>
          <slot name="accordion_header" :item="item">{{item.name}} ({{item.count}})</slot>
        </b-button>
      </b-card-header>
      <b-collapse :id="`accordion${index}`" visible accordion="my-accordion" role="tabpanel">
        <b-card-body :class="append_class(index) ? 'active-accordion' : ''" class="p-3">
          <b-card-text>
            <ac-collection-table class="mb-0"
              :url="item_url"
              :total_count="item.count"
              :columns="columns"
              :bulk="bulk"
              :ac_cursor="item.items"
              :dropdown="dropdown"
              :show_dropdown_icons="show_dropdown_icons"
              :dropdown_options="dropdown_options"
              :dropdown_button_options="dropdown_button_options"
              :ref="`accordion${item.id}`"
              @dropdown_click="dropdown_clicked"
              @checkbox_clicked="checkbox_clicked"
              @row_clicked="row_clicked"
              @bulk_action="collection_table_bulk_action($event,item.id)"

            >
              <template :slot="slot.key" slot-scope="item" v-for="slot in columns">
                <slot :name="slot.key" :item="item.item"></slot>
              </template>

                <!-- renders slot for material dropdown -->
              <template
                :slot="dropdown.key"
                slot-scope="item"
                v-for="dropdown in dropdown_options"
              >
                <slot :name="dropdown.key" :item="item.item"></slot>
              </template>

              <template #empty_state>
                <slot name="items_empty_state"></slot>
              </template>
            </ac-collection-table>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <!-- Empty state slot -->
    <div v-if="stages && !stages.length && !stages_loading">
      <slot name="stages_empty_state">
        <p>No records found.</p>
      </slot>
    </div>
  </div>
</template>
<script>
import CollectionTable from './ac-collection-table'
export default {
  components: {
    'ac-collection-table': CollectionTable
  },
  name: 'ac-accordion-table',
  props: {
    /**
     * Give url to get stages of accordion
     * @param { String } stages_url - to fetch data
     * @label Stage Url
     * @category_name 1_General
     */
    stages_url: {
      type: String,
      required: true
    },
    /**
     * Give key name from stage url data to append to item url
     * @param { String } append_key - dynamic key
     * @label Append Key
     * @category_name 1_General
     */
    append_key: {
      type: String,
      required: false
    },
    /**
     * Give item url to get the data for stages
     * @param { String } item_url - url for table
     * @label Item Url
     * @category_name 1_General
     */
    item_url: {
      type: String,
      required: true
    },
    /**
     * Object for generating url query params params
     * @param {string|number} ac_cursor
     * @label Ac Cursor
     * @category_name 1_General
     */
    ac_cursor: {
      type: Object,
      default: () => ({})
    },
    /**
     * List of table columns.
     * @param {array} columns
     * @properties {"label": {"type": "String","description":"Give label name of table header"}, "key": {"type": "String","description":"Give key name from the data"}, "sortable": {"type": "Boolean","description":"Give true or false for sort option"}, "__slot__": {"type": "String","description":"write HTML code and data-scope:item"}}
     * @label Columns
     * @category_name 1_General
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * Whenever true show checkbox in the first column
     * @param {boolean} bulk
     * @label Bulk
     * @category_name 1_General
     */
    bulk: {
      type: Boolean,
      default: false
    },
    /**
     * Whenever true show dropdown in the last column
     * @param {boolean} dropdown
     * @label Dropdown
     * @category_name 1_General
     */
    dropdown: {
      type: Boolean,
      default: false
    },
    /**
     * If true - display dropdown options icon
     * @param {boolean} show_dropdown_icons
     * @label Show Dropdown Icons
     * @category_name 1_General
     */
    show_dropdown_icons: {
      type: Boolean,
      default: false
    },
    /**
     * Options for dropdown menu for each row
     * @param {Array} dropdown_options
     * @properties {"label": {"type": "String","description":"Give label name of option"}, "type": {"type": "String","description":"Type of the option Eg:edit,submit..etc"}, "icon": {"type": "String","description":"Give icon class for option"},"key":{"type": "String"}, "__slot__": {"type": "String"},
       "inside_grid": {
           "name":"options",
           "handler_name":{"type": "String"},
           "handler_params":{"type": "String"}
           }}
     * @label Dropdown Options
     * @category_name 1_General
     */
    dropdown_options: {
      type: Array,
      required: false
    },
    /**
     * Dropdown Button Options is a object with keys icon, variant, size, right. It shows three dots based upon icon in each row
     * @param {object} dropdown_button_options
     * @properties
        {
          "icon": {"type": "String", "default": "fas fa-ellipsis-v","description":"Give button icon class"},
          "variant": {"type": "String", "default": "outline-secondary", "description":"Give variant class for button", "values": ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "outline-primary", "outline-secondary", "outline-success", "outline-danger", "outline-warning", "outline-info", "outline-light", "outline-dark"]},
          "size": {"type": "String", "default": "sm", "description":"Give size of the button Eg:sm,lg,md", "values": ["sm", "md", "lg"]},
          "right": {"type": "Boolean", "default": "true", "description":"To display dropdown options right or left"}
        }
      * @label Dropdown Button Options
      * @category_name 1_General
     */
    dropdown_button_options: {
      type: Object,
      required: false
    },
    /**
     * Toggle label variant Eg.primary, seconday, success, warning, danger,info
     * @param { String } toggle_variant - variant for toggle
     * @label Toggle Variant
     * @category_name 4_Style
     */
    toggle_variant: {
      type: String,
      default: 'info'
    },
    /**
     * Required for bulk actions
     * @param {string} item_key
     * Required
     * @label Item Key
     * @category_name 1_General
     */
    item_key: {
      type: String,
      required: false
    },
    /**
     * Properties of table to be display
     * @param { String } table_props - props for table
     * @label Table Props
     * @category_name 1_General
     * @private
     */
    table_props: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      stages: [],
      arr: [],
      show_collapse: 0,
      stages_loading: false,
      selected_items: []
    };
  },
  watch: {
    stages_url (newval, oldval) {
      this.get_data();
    },
    item_url (newval, oldval) {
      // This.get_data();
    },
    table_props: {
      handler (val) {
        this.get_data();
      },
      deep: true
    },
    selected_items (nexval, oldval) {
      debugger;
      this.select_checkbox(nexval);
    }
  },
  created: function (id) {
    this.get_data();
  },
  methods: {
    /**
     * Compile handlebars
     *
     */
    get_blocks_from_stages () {
      for (var i = 0; i < this.stages.length; i++) {
        // eslint-disable-next-line no-unused-vars
        var url = this.item_url;
        var obj = { ...this.ac_cursor };
        /* Var a = "where=${id}";
        console.log("a value is", `${a}`);
        console.log(
          "new a value is",
          obj.where.replace(/\$.*}/, this.stages[i][this.append_key])
        );

        obj = JSON.stringify(obj);
        let whr = handelbars.compile(obj);
        obj = whr(this.stages[i]); */
        obj.where = obj.where.replace(
          /\${.*}/,
          this.stages[i][this.append_key]
        );
        if (this.stages[i][this.append_key] === null) {
          obj.where = obj.where.replace(/=%27null%27/, 'is null');
        }
        this.stages[i].items = obj;
        this.stages = [...this.stages];
      }
    },
    /**
     * Fetch main stage data from stage_url
     */
    get_data () {
      if (this.stages_url) {
        this.stages_loading = true;
        fetch(this.stages_url, {
          withCredentials: true,
          credentials: 'include'
        })
          .then(res => res.json())
          .then(res => {
            // If (res.length) {
            this.stages = res;
            this.get_blocks_from_stages();
            this.stages_loading = false;
            // }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {});
      }
    },
    /**
     * Emit row-click-event on click of row
     */
    row_clicked (data) {
      this.$emit('row-clicked', data);
    },
    /**
     * Emit dropdown-click-event on click of dropdown option
     */
    dropdown_clicked (data) {
      this.$emit('dropdown-clicked', data);
    },
    /**
     * Emit checkbox-click-event
     */
    checkbox_clicked (data) {
      debugger;
      if (data.checked) { this.selected_items.push(data.item); } else {
        var store = this.selected_items;
        this.selected_items = store.filter(item => {
          return (item[this.item_key] !== data.item[this.item_key])
        });
      }
      // This.selected_items.pop(data.item);
      this.$emit('checkbox-clicked', data);
    },
    /**
     * Emit on select of checkbox
     */
    select_checkbox (data) {
      // This.selected_items=[...this.selected_items,...data]
      if (!data.length) {
        Object.keys(this.$refs).forEach(el => {
          this.$refs[el][0].selected = [];
          this.$refs[el][0].select_all = false;
        })
      }
      this.$emit('selected-checkbox', data);
    },
    /**
     * Not used
     * get id's of all selected rows
     */
    get_selected (id) {
      if (id) {
        return this.$refs[`accordion${id}`][0].get_selected();
      } else {
        this.arr = [];
        this.stages.forEach(item => {
          this.arr = this.arr.concat(
            this.$refs[`accordion${item.id}`][0].get_selected()
          );
        });
        return this.arr;
      }
    },
    /**
     * Fires bulk action checkbox data
     */
    collection_table_bulk_action (checkboxData, id) {
      const _this = this;
      if (checkboxData.event) {
        checkboxData.item.forEach(obj => {
          this.selected_items.push(obj)
        })
        // This.selected_items.push(checkboxData.item)
      } else {
        var store = this.selected_items;
        this.selected_items = store.filter(item => {
          return (item[_this.item_key] !== id)
        });
      }
      // This.selected_items.push
      this.$emit('accordian_bulkaction', checkboxData);
    },
    /**
     * Get collapsed label reference key
     * @param {Integer} key_ref - Reference index of collapsed label
     */
    show_collapse_class (keyRef) {
      this.show_collapse = keyRef;
    },
    /**
     * Append dynamic class for collapsed label
     * @param {Integer} key - Reference index of collapsed label
     * @returns Boolean - True or False
     */
    append_class (key) {
      // eslint-disable-next-line eqeqeq
      if (this.show_collapse == key) return true;
      else return false;
    }
  }
};
</script>

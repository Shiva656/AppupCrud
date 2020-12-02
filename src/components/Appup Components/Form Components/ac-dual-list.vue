<template>
  <div class="ac-dual-list d-flex justify-content-between">
    <ac-collection
      ref="ac_collection_left"
      v-bind="collection_props"
      @success="on_succes_load"
      class="ac-dual-list__item"
    >

      <!--left collection header section -->
      <template #header>
        <header class="border p-2 d-flex align-items-center">
          <b-checkbox v-model="all_checkbox.left" @change="on_checkbox_change($event, 'left')" />

          <b-input
            v-model="input.left"
            :placeholder="search_placeholder? search_placeholder : 'Filter'"
            size="sm"
          />
        </header>
      </template>

      <!--left collection body section -->
      <template #body="{ data }">
        <div :key='data' class="border-left border-right p-2 h-100 ac-dual-list__body">
          <p v-show="!filtered_left.length" class="text-center">No item to show</p>

          <b-form-checkbox-group v-model="selected.left" stacked>
            <b-form-checkbox
              v-for="item in filtered_left"
              :key="item[key_value]"
              :value="item[key_value]"
            >{{ item[key_label] }}</b-form-checkbox>
          </b-form-checkbox-group>
        </div>
      </template>

      <!--left collection footer section -->
      <template #footer>
        <footer class="border p-2">
          {{ selected.left.length }}
          of
          {{ items.left.length }}
          items selected
        </footer>
      </template>
    </ac-collection>

    <!--left and right arrows -->
    <div class="d-flex p-2 flex-column align-items-center justify-content-center">
      <b-button @click="move_checkboxes('left', 'right')">&gt;</b-button>

      <b-button class="mt-4" @click="move_checkboxes('right', 'left')">&lt;</b-button>
    </div>

    <!--right side list start -->
    <div class="d-flex flex-column ac-dual-list__item">

      <!--right side header section -->
      <div class="border p-2 d-flex align-items-center">
        <b-checkbox v-model="all_checkbox.right" @change="on_checkbox_change($event, 'right')" />

        <b-input
          v-model="input.right"
          :placeholder="search_placeholder ? search_placeholder : 'Filter'"
          size="sm"
        />
      </div>

      <!--right side body section-->
      <div class="border-left border-right p-2 flex-auto ac-dual-list__body">
        <template v-show="!filtered_left.length">
          <template v-if="$slots.empty_state">
            <slot v-if="$slots.empty_state.length" name="empty_state"></slot>
          </template>
          <template v-else>
            <p class="text-center">No item to show</p>
          </template>
        </template>
        <b-form-checkbox-group v-model="selected.right" stacked>
          <b-form-checkbox
            v-for="item in filtered_right"
            :key="item[key_value]"
            :value="item[key_value]"
          >{{ item[key_label] }}</b-form-checkbox>
        </b-form-checkbox-group>
      </div>

      <!--right side footer section -->
      <div class="border p-2">
        {{ selected.right.length }}
        of
        {{ items.right.length }}
        items selected
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Ac dual list component
 * @requires VueBootstrap
 * @requires ac-collection.vue
 * @requires ac-material-dropdown.vue
 * @fires change - array of changed items, direction
 * @fires dropdown_click - click option, direction
 */

export default {
  name: 'ac-dual-list',

  props: {
    /**
     * @param {Object} collection_props
     * @properties
        {
          "url": {"type": "String"},
          "method": {"type": "String"},
          "params": {"type": "Object"},
          "sort_key": {"type": "String"}
        }
      *@label Collection Properties
      *@category_name 1_General
     */
    collection_props: {
      type: Object,
      required: true
    },

    /**
     * Provide JSON data that is to be displayed on left side of list (eg: [{"id":1,name":"aaa"},{"id":2,name":"bbb"}])
     * @param {array} left_items
     * @label left_items
     * @category_name 2_Data
     */
    left_items: {
      type: Array,
      required: false,
      default: () => []
    },

    /**
     * Placeholder for search bar
     * @param {string} search_placeholder
     * @label Search Placeholder
     * @category_name 1_General
     */
    search_placeholder: {
      type: String,
      required: false
    },

    /**
     * Key value for binding value of list
     * @param {string} key_value
     * @label Key Value
     * @category_name 1_General
     */
    key_value: {
      type: String,
      required: true
    },

    /**
     * Key label for binding label in list
     * @param {string} key_label
     * @label Key Label
     * @category_name 1_General
     */
    key_label: {
      type: String,
      required: true
    },

    /**
     * Data to be displayed on right side of list (eg: [{"id":3,name":"abc"},{"id":4,name":"xyz"}])
     * @param {Array} value
     * @label Dual Values
     * @category_name 2_Data
     */
    value: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data () {
    return {
      selected: {
        left: [],
        right: []
      },
      all_checkbox: {
        left: false,
        right: false
      },
      items: {
        left: [],
        right: []
      },
      input: {
        left: '',
        right: ''
      },
      data_objects: [],
      insert_objects: [],
      delete_objects: []
    };
  },

  created () {
    this.items.right = this.value;
  },

  mounted () {
    if (this.left_items && this.left_items.length) {
      this.$refs.ac_collection_left.set_data(this.left_items);
      this.items.left = this.left_items;
    } else if (this.collection_props.url) {
      this.$refs.ac_collection_left.set_ajax();
    }
  },

  // Methods in computed return filtered data according to the inputs given in respective sides of dual list
  computed: {
    filtered_left () {
      this.remove_selected('left');
      this.disable_all_checkbox('left');
      if (!this.input.left.length) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.items.left = this.items.left.filter(iteml => {
          if (this.items.right.length) {
            return this.items.right.some(
              itemr => !itemr[this.key_label].includes(iteml[this.key_label])
            );
          } else return true;
        });
        return this.items.left;
      }
      return this.items.left.filter(
        el => el[this.key_label].indexOf(this.input.left) > -1
      );
    },

    filtered_right () {
      this.remove_selected('right');
      this.disable_all_checkbox('right');
      if (!this.input.right.length) return this.items.right;
      return this.items.right.filter(
        el => el[this.key_label].indexOf(this.input.right) > -1
      );
    }
  },

  // In order to show all the selected items in right side
  watch: {
    value (newVal, oldVal) {
      this.items.right = newVal;
    }
  },

  methods: {
    /**
     * @function on_succes_load - set new data afer api call
     * @param data - array of options
     */
    on_succes_load (data) {
      this.items.left = [...data];
      this.data_objects = this.items.left;
      this.sort_list('left');
    },

    /**
     * @function move_checkboxes - checked options move handler
     * @param from - from direction
     * @param to - to direction
     * @fires change
     * @fires input - for v-model
     * @fires delete_insert - for delete or insert objects
     */
    move_checkboxes (from, to) {
      const selectedData = [];
      this.delete_objects = [];
      this.insert_objects = [];
      this.selected[from].map(sel => {
        selectedData.push(
          // eslint-disable-next-line eqeqeq
          this.data_objects.find(item => item[this.key_value] == sel)
        );
      });
      // eslint-disable-next-line eqeqeq
      if (from == 'right') this.delete_objects = selectedData;
      // eslint-disable-next-line eqeqeq
      if (from == 'left') this.insert_objects = selectedData;
      if (!this.selected[from].length) return;
      const data = [...this.items[from]];
      const checked = data.filter(
        el => this.selected[from].indexOf(el[this.key_value]) > -1
      );
      const selected = [...checked, ...this.items[to]];
      const rest = data.filter(
        el => this.selected[from].indexOf(el[this.key_value]) === -1
      );
      this.selected[from] = [];
      this.items[to] = selected;
      this.items[from] = rest;
      this.sort_list(to);
      this.disable_all_checkbox(from);
      this.disable_all_checkbox(to);
      // Emits on clicking on buttons with data and to which side
      this.$emit('change', checked, to);
      // Emits on clicking on buttons with data only which is available on right side
      this.$emit('input', this.items.right);
      // Emits on clicking on buttons with delete and insert objects based on direction (i.e from/to)
      this.$emit('delete_insert', {
        deleteList: this.delete_objects,
        insertList: this.insert_objects
      });
    },

    /**
     * @function disable_all_checkbox - remove checked from header checkbox
     * @param type - direction
     */
    disable_all_checkbox (type) {
      this.all_checkbox[type] = false;
    },

    /**
     * @function sort_list - sorts list with collection_props.sort_key prop. Default label
     * @param type - direction
     */
    sort_list (type) {
      const KEY = this.collection_props.sort_key || 'label';
      this.items[type].sort((a, b) => {
        if (a[KEY] > b[KEY]) return 1;
        if (a[KEY] < b[KEY]) return -1;
        return 0;
      });
    },

    /**
     * @function select_all - mark all options in list as checked
     * @param type - direction
     */
    select_all (type) {
      this.selected[type] = this[`filtered_${type}`].map(
        el => el[this.key_value]
      );
    },

    /**
     * @function remove_selected - mark all options in list as not checked
     * @param type - direction
     */
    remove_selected (type) {
      this.selected[type] = [];
    },

    /**
     * @function on_checkbox_change - header checkbox change handler
     * @param val - boolean value of header checkbox
     * @param type - direction
     */
    on_checkbox_change (val, type) {
      if (val) {
        this.select_all(type);
        return;
      }
      this.remove_selected(type);
    }
  }
};
</script>

<style scoped>
.flex-auto {
  flex: auto;
}

.ac-dual-list__body {
  max-height: 300px;
  overflow: auto;
}

.ac-dual-list__item {
  flex-basis: 47.5%;
}
</style>

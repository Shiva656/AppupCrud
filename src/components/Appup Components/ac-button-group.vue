<template>
  <div>
    <b-button-group>
      <template v-for="(item,index) in Json_data">
        <!-- Dropdown template -->
        <b-dropdown
          :key="index"
          :id="item.name+'tooltip'"
          :variant="item.variant"
          :class="(index == current_Index) ?'active':''"
          :text="item.name"
          class="btn-sm"
          v-if="(item.type !== 'undefined' && item.type === 'dropdown') ||
       ( item.type === 'undefined' &&  item.items !== 'undefined')"
        >
          <b-dropdown-item
            v-for="(subitem, subindex) in item.items"
            v-bind:key="subindex"
            :href="subitem.url"
            @click="event_emitter(subitem,$event, index)"
          >
            <!-- use this slot for dropdown item -->
            <slot :name="subitem.key" :item="subitem">{{subitem.name}}</slot>
          </b-dropdown-item>
        </b-dropdown>
        <!-- button template -->
        <b-button
          v-else
          :key="index"
          :id="item.name+'tooltip'"
          :variant="item.variant"
          :class="(index == current_Index) ?'active':''"
          :href="item.url"
          @click="event_emitter(item,$event, index)"
        >
          <!-- use this slot for button -->
          <slot :name="item.key" :item="item">{{item.name}}</slot>
        </b-button>
        <b-tooltip :target=" item.name +' tooltip' " :key='item.name' triggers="hover">
          {{item.tooltip_message}}
        </b-tooltip>
      </template>
    </b-button-group>
  </div>
</template>
<script>
import AppPreload from '../../mixins/ac-preload';

/**
 * @requires ac-preload.js
 * @inherits ac-preload
 */

export default {
  name: 'ac-button-group',
  mixins: [AppPreload],
  components: {},
  props: {
    /**
     * List of button options
     * @param { Array } input to component
     * @category_name 1_General
     */
    data: {
      type: Array,
      required: false
    }
  },
  data: function () {
    return {
      Json_data: '',
      current_Index: ''
    };
  },
  created () {
    if (this.data && this.data.length) {
      this.Json_data = this.data;
    }
  },
  methods: {
    /**
     *Triggers on click Emit click event
     * @param {Object} item - Clicked item
     * @param {Object} event - Click event
     * @param {Number} index - Index of clicked item
     */
    event_emitter: function (item, event, index) {
      this.current_Index = index;

      if (!item.url) {
        const obj = {};
        obj.event = event;
        obj.item = item;
        this.$emit('click', obj);
      }
    }
  }
};
</script>

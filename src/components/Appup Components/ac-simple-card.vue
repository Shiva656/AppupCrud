<template>
  <b-card
    v-bind="card_options"
    img-top
    :class="inlineMethod"
    @mouseenter="$emit('hover', cardData)"
    @mousedown.stop="$emit('click', cardData)"
  >
    <!-- the following code removed in above tag
    -->
    <b-card-title class="d-flex align-items-center justify-content-between h5">
      <div
        v-if="card_title && cardData[card_title]"
        :title="cardData[card_title]"
        class="ellipse"
      >{{cardData[card_title]}}</div>
      <div v-if="dropdown_options && dropdown_options.length">
        <div class="text-right">
         <slot name="option" :data="cardData">
          <ac-material-dropdown
            :options="dropdown_options"
            :button_options="dropdown_button_options"
            :right="dropdown_button_options.right"
            @item_click="on_dropdown_item_click($event, cardData)"
            :show_icon="show_dropdown_icons"
          />
         </slot>
        </div>
      </div>
    </b-card-title>

    <b-card-sub-title class="mb-0" v-if="card_subtitle">
      <div v-if="cardData[card_subtitle]" class="ellipse">{{cardData[card_subtitle]}}</div>
    </b-card-sub-title>

    <div class="card-wrapper" v-if="cardData[img]">
      <div class="card-hover">
        <!-- Use this slot for card hover. Not shown if no hover slot. -->
        <slot name="hover"></slot>
      </div>
      <b-card-img :src="cardData[img]" title="Card image" />
    </div>

    <div v-if="header_slot" slot="header" class="ac-simple-card__header">
      <!-- Use this slot for card header. Not shown if Header Slot prop false. -->
      <slot name="header" :data="cardData">{{cardData[card_header]}}</slot>
    </div>

    <div class="custom_body" :class="custom_body_class">
      <!-- Use this slot for card body. if no body slot card_text as shown as body.-->
      <slot name="body" :data="cardData">
        <b-card-text class="ac-simple-card__body py-2 pr-2">{{ cardData[card_text] }}</b-card-text>
      </slot>
    </div>

    <!-- If prop bulk is true, then show checkbox -->
    <div v-if="bulk" class="ac-simple-card__checkbox mt-2">
      <!-- Event fires whenever the checkbox clicked. checkbox shown when bulk prop true.-->
      <b-form-checkbox
        v-model="checkbox"
        :value="cardData.id"
        @change="$emit('input', cardData.id)"
      ></b-form-checkbox>
    </div>

    <div v-if="footer_slot" slot="footer" class="ac-simple-card__footer">
      <!-- Use this slot for card footer. Not shown if Footer Slot prop false. -->
      <slot name="footer" :data="cardData">{{cardData[card_footer]}}</slot>
    </div>
  </b-card>
</template>

<script>
import acMaterialDropdown from './ac-material-dropdown.vue';
// Import axios from 'axios';

/**
 * Simple Card component
 * @requires VueBootstrap
 * @requires ac-material-dropdown.vue
 */

export default {
  name: 'ac-simple-card',
  components: {
    acMaterialDropdown
  },
  props: {
    /**
     * Card data, Ex: {"img":"https://imgUrl", "title": "Title of card", card_title: "title",card_text: "body",card_subtitle: "id"}.
     * @param {object} data
     * @label Data
     * @category_name 2_Data
     */
    data: {
      type: Object,
      required: false
    },
    /**
     * Fetch data with url.
     * @label URL
     * @category_name 1_General
     */
    url: {
      type: String,
      required: false
    },
    /**
     * Base_url
     * @param {string} base_url
     * @label Base URL
     * @category_name 1_General
     */
    base_url: {
      type: String,
      required: false
    },
    /**
     * Key inside data prop, that contains image url.
     * @param {string} img
     * @label Image
     * @category_name 1_General
     */
    img: {
      type: String,
      required: true
    },

    /**
     * Is current card selected.
     * @param {boolean} selected
     * @label Selected
     * @private
     */
    selected: {
      type: Boolean,
      required: false,
      default: false
    },

    /**
     * Is current card selected.
     * @param {boolean} selected
     * @label Checkbox select key
     * @category_name 1_General
     */
    checkbox_select_key: {
      type: String,
      required: false
    },

    /**
     * Key inside data prop for title.
     * @param {string} card_title
     * @label Card Title
     * @category_name 1_General
     */
    card_title: {
      type: String,
      required: true
    },

    /**
     * Key inside data prop for text.
     * @param {string} card_text
     * @label Card Text
     * @category_name 1_General
     */
    card_text: {
      type: String,
      required: true
    },

    /**
     * Whenever bulk true - show checkbox.
     * @param {boolean} bulk
     * @label Bulk
     * @category_name 1_General
     */
    bulk: {
      type: Boolean,
      default: false
    },

    /**
     * Object with vue bootstrap card options.
     * @param {object} card_options
     * @label Card Options
     * @category_name 3_Advanced
     */
    card_options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    /**
     * Options for dropdown menu.
     * @param {object} dropdown_options
     * @properties {"label": {"type": "String","description":"Give label name of option"}, "type": {"type": "String","description":"Type of the option Eg:edit,submit..etc"}, "icon": {"type": "String","description":"Give icon class for option"}, "handler": {"type": "String","description":"Select handler to perform action"}, "handler_params": {"type": "String","description":"Give params to be send to handler"}}
     * @label Dropdown Options
     * @category_name 1_General
     */
    dropdown_options: {
      type: Array,
      required: false
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
     *  Dropdown Button Options is a object with keys icon, variant, size, right.
     * @param {object} dropdown_button_options
     * @properties
        {
          "icon": {"type": "String", "default": "fas fa-ellipsis-v","description":"Give button icon class"},
          "variant": {"type": "String", "default": "outline-secondary","description":"Give variant class for button", "values": ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "outline-primary", "outline-secondary", "outline-success", "outline-danger", "outline-warning", "outline-info", "outline-light", "outline-dark"]},
          "size": {"type": "String", "default": "sm", "description":"Give size of the button Eg:sm,lg,md" , "values": ["sm", "md", "lg"]},
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
     * Whenever Header Slot is true, Show Header slot.
     *  @label Header Slot
     * @category_name 1_General
     */
    header_slot: {
      type: Boolean,
      required: true
    },
    /**
     * Whenever Footer Slot is true, Show Footer slot.
     * @label Footer Slot
     * @category_name 1_General
     */
    footer_slot: {
      type: Boolean,
      required: true
    },
    /**
     * Key inside data prop for Card Header.
     * @param {string} card_header
     * @label Card Header
     * @category_name 1_General
     */
    card_header: {
      type: String,
      required: false
    },
    /**
     * Key inside data prop for Card Footer.
     * @param {string} card_footer - Content of every card footer
     * @label Card Footer
     * @category_name 1_General
     */
    card_footer: {
      type: String,
      required: false
    },
    /**
     * Key inside data prop for subtitle.
     * @param {string} card_subtitle
     * @label Card Subtitle
     * @category_name 1_General
     */
    card_subtitle: {
      type: String,
      required: false
    },
    /**
     * Class is appended to card.
     * @param {string} card_class
     * @label Card Class
     * @category_name 4_Style
     */
    card_class: {
      type: String,
      required: false
    },
    /**
     * Class is appended to card.
     * @param {string} custom_body_class
     * @label Card Body Class
     * @category_name 4_Style
     */
    custom_body_class: {
      type: String,
      required: false
    },
    /**
     * Whenever the helper mounted, preload handler get fired.
     * @param {string} preload
     * @label Preload
     */
    preload: {
      type: String,
      required: false
    },
    /**
     * Provide params to preload handler.
     * @param {string} handler_params
     * @label Handler Params
     * @category_name 1_General
     */
    handler_params: {
      type: String,
      required: false
    }
  },

  data () {
    return {
      checkbox: false,
      cardData: {}
    };
  },
  computed: {
    inlineMethod () {
      return this.card_class + ' ac-simple-card h-100 card-head-bg';
    }
  },
  created () {
    this.fetchData();
  },
  watch: {
    url (newval, oldval) {
      this.url = newval;
      this.fetchData();
    },
    data: {
      handler (newVal, oldVal) {
        this.cardData = newVal;
      },
      deep: true
    }
  },
  methods: {
    /**
     * Dropdown click handler
     * @function on_dropdown_item_click
     * @public
     * @param {string} type - type of click e.g. 'edit'
     * @param {object} item - row info related to clicked dropdown
     */
    on_dropdown_item_click (option, item) {
      // Execute appup handler workflow
      if (option.handler && this.start) {
        let custom = {};
        if (option.handler_params) {
          try {
            custom = JSON.parse(option.handler_params);
          } catch (error) {
            if (typeof option.handler_params === 'object') {
              custom = option.handler_params;
            }
          }
        }
        this.start(option.handler, {
          helper: {
            component: this,
            item: item,
            custom: custom
          }
        });
      }
      // Event get fires, whenever clicked on dropdown.
      this.$emit('dropdown_click', {
        type: option.type,
        option,
        item
      });
    },
    /**
     * Get data from url
     */
    fetchData () {
      if (this.url) {
        var _this = this;
        this.$appupajax
          .get2(
            _this.url,
            {},
            {},
            { withCredentials: true, credentials: 'include' }
          )
          // This.$appupajax.get2(_this.url, {}, { withCredentials: true, credentials: "include" }).
          .then(this.$appupajax.handleResponse)
          .then(response => {
            console.log(response);
            _this.cardData = response.data;
            _this.select_checkbox();
          })
          .catch(function (error) {
            // Handle error
            console.log(error);
          })
          .finally(function () {
            // Always executed
          });
      } else {
        this.cardData = this.data;
        this.select_checkbox();
      }
    },

    /**
     * Select checkbox if checkbox_select_key value is true
     */
    select_checkbox () {
      if (
        this.checkbox_select_key != null &&
        this.cardData[this.checkbox_select_key]
      ) {
        this.checkbox = this.cardData.id;
      }
    }
  },
  mounted () {
    if (this.preload) {
      this.start(this.preload, {
        helper: {
          component: this,
          custom: this.handler_params ? JSON.parse(this.handler_params) : {}
        }
      });
    }
  }
};
</script>

<style scoped>
.ac-simple-card .card-wrapper {
  position: relative;
}

.ac-simple-card .card-hover {
  position: absolute;
  opacity: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: opacity 0.3s ease;
}

.ac-simple-card:hover .card-hover {
  opacity: 1;
}
.card-head-bg .card-title .ellipse {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
p.card-text.ac-simple-card__body.py-2.pr-2 {
  max-height: 200px;
}
</style>

<template>
  <div v-if="ac_data" class="ac-html">
    <v-runtime-template :template="ac_data" />
  </div>
</template>

<script>
/**
 * Ac html component to render custom html templates
 * @requires v-runtime-template https://github.com/alexjoverm/v-runtime-template#getting-started
 */

import VRuntimeTemplate from 'v-runtime-template';

export default {
  name: 'ac-html',

  props: {
    /**
     * @param {string} html - teplate to bew rendered.
     */
    html: {
      type: String,
      required: false,
      default: ''
    },

    /**
     * @param {string} url - url to get template from.
     */
    url: {
      type: String,
      required: false,
      default: ''
    },
    /**
     * Base_url
     * @param {string} base_url
     * @label Base URL
     */
    base_url: {
      type: String,
      required: false
    }
  },

  components: {
    VRuntimeTemplate
  },

  data () {
    return {
      ac_data: ''
    };
  },

  created () {
    if (this.html) {
      this.ac_data = this.html;
    } else if (this.url) {
      fetch(this.url, { withCredentials: true, credentials: 'include' }).then(
        response => {
          if (response.ok) {
            response.json().then(resp => {
              this.ac_data = resp;
            });
          }
        }
      );
    } else {
      console.error('html or url prop is required');
    }
  }
};
</script>

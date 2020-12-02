<template>
  <iframe
    :src="src"
    id="ui_buildly"
    frameborder="0"
    name="ui_buildly"
    :width="width"
    :height="height"
    @load="load"
  ></iframe>
</template>

<script>

var messageEventListener = function (event) {
  console.log('BD: inside serialize');
  // Initialize global workflow json variable - async will be waiting till this happens
  // eslint-disable-next-line no-unused-vars
  var data = event.data;
};

if (window.addEventListener) {
  window.addEventListener('message', messageEventListener, false);
} else {
  window.attachEvent('onmessage', messageEventListener);
}

export default {
  name: 'appup-buildly',

  props: {
    src: {
      type: String,
      required: true
    },

    width: {
      type: String,
      default: '100%'
    },

    height: {
      type: String,
      default: '900px'
    },

    value: {
      type: String,
      required: true
    }
  },

  methods: {

  }
};
</script>

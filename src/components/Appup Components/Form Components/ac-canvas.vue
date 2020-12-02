<template>
  <canvas :id="'div_'+canvas_id" v-bind="canvas_config"></canvas>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  name: 'ac-canvas',
  props: {
    canvas_id: {
      type: String
    },
    value: {
      type: String
    },
    canvas_config: {
      type: Object
    }
  },
  watch: {
    value () {
      this.base64_to_image();
    },
    canvas_id () {
      this.canvas_to_base64();
    }
  },
  methods: {
    canvas_to_base64 () {
      if (this.canvas_id) {
        var _this = this;
        html2canvas(document.getElementById(_this.canvas_id)).then(canvas => {
          this.load_image(canvas.toDataURL());
          _this.$emit('input', canvas.toDataURL());
        });
      }
    },
    base64_to_image () {
      this.load_image(this.value);
    },
    load_image (DataURL) {
      var canvasDraw = document.getElementById('div_' + this.canvas_id);
      var ctx = canvasDraw.getContext('2d');
      var image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = DataURL;
    }
  },
  mounted () {
    if (this.value) {
      this.base64_to_image();
    }
    this.canvas_to_base64();
  }
};
</script>

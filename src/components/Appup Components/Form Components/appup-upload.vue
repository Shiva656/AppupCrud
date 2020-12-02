<template>
  <div
    v-cloak
    @drop.prevent="uploadFile($event)"
    @dragover.prevent
    class
    :class="[{row:show_image_preview},uploadConfig.divClass]"
  >
    <div :class="show_image_preview? 'col-md-6':'col-md-12'">
      <!-- Hidden button can be used with form component with dynamic id and name-->
      <input type="hidden" :id="uploadConfig.id" :name="uploadConfig.name" v-model="s3Url" />

      <!-- Input File upload  -->
      <input type="file" ref="file" style="display:none;" @change.prevent="uploadFile($event)" />
      <!-- Button dynamically open file window  -->
      <!-- use bootstrap vue -->
      <b-button
        v-if="upload_type == 'button'"
        :variant="uploadConfig.variant?uploadConfig.variant:'primary'"
        @click.prevent="$refs.file.click()"
      >{{uploadConfig.buttonName?uploadConfig.buttonName:'Upload'}}</b-button>
      <b-img
        v-if="upload_type == 'image'"
        v-bind="uploadConfig.imageConfig"
        :src="uploadConfig.image_source"
        @click.prevent="$refs.file.click()"
      />
      <b-form-file
        v-if="upload_type == 'file'"
        :placeholder="file_name"
        @change.prevent="uploadFile($event)"
      ></b-form-file>
      <div class="d-flex" v-if="show_progress_bar">
        <b-progress :value="percentCompleted" :max="100" class="w-100 m-1"></b-progress>
        {{percentCompleted ? percentCompleted+'%' : ''}}
      </div>
      <u
        v-if="upload_type == 'text'"
        class="text-primary"
        @click.prevent="$refs.file.click()"
      >{{uploadConfig.uploadText?uploadConfig.uploadText:'Upload Image'}}</u>

      <p v-if="showError" class="errorMessage">
        <font color="red">You have uploaded invalid file type</font>
      </p>
      <p v-if="!filename_match" class="errorMessage">
        <font color="red">Uploaded file name doesn't match with the custom file name</font>
      </p>

      <p class="errorMessage" v-if="limit_excceds_error">
        <font
          v-if="uploadConfig.size"
          color="red"
        >File size should be less than {{uploadConfig.size}} MB</font>
        <font v-else color="red">File size should be less than 2 MB</font>
      </p>
    </div>
    <template v-if="show_image_preview && s3Url">
      <div class="col-md-6">
        <b-img v-if="upload_success" v-bind="uploadConfig.imagePreviewConfig" :src="s3Url" />
        <p v-else-if="showError" class="errorMessage">
          <font color="red">Failed to Upload</font>
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
// Import { Workflow } from '../../../mixins/workflow';

export default {
  name: 'uploadFile',
  data: function () {
    // Custom data
    return {
      urls: {},
      s3Url: this.value,
      file: {},
      showError: false,
      upload_success: false,
      limit_excceds_error: false,
      filename_match: true,
      percentCompleted: 0,
      show_progress_bar: false,
      file_content_type: 'application/x-www-form-urlencoded'
    };
  },
  props: {
    preload: {
      type: String,
      required: false
    },
    uploadConfig: {
      type: Object,
      required: false
    },
    allow_origin: {
      type: String,
      required: false
    },
    content_type: {
      type: String,
      required: false
    },
    upload_type: {
      type: String,
      default: 'file',
      validator: function (value) {
        return ['button', 'image', 'text', 'file'].indexOf(value) > -1;
      }
    },
    show_image_preview: {
      type: Boolean,
      default: true
    },
    custom_file_name: {
      type: String,
      required: false
    },
    value: String
  },
  computed: {
    file_name () {
      if (this.s3Url) {
        return this.s3Url.split('/').pop();
      } else {
        return 'No File Chosen';
      }
    }
  },
  watch: {
    value (val) {
      this.s3Url = this.value;
      this.upload_success = true;
    }
  },
  created () {
    /**
     * On created we can  call handler
     */
    if (this.preload) this.start(this.preload);
    if (this.value) {
      this.s3Url = this.value;
      this.upload_success = true;
    }
  },
  methods: {
    uploadFileToS3 () {
      // Emit before upload
      this.beforeUpdate();

      /**
       * Upload file using Put
       */
      this.show_progress_bar = true;
      // eslint-disable-next-line camelcase
      var extension_name = this.file.name;
      // eslint-disable-next-line eqeqeq
      if (this.file.name && extension_name.split('.').pop() == 'svg') {
        var config = {
          headers: {
            'content-type': 'image/svg+xml',
            'Access-Control-Allow-Origin': this.allow_origin
          }
        };
      } else {
        // eslint-disable-next-line no-redeclare
        var config = {
          headers: {
            'content-type':
              this.content_type && this.content_type.length
                ? this.content_type
                : this.file_content_type,
            'Access-Control-Allow-Origin': this.allow_origin
          },
          onUploadProgress: progressEvent => {
            this.percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // eslint-disable-next-line eqeqeq
            if (this.percentCompleted == 100) {
              setTimeout(() => {
                this.show_progress_bar = false;
                this.percentCompleted = 0;
              }, 500);
            }
          }
        };
      }

      const that = this;
      axios
        .put(this.urls.signed_url, this.file, config)
        .then(function (response) {
          that.s3Url = that.urls.File_link;
          that.onUpdate();
          that.$emit('after_upload', { s3_url: that.s3Url });
        });
    },
    uploadFile (event) {
      /**
       * Get the file Info
       */
      this.s3Url = '';
      if (event.currentTarget && event.currentTarget.files) {
        // eslint-disable-next-line camelcase
        const file_input = event.currentTarget;
        this.file = file_input.files[0];
        this.file_content_type = file_input.files[0].type;
      }
      if (event.dataTransfer && event.dataTransfer.files) {
        // eslint-disable-next-line camelcase
        const file_input = event.dataTransfer;
        this.file = file_input.files[0];
        this.file_content_type = file_input.files[0].type;
      }
      // eslint-disable-next-line camelcase
      var size_limit;

      // Default size is 2 MB
      if (this.uploadConfig.size != null) {
        // eslint-disable-next-line camelcase
        size_limit = this.uploadConfig.size * 1024 * 1024;
      // eslint-disable-next-line camelcase
      } else size_limit = 2 * 1024 * 1024;
      // eslint-disable-next-line camelcase
      if (this.file.size > size_limit) {
        this.limit_excceds_error = true;
      } else {
        this.limit_excceds_error = false;
        if (this.uploadConfig.extentions != null) {
          var extensionArr = this.uploadConfig.extentions.split(',');
          var regExtensions = '';
          for (var k in extensionArr) {
            regExtensions = regExtensions + '|' + extensionArr[k];
          }
          regExtensions = regExtensions.substring(1);
          var st = '\\.(' + regExtensions + ')$';
          var reg = new RegExp(st);
          if (reg.test(this.file.name)) {
            this.showError = false;
            this.getPresignedUrl(this.file.name);
          } else {
            this.showError = true;
          }
        } else {
          this.getPresignedUrl(this.file.name);
        }
      }
    },
    change_file_name (name) {
      // eslint-disable-next-line camelcase
      var file_extention = name.split('.').pop();
      // eslint-disable-next-line camelcase
      return this.custom_file_name + '.' + file_extention;
    },
    onUpdate () {
      this.upload_success = true;
      this.$emit('input', this.s3Url);
    },
    beforeUpdate () {
      this.$emit('beforeInput');
    },
    getPresignedUrl (fileName) {
      if (this.custom_file_name) {
        if (
          // eslint-disable-next-line eqeqeq
          this.change_file_name(fileName).toLowerCase() ==
          fileName.toLowerCase()
        ) {
          this.filename_match = true;
          fileName = this.change_file_name(fileName);
        } else {
          this.filename_match = false;
        }
      }
      const that = this;
      // Var config = {
      //   Headers: {
      //     Token:
      //       "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqd3QiLCJlbWFpbCI6InNpdmEuc3VyZWRkeStxYUA1MDBhcHBzLmNvbSIsInRlbmFudF9pZCI6IjY2NDMiLCJ1c2VyX2lkIjoiOTAwMSIsInVzZXJfaW1nIjoiIiwicmVnaW9uIjoicWEifQ.ot-gPeGoZw4mD8bO0C_XuyGZQnA6DrUbgxwRUSnO9Lo"
      //   }
      // };
      /**
       * Get presigned url based on trigger
       */
      if (this.filename_match) {
        axios
          .get(that.uploadConfig.url + fileName, {})
          .then(function (response) {
            console.log(response.data);
            that.urls = response.data;
            that.uploadFileToS3();
          });
      }
    }
  }
};
</script>

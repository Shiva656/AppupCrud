<template>
    <b-alert
        :id=id
        class="appup-alert"
        dismissible
        :variant="type"
        :show=showAlert
        @dismissed="dismissCallback">
        {{message}}
    </b-alert>
</template>
<script>
import { Alert } from 'bootstrap-vue';
/**
     * Appup Alert component which can be used to display success error messages
     */
export default {
  name: 'appup-alert',
  props: {

    /**
             * Id of input elements.
             */
    id: {
      type: String,
      required: false,
    },

    /**
             * Flag to show the alert or not
             *
             * `true, false`
             */
    show: {
      type: Boolean,
      required: true,
      default: false
    },

    /**
             * Message to be displayed in the alert
             */
    message: {
      type: String,
      required: true
    },

    /**
             * Type of Alert Message
             *
             * `info, warn, success, failure`
             */
    alertType: {
      type: String,
      default: 'success',
      validator: function (value) {
        // The value must match one of these strings
        return ['info', 'warn', 'success', 'failure'].indexOf(value) !== -1;
      }
    },

    /**
             * Time to hide alert
             */
    dismissCountDown: {
      type: Number,
      default: 5
    },

    /**
             * Automatic hide alert after dismissCountDown time
             */
    countDown: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    show (newVal) {
      if (this.countDown) {
        if (newVal) {
          this.showAlert = this.dismissCountDown;
        } else {
          this.showAlert = 0;
        }
      } else {
        this.showAlert = newVal;
      }
    }
  },
  mounted () {
    if (this.countDown) {
      if (this.show) {
        this.showAlert = this.dismissCountDown;
      } else {
        this.showAlert = 0;
      }
    } else {
      this.showAlert = this.show;
    }
  },
  data: function () {
    return {
      type:
                    this.alertType === 'failure' ? 'danger'
                      : this.alertType === 'warn' ? 'warning' : this.alertType,
      showAlert: this.show
    };
  },
  methods: {
    dismissCallback () {
      /**
                * Dismissed event.
                *
                * @event dismissed
                */
      this.$emit('dismissed');
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Alert
  }
};
</script>

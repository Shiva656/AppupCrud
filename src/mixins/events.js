import Vue from 'vue'
const AppupEventBus = new Vue()

/**
 * @mixin
 */
export const AppupEvents = {
  mounted () {
    // Listen for all appup events
    this._listen()
  },
  methods: {
    /**
        * Triggers an event with mode - search (on card), execute workflow, delete (on card)
        *
        * @param {String} ref - Ref to the component on which it has to be triggered
        * @param {String} mode - Search,Delete or execute workflow
        * @param {String} params - Dynamic params we need to send
        */
    _trigger (ref, mode, ...params) {
      // Create an event with mode and params
      const $event = {}
      $event.mode = mode
      $event.args = params
      AppupEventBus.$emit(ref, $event)
    },
    /**
        * Listens to all refs and registers for event handlers during the startup
        */
    _listen () {
      // Register for events for all refs
      if (!this.$refs) { return; }

      Object.keys(this.$refs).forEach(key => {
        // Register for all events
        AppupEventBus.$on(key, $event => {
          // Listener
          const component = this.$refs[key]
          const mode = $event.mode;
          const args = $event.args;

          console.log($event)

          // Execute
          switch (mode) {
            case 'search':
              // eslint-disable-next-line no-case-declarations
              const search = {};
              search.key = args[0]
              search.tokens = args[1].split(',').map(function (item) {
                return item.trim();
              });

              // Set the search parameter
              component.search = search;
              break;

            case 'exec':
              // Execute the workflow
              component.start(args[0], args[1]);
              break;
          }
        })
      })
    }
  }
};

<template>
  <FullCalendar
    defaultView="dayGridMonth"
    :weekends="true"
    :header="{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }"
    v-bind="config"
    :events="events"
    @dateClick="date_click"
    @eventDrop="event_drop"
    @eventClick="event_click"
    @eventRender="eventRender"
    @eventSelected="event_selected"
    :plugins="calendarPlugins"
    editable="true"
    ref="fullCalendar"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import AppData from '../../mixins/ac-data';

/**
 * @requires ac-data.js
 * @inherits ac-data
 */

export default {
  name: 'ac-fullcalendar',
  components: {
    FullCalendar // Make the <FullCalendar> tag available
  },
  mixins: [AppData],
  props: {
    /**
     * Preload handler
     * @param {String} -preload
     * @category_name 2_Data
     */
    preload: {
      type: String,
      required: false
    },
    /**
     * Events object for calender
     * @param {Array} -events
     * @category_name 1_General
     */
    events: {
      type: Array,
      required: false
    },
    /**
     * Config object for calender
     * @param {Object} -config
     * @category_name 1_General
     */
    config: {
      type: Object,
      default () {
        return {
          defaultView: 'month',
          eventLimit: true
        };
      }
    }
  },
  data () {
    return {
      calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin]
    };
  },
  watch: {
    events: {
      immediate: true,
      handler: function (newval, oldval) {
        this.events = newval;
      },
      deep: true
    },
    url: {
      handler: function (newval, oldval) {
        this.fetch_url_data();
      },
      deep: true
    },
    ac_cursor: {
      handler (newval, oldval) {
        this.fetch_url_data();
      },
      deep: true
    },
    data: {
      handler (newval, oldval) {
        this.events = newval;
      },
      deep: true
    }
  },
  created () {
    /**
     * On created we can  call handler
     */
    if (this.preload && this.preload.length) {
      var preloadArray = [];
      this.preload.forEach(element => {
        const preloadObject = {};
        preloadObject.name = element.name;
        if (element.params) {
          preloadObject.params = {
            helper: {
              custom: element.params ? element.params : {}
            }
          };
        }
        // Forming array of objects
        preloadArray.push(preloadObject);
      });
      this.start(preloadArray);
    } else {
      this.fetch_url_data();
    }
  },
  methods: {
    // If url available fetches data from url
    async fetch_url_data () {
      if (this.url) {
        // Const msg = await this.set_ajax();
        // This.events = this.data;
        this.events = {
          url: this.url,
          method: 'GET',
          extraParams: this.ac_cursor,
          failure: function () {
            alert('there was an error while fetching events!');
          }
        }
      }
    },
    date_click (args) {
      this.$emit('day-click', event);
    },
    event_drop (args) {
      const emitOb = {};
      emitOb.from = args.oldEvent;
      emitOb.to = args.event;
      this.$emit('event-drop', emitOb);
    },
    event_click (args) {
      this.$emit('event-click', args.event);
    },
    event_selected (args) {
      this.$emit('event-selected', args);
    },
    eventRender (info, element) {
      var contentEle = info.el.querySelectorAll('.fc-content')[0];
      if (this.show_event_dots) {
        const divEle = document.createElement('div');
        let dotclasses = 'dot-class';
        if (info.dotClassName) {
          dotclasses = dotclasses + ' ' + info.dotClassName;
        }
        divEle.setAttribute('class', dotclasses);
        contentEle.insertBefore(divEle, contentEle.firstChild);
      }
      contentEle.setAttribute('v-b-tooltip.hover', '');
      contentEle.setAttribute('title', info.event.title);
    }
  }
};
</script>
<style>
.fc-unthemed th,
.fc-unthemed td,
.fc-unthemed thead,
.fc-unthemed tbody,
.fc-unthemed .fc-divider,
.fc-unthemed .fc-row,
.fc-unthemed .fc-content,
.fc-unthemed .fc-popover,
.fc-unthemed .fc-list-view,
.fc-unthemed .fc-list-heading td {
    border-color: #e3ebf6 !important;
}
.fc-h-event.fc-event{
padding: 12px 6px !important;
}
.fc-time-grid-event{
    padding: 5px 6px !important;
}
.fc-h-event.fc-event,.fc-time-grid-event {
    background-color: #f0f4ff;
    border-left: 3px solid #6590f7 !important;
    border: 0;
    color: #3f4043 !important;
    border-radius: 0px !important;
}
.fc-left .fc-button-group .fc-button.fc-button-primary {
    background-color: transparent;
    border-radius: 50% !important;
    padding: 7px 0px;
    margin-left: 10px;
    border-color: #e3ebf6 !important;
    color: #283e59 !important;
}
.fc-left .fc-button-group .fc-button.fc-button-primary .fc-icon {
    top: -5px !important;
}
.fc-left .fc-button-group .fc-button.fc-button-primary:focus {
    outline: 0 !important;
    box-shadow: none !important;
}
.fc-left .fc-today-button,
.fc-right .fc-button.fc-button-primary {
    color: #fff;
    background-color: #6e84a3;
    border: #6e84a3 !important;
    text-transform: capitalize;
        height: 30px !important;
}.fc-left .fc-today-button.fc-button-active,
.fc-right .fc-button.fc-button-primary.fc-button-active {
    background-color:#5b6c84 !important;
}
.fc-day-grid .fc-row .fc-bg table tbody tr span {
    display: none !important;
}
.fc-view-container .fc-body .fc-divider.fc-widget-header {
  background: transparent;
    border-color: transparent !important;
    margin: 0px !important;
    padding: 0px !important;
    border-style: initial;
}
</style>

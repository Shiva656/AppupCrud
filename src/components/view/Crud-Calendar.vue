<template>
  <div>
    <b-card >
    <ac-fullcalendar
      :events="events"
      :ref="componentName + '-ref'"
      v-if="events"
      :key="events"
      @event-drop="eventDragDrop"
      @event-click="rowClick"
    />
    </b-card>
  </div>
</template>
<script>
import { data } from '../js/ajax';
import { getData, updateDataUrl } from '../js/global';
import calendar from '../Appup Components/ac-fullcalendar'
export default {
  components: {
    'ac-fullcalendar': calendar,
  },
  props: ['entity', 'componentName', 'finalCondition', 'blockParams', 'callbacks'],
  data () {
    return {
      slideout: 'f',
      resulturl: '',
      url: '',
      getUrl: '',
      events: [],
      keyName: '',
      dragAndDrop: '',
      keyDate: 'created_date',
      endDate: '',
      acCursor: {
        fields: '',
      },
    };
  },
  mounted () {
    console.log('crud-calendar');
    updateDataUrl(this.entity).then((res) => {
      this.url = res;
    });
    // Here k indiactes the event i.e., title
    this.keyName = this.blockParams.k;
    // Here dd indicates drag and drop column key
    if (this.blockParams.dd) {
      this.dragAndDrop = this.blockParams.dd;
    }
    // Here block param d indicates the start date
    const keyDate = this.blockParams.d ? this.blockParams.d : 'created_date';
    // Here block param e indicates the end date
    this.endDate = this.blockParams.e ? this.blockParams.e : '';
    this.acCursor.fields = `%20as%20title,${keyDate}%20as%20start${this.endDate ? `,${this.endDate} as end` : ''}`;
    // To enable slideout when we click on any event we need to pass so=t
    this.slideout = this.blockParams.so ? this.blockParams.so : this.slideout;
    getData(this.entity, 'filter').then((res) => {
      this.resulturl = res;
      this.getUrl = `${res}?fields=*,${this.blockParams.k}${this.acCursor.fields}${
        this.finalCondition.where ? `&where=${this.finalCondition.where}` : ''
      }`;
      this.getEvents(this.getUrl);
    });
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    finalCondition: function (newval, oldval) {
      this.getUrl = `${this.resulturl}?fields=*,${this.keyName}${this.acCursor.fields}${
        this.finalCondition.where ? `&where=${this.finalCondition.where}` : ''
      }`;
      this.getEvents(this.getUrl);
    },
  },
  methods: {
    rowClick: function (item) {
      if (this.slideout === 't') {
        this.$emit('row_click', item);
      }
    },
    eventDragDrop: function (event) {
      if (this.dragAndDrop) {
        console.log('event dragdrop', event);
        const form = {};
        form.id = event.to.id;
        // eslint-disable-next-line no-undef
        form[this.dragAndDrop] = moment(event.to.start).format('YYYY-MM-DD HH:mm:ss');
        // eslint-disable-next-line no-undef
        this.start('individual_update', {
          handlerParams: true,
          form: form,
          type: 1,
          before_update: (form, ui) => {
            if ((this.callbacks || {}).before_update) {
              // eslint-disable-next-line no-eval
              var fn = eval((this.callbacks || {}).before_update);
              return fn(form, ui);
            }
            return form;
          },
          after_update: (form, ui) => {
            if ((this.callbacks || {}).after_update) {
              // eslint-disable-next-line no-eval
              var fn = eval((this.callbacks || {}).after_update);
              return fn(form, ui);
            }
            return form;
          },
        });
      }
    },
    getEvents: function (url) {
      data(
        url,
        {},
        (result) => {
          result.forEach((item, index) => {
            if (item.start && (item.start.includes('AM') || item.start.includes('PM'))) {
              // eslint-disable-next-line no-undef
              item.start = moment(`${item.start} UTC`).format();
            }
            if (item.end && (item.end.includes('AM') || item.end.includes('PM'))) {
              // eslint-disable-next-line no-undef
              item.end = moment(`${item.end} UTC`).format();
            }
            result[index] = item;
          });
          if ((this.callbacks || {}).before_render) {
            // If you dont need cursor pointer just pass className:['no-cursor'] in every event object
            // eslint-disable-next-line no-eval
            const callBack = eval((this.callbacks || {}).before_render);
            result = callBack(result, this);
          }

          this.events = result;
        },
        // eslint-disable-next-line no-unused-vars
        (resp) => {}
      );
    },
  },
};
</script>

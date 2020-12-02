<template>
  <div>
    <ac-simple-card :data="item.item" :dropdown_options="collection.dropdownOptions" url="" :dropdown_button_options="collection.buttonOptions" card_title="hello" @dropdown_click="dropdownClick" :bulk="bulk" @input="bulkMethod">
      <template #hover>
        <div class="hover-div">HOVER</div>
      </template>
      <template #header>
        <div class><!--headers--></div>
      </template>
      <template v-slot:body="data">
          <!-- <component :is="component_name" @cardclick="cardClick" :item="data.data"> -->
          {{data}}
        </template>
      <template #footer>
        <div class><!--footer--></div>
      </template>
      <!--<template #option="{ data }">
      {{data}}
    </template>-->
    </ac-simple-card>
  </div>
</template>

<script>
import SimpleCard from '../Appup Components/ac-simple-card';

export default {
  components: {
    'ac-simple-card': SimpleCard,
  },
  props: ['item', 'componentName', 'collection', 'templateParams', 'blockParams'],
  data () {
    return {
      cardClass: 'col-md-12 md-12',
      card_id: [],
      bulk: this.blockParams.b
    };
  },
  watch: {
    item: {
      handler (after, before) {
        this.item = after;
      },
      deep: true,
    },
  },
  mounted () {
    console.log('simple card')
    window.simpleCard = [];
  },
  methods: {
    cardClick: function (key) {
      this.$emit('row_click', key);
    },
    bulkMethod: function (key) {
      const obj = window.simpleCard.filter(item => {
        return item === key;
      });
      if (obj.length > 0) {
        window.simpleCard = window.simpleCard.filter(item => {
          return item !== key;
        });
      } else {
        window.simpleCard.push(key);
      }

      this.$emit(
        'bulkCheck',
        window.simpleCard.map(item => {
          return { id: item };
        })
      );
    },
    dropdownClick: function (data) {
      data.index = this.item.index;
      this.$emit('dropdownClick', data);
    },
  },
};
</script>

/* eslint-disable no-debugger */
const viewJson = {
  appname: 'push',
  entity: 'Websites',
  blocks: ['v-accordion-table', 'v-accordion-card', 'v-table', 'v-cards', 'v-calendar', 'v-kanban', 'v-grouped', 'v-grouped-card', 'v-grouped-table'],
  blockDetails: [
    {
      block: 'v-accordion-table',
      blockParams: {
        su: 'https://my.dev.500apps.io/v2/websites?fields=name%20as%20name,id%20as%20id',
        iu: 'https://my.dev.500apps.io/v2/websites',
        c: '', // Card name
        d: true,
        appendKey: 'id',
        ik: 'id', // Item key
        b: true
      }
    },
    {
      block: 'v-accordion-card',
      blockParams: {
        gk: 'is_active',
        c: '', // Card name
        d: true,
        b: true
      }
    },
    {
      block: 'v-table',
      blockParams: {
        b: true,
        d: true,
      }
    },
    {
      block: 'v-cards',
      blockParams: {
        b: true, // Bulk
        d: true, // Dropdown
        cl: 4 // Card in a row
      }
    },
    {
      block: 'v-calendar',
      blockParams: {
        k: 'name', // Title
        d: 'updated_date', // Based on fetching data
        dd: 'updated_date' // Drag and drop
      }
    },
    {
      block: 'v-kanban',
      blockParams: {
        su: 'https://my.dev.500apps.io/v2/websites?fields=name%20as%20name,id%20as%20id',
        iu: 'https://my.dev.500apps.io/v2/websites',
        c: '', // Card name
        d: true,
        ik: 'id' // Item key

      }
    },
    {
      block: 'v-grouped',
      blockParams: {
        su: 'https://my.dev.500apps.io/v2/websites?fields=name%20as%20name,id%20as%20id',
        iu: 'https://my.dev.500apps.io/v2/websites',
        c: '', // Card name
        d: true,
        v: 'table',
        ik: 'id', // Item key
        sk: 'id'
      }
    },
    {
      block: 'v-grouped-card',
      blockParams: {
        b: true,
        d: true,
        gk: 'is_active'
      }
    },
    {
      block: 'v-grouped-table',
      blockParams: {
        b: true,
        d: true,
        gk: 'is_active'
      }
    }

  ],
  templateParams: {
    lm: 10, // Limit
    s: 't', // Search
    sk: 'name', // Search by
    ad: 't', // Add button
    nbn: '', // Form or form2
    f: 'f' // Simple filter
  },
  fields: [{
    type: 'hidden',
    name: 'id',
    label: '',
    placeholder: 'Enter Id',
    max_length: '',
    value: '',
    required: true,
    _f: true, // Rendering in  form
    _v: false, // Rendering in table
    key: 'id'
  }, {
    type: 'text',
    name: 'name',
    label: 'Website Name',
    placeholder: 'Enter Name',
    max_length: '50',
    value: '',
    required: true,
    _c: true,
    sortable: true,
    _f: true,
    _v: true,
    key: 'name'
  }, {
    type: 'text',
    name: 'url',
    label: 'Website URL',
    placeholder: 'Enter Url',
    max_length: '1024',
    value: '',
    required: true,
    _c: true, // Column picker
    _f: true,
    _v: true,
    key: 'url'
  },
  {
    type: 'dropdown',
    name: 'name',
    placeholder: 'Enter Name',
    _sf: true, // Simple filter
    value: '',
    required: true,
    url: 'https://my.dev.500apps.io/v2/websites',
    key_label: 'name',
    key_value: 'name'
  }

  ],
  callbacks: {
    // eslint-disable-next-line no-unused-vars
    before_submit: (cols, ui) => {
      debugger;
      cols.api_key = '5121620099595712';
      return cols;
    },
    // eslint-disable-next-line no-unused-vars
    before_render: (cols, ui) => {
      return cols;
    }
  },
  dropdown: [{
    label: 'Edit',
    type: 'edit',
    handler: '',
    'modal-size': 'md'
  }, {
    label: 'Delete',
    type: 'delete',
    handler: ''
  }, {
    label: 'Active',
    icon: '',
    handler: '',
    type: 'is_active'
  }],
  bulkOptions: [{ label: 'Active', name: 'Active', type: 'is_active', variant: 'white-20 btn-sm ml-2 rounded is_active' }],
  url: {
    postUrl: 'https://my.dev.500apps.io/v2/websites',
    putUrl: 'https://my.dev.500apps.io/v2/websites',
    deleteUrl: 'https://my.dev.500apps.io/v2/websites',
    getUrl: 'https://my.dev.500apps.io/v2/websites'
  }

};

export default viewJson;

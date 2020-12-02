export var alertHandler = {
  id: 'alert',
  triggerName: 'none',
  workflow: [
    { id: '1', type: 'start', next: { success: 'PBXIzpOL30PSt' } },
    { id: 'PBXIzpOL30PSt', type: 'alert', next: { success: 'hangup' }, nodename: 'Alert', title: '{{title}}', message: '{{{message}}}', variant: '{{#if type}}{{type}}{{else}}default{{/if}}', duration: '4000' }
  ]
};

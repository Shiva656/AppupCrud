/* eslint-disable no-template-curly-in-string */
export var preloadHandler = {
  id: 'preload',
  triggerName: 'null',
  workflow: [
    { id: '1', type: 'start', next: { success: 'PBXTpbVAFmZaD' } },
    { id: 'PBXs17ebgcV3C', type: 'deserialize_form', next: { success: 'hangup' }, nodename: 'Deserialize', data: 'response_data', form_id: ' ' },
    {
      id: 'PBXTpbVAFmZaD',
      type: 'js',
      next: { success: 'PBXs17ebgcV3C' },
      nodename: 'form fields preload app...',
      code:
        "function(data, ui) {\r\n    ui.formFields = ui.$parent.formFields ? ui.$parent.formFields.fields : ui.$parent.$parent.formFields.fields;\r\n    ui.buttons = ui.$parent.formFields ? ui.$parent.formFields.buttons : ui.$parent.$parent.formFields.buttons;\r\n\r\n\r\n    if (ui.$route.params.lhs_pid != '0') {\r\n        ui.formFields.filter(item => { return item.lhs_pid }).map(item => {\r\n            if (item.url.includes('?') && !item.url.includes(ui.$route.params.lhs_pid.split('=')[0])) {\r\n                item.url += ` and ${ui.$route.params.lhs_pid}`;\r\n            }\r\n            else if (!item.url.includes('?')) {\r\n                item.url += `?where=${ui.$route.params.lhs_pid}`;\r\n            }\r\n            return item;\r\n        });\r\n    }\r\n\r\n    // Building oject from  lhs_data in route\r\n    /*    try {\r\n            let lhs_data = {};\r\n            let  obj_ref=ui;\r\n             ui.$route.params.lhs_pid.split(',').map(item => {\r\n                let i = item.split('=');\r\n                lhs_data[i[0]] = i[1];\r\n            })\r\n            data.response_data = { ...lhs_data };\r\n        } catch (e) { }*/\r\n    data.response_data = { ...window.lhs_data };\r\n\r\n    // calling function in block for preload\r\n    ui.$parent.formFields ? ui.$parent.preloadForm(data.response_data) : ui.$parent.$parent.preloadForm(data.response_data);\r\n\r\n\r\n    for (var key in data.response_data) {\r\n        ui.formFields.forEach(item => {\r\n            if (item.name == key)\r\n                item.value = data.response_data[key];\r\n        });\r\n    }\r\n\r\n    return data;\r\n}",
    },
  ],
};

/* eslint-disable no-template-curly-in-string */
export var preloadF2 = {
  id: 'preload_f2',
  triggerName: 'null',
  workflow: [
    { id: '1', type: 'start', next: { success: 'PBXwhR4E29tth' } },
    {
      id: 'PBXwhR4E29tth',
      type: 'js',
      next: { success: 'PBXJcI57My7T7' },
      nodename: 'JS code',
      code:
        "function(data,ui){\r\n\r\nui.formFields=ui.convert_json(ui.$parent.formFields.fields);\r\nui.buttons=ui.$parent.formFields.buttons;\r\n  // Building oject from  lhs_data in route\r\n/*    try {\r\n        let lhs_data = {};\r\n        let  obj_ref=ui;\r\n         ui.$route.params.lhs_pid.split(',').map(item => {\r\n            let i = item.split('=');\r\n            lhs_data[i[0]] = i[1];\r\n        })\r\n        data.response_data = { ...lhs_data };\r\n    } catch (e) { }*/\r\ndata.response_data = { ...window.lhs_data };\r\n\r\n   // calling function in block for preload\r\n    ui.$parent.formFields?ui.$parent.preloadForm(data.response_data):ui.$parent.$parent.preloadForm(data.response_data);\r\n\r\n\r\n       for(var key in data.response_data)\r\n      {\r\n       ui.formFields.forEach(item=>{\r\n       if(item.name==key)\r\n       item.value=data.response_data[key];\r\n       });\r\n      }\r\n\r\n    return data;\r\n}",
    },
    { id: 'PBXJcI57My7T7', type: 'deserialize_form', next: { success: 'hangup' }, nodename: 'Deserialize', data: 'response_data', form_id: '' },
  ],
};

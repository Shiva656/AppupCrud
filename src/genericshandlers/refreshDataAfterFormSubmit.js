/* eslint-disable no-template-curly-in-string */
export var refreshSubmitHandler = {
  id: 'get_data_after_submit',
  triggerName: 'null',
  workflow: [
    { id: '1', type: 'start', next: { success: 'PBXnwQ5GaGJaW' } },
    {
      id: 'PBXnwQ5GaGJaW',
      type: 'ajax',
      next: { failure: 'hangup', success: 'PBXVJNLKPSHO8' },
      nodename: 'Ajax',
      url: '{{{submit_handler.url}}}',
      method: 'get',
      jsonp: 'false',
      data: ' ',
      var: 'response',
      data_params: [{}],
      headers: [{ Accept: 'text/plain' }],
    },
    {
      id: 'PBXVJNLKPSHO8',
      type: 'js',
      next: { success: 'hangup' },
      nodename: 'JS code',
      code:
        "function(data, ui) {\r\n  debugger;  // Show confirmation block after update\r\n    data.c_block = data.submit_handler.template_params.cb == \"t\" ?true : false;\r\n    data.blockName = (data.c_block && data.submit_handler.template_params.cbn) ? data.submit_handler.template_params.cbn : '';\r\n    if (data.submit_handler.is_updateFor != 1) {\r\n        try {\r\n            if (ui.$parent.$parent.$parent.$parent.updateUi) {\r\n                ui.$parent.$parent.$parent.$parent.updateUi(\"insert\", data.response.data[0]);\r\n                data.c_block ? ui.$parent.$parent.$parent.$parent.show_confirmation_block(data.blockName, data.submit_handler.form) : '';\r\n            }\r\n            else if (ui.$parent.$parent.$refs[\"template_refs\"]) {\r\n                ui.$parent.$parent.$refs[\"template_refs\"].updateUi('insert', data.response.data)\r\n            }\r\n            else {\r\n                typeof data.response.data == \"object\" ? ui.$parent.$parent.$parent.$parent.$parent.updateUi('insert', data.response.data) : '';\r\n                data.c_block ? ui.$parent.$parent.$parent.$parent.$parent.show_confirmation_block(data.blockName, data.submit_handler.form) : '';\r\n            }\r\n\r\n\r\n        } catch (err) {\r\n            //window.cv_block_ref.updateUi('insert', data.response.data);\r\n         }\r\n    }\r\n    else {\r\n     if (ui.$parent.$parent.$parent.$parent.$refs[\"lhs_verticalref\"]) {\r\n            ui.$parent.$parent.$parent.$parent.updateUi('update',data.response.data[0]);\r\n        }\r\nelse{\r\n  try{\r\n        ui.$parent.$parent.$parent.$parent.$parent.updateUi('update', data.response.data);\r\n        data.c_block ? ui.$parent.$parent.$parent.$parent.$parent.show_confirmation_block(data.blockName, data.submit_handler.form) : '';\r\n}catch(err){\r\nwindow.cv_block_ref.updateUi('update', data.response.data);\r\n    data.c_block ?window.cv_block_ref.show_confirmation_block(data.blockName, data.submit_handler.form) : '';\r\n}\r\n}\r\n    }\r\n}",
    },
  ],
};

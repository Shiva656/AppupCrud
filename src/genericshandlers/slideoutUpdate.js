/* eslint-disable no-template-curly-in-string */
export var sUpdateHandler = {
  id: 's_update',
  triggerName: 'null',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXEazn9p2sTs'
    }
  }, {
    id: 'PBXEazn9p2sTs',
    type: 'js',
    next: {
      success: 'PBXGxlsJGN46x'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\ntry{\r\nui.$parent.slideout_before_update(data.form,ui);\r\n}catch(err){data.slideout_before_update(data.form,ui);}\r\nvar app_name = get_app();\r\ndata.server_url = slideoutAppUrl[app_name][ui.$route.params.entity][\"PUT\"];\r\ndata.dynamic_app=app_name;\r\ndata.id = ui.$route.params.id;\r\n\r\ndata.form_data = {...data.form};\r\n\r\ndata.form_data.id?delete data.id:''\r\ndata.id_key = props_from_params(data.route.params.template_params).ik;\r\nif(data.form_data){\r\nfor(var key in data.form_data){\r\nif(typeof(data.form_data[key])==\"boolean\"){\r\ndata.form_data[key]=data.form_data[key]==true?1:0;\r\n}\r\n if(key.includes('date')){\r\n let x = new Date(data.form_data[key]);\r\n data.form_data[key] = `${x.getFullYear()}-${('0' +(x.getMonth()+1)).slice(-2)}-${('0' +x.getDate()).slice(-2)} ${('0' \r\n +x.getHours()).slice(-2)}:${('0' +x.getMinutes()).slice(-2)}:${('0' + x.getSeconds()).slice(-2)}`;\r\n}\r\nif(!data.form_data[key])\r\n{\r\ndelete data.form_data[key];\r\n}\r\n}\r\n}\r\n}"
  }, {
    id: 'PBXUTaF7kNXmJ',
    type: 'js',
    next: {
      success: 'PBXApgMyc0zBF'
    },
    nodename: 'JS code',
    code: "function(data, ui) {\r\ntry{\r\nui.$parent.slideout_after_update(data.form,ui);\r\n}catch(err){data.slideout_after_update(data.form,ui);}\r\n    try {\r\n        if (ui.$parent.$parent.$parent.$parent.$parent.$refs.template_refs) {\r\n                ui.$parent.$parent.$parent.$parent.$parent.$refs.template_refs.$refs.view_component_ref.$refs[ui.$route.params.ref].handler_data();  \r\n        } else {\r\n            ui.$parent.$parent.$parent.$parent.$refs.template_refs.$refs.view_component_ref.$refs[ui.$route.params.ref].handler_data();\r\n        }\r\n    } catch (err) {}\r\n    try {\r\n        data.form.id = data.id;\r\n        //window.cv_block_ref.updateUi('update', [data.form]);\r\n    } catch (err) {}\r\n    if (data.call_backref) {\r\n        data.call_backref(data.res.data, '200');\r\n    }\r\n}"
  }, {
    id: 'PBXGxlsJGN46x',
    type: 'ajax',
    next: {
      failure: 'PBXnuhKTdaeXU',
      success: 'PBXUTaF7kNXmJ'
    },
    nodename: 'Ajax',
    url: '{{{server_url}}}',
    method: 'put',
    data: '{{#if update_data}}{{{form-encoded update_data}}}{{/if}}{{#if form_data}}{{{form-encoded form_data}}}{{/if}}{{#if id}}&id={{{id}}}{{/if}}',
    var: 'res',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBXApgMyc0zBF',
    type: 'alert',
    next: {
      success: 'PBXu07oDI6u96'
    },
    nodename: 'Alert',
    title: 'Success',
    message: 'Updated Successfully',
    variant: 'success',
    duration: '2000'
  }, {
    id: 'PBXnuhKTdaeXU',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: 'function(data,ui){}'
  }, {
    id: 'PBXu07oDI6u96',
    type: 'js',
    next: {
      success: 'PBXEmTc9DHOiz'
    },
    nodename: 'JS code',
    code: 'function(data,ui){\r\ndata.template_params=props_from_params(ui.$route.params.template_params);\r\ndata.get_url=`v2/${ui.$route.params.entity}?w=${data.template_params.ik} in (${ui.$route.params.id})`;\r\n}'
  }, {
    id: 'PBXEmTc9DHOiz',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'PBXESmKTDhmJX'
    },
    nodename: 'Ajax',
    url: '{{{get_url}}}',
    method: 'get',
    jsonp: 'false',
    data: ' ',
    var: 'get_data',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBXESmKTDhmJX',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\nwindow.cv_block_ref.updateUi('update',data.get_data.data);\r\n}"
  }]
}

// {
//   Id: 's_update',
//   TriggerName: 'null',
//   Workflow: [{
//     Id: '1',
//     Type: 'start',
//     Next: {
//       Success: 'PBXTpbVAFmZaD'
//     }
//   }, {
//     Id: 'PBXs17ebgcV3C',
//     Type: 'deserialize_form',
//     Next: {
//       Success: 'hangup'
//     },
//     Nodename: 'Deserialize',
//     Data: 'response_data',
//     Form_id: ' '
//   }, {
//     Id: 'PBXTpbVAFmZaD',
//     Type: 'js',
//     Next: {
//       Success: 'PBXs17ebgcV3C'
//     },
//     Nodename: 'form fields preload app...',
//     // eslint-disable-next-line no-template-curly-in-string
//     Code: "function(data, ui) {\r\n    ui.formFields = ui.$parent.form_fields ? ui.$parent.form_fields.fields : ui.$parent.$parent.form_fields.fields;\r\n    ui.buttons = ui.$parent.form_fields ? ui.$parent.form_fields.buttons : ui.$parent.$parent.form_fields.buttons;\r\n\r\n\r\n    if (ui.$route.params.lhs_pid != '0') {\r\n        ui.formFields.filter(item => { return item.lhs_pid }).map(item => {\r\n            if (item.url.includes('?') && !item.url.includes(ui.$route.params.lhs_pid.split('=')[0])) {\r\n                item.url += ` and ${ui.$route.params.lhs_pid}`;\r\n            }\r\n            else if (!item.url.includes('?')) {\r\n                item.url += `?where=${ui.$route.params.lhs_pid}`;\r\n            }\r\n            return item;\r\n        });\r\n    }\r\n\r\n    // Building oject from  lhs_data in route\r\n    /*    try {\r\n            let lhs_data = {};\r\n            let  obj_ref=ui;\r\n             ui.$route.params.lhs_pid.split(',').map(item => {\r\n                let i = item.split('=');\r\n                lhs_data[i[0]] = i[1];\r\n            })\r\n            data.response_data = { ...lhs_data };\r\n        } catch (e) { }*/\r\n    data.response_data = { ...window.lhs_data };\r\n\r\n    // calling function in block for preload\r\n    ui.$parent.form_fields ? ui.$parent.preload_form(data.response_data) : ui.$parent.$parent.preload_form(data.response_data);\r\n\r\n\r\n    for (var key in data.response_data) {\r\n        ui.formFields.forEach(item => {\r\n            if (item.name == key)\r\n                item.value = data.response_data[key];\r\n        });\r\n    }\r\n\r\n    return data;\r\n}"
//   }]
// }

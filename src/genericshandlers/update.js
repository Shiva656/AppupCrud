/* eslint-disable no-template-curly-in-string */
export var updateHandler = {
  id: 'individual_update',
  triggerName: 'individual_update',
  workflow: [
    { id: '1', type: 'start', next: { success: 'PBXG2U0ZH35vO' } },
    {
      id: 'PBXG2U0ZH35vO',
      type: 'js',
      next: { success: 'PBX7nLfeNTXfP' },
      nodename: 'JS code for forming Url...',
      code:
        'function(data,ui)\r\n{\r\n debugger;  try {\r\n      ui.$parent.formJson.buttons[0].disabled=true;\r\n ui.$parent.formJson.buttons=[...ui.$parent.formJson.buttons]; } catch (err) { }\r\ntry{\r\nif(ui.$parent.before_update){ data.form=ui.$parent.before_update(data.form,ui);}else{data.form=data.before_update(data.form,ui)}\r\n}catch(err){}\r\nfor(var key in data.form){\r\nif(Array.isArray(data.form[key])){\r\ndata.form[key]=data.form[key][0];\r\n}\r\nif (Number.isInteger(data.form[key])) {\r\n            data.form[key] = JSON.stringify(data.form[key]);\r\n}\r\n}\r\nfor(var tem in data.form){\r\nif(typeof data.form[tem]=="boolean"){\r\ndata.form[tem]=data.form[tem]==true?1:data.form[tem]==false?0:data.form[tem];\r\n}\r\n}\r\ndata.url=data.url?data.url:ui.$parent.url?ui.$parent.url:ui.url?ui.url:\'\';\r\ndata.arrayIds=window.tableref?window.tableref.id:0;\r\ndata.id=data.ids?data.ids:window.tableref?window.tableref.id.toString():"";\r\nvar entity_name=ui.$parent.entity?ui.$parent.entity:data.entity?data.entity:ui.$route.params.entity;\r\ndata.server_url = "v2/"+entity_name;\r\ndata.app_name=get_app();\r\n\r\nwindow.updatedFormData=data.form;\r\n}',
    },
    {
      id: 'PBX6KozNZ9Oas',
      type: 'ajax',
      next: { failure: 'PBXT51p9ASBpZ', success: 'PBX3TBoZuMgZI' },
      nodename: 'Ajax update',
      url: '{{#if url}}{{url}}{{else}}{{{update_url}}}{{/if}}',
      method: 'put',
      jsonp: 'false',
      data: '{{{form-encoded form}}}{{#if id}}&id={{id}}{{/if}}',
      var: 'result',
      data_params: [{ name: 'value' }],
      headers: [{ Accept: 'text/plain' }],
    },
    {
      id: 'PBX3TBoZuMgZI',
      type: 'js',
      next: { success: 'PBXmP1LXgSd82' },
      nodename: 'JS code for sending upd...',
      code:
        "function(data, ui) {\r\n    try {\r\n       if(ui.$parent.after_update) {data.form = ui.$parent.after_update(data.form, ui);}else{data.form=data.after_update(data.form, ui);}\r\n    } catch (err) {}\r\n    ui.$bvModal.hide('bv-modal-example');\r\ntry{\r\n//  window.cv_block_ref.individual_updated(data.arrayIds, data.form);\r\n}catch(err){}\r\n  \r\ndata.template_params= {};\r\n             data.is_updateFor=1;\r\n    if (data.handlerParams){\r\n        if (data.handlerParams['a-lhs']) {\r\n         ui.$bvModal.hide('a-lhs-modal');\r\n            \r\n            data.url = `${data.url?data.url:data.update_url}?w=id=${data.form.id}`;;\r\n            ui.start(\"get_data_after_submit\", {\r\n                \"submit_handler\": data\r\n            });\r\n        }\r\n  else{\r\ntry{\r\nif(window.cv_block_ref.componentRef == 'v-table-ref' || window.cv_block_ref.componentRef == 'v-cards-ref' || window.cv_block_ref.componentRef == 'v-kanban-ref' || window.cv_block_ref.componentRef == 'v-grouped-cards-ref' || window.cv_block_ref.componentRef == 'v-accordion-table-ref'){\r\n  data.url = `${cv_block_ref.getUrl}?w=id in (${data.id})`;\r\n            ui.start(\"get_data_after_submit\", {\r\n                \"submit_handler\": data\r\n            });\r\n}\r\n}catch(err){}\r\n }    }\r\nelse\r\n{\r\nwindow.cv_block_ref.individual_updated(data.arrayIds, data.form);\r\nui.form=data.form;\r\nif(data.callback){\r\ndata.callback(ui, data.result.data);\r\n}\r\n}\r\n}",
    },
    {
      id: 'PBXyadt5nPWACgfs',
      type: 'js',
      next: {
        success: 'hangup'
      },
      nodename: 'JS code',
      code: 'function(data,ui){\r\n try {\r\n      ui.$parent.formJson.buttons[0].disabled=false;\r\n ui.$parent.formJson.buttons=[...ui.$parent.formJson.buttons]; } catch (err) { } }'
    },
    { id: 'PBXmP1LXgSd82', type: 'alert', next: { success: 'hangup' }, nodename: 'Alert', title: 'Success', message: 'Updated Successfully' },
    { id: 'PBXT51p9ASBpZ', type: 'alert', next: { success: 'PBXyadt5nPWACgfs' }, nodename: 'Alert Failed to Update', title: 'Failed', message: 'Failed to Update' },
    { id: 'PBX0PPZs2h6Jb', type: 'validate', next: { success: 'PBX6KozNZ9Oas', failure: 'hangup' }, nodename: 'Validate', form_id: '' },
    { id: 'PBX7nLfeNTXfP', type: 'if_condition', next: { success: 'PBX6KozNZ9Oas', failure: 'PBX0PPZs2h6Jb' }, nodename: 'If Condition', if_type: 'value', variable1: '{{type}}', comparator: '==', variable2: '1' },
  ],
};

export var deleteHandler = {
  id: 'delete',
  triggerName: 'to delete record',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXviOOdUW1Ca'
    }
  }, {
    id: 'PBXviOOdUW1Ca',
    type: 'js',
    next: {
      success: 'PBXEFFQ94ZKI7'
    },
    nodename: 'JS code for forming Url...',
    code: "function(data,ui)\r\n{\r\ndebugger;//selected ids\r\nlet selected_ids=data.id?data.id.toString():''; data.totalIds=selected_ids;\r\n//Fetching table name from route\r\ndata.table_name=data.entity?data.entity:ui.$route.params.entity;\r\n//For table name\r\n// id's to be deleted\r\ndata.form={}\r\ndata.form.id=selected_ids;\r\ndata.id=\"w=id in (\"+selected_ids+\")\";\r\ndata.entity_url = ui.deleteUrl?ui.deleteUrl:data.deleteUrl?data.deleteUrl:null;\r\n\r\n//data.table_name.includes('v2')?data.table_name:\r\n\r\ndata.server_url =\"v2/\"+data.table_name;\r\ntry {\r\n         ui.before_delete(data, ui);\r\n    } catch (err) { }\r\n}"
  }, {
    id: 'PBXksqaKGSnOK',
    type: 'ajax',
    next: {
      failure: 'PBX3emLb4TFEg',
      success: 'PBXnHiLVu7nzu'
    },
    nodename: 'Ajax',
    url: '{{#if entity_url}}{{{entity_url}}}{{else}}{{{delete_url}}}{{/if}}?{{{id}}}',
    method: 'delete',
    jsonp: 'false',
    data: ' ',
    var: 'result',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBXeepaVa1BVM',
    type: 'js',
    next: {
      success: 'PBXTWndw8vs46'
    },
    nodename: 'JS code',
    code: 'function(data,ui)\r\n{\r\ntry{\r\nif(ui.$options.name=="c-v")\r\n{\r\nui.$refs["view_component_ref"].$refs["ac-renderer-ref"].$refs[data.ref].set_ajax();\r\n}\r\nelse\r\n{\r\nui.$parent.$refs["view_component_ref"].$refs["ac-renderer-ref"].$refs[data.ref].set_ajax();\r\n\r\n}\r\n}catch(e){}\r\ntry{\r\nif(data.calback_response){\r\ndata.calback_response(ui, data.result.data);\r\n}\r\n}catch(e){}\r\n}'
  }, {
    id: 'PBXnHiLVu7nzu',
    type: 'js',
    next: {
      success: 'PBXeepaVa1BVM'
    },
    nodename: 'JS code',
    // eslint-disable-next-line no-template-curly-in-string
    code: 'function(data, ui) {\r\ndebugger;try {\r\n         ui.after_delete(data, ui);\r\n    } catch (err) { } ;\r\n      (window.cv_block_ref||{}).updateUi("delete", data.totalIds);  ;\r\n                    \r\n}'
  }, {
    id: 'PBXEFFQ94ZKI7',
    type: 'modal',
    next: {
      success: 'PBXksqaKGSnOK'
    },
    nodename: 'confirmation Modal  ',
    'modal-title': 'Delete',
    body: '<div class="text-center">\r\n        <div class=" text-danger mb-5  mt-3">\r\n              <i class="fal fa-times-circle fa-4x"></i>\r\n        </div>\r\n        <div class="mb-4">\r\n               <h3 class="delete-text">Are you Sure ?</h3>\r\n                <p class="mx-4 px-6 mb-0 ">Do you want to really delete these records ? This Process cannot be undone .</p></div>\r\n</div>',
    'modal-ok-title': 'Delete',
    'modal-cancel-title': 'Cancel',
    'modal-ok-variant': 'danger',
    'modal-no-close-on-esc': 'false',
    'modal-no-close-on-backdrop': 'false',
    preventOk: 'false',
    config: '{\r\n"hide-footer":false,\r\n"hide-header":false,\r\n"header-class":"d-none header-modal",\r\n"footer-class":"delete-footer",\r\n"scrollable":"true",\r\n"ok-variant":"danger",\r\n"cancel-variant":"secondary mr-3",\r\n"centered":true\r\n}'
  }, {
    id: 'PBX3emLb4TFEg',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert for failed to Delete',
    title: 'Failed',
    message: 'Failed to Delete',
    variant: 'danger',
    duration: '20000'
  }, {
    id: 'PBXTWndw8vs46',
    type: 'alert',
    next: {
      success: 'PBXwozHtXVfy5'
    },
    nodename: 'Alert Deleted',
    title: 'Success',
    message: 'Deleted Successfully'
  }, {
    id: 'PBXJTAJOTEirA',
    type: 'js',
    next: {
      success: 'PBXk3XiP7oJCt'
    },
    nodename: 'JS code',
    // eslint-disable-next-line no-template-curly-in-string
    code: "function(data, ui) {\r\n  debugger;  if (window.cv_block_ref && window.cv_block_ref.componentRef) {\r\n        if (window.cv_block_ref.componentRef== 'v-table-ref' || window.cv_block_ref.componentRef== 'v-cards-ref') {\r\n            let ref = window.cv_block_ref.$refs.view_component_ref.$refs[window.cv_block_ref.componentRef];\r\n            let count = ref.total_count;\r\n            ref.total_count = Number(count) > 0 ? Number(count) - data.result.data : ref.total_count;\r\n            let limit = (data.result.data <= Number(ref.limit)) ? data.result.data : Number(ref.limit);\r\n            let offset = Number(ref.offset) ? Number(ref.offset) + (10 - data.result.data) : 10 - data.result.data;\r\n            data.url = `${data.getUrl}?l=${limit}&offset=${offset}${window.cv_block_ref.finalCondition.order_by?`&s=${window.cv_block_ref.finalCondition.order_by}`:''\r\n}${window.cv_block_ref.finalCondition.where?`&w=${window.cv_block_ref.finalCondition.where}`:''}`;\r\n        }\r\n    }\r\n}"
  }, {
    id: 'PBXk3XiP7oJCt',
    type: 'if_condition',
    next: {
      success: 'PBX0qyayZ3u2G',
      failure: 'hangup'
    },
    nodename: 'If Condition',
    if_type: 'strlen',
    variable1: '{{url}}',
    comparator: '>',
    variable2: '0'
  }, {
    id: 'PBX0qyayZ3u2G',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'PBXtJLVwaAOG4'
    },
    nodename: 'Ajax',
    url: '{{{url}}}',
    method: 'get',
    jsonp: 'false',
    data: ' ',
    var: 'getResponse',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBXtJLVwaAOG4',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n\tdebugger;if (window.cv_block_ref && window.cv_block_ref.componentRef) {\r\n\t\tif (window.cv_block_ref.componentRef == 'v-table-ref' || window.cv_block_ref.componentRef == 'v-cards-ref') {\r\n   window.cv_block_ref.updateUi('update',data.getResponse.data);\r\n}\r\n}\r\n}"
  },
  {
    comparator: '==',
    id: 'PBXwozHtXVfy5',
    if_type: 'value',
    next: { success: 'hangup', failure: 'PBXJTAJOTEirA' },
    nodename: 'If Condition',
    type: 'if_condition',
    variable1: '{{{getUrlNotNeeded}}}',
    variable2: '1'
  }]
}

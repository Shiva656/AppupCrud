export var addBulkTag = {
  id: 'add_bulk_tags',
  triggerName: 'add_bulk_tags',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXb38e6bxUguvali'
    }
  },
  {
    id: 'PBXb38e6bxUguvali',
    type: 'js',
    next: {
      success: 'PBXNPsCfgtrPv'
    },
    nodename: 'JS code for forming Url...',
    code: 'function(data,ui){\r\n debugger;\r\ntry {\r\n        ui.$parent.formJson.buttons[0].disabled=true;\r\n          } catch (err) { }\r\n}'
  },
  {
    id: 'PBXb38e6bxUgu',
    type: 'js',
    next: {
      success: 'PBXoZhLoeFbsz'
    },
    nodename: 'JS code for forming Url...',
    code: 'function(data,ui){\r\ntry{\r\nui.$parent.before_add_tag(data.form,ui);\r\n}catch(err){}\r\n\r\nif(ui.$route.meta.isSlideout){\r\nwindow.tableref.id.push(eval(data.route.params.id))\r\n}\r\n//var arrIds;\r\n//if(ui.$route.params.id){\r\n//arrIds=ui.$route.params.id;\r\n//}\r\n//else{\r\n//arrIds=window.tableref.id;\r\n//} \r\nvar arrIds=window.tableref.id;\r\nvar entity_name=ui.$parent.entity?ui.$parent.entity:data.entity?data.entity:ui.$route.params.entity;\r\ndata.server_url = "v2/"+entity_name;\r\n//data.app_name=get_app();\r\ndata.add_tag_url=get_region_url(get_app(),data.server_url);\r\nvar template_options=data.handlerParams;\r\ndata.get_url=template_options.url;\r\ndata.where="?w=id%20in%20("+data.form.tags.toString()+")";\r\n//var template_options=props_from_params(data.route.params.template_params);\r\nvar tag=data.form.tags;\r\n//form db format\r\n\r\nvar insertArr=[];\r\nfor(var arIndex in arrIds){\r\nfor(var tagIndex in tag){\r\nvar temp={}\r\ntemp[template_options.tcn]=JSON.stringify(tag[tagIndex]);\r\ntemp[template_options.ocn]=JSON.stringify(arrIds[arIndex]);\r\n\r\ninsertArr.push(temp);\r\n}\r\n}\r\nvar obj={\r\ndata:ui.dbarray?ui.dbarray:insertArr\r\n}\r\ndata.obj=JSON.stringify(obj);\r\n}'
  },
  {
    id: 'PBXoZhLoeFbsz',
    type: 'ajax',
    next: {
      failure: 'PBXMCbREHU18o',
      success: 'PBXlh0tUGqdSh'
    },
    nodename: 'Ajax call for add tags ...',
    url: '{{{add_tag_url}}}',
    method: 'post',
    data: '{{{obj}}}',
    var: 'resp',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      'Content-Type': 'application/json'
    }]
  },
  {
    id: 'PBXlh0tUGqdSh',
    type: 'js',
    next: {
      success: 'PBXKnfrn4ygt3'
    },
    nodename: 'JS code for sending ins...',
    // eslint-disable-next-line no-template-curly-in-string
    code: "function(data,ui){\r\n    try{\r\n    ui.$parent.after_add_tag(data.obj,ui);\r\n    }catch(err){}\r\n    \r\n \r\nui.$bvModal.hide(\"bv-modal-example\")?ui.$bvModal.hide(\"bv-modal-example\"):ui.$bvModal.hide(ui.$parent.modalRef);\r\n    //ui.$bvModal.hide('bv-modal-example');\r\n   /* var type=data.handlerParams.type;\r\n    var str=\"\";\r\n    data.resp.data.map((item,index)=>{\r\n    data.resp.data.length-1==index?(str=str+item.name):(str=str+item.name+\",\")\r\n    })\r\n    var form={};\r\n    form[type]=str;\r\n    window.cv_block_ref.individual_updated(window.tableref.id,form,type);*/\r\n    //ui.$parent.$parent.$parent.$parent.$parent.$refs[\"view_component_ref\"].$refs[\"v-table-ref\"].set_ajax();\r\n    data.template_params= {};\r\n    data.id=window.tableref?window.tableref.id.toString():\"\";\r\n    data.is_updateFor=1;\r\n    if (data.handlerParams){\r\ntry{\r\nif(window.cv_block_ref.componentRef == 'v-table-ref' || window.cv_block_ref.componentRef == 'v-cards-ref' || window.cv_block_ref.componentRef == 'v-kanban-ref' || window.cv_block_ref.componentRef == 'v-grouped-cards-ref' || window.cv_block_ref.componentRef == 'v-accordion-table-ref'){\r\n  data.url = `${cv_block_ref.getUrl}?w=id in (${data.id})`;\r\n            ui.start(\"get_data_after_submit\", {\r\n                \"submit_handler\": data\r\n            });\r\n}\r\n}catch(err){}\r\n     }\r\nelse\r\n{\r\nwindow.cv_block_ref.individual_updated(data.arrayIds, data.form);\r\n}\r\n\r\n    }"
  },
  {
    id: 'PBXMCbREHU18o',
    type: 'js',
    next: {
      success: 'PBX0JNfCDNibE'
    },
    nodename: 'JS code failure',
    code: "function(data,ui){\r\nui.$bvModal.hide('bv-modal-example');\r\n\r\n}"
  },
  {
    id: 'PBXLC0RTrGeTT',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'PBXlh0tUGqdSh'
    },
    nodename: 'Ajax call to get tags',
    url: '{{{get_url}}}{{{where}}}',
    method: 'get',
    jsonp: 'false',
    data: '.',
    var: 'resp',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  },
  {
    id: 'PBXKnfrn4ygt3',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert Added sucessfully',
    title: 'Added sucessfully',
    message: 'Added sucessfully'
  },
  {
    id: 'PBX0JNfCDNibE',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert Falied to Add',
    title: 'Failed to Add',
    message: 'Duplicate Entry'
  },
  {
    id: 'PBXNPsCfgtrPv',
    type: 'validate',
    next: {
      success: 'PBXbskgDOxcVA',
      failure: 'PBXSo7PUQqCwH'
    },
    nodename: 'Validate',
    form_id: ''
  },
  {
    id: 'PBXSo7PUQqCwH',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'Failed validation',
    message: 'Please fill the required fields'
  },
  {
    id: 'PBXbskgDOxcVA',
    type: 'js',
    next: {
      success: 'PBXkcUuzu6TIv'
    },
    nodename: 'JS code',
    code: 'function(data,ui){\r\ndata.is_removetag=data.handlerParams.type=="delete_tag"?0:1;\r\n\r\n}'
  },
  {
    id: 'PBXkcUuzu6TIv',
    type: 'if_condition',
    next: {
      success: 'PBXb38e6bxUgu',
      failure: 'PBXCtTH3mI31S'
    },
    nodename: 'If Condition',
    if_type: 'value',
    variable1: '{{is_removetag}}',
    comparator: '!=',
    variable2: '0'
  },
  {
    id: 'PBXCtTH3mI31S',
    type: 'js',
    next: {
      success: 'PBXFKGs8qVbIN'
    },
    nodename: 'JS code',
    code: 'function(data,ui){\r\n\r\n\r\n data.delete_url=get_region_url(get_app(),data.handlerParams.tag_remove_url+data.form.tags.toString()+"?ids="+window.tableref.id.toString());\r\n}'
  },
  {
    id: 'PBXFKGs8qVbIN',
    type: 'ajax',
    next: {
      failure: 'PBXIRrq9P39sT',
      success: 'PBXh1A4ygEF5Q'
    },
    nodename: 'Ajax',
    url: '{{{delete_url}}}',
    method: 'delete',
    data: '.',
    var: 'delete_res',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  },
  {
    id: 'PBXh1A4ygEF5Q',
    type: 'js',
    next: {
      success: 'PBXNX6mCVB4VS'
    },
    nodename: 'JS code',
    // eslint-disable-next-line no-template-curly-in-string
    code: "function(data,ui){\r\n  ui.$bvModal.hide('bv-modal-example');\r\n ui.$parent.after_delete(data.form,ui);\r\n data.template_params= {};\r\n                data.is_updateFor=1;\r\n              data.url = `${cv_block_ref.getUrl}?w=id in (${window.tableref.id.toString()})`;\r\n            ui.start(\"get_data_after_submit\", {\r\n                \"submit_handler\": data\r\n            });\r\n}"
  },
  {
    id: 'PBXXTKkZ9ON4M',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'No tag exists ',
    message: 'No tag exists '
  },
  {
    id: 'PBXNX6mCVB4VS',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'Sucess',
    message: 'Sucess'
  },
  {
    id: 'PBXIRrq9P39sT',
    type: 'js',
    next: {
      success: 'PBXXTKkZ9ON4M'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n  ui.$bvModal.hide('bv-modal-example');\r\n}"
  }
  ]
}

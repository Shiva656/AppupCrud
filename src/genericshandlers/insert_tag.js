export var insertTag = {
  id: 'insert_tag',
  triggerName: 'insert tag ',
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
    id: 'PBXNPsCfgtrPv',
    type: 'validate',
    next: {
      success: 'PBXAdr976Ng2L',
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
    id: 'PBXAdr976Ng2L',
    type: 'js',
    next: {
      success: 'PBX4uwTpnaRyk'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n debugger; try {\r\n      ui.$parent.formJson.buttons[0].disabled=true;} catch (err) { } \r\n try{\r\nui.$parent.before_add_tag(data.form,ui);\r\n}catch(err){}\r\ndata.post_url=data.handlerParams.tag_tb;\r\n    data.is_multi_insert = data.post_url.includes(\"v2/\") ? 0 : data.post_url.includes('c/g') ? 0 : 1;\r\n var obj = data.is_multi_insert ? data.form : { \"data\": Array.isArray(data.form) ? data.form : [data.form] };\r\n  data.obj = JSON.stringify(obj);\r\n}"
  },
  {
    id: 'PBX4uwTpnaRyk',
    type: 'ajax',
    next: {
      failure: 'PBXyadt5nPWAC',
      success: 'PBXoi6Di271qD'
    },
    nodename: 'Ajax',
    url: '{{#if post_url}}{{{post_url}}}{{/if}}',
    method: 'post',
    jsonp: 'false',
    data: '{{{obj}}}',
    var: 'result',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      'Content-Type': 'application/json'
    }]
  },
  {
    id: 'PBXoi6Di271qD',
    type: 'js',
    next: {
      success: 'PBXDiiPopEwXs'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n\r\nvar tagData=ui.$parent.fields?ui.$parent.fields:'';\r\nif(ui.$route.meta.isSlideout){\r\ntagData=[{id:eval(data.route.params.id)}]\r\n}\r\nvar fields_obj=Array.isArray(tagData)?tagData:[tagData];\r\ndata.id='';\r\nvar z=[];\r\nfields_obj.forEach(item=>{\r\ndata.id+=item.id+',';\r\nlet obj={};\r\nobj[data.handlerParams.pc1]=data.result.data[0].GENERATED_KEY+'';\r\nobj[data.handlerParams.pc2]=item['id']+'';\r\nz.push(obj);\r\n});\r\n var obj =  { \"data\": Array.isArray(z) ? z : [z] };\r\n  data.obj = JSON.stringify(obj);\r\ndata.post_url=data.handlerParams.parent_tb;\r\n//\"https://siterecording.qa.500apps.io/\"+\r\ndata.id=data.id.substring(0,data.id.length-1);\r\n}"
  },
  {
    id: 'PBXDiiPopEwXs',
    type: 'ajax',
    next: {
      failure: 'PBXyadt5nPWAC',
      success: 'PBXEqps81dXTT'
    },
    nodename: 'Ajax',
    url: '{{#if post_url}}{{{post_url}}}{{/if}}',
    method: 'post',
    jsonp: 'false',
    data: '{{{obj}}}',
    var: 'result1',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      'Content-Type': 'application/json'
    }]
  },
  {
    id: 'PBXEqps81dXTT',
    type: 'js',
    next: {
      success: 'PBXiUTmFxuiCk'
    },
    nodename: 'JS code',
    // eslint-disable-next-line no-template-curly-in-string
    code: 'function(data,ui){\r\n try{\r\n    ui.$parent.after_add_tag(data.obj,ui);\r\n    }catch(err){}\r\n//https://siterecording.qa.500apps.io/\r\ndata.get_url=`v2/${ui.$route.params.entity}?w=id in (${data.id})`;\r\n}'
  },
  {
    id: 'PBXiUTmFxuiCk',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'PBXcNvVN8Atb7'
    },
    nodename: 'Ajax',
    url: '{{{get_url}}}',
    method: 'get',
    jsonp: 'false',
    data: ' ',
    var: 'get_json',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  },
  {
    id: 'PBXcNvVN8Atb7',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\nwindow.cv_block_ref.updateUi('update',data.get_json.data);\r\nui.start('alert',{message:'Added sucessfully',title:'success'});\r\nwindow.cv_block_ref.$refs['view_component_ref'].$refs[window.cv_block_ref.componentRef].selected=[];\r\nui.$bvModal.hide(\"bv-modal-example\")?ui.$bvModal.hide(\"bv-modal-example\"):ui.$bvModal.hide(ui.$parent.modalRef);\r\n//ui.$bvModal.hide('bv-modal-example');\t\r\n}"
  },
  {
    id: 'PBXyadt5nPWAC',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'Failed',
    message: 'Falied to insert...!'
  }
  ]
}

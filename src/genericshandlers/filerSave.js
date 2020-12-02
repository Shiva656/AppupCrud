export var filterSaveHandler = {
  id: 'filter_save',
  triggerName: 'to save filter condition',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXB41TTQOvO2'
    }
  }, {
    id: 'PBXB41TTQOvO2',
    type: 'js',
    next: {
      success: 'PBXdcn5Ec9VTd'
    },
    nodename: 'JS code',
    code: 'function(data,ui)\r\n{\r\ndebugger;\r\ndata.url=ui.$parent.url;\r\ndata.form.conditions=JSON.stringify(ui.$parent.fields);\r\n try {\r\n        data.form = ui.$parent.before_save_filter(data.form, ui);\r\n    } catch (err) { }\r\nvar obj={"data":[data.form]};\r\ndata.obj=JSON.stringify(obj);\r\n}'
  }, {
    id: 'PBXdcn5Ec9VTd',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'PBXhaM9BTKKiE'
    },
    nodename: 'Ajax',
    url: '{{{url}}}',
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
  }, {
    id: 'PBXhaM9BTKKiE',
    type: 'js',
    next: {
      success: 'PBX6CWMtbB7SP'
    },
    nodename: 'JS code',
    code: 'function(data,ui)\r\n{\r\ndebugger;\r\n try {\r\n        ui.$parent.after_save_filter(data.form, ui);\r\n    } catch (err) { }\r\nui.$parent.$parent.$parent.$parent.$parent.$bvModal.hide("bv-modal-example");\r\n\tif(window.cv_block_ref.$refs.navbar_filter_ref  && window.cv_block_ref.$refs.navbar_filter_ref .$refs.vertical_saved_filter_ref){\r\nvar url=window.cv_block_ref.$refs.navbar_filter_ref .$refs.vertical_saved_filter_ref.formJson.fields[0].url\r\nwindow.cv_block_ref.$refs.navbar_filter_ref .$refs.vertical_saved_filter_ref.formJson.fields[0].url="";\r\nsetTimeout(function(){ \r\nwindow.cv_block_ref.$refs.navbar_filter_ref .$refs.vertical_saved_filter_ref.formJson.fields[0].url=url;\r\n }, 2000);\r\n\r\n\r\n}\r\n}'
  }, {
    id: 'PBX6CWMtbB7SP',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: '',
    message: 'Filter Saved',
    variant: 'success',
    duration: '4000'
  }]
}

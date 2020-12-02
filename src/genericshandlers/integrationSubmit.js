/* eslint-disable no-template-curly-in-string */
export var integrationSubmitHandler = {
  id: 'integration_submit',
  triggerName: 'null',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXt1Q49fTX2x'
    }
  }, {
    id: 'PBXNT60kDBs5k',
    type: 'js',
    next: {
      success: 'PBXCEaL6qeaNB'
    },
    nodename: 'JS code',
    code:
     'function(data,ui){\r\nvar obj={};\r\nobj.app_fields=JSON.stringify(data.form);\r\nobj.integration_id=window.integration_id;\r\ndata.app_name = get_app();\r\ndata.obj=JSON.stringify(obj);\r\ndata.host_url=`https://my.${getRegion()}.500apps.io/p/`\r\n}',
  }, {
    id: 'PBXCEaL6qeaNB',
    type: 'ajax',
    next: {
      failure: 'PBXFh6ZErA6DP',
      success: 'PBXNfSf5PCUkt'
    },
    nodename: 'Ajax',
    url: '{{{host_url}}}{{{app_name}}}',
    method: 'post',
    jsonp: 'false',
    data: '{{{obj}}}',
    var: 'output',
    data_params: [{}],
    headers: [{
      Accept: 'text/plain',
      'Content-Type': 'application/json'
    }]
  }, {
    id: 'PBXSZvkFTChEl',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'Success',
    message: 'Authenticated Successfully',
    variant: 'primary',
    duration: '2001'
  }, {
    id: 'PBXNfSf5PCUkt',
    type: 'js',
    next: {
      success: 'PBXSZvkFTChEl'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\nui.form={};\r\nui.$bvModal.hide('integrationModel');\r\nui.$parent.$parent.resultData();\r\n}"
  }, {
    id: 'PBXirPM6KyP0t',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'Fail',
    message: 'Please enter a valid Details',
    variant: 'primary',
    duration: '2000'
  }, {
    id: 'PBXt1Q49fTX2x',
    type: 'validate',
    next: {
      success: 'PBXNT60kDBs5k',
      failure: 'hangup'
    },
    nodename: 'Validate',
    form_id: ''
  }, {
    id: 'PBXFh6ZErA6DP',
    type: 'js',
    next: {
      success: 'PBXirPM6KyP0t'
    },
    nodename: 'JS code',
    code: 'function(data,ui){\r\nui.form={}\r\n}'
  }]
}

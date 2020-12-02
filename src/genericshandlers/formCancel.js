export var formCancelHandler = {
  id: 'form_cancel',
  triggerName: 'form_cancel',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXLnAaQtfHa8'
    }
  }, {
    id: 'PBXLnAaQtfHa8',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n // For active tab in dynamic tabs \r\n window._isRouteBack = true;\r\nlet modal_id='bv-modal-example';\r\nif((data.handlerParams||{}).modal_id){modal_id=data.handlerParams.modal_id;    } \r\n    try{\r\n    (ui.$parent.hideFromBlock && ui.$parent.hideFromBlock === 'true')?ui.$parent.hideEmalForm():'';\r\n    }catch(e){}\r\n    var key=props_from_params(data.route.params.template_params);\r\n    if((key.k==\"ff\" || key.gb=='t') && !((data.handlerParams || {}).modal)){\r\n       ui.$router.go(-1);\r\n    }else{\r\nui.$bvModal.hide(modal_id)?ui.$bvModal.hide(modal_id):ui.$bvModal.hide(ui.$parent.modalRef);\r\n/*(ui.$parent.toggle_id==0)?ui.$parent.toggle_form(1):ui.$bvModal.hide(\"bv-modal-example\")?ui.$bvModal.hide(\"bv-modal-example\"):ui.$bvModal.hide(ui.$parent.modalRef);*/\r\n// ui.$parent.$parent.$parent.hide();\r\n   \r\n    }\r\n    }"
  }]
}

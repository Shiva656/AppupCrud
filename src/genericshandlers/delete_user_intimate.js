export var deleteUserIntimateHandler = {
  id: 'delete_user_intimate',
  triggerName: 'delete_user_intimate',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXDgo9WfuPxV'
    }
  }, {
    id: 'PBXNGCc0GusiC',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'PBXKF62Ky94Vd'
    },
    nodename: 'insert themes',
    url: '{{{ui_json.cors}}}?url={{{encodeUrl}}}',
    method: 'put',
    jsonp: 'false',
    data: ' theme={{{form_data}}}&where=id={{domain_user_id}}',
    var: 'output',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBX9lNT2q41xR',
    type: 'js',
    next: {
      success: 'PBXNGCc0GusiC'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n\r\ndata.form_data=JSON.stringify(data.form);\r\ndata.domain_user_id=window['500apps-user_id'];\r\n\r\nvar Url='{{ui_json.db}}'+'/domain_user';\r\n\r\n\r\ndata.encodeUrl= encodeURIComponent(Url);\r\n\r\n}"
  }, {
    id: 'PBXwU8PC7tqfh',
    type: 'alert',
    next: {
      success: 'hangup'
    },
    nodename: 'Alert',
    title: 'Success',
    message: 'Successfully Saved!'
  }, {
    id: 'PBXQpbLEqOf3m',
    type: 'if_condition',
    next: {
      success: 'PBXd8wk9q3Kqw',
      failure: 'hangup'
    },
    nodename: 'If Condition',
    if_type: 'value',
    variable1: 'data.condition',
    comparator: '<',
    variable2: "'get'"
  }, {
    id: 'PBXnl9Q2DOWC1',
    type: 'ajax',
    next: {
      failure: 'hangup',
      success: 'hangup'
    },
    nodename: 'Ajax',
    url: '{{{ui_json.cors}}}?url={{{encodeUrl}}}',
    method: 'get',
    jsonp: 'false',
    data: '.',
    var: 'output',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBXd8wk9q3Kqw',
    type: 'js',
    next: {
      success: 'PBXnl9Q2DOWC1'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n\r\nvar Url='{{ui_json.db}}'+'/domain_user';\r\n\r\n\r\ndata.encodeUrl= encodeURIComponent(Url);\r\n\r\n}"
  }, {
    id: 'PBXKF62Ky94Vd',
    type: 'js',
    next: {
      success: 'PBXwU8PC7tqfh'
    },
    nodename: 'set into local storge',
    // eslint-disable-next-line no-template-curly-in-string
    code: 'function(data,ui){\r\nlocalStorage.setItem("t_item", data.form_data);\r\n var d = new Date();\r\nd.setMonth(d.getMonth() + 1);\r\n;document.cookie = `_g_th=${btoa(data.form_data)};path=/;domain=.500apps.io;expires=${d.toUTCString()};`\r\nconst res=get_app();\r\nif (window.menuJson[res]) {\r\n        let layoutNumber;\r\n        let layoutNumber2;\r\n        if (window.localStorage.t_item) {\r\n          const ob = typeof window.localStorage.t_item === "string" ? JSON.parse(window.localStorage.t_item) : window.localStorage.t_item;\r\n          layoutNumber = ob.positions === "left" ? "2" : ob.positions === "top" ? "0" : "";\r\n          layoutNumber2 = layoutNumber === "2" ? "3" : "1";\r\n        }\r\n  window.menuJson[res].forEach(item => {\r\n          const obj = item.link_to.split("/");\r\n   if (layoutNumber) {\r\n            obj[3] = obj[3] === "2" || obj[3] === "0" ? layoutNumber : layoutNumber2;\r\n          }\r\n          item.link_to = obj.join("/");\r\n        });\r\n}}'
  }, {
    id: 'PBX0pTxKfveVm',
    type: 'js',
    next: {
      success: 'PBXqD7WCQ3vM7'
    },
    nodename: 'JS code',
    code: 'function(data,ui){\r\nvar reset={"themeColor": "#040558",\r\n"MenuMode": "text",\r\n"MenuStyle": "compact",\r\n"body": "#FFFFFF",\r\n"font": "robo",\r\n"fontsize": "a",\r\n"positions":"left",\r\n"screens": "fullscreen",\r\n"MenuColor": "#040558"\r\n};\r\nvar reset_strinify=JSON.stringify(reset)\r\n\r\ndata.val=JSON.parse(reset_strinify);\r\n\r\n\r\ndata.theme_Val={...data.val};\r\n}'
  }, {
    id: 'PBXDgo9WfuPxV',
    type: 'if_condition',
    next: {
      success: 'PBX0pTxKfveVm',
      failure: 'PBX9lNT2q41xR'
    },
    nodename: 'If Condition',
    if_type: 'value',
    variable1: 'data.key',
    comparator: '==',
    variable2: "'preloadTheme'"
  }, {
    id: 'PBXqD7WCQ3vM7',
    type: 'js',
    next: {
      success: 'PBXXQPTILPiIc'
    },
    nodename: 'JS code',
    code: "function(data, ui) {\r\n   \r\n  var themes = data.theme_Val;\r\n   \r\n\r\n    var body = document.body;\r\n\r\n    try {\r\n        // For font-size a++\r\n        if (themes.hasOwnProperty('fontsize')) {\r\n            if (themes.fontsize == \"a-\") {\r\n                body.classList.add(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"a\") {\r\n                body.classList.add(\"medium-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"A\") {\r\n                body.classList.add(\"big-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n            } else {}\r\n        }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// For screens\r\nif(themes.hasOwnProperty('screens')){\r\nif((themes.screens) == 'compactscreen'){\r\nbody.classList.remove(\"full-mode\");\r\nbody.classList.add(\"compact-mode\");\r\n} \r\nif((themes.screens) == 'fullscreen'){\r\nbody.classList.remove(\"compact-mode\");\r\nbody.classList.add(\"full-mode\");\r\n}\r\n}\r\n\r\n\r\n//Positions\r\n    if(themes.hasOwnProperty('positions')){\r\n    var layout;\r\n      if(themes.positions=='left'){\r\n       (ui.$route.params.layout==2 || ui.$route.params.layout==3 || ui.$route.params.layout==4)?(layout=ui.$route.params.layout):(layout=Number(ui.$route.params.layout)+2)\r\n            } else if(themes.positions=='top'){\r\n       (ui.$route.params.layout==0 || ui.$route.params.layout==1 || ui.$route.params.layout==4)?(layout=ui.$route.params.layout):(layout=Number(ui.$route.params.layout)-2)\r\n                     }else{\r\n                         layout=ui.$route.params.layout}\r\n    if(ui.$route.params.layout != layout)\r\n    {\r\n       ui.$router.push({ params: { layout: layout } });\r\n //          var lay_out=window.location.href.split('#')[1].split('/');\r\n    \r\n   // lay_out[3]=layout;\r\n    //var arry1=lay_out.join('/');\r\n   // window.location.href=window.location.href.split('#')[0]+'#'+arry1;\r\n     }\r\n    }\r\n\r\n\r\n\r\n//MenuColor\r\n        if (themes.hasOwnProperty('MenuColor')) {\r\n            let colorpicker = { \r\n                \"#0D3999\": \"{\\\"#0f4880\\\":\\\"menu-color1\\\",\\\"#0c3a66\\\":\\\"menu-color2\\\",\\\"#092b4d\\\":\\\"menu-color3\\\",\\\"#061d33\\\":\\\"menu-color4\\\"}\",\r\n                \"#9437c3\": \"{\\\"#601b9f\\\":\\\"menu-color1\\\",\\\"#3b0954\\\":\\\"menu-color2\\\",\\\"#411470\\\":\\\"menu-color3\\\",\\\"#3c4a94\\\":\\\"menu-color4\\\"}\",\r\n                \"#009933\": \"{\\\"#19461A\\\":\\\"menu-color1\\\",\\\"#486A47\\\":\\\"menu-color2\\\",\\\"#385E3C\\\":\\\"menu-color3\\\",\\\"#24562B\\\":\\\"menu-color4\\\"}\",\r\n                \"#000000\": \"{\\\"#999999\\\":\\\"menu-color1\\\",\\\"#777777\\\":\\\"menu-color2\\\",\\\"#555555\\\":\\\"menu-color3\\\",\\\"#333333\\\":\\\"menu-color4\\\",\\\"#111111\\\":\\\"menu-color5\\\"}\"\r\n\r\n            }\r\n\r\n\r\n             document.body.classList.forEach(item => {\r\n\r\nif(item.includes('menu-color')){\r\n    document.body.classList.remove(item)\r\n    }\r\n                    \r\n                });\r\nvar parse_val={};\r\n       // colorpicker loop    \r\n            for (var key in colorpicker) {\r\n\r\n\r\n if(themes.themeColor==key){\r\n parse_val=JSON.parse( colorpicker[key]);\r\n for( var  menu in  parse_val )  {\r\n     if(menu==themes.MenuColor){\r\n                 document.body.classList.add(parse_val[menu]);\r\n     }\r\n }\r\n\r\n            }\r\n\r\n\r\n            \r\n            }\r\n\r\n}\r\n   //BodyMode\r\n        if (themes.hasOwnProperty('MenuMode')) {\r\n            let obj = ['text', 'icon'];\r\n            for (var key in obj) {\r\n                document.body.classList.remove(obj[key]);\r\n            }\r\n            document.body.classList.add(themes.MenuMode);\r\n        }\r\n\r\n\r\n//Menustyle\r\nif(themes.hasOwnProperty('MenuStyle')){\r\nif((themes.MenuStyle) == 'compact'){\r\nbody.classList.remove(\"relaxed\");\r\nbody.classList.add(\"compact\");\r\n} \r\nif((themes.MenuStyle) == 'relaxed'){\r\nbody.classList.remove(\"compact\");\r\nbody.classList.add(\"relaxed\");\r\n}\r\n}\r\n//bodyColor\r\n        if (themes.hasOwnProperty('body')) {\r\n            let colorpicker = { \r\n                \"#808080\": \"body-grey\",\r\n            \r\n                \"#FFFFFF\": \"body-white\"\r\n               \r\n            }\r\n            for (var key in colorpicker) {\r\n                document.body.classList.forEach(item => {\r\n                    if (item == colorpicker[key]) {\r\n                        document.body.classList.remove(item);\r\n                    }\r\n                });\r\n            }\r\n            document.body.classList.add(colorpicker[themes.body]);\r\n        }\r\n       \r\n\r\n// For Font   font: \"robo\"\r\nif(themes.hasOwnProperty('font')){\r\nif((themes.font) == 'robo'){\r\nbody.classList.remove(\"opensans\");\r\nbody.classList.remove(\"lato\");\r\nbody.classList.add(\"robo\");\r\n} \r\nif((themes.font) == 'opensans'){\r\nbody.classList.remove(\"robo\");\r\nbody.classList.remove(\"lato\");\r\nbody.classList.add(\"opensans\");\r\n}\r\nif((themes.font) == 'lato'){\r\nbody.classList.remove(\"robo\");\r\nbody.classList.remove(\"opensans\");\r\nbody.classList.add(\"lato\");\r\n}\r\n}\r\n\r\n\r\n\r\n\r\n    } catch (e) {\r\n\r\n   \r\n    }\r\n}"
  }, {
    id: 'PBXQar1gEU8yp',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\n\r\n var themes = data.theme_Val;\r\n   \r\n\r\n    var body = document.body;\r\n\r\n  //ThemeColor\r\n        if (themes.hasOwnProperty('themeColor')) {\r\n            let colorpicker = { \r\n                \"#0D3999\": \"blue3\",\r\n                \"#9437c3\": \"purple3\",\r\n                \"#009933\": \"green3\",\r\n                \"#000000\": \"dark2\"\r\n            }\r\n            for (var key in colorpicker) {\r\n                    if (themes.themeColor== key) {\r\n                    if(!document.getElementById('themes')) {\r\n    var link = document.createElement('link');\r\n    link.id = 'themes';\r\n    link.rel = 'stylesheet';\r\n    link.href = 'https://cdn.500apps.io/css/'+colorpicker[key]+'.css';\r\n    document.head.appendChild(link);\r\n}else{\r\nvar cdnLink=document.getElementById(\"themes\");\r\ncdnLink.href='https://cdn.500apps.io/css/'+colorpicker[key]+'.css'\r\n}\r\n                    }\r\n             \r\n            }\r\n  \r\n        }\r\n\r\n\r\n     \r\n}"
  }, {
    id: 'PBXXQPTILPiIc',
    type: 'js',
    next: {
      success: 'PBXQar1gEU8yp'
    },
    nodename: 'JS code',
    code: "function(data, ui) {\r\n   \r\n  var themes = data.theme_Val;\r\n   \r\n\r\n    var body = document.body;\r\n\r\n    try {\r\n        // For font-size a++\r\n        if (themes.hasOwnProperty('fontsize')) {\r\n            if (themes.fontsize == \"a-\") {\r\n                body.classList.add(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"a\") {\r\n                body.classList.add(\"medium-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"A\") {\r\n                body.classList.add(\"big-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n            } else {}\r\n        }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// For screens\r\nif(themes.hasOwnProperty('screens')){\r\nif((themes.screens) == 'compactscreen'){\r\nbody.classList.remove(\"full-mode\");\r\nbody.classList.add(\"compact-mode\");\r\n} \r\nif((themes.screens) == 'fullscreen'){\r\nbody.classList.remove(\"compact-mode\");\r\nbody.classList.add(\"full-mode\");\r\n}\r\n}\r\n\r\n//Positions\r\n    if(themes.hasOwnProperty('positions')){\r\n    var layout;\r\n      if(themes.positions=='left'){\r\n       (ui.$route.params.layout==2 || ui.$route.params.layout==3 ||  ui.$route.params.layout==4)?(layout=ui.$route.params.layout):(layout=Number(ui.$route.params.layout)+2)\r\n            } else if(themes.positions=='top'){\r\n       (ui.$route.params.layout==0 || ui.$route.params.layout==1 ||  ui.$route.params.layout==4)?(layout=ui.$route.params.layout):(layout=Number(ui.$route.params.layout)-2)\r\n                     }else{\r\n                         layout=ui.$route.params.layout}\r\n    if(ui.$route.params.layout != layout)\r\n    {\r\n       ui.$router.push({ params: { layout: layout } });\r\n //          var lay_out=window.location.href.split('#')[1].split('/');\r\n    \r\n   // lay_out[3]=layout;\r\n    //var arry1=lay_out.join('/');\r\n   // window.location.href=window.location.href.split('#')[0]+'#'+arry1;\r\n     }\r\n    }\r\n\r\n\r\n\r\n//MenuColor\r\n        if (themes.hasOwnProperty('MenuColor')) {\r\n          let colorpicker = { \r\n                \"#040558\": \"{\\\"#040558\\\":\\\"menu-color1\\\",\\\"#020698\\\":\\\"menu-color2\\\",\\\"#1A49BE\\\":\\\"menu-color3\\\",\\\"#193475\\\":\\\"menu-color4\\\",\\\"#EFF1F5\\\":\\\"menu-color5\\\"}\",\r\n                \"#3E0B7D\": \"{\\\"#3E0B7D\\\":\\\"menu-color1\\\",\\\"#432768\\\":\\\"menu-color2\\\",\\\"#320E42\\\":\\\"menu-color3\\\",\\\"#261543\\\":\\\"menu-color4\\\",\\\"#F3EEFC\\\":\\\"menu-color5\\\"}\",\r\n                \"#1B023D\": \"{\\\"#1B023D\\\":\\\"menu-color1\\\",\\\"#342446\\\":\\\"menu-color2\\\",\\\"#271413\\\":\\\"menu-color3\\\",\\\"#391C28\\\":\\\"menu-color4\\\",\\\"#FFF4F3\\\":\\\"menu-color5\\\"}\",\r\n                \"#293145\": \"{\\\"#284182\\\":\\\"menu-color1\\\",\\\"#400F40\\\":\\\"menu-color2\\\",\\\"#1C4CC3\\\":\\\"menu-color3\\\",\\\"#293145\\\":\\\"menu-color4\\\",\\\"#1E0A3A\\\":\\\"menu-color5\\\"}\"\r\n\r\n            }\r\n\r\n\r\n             document.body.classList.forEach(item => {\r\n\r\nif(item.includes('menu-color')){\r\n    document.body.classList.remove(item)\r\n    }\r\n                    \r\n                });\r\nvar parse_val={};\r\n       // colorpicker loop    \r\n            for (var key in colorpicker) {\r\n\r\n\r\n if(themes.themeColor==key){\r\n parse_val=JSON.parse( colorpicker[key]);\r\n for( var  menu in  parse_val )  {\r\n     if(menu==themes.MenuColor){\r\n                 document.body.classList.add(parse_val[menu]);\r\n     }\r\n }\r\n\r\n            }\r\n\r\n\r\n            \r\n            }\r\n\r\n}\r\n   //BodyMode\r\n        if (themes.hasOwnProperty('MenuMode')) {\r\n            let obj = ['text', 'icon'];\r\n            for (var key in obj) {\r\n                document.body.classList.remove(obj[key]);\r\n            }\r\n            document.body.classList.add(themes.MenuMode);\r\n        }\r\n\r\n\r\n//Menustyle\r\nif(themes.hasOwnProperty('MenuStyle')){\r\nif((themes.MenuStyle) == 'compact'){\r\nbody.classList.remove(\"relaxed\");\r\nbody.classList.add(\"compact\");\r\n} \r\nif((themes.MenuStyle) == 'relaxed'){\r\nbody.classList.remove(\"compact\");\r\nbody.classList.add(\"relaxed\");\r\n}\r\n}\r\n//bodyColor\r\n        if (themes.hasOwnProperty('body')) {\r\n            let colorpicker = { \r\n                \"#808080\": \"body-grey\",\r\n            \r\n                \"#FFFFFF\": \"body-white\"\r\n               \r\n            }\r\n            for (var key in colorpicker) {\r\n                document.body.classList.forEach(item => {\r\n                    if (item == colorpicker[key]) {\r\n                        document.body.classList.remove(item);\r\n                    }\r\n                });\r\n            }\r\n            document.body.classList.add(colorpicker[themes.body]);\r\n        }\r\n       \r\n\r\n// For Font   font: \"robo\"\r\nif(themes.hasOwnProperty('font')){\r\nif((themes.font) == 'robo'){\r\nbody.classList.remove(\"opensans\");\r\nbody.classList.remove(\"lato\");\r\nbody.classList.add(\"robo\");\r\n} \r\nif((themes.font) == 'opensans'){\r\nbody.classList.remove(\"robo\");\r\nbody.classList.remove(\"lato\");\r\nbody.classList.add(\"opensans\");\r\n}\r\nif((themes.font) == 'lato'){\r\nbody.classList.remove(\"robo\");\r\nbody.classList.remove(\"opensans\");\r\nbody.classList.add(\"lato\");\r\n}\r\n}\r\n\r\n\r\n\r\n\r\n    } catch (e) {\r\n\r\n    \r\n    }\r\n}"
  }]
};

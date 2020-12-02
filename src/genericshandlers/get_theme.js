/* eslint-disable no-template-curly-in-string */
export var getThemehandler = {
  id: 'get_themes',
  triggerName: 'get_themes',
  workflow: [{
    id: '1',
    type: 'start',
    next: {
      success: 'PBXweq724bz5x'
    }
  }, {
    id: 'PBXTucNTXZozb',
    type: 'js',
    next: {
      success: 'PBXNXVtdNdHTDss'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\nvar cookie=getCookie('_g_th')\r\nif(cookie){\r\nvar decodedCookie=atob(cookie);\r\nvar parseVal=typeof JSON.parse(decodedCookie) === 'object'?decodedCookie:JSON.parse(decodedCookie);\r\nvar parseVal1=JSON.parse(parseVal);\r\n\r\n\r\nlocalStorage.setItem(\"t_item\", parseVal);\r\ndata.theme_Val=parseVal1;\r\n data.allow ='true'\r\n\r\n\r\n}else{\r\n\r\ndata.user_id= parseJwt(getCookie(window.UIJSON.token)).user_id;\r\n\r\nvar url='{{ui_json.db}}'+'/domain_user?fields=theme&where=id='+data.user_id;\r\n//var url='{{ui_json.db}}'+'/domain_user?fields=theme&where=id='+6560;\r\n\r\ndata.urlEncoded=encodeURIComponent(url);\r\n data.allow ='false';}\r\n\r\n}\r\n"
  },
  {
    id: 'PBXx9ZMGr62NL',
    type: 'js',
    next: {
      success: 'PBXhbEsKOIDIU'
    },
    nodename: 'setting from local',
    code: "function(data,ui){\r\n\r\ndata.theme_Val=JSON.parse(localStorage.getItem('t_item'));\r\n\r\n}\r\n  \r\n\r\n\r\n"
  }, {
    id: 'PBXZd1nq7rhgM',
    type: 'if_condition',
    next: {
      success: 'PBXx9ZMGr62NL',
      failure: 'PBXmbvZlhpiIJ'
    },
    nodename: 'If Condition',
    if_type: 'value',
    variable1: 'data.key',
    comparator: '==',
    variable2: "'local'"
  }, {
    id: 'PBXX4TdqZNZXs',
    type: 'ajax',
    next: {
      failure: 'PBX9iWfytWMkH',
      success: 'PBX9iWfytWMkH'
    },
    nodename: 'Ajax',
    url: '{{ui_json.cors}}?url={{{urlEncoded}}}',
    method: 'get',
    jsonp: 'false',
    data: ' .',
    var: 'output',
    data_params: [{
      name: 'value'
    }],
    headers: [{
      Accept: 'text/plain'
    }]
  }, {
    id: 'PBXrCPTVmy1IX',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'Reset JS code',
    code: '\r\nfunction(data,ui){\r\n\r\nui.formFields=ui.$parent.form_fields.fields;\r\nui.buttons=ui.$parent.form_fields.buttons;\r\nvar reset={"themeColor": "#9437c3",\r\n"MenuMode": "text",\r\n"MenuStyle": "compact",\r\n"body": "#FFFFFF",\r\n"font": "robo",\r\n"fontsize": "a",\r\n"positions": "left",\r\n"screens": "fullscreen",\r\n"MenuColor": "#601b9f"\r\n};\r\ndata.val=JSON.parse(JSON.stringify(reset))\r\n\r\n//localStorage.removeItem("t_item");\r\n\r\n\r\ndata.theme_Val=data.val;\r\nreturn data\r\n}'
  }, {
    id: 'PBXaTOrWHvn0u',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'runtime JS code',
    code: 'function(data,ui){\r\n\r\nui.formFields=ui.$parent.form_fields.fields;\r\nui.buttons=ui.$parent.form_fields.buttons;\r\nvar localVal = localStorage.getItem("t_item");\r\nif(localVal=="null"|| localVal=="" || localVal==null){\r\nvar reset={"themeColor": "#1A49B9",\r\n"MenuMode": "text",\r\n"MenuStyle": "compact",\r\n"body": "#FFFFFF",\r\n"font": "robo",\r\n"fontsize": "a",\r\n"positions": "left",\r\n"screens": "fullscreen",\r\n"MenuColor": "#040558"\r\n};\r\nvar reset_strinify=JSON.stringify(reset)\r\n\r\ndata.val=JSON.parse(reset_strinify);\r\n//data.val=JSON.parse(reset);\r\n}else{\r\ndata.val=JSON.parse(localVal);\r\n\r\n\r\n\r\n}\r\n\r\n\r\ndata.theme_Val={...data.val};\r\nui.form=data.val\r\n//window.themeBlock.form=data.val;\r\nreturn data\r\n}'
  }, {
    id: 'PBXC6JtcTeFtT',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data, ui) {\r\n\r\n  var themes = data.theme_Val;\r\n   \r\n\r\n    var body = document.body;\r\n\r\n    try {\r\n        // For font-size a++\r\n        if (themes.hasOwnProperty('fontsize')) {\r\n            if (themes.fontsize == \"a-\") {\r\n                body.classList.add(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"a\") {\r\n                body.classList.add(\"medium-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"A\") {\r\n                body.classList.add(\"big-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n            } else {}\r\n        }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// For screens\r\nif(themes.hasOwnProperty('screens')){\r\nif((themes.screens) == 'compactscreen'){\r\nbody.classList.remove(\"full-mode\");\r\nbody.classList.add(\"compact-mode\");\r\n} \r\nif((themes.screens) == 'fullscreen'){\r\nbody.classList.remove(\"compact-mode\");\r\nbody.classList.add(\"full-mode\");\r\n}\r\n}\r\n\r\n\r\n//Positions\r\n    if(themes.hasOwnProperty('positions')){\r\n    var layout;\r\n      if(themes.positions=='left'){\r\n       (ui.$route.params.layout==2 || ui.$route.params.layout==3 ||  ui.$route.params.layout==4)?(layout=ui.$route.params.layout):(layout=Number(ui.$route.params.layout)+2)\r\n            } else if(themes.positions=='top'){\r\n       (ui.$route.params.layout==0 || ui.$route.params.layout==1 ||  ui.$route.params.layout==4)?(layout=ui.$route.params.layout):(layout=Number(ui.$route.params.layout)-2)\r\n                     }else{\r\n                         layout=ui.$route.params.layout}\r\n    if(ui.$route.params.layout != layout)\r\n    {\r\n       ui.$router.push({ params: { layout: layout } });\r\n //          var lay_out=window.location.href.split('#')[1].split('/');\r\n    \r\n   // lay_out[3]=layout;\r\n    //var arry1=lay_out.join('/');\r\n   // window.location.href=window.location.href.split('#')[0]+'#'+arry1;\r\n     }\r\n    }\r\n\r\n\r\n//MenuColor\r\n        if (themes.hasOwnProperty('MenuColor')) {\r\n            let colorpicker = { \r\n                \"#1A49B9\": \"{\\\"#040558\\\":\\\"menu-color1\\\",\\\"#020698\\\":\\\"menu-color2\\\",\\\"#1A49BE\\\":\\\"menu-color3\\\",\\\"#193475\\\":\\\"menu-color4\\\",\\\"#EFF1F5\\\":\\\"menu-color5\\\"}\",\r\n                \"#432764\": \"{\\\"#3E0b7D\\\":\\\"menu-color1\\\",\\\"#432768\\\":\\\"menu-color2\\\",\\\"#320E42\\\":\\\"menu-color3\\\",\\\"#261543\\\":\\\"menu-color4\\\",\\\"#F3EEFC\\\":\\\"menu-color5\\\"}\",\r\n                \"#271419\": \"{\\\"#1B023D\\\":\\\"menu-color1\\\",\\\"#342446\\\":\\\"menu-color2\\\",\\\"#271413\\\":\\\"menu-color3\\\",\\\"#391C28\\\":\\\"menu-color4\\\",\\\"#FFF4F3\\\":\\\"menu-color5\\\"}\",\r\n                \"#293146\": \"{\\\"#284182\\\":\\\"menu-color1\\\",\\\"#400F40\\\":\\\"menu-color2\\\",\\\"#1C4CC3\\\":\\\"menu-color3\\\",\\\"#293145\\\":\\\"menu-color4\\\",\\\"#1E0A3A\\\":\\\"menu-color5\\\"}\"\r\n\r\n            }\r\n\r\n\r\n             document.body.classList.forEach(item => {\r\n\r\nif(item.includes('menu-color')){\r\n    document.body.classList.remove(item)\r\n    }\r\n                    \r\n                });\r\nvar parse_val={};\r\n       // colorpicker loop    \r\n            for (var key in colorpicker) {\r\n\r\n\r\n if(themes.themeColor==key){\r\n parse_val=JSON.parse( colorpicker[key]);\r\n for( var  menu in  parse_val )  {\r\n     if(menu==themes.MenuColor){\r\n                 document.body.classList.add(parse_val[menu]);\r\n     }\r\n }\r\n\r\n            }\r\n\r\n\r\n            \r\n            }\r\n\r\n}\r\n   //BodyMode\r\n        if (themes.hasOwnProperty('MenuMode')) {\r\n            let obj = ['text', 'icon'];\r\n            for (var key in obj) {\r\n                document.body.classList.remove(obj[key]);\r\n            }\r\n            document.body.classList.add(themes.MenuMode);\r\n        }\r\n\r\n\r\n//Menustyle\r\nif(themes.hasOwnProperty('MenuStyle')){\r\nif((themes.MenuStyle) == 'compact'){\r\nbody.classList.remove(\"relaxed\");\r\nbody.classList.add(\"compact\");\r\n} \r\nif((themes.MenuStyle) == 'relaxed'){\r\nbody.classList.remove(\"compact\");\r\nbody.classList.add(\"relaxed\");\r\n}\r\n}\r\n//bodyColor\r\n        if (themes.hasOwnProperty('body')) {\r\n            let colorpicker = { \r\n                \"#808080\": \"body-grey\",\r\n            \r\n                \"#FFFFFF\": \"body-white\"\r\n               \r\n            }\r\n            for (var key in colorpicker) {\r\n                document.body.classList.forEach(item => {\r\n                    if (item == colorpicker[key]) {\r\n                        document.body.classList.remove(item);\r\n                    }\r\n                });\r\n            }\r\n            document.body.classList.add(colorpicker[themes.body]);\r\n        }\r\n  } catch (e) {}\r\nif(data.theme_callback)data.theme_callback('Done');}"
  }, {
    id: 'PBXweq724bz5x',
    type: 'if_condition',
    next: {
      success: 'PBXcOMWt4geKP',
      failure: 'PBXNXVtdNdHTD'
    },
    nodename: 'check preview or not',
    if_type: 'value',
    variable1: 'data.handlerParams.key_name',
    comparator: '==',
    variable2: "'get'"
  }, {
    id: 'PBXx9ZMGr62NL',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'Preview JS code',
    code: 'function(data,ui){\r\nui.formFields=ui.$parent.form_fields.fields;\r\nui.buttons=ui.$parent.form_fields.buttons;\r\n}\r\n  \r\n\r\n\r\n'
  }, {
    id: 'PBXhbEsKOIDIU',
    type: 'js',
    next: {
      success: 'PBXC6JtcTeFtT'
    },
    nodename: 'JS code1',
    code: "\r\nfunction(data,ui){\r\n var themes = data.theme_Val;\r\n   \r\n\r\n    var body = document.body;\r\ntry{\r\n  //ThemeColor\r\n        if (themes.hasOwnProperty('themeColor')) {\r\n            let colorpicker = { \r\n                \"#1A49B9\": `${window.__theme__.blue}`,\r\n                \"#432764\": `${window.__theme__.purple}`,\r\n                \"#271419\": `${window.__theme__.darkPurple}`,\r\n                \"#293146\": `${window.__theme__.dark}`\r\n            }\r\n            for (var key in colorpicker) {\r\n                    if (themes.themeColor== key) {\r\n                    if(!document.getElementById('themes')) {\r\n    var link = document.createElement('link');\r\n    link.id = 'themes';\r\n    link.rel = 'stylesheet';\r\n    link.href = 'https://cdn.500apps.io/css/'+colorpicker[key]+'.css';\r\n    document.head.appendChild(link);\r\n}else{\r\n\r\n\r\nvar cdnLink=document.getElementById(\"themes\");\r\nif(cdnLink.href.includes(colorpicker[key])){}else{\r\ncdnLink.id='themes1';\r\n  var new_th= document.createElement('link');\r\n    new_th.id = 'themes';\r\n    new_th.rel = 'stylesheet';\r\n    new_th.href = 'https://cdn.500apps.io/css/'+colorpicker[key]+'.css';\r\n    document.head.appendChild(new_th);\r\nsetTimeout(function(){cdnLink.remove(); }, 3000);\r\n\r\n\r\n}\r\n}\r\n                    }\r\n             \r\n            }\r\n  \r\n        }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// For Font   font: \"robo\"\r\nvar font=[\"robo\",\"opensans\",\"lato\",\"tajawal\",\"cairo\",\"titilliumweb\"];\r\nif(themes.hasOwnProperty('font')){\r\n\r\n           for (var key in font) {\r\n                document.body.classList.remove(font[key]);\r\n            }\r\n   document.body.classList.add(themes.font);\r\n\r\n         \r\n        }\r\n\r\n     }catch(e){}\r\n}"
  }, {
    id: 'PBXO6cERWIl3F',
    type: 'js',
    next: {
      success: 'PBXhbEsKOIDIU'
    },
    nodename: 'JS code2',
    code: 'function(data,ui){\r\n\r\nui.formFields=ui.$parent.form_fields.fields;\r\nui.buttons=ui.$parent.form_fields.buttons;\r\nvar localVal = localStorage.getItem("t_item");\r\n\r\nvar reset={"themeColor": "#1A49B9",\r\n"MenuMode": "text",\r\n"MenuStyle": "compact",\r\n"body": "#FFFFFF",\r\n"font": "robo",\r\n"fontsize": "a",\r\n"positions": "left",\r\n"screens": "fullscreen",\r\n"MenuColor": "#040558"\r\n};\r\nvar reset_strinify=JSON.stringify(reset)\r\n\r\ndata.val=JSON.parse(reset_strinify);\r\n//data.val=JSON.parse(reset);\r\n\r\n\r\ndata.theme_Val={...data.val};\r\nui.form=data.val\r\n//window.themeBlock.form=data.val;\r\nreturn data\r\n}'
  }, {
    id: 'PBXpdWMElxOGZ',
    type: 'js',
    next: {
      success: 'PBXKVsJhwt4NT'
    },
    nodename: 'Other Settings',
    code: "function(data, ui) {\r\n    var keys = data.key;\r\n    if (keys) {\r\n        var themes = JSON.parse(data.output.data[0].theme);\r\n    } else {\r\n        var themes = data.form;\r\n    }\r\n\r\n    var body = document.body;\r\n\r\n    try {\r\n        // For font-size a++\r\n        if (themes.hasOwnProperty('fontsize')) {\r\n            if (themes.fontsize == \"a\") {\r\n                body.classList.add(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"a+\") {\r\n                body.classList.add(\"medium-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"big-font\");\r\n            } else if (themes.fontsize == \"A\") {\r\n                body.classList.add(\"big-font\");\r\n                body.classList.remove(\"small-font\");\r\n                body.classList.remove(\"medium-font\");\r\n            } else {}\r\n        }\r\n\r\n        if (themes.hasOwnProperty('colorpicker5')) {\r\n            let colorpicker = {\r\n                \"#0D3999\": \"primary-blue\",\r\n                \"#9437c3\": \"primary-purple\",\r\n                \"#FFFFFF\": \"primary-white\",\r\n                \"#F1F1F1\": \"primary-snow\"\r\n            }\r\n            for (var key in colorpicker) {\r\n                document.body.classList.forEach(item => {\r\n                    if (item == colorpicker[key]) {\r\n                        document.body.classList.remove(item);\r\n                    }\r\n                });\r\n            }\r\n            document.body.classList.add(colorpicker[themes.colorpicker5]);\r\n        }\r\n        if (themes.hasOwnProperty('style')) {\r\n            let obj = ['textonly', 'icon', 'logo'];\r\n            for (var key in obj) {\r\n                document.body.classList.remove(obj[key]);\r\n            }\r\n            document.body.classList.add(themes.style);\r\n        }\r\n\r\n        //  For dark mode\r\n        if (themes.hasOwnProperty('darkmode')) {\r\n            var body = document.body;\r\n            if (themes.darkmode == 1) {\r\n                body.classList.add(\"dark-mode\");\r\n            } else {\r\n                body.classList.remove(\"dark-mode\");\r\n            }\r\n        }\r\n    } catch (e) {}\r\n}"
  }, {
    id: 'PBXKVsJhwt4NT',
    type: 'js',
    next: {
      success: 'PBXgZGkqzV0ZP'
    },
    nodename: 'Sub menu',
    code: "function(data,ui){\r\n    var keys=data.key;\r\nif(keys){\r\nvar themes=JSON.parse(data.output.data[0].theme);\r\n}else{\r\nvar  themes=data.form;\r\n}\r\n    var body = document.body;\r\ntry{\r\n\r\n // For Sub Menu Modes\r\n    if(themes.hasOwnProperty('modes2')){\r\n        var x= document.getElementsByClassName(\"a-lhs\")[0]\r\n        if(x){\r\n        x.id=\"sub-menu\"\r\n        if((themes.modes2) == \"flyin\"){\r\n            document.getElementById('sub-menu').classList.remove('inline-menu');\r\n            document.getElementById('sub-menu').classList.add('flyin');\r\n        }else{\r\n            document.getElementById('sub-menu').classList.remove('flyin');\r\n            document.getElementById('sub-menu').classList.add('inline-menu'); //\"inlinemenu\"\r\n        }\r\n    }\r\n    }\r\n\r\n\r\n\r\n    // For Sub Menu colorpicker\r\n    if(themes.hasOwnProperty('colorpicker3')){\r\n        var colorpicker3={\r\n            \"#0D3999\":\"primary-blue\",\r\n            \"#9437c3\":\"primary-purple\",\r\n            \"#FFFFFF\":\"primary-white\",\r\n\"#F1F1F1\":\"primary-snow\"\r\n        }\r\n        var classes = Object.keys(colorpicker3)\r\n        // for (var key of classes) {\r\n        //  document.getElementById('sub-menu').classList.remove(colorpicker3[key]);\r\n        //  }\r\n        var x= document.getElementsByClassName(\"a-lhs\")[0]\r\n        if(x){\r\n        x.id=\"sub-menu\";\r\n    var colorsubmenu='';\r\n        for (var key of classes) {\r\n        if ((key) == themes.colorpicker3) {\r\n             colorsubmenu=colorpicker3[key];\r\n            }\r\nelse{\r\n                document.getElementById('sub-menu').classList.remove(colorpicker3[key]);\r\n\r\n}\r\n        }\r\nif(colorsubmenu){\r\n   document.getElementById('sub-menu').classList.add(colorsubmenu);\r\n}\r\n    }\r\n    }\r\n\r\n}catch(e){}\r\n\r\n}"
  }, {
    id: 'PBX3VN18ndJ8q',
    type: 'js',
    next: {
      success: 'PBXess1JT1v9J'
    },
    nodename: 'Appmenu',
    code: "\r\nfunction(data,ui){\r\n    var keys=data.key;\r\nif(keys){\r\nvar themes=JSON.parse(data.output.data[0].theme);\r\n}else{\r\nvar  themes=data.form;\r\n}\r\n    var body = document.body;\r\n\r\n    // For App menu Counter\r\n    if(themes.hasOwnProperty('counter')){\r\n        if((themes.counter) == \"withoutcounter\"){\r\n        body.classList.add(\"d-none\");\r\n        }else{\r\n            body.classList.remove(\"d-none\");\r\n        }\r\n    }\r\n\r\n    // For App menu colorpicker\r\n    if(themes.hasOwnProperty('colorpicker1')){\r\n    var colorpicker1={\r\n            \"#0D3999\":\"primary-blue\",\r\n            \"#9437c3\":\"primary-purple\",\r\n            \"#FFFFFF\":\"primary-white\",\r\n\"#F1F1F1\":\"primary-snow\"\r\n        };\r\nvar colorsubmenu='';\r\n    var classes = Object.keys(colorpicker1)\r\n    // for (var key of classes) {\r\n    //  document.getElementById('app-menu-color').classList.remove(colorpicker1[key]); //remove\r\n    //  }\r\n    var x= document.getElementsByClassName(\"a-lhs\")[0];\r\nif(x){\r\n    x.id=\"app-menu-color\"\r\n         for (var key of classes) {\r\n        if ((key) == themes.colorpicker1) {\r\n             colorsubmenu=colorpicker1[key];\r\n            }\r\nelse{\r\n            document.getElementById('app-menu-color').classList.add(colorpicker1[key]); //add\r\n\r\n            //    document.getElementsByClassName(\"a-lhs\")[0].classList.remove(colorpicker1[key]);\r\n\r\n}\r\n        }\r\nif(colorsubmenu){\r\n            document.getElementById('app-menu-color').classList.add(colorsubmenu); //add\r\n\r\n //  document.getElementsByClassName(\"a-lhs\")[0].classList.add(colorsubmenu);\r\n}\r\n}\r\n    }\r\n}"
  }, {
    id: 'PBXess1JT1v9J',
    type: 'js',
    next: {
      success: 'PBXJB1WcEIZSo'
    },
    nodename: 'PrimaryMenu',
    code: "function(data,ui){\r\n    var keys=data.key;\r\nif(keys){\r\nvar themes=JSON.parse(data.output.data[0].theme);\r\n}else{\r\nvar  themes=data.form;\r\n}\r\n    var body = document.body; \r\n    // For Menu Modes\r\n\r\n    if(themes.hasOwnProperty('modes')){\r\n        if((themes.modes) == 'compact'){\r\n        body.classList.remove(\"Mini-Mode\");\r\n        body.classList.remove(\"Full-Mode\");\r\n        body.classList.add(\"Compact-Mode\");\r\n        }\r\n        else if((themes.modes) == 'mini'){\r\n        body.classList.remove(\"Compact-Mode\");\r\n        body.classList.remove(\"Full-Mode\");\r\n        body.classList.add(\"Mini-Mode\");\r\n        }\r\n        else if((themes.modes) == 'full'){\r\n        body.classList.remove(\"Mini-Mode\");\r\n        body.classList.remove(\"Compact-Mode\");\r\n        body.classList.add(\"Full-Mode\");\r\n        }else{}\r\n    }\r\n\r\n\r\n\r\n\r\n//For Menu colorpickers\r\n    if(themes.hasOwnProperty('colorpicker')){\r\n        var colorpicker={\r\n            \"#0D3999\":\"primary-blue\",\r\n            \"#9437c3\":\"primary-purple\",\r\n            \"#FFFFFF\":\"primary-white\",\r\n\"#F1F1F1\":\"primary-snow\"\r\n        }\r\n        var classes = Object.keys(colorpicker)\r\n       \r\n     \r\n \r\n     \r\n    var colorsubmenu='';\r\n        for (var key of classes) {\r\n        if ((key) == themes.colorpicker) {\r\n             colorsubmenu=colorpicker[key];\r\n            }\r\nelse{\r\n              body.classList.remove(colorpicker[key]);\r\n\r\n}\r\n        }\r\nif(colorsubmenu){\r\nbody.classList.add(colorsubmenu);\r\n}\r\n    \r\n    }\r\n}"
  }, {
    id: 'PBXgZGkqzV0ZP',
    type: 'js',
    next: {
      success: 'PBX3VN18ndJ8q'
    },
    nodename: 'LeftMenu',
    code: "function(data,ui){\r\n    var keys=data.key;\r\nif(keys){\r\nvar themes=JSON.parse(data.output.data[0].theme);\r\n}else{\r\nvar  themes=data.form;\r\n}\r\n    var body = document.body;\r\n\r\n \r\n    // For Left Menu colorpicker\r\n    if(themes.hasOwnProperty('colorpicker2')){\r\n        var colorpicker2={\r\n            \"#0D3999\":\"primary-blue\",\r\n            \"#9437c3\":\"primary-purple\",\r\n            \"#FFFFFF\":\"primary-white\",\r\n\"#F1F1F1\":\"primary-snow\"\r\n        }\r\n        var classes = Object.keys(colorpicker2)\r\n        // for (var key of classes) {\r\n        //  document.getElementById('sub-menu').classList.remove(colorpicker2[key]);\r\n        //  }\r\n        var x= document.getElementsByClassName(\"glhs\")[0]\r\n        if(x){\r\n       // x.id=\"sub-menu\";\r\n    var colorsubmenu='';\r\n        for (var key of classes) {\r\n        if ((key) == themes.colorpicker2) {\r\n             colorsubmenu=colorpicker2[key];\r\n            }\r\nelse{\r\n                document.getElementsByClassName(\"glhs\")[0].classList.remove(colorpicker2[key]);\r\n\r\n}\r\n        }\r\nif(colorsubmenu){\r\n   document.getElementsByClassName(\"glhs\")[0].classList.add(colorsubmenu);\r\n}\r\n    }\r\n    }\r\n\r\n\r\n}"
  }, {
    id: 'PBXcOMWt4geKP',
    type: 'js',
    next: {
      success: 'PBXhbEsKOIDIU'
    },
    nodename: 'ui',
    code: "function(data,ui){\r\n\r\n // ui.formFields=ui.$parent.form_fields.fields;\r\n//ui.buttons=ui.$parent.form_fields.buttons;\r\ntry{\r\nif(data.event=='#1A49B9' || data.event=='#432764' || data.event=='#271419' || data.event=='#293146' ){\r\nui.form.themeColor=='#1A49B9'?(ui.form.MenuColor='#040558'):ui.form.themeColor=='#432764'?(ui.form.MenuColor='#3E0b7D'):ui.form.themeColor=='#271419'?(ui.form.MenuColor='#1B023D'):(ui.form.MenuColor='#284182');\r\n}\r\n  data.theme_Val= {...ui.form};\r\n\r\n}catch(e){}\r\n           \r\n  \r\n//data.theme_Val.MenuColor=event;\r\n\r\n\r\n}"
  }, {
    id: 'PBXJB1WcEIZSo',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'Screens And Menu position',
    code: "function(data,ui){\r\n    var keys=data.key;\r\nif(keys)\r\n{\r\nvar themes=JSON.parse(data.output.data[0].theme);\r\n}else{\r\nvar  themes=data.form;\r\n}\r\n    var body = document.body;\r\n// For screens\r\nif(themes.hasOwnProperty('screens')){\r\nif((themes.screens) == 'compactscreen'){\r\nbody.classList.remove(\"full-mode\");\r\nbody.classList.add(\"compact-mode\");\r\n} \r\nif((themes.screens) == 'fullscreen'){\r\nbody.classList.remove(\"compact-mode\");\r\nbody.classList.add(\"full-mode\");\r\n}\r\n}\r\n\r\n\r\n     //classic\r\n    var screens={\r\n        \"trendy\":\"t=https://cdn.500apps.io/css/trendy.css\",\r\n        \"classy\":\"t=https://cdn.500apps.io/css/classy.css\",\r\n        \"fancy\":\"t=https://cdn.500apps.io/css/fancy.css\"\r\n    };\r\nvar locations='';\r\n   if(window.location.href.includes(themes.classic))\r\n   {\r\n\r\n   }else{\r\n    for (var key in screens) {\r\n      if (key==themes.classic) {\r\n     \r\n   if(window.location.href.includes('?t')||window.location.href.includes('%3Ft%3D'))\r\n   {\r\n  for(let keys in screens){\r\n      if(window.location.href.includes(keys)){\r\n  var str = window.location.href;\r\n locations = str.replace(keys,themes.classic );\r\n      }\r\n  }\r\n    }else{\r\n   if(window.location.href.includes('?')){\r\n    locations=window.location.href+'&'+screens[key];\r\n    }\r\nelse{\r\n locations=window.location.href+'?'+screens[key];\r\n}\r\n    }\r\n      }\r\n    }\r\n   }\r\n\r\n// For Layouts\r\n    if(themes.hasOwnProperty('positions')){\r\n    var layout;\r\n        if(themes.positions=='left'){\r\n            layout=2;\r\n            }else if(themes.positions=='right'){\r\n                 layout=4;\r\n                 } else if(themes.positions=='top'){\r\n                     layout=0;\r\n                     }else{\r\n                         layout=''}\r\n    if(ui.$route.params.layout != layout)\r\n    {\r\n         if(locations){\r\n            var lay_out=locations.split('#')[1].split('/');\r\n        }else{\r\n            var lay_out=window.location.href.split('#')[1].split('/');\r\n        }\r\n    lay_out[3]=layout;\r\n    var arry1=lay_out.join('/');\r\n    window.location.href=window.location.href.split('#')[0]+'#'+arry1;\r\n     }else{\r\n         if(locations)\r\n    {\r\n    window.location.href=locations;\r\n    } }\r\n    }\r\n\r\n}"
  }, {
    id: 'PBX9iWfytWMkH',
    type: 'js',
    next: {
      success: 'PBXhbEsKOIDIU'
    },
    nodename: 'JS code',
    code: "function(data,ui){\r\nvar reset={\"themeColor\": \"#1A49B9\",\r\n\"MenuMode\": \"text\",\r\n\"MenuStyle\": \"compact\",\r\n\"body\": \"#FFFFFF\",\r\n\"font\": \"robo\",\r\n\"fontsize\": \"a\",\r\n\"positions\": \"left\",\r\n\"screens\": \"fullscreen\",\r\n\"MenuColor\": \"#040558\"\r\n};\r\nvar reset_strinify=JSON.stringify(reset)\r\n\r\nvar reset_parse=JSON.parse(reset_strinify);\r\n\r\ndata.val=reset_parse;\r\n\r\nif(data.output.status!=200){\r\n\r\ndata.val=reset_parse;\r\n\r\n}\r\nelse{\r\nif(data.output.data[0].theme==null || data.output.data.length==0 || data.output.data[0].theme =='' ){\r\n\r\n\r\n\r\ndata.val=reset_parse;\r\n\r\n}else{\r\ndata.val=JSON.parse(data.output.data[0].theme);\r\n\r\nvar vall=JSON.stringify(data.val)\r\n\r\nlocalStorage.setItem(\"t_item\", vall);\r\n}\r\n}\r\n\r\ndata.theme_Val=data.val;\r\nreturn data\r\n}"
  }, {
    id: 'PBXKkJ5xaemkl',
    type: 'deserialize_form',
    next: {
      success: 'PBXhbEsKOIDIU'
    },
    nodename: 'Deserialize',
    data: 'val',
    form_id: ''
  }, {
    id: 'PBXNXVtdNdHTD',
    type: 'if_condition',
    next: {
      success: 'PBXTucNTXZozb',
      failure: 'PBXZd1nq7rhgM'
    },
    nodename: 'If Condition',
    if_type: 'value',
    variable1: 'data.key',
    comparator: '==',
    variable2: "'Preload'"
  },
  {
    id: 'PBXNXVtdNdHTDss',
    type: 'if_condition',
    next: {
      success: 'PBXhbEsKOIDIU',
      failure: 'PBXX4TdqZNZXs'
    },
    nodename: 'If Condition for ajax',
    if_type: 'value',
    variable1: 'data.allow',
    comparator: '==',
    variable2: "'true'"
  },
  {
    id: 'PBXmbvZlhpiIJ',
    type: 'if_condition',
    next: {
      success: 'PBXO6cERWIl3F',
      failure: 'PBXaTOrWHvn0u'
    },
    nodename: 'If Condition',
    if_type: 'value',
    variable1: 'data.handlerParams.key',
    comparator: '==',
    variable2: "'reset'"
  }, {
    id: 'PBXCxD3XFsbCh',
    type: 'js',
    next: {
      success: 'PBXhbEsKOIDIU'
    },
    nodename: 'JS code',
    code: 'function(data,ui){\r\nvar reset={"themeColor": "#1A49BE",\r\n"MenuMode": "text",\r\n"MenuStyle": "compact",\r\n"body": "#FFFFFF",\r\n"font": "robo",\r\n"fontsize": "a",\r\n"positions": "left",\r\n"screens": "fullscreen",\r\n"MenuColor": "#040558"\r\n};\r\nvar reset_strinify=JSON.stringify(reset)\r\n\r\nvar reset_parse=JSON.parse(reset_strinify);\r\n\r\ndata.val=reset_parse;\r\n\r\n\r\ndata.theme_Val={...data.val};\r\n\r\n}'
  }, {
    id: 'PBXRZJSdXeOaV',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "function(data, ui) {\r\n\r\n  var localVal = localStorage.getItem(\"t_item\");\r\n  if (localVal == \"null\" || localVal == \"\" || localVal == null) {\r\n    var reset = {\r\n      themeColor: \"#040558\",\r\n      MenuMode: \"text\",\r\n      MenuStyle: \"compact\",\r\n      body: \"#FFFFFF\",\r\n      font: \"robo\",\r\n      fontsize: \"a\",\r\n      positions: \"left\",\r\n      screens: \"fullscreen\",\r\n      MenuColor: \"#040558\",\r\n    };\r\n    var reset_strinify = JSON.stringify(reset);\r\n\r\n    data.val = JSON.parse(reset_strinify);\r\n  } else {\r\n    data.val = JSON.parse(localVal);\r\n  }\r\n\r\n  data.theme_Val = { ...data.val };\r\n  //window.themeBlock.form=data.val;\r\n\r\n  var themes = data.theme_Val;\r\n\r\n  var body = document.body;\r\n\r\n  try {\r\n    // For font-size a++\r\n    if (themes.hasOwnProperty(\"fontsize\")) {\r\n      if (themes.fontsize == \"a-\") {\r\n        body.classList.add(\"small-font\");\r\n        body.classList.remove(\"medium-font\");\r\n        body.classList.remove(\"big-font\");\r\n      } else if (themes.fontsize == \"a\") {\r\n        body.classList.add(\"medium-font\");\r\n        body.classList.remove(\"small-font\");\r\n        body.classList.remove(\"big-font\");\r\n      } else if (themes.fontsize == \"A\") {\r\n        body.classList.add(\"big-font\");\r\n        body.classList.remove(\"small-font\");\r\n        body.classList.remove(\"medium-font\");\r\n      } else {\r\n      }\r\n    }\r\n\r\n    // For screens\r\n    if (themes.hasOwnProperty(\"screens\")) {\r\n      if (themes.screens == \"compactscreen\") {\r\n        body.classList.remove(\"full-mode\");\r\n        body.classList.add(\"compact-mode\");\r\n      }\r\n      if (themes.screens == \"fullscreen\") {\r\n        body.classList.remove(\"compact-mode\");\r\n        body.classList.add(\"full-mode\");\r\n      }\r\n    }\r\n\r\n    //Positions\r\n    if (themes.hasOwnProperty(\"positions\")) {\r\n      var layout;\r\n      if (themes.positions == \"left\") {\r\n        ui.$route.params.layout == 2 || ui.$route.params.layout == 3 || ui.$route.params.layout == 4\r\n          ? (layout = ui.$route.params.layout)\r\n          : (layout = Number(ui.$route.params.layout) + 2);\r\n      } else if (themes.positions == \"top\") {\r\n        ui.$route.params.layout == 0 || ui.$route.params.layout == 1 || ui.$route.params.layout == 4\r\n          ? (layout = ui.$route.params.layout)\r\n          : (layout = Number(ui.$route.params.layout) - 2);\r\n      } else {\r\n        layout = ui.$route.params.layout;\r\n      }\r\n      if (ui.$route.params.layout != layout) {\r\n        ui.$router.push({ params: { layout: layout } });\r\n        //          var lay_out=window.location.href.split('#')[1].split('/');\r\n\r\n        // lay_out[3]=layout;\r\n        //var arry1=lay_out.join('/');\r\n        // window.location.href=window.location.href.split('#')[0]+'#'+arry1;\r\n      }\r\n    }\r\n\r\n    //MenuColor\r\n    if (themes.hasOwnProperty(\"MenuColor\")) {\r\n      let colorpicker = {\r\n        \"#040558\":\r\n          '{\"#040558\":\"menu-color1\",\"#020698\":\"menu-color2\",\"#1A49BE\":\"menu-color3\",\"#193475\":\"menu-color4\",\"#EFF1F5\":\"menu-color5\"}',\r\n        \"#3E0B7D\":\r\n          '{\"#3E0B7D\":\"menu-color1\",\"#432768\":\"menu-color2\",\"#320E42\":\"menu-color3\",\"#261543\":\"menu-color4\",\"#F3EEFC\":\"menu-color5\"}',\r\n        \"#1B023D\":\r\n          '{\"#1B023D\":\"menu-color1\",\"#342446\":\"menu-color2\",\"#271413\":\"menu-color3\",\"#391C28\":\"menu-color4\",\"#FFF4F3\":\"menu-color5\"}',\r\n        \"#293145\":\r\n          '{\"#284182\":\"menu-color1\",\"#400F40\":\"menu-color2\",\"#1C4CC3\":\"menu-color3\",\"#293145\":\"menu-color4\",\"#1E0A3A\":\"menu-color5\"}',\r\n      };\r\n\r\n      document.body.classList.forEach((item) => {\r\n        if (item.includes(\"menu-color\")) {\r\n          document.body.classList.remove(item);\r\n        }\r\n      });\r\n      var parse_val = {};\r\n      // colorpicker loop\r\n      for (var key in colorpicker) {\r\n        if (themes.themeColor == key) {\r\n          parse_val = JSON.parse(colorpicker[key]);\r\n          for (var menu in parse_val) {\r\n            if (menu == themes.MenuColor) {\r\n              document.body.classList.add(parse_val[menu]);\r\n            }\r\n          }\r\n        }\r\n      }\r\n    }\r\n    //BodyMode\r\n    if (themes.hasOwnProperty(\"MenuMode\")) {\r\n      let obj = [\"text\", \"icon\"];\r\n      for (var key in obj) {\r\n        document.body.classList.remove(obj[key]);\r\n      }\r\n      document.body.classList.add(themes.MenuMode);\r\n    }\r\n\r\n    //Menustyle\r\n    if (themes.hasOwnProperty(\"MenuStyle\")) {\r\n      if (themes.MenuStyle == \"compact\") {\r\n        body.classList.remove(\"relaxed\");\r\n        body.classList.add(\"compact\");\r\n      }\r\n      if (themes.MenuStyle == \"relaxed\") {\r\n        body.classList.remove(\"compact\");\r\n        body.classList.add(\"relaxed\");\r\n      }\r\n    }\r\n    //bodyColor\r\n    if (themes.hasOwnProperty(\"body\")) {\r\n      let colorpicker = {\r\n        \"#808080\": \"body-grey\",\r\n\r\n        \"#FFFFFF\": \"body-white\",\r\n      };\r\n      for (var key in colorpicker) {\r\n        document.body.classList.forEach((item) => {\r\n          if (item == colorpicker[key]) {\r\n            document.body.classList.remove(item);\r\n          }\r\n        });\r\n      }\r\n      document.body.classList.add(colorpicker[themes.body]);\r\n    }\r\n\r\n    // For Font   font: \"robo\"\r\n    if (themes.hasOwnProperty(\"font\")) {\r\n      if (themes.font == \"robo\") {\r\n        body.classList.remove(\"opensans\");\r\n        body.classList.remove(\"lato\");\r\n        body.classList.add(\"robo\");\r\n      }\r\n      if (themes.font == \"opensans\") {\r\n        body.classList.remove(\"robo\");\r\n        body.classList.remove(\"lato\");\r\n        body.classList.add(\"opensans\");\r\n      }\r\n      if (themes.font == \"lato\") {\r\n        body.classList.remove(\"robo\");\r\n        body.classList.remove(\"opensans\");\r\n        body.classList.add(\"lato\");\r\n      }\r\n    }\r\n  } catch (e) {}\r\n\r\n}"
  }, {
    id: 'PBXFB2dhOIxCC',
    type: 'js',
    next: {
      success: 'hangup'
    },
    nodename: 'JS code',
    code: "  //ThemeColor\r\n        if (themes.hasOwnProperty('themeColor')) {\r\n            let colorpicker = { \r\n                \"#1A49BE\": \"blue12\",\r\n                \"#432768\": \"purple12\",\r\n                \"#1B023D\": \"dark-purple12\",\r\n                \"#293145\": \"dark12\"\r\n            }\r\n            for (var key in colorpicker) {\r\n                    if (themes.themeColor== key) {\r\n                    if(!document.getElementById('themes')) {\r\n    var link = document.createElement('link');\r\n    link.id = 'themes';\r\n    link.rel = 'stylesheet';\r\n    link.href = 'https://cdn.500apps.io/css/'+colorpicker[key]+'.css';\r\n    document.head.appendChild(link);\r\n}else{\r\nvar cdnLink=document.getElementById(\"themes\");\r\ncdnLink.href='https://cdn.500apps.io/css/'+colorpicker[key]+'.css'\r\n}\r\n                    }\r\n             \r\n            }\r\n  \r\n        }\r\n\r\n\r\n"
  }]
};

<template>
  <iframe
    v-if="render"
    :src="src"
    id="bm_designer"
    frameborder="0"
    name="designer"
    :width="width"
    :height="height"
    @load="load"
  ></iframe>
</template>
<script>
var designerSerializedJson;

// Listens any window 'message' event handler. It also handles
// Message event received from iframe.
// Window.addEventListener('message', function(event) {

//     // Initialize global workflow json variable - async will be waiting till this happens
//     Var data = event.data;
//     If(data.command && data.command =="serialized")
//     {
//       Console.log("Listening to iframe message");

//       DesignerSerializedJson = data;
//     }
// });

window.addEventListener('message', receiveMessage);

function receiveMessage (event) {
  if (typeof event.data === 'object') {
    var data = event.data;
    if ('trigger' in data) {
      // This will be triggered. when the buildly is loaded
      // Inside the iframe and post the message to the parent window (or current window)
      // PostTheMessage(data);
      // DesignerSerializedJson = data;
      // Try{
      //     This.loadfun();
      // }catch(error){
      //     Vm.$children[0].loadfun();
      //     Loadfun()
      // }
    }
    if ('command' in data) {
      // This will be triggered when the data is changed internally
      console.log('new data is ', data);
      designerSerializedJson = data.builder_json;
    }
  }
}

// Var workflow_json = {"nodes":[{"NodeDefinition":{"name":"Start","thumbnail":"json/nodes/images/common/Start.png","icon":"json/nodes/icons/common/Start.png","info":"Entry point of your campaign. Please create workflow for your campaign starting from here.","help":"Start point in your campaign workflow.","author":"John","company":"Invox","language":"en","branches":"start","workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Start","category":"Basic","ui":[{"label":"Entry point of your campaign. Please create workflow for your campaign starting from here.","category":"Help","componet":"label","type":"label"}]},"id":"PBXNODE1","xPosition":242,"yPosition":36,"displayname":"Start","JsonValues":[],"States":[{"start":"PBXaNToSAimIq"}]},{"NodeDefinition":{"name":"Add Note","thumbnail":"json/nodes/images/crm/addnote.png","icon":"json/nodes/icons/crm/addnote.png","info":"Add a note to the contact in Agile.","help":"Add a note to the contact in Agile.","author":"john","company":"Invox","language":"en","branches":"yes","workflow_tasklet_class_name":"com.campaignio.tasklets.agile.AddNote","category":"Utilities","ui":[{"label":"About","required":"required","category":"Info","name":"subject","id":"subject","title":"Enter your subject","fieldType":"input","type":"text"},{"label":"Add Note","category":"Info","name":"description","id":"description","title":"Enter your note here.","cols":"75","rows":"13","fieldType":"textarea","type":"textarea"},{"label":"Add a note to a contact in CRM. <br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a note about it.<br/><br/>Notes related to a contact can be viewed in the Notes tab in Contact details page.","category":"Help","fieldType":"label","type":"label"}],"url":"json/nodes/crm/addnote.js"},"id":"PBXRBAmx0kbcX","xPosition":546,"yPosition":230,"displayname":"Add Note","JsonValues":[{"name":"nodename","value":"Add Note"},{"name":"subject","value":"Yes"},{"name":"description","value":"Yes"}],"States":[{"yes":"hangup"}]},{"NodeDefinition":{"name":"Add Note","thumbnail":"json/nodes/images/crm/addnote.png","icon":"json/nodes/icons/crm/addnote.png","info":"Add a note to the contact in Agile.","help":"Add a note to the contact in Agile.","author":"john","company":"Invox","language":"en","branches":"yes","workflow_tasklet_class_name":"com.campaignio.tasklets.agile.AddNote","category":"Utilities","ui":[{"label":"About","required":"required","category":"Info","name":"subject","id":"subject","title":"Enter your subject","fieldType":"input","type":"text"},{"label":"Add Note","category":"Info","name":"description","id":"description","title":"Enter your note here.","cols":"75","rows":"13","fieldType":"textarea","type":"textarea"},{"label":"Add a note to a contact in CRM. <br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a note about it.<br/><br/>Notes related to a contact can be viewed in the Notes tab in Contact details page.","category":"Help","fieldType":"label","type":"label"}],"url":"json/nodes/crm/addnote.js"},"id":"PBX1Z5ER8covP","xPosition":399,"yPosition":235,"displayname":"Copy of Add Note","JsonValues":[{"name":"nodename","value":"Copy of Add Note"},{"name":"subject","value":"No"},{"name":"description","value":"No"}],"States":[{"yes":"hangup"}]},{"NodeDefinition":{"name":"Score","thumbnail":"json/nodes/images/email/score.png","icon":"json/nodes/icons/email/score.png","info":"Add or subtract score to your contact to identify hot leads based on total score.","help":"Add or subtract score to your contact to identify hot leads based on total score.","author":"John","company":"mantra","language":"en","branches":"yes","type":"voice","workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Score","category":"Utilities","ui":[{"label":"Type","required":"required","category":"Info","name":"type","id":"type","title":"Select the operation type.","options":{"Set":"set","Add":"add","Subtract":"subtract"},"fieldType":"select","type":"select"},{"label":"Value","required":"required","category":"Info","name":"Value","id":"Value","title":"Enter the value.","fieldType":"input","type":"number"},{"label":"You can set, increase or decrease the Lead Score using this option.<br/><br/>For example, if the user opened your email, add a score of 5 and on clicking a link add 10.","category":"Help","fieldType":"label","type":"label"}],"url":"json/nodes/common/score.js"},"id":"PBXaNToSAimIq","xPosition":202,"yPosition":126,"displayname":"Score","JsonValues":[{"name":"nodename","value":"Score"},{"name":"type","value":"set"},{"name":"Value","value":"100"}],"States":[{"yes":"PBX7f0020XtC9"}]},{"NodeDefinition":{"name":"Check Campaign","thumbnail":"json/nodes/images/common/check_campaign.png","icon":"json/nodes/icons/common/check_campaign.png","info":"Check the contact's status for a specified campaign.","help":"Check if the contact is active in some other campaign. You can also check if he/she is done with the campaign.","author":"Kona","company":"mantra","language":"en","branches":"No,Yes","workflow_tasklet_class_name":"com.campaignio.tasklets.agile.CheckCampaign","category":"Utilities","ui":[{"label":"Campaigns","required":"Yes","category":"Settings","name":"campaign_id","id":"campaign_id","title":"Select campaign from the list.","fieldType":"check_campaign_list","type":"select","style":{"margin-top":"10px","height":"100px","width":"50%"}},{"label":"Status","category":"Settings","name":"campaign_status","id":"campaign_status","title":"Select status from the list.","required":"required","options":{"Any":"any_status","Active":"active","Completed":"done"},"fieldType":"select","type":"select"},{"label":"Check if the contact is active in some other campaign. You can also check if he/she is done with the campaign.","category":"Help","fieldType":"label","type":"label"}]},"id":"PBXIpHF72d8qs","xPosition":439,"yPosition":80,"displayname":"Check Campaign","JsonValues":[{"name":"nodename","value":"Check Campaign"},{"name":"campaign_id","value":"433"},{"name":"campaign_status","value":"any_status"}],"States":[{"No":"PBX1Z5ER8covP"},{"Yes":"PBXRBAmx0kbcX"}]},{"NodeDefinition":{"name":"Unsubscribe","thumbnail":"json/nodes/images/common/unsubscribe.png","icon":"json/nodes/icons/common/unsubscribe.png","info":"Unsubscribe the contact from selected campaign.","help":"Unsubscribe the contact from selected campaigns.You can unsubscribe the contact from either a specific campaign or all the campaigns the contact is currently in.","author":"Bhasuri","company":"Agile","language":"en","branches":"Yes","workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Unsubscribe","category":"Utilities","ui":[{"label":"Select a campaign to unsubscribe","title":"Select a campaign","required":"required","category":"Settings","name":"unsubscribe","id":"unsubscribe","fieldType":"campaign_list","type":"select","style":{"margin-top":"10px","height":"100px","width":"50%"}},{"label":"Unsubscribe the contact from selected campaigns.You can unsubscribe the contact from either a specific campaign or all the campaigns the contact is currently in.","category":"Help","componet":"label","type":"label"}]},"id":"PBX7f0020XtC9","xPosition":207,"yPosition":235,"displayname":"Unsubscribe","JsonValues":[{"name":"nodename","value":"Unsubscribe"},{"name":"unsubscribe","value":"All"}],"States":[{"Yes":"PBXIpHF72d8qs"}]}]};

/**
 * Appup Button
 *
 * `TODOs:`
 * action - invoke some method, open modal window, navigate to page
 *
 * navigateTo
 */
export default {
  name: 'appup-designer',
  props: {
    /**
     * Id of input elements.
     */
    src: {
      type: String,
      required: true
    },

    /**
     * Size of the button
     *
     * `small, medium, large`
     */
    width: {
      type: String,
      default: '100%'
    },
    /**
     * Render of the component
     */
    render: {
      type: Boolean,
      default: true
    },
    /**
     * Style varient of the button
     *
     * `primary, seconday, success, warning, danger`
     */
    height: {
      type: String,
      default: '900px'
    },
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    load: function () {
      debugger;
      debugger;
      //   Debugger;
      //   Console.log("Loading iframe");

      //   // Construct the JSON Arrays for toolbar 1 json, toolbar2 json and marketplace nodes
      var data = { call: 'sendValue' };
      try {
        if (this.value) {
          // Need to parse inorder to convert stringify json into workflow node objects
          if (typeof this.value === 'string') {
            data.value = JSON.parse(this.value);
          } else {
            data.value = JSON.parse(JSON.stringify(this.value)); ;
          }
        } else {
          data = { call: 'sendValue', value: [] };
        }
      } catch (e) {
        // Data.value = JSON.parse(JSON.stringify(this.value));
      }

      console.log('Designer from Buildly and Mockly');
      console.log(data);

      // Pushes 'init' event to initialize workflow designer
      var iframeWindow = document.getElementById('bm_designer').contentWindow;
      iframeWindow.postMessage(data, '*');
    },
    get_json: function () {
      // Returns the value of the serialized json - should be called after save
      return designerSerializedJson;
    },
    save: async function () {
      debugger;
      // Reset global workflow json variable
      //   DesignerSerializedJson = undefined;

      //   // Send Save Command to Iframe
      //   Var iframeWindow = document.getElementById("bm_designer").contentWindow;
      //   Var data = {};
      //   Data.command = "save";

      //   // Pushes 'save' event to iframe
      //   IframeWindow.postMessage(data,"*");

      var start = new Date().getTime();
      // Waits until global variable gets initialized asynchronously
      // Through message event
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!designerSerializedJson && this.checkMax(start)) {
        console.log('Sleeping...');
        await this.sleep(5); // 5 milliseconds
      }

      console.log('Awake!!');
      console.log(designerSerializedJson);
    },
    sleep: function (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    checkMax: function (time) {
      var valid = new Date().getTime() - time <= 3000;

      if (!valid) console.log('Maximum time reached!!');

      return valid;
    }
  },
  data: function () {
    return {};
  },
  watch: {
    render: {
      handler: function (newValue) {
        debugger;
        this.render = newValue;
      },
      deep: true
    }
  }
};
</script>

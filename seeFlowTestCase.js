const config = require('./config')
const Dialogflow = require('./dialogflow');
var dialogflowManager = new Dialogflow();


exports.seeFlowTest = async function () {
    await dialogflowManager.detectIntent('There is something wrong with my car', false);
    await config.sleep(100);
    await dialogflowManager.detectIntent('See', false);
    await config.sleep(100);
    await dialogflowManager.detectIntent('Smoke', false);
    await config.sleep(100);
    await dialogflowManager.detectIntent('Engine Compartment', false);
    await config.sleep(100);
    await dialogflowManager.detectIntent('Yes', false);
    await config.sleep(100);
  }


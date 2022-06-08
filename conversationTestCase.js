const config = require('./config')
const Dialogflow = require('./dialogflow');
var dialogflowManager = new Dialogflow();


exports.conversationTest = async function () {
    await dialogflowManager.detectIntent('There is something wrong with my car');
    await config.sleep(100);
    await dialogflowManager.detectIntent('See');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Smoke');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Engine Compartment');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Yes');
    await config.sleep(100);

    await dialogflowManager.detectIntent('Hello');
    await config.sleep(100);

    await dialogflowManager.detectIntent('Ugh');
    await config.sleep(100);
    await dialogflowManager.detectIntent('The engine cranks normally but does not start');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Yes');
    await config.sleep(100);

    await dialogflowManager.detectIntent('Hear');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Clunk- A random thumping sound');
    await config.sleep(100);
    await dialogflowManager.detectIntent('When turning');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Front Left');
    await config.sleep(100);
    await dialogflowManager.detectIntent('Yes');
    await config.sleep(100);

  }


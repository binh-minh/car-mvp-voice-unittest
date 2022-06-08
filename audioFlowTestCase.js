const path = require('node:path');
const config = require('./config')
const Dialogflow = require('./dialogflow');
var dialogflowManager = new Dialogflow();


exports.audioFlowTest = async function () {
    var audioFileName1 = path.resolve(__dirname, './data-test/There_is_something_wrong_with_my_car.wav');
    dialogflowManager.detectIntentAudio(audioFileName1);
    await config.sleep(1000);
    var audioFileName2 = path.resolve(__dirname, './data-test/Smell_symptom.wav');
    dialogflowManager.detectIntentAudio(audioFileName2, true);
    await config.sleep(1000);
}

exports.streamFlowTest = async function () {
    var audioFileName1 = path.resolve(__dirname, './data-test/There_is_something_wrong_with_my_car.wav');
    dialogflowManager.detectIntentStream(audioFileName1, true);
    await config.sleep(2000);

    var audioFileName2 = path.resolve(__dirname, './data-test/Smell_symptom.wav');
    dialogflowManager.detectIntentStream(audioFileName2, true);
    await config.sleep(2000);

    var audioFileName3 = path.resolve(__dirname, './data-test/Mildew.wav');
    dialogflowManager.detectIntentStream(audioFileName3, true);
    await config.sleep(2000);

    var audioFileName4 = path.resolve(__dirname, './data-test/Yes.wav');
    dialogflowManager.detectIntentStream(audioFileName4, true);
    await config.sleep(2000);
}


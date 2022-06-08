# car-mvp-voice-unittest
This is a unit-test to interact API Google Dialogflow CX 3.0 to allow an end-user sends input to Dialogflow, and Dialogflow sends a response.

- install node.js
- npm install @google-cloud/dialogflow-cx
- npm i file-saver
- npm i wav

- Set authentication google service : config GOOGLE_APPLICATION_CREDENTIALS in appConst.json or config enviroment as below:
//https://cloud.google.com/docs/authentication/production#windows 
For PowerShell:
$env:GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
Replace KEY_PATH with the path of the JSON file that contains your service account key.
For command prompt:
set GOOGLE_APPLICATION_CREDENTIALS=KEY_PATH

- Config dialogflow CX information in appConst.json

- Run : node index.js

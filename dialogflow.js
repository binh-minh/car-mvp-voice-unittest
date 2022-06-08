
const { SessionsClient } = require('@google-cloud/dialogflow-cx');
const util = require('util');
const fs = require('fs');
const { Transform, pipeline } = require('stream');
const pump = util.promisify(pipeline);
const path = require('node:path');
const { v4 } = require('uuid');

const fileSaver = require('file-saver');
const WavFileWriter = require('wav').FileWriter;

const appConst = require('./appConst.json');


module.exports = class Dialogflow {

    constructor() {
        this.languageCode = appConst.LANGUAGE_CODE;
        this.projectId = appConst.PROJECT_ID;
        this.agentid = appConst.AGENT_ID;
        this.locationId = appConst.LOCATION_ID;
        this.encoding = appConst.AUDIO_ENCODING;
        this.sampleRateHertz = appConst.SAMPLE_RATE_HERTZ;
        this.setupDialogflow();
    }

    setupDialogflow() {
        this.sessionId = v4();

        //this.sessionClient = new SessionsClient();
        //set authenticaion for GOOGLE_APPLICATION_CREDENTIALS
        this.sessionClient = new SessionsClient({ keyFilename: path.resolve(__dirname, `./${appConst.GOOGLE_APPLICATION_CREDENTIALS}`) });
        this.sessionPath = this.sessionClient.projectLocationAgentSessionPath(
            this.projectId,
            this.locationId,
            this.agentid,
            this.sessionId
        );
    }

    detectIntent = async function (queryText, outputAudio = false) {
        const languageCode = appConst.LANGUAGE_CODE;
        const request = {
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: queryText
                },
                languageCode
            },
            outputAudioConfig: outputAudio && outputAudio == true ? {
                audioEncoding: appConst.OUTPUT_AUDIO_ENCODING,//OUTPUT_AUDIO_ENCODING_MP3
                sampleRateHertz: appConst.OUTPUT_AUDIO_SAMPLE_RATE_HERTZ //44100
            } : {}
        };

        const [response] = await this.sessionClient.detectIntent(request);
        // console.log(`--Response--:`);
        //console.log(response.queryResult);
        console.log(`User Query: ${response.queryResult.text}`);
        for (const message of response.queryResult.responseMessages) {
            if (message.text) {
                console.log(`Agent Response: ${message.text.text}`);
            }
        }

        if (response && response.outputAudio && outputAudio && outputAudio == true) {
            this.getOutputAudioFile(response.outputAudio);
        }

        // if (response.queryResult.match.intent) {
        //   console.log(
        //     `Matched Intent: ${response.queryResult.match.intent.displayName}`
        //   );
        // }
        // console.log(
        //   `Current Page: ${response.queryResult.currentPage.displayName}`
        // );

    }

    detectIntentAudio = async function (audioFilePath, outputAudio = false) {
        // Read the content of the audio file and send it as part of the request.
        const languageCode = appConst.LANGUAGE_CODE;
        const readFile = util.promisify(fs.readFile);
        const inputAudio = await readFile(audioFilePath);

        const request = {
            session: this.sessionPath,
            queryInput: {
                audio: {
                    config: {
                        audioEncoding: this.encoding,
                        sampleRateHertz: this.sampleRateHertz,
                    },
                    audio: inputAudio,
                },
                languageCode,
            },
            outputAudioConfig: outputAudio && outputAudio == true ? {
                audioEncoding: appConst.OUTPUT_AUDIO_ENCODING,
                sampleRateHertz: appConst.OUTPUT_AUDIO_SAMPLE_RATE_HERTZ
            } : {}
        };

        const [response] = await this.sessionClient.detectIntent(request);
        // console.log(`--Response--:`);
        // console.log(response.queryResult);
        console.log(`User Query: ${response.queryResult.transcript}`);
        for (const message of response.queryResult.responseMessages) {
            if (message.text) {
                console.log(`Agent Response: ${message.text.text}`);
            }
        }

        if (response && response.outputAudio && outputAudio && outputAudio == true) {
            this.getOutputAudioFile(response.outputAudio);
        }
    }

    detectIntentStream = async function (audioFileName, outputAudio = false) {
        //https://cloud.google.com/dialogflow/cx/docs/how/detect-intent-stream
        //https://github.com/googleapis/nodejs-dialogflow-cx/blob/main/samples/detect-intent-streaming.js
        const languageCode = appConst.LANGUAGE_CODE;
        // Create a stream for the streaming request.
        const detectStream = this.sessionClient
            .streamingDetectIntent()
            .on('error', console.error)
            .on('data', data => {
                if (data.recognitionResult) {
                    // console.log(
                    //     `Intermediate Transcript: ${data.recognitionResult.transcript}`
                    // );
                } else {

                    const result = data.detectIntentResponse.queryResult;
                    //console.log('Detected Intent:');
                    //console.log(data.detectIntentResponse);
                    console.log(`User Query: ${result.transcript}`);
                    for (const message of result.responseMessages) {
                        if (message.text) {
                            console.log(`Agent Response: ${message.text.text}`);
                        }
                    }
                    // if (result.match.intent) {
                    //     console.log(`Matched Intent: ${result.match.intent.displayName}`);
                    // }
                    //console.log(`Current Page: ${result.currentPage.displayName}`);

                    // convert buffer to file wav
                    if (data.detectIntentResponse && data.detectIntentResponse.outputAudio && outputAudio && outputAudio == true) {
                        this.getOutputAudioFile(data.detectIntentResponse.outputAudio);
                    }
                }
            });

        // Write the initial stream request to config for audio input.
        const initialStreamRequest = {
            session: this.sessionPath,
            queryInput: {
                audio: {
                    config: {
                        audioEncoding: this.encoding,
                        sampleRateHertz: this.sampleRateHertz,
                        synthesize_speech_config: {
                            voice: {
                                // Set's the name and gender of the ssml voice
                                //https://cloud.google.com/text-to-speech/docs/voices
                                name: 'en-US-Standard-A',//en-GB-Standard-A
                                ssml_gender: 'SSML_VOICE_GENDER_FEMALE',//SSML_VOICE_GENDER_MALE
                            },
                        },
                        singleUtterance: true,
                    },
                },
                languageCode: languageCode,
            },
            outputAudioConfig: outputAudio && outputAudio == true ? {
                //https://cloud.google.com/dialogflow/cx/docs/reference/rest/v3/OutputAudioConfig#OutputAudioEncoding
                audioEncoding: appConst.OUTPUT_AUDIO_ENCODING,
                sampleRateHertz: appConst.OUTPUT_AUDIO_SAMPLE_RATE_HERTZ
            } : {}
        };
        detectStream.write(initialStreamRequest);

        // Stream the audio from audio file to Dialogflow.
        await pump(
            fs.createReadStream(audioFileName),
            // Format the audio stream into the request format.
            new Transform({
                objectMode: true,
                transform: (obj, _, next) => {
                    next(null, { queryInput: { audio: { audio: obj } } });
                },
            }),
            detectStream
        );
    }

    getOutputAudioFile = function (buffer) {
        //https://github.com/felixge/node-dateformat
        var fileName = `${v4()}`;
        var audioFileName = path.resolve(__dirname, `./data-response/${fileName}.wav`);
        console.log('outputAudio:');
        console.log(audioFileName);
        //console.log(data.detectIntentResponse.outputAudio);
        var outputFileStream = new WavFileWriter(audioFileName, {
            sampleRate: 16000,
            bitDepth: 16,
            channels: 1
        });

        outputFileStream.write(buffer);
    }

}

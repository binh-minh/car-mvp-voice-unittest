/*
*
* Project Name: Car MVP voice unit test
* Description: This is a unit-test to interact API Google Dialogflow CX 3.0 to allow an end-user sends input to Dialogflow, and Dialogflow sends a response
* Version: 1.0
* Author: Minh Nguyen
*
*/

const conversationTestCase = require('./conversationTestCase')
const audioFlowTestCase = require('./audioFlowTestCase')
const seeFlowTestCase = require('./seeFlowTestCase')

/* test to send a text*/
/*Detect intent with text input */
conversationTestCase.conversationTest();

/* test to send a audio file*/
/*Detect intent with audio file input*/
audioFlowTestCase.audioFlowTest();

/* test to send a text*/
seeFlowTestCase.seeFlowTest();

/* test to send streaming*/
/*Detect intent with audio input stream */
audioFlowTestCase.streamFlowTest();

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import util from "util";

// Load environment variables
dotenv.config();

// Instantiates a client
const client = new TextToSpeechClient();

async function convertTextToSpeech(inputText) {
  const request = {
    input: { text: inputText },
    voice: { languageCode: "es-US", name: "es-US-Neural2-A", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  // Manage the response
  const [response] = await client.synthesizeSpeech(request);
  // Convert the audio content to a base64-encoded string
  const audioContentBase64 = response.audioContent.toString('base64');

  // Create an HTML <audio> element with the base64-encoded audio content
  const audioElement = `<audio controls><source src="data:audio/mpeg;base64,${audioContentBase64}" type="audio/mpeg"></audio>`;
  return audioElement;
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile("output.mp3", response.audioContent, "binary");

  console.log("Text To Speech has completed. Audio File has been saved.");

}

export { convertTextToSpeech }; 

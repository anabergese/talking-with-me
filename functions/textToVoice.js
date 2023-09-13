import { keyElevenLab } from './config.js'; 
import axios from 'axios';

async function convertTextToSpeech(inputText) {
  try {
    const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/Q14t7vrqAfg1BIBOnpkc/stream';
    const apiKey = keyElevenLab;

    const requestBody = {
      text: inputText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer' // Tell Axios to expect binary data
    });

    if (response.status === 200) {
      const audioContentBase64 = Buffer.from(response.data, 'binary').toString('base64');
      const audioElement = `<audio id="audioHTMLtag" style="width: 0;" controls><source src="data:audio/mpeg;base64,${audioContentBase64}" type="audio/mpeg"></audio>`;
      return audioElement;
    } else {
      throw new Error(`Error while requesting ElevenLabs API: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error converting text to speech: ${error.message}`);
    throw error;
  }
}

export { convertTextToSpeech };

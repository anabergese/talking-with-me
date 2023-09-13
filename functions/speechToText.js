import fs from 'fs';
import { openai } from './config.js'; 

export async function convertSpeechToText(){
  const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream('audio.mp3'),
        language: "en"
      });
  return response;
}







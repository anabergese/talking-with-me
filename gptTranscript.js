import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
// Load environment variables this code is duplicated also in server.js
dotenv.config();
const apikeygpt = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikeygpt
});

export async function transcribeAudio(){

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream('audio.mp3'),
        language: "es"
      });
  console.log(response);

  return response;
}







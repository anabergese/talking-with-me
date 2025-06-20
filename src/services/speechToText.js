import fs from 'fs';
import { openai } from '../config.js'; 

export async function convertSpeechToText(){
  console.log("Converting speech to text...");
  const filePath = 'audio.mp3';
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`);
  }

  try {
    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: fs.createReadStream(filePath),
      language: 'en'
    });
    return response;
  } catch (err) {
    console.error('Error al convertir audio a texto:', err);
    throw err;
  }
}







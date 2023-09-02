import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables this code is duplicated also in server.js
dotenv.config();
const apikeygpt = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikeygpt
});


export async function processTranscription(transcriptionResult){
  const completion = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Your answer can have a minimum length: 50 characters and maximum length: 300 characters. You are an artificial assistant for people that is lonely, please, answer to this: ${transcriptionResult}`,
    suffix: "\n// Finish",
    temperature: 0.5,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: [
      "\n// Finish"
    ]
  });
  console.log("from gptProcessing:", completion.choices[0].text);
  return completion.choices[0].text;
}

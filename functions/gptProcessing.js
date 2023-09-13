import { openai } from './config.js'; 
import { curriculum } from './curriculum.js';

export async function processTranscription(transcriptionResult){
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": `${curriculum}`
      },
      {
        "role": "user",
        "content": `${transcriptionResult}`
      }
    ],
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: [
      "\n// Finish"
    ]
  });
  
  console.log("from gptProcessing:", completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
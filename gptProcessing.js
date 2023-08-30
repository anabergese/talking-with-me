import fetch from 'node-fetch';
const TRANSCRIPT_API_URL = 'https://api.openai.com/v1/completions';

export async function processTranscription(transcriptionResult) {
  // Process the transcriptionResult using the GPT API
  const headers = {
    Authorization: `Bearer ${process.env.GPT_TOKEN}`,
    "Content-Type": "application/json"
  };

  const requestBody = {
    "model": "text-davinci-003",
    "prompt": `Your answer can have a minimum length: 50 characters and maximum length: 300 characters. You are an artificial assistant for people that is alone, please, answer to this: ${transcriptionResult}`,
    "suffix": "\n// Finish",
    "temperature": 0.5,
    "max_tokens": 256,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0,
    "stop": [
      "\n// Finish"
    ]
  };

// Call the GPT API 
  const response = await fetch(TRANSCRIPT_API_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`GPT request failed with status ${response.status}`);
  }

  const responseGPT = await response.json();
  // Extract and return the generated text from the response
  const processedResult = responseGPT.choices[0].text.trim();

  return processedResult;
}

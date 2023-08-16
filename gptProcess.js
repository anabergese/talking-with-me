import fetch from 'node-fetch';

export async function gptProcess(inputText) {
  const API_TOKEN = 'Bearer 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';
  const TRANSCRIPT_API_URL = 'https://api.openai.com/v1/completions';

  const headers = {
    Authorization: API_TOKEN,
    "Content-Type": "application/json"
  };


  const requestBody = {
    "model": "text-davinci-003",
    "prompt": `Minimum length: 50 characters. Maximum length: 300 characters. You are an artificial assistant for people that is alone, please, answer: ${inputText}`,
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

// Call the GPT API to process the input text
  const response = await fetch(TRANSCRIPT_API_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`GPT request failed with status ${response.status}`);
  }

  // Retrieve the ID of the transcript from the response data
  const responseGPT = await response.json();
  
  // Extract and return the generated text from the response
  // console.log(responseGPT.choices[0].text.trim());
  return responseGPT.choices[0].text.trim();
}

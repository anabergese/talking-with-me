import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import { processTranscription } from './gptProcessing.js';
import {convertTextToSpeech} from './textToSpeech.js'
const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file received' });
  }

  try {
    const audioBuffer = req.file.buffer;
    // Process the transcription result using the external function of GPT
    const transcriptionResult = await transcribeAudio(audioBuffer);
    const processedResult = await processTranscription(transcriptionResult);
    const audioTag = await convertTextToSpeech(processedResult);

   // Send the JSON response to frontend
    res.json({
        processedresult: processedResult,
        transcriptionresult: transcriptionResult,
        audiocontent: audioTag
      });
       
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ message: 'Error processing audio' });
  }
});

async function upload_file(apiToken, audioBuffer) {
    const UPLOAD_API_URL = 'https://api.assemblyai.com/v2/upload';
  
    const response = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      headers: {
        Authorization: apiToken,
      },
      body: audioBuffer,
    });
  
    if (!response.ok) {
      throw new Error(`Audio upload failed with status ${response.status}`);
    }
  
    const responseBody = await response.json();
    return responseBody.upload_url;
  }
  

async function transcribeAudio(audioBuffer) {
    const API_TOKEN = '5c28abddbf97426b9d190d22e94ee263';
    const TRANSCRIPT_API_URL = 'https://api.assemblyai.com/v2/transcript';
  
    const headers = {
      Authorization: API_TOKEN,
    };
  
   // Upload the audio buffer to AssemblyAI and get the upload URL
    const uploadUrl = await upload_file(API_TOKEN, audioBuffer);
  
    if (!uploadUrl) {
      throw new Error('Audio upload failed');
    }
  
    const requestBody = {
      audio_url: uploadUrl,
      language_code: 'es',
    };
  
    const response = await fetch(TRANSCRIPT_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });
  
    if (!response.ok) {
      throw new Error(`Transcription request failed with status ${response.status}`);
    }
  
    // Retrieve the ID of the transcript from the response data
    const responseBody = await response.json();
    const transcriptId = responseBody.id;
    
    // Construct the polling endpoint URL using the transcript ID
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    // Poll the transcription API until the transcript is ready
    while (true) {
        // Send a GET request to the polling endpoint to retrieve the status of the transcript
        const pollingResponse = await fetch(pollingEndpoint, { headers });
        const transcriptionResult = await pollingResponse.json();

        // If the transcription is complete, return the transcript object
        if (transcriptionResult.status === 'completed') {
        return transcriptionResult.text;
        }
        // If the transcription has failed, throw an error with the error message
        else if (transcriptionResult.status === 'error') {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }
        // If the transcription is still in progress, wait for a few seconds before polling again
        else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        }
  }
  
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
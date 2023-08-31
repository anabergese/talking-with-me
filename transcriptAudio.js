import fetch from 'node-fetch';

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
  

export async function transcribeAudio(audioBuffer) {
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
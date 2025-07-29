import { convertSpeechToText } from '../services/speechToText.js';
import { processTranscription } from '../services/gptProcessing.js';
import { convertTextToSpeech } from '../services/textToSpeech.js';
import axios from 'axios'; 

export const handleAudioUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file received' });
  }

  try {
    const transcriptionResult = await convertSpeechToText();
    const processedResult = await processTranscription(transcriptionResult.text);
    const audioTag = await convertTextToSpeech(processedResult);

    // Log the response before sending it
    console.log('Response sent:', {
      processedresult: processedResult,
      transcriptionresult: transcriptionResult,
      audiocontent: audioTag,
    });
    
    res.json({
      processedresult: processedResult,
      transcriptionresult: transcriptionResult,
      audiocontent: audioTag,
    });

    // Send data to n8n workflow
    const webhookUrl = 'https://anabergese.app.n8n.cloud/webhook/8b02bb56-8931-4e71-9d3a-cf388bea42a4';
    await axios.post(webhookUrl, {
      user_query: transcriptionResult.text,
      ai_answer: processedResult,
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ message: 'Error processing audio' });
  }
};

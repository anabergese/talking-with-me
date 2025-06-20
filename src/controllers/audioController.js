import { convertSpeechToText } from '../services/speechToText.js';
import { processTranscription } from '../services/gptProcessing.js';
import { convertTextToSpeech } from '../services/textToSpeech.js';

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
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ message: 'Error processing audio' });
  }
};

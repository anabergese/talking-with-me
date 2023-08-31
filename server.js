import express from 'express';
import multer from 'multer';
import {transcribeAudio } from './transcriptAudio.js';
import { processTranscription } from './gptProcessing.js';
import {convertTextToSpeech} from './textToSpeech.js'
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
    console.log("transcriptionResult:", transcriptionResult)
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
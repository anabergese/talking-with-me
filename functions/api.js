import express, { Router } from 'express';
import multer from 'multer';
import { convertSpeechToText } from './speechToText.js';
import { processTranscription } from './gptProcessing.js';
import {convertTextToSpeech} from './textToVoice.js'
import serverless from 'serverless-http';
import ejs from 'ejs'; // Import the 'ejs' module

const app = express();
const router = Router();
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', './views'); // Set the views directory (update to your actual directory)

router.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './',
  filename: (req, file, callback) => {
      callback(null, 'audio.mp3');
  },
});
const upload = multer({ storage });


router.get('/', (req, res) => {
  res.render('index.ejs'); // 'index' corresponds to 'index.ejs' in the 'views' directory
});

router.get('/hello', (req, res) => res.send('Hello World!'));

router.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file received' });
  }

  try {
    //const audioBuffer = req.file.buffer;
    const transcriptionResult = await convertSpeechToText();
    console.log("transcriptionResult.text:", transcriptionResult.text)
    const processedResult = await processTranscription(transcriptionResult.text);
    const audioTag = await convertTextToSpeech(processedResult);
    
    // Log the response before sending it
    console.log('Response sent:', {
      processedresult: processedResult,
      transcriptionresult: transcriptionResult,
      audiocontent: audioTag,
    });

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

app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
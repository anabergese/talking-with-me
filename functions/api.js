import express, { Router } from 'express';
import multer from 'multer';
import { convertSpeechToText } from './speechToText.js';
import { processTranscription } from './gptProcessing.js';
import {convertTextToSpeech} from './textToVoice.js'
import serverless from 'serverless-http';

const app = express();
const router = Router();
// view engine setup
app.set('views', path.join(__dirname, 'views')); 
// app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);


//app.set('view engine', 'ejs'); // Set EJS as the view engine
//app.set('views', './views'); // Set the views directory (update to your actual directory)

router.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './',
  filename: (req, file, callback) => {
      callback(null, 'audio.mp3');
  },
});
const upload = multer({ storage });


router.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/styles/home.css">
  <title>Audio Recording</title>
  </head>
  <body>
  <div id="app">
    <video autoplay muted id="backgroundVideo">
      <source src="/images/background_desktop.mp4" type="video/mp4">
      Your browser does not support the video tag
    </video>
    <div id="gifContainer">
      <img src="/images/myself.svg" alt="myself">  
      <img src="/images/clone.gif" style="display: none;" id="talking_gif" alt="myself talking">
      <img src="/images/processing_input.gif" style="display: none;" id="processing_input" alt="processing audio"> 
    </div> 
    <div id="controls">
      <button id="startRecording">
        <img src="/images/mic.svg" id="mic_icon" alt="microphone icon">
      </button>
      <button id="stopRecording">
        <img src="/images/stop.svg" alt="stop button icon">
      </button>
    </div>
  </div>
  <div id="audioContainer">    
  </div>
  <script src="/scripts/script.js"></script>
  </body>
  </html>
  `
  res.render("index");

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
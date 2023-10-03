import express from 'express';
import multer from 'multer';
import { convertSpeechToText } from './speechToText.js';
import { processTranscription } from './gptProcessing.js';
import {convertTextToSpeech} from './textToVoice.js'

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './',
  filename: (req, file, callback) => {
      callback(null, 'audio.mp3');
  },
});
const upload = multer({ storage });


app.get('/', (req, res) => {
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
  res.render("index.ejs");

});

app.get('/hello', (req, res) => res.send('Hello World!'));

app.post('/upload', upload.single('audio'), async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`API RUNNING ON PORT ${PORT}`);
});
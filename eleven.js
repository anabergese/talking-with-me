import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';
import FormData from 'form-data';

const app = express();
const PORT = process.env.PORT || 3000;

// Define your API key and file paths
const XI_API_KEY = "<xi-api-key>";
const VOICE_SAMPLE_PATH1 = "<path-to-file>";
const VOICE_SAMPLE_PATH2 = "<path-to-file>";
const OUTPUT_PATH = "<path-to-file>";

const add_voice_url = "https://api.elevenlabs.io/v1/voices/add";
const history_url = "https://api.elevenlabs.io/v1/history";

app.use(express.json());

// Define a route to add a voice
app.post('/add-voice', async (req, res) => {
  try {
    const voiceData = {
      name: 'Voice name',
      labels: '{"accent": "American", "gender": "Female"}',
      description: 'An old American male voice with a slight hoarseness in his throat. Perfect for news.'
    };

    const headers = {
      'Accept': 'application/json',
      'xi-api-key': XI_API_KEY,
    };

    const formData = new FormData();
    formData.append('name', voiceData.name);
    formData.append('labels', voiceData.labels);
    formData.append('description', voiceData.description);
    formData.append('files', fs.createReadStream(VOICE_SAMPLE_PATH1), 'sample1.mp3');
    formData.append('files', fs.createReadStream(VOICE_SAMPLE_PATH2), 'sample2.mp3');

    const response = await axios.post(add_voice_url, formData, { headers });

    const voice_id = response.data.voice_id;

    // Retrieve default voice settings
    const voiceSettingsResponse = await axios.get("https://api.elevenlabs.io/v1/voices/settings/default", {
      headers: { "Accept": "application/json" }
    });

    const { stability, similarity_boost } = voiceSettingsResponse.data;

    const tts_url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`;

    const ttsData = {
      text: "Some very long text to be read by the voice",
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: stability,
        similarity_boost: similarity_boost
      }
    };

    headers["Content-Type"] = "application/json";

    const ttsResponse = await axios.post(tts_url, ttsData, { headers, responseType: 'stream' });

    const outputStream = fs.createWriteStream(OUTPUT_PATH);

    ttsResponse.data.pipe(outputStream);

    outputStream.on('finish', () => {
      res.status(200).send("Voice added and text-to-speech completed.");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

// Define a route to retrieve history
app.get('/history', async (req, res) => {
  try {
    const headers = {
      'Accept': 'application/json',
      'xi-api-key': XI_API_KEY,
    };

    const response = await axios.get(history_url, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

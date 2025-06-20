# Text-to-Speech Express

A Node.js Express application for recording audio, transcribing speech to text, processing the transcription with GPT, and converting the processed text back to speech.

## Features

- Record audio from the browser and upload it to the server
- Transcribe speech to text using a speech-to-text service
- Process the transcription with GPT (OpenAI)
- Convert processed text back to speech and return audio to the client
- Simple web interface with animated feedback

## Project Structure

```
src/
  app.js                  # Main Express app
  controllers/
    audioController.js    # Handles audio upload and processing
  public/
    images/               # Static images and videos
    scripts/
      script.js           # Frontend JS
    styles/
      home.css            # Frontend CSS
  routes/
    audioRoutes.js        # Audio upload route
    indexRoutes.js        # Main/index routes
  services/
    config.js             # Configuration
    curriculum.js         # (Custom logic)
    gptProcessing.js      # GPT processing logic
    speechToText.js       # Speech-to-text logic
    textToSpeech.js       # Text-to-speech logic
  views/
    index.ejs             # Main frontend view
audio.mp3                 # Temporary uploaded audio file
.env                      # Environment variables
package.json              # Project metadata and dependencies
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd talking-with-me
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys and configuration as needed.

### Running the App

Start the development server:

```sh
npm start
```

The app will run on [http://localhost:8080](http://localhost:8080) by default.

### Usage

- Open the app in your browser.
- Click the microphone button to start recording.
- Click the stop button to finish and upload your audio.
- The app will process your audio and return a response.
# Text-to-Speech Express

A Node.js Express application for recording audio, transcribing speech to text, processing the transcription with GPT, and converting the processed text back to speech.

## Features

- Record audio from the browser and upload it to the server
- Transcribe speech to text using a speech-to-text service
- Process the transcription with GPT (OpenAI)
- Convert processed text back to speech and return audio to the client
- Simple web interface with animated feedback

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
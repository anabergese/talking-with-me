import { getAudioStream, uploadAudio } from './audio.js';
import { toggleRecordingUI, resetUI } from './ui.js';

let mediaRecorder;
let recordedChunks = [];

export async function handleStartRecording(elements) {
  recordedChunks = [];
  toggleRecordingUI(elements, true);

  try {
    const stream = await getAudioStream();
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      toggleRecordingUI(elements, false);
      const response = await uploadAudio(audioBlob);

      if (response?.audiocontent) {
        elements.processingInput.style.display = 'none';
        elements.talkingGif.style.display = 'block';
        document.getElementById('audioContainer').innerHTML = response.audiocontent;
        const audio = document.getElementById('audioHTMLtag');
        audio.play();
        audio.addEventListener('ended', () => {
          elements.talkingGif.style.display = 'none';
        });
      }
    };

    mediaRecorder.start();
    elements.startButton.disabled = true;

  } catch (err) {
    console.error("Microphone access error:", err);
  }
}

export function handleStopRecording(elements) {
  resetUI(elements);
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

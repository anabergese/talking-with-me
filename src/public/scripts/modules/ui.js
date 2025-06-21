export function setupUI() {
  return {
    startButton: document.getElementById('startRecording'),
    stopButton: document.getElementById('stopRecording'),
    micIcon: document.getElementById('mic_icon'),
    processingInput: document.getElementById('processing_input'),
    talkingGif: document.getElementById('talking_gif'),
    backgroundVideo: document.getElementById('backgroundVideo')
  };
}

export function isMobileDevice() {
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent);
}

export function setMobileBackground(videoElement) {
  const source = videoElement.querySelector('source');
  source.setAttribute("src", "/images/background_mobile.mp4");
  videoElement.load();
}

export function toggleRecordingUI({ startButton, micIcon, processingInput }, isRecording) {
  micIcon.style.display = isRecording ? "none" : "block";
  processingInput.style.display = isRecording ? "none" : "block";

  startButton.innerHTML = isRecording
    ? `<img src="/images/audiorecording.gif" id="recording_audio_gif" alt="Recording GIF">`
    : `<img src="/images/mic.svg" alt="microphone icon">`;
}

export function resetUI({ startButton }) {
  startButton.disabled = false;
}

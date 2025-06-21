import {
  handleStartRecording,
  handleStopRecording
} from './modules/handleRecording.js';

import {
  setupUI,
  isMobileDevice,
  setMobileBackground
} from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = setupUI();

  if (isMobileDevice()) {
    setMobileBackground(elements.backgroundVideo);
  }

  elements.startButton.addEventListener('click', () => handleStartRecording(elements));
  elements.stopButton.addEventListener('click', () => handleStopRecording(elements));
});

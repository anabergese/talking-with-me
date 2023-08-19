document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const sendButton = document.getElementById('sendRecording');
    
    let mediaRecorder;
    let recordedChunks = [];
    let audioUrl;

    startButton.addEventListener('click', async () => {
      recordedChunks = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
          audioUrl = URL.createObjectURL(audioBlob);
          return audioUrl;
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
        sendButton.disabled = false;

      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    });

    stopButton.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
      }
    });

    sendButton.addEventListener('click', async () => {
      if (audioUrl) {
        const audioBlob = await fetch(audioUrl).then(response => response.blob());
        const formData = new FormData();
        formData.append('audio', audioBlob);

        fetch('/upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Update the HTML content based on the response data
            if (data.audiocontent) {
              document.getElementById('audioContainer').innerHTML = data.audiocontent;
              document.getElementById('audioHTMLtag').play();
            } else {
              console.lg('No audio processed - error');
            }
        })
        .catch(error => {
            console.error('Error sending audio:', error);
        });
      }
    });
  });
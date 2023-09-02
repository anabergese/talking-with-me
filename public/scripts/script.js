document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const mic_html = document.getElementById('mic_icon');
    const mic_iconURL = "/images/mic.png"; 
    const recordingURL = "/images/audiorecording.gif";

    let mediaRecorder;
    let recordedChunks = [];

    // Preload the GIF image
    const recordingImage = new Image();
    recordingImage.src = recordingURL;

    // Preload the mic_icon image
    const micIconImage = new Image();
    micIconImage.src = mic_iconURL;


    startButton.addEventListener('click', async () => {
      recordedChunks = [];
      mic_html.style.display = "none";
       // Set the GIF as inner HTML
      startButton.innerHTML = `<img src=${recordingURL} id="recording_audio_gif" alt="Recording GIF" width="80" height="80">`;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
           // Create a FormData object to send the audio data to the server
          const formData = new FormData();
          formData.append('audio', audioBlob);

          // Send the audio data to the server
          fetch('/upload', {
              method: 'POST',
              body: formData,
          })
          .then(response => response.json())
          .then(data => {
              console.log("data.audiocontent from script.js:", data.audiocontent);
                // Update the HTML content based on the response data
                if (data.audiocontent) {
                  const recordingImage = document.querySelector('#gifContainer img');
                  recordingImage.style.display = 'block';
                  document.getElementById('audioContainer').innerHTML = data.audiocontent;
                  document.getElementById('audioHTMLtag').play();
                  document.getElementById('audioHTMLtag').addEventListener('ended', () => {
                    // Hide the recordingImage when audio playback is finished
                    recordingImage.style.display = 'none';
                    startButton.innerHTML = `<img src=${mic_iconURL} alt="microphone icon" width="80" height="80">`;
                    stopButton.style.visibility = "hidden";
                  });
                } else {
                  console.log('No audio processed - error');
                }
            })
          .catch(error => {
              console.error('Error uploading audio:', error);
          });
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.style.visibility = "visible";
       
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    });

    stopButton.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        const recording_audio_gif = document.getElementById('recording_audio_gif');
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = false;
        stopButton.classList.add("disable");
        recording_audio_gif.classList.add("hiden");   
      }
    });

  });
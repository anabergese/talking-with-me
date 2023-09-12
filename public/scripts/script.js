document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const mic_html = document.getElementById('mic_icon');
    const mic_iconURL = "/images/mic.svg"; 
    const recordingURL = "/images/audiorecording.gif";
    const talking_gif = document.getElementById('talking_gif');
    const processing_input = document.getElementById('processing_input');
    const backgroundVideo = document.getElementById('backgroundVideo');

    let mediaRecorder;
    let recordedChunks = [];

    // Preload the audio recording gif
    const recordingImage = new Image();
    recordingImage.src = recordingURL;

    // Preload the mic_icon image
    const micIconImage = new Image();
    micIconImage.src = mic_iconURL;

    // BACKGROUND FOR MOBILES
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(navigator.userAgent)) {
      const source = backgroundVideo.querySelector("source");
      // Set the new source URL
      const newSourceUrl = "/images/background_mobile.mp4"; 
      // Replace with your desired source URL
      source.setAttribute("src", newSourceUrl);
      // Load the new source
      console.log("mobile device");

      backgroundVideo.load();
    } else {
        console.log("Desktop device");
    }
  


    //BUTTONS EVENTS
    startButton.addEventListener('click', async () => {
      recordedChunks = [];
      mic_html.style.display = "none";
       // Set the GIF as inner HTML
      startButton.innerHTML = `<img src=${recordingURL} id="recording_audio_gif" alt="Recording GIF">`;

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

          // sacarg gif the background y poner gif the thinking
          console.log("esperando respuesta")
          processing_input.style.display = 'block';

          // Send the audio data to the server
          fetch('/.netlify/functions/api/upload', {
              method: 'POST',
              body: formData,
          })
          .then(response => response.json())
          .then(data => {
                // Update the HTML content based on the response data
                if (data.audiocontent) {         
                  processing_input.style.display = 'none';
                  talking_gif.style.display = 'block';
                  document.getElementById('audioContainer').innerHTML = data.audiocontent;
                  document.getElementById('audioHTMLtag').play();
                  document.getElementById('audioHTMLtag').addEventListener('ended', () => {
                    // Hide the talking_gif when audio playback is finished
                    talking_gif.style.display = 'none';
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
      startButton.innerHTML = `<img src=${mic_iconURL} alt="microphone icon">`;

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
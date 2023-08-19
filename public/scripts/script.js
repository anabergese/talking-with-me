document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const sendButton = document.getElementById('sendRecording');
    const mic_icon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="80" height="80" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M32 4a28 28 0 1 0 28 28A28.005 28.005 0 0 0 32 4zm-6.96 17.46a6.96 6.96 0 0 1 13.92 0v8.15a6.96 6.96 0 0 1-13.92 0zm18.41 8.38a11.522 11.522 0 0 1-10.19 11.37v5.77h4.65v2.52H26.09v-2.52h4.65v-5.77a11.522 11.522 0 0 1-10.19-11.37v-3.67h2.52v3.67a8.93 8.93 0 0 0 17.86 0v-3.67h2.52z" fill="#00a884" data-original="#000000" opacity="1"></path></g></svg>`;
    
    // Hide the SVG
    const svg = startButton.querySelector("svg");
    let mediaRecorder;
    let recordedChunks = [];
    let audioUrl;

    startButton.addEventListener('click', async () => {
      recordedChunks = [];
      svg.style.display = "none";
       // Set the GIF as inner HTML
      const gifURL = "https://i.gifer.com/origin/17/17b79d4cc4204635eaa22c3a66112c1a_w200.gif";
      startButton.innerHTML = `<img src="${gifURL}" id="startButton_gif" alt="Recording GIF" width="80" height="80">`;

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
        stopButton.style.visibility = "visible";
       
        // stopButton.disabled = false;
        // sendButton.disabled = false;

      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    });

    stopButton.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        const startButton_gif = document.getElementById('startButton_gif');

        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
        stopButton.classList.add("disable");
        sendButton.style.visibility = "visible";
        startButton_gif.classList.add("hiden");
        
      }
    });

    sendButton.addEventListener('click', async () => {
      if (audioUrl) {
        const audioBlob = await fetch(audioUrl).then(response => response.blob());
        const formData = new FormData();
        formData.append('audio', audioBlob);
        startButton.disabled = true;
        stopButton.disabled = true;

        fetch('/upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Update the HTML content based on the response data
            if (data.audiocontent) {
              const gifImage = document.querySelector('#gifContainer img');
              gifImage.style.display = 'block';
              document.getElementById('audioContainer').innerHTML = data.audiocontent;
              document.getElementById('audioHTMLtag').play();
              document.getElementById('audioHTMLtag').addEventListener('ended', () => {
                // Hide the gifImage when audio playback is finished
                gifImage.style.display = 'none';
                startButton.innerHTML = mic_icon;
                stopButton.style.visibility = "hidden";
                sendButton.style.visibility = "hidden";
              });
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
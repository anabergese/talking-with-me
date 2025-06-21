export async function getAudioStream() {
  return navigator.mediaDevices.getUserMedia({ audio: true });
}

export async function uploadAudio(blob) {
  const formData = new FormData();
  formData.append('audio', blob);

  try {
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

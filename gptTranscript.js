import OpenAI from 'openai';

const apikeygpt = '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';
const openai = new OpenAI({
  apiKey: apikeygpt
});

export async function transcribeAudio(audioBuffer){
    console.log("Audio File Path:", audioBuffer);

    const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: audioBuffer,
    });
  console.log(response);

  return response;
}







import { gptProcess } from './gptProcess.js';

export async function processTranscription(transcriptionResult) {
  // Process the transcriptionResult using the GPT API
  const processedResult = await gptProcess(transcriptionResult);

  // You can add more processing steps here if needed

  return processedResult;
}

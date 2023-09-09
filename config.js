import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const apikeygpt = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikeygpt,
});

const keyElevenLab = process.env.ELEVENLAB_API_KEY;


export { openai, keyElevenLab };
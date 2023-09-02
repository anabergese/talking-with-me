import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const apikeygpt = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikeygpt,
});

export { openai };
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BibleVerse } from '../types';

let genAI: GoogleGenerativeAI | null = null;
let apiKey: string | null = null;

export function initializeAI(key: string) {
  apiKey = key;
  genAI = new GoogleGenerativeAI(key);
}

export function isAIInitialized(): boolean {
  return !!genAI && !!apiKey;
}

export async function analyzeVerse(verse: BibleVerse, customQuestion?: string): Promise<string> {
  if (!genAI) {
    throw new Error('AI not initialized. Please set Gemini API key in settings.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = customQuestion
    ? `Context: ${verse.textCn} (${verse.textEn})
    
Question: ${customQuestion}

Please provide a thoughtful, scholarly answer in both Chinese and English.`
    : `Please provide a scholarly biblical analysis of the following verse in both Chinese and English:

Chinese: ${verse.textCn}
English: ${verse.textEn}

Reference: ${verse.bookId} ${verse.chapter}:${verse.verse}

Include:
1. Historical and cultural context (历史与文化背景)
2. Original language insights (原文洞见)
3. Theological significance (神学意义)
4. Practical application (实际应用)

Please format your response clearly with headers in both languages.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze verse. Please check your API key and try again.');
  }
}

export async function askQuestion(context: string, question: string): Promise<string> {
  if (!genAI) {
    throw new Error('AI not initialized. Please set Gemini API key in settings.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `Bible Context: ${context}

Question: ${question}

Please provide a thoughtful answer in both Chinese and English, drawing from biblical scholarship and theology.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI question error:', error);
    throw new Error('Failed to get answer. Please try again.');
  }
}

// Streaming support for better UX
export async function analyzeVerseStream(
  verse: BibleVerse,
  customQuestion: string | undefined,
  onChunk: (text: string) => void
): Promise<void> {
  if (!genAI) {
    throw new Error('AI not initialized. Please set Gemini API key in settings.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = customQuestion
    ? `Context: ${verse.textCn} (${verse.textEn})
    
Question: ${customQuestion}

Please provide a thoughtful, scholarly answer in both Chinese and English.`
    : `Please provide a scholarly biblical analysis of the following verse in both Chinese and English:

Chinese: ${verse.textCn}
English: ${verse.textEn}

Reference: ${verse.bookId} ${verse.chapter}:${verse.verse}

Include:
1. Historical and cultural context (历史与文化背景)
2. Original language insights (原文洞见)
3. Theological significance (神学意义)
4. Practical application (实际应用)

Please format your response clearly with headers in both languages.`;

  try {
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error('AI streaming error:', error);
    throw new Error('Failed to analyze verse. Please check your API key and try again.');
  }
}

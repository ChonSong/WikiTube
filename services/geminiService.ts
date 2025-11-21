import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WikiData, WikiEntry } from '../types';

// Using a simulated delay to ensure the processing UI has time to show if the API is too fast
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateChannelContent = async (channelName: string): Promise<WikiData> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Schema definition for structured output
  const entitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      type: { type: Type.STRING, description: "Category of entity, e.g., Person, Tool, Concept" }
    },
    required: ["name", "type"]
  };

  const entrySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      videoId: { type: Type.STRING },
      title: { type: Type.STRING },
      publishDate: { type: Type.STRING },
      summary: { type: Type.STRING, description: "A concise 80-word encyclopaedia summary." },
      fullContent: { type: Type.STRING, description: "A longer, multi-paragraph encyclopaedia article about the video topic (approx 300 words)." },
      entities: { 
        type: Type.ARRAY, 
        items: entitySchema 
      },
      category: { type: Type.STRING },
      sentimentScore: { type: Type.NUMBER, description: "0 is negative, 100 is positive" },
      views: { type: Type.NUMBER }
    },
    required: ["videoId", "title", "publishDate", "summary", "fullContent", "entities", "category", "sentimentScore", "views"]
  };

  const wikiDataSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      channelName: { type: Type.STRING },
      channelDescription: { type: Type.STRING },
      subscribers: { type: Type.STRING },
      entries: {
        type: Type.ARRAY,
        items: entrySchema
      }
    },
    required: ["channelName", "channelDescription", "subscribers", "entries"]
  };

  const prompt = `
    Act as an automated pipeline component that converts a YouTube channel into a formal Encyclopaedia.
    I will provide a channel name: "${channelName}".
    
    You must simulate the output of the "Content Extraction" and "NLP Processing" stages for 6 representative videos from this channel.
    If the channel is real (like "Veritasium", "MrBeast", "Fireship"), use your knowledge to create accurate entries.
    If the channel is generic or unknown, invent realistic content fitting the name.
    
    For each video, generate:
    1. Title and realistic publish date.
    2. "summary": An abstract-style summary (approx 80 words).
    3. "fullContent": A detailed, academic-style article body (approx 300 words). Use objective, third-person language. Avoid "In this video...". Instead use "The content explores..." or describe the subject matter directly.
    4. "entities": Extract key entities (People, Technologies, Locations).
    5. "category": A broad topic classification.
    6. "sentimentScore": 0-100 based on the video's tone.
    7. "views": A realistic view count.

    Ensure the tone is academic, objective, and structured, suitable for a MediaWiki publication.
  `;

  try {
    // Artificial delay for UX (so the user sees the pipeline animation)
    await delay(2000);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: wikiDataSchema,
        temperature: 0.5, // Lower temperature for more consistent, factual-sounding output
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    const data = JSON.parse(text) as WikiData;
    
    // Add client-side IDs
    data.entries = data.entries.map((entry, idx) => ({
      ...entry,
      id: `vid_${idx}_${Date.now()}`,
      channelName: data.channelName // Helper for display
    }));
    
    // Update the total video count based on generated items
    data.totalVideos = data.entries.length;

    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process channel data via AI Pipeline.");
  }
};
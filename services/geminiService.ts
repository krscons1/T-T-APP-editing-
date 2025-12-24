
import { GoogleGenAI, Type } from "@google/genai";
import { Segment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTranscripts = async (videoName: string): Promise<Segment[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a sample diarized transcript for a 30-second video called "${videoName}". 
    Create exactly 6 segments. Each segment must have:
    - startTime (seconds)
    - endTime (seconds)
    - tamilText (Native Tamil script)
    - tanglishText (Tamil written in English characters)
    - score (A number 1-100 representing how viral or engaging the content is)
    - speakerId (Speaker 1 or Speaker 2)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            startTime: { type: Type.NUMBER },
            endTime: { type: Type.NUMBER },
            tamilText: { type: Type.STRING },
            tanglishText: { type: Type.STRING },
            score: { type: Type.NUMBER },
            speakerId: { type: Type.STRING }
          },
          required: ["id", "startTime", "endTime", "tamilText", "tanglishText", "score", "speakerId"]
        }
      }
    }
  });

  const segments = JSON.parse(response.text || "[]");
  return segments.map((s: any) => ({ ...s, isSelected: false }));
};

export const translateSegments = async (segments: Segment[]): Promise<Segment[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following Tamil segments to English. Preserve the context.
    Segments: ${JSON.stringify(segments.map(s => ({ id: s.id, text: s.tamilText })))}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            englishText: { type: Type.STRING }
          },
          required: ["id", "englishText"]
        }
      }
    }
  });

  const translations = JSON.parse(response.text || "[]");
  return segments.map(s => {
    const t = translations.find((item: any) => item.id === s.id);
    return t ? { ...s, englishText: t.englishText } : s;
  });
};

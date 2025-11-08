import { GoogleGenAI, Type } from "@google/genai";
import type { PlantInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const identifyPlant = async (file: File): Promise<PlantInfo> => {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `You are a botanist expert. Your task is to identify the plant in the user's image.
    
    Instructions:
    1. Analyze the image to identify the plant species.
    2. Provide the common name of the plant.
    3. Provide the recommended watering frequency in whole days (e.g., 7 for once a week).
    4. If the image is not a plant or the plant cannot be identified, return an error message.
    
    Respond ONLY with a JSON object that strictly follows the schema.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    imagePart,
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        plantName: {
                            type: Type.STRING,
                            description: "The common name of the identified plant."
                        },
                        wateringFrequencyDays: {
                            type: Type.INTEGER,
                            description: "The recommended number of days between watering."
                        },
                        error: {
                          type: Type.STRING,
                          description: "An error message if identification fails.",
                          nullable: true,
                        }
                    },
                    propertyOrdering: ["plantName", "wateringFrequencyDays", "error"]
                }
            }
        });
        
        const textResponse = response.text.trim();
        const parsedJson = JSON.parse(textResponse);
        
        if(parsedJson.error) {
            return { error: parsedJson.error, plantName: '', wateringFrequencyDays: 0 };
        }
        
        return parsedJson as PlantInfo;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            plantName: '',
            wateringFrequencyDays: 0,
            error: "Could not identify the plant. The service may be unavailable. Please try again later."
        };
    }
};

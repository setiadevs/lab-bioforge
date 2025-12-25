
import { GoogleGenAI, Type } from "@google/genai";
import { SpecimenCategory, CreationRequest, SpecimenProfile } from "../types";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpecimenData = async (request: CreationRequest, lang: Language): Promise<Partial<SpecimenProfile>> => {
  const languageName = lang === 'id' ? 'Indonesian' : 'English';
  
  const prompt = `Act as a senior Xenobiologist. Create a detailed biological profile for a new ${request.category} species based on the following concept: "${request.baseIdea}". 
  Specific traits provided: Size: ${request.traits.size}, Color: ${request.traits.primaryColor}, Habitat: ${request.traits.habitat}, Behavior: ${request.traits.behavior}.
  
  IMPORTANT: All text fields (name, scientificName, description, abilities, habitatDetail, diet, lifespan) MUST be in ${languageName}.
  Provide realistic or fascinating biological details. The response must be structured as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          taxonomy: { type: Type.STRING },
          uniqueAbilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          habitatDetail: { type: Type.STRING },
          diet: { type: Type.STRING },
          lifespan: { type: Type.STRING }
        },
        required: ["name", "scientificName", "description", "taxonomy", "uniqueAbilities", "habitatDetail", "diet", "lifespan"]
      },
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text);
};

export const generateSpecimenImage = async (profile: Partial<SpecimenProfile>, request: CreationRequest): Promise<string> => {
  const prompt = `A hyper-realistic, high-fidelity biological photograph of a new ${request.category} species named ${profile.name}. 
  Description: ${profile.description}. 
  Visual features: ${request.traits.primaryColor} textures and body, ${request.traits.size} scale, captured in its natural environment of ${profile.habitatDetail}. 
  Style: National Geographic award-winning wildlife photography. 8k resolution, photorealistic, incredible detail, macro photography lens, realistic skin/leaf/shell textures, cinematic natural lighting, shallow depth of field, sharp focus, real-world physics. Avoid any digital painting or conceptual art looks.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const candidate of response.candidates || []) {
    for (const part of candidate.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Failed to generate specimen image.");
};

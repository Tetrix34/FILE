import { GoogleGenAI, Type } from "@google/genai";

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might handle this more gracefully, but for this context, an error is fine.
  console.warn("API_KEY is not defined. Using a placeholder. AI features will not work.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || 'YOUR_API_KEY_PLACEHOLDER' });

export interface BrandStory {
  title: string;
  story: string[];
  image_prompt: string;
}

export async function generateBrandStory(topic: string): Promise<BrandStory> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Eres un copywriter creativo para una mueblería guatemalteca llamada "La Casita". Tu tono es cálido, emocional y familiar. Genera una breve historia de marca inspiradora (2 párrafos) sobre el tema "${topic}". La historia debe conectar los muebles con la creación de recuerdos y un hogar feliz. Además, proporciona un título atractivo para la historia y un prompt para generar una imagen que la represente visualmente. Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura: {"title": "string", "story": ["string", "string"], "image_prompt": "string"}. No incluyas "'''json" ni nada más.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            story: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            image_prompt: { type: Type.STRING },
          },
          required: ["title", "story", "image_prompt"],
        },
        temperature: 0.8,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("La respuesta de la API de Gemini está vacía.");
    }
    const jsonText = text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    // Basic validation
    if (
      !parsedResponse.title ||
      !Array.isArray(parsedResponse.story) ||
      !parsedResponse.image_prompt
    ) {
      throw new Error("La respuesta de la API no tiene el formato esperado.");
    }

    return parsedResponse as BrandStory;

  } catch (error) {
    console.error("Error al generar la historia de marca:", error);
    throw new Error("No se pudo generar la historia. Inténtalo de nuevo más tarde.");
  }
}

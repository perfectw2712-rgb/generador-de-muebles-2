import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
    const headers = { 'Content-Type': 'application/json' };

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Método no permitido.' }) 
        };
    }
    
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set for Netlify function.");
        return { 
            statusCode: 500, 
            headers,
            body: JSON.stringify({ error: "Error de configuración en el servidor." }) 
        };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { prompt } = JSON.parse(event.body || '{}');
        if (!prompt) {
            return { 
                statusCode: 400, 
                headers,
                body: JSON.stringify({ error: 'La descripción (prompt) es requerida.' }) 
            };
        }

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ imageData: base64ImageBytes }),
            };
        } else {
            console.error("API response did not contain generated images.", response);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'La API no generó ninguna imagen.' })
            };
        }
    } catch (error) {
        console.error("Error in generateImage function:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error interno al generar la imagen.";
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: errorMessage })
        };
    }
};

export { handler };
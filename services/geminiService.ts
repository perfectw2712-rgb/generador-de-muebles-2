export const generateFurnitureImage = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/.netlify/functions/generateImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Ocurrió un error desconocido en el servidor.' }));
            throw new Error(errorData.error || `La solicitud falló con el estado ${response.status}`);
        }

        const data = await response.json();
        if (data.imageData) {
            return data.imageData;
        } else {
            throw new Error("No se recibieron datos de imagen del servidor.");
        }
    } catch (error) {
        console.error("Error al llamar a la función de Netlify:", error);
        if (error instanceof Error) {
            // Re-lanzar el error para que el componente de la UI pueda mostrarlo.
            throw error;
        }
        throw new Error("Fallo al generar la imagen debido a un error desconocido.");
    }
};

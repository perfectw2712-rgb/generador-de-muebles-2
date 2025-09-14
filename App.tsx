
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Logo } from './components/Logo';
import { Spinner } from './components/Spinner';
import { FurnitureType } from './types';

const App: React.FC = () => {
    const [furnitureType, setFurnitureType] = useState<FurnitureType>(FurnitureType.Table);
    const [description, setDescription] = useState<string>('Una mesa de centro minimalista con una cubierta de madera de roble gruesa y patas de acero negro mate en forma de X.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        const prompt = `Una imagen fotorrealista de un mueble de estilo industrial.
        Tipo de mueble: ${furnitureType}.
        Descripción: ${description}.
        El diseño debe enfatizar la soldadura de alta calidad, la robustez de las estructuras metálicas y la belleza natural de la madera. El ambiente debe ser un loft moderno o un taller.`;

        try {
            if (!process.env.API_KEY) {
              throw new Error("La variable de entorno API_KEY no está configurada. Asegúrate de configurarla en tu entorno.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
                const imageData = response.generatedImages[0].image.imageBytes;
                setGeneratedImage(`data:image/jpeg;base64,${imageData}`);
            } else {
                throw new Error("La API no devolvió ninguna imagen.");
            }
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado al generar la imagen.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [furnitureType, description]);

    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 selection:bg-orange-500 selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <header className="w-full max-w-5xl text-center py-6">
                <Logo />
                <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-100" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Generador de Muebles Industriales
                </h1>
                <p className="text-gray-400 mt-2">
                    Visualiza conceptos de muebles únicos con el poder de la IA.
                </p>
            </header>

            <main className="w-full max-w-5xl flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 flex flex-col gap-6">
                    <div>
                        <label htmlFor="furnitureType" className="block text-sm font-medium text-gray-300 mb-2">1. Selecciona el tipo de mueble</label>
                        <select
                            id="furnitureType"
                            value={furnitureType}
                            onChange={(e) => setFurnitureType(e.target.value as FurnitureType)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        >
                            {Object.values(FurnitureType).map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">2. Describe tu idea</label>
                        <textarea
                            id="description"
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Una estantería alta con 5 baldas de madera reciclada y estructura de tubo de acero soldado..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none"
                        />
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-orange-500/50"
                    >
                        {isLoading ? <><Spinner /> Generando...</> : 'Generar Diseño'}
                    </button>
                    {error && <p className="text-red-400 text-center bg-red-900/20 border border-red-500/30 p-3 rounded-md">{error}</p>}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 flex items-center justify-center min-h-[300px] lg:min-h-full">
                    {isLoading ? (
                        <div className="text-center">
                            <Spinner size="lg" />
                            <p className="mt-4 text-gray-400">Creando tu concepto...</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="Mueble generado" className="rounded-md w-full h-full object-contain shadow-inner" />
                    ) : (
                        <div className="text-center text-gray-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="mt-2">La imagen de tu mueble aparecerá aquí.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;

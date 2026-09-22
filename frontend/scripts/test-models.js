import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("No se encontro VITE_GEMINI_API_KEY en frontend/.env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    console.log("Consultando modelos disponibles...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
        console.log("Modelos disponibles que soportan generateContent:");
        data.models.forEach(m => {
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name.replace('models/', '')}`);
            }
        });
    } else {
        console.log("Respuesta de la API:", data);
    }
  } catch (err) {
    console.error("Error al consultar:", err);
  }
}

listModels();

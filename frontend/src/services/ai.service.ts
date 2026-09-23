import { GoogleGenAI } from '@google/genai';

// Inicializamos el SDK con la llave del .env
// Vite inyecta import.meta.env en tiempo de construccin/desarrollo
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export class AIService {
  /**
   * Enva una imagen base64 a Gemini 1.5 Flash para extraer la estructura del diagrama
   * adaptada especficamente para React Flow y nuestros nodos UML.
   */
  static async generateDiagramFromImage(base64Image: string, mimeType: string) {
    const prompt = `
      Eres un experto en diagramas UML de software. Analiza la imagen adjunta (un diagrama dibujado) y extrae su estructura para renderizarlo en React Flow.
      
      Los tipos de nodos soportados son: "umlClass", "umlInterface", "umlEnum", "umlIntermediateClass", "umlNote", "umlComment".
      El tipo de edge soportado es: "umlEdge".

      Reglas para Nodos:
      - "id": un string nico corto (ej. "node-1").
      - "type": uno de los soportados (ej. "umlClass").
      - "position": { "x": numero_aleatorio_x, "y": numero_aleatorio_y } (intenta posicionarlos de forma lgica espaciados).
      - "data": 
         - "label": Nombre de la clase o entidad.
         - "attributes": [{ "visibility": "-", "name": "id", "type": "int" }, ...] (si aplica).
         - "methods": [{ "visibility": "+", "name": "save", "returnType": "void" }, ...] (si aplica).

      Reglas para Edges:
      - "id": string nico (ej. "edge-1").
      - "type": "umlEdge"
      - "source": id del nodo origen.
      - "target": id del nodo destino.
      - "data": 
         - "relationType": puede ser "umlAssociation", "umlGeneralization", "umlRealization", "umlDependency", "umlAggregation", "umlComposition".
         - "sourceMultiplicity": ej. "1" o "0..*"
         - "targetMultiplicity": ej. "*" o "1"
         - "roleName": string descriptivo o vaco.

      Devuelve NICAMENTE un objeto JSON vlido sin texto adicional ni bloques de cdigo markdown (\`\`\`json).
      Estructura esperada:
      {
        "nodes": [...],
        "edges": [...]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Image.split(',')[1] || base64Image, mimeType: mimeType } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      if (!response.text) throw new Error("No hay respuesta de Gemini");
      
      let rawText = response.text;
      // Limpiar backticks de markdown por si Gemini los incluye ignorando las instrucciones
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      console.log("JSON limpio recibido de Gemini:", rawText);
      return JSON.parse(rawText);
    } catch (error) {
      console.error("Error al generar diagrama desde imagen:", error);
      throw error;
    }
  }
}

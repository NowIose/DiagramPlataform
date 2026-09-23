import { GoogleGenAI, Type } from '@google/genai';

// Usamos la nueva llave específica para el chat
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_CHAT_API_KEY });

// Definición de las herramientas (Schema) para decirle a Gemini qué puede hacer
const editorTools: any = [
  {
    functionDeclarations: [
      {
        name: "addNode",
        description: "Agrega un nuevo nodo UML (como una clase, interfaz o nota) al diagrama.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "El tipo de nodo. Opciones: 'umlClass', 'umlNote', 'umlInterface', 'umlEnum'" },
            label: { type: Type.STRING, description: "El nombre de la clase o el texto de la nota." }
          },
          required: ["type", "label"]
        }
      },
      {
        name: "connectNodes",
        description: "Conecta dos nodos existentes en el lienzo usando sus IDs. Permite especificar cardinalidad.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            sourceId: { type: Type.STRING, description: "El ID del nodo de origen." },
            targetId: { type: Type.STRING, description: "El ID del nodo de destino." },
            relationType: { type: Type.STRING, description: "Tipo de relación UML. Ej: 'umlAssociation', 'umlGeneralization', 'umlDependency', 'umlAggregation', 'umlComposition'" },
            sourceMultiplicity: { type: Type.STRING, description: "Opcional. Multiplicidad del origen (ej. '1', '0..*')." },
            targetMultiplicity: { type: Type.STRING, description: "Opcional. Multiplicidad del destino (ej. '1', '1..*')." }
          },
          required: ["sourceId", "targetId", "relationType"]
        }
      },
      {
        name: "deleteNode",
        description: "Elimina un nodo específico del diagrama.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            nodeId: { type: Type.STRING, description: "El ID del nodo que se va a eliminar." }
          },
          required: ["nodeId"]
        }
      },
      {
        name: "addAttribute",
        description: "Agrega un atributo (propiedad) a una clase UML existente.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            nodeId: { type: Type.STRING, description: "El ID del nodo clase al que se agregará el atributo." },
            visibility: { type: Type.STRING, description: "Visibilidad ('+', '-', '#', '~')." },
            name: { type: Type.STRING, description: "Nombre del atributo." },
            dataType: { type: Type.STRING, description: "Tipo de dato (ej. 'String', 'int')." }
          },
          required: ["nodeId", "visibility", "name", "dataType"]
        }
      },
      {
        name: "addMethod",
        description: "Agrega un método (función) a una clase UML existente.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            nodeId: { type: Type.STRING, description: "El ID del nodo clase." },
            visibility: { type: Type.STRING, description: "Visibilidad ('+', '-', '#')." },
            name: { type: Type.STRING, description: "Nombre del método (ej. 'calcularTotal')." },
            returnType: { type: Type.STRING, description: "Tipo de retorno (ej. 'void', 'int')." }
          },
          required: ["nodeId", "visibility", "name", "returnType"]
        }
      }
    ]
  }
];

export class ChatService {
  /**
   * Envía el mensaje del usuario a Gemini junto con el contexto del diagrama y las herramientas.
   */
  static async sendMessage(prompt: string, diagramContext: string) {
    try {
      const systemInstruction = `
Eres un asistente experto en arquitectura de software integrado en un editor de diagramas UML. 
Tu objetivo es ayudar al usuario a construir su diagrama respondiendo a sus peticiones y EJECUTANDO herramientas.
Si el usuario te pide crear, conectar o borrar algo, SIEMPRE debes usar las function_calls en lugar de solo decirle cómo hacerlo.

El estado actual del diagrama (los nodos que existen en el lienzo) es el siguiente:
${diagramContext}

Nota: Para conectar o modificar nodos, debes usar estrictamente los IDs mencionados en el estado actual.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          { role: 'model', parts: [{ text: 'Entendido. Estoy listo para usar las herramientas para modificar el diagrama según tus órdenes.' }] },
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          tools: editorTools,
          temperature: 0.1, // Temperatura baja para respuestas más precisas y analíticas
        }
      });

      return response;
    } catch (error) {
      console.error("Error en ChatService:", error);
      throw error;
    }
  }
}

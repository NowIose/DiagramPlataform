import React, { useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { AIService } from '../../services/ai.service';

export default function ImageToDiagramButton() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setNodes, setEdges, getNodes } = useReactFlow();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Convertir imagen a Base64 con Promise para poder esperar
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
        
      // 2. Llamar a nuestro servicio de IA
      console.log("Enviando imagen a Gemini...");
      const diagramData = await AIService.generateDiagramFromImage(base64, file.type);
      console.log("Datos recibidos:", diagramData);
      
      // 3. Obtener offset para no superponer si ya hay nodos en el lienzo (opcional)
      const currentNodes = getNodes();
      const offsetX = currentNodes.length > 0 ? 300 : 0;
      
      // Ajustar el ID de los nodos y posiciones si es necesario
      const newNodes = (diagramData.nodes || []).map((n: any) => ({
        ...n,
        id: `ai-${Date.now()}-${n.id}`, // Evitar colisiones de IDs
        position: { 
          x: (n.position?.x || Math.random() * 200) + offsetX, 
          y: (n.position?.y || Math.random() * 200) 
        }
      }));

      // Ajustar edges con los nuevos IDs
      const newEdges = (diagramData.edges || []).map((e: any) => ({
        ...e,
        id: `ai-${Date.now()}-${e.id}`,
        source: `ai-${Date.now()}-${e.source}`,
        target: `ai-${Date.now()}-${e.target}`
      }));

      console.log("Agregando al lienzo:", newNodes.length, "nodos y", newEdges.length, "edges.");
      // 4. Agregar al lienzo de React Flow (sin borrar lo existente)
      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
      
    } catch (error: any) {
      console.error("Error procesando imagen:", error);
      const errorStr = String(error);
      if (errorStr.includes("503") || errorStr.includes("UNAVAILABLE")) {
        alert("El servidor de Inteligencia Artificial de Google está temporalmente saturado (Error 503).\n\nPor favor, espera unos segundos e inténtalo de nuevo.");
      } else {
        alert("Hubo un error al procesar la imagen con IA. Revisa la consola para más detalles.");
      }
    } finally {
      setIsLoading(false);
      // Resetear el input para permitir subir la misma imagen de nuevo
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className={`px-3 py-1.5 rounded-lg text-xs font-label font-semibold flex items-center gap-1 transition-all ${
          isLoading 
            ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' 
            : 'bg-secondary/10 hover:bg-secondary/20 text-secondary'
        }`}
        title="Generar diagrama desde imagen"
      >
        <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-pulse' : ''}`}>
          {isLoading ? 'hourglass_empty' : 'image'}
        </span>
        {isLoading ? 'Analizando...' : 'Desde Imagen'}
      </button>
    </>
  );
}

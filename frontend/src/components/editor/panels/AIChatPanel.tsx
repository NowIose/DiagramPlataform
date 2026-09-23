import { useState, useRef, useEffect } from 'react';
import { useEditorTools } from '../../../hooks/useEditorTools';
import { ChatService } from '../../../services/chat.service';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu Copiloto IA. Dime qué quieres hacer en el diagrama o presiona el micrófono.' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorTools = useEditorTools();

  // Web Speech API
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Inicializar Speech Recognition si el navegador lo soporta
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'es-ES'; // O el idioma que prefieras
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Error de reconocimiento de voz:', event.error);
        setIsListening(false);
        playMicSound(false);
        if (event.error === 'network') {
          alert("Error de red: El navegador no pudo conectarse a su servidor de reconocimiento de voz. Verifica tu conexión o intenta reiniciar el navegador.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        playMicSound(false);
        
        // Auto-envío: dar tiempo a React de actualizar el estado 'input' y simular el clic
        setTimeout(() => {
          const sendBtn = document.getElementById('ai-send-btn');
          if (sendBtn && !sendBtn.hasAttribute('disabled')) {
            sendBtn.click();
          }
        }, 500);
      };
    }
  }, []);

  // Función súper ligera usando la API nativa de Audio del navegador (sin archivos externos)
  const playMicSound = (isStarting: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      
      if (isStarting) {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      }
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("No se pudo reproducir el sonido del micrófono", e);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      playMicSound(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        playMicSound(true);
      } else {
        alert("Tu navegador no soporta la entrada de voz.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // 1. Obtener contexto del diagrama
      const context = editorTools.getDiagramSummary();
      
      // 2. Enviar a Gemini
      const response = await ChatService.sendMessage(userMsg, context);
      
      // 3. Procesar respuestas y llamadas a herramientas (Tool Calling)
      let modelResponseText = "Hecho.";
      
      if (response.functionCalls && response.functionCalls.length > 0) {
        modelResponseText = "He ejecutado las siguientes acciones:\n";
        
        for (const call of response.functionCalls) {
          const { name, args } = call;
          try {
            let result = "";
            if (name === 'addNode' && args) {
              result = editorTools.addNode(args.type as string, args.label as string);
              modelResponseText += `- Agregado nodo: ${args.label}\n`;
            } else if (name === 'connectNodes' && args) {
              result = editorTools.connectNodes(args.sourceId as string, args.targetId as string, args.relationType as string, args.sourceMultiplicity as string, args.targetMultiplicity as string);
              modelResponseText += `- Conectados nodos\n`;
            } else if (name === 'deleteNode' && args) {
              result = editorTools.deleteNode(args.nodeId as string);
              modelResponseText += `- Eliminado nodo: ${args.nodeId}\n`;
            } else if (name === 'addAttribute' && args) {
              result = editorTools.addAttribute(args.nodeId as string, args.visibility as string, args.name as string, args.dataType as string);
              modelResponseText += `- Atributo ${args.name} añadido\n`;
            } else if (name === 'addMethod' && args) {
              result = editorTools.addMethod(args.nodeId as string, args.visibility as string, args.name as string, args.returnType as string);
              modelResponseText += `- Método ${args.name}() añadido\n`;
            }
            console.log(`Tool ${name} ejecutada:`, result);
          } catch (e) {
            console.error(`Error ejecutando tool ${name}:`, e);
          }
        }
      } else if (response.text) {
        // Respuesta normal de texto sin llamar herramientas
        modelResponseText = response.text;
      }

      setMessages(prev => [...prev, { role: 'model', text: modelResponseText }]);

    } catch (error: any) {
      console.error("Error en chat:", error);
      const errorStr = String(error);
      if (errorStr.includes("503") || errorStr.includes("UNAVAILABLE")) {
        setMessages(prev => [...prev, { role: 'model', text: "⚠️ Los servidores de IA de Google están experimentando alta demanda (Error 503). Por favor, espera un momento y vuelve a enviar tu mensaje." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Lo siento, hubo un error técnico al procesar tu solicitud. Revisa la consola para más detalles." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-container-lowest overflow-hidden">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface-container-lowest">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
            <span className="text-[10px] font-bold text-on-surface-variant mb-1 ml-1">
              {msg.role === 'user' ? 'Tú' : 'Copiloto'}
            </span>
            <div className={`p-2.5 rounded-xl text-xs shadow-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-primary text-on-primary rounded-tr-none' 
                : 'bg-surface border border-surface-container-high text-on-surface rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="self-start items-start flex flex-col">
             <div className="p-2.5 rounded-xl text-xs bg-surface border border-surface-container-high text-on-surface-variant rounded-tl-none animate-pulse">
               Pensando...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Caja de entrada */}
      <div className="p-3 bg-surface border-t border-surface-container-low flex items-end gap-2">
        <button 
          onClick={toggleListen}
          className={`p-2 rounded-full shrink-0 transition-colors ${
            isListening 
              ? 'bg-error text-on-error animate-pulse' 
              : 'bg-secondary-container text-on-secondary-container hover:bg-secondary/20'
          }`}
          title={isListening ? "Escuchando... clic para detener" : "Dictar por voz"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isListening ? 'mic' : 'mic_none'}
          </span>
        </button>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ej: Agrega una clase Usuario..."
          className="flex-1 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-2 text-xs resize-none outline-none focus:border-primary max-h-24 min-h-[36px]"
          rows={1}
        />
        
        <button 
          id="ai-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
}

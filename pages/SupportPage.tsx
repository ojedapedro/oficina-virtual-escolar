
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Bot, Send, User, Loader2 } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy tu asistente de la Oficina Virtual. ¿Tienes dudas sobre cómo registrar un pago o cuáles son los niveles educativos?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Eres un asistente amable de la Oficina Virtual del Colegio San José. 
          Ayudas a los representantes con dudas sobre:
          - Niveles: Maternal, Pre-escolar, Primaria, Secundaria.
          - Métodos de pago: Transferencia, Pago Móvil, Zelle, Binance, Efectivo.
          - El proceso consiste en: 1. Pagar en el banco 2. Tomar captura/datos 3. Llenar el formulario en la web.
          No inventes números de cuenta si no te los dan, dile que revise la sección de 'Datos de Pago'.
          Responde siempre en español y de forma servicial.`
        }
      });

      const botText = response.text || "Lo siento, no pude procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Hubo un problema al conectar con el asistente. Por favor intenta más tarde." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col space-y-4 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Asistente Virtual</h2>
        <p className="text-slate-500">Consulta cualquier duda sobre el proceso administrativo.</p>
      </header>

      <div className="flex-1 bg-white border rounded-2xl overflow-hidden flex flex-col shadow-sm">
        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}
                `}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`
                  p-4 rounded-2xl text-sm leading-relaxed
                  ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}
                `}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-2xl text-slate-400 text-xs">
                <Loader2 className="animate-spin" size={14} />
                <span>Escribiendo...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-slate-50">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda aquí..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

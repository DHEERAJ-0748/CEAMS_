import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles,
  Minimize2,
  ChevronDown
} from 'lucide-react';

const JarvisChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Greetings, ${user?.name?.split(' ')[0]}. I am JARVIS. I've integrated with your ${user?.role} dashboard data. How can I assist you with your event management today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Map history for Gemini (excluding the system greeting)
      const history = messages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const { data } = await axios.post('/api/ai/chat', { 
        message: currentInput,
        history: history
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "I apologize, but I am experiencing some latency in my neural processing units. Please try again in a moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[400px] h-[550px] bg-white rounded-[32px] shadow-2xl shadow-brand-900/20 border border-surface-100 flex flex-col overflow-hidden animate-scale-up origin-bottom-right">
          {/* Header */}
          <div className="p-6 bg-surface-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-widest uppercase">JARVIS</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">Neural Link Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <Minimize2 className="w-5 h-5 text-surface-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-50/30 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.role === 'assistant' 
                    ? 'bg-white text-surface-800 border border-surface-100 rounded-bl-none' 
                    : 'bg-brand-600 text-white rounded-br-none shadow-brand-500/20'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-surface-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 bg-white border-t border-surface-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Jarvis..."
                className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-5 py-4 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-surface-400"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2.5 bg-surface-900 text-white rounded-xl hover:bg-surface-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-surface-400 mt-4 font-bold uppercase tracking-widest">
              AI assistant may provide inaccurate info.
            </p>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative ${
          isOpen ? 'bg-surface-900 text-white rotate-90' : 'bg-brand-600 text-white'
        }`}
      >
        {isOpen ? <X className="w-7 h-7" /> : (
          <>
            <Bot className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500 border-2 border-white"></span>
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default JarvisChat;

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Message, MessageRole } from '../types';
import { MessageBubble } from '../components/Chat/MessageBubble';
import { Icons } from '../constants';
import { generateChatResponseStream, analyzeImage } from '../services/geminiService';

export const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: MessageRole.Model,
      text: "Hello. I am Lumina. I can assist you with writing, analysis, and creative tasks. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ data: string; mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract purely base64 data and mime type
      const matches = base64String.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
         setAttachment({
             mimeType: matches[1],
             data: matches[2]
         });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: MessageRole.User,
      text: input,
      imageUrl: attachment ? `data:${attachment.mimeType};base64,${attachment.data}` : undefined,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    
    const tempAttachment = attachment;
    setAttachment(null); // Clear immediately

    const modelMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: modelMessageId,
        role: MessageRole.Model,
        text: '',
        isThinking: true,
        timestamp: Date.now(),
      },
    ]);

    try {
      if (tempAttachment) {
        // Vision Request (Single turn for now simplicity in demo)
        const responseText = await analyzeImage(tempAttachment.data, tempAttachment.mimeType, input || "Describe this image");
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? { ...msg, text: responseText, isThinking: false }
              : msg
          )
        );
      } else {
        // Text Chat Stream
        // Prepare history for API
        const history = messages.map(m => ({
            role: m.role === MessageRole.User ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        await generateChatResponseStream(input, history, (chunkText) => {
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.id === modelMessageId) {
               return [
                   ...prev.slice(0, -1),
                   { ...lastMsg, text: lastMsg.text + chunkText, isThinking: false }
               ];
            }
            return prev;
          });
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: MessageRole.Model,
          text: "I apologize, but I encountered an error processing your request.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      // Ensure thinking state is removed if not already
       setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? { ...msg, isThinking: false }
              : msg
          )
        );
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth" ref={scrollRef}>
        <div className="space-y-2">
            {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-lg border-t border-zinc-800">
        {attachment && (
            <div className="mb-2 inline-flex items-center bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                <Icons.Image className="w-3 h-3 mr-2" />
                Image attached
                <button onClick={() => setAttachment(null)} className="ml-2 text-zinc-500 hover:text-white">×</button>
            </div>
        )}
        <div className="flex items-end gap-2 bg-surface border border-zinc-800 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-400 hover:text-primary h-10 w-10 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icons.Plus className="w-5 h-5" />
          </Button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-100 placeholder-zinc-500 resize-none py-2.5 max-h-32 overflow-y-auto"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          
          <Button 
            variant="primary" 
            size="icon" 
            className={`h-10 w-10 rounded-lg transition-all duration-300 ${input.trim() || attachment ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || isLoading}
          >
            {isLoading ? <Icons.Loader className="animate-spin w-5 h-5" /> : <Icons.Send className="w-5 h-5" />}
          </Button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-zinc-600">Powered by Gemini 2.5 Flash & Pro</span>
        </div>
      </div>
    </div>
  );
};
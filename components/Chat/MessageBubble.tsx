import React from 'react';
import { Message, MessageRole } from '../../types';
import { Icons } from '../../constants';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User;

  // Simple helper to detect code blocks and format them loosely
  // In a real app, we'd use react-markdown + syntax highlighting
  const formatText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const content = part.slice(3, -3).replace(/^[a-z]+\n/, ''); // Remove lang identifier loosely
        return (
          <div key={i} className="my-3 bg-[#09090b] border border-zinc-800 rounded-md p-3 overflow-x-auto">
            <pre className="text-xs font-mono text-zinc-300">
              <code>{content.trim()}</code>
            </pre>
          </div>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${isUser ? 'bg-primary ml-3' : 'bg-gradient-to-br from-emerald-500 to-teal-600 mr-3'}`}>
          {isUser ? (
            <span className="text-xs font-bold text-white">U</span>
          ) : (
            <Icons.Sparkles className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              isUser
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-surface border border-zinc-800 text-zinc-200 rounded-tl-sm'
            }`}
          >
            {message.imageUrl && (
              <div className="mb-3 overflow-hidden rounded-lg border border-white/10">
                 <img src={message.imageUrl} alt="User Upload" className="max-h-64 w-auto object-cover" />
              </div>
            )}
            {formatText(message.text)}
            
            {message.isThinking && (
               <div className="flex gap-1 mt-2 h-4 items-center">
                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
               </div>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
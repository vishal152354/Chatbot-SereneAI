
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      {isLoading && messages[messages.length-1].role === 'user' && (
        <div className="flex justify-start">
           <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-none p-3 max-w-xs md:max-w-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

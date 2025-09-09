import React, { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from './types';
import { getChat } from './services/geminiService';
import type { Chat } from '@google/genai';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import type { GenerateContentResponse } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I'm SereneMind. How can I help you find some clarity today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setChat(getChat());
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during initialization.');
      }
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!chat) {
      setError("Chat service is not available.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    // Add a placeholder for the model's response
    setMessages(prev => [...prev, { role: 'model', content: '' }]);

    try {
      const result = await chat.sendMessageStream({ message });
      
      let text = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        text += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = text;
          return newMessages;
        });
      }
    } catch (e) {
        const errorMessage = "Sorry, I encountered an error. Please try again. Check if API key is configured correctly.";
        console.error(e);
        setError(errorMessage);
        setMessages(prev => {
           const newMessages = [...prev];
           // Remove the user message and the placeholder on error
           // FIX: Replace `findLastIndex` with a reverse for-loop for compatibility with older JavaScript environments.
           let lastUserMessageIndex = -1;
           for (let i = newMessages.length - 1; i >= 0; i--) {
             if (newMessages[i].role === 'user') {
               lastUserMessageIndex = i;
               break;
             }
           }
           if (lastUserMessageIndex > -1) {
             // also remove model placeholder
             return newMessages.slice(0, lastUserMessageIndex);
           }
           return newMessages;
        });
    } finally {
      setIsLoading(false);
    }
  }, [chat]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white p-4"
      style={{ backgroundImage: `url('https://picsum.photos/seed/university/1920/1080')` }}
    >
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-3xl h-[95vh] flex flex-col bg-slate-800/80 shadow-2xl rounded-2xl border border-slate-700/50">
        <Header />
        {error && (
            <div className="p-4 m-4 bg-red-500/30 border border-red-500 text-red-300 rounded-lg">
                <p><strong>Error:</strong> {error}</p>
            </div>
        )}
        <ChatWindow messages={messages} isLoading={isLoading} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
       <footer className="relative text-center text-slate-400 text-xs mt-2">
            <p>Created by a world-class senior frontend React engineer.</p>
        </footer>
    </div>
  );
};

export default App;
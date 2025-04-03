'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useChatStore, ChatMessage } from '../store/chatStore';
import { useChatQuery } from '../hooks/useChatQuery';

export default function Home() {
  // Use a more reliable approach for client detection
  const [mounted, setMounted] = useState(false);
  
  // Use our Zustand store for state management
  const store = useChatStore();
  const message = store((state) => state.message);
  const chatHistory = store((state) => state.chatHistory);
  const isLoading = store((state) => state.isLoading);
  const setMessage = store((state) => state.setMessage);
  const setIsLoading = store((state) => state.setIsLoading);
  const addMessage = store((state) => state.addMessage);
  
  // Use React Query for API calls
  const chatMutation = useChatQuery();

  // Set mounted to true after component mounts to prevent hydration mismatch
  useEffect(() => {
    // This ensures we're running on the client
    setMounted(true);
    
    // Force a re-render to ensure we get the latest state
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    addMessage(userMessage);
    setMessage('');
    setIsLoading(true);

    try {
      // Use React Query mutation for API call
      const result = await chatMutation.mutateAsync({ 
        messages: [...chatHistory, userMessage] 
      });
      
      // Add AI response to chat
      addMessage({ role: 'system', content: result.response });
    } catch (error) {
      console.error('Error:', error);
      addMessage({ 
        role: 'system', 
        content: 'Sorry, I encountered an error processing your request.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Return a loading state during SSR and initial client render
  if (!mounted) {
    // Return a minimal placeholder that won't cause hydration issues
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold text-center mb-8">Cali - Financial AI Advisor</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded"></div>
            <div className="flex gap-2">
              <div className="flex-grow p-2 border border-gray-300 rounded"></div>
              <div className="bg-blue-500 text-white px-4 py-2 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Cali - Financial AI Advisor</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
            {chatHistory.map((chat: ChatMessage, index: number) => (
              <div key={index} className={`mb-4 ${chat.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  chat.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {chat.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about financial markets, economic trends, or stock analysis..."
              className="flex-grow p-2 border border-gray-300 rounded"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>Powered by ✨Vibes✨</p>
        </div>
      </div>
    </main>
  );
}

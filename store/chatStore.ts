import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

// Define message type for better type safety
export type ChatMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

// Define the store state type
interface ChatState {
  // Chat state
  message: string;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  
  // Actions
  setMessage: (message: string) => void;
  addMessage: (message: ChatMessage) => void;
  setIsLoading: (isLoading: boolean) => void;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
}

// Create a store creator function with persistence
const createChatStore = () => {
  return create<ChatState>()(
    persist(
      (set, get) => ({
        // Initial state
        message: '',
        chatHistory: [
          { role: 'system', content: 'Welcome to Cali - Your Financial AI Advisor. How can I help you today?' }
        ],
        isLoading: false,
        
        // Actions
        setMessage: (message) => set({ message }),
        
        addMessage: (message) => set((state) => ({
          chatHistory: [...state.chatHistory, message]
        })),
        
        setIsLoading: (isLoading) => set({ isLoading }),
        
        sendMessage: async (content) => {
          if (!content.trim()) return;
          
          // Add user message to chat
          const userMessage: ChatMessage = { role: 'user', content };
          set((state) => ({ 
            chatHistory: [...state.chatHistory, userMessage],
            message: '',
            isLoading: true 
          }));
          
          try {
            // Get the updated chat history
            const chatHistory = [...get().chatHistory, userMessage];
            
            // Call the API using axios instead of fetch
            const response = await axios.post('http://localhost:3001/chat', { 
              messages: chatHistory 
            });
            
            // Add AI response to chat
            set((state) => ({
              chatHistory: [...state.chatHistory, { role: 'system', content: response.data.response }],
              isLoading: false
            }));
          } catch (error) {
            console.error('Error:', error);
            
            // Add error message to chat
            set((state) => ({
              chatHistory: [...state.chatHistory, { 
                role: 'system', 
                content: 'Sorry, I encountered an error processing your request.' 
              }],
              isLoading: false
            }));
          }
        },
        
        resetChat: () => set({
          chatHistory: [
            { role: 'system', content: 'Welcome to Cali - Your Financial AI Advisor. How can I help you today?' }
          ],
          message: '',
          isLoading: false
        })
      }),
      {
        name: 'cali-chat-storage', // unique name for localStorage
        storage: createJSONStorage(() => localStorage), // use localStorage
        skipHydration: true, // important for SSR
        partialize: (state) => ({ 
          chatHistory: state.chatHistory 
        }), // only persist chatHistory
      }
    )
  );
};

// Create a singleton instance of the store
let store: ReturnType<typeof createChatStore>;

// Initialize the store on the client side only
export const useChatStore = () => {
  if (typeof window === 'undefined') {
    // Server-side - create a new store for each request
    return createChatStore();
  }
  
  // Client-side - use singleton
  if (!store) {
    store = createChatStore();
  }
  
  return store;
};

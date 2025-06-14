import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define message type for better type safety
export type ChatMessage = {
  role: 'user' | 'system' | 'assistant' | 'developer';
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
          { role: 'system', content: "Hi I'm Cali - I know Everything. What's up?" }
        ],
        isLoading: false,
        
        // Actions
        setMessage: (message) => set({ message }),
        
        addMessage: (message) => set((state) => ({
          chatHistory: [...state.chatHistory, message]
        })),
        
        setIsLoading: (isLoading) => set({ isLoading }),
        
        resetChat: () => set({
          chatHistory: [
            { role: 'system', content: "Hi I'm Cali - I know Everything. What's up?" }
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

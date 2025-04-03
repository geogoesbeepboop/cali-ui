import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { ChatMessage } from '../store/chatStore';

interface ChatResponse {
  response: string;
}

export const useChatQuery = () => {
  // Access the QueryClient from the context provided by QueryProvider
  const queryClient = useQueryClient();

  return useMutation<ChatResponse, Error, { messages: ChatMessage[] }>(
    async ({ messages }) => {
      // Use axios instead of fetch
      const response = await axios.post('http://localhost:3001/chat', { messages });
      return response.data;
    },
    {
      // Invalidate and refetch any queries that depend on this data
      onSuccess: () => {
        queryClient.invalidateQueries('chatHistory');
      },
    }
  );
};

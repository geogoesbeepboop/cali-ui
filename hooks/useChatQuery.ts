import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

export const useChatQuery = () => {
  // Access the QueryClient from the context provided by QueryProvider
  const queryClient = useQueryClient();

  return useMutation<string, Error, { message: string }>(
    async ({ message }) => {
      // Use axios instead of fetch
      const response = await axios.post('http://localhost:3001/chat', { prompt: message }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
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

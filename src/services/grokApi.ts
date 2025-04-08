// grokApi.ts
import axios from 'axios';

const GROK_API_KEY = 'xai-jYju4Hji3ZC6ZJbKyRNQT2ErzbMw4PCBLVHPn3xqlPThaAGPhA84ELuFB9qzrhKmKPzMzhLnYnWpLeug'; // make sure to keep this safe and use env vars in prod

const apiClient = axios.create({
  baseURL: 'https://api.grok.xai', // hypothetical endpoint, replace if different
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GROK_API_KEY}`,
  },
});

export const grokApi = {
  sendMessage: async (messages: { role: string; content: string }[]) => {
    try {
      const response = await apiClient.post('/v1/chat/completions', {
        model: 'grok-1.5', // adjust model name if needed
        messages,
      });

      return response.data.choices?.[0]?.message?.content || 'No response from Grok.';
    } catch (error: any) {
      console.error('Grok API error:', error);
      throw new Error('Failed to get response from Grok API.');
    }
  },

  analyzePaper: async (content: string) => {
    try {
      const response = await apiClient.post('/v1/chat/completions', {
        model: 'grok-1.5',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that summarizes and analyzes academic paper content.',
          },
          {
            role: 'user',
            content: `Please provide a brief analysis and summary of the following paper:\n\n${content}`,
          },
        ],
      });

      return response.data.choices?.[0]?.message?.content || 'No analysis provided.';
    } catch (error: any) {
      console.error('Error analyzing paper:', error);
      throw new Error('Failed to analyze the paper.');
    }
  },
};

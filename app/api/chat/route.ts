import { NextRequest, NextResponse } from 'next/server';
// Import OpenAI as a type only since we're not using it yet
import type OpenAI from 'openai';

// This would be replaced with your actual OpenAI API key setup
// In production, use environment variables
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// Define message type for better type safety
type ChatMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };

    // This is a mock response for development
    // In production, you would call the OpenAI API or your own model
    
    // Example of how you would call OpenAI:
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [
    //     { role: "system", content: "You are Cali, a financial AI advisor specializing in economic analysis and stock insights." },
    //     ...messages.map(msg => ({ role: msg.role === 'system' ? 'assistant' : msg.role, content: msg.content }))
    //   ],
    //   temperature: 0.7,
    // });
    // const response = completion.choices[0].message.content;

    // Mock response for development
    const mockResponses = [
      "Based on recent market trends, tech stocks are showing strong momentum. Consider diversifying your portfolio with some value stocks as well.",
      "The latest economic indicators suggest moderate inflation in the coming months. This might impact interest rates, so keep an eye on Federal Reserve announcements.",
      "Looking at the financial data for this company, their P/E ratio is above industry average, but their growth metrics are strong. Consider their competitive position in the market before investing.",
      "The bond market is signaling some concerns about economic growth. It might be wise to review your asset allocation strategy.",
      "Based on technical analysis of this stock, it's approaching a key resistance level. Watch for a breakout or rejection at this price point."
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ response: randomResponse });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}

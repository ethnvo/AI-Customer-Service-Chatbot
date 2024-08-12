import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../../.env.local') });

export async function POST(req) {
  // Retrieve API key from environment variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not defined in the environment variables' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Parse the JSON body of the incoming request to get user input
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // Generate content based on the user's input
    const prompt = `You are a customer service chatbot, help the user with their needs:  ${userInput}`;
    const result = await model.generateContent(prompt);

    // Assuming result.response.text() gives you the generated content
    const text = await result.response.text(); // Adjust this based on actual SDK response

    // Return the generated text as a JSON response
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

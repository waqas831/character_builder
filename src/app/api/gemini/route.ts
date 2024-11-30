import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI("AIzaSyBmwhxC3BL0Z06Gp3v2q5gAI_OvaCJkjRs")

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const generateImagePrompt = "Generate an image of mEME token" ;



    const generatedContent = await model.generateContent(generateImagePrompt);

    console.log(generatedContent.response.text());
    return NextResponse.json({
      message: 'Image generated successfully',
      imageUrl: '/generated_image.png', // URL accessible in the public folder
    });
  } catch (error: any) {
    console.error('Error generating image:', error.message);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}


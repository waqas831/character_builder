// pages/api/generate-image.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize the GoogleGenerativeAI client
const client :any= new GoogleGenerativeAI({
  apiKey: "AIzaSyBmwhxC3BL0Z06Gp3v2q5gAI_OvaCJkjRs"
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("req", req)
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      // Generate the image
      const response = await client.generateImage({
        prompt,
        numImages: 1,
        size: '512x512', // Specify the size of the image
      });

      const image = response.images[0];
      const imageBuffer = Buffer.from(image, 'base64');

      // Save the image temporarily (optional)
      const filePath = path.join(process.cwd(), 'public', 'generated_image.png');
      fs.writeFileSync(filePath, imageBuffer);

      // Respond with the image URL
      return res.status(200).json({
        message: 'Image generated successfully',
        imageUrl: '/generated_image.png', // URL accessible in the public folder
      });
    } catch (error: any) {
      console.error('Error generating image:', error.message);
      return res.status(500).json({ error: 'Failed to generate image' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

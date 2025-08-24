require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const express = require('express');

const app = express();

const PORT = process.env.PORT;

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
  vertexai: false, // or set vertexai: true if using Vertex AI backend
});

app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: req.body.prompt,
      config: {
        systemInstruction: `You are a DSA instructor. If user asks a DSA question, answer clearly; otherwise, respond dismissively.`
      }
    });
    res.json({ response: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (allow frontend domain or "*" for all during dev)
app.use(cors({
  origin: "*", // change later to frontend URL when deployed
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Google GenAI setup
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
  vertexai: false,
});

app.post('/generate', async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: req.body.prompt,
      config: {
        systemInstruction: `You are a DSA instructor. 
        - If user asks a DSA question, answer clearly.
        - Otherwise, respond dismissively.`
      }
    });

    // SDK may return response as object → ensure you send proper text
    const textResponse = response.text || JSON.stringify(response);

    res.json({ response: textResponse });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(PORT, () => {
  console.log(` Server listening at http://localhost:${PORT}`);
});

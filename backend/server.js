
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Gemini configuration
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Language codes
const languageCodes = {
  English: "en",
  Marathi: "mr",
  Hindi: "hi",
};

// Home route
app.get("/", (req, res) => {
  res.send("BhashaSaathi Backend is Running!");
});

// Test backend connection
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "React connected with Node.js backend!",
  });
});

// Translation API
app.post("/api/translate", async (req, res) => {
  try {
    const { text, language, sourceLanguage = "English" } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        error: "Please enter some text.",
      });
    }

    const sourceCode = languageCodes[sourceLanguage];
    const targetCode = languageCodes[language];

    if (!sourceCode || !targetCode) {
      return res.status(400).json({
        error: "Unsupported source or target language.",
      });
    }

    if (sourceCode === targetCode) {
      return res.json({ translation: text.trim() });
    }

    const params = new URLSearchParams({
      q: text.trim(),
      langpair: `${sourceCode}|${targetCode}`,
    });

    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params}`
    );

    if (!response.ok) {
      console.error("Translation API HTTP status:", response.status);

      return res.status(502).json({
        error: "The translation service is temporarily unavailable. Please try again.",
      });
    }

    const data = await response.json();

    if (
      data.responseStatus !== 200 ||
      !data.responseData?.translatedText
    ) {
      console.error("Translation service error:", data.responseDetails);

      return res.status(502).json({
        error: data.responseDetails || "The translation service could not translate this text.",
      });
    }

    return res.json({
      success: true,
      translation: data.responseData.translatedText,
      sourceLanguage,
      targetLanguage: language,
    });
  } catch (error) {
    console.error("Translation error:", error.message);

    return res.status(500).json({
      error: "Translation failed. Check your internet connection and backend terminal.",
    });
  }
});

// AI explanation API
app.post("/api/explain", async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        error: "Please enter a word or sentence.",
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is missing. Check backend/.env.",
      });
    }

    const prompt = `
Explain the following English text for a beginner:

${text.trim()}

Provide:
1. Meaning in simple English
2. Explanation in simple Marathi
3. One simple English example
4. Marathi translation of the example

Use clear, beginner-friendly language.
`;

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: "low",
        },
      },
    });

    const explanation = result.text;

    if (!explanation || !explanation.trim()) {
      return res.status(502).json({
        error: "AI returned an empty explanation. Please try again.",
      });
    }

    return res.json({
      success: true,
      explanation: explanation.trim(),
    });
  } catch (error) {
    console.error("Gemini explanation error:", error.message);

    const message = String(error.message || "");

    if (
      message.includes("429") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("resource_exhausted")
    ) {
      return res.status(429).json({
        error: "Gemini API quota exceeded. Try again later or check your API quota.",
      });
    }

    return res.status(502).json({
      error: "AI explanation failed. Check the Gemini model, API key, and backend terminal.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Gemini API key loaded:", Boolean(apiKey));
});

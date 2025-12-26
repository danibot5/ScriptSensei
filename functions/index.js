const { onRequest } = require("firebase-functions/v2/https");
const { OpenAI } = require("openai"); // Оставяме си библиотеката, тя работи и с Groq!
require("dotenv").config();

const SYSTEM_PROMPT = "Ти си ScriptSensei - приятелски настроен учител по JavaScript. Твоята цел е да помагаш на начинаещи. Обяснявай кратко и давай примери на български език.";

exports.chat = onRequest({ cors: true }, async function(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
       throw new Error("Липсва API ключ в .env файла!");
    }

    // ТУК Е МАГИЯТА: Насочваме го към безплатния сървър на Groq
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.groq.com/openai/v1" 
    });

    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      // Използваме модел "llama-3.3-70b", който е много умен и безплатен
      model: "llama-3.3-70b-versatile", 
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("Грешка:", error);
    // Връщаме грешката на сайта, за да не пише "undefined"
    res.json({ error: "Грешка: " + error.message });
  }
});
import { Router } from "express";
const router = Router();

const API_KEY = "AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw"; // Be careful sharing API keys
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

async function chat_bot(prompt) {
    try {
        const response = await post(`${GEMINI_URL}?key=${API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return "Error processing the request.";
    }
}

// Chat API
router.post("/", (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const response = chat_bot(prompt);
    res.json({ response });
});

export default router;

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        message: "Prompt UI Generator API is working!"
    });
});

app.post("/generate", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({
                error: "Prompt is required"
            });
        }

        const result = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert UI designer. Generate only HTML with inline CSS. Do not use markdown. Do not explain anything."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        res.json({
            html: result.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error generating UI"
        });
    }
});

module.exports = app;
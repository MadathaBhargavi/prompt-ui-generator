require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/generate", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Generate ONLY HTML."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        res.json({
            html: completion.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            html: "<h2>Error generating UI</h2>"
        });
    }
});

// Health route
app.get("/health", (req, res) => {
    res.send("Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
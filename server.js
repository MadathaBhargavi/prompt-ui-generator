require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

// Static files serve cheyyadaniki
app.use(express.static(__dirname));

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Generate UI route
app.post("/generate", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const start = Date.now();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are an expert Frontend Developer.

Generate ONLY HTML.

Rules:
1. Use modern UI.
2. Responsive Design.
3. Professional colors.
4. Cards with shadow.
5. Attractive buttons.
6. Navigation bar.
7. Dashboard layout if needed.
8. Do NOT return Markdown.
9. Do NOT explain.
10. Return HTML only.
`
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const end = Date.now();

        res.json({
            html: completion.choices[0].message.content,
            time: ((end - start) / 1000).toFixed(2),
            model: "Llama 3.3 70B",
            status: "Connected"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            html: "<h2 style='color:red'>Error generating UI</h2>",
            time: "0",
            model: "Unknown",
            status: "Disconnected"
        });
    }
});

// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "Server Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
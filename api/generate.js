const Groq = require("groq-sdk");

module.exports = async (req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: "Prompt is required"
            });
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const result = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert UI designer. Generate only HTML with inline CSS. Do not use markdown. Do not explain anything."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]

        });

        return res.status(200).json({
            html: result.choices[0].message.content
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};
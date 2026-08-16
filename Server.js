const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "Aluniverse Backend",
        version: "2.0.0",
        status: "online"
    });
});

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        ai: !!process.env.OPENAI_API_KEY,
        status: "ready"
    });
});

app.post("/api/ai", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "لطفاً درخواست خود را وارد کنید."
            });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                success: false,
                error: "کلید API هوش مصنوعی در سرور تنظیم نشده است."
            });
        }

        const response = await client.responses.create({
            model: "gpt-5.6",
            input: message
        });

        res.json({
            success: true,
            answer: response.output_text
        });

    } catch (error) {

        console.error("AI ERROR:", error);

        res.status(500).json({
            success: false,
            error: "ارتباط با موتور هوش مصنوعی برقرار نشد."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Aluniverse Backend running on port ${PORT}`);
});

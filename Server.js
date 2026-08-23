const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "ready",
        service: "Aluniverse Backend",
        ai: !!process.env.OPENAI_API_KEY
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        service: "Aluniverse Backend"
    });
});

app.post("/api/ai", async (req, res) => {
    try {
        const message = req.body.message || req.body.input;

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
            input: message.trim()
        });

        res.json({
            success: true,
            tool: "ai",
            type: "text",
            message: response.output_text
        });
    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            success: false,
            error: "ارتباط با موتور هوش مصنوعی برقرار نشد."
        });
    }
});

app.post("/api/image", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                error: "لطفاً توضیح تصویر را وارد کنید."
            });
        }

        const imageUrl =
            "https://image.pollinations.ai/prompt/" +
            encodeURIComponent(prompt.trim()) +
            "?width=1024&height=1024&nologo=true";

        res.json({
            success: true,
            tool: "image",
            type: "image",
            prompt: prompt.trim(),
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("IMAGE ERROR:", error);

        res.status(500).json({
            success: false,
            error: "خطا در تولید تصویر."
        });
    }
});

app.post("/api/video", async (req, res) => {
    try {
        const input = req.body.input || req.body.message;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "لطفاً توضیح ویدئو را وارد کنید."
            });
        }

        res.json({
            success: true,
            tool: "video",
            type: "video",
            message: "درخواست ساخت ویدئو توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });
    } catch (error) {
        console.error("VIDEO ERROR:", error);

        res.status(500).json({
            success: false,
            error: "خطا در پردازش درخواست ویدئو."
        });
    }
});

app.post("/api/content", async (req, res) => {
    try {
        const input = req.body.input || req.body.message;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "لطفاً درخواست تولید محتوا را وارد کنید."
            });
        }

        res.json({
            success: true,
            tool: "content",
            type: "text",
            message: "درخواست تولید محتوا توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });
    } catch (error) {
        console.error("CONTENT ERROR:", error);

        res.status(500).json({
            success: false,
            error: "خطا در تولید محتوا."
        });
    }
});

app.post("/api/web", async (req, res) => {
    try {
        const input = req.body.input || req.body.message;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "لطفاً درخواست طراحی وب را وارد کنید."
            });
        }

        res.json({
            success: true,
            tool: "web",
            type: "web",
            message: "درخواست طراحی وب توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });
    } catch (error) {
        console.error("WEB ERROR:", error);

        res.status(500).json({
            success: false,
            error: "خطا در پردازش طراحی وب."
        });
    }
});

app.post("/api/execute", async (req, res) => {
    try {
        const input = req.body.input || req.body.message;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "لطفاً ایده پروژه را وارد کنید."
            });
        }

        res.json({
            success: true,
            tool: "execute",
            type: "workflow",
            message: "ایده پروژه توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });
    } catch (error) {
        console.error("EXECUTE ERROR:", error);

        res.status(500).json({
            success: false,
            error: "خطا در اجرای پروژه."
        });
    }
});


app.get("/test", (req, res) => {
    res.status(200).send("ALUNIVERSE_OK");
});


app.listen(PORT, () => {
    console.log(`Aluniverse Backend running on port ${PORT}`);
});

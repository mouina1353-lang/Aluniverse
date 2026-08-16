const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
    res.json({
        success: true,
        name: "Aluniverse Backend",
        version: "1.0.0",
        status: "online"
    });
});

app.get("/api/health", function (req, res) {
    res.json({
        success: true,
        status: "healthy",
        service: "Aluniverse Backend"
    });
});

app.post("/api/ai", async function (req, res) {

    try {

        const input = req.body.input;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_INPUT"
            });
        }

        res.json({
            success: true,
            tool: "ai",
            type: "text",
            message:
                "درخواست شما توسط Backend پلتفرم Aluniverse دریافت شد.",
            input: input.trim()
        });

    } catch (error) {

        console.error("AI Error:", error);

        res.status(500).json({
            success: false,
            error: "SERVER_ERROR"
        });
    }
});

app.post("/api/image", async function (req, res) {

    try {

        const prompt = req.body.prompt;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_PROMPT"
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

        console.error("Image Error:", error);

        res.status(500).json({
            success: false,
            error: "IMAGE_SERVER_ERROR"
        });
    }
});

app.post("/api/video", async function (req, res) {

    try {

        const input = req.body.input;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_INPUT"
            });
        }

        res.json({
            success: true,
            tool: "video",
            type: "video",
            message:
                "درخواست ساخت ویدئو توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });

    } catch (error) {

        console.error("Video Error:", error);

        res.status(500).json({
            success: false,
            error: "VIDEO_SERVER_ERROR"
        });
    }
});

app.post("/api/content", async function (req, res) {

    try {

        const input = req.body.input;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_INPUT"
            });
        }

        res.json({
            success: true,
            tool: "content",
            type: "text",
            message:
                "درخواست تولید محتوا توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });

    } catch (error) {

        console.error("Content Error:", error);

        res.status(500).json({
            success: false,
            error: "CONTENT_SERVER_ERROR"
        });
    }
});

app.post("/api/web", async function (req, res) {

    try {

        const input = req.body.input;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_INPUT"
            });
        }

        res.json({
            success: true,
            tool: "web",
            type: "web",
            message:
                "درخواست طراحی وب توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });

    } catch (error) {

        console.error("Web Error:", error);

        res.status(500).json({
            success: false,
            error: "WEB_SERVER_ERROR"
        });
    }
});

app.post("/api/execute", async function (req, res) {

    try {

        const input = req.body.input;

        if (!input || !input.trim()) {
            return res.status(400).json({
                success: false,
                error: "EMPTY_INPUT"
            });
        }

        res.json({
            success: true,
            tool: "execute",
            type: "workflow",
            message:
                "ایده پروژه توسط Backend Aluniverse دریافت شد.",
            input: input.trim()
        });

    } catch (error) {

        console.error("Execute Error:", error);

        res.status(500).json({
            success: false,
            error: "EXECUTE_SERVER_ERROR"
        });
    }
});

app.listen(PORT, function () {

    console.log(
        "Aluniverse Backend is running on port " + PORT
    );

});

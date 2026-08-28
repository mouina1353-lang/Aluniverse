const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
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
    service: "Aluniverse Backend",
    version: "3.0.0",
    openai: !!process.env.OPENAI_API_KEY
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Aluniverse"
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "لطفاً درخواست خود را وارد کنید."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY تنظیم نشده است."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: message.trim()
    });

    res.json({
      success: true,
      answer: response.output_text || "پاسخی دریافت نشد."
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      success: false,
      error: "خطا در ارتباط با سرویس هوش مصنوعی.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Aluniverse Backend running on port ${PORT}`);
  console.log(`Available at your primary URL`);
});

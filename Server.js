const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    service: "Aluniverse Backend",
    version: "4.1.0",
    groq: !!process.env.GROQ_API_KEY
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

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY تنظیم نشده است."
      });
    }

    const cleanApiKey = apiKey.trim();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cleanApiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are Aluniverse AI, a helpful, accurate and friendly AI assistant. Answer in the same language as the user's message."
            },
            {
              role: "user",
              content: message.trim()
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GROQ ERROR:", {
        status: response.status,
        error: data?.error?.message || "Unknown Groq error"
      });

      return res.status(response.status).json({
        success: false,
        error: data?.error?.message || "خطا در ارتباط با Groq."
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content ||
      "پاسخی دریافت نشد.";

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error("AI ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: "خطا در ارتباط با سرویس هوش مصنوعی."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Aluniverse Backend running on port ${PORT}`);
  console.log(`Available at your primary URL`);
});

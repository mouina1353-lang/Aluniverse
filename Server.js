const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname)));

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   STATUS
========================= */

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    service: "Aluniverse Backend",
    version: "6.0.0",
    groq: Boolean(process.env.GROQ_API_KEY),
    replicate: Boolean(process.env.REPLICATE_API_TOKEN)
  });
});

/* =========================
   HEALTH
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Aluniverse"
  });
});

/* =====================================================
   GROQ AI CHAT
===================================================== */

app.post("/api/ai", async (req, res) => {
  try {
    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "لطفاً درخواست خود را وارد کنید."
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY در Render تنظیم نشده است."
      });
    }

    const cleanApiKey = apiKey
      .trim()
      .replace(/^["']|["']$/g, "");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + cleanApiKey
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are Aluniverse AI. Be helpful, accurate and friendly. Answer in the same language as the user."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GROQ ERROR:", data);

      return res.status(response.status).json({
        success: false,
        error:
          data?.error?.message ||
          "خطا در ارتباط با سرویس هوش مصنوعی."
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content ||
      "پاسخی دریافت نشد.";

    return res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error("SERVER AI ERROR:", error.message);

    return res.status(500).json({
      success: false,
      error: "خطا در ارتباط با سرویس هوش مصنوعی."
    });
  }
});

/* =====================================================
   REPLICATE CONFIG
===================================================== */

const REPLICATE_API_URL = "https://api.replicate.com/v1";

/*
  مدل تصویر.
  در صورت نیاز بعداً فقط مقدار Environment Variable
  را تغییر می‌دهیم و نیازی به تغییر کد نیست.
*/
const IMAGE_MODEL =
  process.env.REPLICATE_IMAGE_MODEL ||
  "black-forest-labs/flux-schnell";

/*
  مدل ویدئو.
  قابل تغییر از طریق Environment Variable است.
*/
const VIDEO_MODEL =
  process.env.REPLICATE_VIDEO_MODEL ||
  "minimax/video-01";

/*
  مدل انیمیشن.
  فعلاً از مدل ویدئویی استفاده می‌کنیم تا مسیر
  واقعی تولید محتوای متحرک فعال باشد.
*/
const ANIMATION_MODEL =
  process.env.REPLICATE_ANIMATION_MODEL ||
  "minimax/video-01";


/* =====================================================
   REPLICATE AUTH
===================================================== */

function getReplicateToken() {
  const token = process.env.REPLICATE_API_TOKEN;

  if (!token) {
    throw new Error(
      "REPLICATE_API_TOKEN در Render تنظیم نشده است."
    );
  }

  return token
    .trim()
    .replace(/^["']|["']$/g, "");
}


/* =====================================================
   CREATE REPLICATE PREDICTION
===================================================== */

async function createPrediction(model, input) {
  const token = getReplicateToken();

  const response = await fetch(
    `${REPLICATE_API_URL}/models/${model}/predictions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Prefer": "wait"
      },
      body: JSON.stringify({
        input
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("REPLICATE CREATE ERROR:", data);

    throw new Error(
      data?.detail ||
      data?.error ||
      "خطا در ایجاد درخواست Replicate."
    );
  }

  return data;
}


/* =====================================================
   WAIT FOR PREDICTION
===================================================== */

async function waitForPrediction(predictionId) {
  const token = getReplicateToken();

  const maxAttempts = 120;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {

    const response = await fetch(
      `${REPLICATE_API_URL}/predictions/${predictionId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("REPLICATE POLL ERROR:", data);

      throw new Error(
        data?.detail ||
        data?.error ||
        "خطا در دریافت نتیجه Replicate."
      );
    }

    if (data.status === "succeeded") {
      return data;
    }

    if (
      data.status === "failed" ||
      data.status === "canceled"
    ) {
      throw new Error(
        data?.error ||
        "تولید محتوا توسط Replicate ناموفق بود."
      );
    }

    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );
  }

  throw new Error(
    "زمان تولید محتوا بیش از حد مجاز شد."
  );
}


/* =====================================================
   EXTRACT OUTPUT URL
===================================================== */

function extractOutput(output) {

  if (!output) {
    return null;
  }

  if (typeof output === "string") {
    return output;
  }

  if (Array.isArray(output)) {

    for (const item of output) {

      if (typeof item === "string") {
        return item;
      }

      if (item?.url) {
        return item.url;
      }
    }
  }

  if (output?.url) {
    return output.url;
  }

  return null;
}


/* =====================================================
   REAL IMAGE GENERATION
===================================================== */

app.post("/api/image", async (req, res) => {

  try {

    const prompt =
      typeof req.body?.prompt === "string"
        ? req.body.prompt.trim()
        : "";

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "لطفاً توضیح تصویر را وارد کنید."
      });
    }

    const prediction = await createPrediction(
      IMAGE_MODEL,
      {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio:
          req.body?.aspect_ratio || "1:1",
        output_format: "png",
        output_quality: 90
      }
    );

    console.log(
      "IMAGE PREDICTION:",
      prediction.id,
      prediction.status
    );

    const result =
      prediction.status === "succeeded"
        ? prediction
        : await waitForPrediction(prediction.id);

    const imageUrl =
      extractOutput(result.output);

    if (!imageUrl) {
      throw new Error(
        "آدرس تصویر از Replicate دریافت نشد."
      );
    }

    return res.json({
      success: true,
      type: "image",
      status: "succeeded",
      model: IMAGE_MODEL,
      image: imageUrl,
      url: imageUrl
    });

  } catch (error) {

    console.error(
      "SERVER IMAGE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "خطا در تولید تصویر واقعی."
    });
  }
});


/* =====================================================
   REAL VIDEO GENERATION
===================================================== */

app.post("/api/video", async (req, res) => {

  try {

    const prompt =
      typeof req.body?.prompt === "string"
        ? req.body.prompt.trim()
        : "";

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "لطفاً توضیح ویدئو را وارد کنید."
      });
    }

    const prediction = await createPrediction(
      VIDEO_MODEL,
      {
        prompt: prompt
      }
    );

    console.log(
      "VIDEO PREDICTION:",
      prediction.id,
      prediction.status
    );

    const result =
      prediction.status === "succeeded"
        ? prediction
        : await waitForPrediction(prediction.id);

    const videoUrl =
      extractOutput(result.output);

    if (!videoUrl) {
      throw new Error(
        "آدرس ویدئو از Replicate دریافت نشد."
      );
    }

    return res.json({
      success: true,
      type: "video",
      status: "succeeded",
      model: VIDEO_MODEL,
      video: videoUrl,
      url: videoUrl
    });

  } catch (error) {

    console.error(
      "SERVER VIDEO ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "خطا در تولید ویدئو واقعی."
    });
  }
});


/* =====================================================
   REAL ANIMATION GENERATION
===================================================== */

app.post("/api/animation", async (req, res) => {

  try {

    const prompt =
      typeof req.body?.prompt === "string"
        ? req.body.prompt.trim()
        : "";

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error:
          "لطفاً توضیح انیمیشن را وارد کنید."
      });
    }

    const prediction = await createPrediction(
      ANIMATION_MODEL,
      {
        prompt: prompt
      }
    );

    console.log(
      "ANIMATION PREDICTION:",
      prediction.id,
      prediction.status
    );

    const result =
      prediction.status === "succeeded"
        ? prediction
        : await waitForPrediction(prediction.id);

    const animationUrl =
      extractOutput(result.output);

    if (!animationUrl) {
      throw new Error(
        "آدرس انیمیشن از Replicate دریافت نشد."
      );
    }

    return res.json({
      success: true,
      type: "animation",
      status: "succeeded",
      model: ANIMATION_MODEL,
      animation: animationUrl,
      video: animationUrl,
      url: animationUrl
    });

  } catch (error) {

    console.error(
      "SERVER ANIMATION ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "خطا در تولید انیمیشن واقعی."
    });
  }
});


/* =====================================================
   SERVER START
===================================================== */

app.listen(PORT, () => {

  console.log(
    `Aluniverse Backend running on port ${PORT}`
  );

  console.log(
    `Aluniverse API ready`
  );

  console.log(
    `Replicate configured: ${
      Boolean(process.env.REPLICATE_API_TOKEN)
    }`
  );
});

document.addEventListener("DOMContentLoaded", function () {

    const app = {
        name: "Aluniverse",
        version: "2.1.0",
        status: "ready"
    };

    const tools = {
        ai: {
            icon: "🤖",
            title: "هوش مصنوعی",
            description: "دستیار هوشمند Aluniverse برای پاسخ‌گویی، تحلیل و حل مسئله."
        },

        image: {
            icon: "🎨",
            title: "تولید تصویر",
            description: "ایجاد تصاویر خلاقانه با کمک هوش مصنوعی."
        },

        video: {
            icon: "🎬",
            title: "ویدئو و انیمیشن",
            description: "ساخت سناریو، استوری‌بورد و آماده‌سازی پروژه ویدئویی."
        },

        content: {
            icon: "✍️",
            title: "تولید محتوا",
            description: "تولید مقاله، کتاب، تبلیغات و محتوای شبکه‌های اجتماعی."
        },

        web: {
            icon: "🌐",
            title: "طراحی وب",
            description: "ساخت ساختار، کد و پیش‌نمایش پروژه‌های وب."
        },

        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            description: "تبدیل ایده به برنامه اجرایی مرحله‌به‌مرحله."
        }
    };

    const homeHero = document.getElementById("home-hero");
    const features = document.getElementById("features");
    const aboutSection = document.getElementById("about-section");

    const toolPage = document.getElementById("tool-page");
    const toolIcon = document.getElementById("tool-icon");
    const toolTitle = document.getElementById("tool-title");
    const toolDescription = document.getElementById("tool-description");
    const backHome = document.getElementById("back-home");

    if (
        !homeHero ||
        !features ||
        !aboutSection ||
        !toolPage ||
        !toolIcon ||
        !toolTitle ||
        !toolDescription ||
        !backHome
    ) {
        console.error("Aluniverse: Required HTML elements not found.");
        return;
    }

    let toolWorkspace = document.getElementById("tool-workspace");

    if (!toolWorkspace) {
        toolWorkspace = document.createElement("div");
        toolWorkspace.id = "tool-workspace";
        toolPage.appendChild(toolWorkspace);
    }

    toolWorkspace.style.maxWidth = "700px";
    toolWorkspace.style.margin = "30px auto";
    toolWorkspace.style.padding = "20px";
    toolWorkspace.style.textAlign = "center";
    toolWorkspace.style.direction = "rtl";

    function styleButton(button) {
        button.style.marginTop = "15px";
        button.style.padding = "14px 30px";
        button.style.border = "none";
        button.style.borderRadius = "30px";
        button.style.background = "#5b35d5";
        button.style.color = "#fff";
        button.style.fontSize = "17px";
        button.style.cursor = "pointer";
    }

    function createTextarea(placeholder) {

        const textarea = document.createElement("textarea");

        textarea.placeholder = placeholder;

        textarea.style.width = "100%";
        textarea.style.minHeight = "150px";
        textarea.style.padding = "15px";
        textarea.style.marginTop = "15px";
        textarea.style.borderRadius = "15px";
        textarea.style.border = "1px solid #ccc";
        textarea.style.fontSize = "16px";
        textarea.style.direction = "rtl";
        textarea.style.resize = "vertical";
        textarea.style.boxSizing = "border-box";

        return textarea;
    }

    function createResult() {

        const result = document.createElement("div");

        result.style.marginTop = "25px";
        result.style.padding = "15px";
        result.style.borderRadius = "15px";
        result.style.background = "#f5f1ff";
        result.style.lineHeight = "2";
        result.style.whiteSpace = "pre-wrap";
        result.style.textAlign = "right";

        return result;
    }

    function showHome() {

        toolPage.style.display = "none";

        homeHero.style.display = "";
        features.style.display = "";
        aboutSection.style.display = "";

        toolWorkspace.innerHTML = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function showTool(tool) {

        const selectedTool = tools[tool];

        if (!selectedTool) {
            console.error("Unknown tool:", tool);
            return;
        }

        toolIcon.textContent = selectedTool.icon;
        toolTitle.textContent = selectedTool.title;
        toolDescription.textContent = selectedTool.description;

        homeHero.style.display = "none";
        features.style.display = "none";
        aboutSection.style.display = "none";

        toolPage.style.display = "block";

        createToolInterface(tool);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    window.openTool = function (tool) {
        showTool(tool);
    };

    /* =========================
       1. AI
    ========================= */



function createAI() {

    const title = document.createElement("h3");
    title.textContent = "دستیار هوش مصنوعی 🤖";

    const textarea = createTextarea(
        "سؤال یا درخواست خود را بنویسید..."
    );

    const button = document.createElement("button");
    button.textContent = "🤖 ارسال درخواست";
    styleButton(button);

    const result = createResult();

    button.onclick = async function () {

        const text = textarea.value.trim();

        if (!text) {
            result.textContent =
                "⚠️ لطفاً درخواست خود را وارد کنید.";
            return;
        }

        result.textContent =
            "⏳ Aluniverse Engine در حال پردازش...";

        try {

            const response =
                await AluniverseEngine.run("ai", text);

            result.textContent =
                "🤖 پاسخ موتور Aluniverse:\n\n" +
                response.message +
                "\n\nدرخواست شما:\n" +
                response.input;

        } catch (error) {

            console.error(
                "Aluniverse AI Error:",
                error
            );

            result.textContent =
                "❌ خطا در پردازش درخواست.";
        }
    };

    toolWorkspace.appendChild(title);
    toolWorkspace.appendChild(textarea);
    toolWorkspace.appendChild(button);
    toolWorkspace.appendChild(result);
}
    

    /* =========================
       2. IMAGE
    ========================= */



    
    function createImage() {

    const title = document.createElement("h3");
    title.textContent = "تولید تصویر 🎨";

    const textarea = createTextarea(
        "ایده تصویر را بنویسید..."
    );

    const button = document.createElement("button");
    button.textContent = "🎨 ایجاد تصویر";
    styleButton(button);

    const result = createResult();

    button.onclick = async function () {

        const prompt = textarea.value.trim();

        if (!prompt) {
            result.textContent =
                "⚠️ ابتدا ایده تصویر را وارد کنید.";
            return;
        }

        result.textContent =
            "⏳ Aluniverse Engine در حال آماده‌سازی تصویر...";

        try {

            const response =
                await AluniverseEngine.run("image", prompt);

            if (!response.success) {
                throw new Error("IMAGE_ENGINE_ERROR");
            }

            result.innerHTML =
                "<strong>🎨 درخواست تصویر دریافت شد.</strong><br><br>" +
                "⏳ در حال تولید تصویر...";

            const image = document.createElement("img");

            image.src =
                "https://image.pollinations.ai/prompt/" +
                encodeURIComponent(response.prompt) +
                "?width=1024&height=1024&nologo=true";

            image.alt = response.prompt;

            image.style.width = "100%";
            image.style.maxWidth = "600px";
            image.style.borderRadius = "20px";
            image.style.marginTop = "15px";
            image.style.display = "block";
            image.style.marginLeft = "auto";
            image.style.marginRight = "auto";

            image.onload = function () {

                result.innerHTML =
                    "<strong>✅ تصویر با موفقیت تولید شد.</strong>";

                result.appendChild(image);
            };

            image.onerror = function () {

                result.innerHTML =
                    "❌ تولید تصویر انجام نشد.<br><br>" +
                    "لطفاً دوباره تلاش کنید.";
            };

        } catch (error) {

            console.error(
                "Aluniverse Image Error:",
                error
            );

            result.textContent =
                "❌ خطا در موتور تولید تصویر.";
        }
    };

    toolWorkspace.appendChild(title);
    toolWorkspace.appendChild(textarea);
    toolWorkspace.appendChild(button);
    toolWorkspace.appendChild(result);
}
    

    /* =========================
       3. VIDEO
    ========================= */

    function createVideo() {

        const title = document.createElement("h3");
        title.textContent = "ساخت ویدئو و انیمیشن 🎬";

        const textarea = createTextarea(
            "موضوع یا سناریوی ویدئو را بنویسید..."
        );

        const button = document.createElement("button");
        button.textContent = "🎬 آماده‌سازی ویدئو";
        styleButton(button);

        const result = createResult();

        button.onclick = function () {

            const text = textarea.value.trim();

            if (!text) {
                result.textContent =
                    "⚠️ موضوع ویدئو را وارد کنید.";
                return;
            }

            result.innerHTML =
                "<strong>🎬 پروژه ویدئو ایجاد شد.</strong><br><br>" +
                "موضوع:<br>" +
                text +
                "<br><br>" +
                "مرحله بعد: ارسال پروژه به موتور تولید ویدئوی Aluniverse.";
        };

        toolWorkspace.appendChild(title);
        toolWorkspace.appendChild(textarea);
        toolWorkspace.appendChild(button);
        toolWorkspace.appendChild(result);
    }

    /* =========================
       4. CONTENT
    ========================= */

    function createContent() {

        const title = document.createElement("h3");
        title.textContent = "تولید محتوا ✍️";

        const textarea = createTextarea(
            "موضوع محتوا را بنویسید..."
        );

        const select = document.createElement("select");

        select.style.width = "100%";
        select.style.padding = "13px";
        select.style.marginTop = "10px";
        select.style.borderRadius = "12px";
        select.style.fontSize = "16px";
        select.style.direction = "rtl";

        [
            ["article", "مقاله"],
            ["social", "پست شبکه اجتماعی"],
            ["ad", "متن تبلیغاتی"],
            ["book", "کتاب"],
            ["description", "توضیحات محصول"]
        ].forEach(function (item) {

            const option = document.createElement("option");

            option.value = item[0];
            option.textContent = item[1];

            select.appendChild(option);
        });

        const button = document.createElement("button");
        button.textContent = "✍️ تولید محتوا";
        styleButton(button);

        const result = createResult();

        button.onclick = function () {

            const topic = textarea.value.trim();

            if (!topic) {
                result.textContent =
                    "⚠️ موضوع محتوا را وارد کنید.";
                return;
            }

            const type =
                select.options[select.selectedIndex].text;

            result.textContent =
                "⏳ در حال آماده‌سازی محتوای " +
                type +
                "...";

            setTimeout(function () {

                result.textContent =
                    "✍️ پیش‌نویس محتوای شما\n\n" +
                    "نوع محتوا: " + type +
                    "\nموضوع: " + topic +
                    "\n\n" +
                    "این بخش برای اتصال به موتور تولید محتوای اصلی Aluniverse آماده است.";

            }, 500);
        };

        toolWorkspace.appendChild(title);
        toolWorkspace.appendChild(textarea);
        toolWorkspace.appendChild(select);
        toolWorkspace.appendChild(button);
        toolWorkspace.appendChild(result);
    }

    /* =========================
       5. WEB DESIGN
    ========================= */

    function createWeb() {

        const title = document.createElement("h3");
        title.textContent = "طراحی وب 🌐";

        const textarea = createTextarea(
            "مثلاً: یک سایت فروشگاهی مدرن برای فروش محصولات دیجیتال"
        );

        const button = document.createElement("button");
        button.textContent = "🌐 ساخت نمونه وب";
        styleButton(button);

        const result = createResult();

        button.onclick = function () {

            const idea = textarea.value.trim();

            if (!idea) {
                result.textContent =
                    "⚠️ ایده وب‌سایت را وارد کنید.";
                return;
            }

            const html =
`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aluniverse Web Project</title>
<style>
body{
    font-family:Arial,sans-serif;
    margin:0;
    padding:40px;
    background:#f5f1ff;
    text-align:center;
}
.container{
    max-width:700px;
    margin:auto;
    background:white;
    padding:40px;
    border-radius:25px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}
h1{
    color:#5b35d5;
}
</style>
</head>
<body>
<div class="container">
<h1>پروژه وب Aluniverse</h1>
<p>${escapeHTML(idea)}</p>
<p>این نمونه توسط ابزار طراحی وب Aluniverse ساخته شد.</p>
</div>
</body>
</html>`;

            result.innerHTML =
                "<strong>✅ نمونه وب ساخته شد.</strong>";

            const preview = document.createElement("iframe");

            preview.style.width = "100%";
            preview.style.height = "350px";
            preview.style.marginTop = "20px";
            preview.style.border = "1px solid #ccc";
            preview.style.borderRadius = "15px";

            preview.srcdoc = html;

            result.appendChild(preview);
        };

        toolWorkspace.appendChild(title);
        toolWorkspace.appendChild(textarea);
        toolWorkspace.appendChild(button);
        toolWorkspace.appendChild(result);
    }

    function escapeHTML(text) {

        const div = document.createElement("div");
        div.textContent = text;

        return div.innerHTML;
    }

    /* =========================
       6. IDEA → EXECUTION
    ========================= */

    function createExecute() {

        const title = document.createElement("h3");
        title.textContent = "از ایده تا اجرا 🚀";

        const textarea = createTextarea(
            "ایده پروژه خود را بنویسید..."
        );

        const button = document.createElement("button");
        button.textContent = "🚀 تبدیل ایده به برنامه اجرا";
        styleButton(button);

        const result = createResult();

        button.onclick = function () {

            const idea = textarea.value.trim();

            if (!idea) {
                result.textContent =
                    "⚠️ ابتدا ایده پروژه را وارد کنید.";
                return;
            }

            result.innerHTML =
                "<strong>🚀 نقشه اجرای پروژه</strong><br><br>" +

                "۱. تحلیل ایده<br>" +
                "۲. تعیین هدف و مخاطب<br>" +
                "۳. تعیین امکانات موردنیاز<br>" +
                "۴. طراحی ساختار پروژه<br>" +
                "۵. انتخاب فناوری و ابزارها<br>" +
                "۶. ساخت نسخه اولیه<br>" +
                "۷. آزمایش و رفع خطا<br>" +
                "۸. آماده‌سازی نسخه نهایی<br>" +
                "۹. انتشار و اجرا<br><br>" +

                "<strong>ایده ثبت‌شده:</strong><br>" +
                escapeHTML(idea);
        };

        toolWorkspace.appendChild(title);
        toolWorkspace.appendChild(textarea);
        toolWorkspace.appendChild(button);
        toolWorkspace.appendChild(result);
    }





        /* =========================
       ALUNIVERSE CORE ENGINE
    ========================= */

    const AluniverseEngine = {

        version: "1.0.0",

        async run(tool, input) {

            if (!input || !input.trim()) {
                throw new Error("EMPTY_INPUT");
            }

            const request = {
                tool: tool,
                input: input.trim(),
                timestamp: new Date().toISOString()
            };

            console.log(
                "Aluniverse Engine Request:",
                request
            );

            switch (tool) {

                case "ai":
                    return this.ai(request);

                case "image":
                    return this.image(request);

                case "video":
                    return this.video(request);

                case "content":
                    return this.content(request);

                case "web":
                    return this.web(request);

                case "execute":
                    return this.execute(request);

                default:
                    throw new Error("UNKNOWN_TOOL");
            }
        },



async ai(request) {

    try {

        const response = await fetch(
            "https://text.pollinations.ai/" +
            encodeURIComponent(request.input)
        );

        if (!response.ok) {
            throw new Error("AI_API_ERROR");
        }

        const answer = await response.text();

        return {
            success: true,
            tool: "ai",
            type: "text",
            message: answer,
            input: request.input
        };

    } catch (error) {

        console.error(
            "Aluniverse AI Engine Error:",
            error
        );

        return {
            success: false,
            tool: "ai",
            type: "error",
            message:
                "❌ ارتباط با موتور هوش مصنوعی برقرار نشد.",
            input: request.input
        };
    }
},


        

        async image(request) {

            return {
                success: true,
                tool: "image",
                type: "image",
                prompt: request.input
            };
        },

        async video(request) {

            return {
                success: true,
                tool: "video",
                type: "video",
                prompt: request.input
            };
        },

        async content(request) {

            return {
                success: true,
                tool: "content",
                type: "text",
                message:
                    "درخواست تولید محتوا توسط هسته Aluniverse دریافت شد.",
                input: request.input
            };
        },

        async web(request) {

            return {
                success: true,
                tool: "web",
                type: "web",
                prompt: request.input
            };
        },

        async execute(request) {

            return {
                success: true,
                tool: "execute",
                type: "workflow",
                message:
                    "ایده وارد موتور اجرای Aluniverse شد.",
                input: request.input
            };
        }
    };

    window.AluniverseEngine = AluniverseEngine;

    console.log(
        "Aluniverse Core Engine:",
        "ONLINE"
    );
    /* =========================
       TOOL INTERFACE
    ========================= */

    function createToolInterface(tool) {

        toolWorkspace.innerHTML = "";

        if (tool === "ai") {
            createAI();
            return;
        }

        if (tool === "image") {
            createImage();
            return;
        }

        if (tool === "video") {
            createVideo();
            return;
        }

        if (tool === "content") {
            createContent();
            return;
        }

        if (tool === "web") {
            createWeb();
            return;
        }

        if (tool === "execute") {
            createExecute();
            return;
        }
    }



    /* =========================
   CARD EVENTS - 6 TOOLS
========================= */

document.querySelectorAll(".card").forEach(function (card) {

    let tool = card.getAttribute("data-tool");

    if (!tool) {
        const onclick = card.getAttribute("onclick");

        if (onclick) {
            const match = onclick.match(
                /openTool\(['"]([^'"]+)['"]\)/
            );

            if (match) {
                tool = match[1];
            }
        }
    }

    if (!tool) return;

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", function (event) {

        event.preventDefault();

        showTool(tool);

    });

    card.addEventListener("keydown", function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            showTool(tool);
        }
    });

});
    

window.openTool = async function(tool) {

  const names = {
    ai: "هوش مصنوعی",
    image: "تولید تصویر",
    video: "ویدئو و انیمیشن",
    content: "تولید محتوا",
    web: "طراحی وب",
    execute: "از ایده تا اجرا"
  };

  const input = prompt(
    "Aluniverse\n\n" +
    names[tool] +
    "\n\nدرخواست خود را وارد کنید:"
  );

  if (!input || !input.trim()) return;

  alert(
    "درخواست شما دریافت شد ✅\n\n" +
    "ابزار: " + names[tool] +
    "\n\n" +
    "درخواست:\n" + input.trim()
  );
};

document.addEventListener("DOMContentLoaded", function () {

    const app = {
        name: "Aluniverse",
        version: "1.3.0",
        status: "ready"
    };

    const tools = {
        ai: {
            icon: "🤖",
            title: "هوش مصنوعی",
            description: "ابزار هوشمند Aluniverse برای پاسخ‌گویی، تحلیل، حل مسئله و انجام پروژه‌های مختلف."
        },

        image: {
            icon: "🎨",
            title: "تولید تصویر",
            description: "ایجاد تصاویر خلاقانه و حرفه‌ای با کمک هوش مصنوعی."
        },

        video: {
            icon: "🎬",
            title: "ویدئو و انیمیشن",
            description: "ساخت ویدئو، انیمیشن و محتوای تصویری."
        },

        content: {
            icon: "✍️",
            title: "تولید محتوا",
            description: "تولید مقاله، کتاب، متن تبلیغاتی و محتوای شبکه‌های اجتماعی."
        },

        web: {
            icon: "🌐",
            title: "طراحی وب",
            description: "طراحی و توسعه وب‌سایت‌ها و پروژه‌های دیجیتال."
        },

        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            description: "هدایت پروژه از ایده اولیه تا برنامه‌ریزی، ساخت و اجرای نهایی."
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

        toolWorkspace.style.maxWidth = "700px";
        toolWorkspace.style.margin = "30px auto";
        toolWorkspace.style.padding = "20px";
        toolWorkspace.style.textAlign = "center";

        toolPage.appendChild(toolWorkspace);
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

    function createToolInterface(tool) {

        toolWorkspace.innerHTML = "";

        if (tool === "ai") {

            const title = document.createElement("h3");
            title.textContent = "دستیار هوش مصنوعی";

            const textarea = document.createElement("textarea");

            textarea.placeholder =
                "سؤال یا درخواست خود را بنویسید...";

            textarea.style.width = "100%";
            textarea.style.minHeight = "140px";
            textarea.style.padding = "15px";
            textarea.style.marginTop = "15px";
            textarea.style.borderRadius = "15px";
            textarea.style.border = "1px solid #ccc";
            textarea.style.fontSize = "16px";
            textarea.style.direction = "rtl";
            textarea.style.resize = "vertical";

            const button = document.createElement("button");

            button.textContent = "🤖 ارسال درخواست";

            button.style.marginTop = "15px";
            button.style.padding = "14px 30px";
            button.style.border = "none";
            button.style.borderRadius = "30px";
            button.style.background = "#5b35d5";
            button.style.color = "white";
            button.style.fontSize = "17px";
            button.style.cursor = "pointer";

            const result = document.createElement("div");

            result.style.marginTop = "25px";

            button.addEventListener("click", function () {

                const text = textarea.value.trim();

                if (!text) {
                    result.innerHTML =
                        "<p>لطفاً درخواست خود را وارد کنید.</p>";
                    return;
                }

                result.innerHTML =
                    "<p>✅ درخواست دریافت شد.</p>" +
                    "<p>هسته هوش مصنوعی آماده اتصال به API اصلی است.</p>";
            });

            toolWorkspace.appendChild(title);
            toolWorkspace.appendChild(textarea);
            toolWorkspace.appendChild(button);
            toolWorkspace.appendChild(result);

            return;
        }

        if (tool === "image") {

            const title = document.createElement("h3");

            title.textContent =
                "ایده تصویر خود را بنویسید";

            const textarea = document.createElement("textarea");

            textarea.placeholder =
                "مثلاً: یک شهر آینده‌نگر زیبا در شب با نورهای نئونی و آسمان پرستاره";

            textarea.style.width = "100%";
            textarea.style.minHeight = "140px";
            textarea.style.padding = "15px";
            textarea.style.marginTop = "15px";
            textarea.style.borderRadius = "15px";
            textarea.style.border = "1px solid #ccc";
            textarea.style.fontSize = "16px";
            textarea.style.direction = "rtl";
            textarea.style.resize = "vertical";

            const button = document.createElement("button");

            button.textContent =
                "🎨 تولید تصویر";

            button.style.marginTop = "15px";
            button.style.padding = "14px 30px";
            button.style.border = "none";
            button.style.borderRadius = "30px";
            button.style.background = "#5b35d5";
            button.style.color = "white";
            button.style.fontSize = "17px";
            button.style.cursor = "pointer";

            const result = document.createElement("div");

            result.style.marginTop = "25px";

            button.addEventListener("click", function () {

                const prompt = textarea.value.trim();

                if (!prompt) {

                    result.innerHTML =
                        "<p>لطفاً ابتدا ایده تصویر را وارد کنید.</p>";

                    return;
                }

                result.innerHTML =
                    "<p>⏳ در حال آماده‌سازی تصویر...</p>";

                const image = document.createElement("img");

                image.src =
                    "https://image.pollinations.ai/prompt/" +
                    encodeURIComponent(prompt) +
                    "?width=1024&height=1024&nologo=true";

                image.alt = prompt;

                image.style.width = "100%";
                image.style.maxWidth = "600px";
                image.style.borderRadius = "20px";
                image.style.marginTop = "15px";

                image.onload = function () {

                    result.innerHTML =
                        "<p>✅ تصویر آماده شد.</p>";

                    result.appendChild(image);
                };

                image.onerror = function () {

                    result.innerHTML =
                        "<p>❌ تولید تصویر انجام نشد. دوباره تلاش کنید.</p>";
                };
            });

            toolWorkspace.appendChild(title);
            toolWorkspace.appendChild(textarea);
            toolWorkspace.appendChild(button);
            toolWorkspace.appendChild(result);

            return;
        }

        const box = document.createElement("div");

        box.style.padding = "25px";
        box.style.borderRadius = "20px";
        box.style.background = "#f3efff";
        box.style.marginTop = "20px";

        const title = document.createElement("h3");

        title.textContent =
            tools[tool].title;

        const text = document.createElement("p");

        text.textContent =
            "✅ ابزار با موفقیت باز شد. محیط عملیاتی این بخش آماده اتصال به موتور اصلی Aluniverse است.";

        text.style.marginTop = "10px";

        box.appendChild(title);
        box.appendChild(text);

        toolWorkspace.appendChild(box);
    }

    document.querySelectorAll(".card[data-tool]").forEach(function (card) {

        card.addEventListener("click", function () {

            const tool =
                card.getAttribute("data-tool");

            showTool(tool);
        });

        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                const tool =
                    card.getAttribute("data-tool");

                showTool(tool);
            }
        });
    });

    backHome.addEventListener("click", function () {
        showHome();
    });

    window.Aluniverse = app;

    console.log("Aluniverse is ready.");
    console.log("Version:", app.version);

});

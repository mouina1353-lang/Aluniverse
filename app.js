document.addEventListener("DOMContentLoaded", () => {

    const tools = {

        ai: {
            icon: "🤖",
            title: "هوش مصنوعی",
            text: "دستیار هوشمند Aluniverse برای گفتگو، تحقیق، تحلیل و انجام وظایف.",
            subtools: [
                ["💬", "چت هوشمند"],
                ["💡", "ایده‌پردازی"],
                ["🔎", "تحقیق و تحلیل"],
                ["🌍", "ترجمه"],
                ["📄", "تحلیل فایل و سند"],
                ["🎯", "مهندسی Prompt"],
                ["🤖", "دستیار تخصصی"],
                ["⚙️", "اتوماسیون"]
            ]
        },

        image: {
            icon: "🎨",
            title: "تولید تصویر",
            text: "تولید و ویرایش تصاویر و طراحی‌های خلاقانه.",
            subtools: [
                ["🖼️", "تولید تصویر"],
                ["✏️", "ویرایش تصویر"],
                ["🔄", "تغییر سبک"],
                ["✨", "ارتقای کیفیت"],
                ["🧹", "حذف پس‌زمینه"],
                ["🏷️", "طراحی لوگو"],
                ["📢", "پوستر و بنر"],
                ["📚", "جلد کتاب"],
                ["📱", "محتوای شبکه اجتماعی"],
                ["📊", "اینفوگرافیک"]
            ]
        },

        video: {
            icon: "🎬",
            title: "ویدئو و انیمیشن",
            text: "ساخت و آماده‌سازی انواع محتوای ویدئویی.",
            subtools: [
                ["🎥", "تولید ویدئو"],
                ["📱", "Reels"],
                ["▶️", "Shorts"],
                ["🎞️", "انیمیشن"],
                ["📝", "متن به ویدئو"],
                ["🖼️", "تصویر به ویدئو"],
                ["🎙️", "دوبله"],
                ["💬", "زیرنویس"],
                ["📢", "تیزر تبلیغاتی"],
                ["✂️", "تدوین ویدئو"]
            ]
        },

        content: {
            icon: "✍️",
            title: "تولید محتوا",
            text: "تولید محتوای متنی، صوتی، تبلیغاتی و شبکه‌های اجتماعی.",
            subtools: [
                ["📝", "مقاله"],
                ["📖", "کتاب و داستان"],
                ["🎙️", "پادکست"],
                ["🎬", "سناریو"],
                ["🔥", "محتوای ویروسی"],
                ["📢", "کمپین"],
                ["🔍", "SEO"],
                ["📱", "شبکه‌های اجتماعی"],
                ["✉️", "محتوای ایمیلی"],
                ["📣", "متن تبلیغاتی"],
                ["📅", "تقویم محتوا"],
                ["🌍", "محتوای چندزبانه"]
            ]
        },

        web: {
            icon: "🌐",
            title: "طراحی وب و نرم‌افزار",
            text: "طراحی، توسعه و آماده‌سازی محصولات دیجیتال.",
            subtools: [
                ["🌐", "ساخت وب‌سایت"],
                ["📄", "Landing Page"],
                ["🛒", "فروشگاه اینترنتی"],
                ["📱", "اپلیکیشن"],
                ["🎨", "UI/UX"],
                ["💻", "تولید کد"],
                ["🔌", "ساخت API"],
                ["🗄️", "Database"],
                ["🧪", "تست و Debug"],
                ["🚀", "Deploy و انتشار"],
                ["⚙️", "اتوماسیون"],
                ["🔧", "نگهداری و به‌روزرسانی"]
            ]
        },

        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            text: "ایده خود را مرحله‌به‌مرحله به یک پروژه واقعی تبدیل کنید.",
            subtools: [
                ["💡", "تبدیل ایده به پروژه"],
                ["🔎", "تحقیقات بازار"],
                ["✅", "اعتبارسنجی ایده"],
                ["📋", "برنامه‌ریزی"],
                ["💼", "مدل کسب‌وکار"],
                ["🏷️", "برندسازی"],
                ["📣", "بازاریابی"],
                ["📢", "کمپین"],
                ["💰", "فروش و درآمد"],
                ["🎓", "آموزش"],
                ["📊", "تحلیل عملکرد"],
                ["📈", "رشد و توسعه"],
                ["⚙️", "اتوماسیون کسب‌وکار"]
            ]
        }

    };

    const cards = document.querySelectorAll(".card[data-tool]");

    const homeHero = document.getElementById("home-hero");
    const features = document.getElementById("features");
    const aboutSection = document.getElementById("about-section");

    const toolPage = document.getElementById("tool-page");
    const toolIcon = document.getElementById("tool-icon");
    const toolTitle = document.getElementById("tool-title");
    const toolDescription = document.getElementById("tool-description");

    const subtoolsContainer = document.getElementById("subtools");
    const workspace = document.getElementById("workspace");
    const workspaceTitle = document.getElementById("workspace-title");
    const userInput = document.getElementById("user-input");
    const language = document.getElementById("language");
    const runButton = document.getElementById("run-button");
    const result = document.getElementById("result");

    const backButton = document.getElementById("back-home");

    let currentTool = null;
    let currentSubtool = null;

    function openTool(toolKey) {

        const tool = tools[toolKey];

        if (!tool) {
            return;
        }

        currentTool = toolKey;
        currentSubtool = null;

        toolIcon.textContent = tool.icon;
        toolTitle.textContent = tool.title;
        toolDescription.textContent = tool.text;

        subtoolsContainer.innerHTML = "";

        workspace.style.display = "none";
        result.style.display = "none";
        result.textContent = "";
        userInput.value = "";

        tool.subtools.forEach((subtool) => {

            const icon = subtool[0];
            const title = subtool[1];

            const button = document.createElement("div");

            button.className = "subtool";

            button.innerHTML = `
                <span class="subtool-icon">${icon}</span>
                <span class="subtool-title">${title}</span>
            `;

            button.addEventListener("click", () => {
                openSubtool(toolKey, title);
            });

            subtoolsContainer.appendChild(button);
        });

        homeHero.style.display = "none";
        features.style.display = "none";
        aboutSection.style.display = "none";
        toolPage.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        console.log("Opened Aluniverse tool:", toolKey);
    }

    function openSubtool(toolKey, subtoolTitle) {

        currentTool = toolKey;
        currentSubtool = subtoolTitle;

        workspaceTitle.textContent =
            tools[toolKey].icon + " " + subtoolTitle;

        userInput.value = "";

        result.style.display = "none";
        result.textContent = "";

        workspace.style.display = "block";

        workspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        console.log(
            "Opened subtool:",
            subtoolTitle
        );
    }

    function buildPrompt(tool, subtool, request, selectedLanguage) {

        return `
شما موتور هوش مصنوعی پلتفرم Aluniverse هستید.

ابزار اصلی:
${tool}

زیرمجموعه:
${subtool}

زبان پاسخ:
${selectedLanguage}

درخواست کاربر:
${request}

لطفاً بهترین پاسخ ممکن را متناسب با ابزار و زیرمجموعه انتخاب‌شده ارائه کن.
پاسخ را واضح، کاربردی، حرفه‌ای و قابل استفاده ارائه بده.
        `.trim();
    }

    async function runTool() {

        const request = userInput.value.trim();

        if (!request) {

            result.style.display = "block";

            result.textContent =
                "لطفاً ابتدا درخواست خود را وارد کنید.";

            return;
        }

        runButton.disabled = true;
        runButton.textContent = "در حال پردازش...";

        result.style.display = "block";
        result.textContent =
            "🤖 Aluniverse در حال پردازش درخواست شما است...";

        try {

            /*
             * ==========================================
             * 🎨 مسیر اختصاصی تولید تصویر
             * فقط برای ابزار image
             * ==========================================
             */

            if (currentTool === "image") {

                const imagePrompt = `
Create an SVG illustration based on this request.

Main tool:
${tools[currentTool].title}

Subtool:
${currentSubtool}

User request:
${request}

Create a clean, attractive and useful illustration.
Return only valid SVG code.
Do not use markdown.
                `.trim();

                const response = await fetch("/api/image", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        prompt: imagePrompt
                    })

                });

                const data = await response.json();

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.error ||
                        "خطا در تولید تصویر."
                    );
                }

                const svg = data.image;

                if (
                    typeof svg !== "string" ||
                    !svg.trim().startsWith("<svg")
                ) {

                    throw new Error(
                        "تصویر معتبر دریافت نشد."
                    );
                }

                /*
                 * تصویر را به صورت فایل موقت SVG نمایش می‌دهیم.
                 * این کار باعث می‌شود SVG مستقیماً داخل HTML اجرا نشود.
                 */

                const blob = new Blob(
                    [svg],
                    {
                        type: "image/svg+xml"
                    }
                );

                const imageUrl =
                    URL.createObjectURL(blob);

                result.innerHTML = "";

                const imageElement =
                    document.createElement("img");

                imageElement.src = imageUrl;
                imageElement.alt =
                    currentSubtool || "Aluniverse Image";

                imageElement.style.maxWidth = "100%";
                imageElement.style.height = "auto";
                imageElement.style.display = "block";
                imageElement.style.margin = "20px auto";
                imageElement.style.borderRadius = "12px";

                result.appendChild(imageElement);

                console.log(
                    "Aluniverse Image Result:",
                    {
                        tool: currentTool,
                        subtool: currentSubtool
                    }
                );

                return;
            }

            /*
             * ==========================================
             * 🤖 مسیر قبلی هوش مصنوعی
             * بدون تغییر برای ۵ ابزار دیگر
             * ==========================================
             */

            const prompt = buildPrompt(
                tools[currentTool].title,
                currentSubtool,
                request,
                language.value
            );

            const response = await fetch("/api/ai", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: prompt
                })

            });

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "خطا در دریافت پاسخ از هوش مصنوعی."
                );
            }

            result.textContent =
                data.answer ||
                "پاسخی از هوش مصنوعی دریافت نشد.";

            console.log(
                "Aluniverse AI Result:",
                {
                    tool: currentTool,
                    subtool: currentSubtool,
                    language: language.value
                }
            );

        } catch (error) {

            console.error(
                "Aluniverse Error:",
                error
            );

            result.textContent =
                "❌ خطا در ارتباط با سرویس\n\n" +
                error.message;

        } finally {

            runButton.disabled = false;
            runButton.textContent =
                "ارسال به هوش مصنوعی";
        }
    }

    cards.forEach((card) => {

        card.addEventListener("click", () => {

            const toolKey =
                card.getAttribute("data-tool");

            openTool(toolKey);
        });
    });

    if (runButton) {

        runButton.addEventListener(
            "click",
            runTool
        );
    }

    if (backButton) {

        backButton.addEventListener("click", () => {

            toolPage.style.display = "none";

            homeHero.style.display = "block";
            features.style.display = "grid";
            aboutSection.style.display = "block";

            workspace.style.display = "none";
            result.style.display = "none";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    const startButton =
        document.querySelector(".start-button");

    if (startButton) {

        startButton.addEventListener("click", (event) => {

            event.preventDefault();

            features.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    console.log(
        "Aluniverse: 6 main tools + all subtools + AI + Image connection activated."
    );

});

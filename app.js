document.addEventListener("DOMContentLoaded", () => {

    const tools = {

        ai: {
            icon: "🤖",
            title: "هوش مصنوعی",
            text: "با هوش مصنوعی Aluniverse گفتگو کن، سؤال بپرس و پاسخ دریافت کن.",
            placeholder: "سؤال یا درخواست خود را بنویسید..."
        },

        image: {
            icon: "🎨",
            title: "تولید تصویر",
            text: "ایده خود را توصیف کن تا آماده تولید تصویر شود.",
            placeholder: "تصویر موردنظر خود را توصیف کنید..."
        },

        video: {
            icon: "🎬",
            title: "ویدئو و انیمیشن",
            text: "ایده ویدئو یا انیمیشن خود را وارد کن.",
            placeholder: "ویدئو یا انیمیشن موردنظر خود را توضیح دهید..."
        },

        content: {
            icon: "✍️",
            title: "تولید محتوا",
            text: "مقاله، کتاب، متن تبلیغاتی و محتوای حرفه‌ای ایجاد کن.",
            placeholder: "موضوع محتوای خود را وارد کنید..."
        },

        web: {
            icon: "🌐",
            title: "طراحی وب",
            text: "ایده وب‌سایت خود را وارد کن و ساختار اولیه آن را دریافت کن.",
            placeholder: "وب‌سایت موردنظر خود را توضیح دهید..."
        },

        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            text: "ایده خود را مرحله‌به‌مرحله به یک پروژه قابل اجرا تبدیل کن.",
            placeholder: "ایده پروژه خود را وارد کنید..."
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

    const backButton = document.getElementById("back-home");


    function createToolInterface(tool) {

        const oldInterface =
            document.getElementById("dynamic-tool-interface");

        if (oldInterface) {
            oldInterface.remove();
        }


        const interfaceBox = document.createElement("div");

        interfaceBox.id = "dynamic-tool-interface";

        interfaceBox.style.maxWidth = "800px";
        interfaceBox.style.margin = "20px auto 0";
        interfaceBox.style.textAlign = "right";


        const label = document.createElement("label");

        label.textContent = "درخواست خود را وارد کنید";

        label.style.display = "block";
        label.style.marginBottom = "10px";
        label.style.fontWeight = "bold";
        label.style.color = "#39209b";


        const textarea = document.createElement("textarea");

        textarea.placeholder = tool.placeholder;

        textarea.style.width = "100%";
        textarea.style.minHeight = "150px";
        textarea.style.padding = "15px";
        textarea.style.border = "2px solid #e3def5";
        textarea.style.borderRadius = "15px";
        textarea.style.fontSize = "16px";
        textarea.style.resize = "vertical";
        textarea.style.direction = "rtl";
        textarea.style.outline = "none";


        const actionButton = document.createElement("button");

        actionButton.textContent = "شروع";

        actionButton.style.display = "block";
        actionButton.style.margin = "15px auto";
        actionButton.style.border = "none";
        actionButton.style.borderRadius = "30px";
        actionButton.style.background = "#5b35d5";
        actionButton.style.color = "white";
        actionButton.style.padding = "14px 40px";
        actionButton.style.fontSize = "18px";
        actionButton.style.fontWeight = "bold";
        actionButton.style.cursor = "pointer";


        const resultBox = document.createElement("div");

        resultBox.style.display = "none";
        resultBox.style.marginTop = "20px";
        resultBox.style.padding = "20px";
        resultBox.style.background = "#f7f4ff";
        resultBox.style.borderRadius = "15px";
        resultBox.style.color = "#39209b";
        resultBox.style.whiteSpace = "pre-wrap";
        resultBox.style.lineHeight = "2";


        actionButton.addEventListener("click", () => {

            const request = textarea.value.trim();

            if (!request) {

                resultBox.style.display = "block";

                resultBox.textContent =
                    "لطفاً ابتدا درخواست خود را وارد کنید.";

                return;
            }


            resultBox.style.display = "block";

            resultBox.textContent =
                "درخواست شما دریافت شد.\n\n" +
                "Aluniverse در حال آماده‌سازی این ابزار است.\n\n" +
                "در مرحله بعد، این بخش به سرویس هوش مصنوعی متصل خواهد شد.";


            console.log("Aluniverse Tool:", tool.title);

            console.log("User Request:", request);

        });


        interfaceBox.appendChild(label);
        interfaceBox.appendChild(textarea);
        interfaceBox.appendChild(actionButton);
        interfaceBox.appendChild(resultBox);


        toolPage.appendChild(interfaceBox);
    }


    function openTool(toolKey) {

        const tool = tools[toolKey];

        if (!tool) {
            return;
        }


        toolIcon.textContent = tool.icon;

        toolTitle.textContent = tool.title;

        toolDescription.textContent = tool.text;


        homeHero.style.display = "none";

        features.style.display = "none";

        aboutSection.style.display = "none";


        toolPage.style.display = "block";


        createToolInterface(tool);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        console.log("Opened tool:", toolKey);

    }


    function closeTool() {

        toolPage.style.display = "none";

        homeHero.style.display = "block";

        features.style.display = "grid";

        aboutSection.style.display = "block";


        const dynamicInterface =
            document.getElementById("dynamic-tool-interface");

        if (dynamicInterface) {
            dynamicInterface.remove();
        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    cards.forEach((card) => {

        card.addEventListener("click", () => {

            const toolKey =
                card.getAttribute("data-tool");

            openTool(toolKey);

        });

    });


    if (backButton) {

        backButton.addEventListener("click", () => {

            closeTool();

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
        "Aluniverse: 6 tools interface activated successfully."
    );

});

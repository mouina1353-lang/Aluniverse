document.addEventListener("DOMContentLoaded", () => {

    const tools = {
        ai: {
            icon: "🤖",
            title: "هوش مصنوعی",
            text: "اینجا می‌توانی با هوش مصنوعی Aluniverse گفتگو کنی و پاسخ بگیری."
        },

        image: {
            icon: "🎨",
            title: "تولید تصویر",
            text: "ایده یا توضیح تصویرت را وارد کن تا بخش تولید تصویر برایت آماده شود."
        },

        video: {
            icon: "🎬",
            title: "ویدئو و انیمیشن",
            text: "ساخت ویدئو، انیمیشن و محتوای متحرک از این بخش انجام می‌شود."
        },

        content: {
            icon: "✍️",
            title: "تولید محتوا",
            text: "مقاله، کتاب، متن تبلیغاتی و محتوای حرفه‌ای تولید کن."
        },

        web: {
            icon: "🌐",
            title: "طراحی وب",
            text: "ایده خود را به ساختار و طراحی یک وب‌سایت تبدیل کن."
        },

        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            text: "Aluniverse مسیر ایده تا اجرای نهایی پروژه را مرحله‌به‌مرحله مدیریت می‌کند."
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

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function closeTool() {

        toolPage.style.display = "none";

        homeHero.style.display = "block";
        features.style.display = "grid";
        aboutSection.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    cards.forEach((card) => {

        card.addEventListener("click", () => {

            const toolKey = card.getAttribute("data-tool");

            openTool(toolKey);

        });

    });


    backButton.addEventListener("click", () => {

        closeTool();

    });


    const startButton = document.querySelector(".start-button");

    if (startButton) {

        startButton.addEventListener("click", (event) => {

            event.preventDefault();

            features.scrollIntoView({
                behavior: "smooth"
            });

        });

    }


    console.log("Aluniverse: 6 tools activated successfully.");

});

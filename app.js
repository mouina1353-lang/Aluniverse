document.addEventListener("DOMContentLoaded", function () {

    const app = {
        name: "Aluniverse",
        version: "1.0.0",
        status: "ready"
    };

    console.log("Aluniverse is ready.");
    console.log("Version:", app.version);


    const tools = {

        ai: {
            icon: "🤖",
            title: "هوش مصنوعی",
            description:
                "ابزارهای هوشمند Aluniverse برای پاسخ‌گویی، تحلیل، حل مسئله و انجام پروژه‌های مختلف."
        },

        image: {
            icon: "🎨",
            title: "تولید تصویر",
            description:
                "ایجاد تصاویر خلاقانه و حرفه‌ای با کمک هوش مصنوعی برای ایده‌ها و پروژه‌های شما."
        },

        video: {
            icon: "🎬",
            title: "ویدئو و انیمیشن",
            description:
                "ساخت ویدئو، انیمیشن و محتوای تصویری برای پروژه‌ها، آموزش و تبلیغات."
        },

        content: {
            icon: "✍️",
            title: "تولید محتوا",
            description:
                "تولید مقاله، کتاب، متن تبلیغاتی، محتوای شبکه‌های اجتماعی و محتوای حرفه‌ای."
        },

        web: {
            icon: "🌐",
            title: "طراحی وب",
            description:
                "طراحی و توسعه وب‌سایت‌ها و پروژه‌های دیجیتال با کمک ابزارهای هوشمند."
        },

        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            description:
                "هدایت مرحله‌به‌مرحله پروژه از ایده اولیه تا برنامه‌ریزی، ساخت و اجرای نهایی."
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


    window.openTool = function (tool) {

        console.log("Opening tool:", tool);

        const selectedTool = tools[tool];

        if (!selectedTool) {

            console.error("Unknown Aluniverse tool:", tool);

            return;
        }


        toolIcon.textContent = selectedTool.icon;

        toolTitle.textContent = selectedTool.title;

        toolDescription.textContent = selectedTool.description;


        homeHero.style.display = "none";

        features.style.display = "none";

        aboutSection.style.display = "none";


        toolPage.style.display = "block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    document.querySelectorAll(".card[data-tool]").forEach(function (card) {

        card.addEventListener("click", function () {

            const tool = card.dataset.tool;

            openTool(tool);

        });

    });


    backHome.addEventListener("click", function () {

        toolPage.style.display = "none";

        homeHero.style.display = "";

        features.style.display = "";

        aboutSection.style.display = "";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    window.Aluniverse = app;

});

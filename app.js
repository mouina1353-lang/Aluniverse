document.addEventListener("DOMContentLoaded", function () {

    const app = {
        name: "Aluniverse",
        version: "1.0.0",
        status: "ready"
    };

    console.log("Aluniverse is ready.");
    console.log("Version:", app.version);

    window.openTool = function (tool) {

        const toolNames = {
            ai: "هوش مصنوعی",
            image: "تولید تصویر",
            video: "ویدئو و انیمیشن",
            content: "تولید محتوا",
            web: "طراحی وب",
            execute: "از ایده تا اجرا"
        };

        const toolName = toolNames[tool] || "ابزار Aluniverse";

        let page = document.getElementById("tool-page");

        if (!page) {
            page = document.createElement("section");
            page.id = "tool-page";
            page.className = "section";
            document.querySelector("main").appendChild(page);
        }

        page.innerHTML = `
            <h2>${toolName}</h2>
            <p>ابزار ${toolName} در Aluniverse آماده استفاده است.</p>
            <button id="back-home" style="
                margin-top:20px;
                padding:12px 25px;
                border:none;
                border-radius:25px;
                background:#5b35d5;
                color:white;
                font-size:16px;
                cursor:pointer;
            ">بازگشت</button>
        `;

        document.querySelectorAll(".hero, .features, .section").forEach(function (section) {
            section.style.display = "none";
        });

        page.style.display = "block";

        document.getElementById("back-home").addEventListener("click", function () {
            document.querySelectorAll(".hero, .features, .section").forEach(function (section) {
                section.style.display = "";
            });

            page.style.display = "none";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        page.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const buttons = document.querySelectorAll(
        "button, [role='button'], .icon, .icon-card, .tool-card, .feature-card"
    );

    buttons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            const action =
                button.dataset.action ||
                button.dataset.target ||
                button.dataset.page ||
                "";

            console.log("Aluniverse action:", action);

            button.style.transform = "scale(0.97)";

            setTimeout(function () {
                button.style.transform = "";
            }, 120);

            const targetId = button.dataset.target;

            if (targetId) {

                const target = document.getElementById(
                    targetId.replace("#", "")
                );

                if (target) {

                    event.preventDefault();

                    document.querySelectorAll(
                        ".page, .section, .panel, .tool-page, .tool.page"
                    ).forEach(function (section) {
                        section.style.display = "none";
                    });

                    target.style.display = "block";

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    return;
                }
            }

            const page = button.dataset.page;

            if (page) {
                event.preventDefault();
                window.location.href = page;
                return;
            }

            if (
                button.tagName.toLowerCase() === "a" &&
                button.getAttribute("href") &&
                button.getAttribute("href") !== "#"
            ) {
                return;
            }

            if (action) {
                console.log("Selected:", action);
            }
        });
    });

    document.querySelectorAll("[data-action]").forEach(function (element) {

        element.addEventListener("click", function () {

            const action = element.dataset.action;

            console.log(
                "Aluniverse selected action:",
                action
            );
        });
    });

    document.querySelectorAll("a[href='#']").forEach(function (link) {

        link.addEventListener("click", function (event) {
            event.preventDefault();
        });
    });

    window.Aluniverse = app;

});

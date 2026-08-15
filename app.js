document.addEventListener("DOMContentLoaded", function () {

    const app = {
        name: "Aluniverse",
        version: "1.0.0",
        status: "ready"
    };

    console.log("Aluniverse is ready.");
    console.log("Version:", app.version);

    const buttons = document.querySelectorAll(
        "button, [role='button'], .icon, .icon-card, .tool-card, .feature-card"
    );

    buttons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            const action =
                button.dataset.action ||
                button.dataset.target ||
                button.dataset.page ||
                button.getAttribute("onclick") ||
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
                        ".page, .section, .panel, .tool-page"
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

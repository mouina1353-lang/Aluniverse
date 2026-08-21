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
            text: "مقاله، متن تبلیغاتی، کتاب، پست و محتوای حرفه‌ای تولید کن."
        },
        web: {
            icon: "🌐",
            title: "طراحی وب",
            text: "ایده خود را به ساختار و طراحی وب تبدیل کن."
        },
        execute: {
            icon: "🚀",
            title: "از ایده تا اجرا",
            text: "Aluniverse مسیر ایده تا اجرای نهایی پروژه را مرحله‌به‌مرحله مدیریت می‌کند."
        }
    };

    function createPanel() {
        let panel = document.getElementById("aluniverse-tool-panel");

        if (panel) return panel;

        panel = document.createElement("div");
        panel.id = "aluniverse-tool-panel";

        panel.innerHTML = `
            <div class="aluniverse-tool-box">
                <button id="aluniverse-close" type="button">✕</button>
                <div class="tool-icon"></div>
                <h2 id="aluniverse-tool-title"></h2>
                <p id="aluniverse-tool-text"></p>

                <textarea
                    id="aluniverse-input"
                    placeholder="ایده یا درخواست خود را اینجا وارد کنید..."
                ></textarea>

                <button id="aluniverse-start" type="button">
                    شروع کار
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        document
            .getElementById("aluniverse-close")
            .addEventListener("click", closeTool);

        panel.addEventListener("click", (event) => {
            if (event.target === panel) {
                closeTool();
            }
        });

        document
            .getElementById("aluniverse-start")
            .addEventListener("click", () => {
                const input = document.getElementById("aluniverse-input");
                const value = input.value.trim();

                if (!value) {
                    input.focus();
                    return;
                }

                alert("درخواست شما در Aluniverse ثبت شد.");
            });

        return panel;
    }

    function openTool(toolKey) {
        const tool = tools[toolKey];

        if (!tool) return;

        const panel = createPanel();

        panel.querySelector(".tool-icon").textContent = tool.icon;
        panel.querySelector("#aluniverse-tool-title").textContent = tool.title;
        panel.querySelector("#aluniverse-tool-text").textContent = tool.text;
        panel.querySelector("#aluniverse-input").value = "";

        panel.style.display = "flex";
    }

    function closeTool() {
        const panel = document.getElementById("aluniverse-tool-panel");

        if (panel) {
            panel.style.display = "none";
        }
    }

    document.addEventListener("click", (event) => {
        const element = event.target.closest("[data-tool]");

        if (!element) return;

        const toolKey = element.getAttribute("data-tool");

        if (tools[toolKey]) {
            event.preventDefault();
            openTool(toolKey);
        }
    });

    Object.keys(tools).forEach((toolKey) => {
        const selectors = [
            `#${toolKey}`,
            `#${toolKey}-tool`,
            `.${toolKey}`
        ];

        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                element.setAttribute("data-tool", toolKey);
            });
        });
    });

    const style = document.createElement("style");

    style.textContent = `
        #aluniverse-tool-panel {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            background: rgba(0, 0, 0, 0.72);
            direction: rtl;
        }

        .aluniverse-tool-box {
            position: relative;
            width: min(600px, 100%);
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
            box-sizing: border-box;
            border-radius: 24px;
            background: #ffffff;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
            text-align: center;
        }

        #aluniverse-close {
            position: absolute;
            top: 12px;
            left: 12px;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: #eeeeee;
            font-size: 20px;
            cursor: pointer;
        }

        .tool-icon {
            font-size: 64px;
            margin-bottom: 10px;
        }

        .aluniverse-tool-box h2 {
            margin: 10px 0;
            font-size: 28px;
        }

        .aluniverse-tool-box p {
            line-height: 1.9;
            font-size: 17px;
            color: #555555;
        }

        #aluniverse-input {
            width: 100%;
            min-height: 130px;
            margin-top: 15px;
            padding: 15px;
            box-sizing: border-box;
            border: 1px solid #dddddd;
            border-radius: 14px;
            resize: vertical;
            font-family: inherit;
            font-size: 16px;
            direction: rtl;
        }

        #aluniverse-start {
            width: 100%;
            margin-top: 15px;
            padding: 15px;
            border: none;
            border-radius: 14px;
            background: #111827;
            color: #ffffff;
            font-size: 17px;
            cursor: pointer;
        }

        #aluniverse-start:hover {
            opacity: 0.9;
        }
    `;

    document.head.appendChild(style);

    console.log("Aluniverse: 6 tools activated.");
});

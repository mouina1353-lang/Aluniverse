document.addEventListener("DOMContentLoaded", () => {
  const tools = {
    ai: {
      icon: "🤖",
      title: "هوش مصنوعی",
      subtools: [
        { name: "چت هوشمند", type: "chat" },
        { name: "پرسش و پاسخ", type: "chat" },
        { name: "دستیار هوشمند", type: "chat" }
      ]
    },

    image: {
      icon: "🎨",
      title: "تولید تصویر",
      subtools: [
        { name: "تولید تصویر با متن", type: "placeholder" },
        { name: "ویرایش تصویر", type: "placeholder" },
        { name: "تبدیل سبک تصویر", type: "placeholder" }
      ]
    },

    video: {
      icon: "🎬",
      title: "ویدئو و انیمیشن",
      subtools: [
        { name: "تولید ویدئو", type: "placeholder" },
        { name: "ساخت انیمیشن", type: "placeholder" },
        { name: "ویرایش ویدئو", type: "placeholder" }
      ]
    },

    content: {
      icon: "✍️",
      title: "تولید محتوا",
      subtools: [
        { name: "مقاله", type: "placeholder" },
        { name: "کتاب", type: "placeholder" },
        { name: "پادکست", type: "placeholder" },
        { name: "تبلیغات", type: "placeholder" }
      ]
    },

    web: {
      icon: "🌐",
      title: "طراحی وب",
      subtools: [
        { name: "ساخت سایت", type: "placeholder" },
        { name: "طراحی صفحه", type: "placeholder" },
        { name: "تولید کد", type: "placeholder" }
      ]
    },

    execute: {
      icon: "🚀",
      title: "از ایده تا اجرا",
      subtools: [
        { name: "تبدیل ایده به پروژه", type: "placeholder" },
        { name: "برنامه‌ریزی پروژه", type: "placeholder" },
        { name: "اجرای خودکار", type: "placeholder" }
      ]
    }
  };

  const container =
    document.getElementById("tools") ||
    document.getElementById("app") ||
    document.body;

  function createButton(text, className = "") {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    return button;
  }

  function clearContainer() {
    container.innerHTML = "";
  }

  function showTools() {
    clearContainer();

    const title = document.createElement("h2");
    title.textContent = "Aluniverse";
    container.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "tools-grid";

    Object.entries(tools).forEach(([key, tool]) => {
      const button = createButton(
        `${tool.icon} ${tool.title}`,
        "tool-button"
      );

      button.addEventListener("click", () => {
        showSubTools(key, tool);
      });

      grid.appendChild(button);
    });

    container.appendChild(grid);
  }

  function showSubTools(key, tool) {
    clearContainer();

    const title = document.createElement("h2");
    title.textContent = `${tool.icon} ${tool.title}`;
    container.appendChild(title);

    const list = document.createElement("div");
    list.className = "subtools";

    tool.subtools.forEach((subtool) => {
      const button = createButton(
        subtool.name,
        "subtool-button"
      );

      button.addEventListener("click", () => {
        if (subtool.type === "chat") {
          showChat(subtool.name);
        } else {
          showPlaceholder(subtool.name);
        }
      });

      list.appendChild(button);
    });

    container.appendChild(list);

    const back = createButton("⬅️ بازگشت", "back-button");
    back.addEventListener("click", showTools);
    container.appendChild(back);
  }

  function showChat(titleText) {
    clearContainer();

    const title = document.createElement("h2");
    title.textContent = `🤖 ${titleText}`;
    container.appendChild(title);

    const chatBox = document.createElement("div");
    chatBox.id = "chatBox";
    chatBox.className = "chat-box";
    container.appendChild(chatBox);

    const input = document.createElement("textarea");
    input.id = "aiInput";
    input.placeholder = "درخواست خود را بنویسید...";
    input.className = "ai-input";
    container.appendChild(input);

    const sendButton = createButton(
      "ارسال",
      "send-button"
    );
    container.appendChild(sendButton);

    const back = createButton(
      "⬅️ بازگشت",
      "back-button"
    );
    container.appendChild(back);

    back.addEventListener("click", () => {
      showSubTools("ai", tools.ai);
    });

    sendButton.addEventListener("click", sendMessage);

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  async function sendMessage() {
    const input = document.getElementById("aiInput");
    const chatBox = document.getElementById("chatBox");

    if (!input || !chatBox) return;

    const message = input.value.trim();

    if (!message) {
      return;
    }

    addMessage(chatBox, "شما", message);

    input.value = "";
    input.disabled = true;

    const loading = document.createElement("div");
    loading.className = "ai-loading";
    loading.textContent = "🤖 در حال دریافت پاسخ از هوش مصنوعی...";
    chatBox.appendChild(loading);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      const data = await response.json();

      loading.remove();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "خطا در دریافت پاسخ"
        );
      }

      addMessage(
        chatBox,
        "Aluniverse AI",
        data.answer
      );

    } catch (error) {
      loading.remove();

      addMessage(
        chatBox,
        "خطا",
        `❌ ${error.message}`
      );

      console.error("AI ERROR:", error);

    } finally {
      input.disabled = false;
      input.focus();
    }
  }

  function addMessage(chatBox, sender, text) {
    const message = document.createElement("div");
    message.className = "chat-message";

    const senderElement = document.createElement("strong");
    senderElement.textContent = `${sender}: `;

    const textElement = document.createElement("span");
    textElement.textContent = text;

    message.appendChild(senderElement);
    message.appendChild(textElement);

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showPlaceholder(titleText) {
    clearContainer();

    const title = document.createElement("h2");
    title.textContent = titleText;
    container.appendChild(title);

    const message = document.createElement("p");
    message.textContent =
      "این ابزار در حال آماده‌سازی برای اتصال به سرویس واقعی است.";
    container.appendChild(message);

    const back = createButton(
      "⬅️ بازگشت",
      "back-button"
    );

    back.addEventListener("click", showTools);
    container.appendChild(back);
  }

  showTools();
});

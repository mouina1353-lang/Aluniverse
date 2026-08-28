document.addEventListener("DOMContentLoaded", () => {

  const tools = {
    ai: {
      icon: "🤖",
      title: "هوش مصنوعی",
      description: "دستیار، تحقیق، تحلیل، ترجمه و ابزارهای هوشمند",
      subtools: [
        { name: "چت هوشمند", type: "chat" },
        { name: "پرسش و پاسخ", type: "chat" },
        { name: "دستیار هوشمند", type: "chat" }
      ]
    },

    image: {
      icon: "🎨",
      title: "تولید تصویر",
      description: "تصویر، لوگو، پوستر، بنر و طراحی خلاقانه",
      subtools: [
        { name: "تولید تصویر با متن", type: "placeholder" },
        { name: "ویرایش تصویر", type: "placeholder" },
        { name: "تبدیل سبک تصویر", type: "placeholder" }
      ]
    },

    video: {
      icon: "🎬",
      title: "ویدئو و انیمیشن",
      description: "ویدئو، Reels، Shorts، انیمیشن و تیزر",
      subtools: [
        { name: "تولید ویدئو", type: "placeholder" },
        { name: "ساخت انیمیشن", type: "placeholder" },
        { name: "ویرایش ویدئو", type: "placeholder" }
      ]
    },

    content: {
      icon: "✍️",
      title: "تولید محتوا",
      description: "مقاله، کتاب، پادکست، کمپین و محتوای ویروسی",
      subtools: [
        { name: "مقاله", type: "placeholder" },
        { name: "کتاب", type: "placeholder" },
        { name: "پادکست", type: "placeholder" },
        { name: "کمپین و تبلیغات", type: "placeholder" }
      ]
    },

    web: {
      icon: "🌐",
      title: "طراحی وب و نرم‌افزار",
      description: "سایت، اپلیکیشن، UI/UX، API و توسعه نرم‌افزار",
      subtools: [
        { name: "ساخت سایت", type: "placeholder" },
        { name: "طراحی صفحه", type: "placeholder" },
        { name: "تولید کد", type: "placeholder" }
      ]
    },

    execute: {
      icon: "🚀",
      title: "از ایده تا اجرا",
      description: "تبدیل ایده به پروژه، کسب‌وکار و مسیر اجرایی",
      subtools: [
        { name: "تبدیل ایده به پروژه", type: "placeholder" },
        { name: "برنامه‌ریزی پروژه", type: "placeholder" },
        { name: "اجرای خودکار", type: "placeholder" }
      ]
    }
  };

  const cards = document.querySelectorAll(".card");

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
  const backHome = document.getElementById("back-home");

  let currentTool = null;
  let currentSubtool = null;

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.tool;

      if (tools[key]) {
        openTool(key);
      }
    });
  });

  function openTool(key) {
    const tool = tools[key];

    if (!tool) return;

    currentTool = key;

    homeHero.style.display = "none";
    features.style.display = "none";
    aboutSection.style.display = "none";

    toolPage.style.display = "block";

    toolIcon.textContent = tool.icon;
    toolTitle.textContent = tool.title;
    toolDescription.textContent = tool.description;

    workspace.style.display = "none";
    result.style.display = "none";
    result.textContent = "";

    subtoolsContainer.innerHTML = "";

    tool.subtools.forEach(subtool => {

      const button = document.createElement("div");
      button.className = "subtool";

      const icon = document.createElement("span");
      icon.className = "subtool-icon";

      const title = document.createElement("span");
      title.className = "subtool-title";
      title.textContent = subtool.name;

      if (subtool.type === "chat") {
        icon.textContent = "💬";
      } else {
        icon.textContent = "✨";
      }

      button.appendChild(icon);
      button.appendChild(title);

      button.addEventListener("click", () => {
        openSubtool(subtool);
      });

      subtoolsContainer.appendChild(button);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function openSubtool(subtool) {

    currentSubtool = subtool;

    workspace.style.display = "block";

    workspaceTitle.textContent = subtool.name;

    userInput.value = "";
    result.style.display = "none";
    result.textContent = "";

    if (subtool.type === "chat") {
      userInput.placeholder =
        "پیام خود را بنویسید؛ هوش مصنوعی پاسخ خواهد داد...";

      runButton.textContent = "ارسال به هوش مصنوعی";
    } else {
      userInput.placeholder =
        "درخواست یا توضیحات خود را اینجا بنویسید...";

      runButton.textContent = "اجرای آزمایشی";
    }

    workspace.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  runButton.addEventListener("click", async () => {

    const message = userInput.value.trim();

    if (!message) {
      result.style.display = "block";
      result.textContent = "لطفاً ابتدا درخواست خود را وارد کنید.";
      return;
    }

    if (!currentSubtool) return;

    if (currentSubtool.type !== "chat") {
      result.style.display = "block";
      result.textContent =
        "این ابزار در حال آماده‌سازی برای اتصال به سرویس واقعی است.";
      return;
    }

    runButton.disabled = true;
    runButton.textContent = "در حال دریافت پاسخ...";

    result.style.display = "block";
    result.textContent = "🤖 در حال ارتباط با هوش مصنوعی...";

    try {

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          language: language.value
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "خطا در ارتباط با هوش مصنوعی"
        );
      }

      result.textContent =
        data.answer || "پاسخی از هوش مصنوعی دریافت نشد.";

    } catch (error) {

      console.error("AI ERROR:", error);

      result.textContent =
        "❌ خطا در ارتباط با هوش مصنوعی\n\n" +
        error.message;
    }

    runButton.disabled = false;
    runButton.textContent = "ارسال به هوش مصنوعی";
  });

  backHome.addEventListener("click", () => {

    toolPage.style.display = "none";

    homeHero.style.display = "block";
    features.style.display = "grid";
    aboutSection.style.display = "block";

    workspace.style.display = "none";

    currentTool = null;
    currentSubtool = null;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

});

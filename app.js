document.addEventListener("DOMContentLoaded", function () {

  const app = {
    name: "Aluniverse",
    version: "1.0.0",
    status: "ready"
  };

  console.log("Aluniverse is ready.");
  console.log("Version:", app.version);

  const buttons = document.querySelectorAll("button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {

      const action = button.dataset.action || button.textContent.trim();

      console.log("Aluniverse action:", action);

      button.style.transform = "scale(0.97)";

      setTimeout(function () {
        button.style.transform = "";
      }, 120);
    });
  });

  window.Aluniverse = app;
});

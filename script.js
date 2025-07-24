document.addEventListener("DOMContentLoaded", () => {
  const stepTitle = document.getElementById("step-title");
  const stepDescription = document.getElementById("step-description");
  const toolsList = document.getElementById("tools-list");

  document.querySelectorAll(".step").forEach(step => {
    step.addEventListener("click", () => {
      const key = step.dataset.step;
      const data = lifecycleData[key];

      if (data) {
        stepTitle.textContent = data.title;
        stepDescription.textContent = data.description;

        // Vymažeme staré položky
        toolsList.innerHTML = "";

        data.tools.forEach(tool => {
          const li = document.createElement("li");
          li.textContent = tool;
          toolsList.appendChild(li);
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toolsList = document.getElementById("tools-list");
  const stepTitle = document.getElementById("step-title");
  const stepDescription = document.getElementById("step-description");
  let toolsData = [];

  // Načti JSON s nástroji
  fetch("dmtools.json")
    .then(response => response.json())
    .then(data => {
      toolsData = data;
    });

  // Přidej funkce ke všem krokům
  const steps = document.querySelectorAll(".step");
  steps.forEach(step => {
    step.addEventListener("click", () => {
      const stepKey = step.dataset.step;

      // Z původního data.js
      const stepInfo = lifecycleDescriptions[stepKey];
      stepTitle.textContent = stepInfo.title;
      stepDescription.textContent = stepInfo.description;

      // Nástroje z tools.json
      const relevantTools = toolsData.filter(tool => tool.lifecycle_step === stepKey);
      toolsList.innerHTML = "";

      if (relevantTools.length === 0) {
        toolsList.innerHTML = "<li>No tools listed for this step.</li>";
        return;
      }

      relevantTools.forEach(tool => {
        const li = document.createElement("li");
        li.textContent = tool.name;
        li.classList.add("tool-item");
        li.title = tool.desc_short; // Tooltip
        toolsList.appendChild(li);
      });
    });
  });
});

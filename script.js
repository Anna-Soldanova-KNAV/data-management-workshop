let toolsData = [];

fetch('dmtools.json')
  .then(response => response.json())
  .then(data => {
    toolsData = data;
  })
  .catch(err => {
    console.error("JSON loading error:", err);
  });

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const stepTitle = document.getElementById("step-title");
  const stepDescription = document.getElementById("step-description");
  const toolsList = document.getElementById("tools-list");

  steps.forEach(step => {
    step.addEventListener("click", () => {
      const stepKey = step.dataset.step;

      steps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");

      const stepInfo = lifecycleData[stepKey];
      if (!stepInfo) return;

      stepTitle.textContent = stepInfo.title;
      stepDescription.textContent = stepInfo.description;
      toolsList.innerHTML = "";

      const filteredTools = toolsData.filter(tool =>
        tool.lifecycle_step.some(s => s.trim() === stepKey)
      );

      if (filteredTools.length === 0) {
        toolsList.innerHTML = "<li>No tools available for this step.</li>";
        return;
      }

      filteredTools.forEach(tool => {
        const li = document.createElement("li");
        const name = tool.full_name || tool.id_name || "Unnamed tool";
        li.textContent = name;
        li.classList.add("tool-item");
        li.style.cursor = "pointer";

        li.addEventListener("click", (e) => {
          e.stopPropagation();
          document.querySelectorAll(".tooltip").forEach(t => t.remove());

          const tooltip = document.createElement("div");
          tooltip.className = "tooltip";
          tooltip.textContent = tool.desc_short ? tool.desc_short.replace(/^"+|"+$/g, '') : "No description available.";
          tooltip.style.position = "fixed";
          document.body.appendChild(tooltip);

          // Ulož si tooltip a li do konstant, aby je listener správně viděl
          const currentTooltip = tooltip;
          const currentLi = li;

          setTimeout(() => {
            const outsideClickListener = (event) => {
              if (!currentTooltip.contains(event.target) && !currentLi.contains(event.target)) {
                currentTooltip.remove();
                document.removeEventListener("click", outsideClickListener);
              }
            };
            document.addEventListener("click", outsideClickListener);
          }, 0);
        });

        toolsList.appendChild(li);
      });
    });
  });
});

let toolsData = [];

fetch('dmtools.json')
  .then(response => response.json())
  .then(data => {
    toolsData = data;
  })
  .catch(err => {
    console.error("Chyba při načítání JSON:", err);
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
    

      // Nastav titulek a popis kroku z lifecycleData
      const stepInfo = lifecycleData[stepKey];
      if (!stepInfo) return;

      stepTitle.textContent = stepInfo.title;
      stepDescription.textContent = stepInfo.description;

      // Vyčisti seznam nástrojů
      toolsList.innerHTML = "";

      // Filtrování nástrojů, které mají lifecycle_step obsahovat daný krok (trim pro jistotu)
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

        // Tooltip / bublina s popisem
        li.addEventListener("click", (e) => {
          e.stopPropagation();
          // Odstran všechny existující tooltipy
          document.querySelectorAll(".tooltip").forEach(t => t.remove());

          const tooltip = document.createElement("div");
          tooltip.className = "tooltip";
          tooltip.textContent = tool.desc_short ? tool.desc_short.replace(/^"+|"+$/g, '') : "No description available.";
          document.body.appendChild(tooltip);

          // Pozice tooltipu
          const rect = li.getBoundingClientRect();
          const tooltipWidth = 300; // stejná jako v CSS
          const tooltipHeight = 100; // přibližná výška

          const spaceRight = window.innerWidth - (rect.right + 10);
          const spaceBottom = window.innerHeight - (rect.bottom + 10);

          tooltip.classList.add("custom-tooltip");
          tooltip.style.position = "absolute";

          if (spaceRight > tooltipWidth) {
            // Zobrazit vpravo
            tooltip.style.left = `${rect.right + window.scrollX + 10}px`;
            tooltip.style.top = `${rect.top + window.scrollY}px`;
          } else if (spaceBottom > tooltipHeight) {
            // Zobrazit pod
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
          } else {
            // Jinak zobrazit nad
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltipHeight - 5}px`;
          }


          // Klik mimo tooltip = tooltip zmizí
          setTimeout(() => {
            document.addEventListener("click", () => {
              tooltip.remove();
            }, { once: true });
          }, 0);
        });

        toolsList.appendChild(li);
      });
    });
  });
});

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

          // Odstraň předchozí info boxy (v rámci všech <li>)
          document.querySelectorAll(".tool-info").forEach(t => t.remove());

          // Vytvoř box
          const infoBox = document.createElement("div");
          infoBox.className = "tool-info";

          // SVG ikona (pokud existuje)
          if (tool.icon) {
            const svg = document.createElement("img");
            svg.src = `icons/${tool.icon}`;
            svg.alt = `${name} icon`;
            svg.classList.add("tool-icon");
            svg.onerror = () => {
              svg.style.display = 'none'; // Skryje neplatný obrázek
            };

            infoBox.appendChild(svg);
          }

          // Popis nástroje
          const desc = document.createElement("p");
          desc.textContent = tool.desc_short
            ? tool.desc_short.replace(/^"+|"+$/g, '')
            : "No description available.";
          infoBox.appendChild(desc);

          // Přidej box do <li>
          li.appendChild(infoBox);

          // Zavři box při kliknutí mimo
          setTimeout(() => {
            const outsideClickListener = (event) => {
              if (!infoBox.contains(event.target) && !li.contains(event.target)) {
                infoBox.remove();
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


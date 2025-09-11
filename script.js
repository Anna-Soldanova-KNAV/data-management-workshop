let toolsData = [];

fetch('dmtools.json')
  .then(response => response.json())
  .then(data => {
    toolsData = data.sort((a, b) => {
      const nameA = (a.full_name || "").toLowerCase();
      const nameB = (b.full_name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
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

      const filteredTools = toolsData
        .filter(tool =>
          tool.lifecycle_step.some(s => s.trim() === stepKey)
        )
        .sort((a, b) => {
          const nameA = (a.full_name || a.id_name || "Unnamed tool").toLowerCase();
          const nameB = (b.full_name || b.id_name || "Unnamed tool").toLowerCase();
          return nameA.localeCompare(nameB);
        });

      if (filteredTools.length === 0) {
        toolsList.innerHTML = "<li>No tools available for this step.</li>";
        return;
      }

      filteredTools.forEach(tool => {
        const li = document.createElement("li");
        li.classList.add("tool-item");
        li.style.cursor = "pointer";

        // text do span, aby se zvýrazňovalo jen toto
        const span = document.createElement("span");
        span.textContent = tool.full_name || tool.id_name || "Unnamed tool";
        li.appendChild(span);

        li.addEventListener("click", (e) => {
          e.stopPropagation();

          document.querySelectorAll(".tool-item").forEach(t => t.classList.remove("active"));
          li.classList.add("active");

          // Odstranění předchozích info boxů (v rámci všech <li>)
          document.querySelectorAll(".tool-info").forEach(t => t.remove());

          // Vytvoření boxu
          const infoBox = document.createElement("div");
          infoBox.className = "tool-info";

          // Ikony, pokud existují (podpora pro jedno i více SVG souborů)
          if (tool.icon) {
            const icons = Array.isArray(tool.icon) ? tool.icon : [tool.icon];

            // Kontejner pro ikony
            const iconGroup = document.createElement("div");
            iconGroup.classList.add("tool-icon-group");

            icons.forEach(iconFile => {
              const svg = document.createElement("img");
              svg.src = `icons/${iconFile}`;
              svg.alt = `${name} icon`;
              svg.classList.add("tool-icon");

              svg.onerror = () => {
                svg.style.display = 'none'; // skryje rozbitý obrázek
              };
              
              // Přidání ikony do skupiny
              iconGroup.appendChild(svg);
            });
            
            // Přidání skupiny ikon do infoBoxu
            infoBox.appendChild(iconGroup);
          }


          // Popis nástroje
          const desc = document.createElement("p");
          desc.textContent = tool.desc_short
            ? tool.desc_short.replace(/^"+|"+$/g, '')
            : "No description available.";
          infoBox.appendChild(desc);

          // Přidání info boxu do <li>
          li.appendChild(infoBox);

          // Zavření boxu při kliknutí mimo
          setTimeout(() => {
            const outsideClickListener = (event) => {
              if (!infoBox.contains(event.target) && !li.contains(event.target)) {
                infoBox.remove();
                li.classList.remove("active"); // odstraní aktivní zvýraznění
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


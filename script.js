importedData = {}; // původní data z data.js
jsonData = []; // data z data.json

// Načtení JSONu z externího souboru
fetch('dmtools.json')
  .then(response => response.json())
  .then(json => {
    jsonData = json;
    initialize();
  })
  .catch(error => {
    console.error('Chyba při načítání JSON dat:', error);
    initialize(); // Spustit i když JSON selže
  });

function initialize() {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepId = step.dataset.step;
      const titleEl = document.getElementById('step-title');
      const descEl = document.getElementById('step-description');
      const toolsEl = document.getElementById('tools-list');

      // Vyčistit obsah
      toolsEl.innerHTML = '';

      // Původní data
      const original = importedData[stepId];
      if (original) {
        titleEl.textContent = original.title;
        descEl.textContent = original.description;
        original.tools.forEach(tool => {
          const li = document.createElement('li');
          li.textContent = tool;
          toolsEl.appendChild(li);
        });
      }

      // JSON doplněk
      const extra = jsonData.find(item => item.id_name === stepId);
      if (extra) {
        // Přidat doplňující popis
        if (extra.additional_info) {
          const extraP = document.createElement('p');
          extraP.textContent = extra.additional_info;
          descEl.appendChild(extraP);
        }

        // Přidat doplňkové nástroje
        if (extra.extra_tools && Array.isArray(extra.extra_tools)) {
          extra.extra_tools.forEach(tool => {
            const li = document.createElement('li');
            li.textContent = tool;
            toolsEl.appendChild(li);
          });
        }
      }
    });
  });
}

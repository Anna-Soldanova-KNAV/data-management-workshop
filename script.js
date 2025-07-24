// Data pro jednotlivé kroky (můžeš upravit a přidat)
const stepsData = {
  planning: {
    description: "Plánování datového managementu, jak data sbírat, ukládat a sdílet.",
    tools: ["Data Management Plan (DMP) nástroje", "Trello", "Jira"]
  },
  collection: {
    description: "Sběr dat pomocí formulářů, senzorů nebo experimentů.",
    tools: ["Excel", "Google Forms", "Qualtrics"]
  },
  storage: {
    description: "Ukládání dat na bezpečné a dostupné místo.",
    tools: ["Dropbox", "Google Drive", "NAS servery"]
  }
  // další kroky můžeš doplnit
};

// Najdeme všechny tlačítka kroků
const buttons = document.querySelectorAll("button.step");

// Najdeme boxy, kde budeme měnit text
const descriptionBox = document.querySelector("#description p");
const toolsList = document.querySelector("#tools-list");

// Přidáme posluchač událostí na každé tlačítko
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const step = button.getAttribute("data-step");
    const data = stepsData[step];
    if (data) {
      descriptionBox.textContent = data.description;

      // Vyčistíme seznam nástrojů
      toolsList.innerHTML = "";
      data.tools.forEach(tool => {
        const li = document.createElement("li");
        li.textContent = tool;
        toolsList.appendChild(li);
      });
    }
  });
});

"use strict";
class Menu {
    constructor(campainId, sandboxId, manualId, settingsId) {
        document.addEventListener("DOMContentLoaded", () => {
            //* assaign menu options to thier corrosponding button elements.
            document.getElementById(campainId).addEventListener("click", () => this.campain());
            document.getElementById(sandboxId).addEventListener("click", () => this.sandbox());
            document.getElementById(manualId).addEventListener("click", () => this.manual());
            document.getElementById(settingsId).addEventListener("click", () => this.settings());
        });
    }
    campain() { window.location.href = "simulator.html"; }
    sandbox() { window.location.href = "simulator.html"; }
    manual() { window.open('manual.html', '_blank'); }
    settings() { window.location.href = "settings.html"; }
}
;
const menu = new Menu("campain", "sandbox", "manual", "settings");

import { URLQuery } from "./URLQuery.js";
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
    campain() { window.location.href = 'simulator.html' + window.location.search; }
    sandbox() { window.location.href = 'simulator.html' + window.location.search; }
    manual() { window.open('manual.html' + window.location.search, '_blank'); }
    settings() { window.location.href = 'settings.html' + window.location.search; }
}
;
//@ts-ignore (TS-6133) - Is used HTML but TS compiler does not know that.
const menu = new Menu("campain", "sandbox", "manual", "settings");
//@ts-ignore (TS-6133) - Only needs its constructor's full execution, nothing else hence not being used after VVV
const uRlQuery = new URLQuery(false);

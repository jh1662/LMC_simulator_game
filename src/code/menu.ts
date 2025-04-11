import { URLQuery } from "./URLQuery.js";

class Menu{
    constructor(campainId:string, sandboxId:string, manualId:string, settingsId:string){
        document.addEventListener("DOMContentLoaded", () => {
            //* assaign menu options to thier corrosponding button elements.
            (document.getElementById(campainId) as HTMLButtonElement).addEventListener("click", () => this.campain());
            (document.getElementById(sandboxId) as HTMLButtonElement).addEventListener("click", () => this.sandbox());
            (document.getElementById(manualId) as HTMLButtonElement).addEventListener("click", () => this.manual());
            (document.getElementById(settingsId) as HTMLButtonElement).addEventListener("click", () => this.settings());
        });

    }
    private campain(){ window.location.href = 'simulator.html'+window.location.search; }
    private sandbox(){ window.location.href = 'simulator.html'+window.location.search; }
    private manual(){ window.open('manual.html'+window.location.search, '_blank'); }
    private settings(){  window.location.href = 'settings.html'+window.location.search; }
};
//@ts-ignore (TS-6133) - Is used HTML but TS compiler does not know that.
const menu:Menu = new Menu("campain","sandbox","manual","settings");
//@ts-ignore (TS-6133) - Only needs its constructor's full execution, nothing else hence not being used after VVV
const uRlQuery:URLQuery = new URLQuery(false);
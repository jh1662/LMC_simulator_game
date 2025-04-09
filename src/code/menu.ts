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
    private campain(){ window.location.href = "simulator.html"; }
    private sandbox(){ window.location.href = "simulator.html"; }
    private manual(){ window.open('manual.html', '_blank'); }
    private settings(){  window.location.href = "settings.html"; }
};

const menu:Menu = new Menu("campain","sandbox","manual","settings");
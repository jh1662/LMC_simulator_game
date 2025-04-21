import { URLQuery } from "./URLQuery.js";

enum Configs { soundEffectToggle, darkModeToggle, theme, currentLevel }

class Settings{
    private uRlQuery:URLQuery;
    //^ Unlike other other pages, instance is stored in class instead of in body because its public methods
    //^ (besides constructor) needs to be called (in settings.ts and middlware.ts).
    private themeSelector:HTMLSelectElement;

    constructor(soundEffectToggleId:string, darkModeToggleId:string, themeSelectionId:string, menuId:string){
        this.uRlQuery = new URLQuery();
        //^ instantiate
        this.themeSelector = document.getElementById(themeSelectionId) as HTMLSelectElement;
        //^ Get the selector as the only HTML selector as it needs to set to the current selected index.
        //^ Stored as field becuase it later used by 'themeSelection()' (as long user want to change theme).
        this.themeSelector.selectedIndex = this.uRlQuery.getConfig(Configs.theme);

        document.addEventListener("DOMContentLoaded", () => {
            //* Assaign menu options to thier corrosponding button elements.
            //: Ordered by simplicity of corropsonding called method.
            (document.getElementById(menuId) as HTMLButtonElement).addEventListener("click", () => this.menu());
            (document.getElementById(darkModeToggleId) as HTMLButtonElement).addEventListener("click", () => this.darkModeToggle());
            (document.getElementById(soundEffectToggleId) as HTMLButtonElement).addEventListener("click", () => this.soundEffectToggle());
            this.themeSelector.addEventListener("change", () => this.themeSelection());
            //^ already fetched element by id
        });
    }
    //: each corrosponds to a HTML imput element
    private menu(){  window.location.href = 'menu.html'+window.location.search; }
    private darkModeToggle(){
        let currentToggleValue:number = this.uRlQuery.getConfig(Configs.darkModeToggle);
        if (currentToggleValue){ currentToggleValue--; } else { currentToggleValue++; }
        this.changeQuery([-1,currentToggleValue,-1,-1])
    }
    private soundEffectToggle(){
        //* extra logic and handling of a parameter is not worth making a common method for toggling
        let currentToggleValue:number = this.uRlQuery.getConfig(Configs.soundEffectToggle);
        if (currentToggleValue){ currentToggleValue--; } else { currentToggleValue++; }
        this.changeQuery([currentToggleValue,-1,-1,-1])
    }
    private themeSelection(){
        const selectedIndex:number = this.themeSelector.selectedIndex;
        this.changeQuery([-1,-1,selectedIndex,-1])
    }

    private changeQuery(configs:number[]){
        //* Called when a config is changed
        //* Much easier to use a list parameter then two number arguments as the list way involves less logic.
        let query:string = "?"
        for (let configIndex = 0; configIndex < configs.length; configIndex++ ){
            if (configs[configIndex] == -1) { query += this.uRlQuery.getConfig(configIndex); }
            else{ query += configs[configIndex] }
            if (configIndex != configs.length-1) { query += "/"}
            //^ add slashes only between configs in URL query
        }
        window.location.search = query;
        //^ don't need to redo the whole URL to reset
    }
};
//@ts-ignore (TS-6133)
const settings:Settings = new Settings("toggleSoundEffects","toggleLightMode","options","menu");


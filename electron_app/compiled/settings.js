import { URLQuery, Configs } from "./URLQuery.js";
class Settings {
    constructor(soundEffectToggleId, darkModeToggleId, themeSelectionId, menuId) {
        this.uRlQuery = new URLQuery();
        //^ instantiate
        this.themeSelector = document.getElementById(themeSelectionId);
        //^ Get the selector as the only HTML selector as it needs to set to the current selected index.
        //^ Stored as field becuase it later used by 'themeSelection()' (as long user want to change theme).
        this.themeSelector.selectedIndex = this.uRlQuery.getConfig(Configs.theme);
        document.addEventListener("DOMContentLoaded", () => {
            //* Assaign menu options to thier corrosponding button elements.
            //: Ordered by simplicity of corropsonding called method.
            document.getElementById(menuId).addEventListener("click", () => this.menu());
            document.getElementById(darkModeToggleId).addEventListener("click", () => this.darkModeToggle());
            document.getElementById(soundEffectToggleId).addEventListener("click", () => this.soundEffectToggle());
            this.themeSelector.addEventListener("change", () => this.themeSelection());
            //^ already fetched element by id
        });
    }
    //: each corrosponds to a HTML imput element
    menu() { window.location.href = 'menu.html' + window.location.search; }
    darkModeToggle() {
        let currentToggleValue = this.uRlQuery.getConfig(Configs.darkModeToggle);
        if (currentToggleValue) {
            currentToggleValue--;
        }
        else {
            currentToggleValue++;
        }
        this.changeQuery([-1, currentToggleValue, -1, -1]);
    }
    soundEffectToggle() {
        //* extra logic and handling of a parameter is not worth making a common method for toggling
        let currentToggleValue = this.uRlQuery.getConfig(Configs.soundEffectToggle);
        if (currentToggleValue) {
            currentToggleValue--;
        }
        else {
            currentToggleValue++;
        }
        this.changeQuery([currentToggleValue, -1, -1, -1]);
    }
    themeSelection() {
        const selectedIndex = this.themeSelector.selectedIndex;
        this.changeQuery([-1, -1, selectedIndex, -1]);
    }
    changeQuery(configs) {
        //* Called when a config is changed
        //* Much easier to use a list parameter then two number arguments as the list way involves less logic.
        let query = "?";
        for (let configIndex = 0; configIndex < configs.length; configIndex++) {
            if (configs[configIndex] == -1) {
                query += this.uRlQuery.getConfig(configIndex);
            }
            else {
                query += configs[configIndex];
            }
            if (configIndex != configs.length - 1) {
                query += "/";
            }
            //^ add slashes only between configs in URL query
        }
        window.location.search = query;
        //^ don't need to redo the whole URL to reset
    }
}
;
//@ts-ignore (TS-6133)
const settings = new Settings("toggleSoundEffects", "toggleLightMode", "options", "menu");

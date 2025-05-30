//^ Required to TS-2669 - can only declare 'Global' if file is external module.
//^ the hallow/empty export states that this file is an external module file.
import { URLQuery, Configs } from "./URLQuery.js";
;
//^ Allows the level buttons to be linked to code due them being dynamicly generated after original DOM load.
class LevelSelection {
    //^ just described as table because there is only one table in the level selection
    constructor(menuId, tableId, levelCount, levelCountProgress) {
        document.addEventListener("DOMContentLoaded", () => {
            //* button to go back to the game menu
            document.getElementById(menuId).addEventListener("click", () => this.menu());
        });
        window.selectLevel = this.selectLevel.bind(this);
        //^ link the method to the global window declaration
        this.HTMLTable = document.getElementById(tableId);
        /// this.levelIdPrefix = levelIdPrefix;
        this.generateLevelButtons(levelCount, levelCountProgress);
        //^ levelCount - value depends on how many campain levels are there in the game.
        //^ levelCountProgress - value depends on how many campain levels are completed by user.
    }
    generateLevelButtons(levelCount, levelCountProgress) {
        let rowHTML = "";
        for (let levelNum = 1; levelNum < levelCount + 1; levelNum++) {
            //: No need for ids for buttons at they are not called at all.
            //: Adds HTML of one cell of button for a level.
            if (levelNum > levelCountProgress) {
                rowHTML += '<td><button class="square btn mt-3 me-3">&#128274;</button></td>';
            }
            //^ locked levels (hence using padlock emoji "&#128274;")
            else {
                rowHTML += `<td><button class="square btn mt-3 me-3" onclick="selectLevel(${levelNum})">${levelNum}</button></td>`;
            }
            //^ completed levels and next availiable level
            if (levelNum % 10 == 0) {
                //* Magnitudes simplier than using a nested loop.
                //* Creates ond populates row when fully populated.
                const newRow = this.HTMLTable.insertRow(this.HTMLTable.rows.length - 1);
                //^ inserts row adjacently above bottom row
                newRow.innerHTML = rowHTML;
                //^ populates said row
                rowHTML = "";
                //^ clear for next row's inner-HTML
            }
        }
    }
    menu() { window.location.href = "menu.html" + window.location.search; }
    selectLevel(level) {
        window.location.href = "simulator.html" + window.location.search + "#" + level;
    }
}
;
//@ts-ignore (TS-6133)
const uRlQuery = new URLQuery();
//^ Declared first to pass to parameter of levelSelection.
//@ts-ignore Says not used but is by HTML (VS TS compiler just do not know that) VVV
const levelSelection = new LevelSelection("menu", "mainContents", 20, uRlQuery.getConfig(Configs.currentLevel));

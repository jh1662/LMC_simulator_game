//^ Required to TS-2669 - can only declare 'Global' if file is external module.
//^ the hallow/empty export states that this file is an external module file.
import { URLQuery } from "./URLQuery.js";
;
//^ Allows the level buttons to be linked to code due them being dynamicly generated after original DOM load.
class LevelSelection {
    //^ value depends on how many campain levels are there in the game.
    constructor(menuId, tableId, levelCount) {
        document.addEventListener("DOMContentLoaded", () => {
            //* button to go back to the game menu
            document.getElementById(menuId).addEventListener("click", () => this.menu());
        });
        window.selectLevel = this.selectLevel.bind(this);
        //^ link the method to the global window declaration
        this.HTMLTable = document.getElementById(tableId);
        /// this.levelIdPrefix = levelIdPrefix;
        this.levelCount = levelCount;
        this.generateLevelButtons();
    }
    generateLevelButtons() {
        let rowHTML = "";
        for (let levelNum = 1; levelNum < this.levelCount; levelNum++) {
            rowHTML += `<td><button class="square btn mt-3 me-3" onclick="selectLevel(${levelNum})">${levelNum}</button></td>`;
            //^ No need for ids for buttons at they are not called at all.
            //^ Adds HTML of one cell of button for a level.
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
//@ts-ignore Says not used but is by HTML (VS TS compiler just do not know that) VVV
const levelSelection = new LevelSelection("menu", "mainContents", 30);
//@ts-ignore (TS-6133)
const uRlQuery = new URLQuery();

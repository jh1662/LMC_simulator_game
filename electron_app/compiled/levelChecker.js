import { ControlUnit } from "./vonNeumann.js";
import { levelData } from "./levelData.js";
import { UICatagory } from "./simulatorUI.js";
export var levelType;
(function (levelType) {
    levelType[levelType["tutorial"] = 0] = "tutorial";
    levelType[levelType["partial"] = 1] = "partial";
    levelType[levelType["contexual"] = 2] = "contexual";
})(levelType || (levelType = {}));
//^ Program only sees 3 types of levels.
//^ Partial type - partial and correcting levels becuase they have the same configurations of what attributes are used and which ones are not.
//^ Contexual type - contextual and big formula levels becuase they have the same configurations of what attributes are used and which ones are not.
//^ Tutorial type - just tuotial/introduction levels.
//^ See code report/dissertation regarding the 5 types of levels.
export class LevelChecker {
    //^ Sole purpose of parent class referance is to update simimulator UI's status element for responsiveness - Human Computer Interaction (HCI) theory.
    //^ Field is optional type to esure moduality and ability to test backend by itself (without frontend).
    constructor(levelId, middleware) {
        this.currentLevel = levelData[levelId - 1];
        //^ argument should always be in valid integer range
        this.userCompiled = [];
        //^ just to instanciate the list
        this.message = "";
        //^ just to initialise the list
        this.middleware = middleware || undefined;
    }
    //: Getters
    getObjective() { return this.currentLevel.objective; }
    getExampleCase() { return this.currentLevel.exampleCase; }
    getMessage() { return this.message; }
    //^ is used dispite having 'updateStatus' because 'getMessage' is not dependent on frontend (unlike 'updateStatus') - being more stable and usable in unit tests.
    getExample() {
        if (this.currentLevel.exampleSolution)
            return this.currentLevel.exampleSolution;
        //^ not-undifined checking if-statement solves TS-2322
        return [];
        //^ never reach this line due to method only being called when 'this.currentLevel.exampleSolution' is not undefined (unless unexpected error)
    }
    getStarCriterias() {
        //* Maximum line count for 2-star then maximum line count for 3-star.
        //* 1-star criteria does not concern itself with line count, only if the assembly program does the level objective.
        if (this.currentLevel.stars) {
            return [this.currentLevel.stars[2], this.currentLevel.stars[3]];
        }
        //^ not-undefined checking if-statement solves TS-2532
        return [];
        //^ unreachable unless unexpected error occurs
    }
    givePartial() {
        if (this.currentLevel.patrialScript)
            return this.currentLevel.patrialScript;
        //^ not-undefined checking if-statement solves TS-2322
        return [];
    }
    starCount(lineCount) {
        if (this.currentLevel.stars && lineCount > this.currentLevel.stars[2]) {
            return 1;
        }
        if (this.currentLevel.stars && lineCount > this.currentLevel.stars[3]) {
            return 2;
        }
        //^ Another way to deal with potential undefined! (TS-2532).
        //^ If-statement always satisfied because method never gets called when 'this.currentLevel.stars' is undefined.
        return 3;
    }
    //: Setters
    setUserCompiled(compiledScript) { this.userCompiled = compiledScript; }
    constructResultMessage(caseIndex, starCount) {
        //^ Convert index to human-friendly labelling
        if (caseIndex == -1) {
            this.message = "Level achieved, " + starCount + " stars achieved! Go to level selector (from menu) to do next level";
            return;
        }
        //: Done in multiple lines to keep code simple and easy to read/update by developers.
        this.message = "Script does not satisfies objective in case #" + (caseIndex + 1);
        if (this.currentLevel.cases && this.currentLevel.cases[caseIndex] && this.currentLevel.cases[caseIndex][1]) {
            //^ Undefined checking if-statement is the most suitable for an extremely complety 3D list of "[number[], string[]][]" type.
            this.message += ` - expected outputs ${this.currentLevel.cases[caseIndex][1].join(", ")}`;
            this.message += ` - from inputs ${this.currentLevel.cases[caseIndex][0].join(", ")}`;
        }
    }
    constructProcessingMessage(caseIndex) { this.message = "Checking user's compiled script with case #" + (caseIndex + 1); } //< transformative setter
    async testCases() {
        //* Returns Promise because of the ControlUnit.cycle's sleep statements.
        //* Promise is of number instead of boolean because user must know why his/her script does not satisfy level's objective.
        if (!this.currentLevel.cases) {
            return -2;
        }
        //^ undefined checking if-statement solves TS-2532 (return statement should never be reached)
        for (let caseIndex = 0; caseIndex < this.currentLevel.cases.length; caseIndex++) {
            this.constructProcessingMessage(caseIndex);
            const currentCase = this.currentLevel.cases[caseIndex];
            //^ Due to the exteme complexity of the object's attribute. Type assertion will not be used!!!
            const simulator = new ControlUnit(this.userCompiled, JSON.parse(JSON.stringify(currentCase[0])));
            //^ JSON methods used for deep copy because is compatible with older browsers unlike 'structuredClone'.
            simulator.changeSpeed(1);
            //^ ensure fastest speed to reduce redundant waiting but does not cause busy-waiting
            const output = await simulator.cycle();
            console.log(output);
            if (!this.isSame(output, currentCase[1])) {
                return caseIndex;
            }
            //^ give index of case that causes the user script to not satisfy level's objective
            this.updateStatus();
            //^ inform user on current progress on assessing script
        }
        return -1;
        //^ user script satisfies level's objective
    }
    isSame(input1, input2) {
        //* Because lists are objects simply doing 'list1 == list2' simply compares the list objects' referances instead of the inside elements.
        if (input1.length != input2.length) {
            return false;
        }
        //^ no point checking each element if lists are same if element count differs
        for (let index = 0; index < input1.length; index++) {
            if (input1[index] != input2[index]) {
                return false;
            }
        }
        return true;
    }
    updateStatus() { if (this.middleware) {
        this.middleware.updateUI(UICatagory.status, [this.message]);
    } }
    async assessScript() {
        //* called to check if level object is satisfied by user, and if so then how many stars
        const casesResult = await this.testCases();
        if (casesResult != -1) {
            this.constructResultMessage(casesResult);
            return 0;
        }
        //^ User's compiled script does not satisfies level objective
        /// return this.starCount(this.userCompiled.length);
        //: User's compiled script does satisfies level objective so star count is returned.
        const starCount = this.starCount(this.userCompiled.length);
        this.constructResultMessage(casesResult, starCount);
        return starCount;
    }
    levelType() {
        //* Do not need to check every optional attribute to determin level type (only the exclusives)!
        if (this.currentLevel.exampleSolution == undefined) {
            return levelType.tutorial;
        }
        //^ Tutorial level type does not have an solution example because its job is taken by the partial script attribute.
        //^ Reason for not using example solution is because it needs to be loaded manually be user unlike partial script which is loaded automatically on page load.
        if (this.currentLevel.patrialScript == undefined) {
            return levelType.contexual;
        }
        //^ Partial level type does not have partial script because user is expected to make assembly script from scratch.
        return levelType.partial;
        //^ Only other level type.
        //^ No if-statement to take unexpected errors in effect.
    }
}

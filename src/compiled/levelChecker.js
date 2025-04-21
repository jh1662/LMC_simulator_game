import { ControlUnit } from "./vonNeumann.js";
import { levelData } from "./levelData.js";
//^ to read current level data as a custom 'Level' type.
export class LevelChecker {
    ///private middleware:Middleware?
    constructor(levelId) {
        this.currentLevel = levelData[levelId - 1];
        //^ argument should always be in valid integer range
        this.userCompiled = [];
        //^ just to instanciate the list
        this.message = "";
        //^ just to initialise the list
    }
    //: Getters
    getObjective() { return this.currentLevel.objective; }
    getMessage() { return this.message; }
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
    constructResultMessage(caseIndex) {
        //^ Convert index to human-friendly labelling
        if (caseIndex == -1) {
            this.message = "Level achieved, redirecting to level selector";
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
    constructProcessingMessage(caseIndex) { this.message = "Checking user's compiled script with case #" + caseIndex + 1; } //< transformative setter
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
    async assessScript() {
        const casesResult = await this.testCases();
        this.constructResultMessage(casesResult);
        if (casesResult != -1) {
            return 0;
        }
        //^ User's compiled script does not satisfies level objective
        return this.starCount(this.userCompiled.length);
        //^ User's compiled script does satisfies level objective so star count is retruned.
    }
}

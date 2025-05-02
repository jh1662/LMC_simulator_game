import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
import { ControlUnit } from './vonNeumann.js';
import { UICatagory } from "./simulatorUI.js";
//^ better practice and far more easier to identify by enumeration that string or integer.
import { URLQuery } from "./URLQuery.js";
import { LevelChecker, levelType } from './levelChecker.js';

declare global {
    //* For the togglable execution control
    //* Used because TS/JS files are called as modular files.
    interface Window {
        //* Required to listen to HTML elements that are generated after DOM load (e.g.: generating new texboxes for the script editor).
        newCycle: () => void;
        changeSpeed: (toSlower:boolean) => void;
    }
}
export class Middleware{
    //^ is export so ControlUnit has access to its parent class instance referance
    private simulatorUI:SimulatorUI;
    //^ Frontend
    //: backend
    private simulator:ControlUnit;
    //: 'undefined' satisfies TS-2564
    private compiledScript:number[]|undefined;
    private levelChecker:LevelChecker|undefined;

    //: to control simulator execution
    private slowestSpeed:number;
    private fastestSpeed:number;
    private currentSpeed:number;
    private speedInterval:number;
    private cycleModeAutomatic:boolean;

    constructor(){

        document.addEventListener("DOMContentLoaded", () => {
            //* Requires both frontend and backend functionality.
            //: HTML button elements.
            (document.getElementById('compile') as HTMLButtonElement).addEventListener("click", () => this.compile());
            (document.getElementById('run') as HTMLButtonElement).addEventListener("click", () => this.run());
            (document.getElementById('executionMode') as HTMLButtonElement).addEventListener("click", () => this.switchCycleModes());
            (document.getElementById('stop') as HTMLButtonElement).addEventListener("click", () => this.stop());
            //: set up buttons that will only be used if in campain mode
            //@ts-ignore
            (document.getElementById('submitLevel') as HTMLButtonElement).addEventListener("click", () => this.levelCheck());
            (document.getElementById('loadExample') as HTMLButtonElement).addEventListener("click", () => this.loadLevelSolution());
        });
        //: togglable execution control elements (because they dynamicly generate/unload when toggling modes)
        window.newCycle = this.newCycle.bind(this);
        window.changeSpeed = this.changeSpeed.bind(this);

        this.fastestSpeed = 1;
        this.slowestSpeed = 10001;
        this.currentSpeed = 4001;
        this.speedInterval = 2000;
        //^ ranges between 1 and 10001.
        this.cycleModeAutomatic = true;

        this.simulator = new ControlUnit([],[]);
        //^ Better to assaign redundant instance than using "?" sysntax (bad practice) also know as the Optional Chaining Operator.

        const levelNum:number = this.campainLevel();

        if (levelNum >= 0){
            //* set up frontend for campain level if in campain mode
            this.levelChecker = new LevelChecker(levelNum, this);
            this.simulatorUI = new SimulatorUI(this.levelChecker.getExampleCase(), this.levelChecker.getObjective());
            //: enable buttons exclusively used by campain mode
            ///(document.getElementById('submitLevel') as HTMLButtonElement).disabled = false;
            (document.getElementById('submitLevel') as HTMLButtonElement).disabled = false;
            (document.getElementById('loadExample') as HTMLButtonElement).disabled = false;
            if (this.levelChecker.levelType() == levelType.tutorial) {
                (document.getElementById('submitLevel') as HTMLButtonElement).innerText = "Finish tutorial";
            }
        }
        else{ this.simulatorUI = new SimulatorUI(); }
        //^ spefically located here to prevent TS-2564 without assaigning twice
        ///if (levelNum == 0){ return; }
        /// ^ stop everything as URL is an invalid one
        if (levelNum != 0) {this.prepareLevel();}
        //^ render partial script if level type is appropiate
    }
    //#region campain
    private campainLevel():number{
        //* Mere method is not worth being its own class.
        //* -1 for sandbox, 0 for invalid, 1-30 for level number.
        let fragmentId:string = window.location.hash.slice(1);
        console.log(fragmentId);
        /// fragmentId = fragmentId.slice(1);
        //^ redundant since making code more compact
        if (fragmentId == ""){ return -1; }
        //^ Means sandbox mode as no level is specified
        //: copied stragety from uRLQuery.ts
        const level:number = Number(fragmentId);
        if (Number.isNaN(level) || !Number.isInteger(level)){
            document.documentElement.innerHTML = `<p>Selected level ${fragmentId} is not a valid level (integer only)</p>`;
            return 0;
        }
        if (!(0<level && level<21)){
            document.documentElement.innerHTML = `<p>Selected level ${fragmentId} is not a valid level (integer 1-20 only)</p>`;
            return 0;
        }

        return level;
    }
    private prepareLevel(){
        //* Called for every level but only makes a differance for partial and tutorial type levels.
        const partialScript:string[][] = this.levelChecker?.givePartial() as string[][];
        //^ type assertion for TS-2322 because levelChecker should never be undefined if caller method is called.
        if (partialScript.length == 0 ){ return; }
        //^ can also be done using 'this.levelChecker?.levelType()'
        this.simulatorUI.loadSript(partialScript);
    }
    private loadLevelSolution(){
        let script:string[][]|undefined;
        if (this.levelChecker?.levelType() == levelType.tutorial) {script = this.levelChecker?.givePartial(); }
        //^ tutorial level's partial script is its solution where user can use instead of reloading the simulator page.
        else { script = this.levelChecker?.getExample(); }
        if (!script){ return; }
        //^ solves TS-2345 by checking for undefined - should not be satisfied unless unexpected error how simulator thinking its in campain mode when it is not
        this.simulatorUI.loadSript(script);
    }
    private levelCompleted(){
        //* Update URL query to increment total completed levels - allowing user to do the next level (limited to total number of levels).
        /// const campainProgress:number = Number(window.location.search.match(/\d{1,2}(?=#)/));
        //^ hastag/fragment is not part for 'window.location.search' and to search without is to make the regex too complex
        /// ^ First "search" is the query part of the URL (attribute of object) while second "search" is method call.
        const configParts:string[] = window.location.search.split('/')
        let campainProgress:number = Number((configParts[3] as string));
        //^ should always give valid number parsable string because if URL was invalid then page would not be loaded successfully in the first place
        if (campainProgress == 20) { return; }
        //^ cannot go past last level
        if (configParts[3] == window.location.hash.slice(1)) { campainProgress++; }
        //^ Prevent user from skipping levels.
        //^ Comparing campain progress to current displayed level (in order).
        ///window.location.search = window.location.search.replace(/\d{1,2}(?=#)/,String(campainProgress+1));
        //: updates next level config
        const newConfigParts:string[] = [configParts[0] as string,configParts[1] as string,configParts[2] as string,String(campainProgress)];
        //^ Type assertion for TS-2322 because of same reason as previous type assertion.
        ///window.location.search = newConfigParts.join('/');
        window.history.pushState(null, '', newConfigParts.join('/') + window.location.hash );
        //^ Allows to change URL without refreshing.
        //^ In second parameter, 'window.location.herf' is not needed because method automatically use it if not stated in argument.
        //^ Source - https://www.geeksforgeeks.org/how-to-modify-url-without-reloading-the-page-using-javascript/
        console.log(window.location.search);
        /// window.location.search = window.location.search.replace(/\d{1,2}(?=#)/,String(campainProgress+1));
        /// //^ Regex supports the '.replace' call - https://www.w3schools.com/js/js_regexp.asp
    }
    private async levelCheck(){
        //* Check user-provided compiled script and check it to see if satisfies current level's objective.
        /// * Returns star count where '0' is fail and rages 0-3.
        /// * Calls frontend many times to update status multiple times to satisfy HCI priciples by makeing page reponsive - not thinking it is frozen/stuck.
        //: Take different approach if level is a tutorial type
        if ((this.levelChecker as LevelChecker).levelType() == levelType.tutorial) {
            //^ type assertion for TS-2532 because 'this.levelChecker' should never be undefined when called here.
            this.levelCompleted();
            this.simulatorUI.update(UICatagory.status,["Please go to the level selector to do the next level (from menu)"])
            return;
        }

        //: similar validation to as running the script by user.
        if (this.compiledScript == undefined){ this.simulatorUI.update(UICatagory.status,["Cannot submit empty compiled script."]); return; }
        if (this.compiledScript[0] == -1){ this.simulatorUI.update(UICatagory.status,["Cannot submit incorrectly compiled script."]); return; }

        this.levelChecker?.setUserCompiled(this.compiledScript);
        let starCount:number|undefined = await this.levelChecker?.assessScript();
        //^ requires multiple calls to assess script to isolate the required "await" call for better practice
        if(!starCount){ starCount = 0; }
        //^ solves TS-2322 but should not ever get satisfied because method only gets called when in campain mode
        let message:string|undefined = this.levelChecker?.getMessage();
        if(!message){ message = "No fetched message means something is wrong with the JS code. Try refreshing page."; }
        //^ solves TS-2322 but should not ever get satisfied

        this.simulatorUI.update(UICatagory.status,[message]);
        if (starCount>0){ this.levelCompleted(); };
    }
    //#endregion
    //#region Links with simulator (ControlUnit)
    private compile():void{
        this.currentSpeed = 4001;
        const compiler:Compiler = new Compiler;
        //^ Compiler class instance only needed when compiling.
        const script:string[][] = this.simulatorUI.getScript();
        this.compiledScript = compiler.validateAndCompile(script); //< global variable
        if (this.compiledScript[0] == -1){ this.simulatorUI.update(UICatagory.status,[compiler.getMessage()]); return; }
        //^ Comparing first element instead of whole due to TS-2839 - comparing referance to literal.
        //^ If invalid script, show error to user and stop.
        this.simulatorUI.compile(this.compiledScript); //< calls global variable
        this.simulatorUI.update(UICatagory.status,["Compilation successful"]);
    }
    private async run():Promise<void>{
        const predefinedInputs:number[] = this.simulatorUI.getPredefinedInputs();
        //^ Also prepares for run.
        //: verify if execution is possible
        if (predefinedInputs[0] == -1000){ this.simulatorUI.update(UICatagory.status,["Cannot execute, atleast one pre-defined input is invalid. Please use integers in range -999 to 999 in format: [input1], [input2], [inputN]"]); return; }
        if (this.compiledScript == undefined){ this.simulatorUI.update(UICatagory.status,["Cannot execute, need to compile first."]); return; }
        //^ Satisfies TS-2532 but can be undefined if user tries to execute without a compiled valid script.
        if (this.compiledScript[0] == -1){ this.simulatorUI.update(UICatagory.status,["Cannot execute, need to compile a valid script first."]); return; }
        //^ Cannot execute an invalid script.

        this.simulatorUI.start();

        this.simulator = new ControlUnit( this.compiledScript as number[], predefinedInputs, this);
        this.simulatorUI.update(UICatagory.switchCycleModes,["true"]);
        this.simulatorUI.resetRegesters();
        await this.simulator.cycle();

        this.currentSpeed = 4001;
        //^ back to default value.
        this.simulatorUI.update(UICatagory.end,[]);
    }
    private stop():void{ this.simulator.timeout(); }
    //^ Stops currently executing assembly program.

    //: called by VonNeuman.ts
    public updateUI(uIcatagory:UICatagory, content:string[]):void{
        console.log("update: "+uIcatagory+"-"+content);
        this.simulatorUI.update(uIcatagory,content);
    }
    ///public async getInput():Promise<number>{ return await this.simulatorUI.getInput(); }
    public getInput():number{ return this.simulatorUI.getInput(); }

    //: Controlling simulator's execution.
    public changeSpeed(toSlower:boolean):void{
        //* Make code simpler to use one method for both speeding up and slowing down.
        //* Due to slowest speed being 10001 instead of 10000, don't need extra code to check if speed is 0 (or lower) or above 10000.
        //* Only callable when code it running in automatic mode.
        //: Calculate new speed
        if (toSlower){
            //* Slow down execution speed
            if (this.currentSpeed == this.slowestSpeed){ return; }
            this.currentSpeed += this.speedInterval;
        }
        else{
            if (this.currentSpeed == this.fastestSpeed){ return; }
            this.currentSpeed -= this.speedInterval;
        }
        this.simulator.changeSpeed(this.currentSpeed);
        this.simulatorUI.update( UICatagory.status, ["execution speed changed to: "+this.currentSpeed] );
    }
    public newCycle():void{
        //* Only callable when code it running in manual mode.
        //* Did not call '.displayStatus' because next cycle should happen before the status message has a chance to appear (if so not long enough to be noticed by user).
        this.simulator.newCycle();
        this.simulatorUI.update( UICatagory.status, ["Perform current cycle"] );
    }
    public switchCycleModes():void{
        //* Small chance of not actually changing mode if calling at highly inhuman speeds but is a rare unexpected error so will assume mode was changed.
        //* If mode does not change, it will not cause error due to the way code works.
        const cycleModeAutomatic = this.simulator.switchModes(!this.cycleModeAutomatic);
        if ( this.cycleModeAutomatic == cycleModeAutomatic ){ return; }
        this.cycleModeAutomatic = cycleModeAutomatic;
        this.simulatorUI.update( UICatagory.switchCycleModes, [String(cycleModeAutomatic)] );
        this.simulatorUI.update( UICatagory.status, ["Cycle mode toggled"] );
    }
    //#endregion
}

//@ts-ignore (TS-6133)
const middleware:Middleware = new Middleware();
//^ ts-ignore because compiler thinks class instance doesn't get used when infact it does (by HTML calls)
//@ts-ignore (TS-6133)
const uRlQuery:URLQuery = new URLQuery();
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
            ///(document.getElementById('submitLevel') as HTMLButtonElement)
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
            this.levelChecker = new LevelChecker(levelNum);
            this.simulatorUI = new SimulatorUI(this.levelChecker.getExampleCase(), this.levelChecker.getObjective());
            //: enable buttons exclusively used by campain mode
            ///(document.getElementById('submitLevel') as HTMLButtonElement).disabled = false;
            (document.getElementById('loadExample') as HTMLButtonElement).disabled = false;
        }
        else{ this.simulatorUI = new SimulatorUI(); }
        //^ spefically located here to prevent TS-2564 without assaigning twice
        if (levelNum == 0){ return; }
        //^ stop everything as URL is an invalid one
    }
    //#region campain
    private campainLevel():number{
        //* Mere method is not worth being its own class.
        //* -1 for sandbox, 0 for invalid, 1-30 for level number.
        let fragmentId:string = window.location.hash;
        console.log(fragmentId);
        fragmentId = fragmentId.slice(1);
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
    //@ts-ignore
    private levelCompleted(){
        const campainProgress:number = Number(window.location.search.search(/\d{1,2}(?=#)/));
        //^ Should always give valid number parsable string because if URL was invalid then page would not be loaded successfully in the first place.
        //^ First "search" is the query part of the URL (attribute of object) while second "search" is method call.
        if (campainProgress == 20) {  window.location.href = 'levelSelection.html'+window.location.search; }
        //^ cannot go past last level
        window.location.search = window.location.search.replace(/\d{1,2}(?=#)/,String(campainProgress+1));
        //^ updates next level config
        /// window.location.href = 'levelSelection.html'+window.location.search.replace(/\d{1,2}(?=#)/,String(campainProgress+1));
        /// //^ Regex supports the '.replace' call - https://www.w3schools.com/js/js_regexp.asp
    }
    //@ts-ignore
    private async levelCheck(){
        //: similar validation to as running the script by user.
        if (this.compiledScript == undefined){ this.simulatorUI.update(UICatagory.status,["Cannot submit empty compiled script."]); return; }
        if (this.compiledScript[0] == -1){ this.simulatorUI.update(UICatagory.status,["Cannot submit incorrectly compiled script."]); return; }

        this.levelChecker?.setUserCompiled(this.compiledScript);
        const starCount:number|undefined = await this.levelChecker?.assessScript();
        //^ requires multiple calls to assess script to isolate the required "await" for better practice
        if(!starCount){ return; }
        //^ solves TS-2322 but should not ever get satisfied because method only gets called when in campain mode
        const message:string|undefined = this.levelChecker?.getMessage();
        if(!message){ return; }
        //^ solves TS-2322 but should not ever get satisfied

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
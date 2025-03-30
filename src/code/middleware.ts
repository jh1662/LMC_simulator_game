import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
import { ControlUnit } from './vonNeumann.js';
import { UICatagory } from "./simulatorUI.js";
//^ better practice and far more easier to identify by enumeration that string or integer.

export class Middleware{
    private simulatorUI:SimulatorUI;
    //: 'undefined' satisfies TS-2564
    private compiledScript:number[]|undefined;

    private simulator:ControlUnit;

    //: to control simulator execution
    private slowestSpeed:number;
    private fastestSpeed:number;
    private currentSpeed:number;
    private speedInterval:number;
    private cycleModeAutomatic:boolean;

    constructor(){
        this.simulatorUI = new SimulatorUI("This is sandbox mode.");
        //^ Single parameter is the text for the current objective.

        document.addEventListener("DOMContentLoaded", () => {
            //* Requires both frontend and backend functionality
            //: HTML button elements
            ///(document.getElementById('Menu') as HTMLButtonElement).addEventListener("click", )
            ///(document.getElementById('timeOrStep') as HTMLButtonElement).addEventListener("click", )
            (document.getElementById('compile') as HTMLButtonElement).addEventListener("click", () => this.compile());
            (document.getElementById('run') as HTMLButtonElement).addEventListener("click", () => this.run())
        });

        this.fastestSpeed = 1;
        this.slowestSpeed = 10001;
        this.currentSpeed = 4000;
        this.speedInterval = 2000;
        //^ ranges between 1 and 10001.
        this.cycleModeAutomatic = true;

        this.simulator = new ControlUnit([],[]);
        //^ Better to assaign redundant instance than using "?" sysntax (bad practice) also know as the Optional Chaining Operator.
    }

    private compile():void{
        const compiler:Compiler = new Compiler;
        //^ Compiler class instance only needed when compiling.
        const script:string[][] = this.simulatorUI.getScript();
        this.compiledScript = compiler.validateAndCompile(script); //< global variable
        if (this.compiledScript[0] == -1){ this.simulatorUI.update(UICatagory.status,[compiler.getMessage()]); return; }
        //^ Comparing first element instead of whole due to TS-2839 - comparing referance to literal.
        //^ If invalid script, show error to user and stop.
        this.simulatorUI.compile(this.compiledScript); //< calls global variable
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
        this.simulatorUI.resetRegesters();
        await this.simulator.cycle();

        this.simulatorUI.end();
    }
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
        //: else
        if (this.currentSpeed == this.fastestSpeed){ return; }
        this.currentSpeed -= this.speedInterval;

        this.simulator.changeSpeed(this.currentSpeed);
        this.simulatorUI.update( UICatagory.status, ["execution speed changed to: "+this.currentSpeed] );
    }
    public newCycle():void{
        //* Only callable when code it running in manual mode.
        //* Did not call '.displayStatus' because next cycle should happen before the status message has a chance to appear (if so not long enough to be noticed by user).
        this.simulator.newCycle();
    }
    public switchCycleModes():void{
        //* Small chance of not actually changing mode if calling at highly inhuman speeds but is a rare unexpected error so will assume mode was changed.
        //* If mode does not change, it will not cause error due to the way code works.
        const cycleModeAutomatic = this.simulator.switchModes(!this.cycleModeAutomatic);
        if ( this.cycleModeAutomatic == cycleModeAutomatic ){ return; }
        this.cycleModeAutomatic = cycleModeAutomatic;
        this.simulatorUI.update( UICatagory.status, ["Execution mode toggled"] );

    }
}

//@ts-ignore
const middleware:Middleware = new Middleware();
//^ ts-ignore because compiler thinks class instance doesn't get used when infact it does (by HTML calls)
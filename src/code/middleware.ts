import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
import { ControlUnit } from './vonNeumann.js';
import { UICatagory } from "./simulatorUI.js";
//^ better practice and far more easier to identify by enumeration that string or integer.

export class Middleware{
    private simulatorUI:SimulatorUI;
    //: 'undefined' satisfies TS-2564
    private compiledScript:number[]|undefined;
    private simulator:ControlUnit|undefined;

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
        //: verify if execution is possible
        if (predefinedInputs[0] == -1000){ this.simulatorUI.update(UICatagory.status,["Cannot execute, atleast one pre-defined input is invalid. Please use integers in range -999 to 999 in format: [input1], [input2], [inputN]"]); return; }
        if (this.compiledScript == undefined){ this.simulatorUI.update(UICatagory.status,["Cannot execute, need to compile first."]); return; }
        //^ Satisfies TS-2532 but can be undefined if user tries to execute without a compiled valid script.
        if (this.compiledScript[0] == -1){ this.simulatorUI.update(UICatagory.status,["Cannot execute, need to compile a valid script first."]); return; }
        //^ Cannot execute an invalid script.

        this.simulator = new ControlUnit( this.compiledScript as number[], predefinedInputs, this);
        this.simulatorUI.resetRegesters();
        await this.simulator.cycle();
    }
    public updateUI(uIcatagory:UICatagory, content:string[]):void{
        console.log("update: "+uIcatagory+"-"+content);
        this.simulatorUI.update(uIcatagory,content);
    }
}

//@ts-ignore
const middleware:Middleware = new Middleware();
//^ ts-ignore because compiler thinks class instance doesn't get used when infact it does (by HTML calls)

/*
function updateUI(status:string,process:number,affectedUIs:Map<number,string>):void{
    simulatorUI.changeStatus(status);
    //simulatorUI.changeLittleMan(process);
}
    */
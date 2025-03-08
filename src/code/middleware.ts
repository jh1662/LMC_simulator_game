import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
import { controlUnit } from './vonNeumann.js';

const simulatorUI:SimulatorUI = new SimulatorUI("This is sandbox mode.");
//^ Single parameter is the text for the current objective.
let compiledScript:number[];

//: only requires both frontend and backend functionalitytsc
document.addEventListener("DOMContentLoaded", () => {
    //: HTML button elements
    //(document.getElementById('Menu') as HTMLButtonElement).addEventListener("click", )
    //(document.getElementById('timeOrStep') as HTMLButtonElement).addEventListener("click", )
    (document.getElementById('compile') as HTMLButtonElement).addEventListener("click", () => compile());
    (document.getElementById('run') as HTMLButtonElement).addEventListener("click", () => run())
});

function compile():void{
    const compiler:Compiler = new Compiler;
    //^ Compiler class instance only needed when compiling.
    const script:string[][] = simulatorUI.getScript();
    compiledScript = compiler.validateAndCompile(script); //< global variable
    if (compiledScript[0] == -1){ simulatorUI.changeStatus(compiler.getMessage()); return; }
    //^ Comparing first element instead of whole due to TS-2839 - comparing referance to literal.
    //^ If invalid script, show error to user and stop.
    simulatorUI.compile(compiledScript); //< calls global variable
}

async function run():Promise<void>{
    const predefinedInputs:number[] = simulatorUI.getPredefinedInputs();
    const ControlUnit:controlUnit = new controlUnit(compiledScript,predefinedInputs);
    await ControlUnit.cycle();
}

/*
function updateUI(status:string,process:number,affectedUIs:Map<number,string>):void{
    simulatorUI.changeStatus(status);
    //simulatorUI.changeLittleMan(process);
}
    */
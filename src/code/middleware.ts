import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
//import { controlUnit } from './vonNeumann.js';

declare global {
    interface Window {
        addRowIfNeeded: (textbox: HTMLInputElement) => void;
        navigateEditor: (event:KeyboardEvent) => void;
    }
}

const simulatorUI:SimulatorUI = new SimulatorUI();
let compiledScript:number[];

//: only requires frontend functionality
document.addEventListener("DOMContentLoaded", () => {
    //* for HTML elemets that are not generated after load
    (document.getElementById('toggleMode') as HTMLButtonElement).addEventListener("click", () => simulatorUI.toggleDarkMode());
    (document.getElementById('manual') as HTMLButtonElement).addEventListener("click", () => simulatorUI.displayManual());
    (document.getElementById('toggleDisplay') as HTMLButtonElement).addEventListener("click", () => simulatorUI.toggleDisplayMode());
});
window.addRowIfNeeded  = function(textbox:HTMLInputElement):void{ simulatorUI.addRowIfNeeded(textbox); };
window.navigateEditor = function (event:KeyboardEvent):void{ simulatorUI.navigateEditor(event); }

//: only requires both frontend and backend functionalitytsc
document.addEventListener("DOMContentLoaded", () => {
    //: HTML button elements
    //(document.getElementById('Menu') as HTMLButtonElement).addEventListener("click", )
    //(document.getElementById('timeOrStep') as HTMLButtonElement).addEventListener("click", )
    (document.getElementById('compile') as HTMLButtonElement).addEventListener("click", () => compile());
    //(document.getElementById('run') as HTMLButtonElement).addEventListener("click", )
    //(document.getElementById('submitInput') as HTMLButtonElement).addEventListener("click", )
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
/*
async function run():Promise<void>{
    const predefinedInputs:number[] = simulatorUI.getPredefinedInputs();
    const ControlUnit:controlUnit = new controlUnit(compiledScript,predefinedInputs);
    await ControlUnit.cycle();
}
function updateUI(status:string,process:number,affectedUIs:Map<number,string>):void{
    simulatorUI.changeStatus(status);
    //simulatorUI.changeLittleMan(process);
}*/
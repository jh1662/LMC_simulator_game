import { SimulatorUI } from './simulatorUI.js';

declare global {
    interface Window {
        addRowIfNeeded: (textbox: HTMLInputElement) => void;
        navigateEditor: (event:KeyboardEvent) => void;
    }
}
//import { controlUnit } from './vonNeumann';
import { Compiler } from './compiler.js';

const simulatorUI:SimulatorUI = new SimulatorUI();
let compiledScript:number[];

//: only requires frontend functionality
document.addEventListener("DOMContentLoaded", () => {
    //* for HTML elemets that are not generated after load
    (document.getElementById('toggleMode') as HTMLButtonElement).addEventListener("click", () => simulatorUI.toggleDarkMode());
    (document.getElementById('manual') as HTMLButtonElement).addEventListener("click", () => simulatorUI.displayManual());
});

window.addRowIfNeeded  = function(textbox:HTMLInputElement):void{ simulatorUI.addRowIfNeeded(textbox); };
window.navigateEditor = function (event:KeyboardEvent):void{ simulatorUI.navigateEditor(event); }

//: only requires both frontend and backend functionality
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
    const script:string[][] = simulatorUI.getScript();
    compiledScript = compiler.validateAndCompile(script); //< global variable
    simulatorUI.compile(compiledScript); //< calls global variable
}
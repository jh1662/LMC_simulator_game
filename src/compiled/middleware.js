var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
import { controlUnit } from './vonNeumann.js';
const simulatorUI = new SimulatorUI("This is sandbox mode.");
//^ Single parameter is the text for the current objective.
let compiledScript;
//: only requires both frontend and backend functionalitytsc
document.addEventListener("DOMContentLoaded", () => {
    //: HTML button elements
    //(document.getElementById('Menu') as HTMLButtonElement).addEventListener("click", )
    //(document.getElementById('timeOrStep') as HTMLButtonElement).addEventListener("click", )
    document.getElementById('compile').addEventListener("click", () => compile());
    document.getElementById('run').addEventListener("click", () => run());
});
function compile() {
    const compiler = new Compiler;
    //^ Compiler class instance only needed when compiling.
    const script = simulatorUI.getScript();
    compiledScript = compiler.validateAndCompile(script); //< global variable
    if (compiledScript[0] == -1) {
        simulatorUI.changeStatus(compiler.getMessage());
        return;
    }
    //^ Comparing first element instead of whole due to TS-2839 - comparing referance to literal.
    //^ If invalid script, show error to user and stop.
    simulatorUI.compile(compiledScript); //< calls global variable
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const predefinedInputs = simulatorUI.getPredefinedInputs();
        const ControlUnit = new controlUnit(compiledScript, predefinedInputs);
        yield ControlUnit.cycle();
    });
}
/*
function updateUI(status:string,process:number,affectedUIs:Map<number,string>):void{
    simulatorUI.changeStatus(status);
    //simulatorUI.changeLittleMan(process);
}
    */ 

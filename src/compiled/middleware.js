import { SimulatorUI } from './simulatorUI.js';
//import { controlUnit } from './vonNeumann';
import { Compiler } from './compiler.js';
const simulatorUI = new SimulatorUI();
let compiledScript;
//: only requires frontend functionality
document.addEventListener("DOMContentLoaded", () => {
    //* for HTML elemets that are not generated after load
    document.getElementById('toggleMode').addEventListener("click", () => simulatorUI.toggleDarkMode());
    document.getElementById('manual').addEventListener("click", () => simulatorUI.displayManual());
});
window.addRowIfNeeded = function (textbox) { simulatorUI.addRowIfNeeded(textbox); };
window.navigateEditor = function (event) { simulatorUI.navigateEditor(event); };
//: only requires both frontend and backend functionality
document.addEventListener("DOMContentLoaded", () => {
    //: HTML button elements
    //(document.getElementById('Menu') as HTMLButtonElement).addEventListener("click", )
    //(document.getElementById('timeOrStep') as HTMLButtonElement).addEventListener("click", )
    document.getElementById('compile').addEventListener("click", () => compile());
    //(document.getElementById('run') as HTMLButtonElement).addEventListener("click", )
    //(document.getElementById('submitInput') as HTMLButtonElement).addEventListener("click", )
});
function compile() {
    const compiler = new Compiler;
    const script = simulatorUI.getScript();
    compiledScript = compiler.validateAndCompile(script); //< global variable
    simulatorUI.compile(compiledScript); //< calls global variable
}

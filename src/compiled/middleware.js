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
import { ControlUnit } from './vonNeumann.js';
import { UICatagory } from "./simulatorUI.js";
//^ better practice and far more easier to identify by enumeration that string or integer.
export class Middleware {
    constructor() {
        this.simulatorUI = new SimulatorUI("This is sandbox mode.");
        //^ Single parameter is the text for the current objective.
        document.addEventListener("DOMContentLoaded", () => {
            //* Requires both frontend and backend functionality
            //: HTML button elements
            ///(document.getElementById('Menu') as HTMLButtonElement).addEventListener("click", )
            ///(document.getElementById('timeOrStep') as HTMLButtonElement).addEventListener("click", )
            document.getElementById('compile').addEventListener("click", () => this.compile());
            document.getElementById('run').addEventListener("click", () => this.run());
        });
    }
    compile() {
        const compiler = new Compiler;
        //^ Compiler class instance only needed when compiling.
        const script = this.simulatorUI.getScript();
        this.compiledScript = compiler.validateAndCompile(script); //< global variable
        if (this.compiledScript[0] == -1) {
            this.simulatorUI.update(UICatagory.status, [compiler.getMessage()]);
            return;
        }
        //^ Comparing first element instead of whole due to TS-2839 - comparing referance to literal.
        //^ If invalid script, show error to user and stop.
        this.simulatorUI.compile(this.compiledScript); //< calls global variable
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const predefinedInputs = this.simulatorUI.getPredefinedInputs();
            //^ Also prepares for run.
            //: verify if execution is possible
            if (predefinedInputs[0] == -1000) {
                this.simulatorUI.update(UICatagory.status, ["Cannot execute, atleast one pre-defined input is invalid. Please use integers in range -999 to 999 in format: [input1], [input2], [inputN]"]);
                return;
            }
            if (this.compiledScript == undefined) {
                this.simulatorUI.update(UICatagory.status, ["Cannot execute, need to compile first."]);
                return;
            }
            //^ Satisfies TS-2532 but can be undefined if user tries to execute without a compiled valid script.
            if (this.compiledScript[0] == -1) {
                this.simulatorUI.update(UICatagory.status, ["Cannot execute, need to compile a valid script first."]);
                return;
            }
            //^ Cannot execute an invalid script.
            this.simulatorUI.start();
            this.simulator = new ControlUnit(this.compiledScript, predefinedInputs, this);
            this.simulatorUI.resetRegesters();
            yield this.simulator.cycle();
            this.simulatorUI.end();
        });
    }
    //: called by VonNeuman.ts
    updateUI(uIcatagory, content) {
        console.log("update: " + uIcatagory + "-" + content);
        this.simulatorUI.update(uIcatagory, content);
    }
    getInput() {
        return __awaiter(this, void 0, void 0, function* () { return yield this.simulatorUI.getInput(); });
    }
}
//@ts-ignore
const middleware = new Middleware();
//^ ts-ignore because compiler thinks class instance doesn't get used when infact it does (by HTML calls)

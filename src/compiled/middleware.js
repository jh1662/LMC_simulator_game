import { SimulatorUI } from './simulatorUI.js';
import { Compiler } from './compiler.js';
import { ControlUnit } from './vonNeumann.js';
import { UICatagory } from "./simulatorUI.js";
//^ better practice and far more easier to identify by enumeration that string or integer.
import { URLQuery } from "./URLQuery.js";
export class Middleware {
    constructor() {
        this.simulatorUI = new SimulatorUI("This is sandbox mode.");
        //^ Single parameter is the text for the current objective.
        document.addEventListener("DOMContentLoaded", () => {
            //* Requires both frontend and backend functionality
            //: HTML button elements
            document.getElementById('compile').addEventListener("click", () => this.compile());
            document.getElementById('run').addEventListener("click", () => this.run());
            document.getElementById('executionMode').addEventListener("click", () => this.switchCycleModes());
            document.getElementById('stop').addEventListener("click", () => this.stop());
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
        this.simulator = new ControlUnit([], []);
        //^ Better to assaign redundant instance than using "?" sysntax (bad practice) also know as the Optional Chaining Operator.
    }
    compile() {
        this.currentSpeed = 4001;
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
        this.simulatorUI.update(UICatagory.status, ["Compilation successful"]);
    }
    async run() {
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
        this.simulatorUI.update(UICatagory.switchCycleModes, ["true"]);
        this.simulatorUI.resetRegesters();
        await this.simulator.cycle();
        this.currentSpeed = 4001;
        //^ back to default value.
        this.simulatorUI.update(UICatagory.end, []);
    }
    stop() { this.simulator.timeout(); }
    //^ Stops currently executing assembly program.
    //: called by VonNeuman.ts
    updateUI(uIcatagory, content) {
        console.log("update: " + uIcatagory + "-" + content);
        this.simulatorUI.update(uIcatagory, content);
    }
    ///public async getInput():Promise<number>{ return await this.simulatorUI.getInput(); }
    getInput() { return this.simulatorUI.getInput(); }
    //: Controlling simulator's execution.
    changeSpeed(toSlower) {
        //* Make code simpler to use one method for both speeding up and slowing down.
        //* Due to slowest speed being 10001 instead of 10000, don't need extra code to check if speed is 0 (or lower) or above 10000.
        //* Only callable when code it running in automatic mode.
        //: Calculate new speed
        if (toSlower) {
            //* Slow down execution speed
            if (this.currentSpeed == this.slowestSpeed) {
                return;
            }
            this.currentSpeed += this.speedInterval;
        }
        else {
            if (this.currentSpeed == this.fastestSpeed) {
                return;
            }
            this.currentSpeed -= this.speedInterval;
        }
        this.simulator.changeSpeed(this.currentSpeed);
        this.simulatorUI.update(UICatagory.status, ["execution speed changed to: " + this.currentSpeed]);
    }
    newCycle() {
        //* Only callable when code it running in manual mode.
        //* Did not call '.displayStatus' because next cycle should happen before the status message has a chance to appear (if so not long enough to be noticed by user).
        this.simulator.newCycle();
        this.simulatorUI.update(UICatagory.status, ["Perform current cycle"]);
    }
    switchCycleModes() {
        //* Small chance of not actually changing mode if calling at highly inhuman speeds but is a rare unexpected error so will assume mode was changed.
        //* If mode does not change, it will not cause error due to the way code works.
        const cycleModeAutomatic = this.simulator.switchModes(!this.cycleModeAutomatic);
        if (this.cycleModeAutomatic == cycleModeAutomatic) {
            return;
        }
        this.cycleModeAutomatic = cycleModeAutomatic;
        this.simulatorUI.update(UICatagory.switchCycleModes, [String(cycleModeAutomatic)]);
        this.simulatorUI.update(UICatagory.status, ["Cycle mode toggled"]);
    }
}
//@ts-ignore (TS-6133)
const middleware = new Middleware();
//^ ts-ignore because compiler thinks class instance doesn't get used when infact it does (by HTML calls)
//@ts-ignore (TS-6133)
const uRlQuery = new URLQuery(false);

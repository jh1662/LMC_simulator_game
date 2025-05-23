/*
import { controlUnit } from "./vonNeumann.js";

async function test(){
    //* addition (before async was added)
    const compiled: number[] = [901,399,901,199,902];
    const predefinedInputs: number[] = [20,300];
    const simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
    console.log(await simulator.cycle());
}

test();



async function testAsync(){
    //* bit more complex program that incorporates 'promise' return data and "async" and "await" functionality
    const compiled: number[] = [901, 309, 901, 109, 902, 901, 209, 902, 0];
    const predefinedInputs: number[] = [20,300,41];
    const simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
    console.log(await simulator.cycle());
}

testAsync();



async function testLong(){
    //* time-consuming program
    //const compiled: number[] = [510, 313, 513, 902, 111, 313, 212, 709, 602, 0, 32, 1, 35];
    const compiled: number[] = [514, 317, 517, 902, 514, 922, 517, 922, 115, 317, 216, 713, 602, 0, 32, 1, 97];
    const predefinedInputs: number[] = [];
    const simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
    console.log(await simulator.cycle());
}

testLong();


async function testDebugging(){
    //* solely for debugging failed jest tests (code changes depending on what jest test I am currently dubugging)
    const compiled: number[] = [512, 1, 111, 902, 312, 511, 113, 311, 514, 211, 80, 0, 1, 0, 1, 10];
    const predefinedInputs: number[] = [];
    const simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
    console.log(await simulator.cycle());
}

testDebugging();

import { Compiler } from "../compiler.js";
function testCompiler(){

    const preCompiled:string[][] = [
        //* represents 2D list values fetched from the frontend's assembly code editor.
        ["ONE", "INP", ""],
        ["", "STA", "99"],
        ["", "OUT", ""],
        ["THREE", "OUT", ""],
        ["", "HLT", ""]
    ];

    //: instantiate then apply compiler to script.
    const compiler:Compiler = new Compiler();
    console.log("ready");
    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);
    //^ If valid, return compiled script as number[],
    //^ otherwise, return error message as string.
    //^ Caller function can know which return kind it is by checking return type.
    console.log("set");
    console.log(compiled);
}
testCompiler();
*/
/*
import { Compiler } from "../compiler.js";
function testCompiler(){

    const preCompiled:string[][] = [
        //* represents 2D list values fetched from the frontend's assembly code editor.
        ["", "SHL", ""],
        ["", "SHR", ""],
        ["", "INP", ""],
        ["", "OUT", ""],
        ["", "OCT", ""],
        ["", "HLT", ""]
    ];

    //: instantiate then apply compiler to script.
    const compiler:Compiler = new Compiler();
    console.log("ready");
    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);
    //^ If valid, return compiled script as number[],
    //^ otherwise, return error message as string.
    //^ Caller function can know which return kind it is by checking return type.
    console.log("set");
    console.log(compiled);
}
testCompiler();
*/
/*
let fastestSpeed = 1;
let slowestSpeed = 10001;
let currentSpeed = 4001;
let speedInterval = 2000;
function changeSpeed(toSlower:boolean):void{
    //* Make code simpler to use one method for both speeding up and slowing down.
    //* Due to slowest speed being 10001 instead of 10000, don't need extra code to check if speed is 0 (or lower) or above 10000.
    //* Only callable when code it running in automatic mode.
    //: Calculate new speed
    console.log("Before - "+currentSpeed);
    if (toSlower){
        //* Slow down execution speed
        if (currentSpeed == slowestSpeed){ console.log("Too high"); return; }
        currentSpeed += speedInterval;
        return;
        //^ bug fix
    }
    //: else
    if (currentSpeed == fastestSpeed){ console.log("Too low"); return; }
    currentSpeed -= speedInterval;

    console.log("After - "+currentSpeed);
}
console.log(4001);
changeSpeed(true);
changeSpeed(true);
changeSpeed(true);
changeSpeed(true);
changeSpeed(true);
changeSpeed(true);
changeSpeed(false);
changeSpeed(false);
changeSpeed(false);
changeSpeed(false);
changeSpeed(false);
changeSpeed(false);
*/
import { LevelChecker } from "../levelChecker.js";
import { Compiler } from "../compiler.js";
async function checkerHelper(level) {
    const compiler = new Compiler();
    //^ To compile the solution into accepcted compiled form and check example solution's validity.
    const checker = new LevelChecker(level);
    //^ To check submission script by checking if its execution matches the 'cases' (class calls 'ControlUnit' during testing).
    const scriptSolution = checker.getExample();
    //^ Assume that user submits the same as the example solution allowing testing of both submittng scripts and the example solution's validity.
    const uppercaseScriptSolution = scriptSolution.map((line) => line.map((token) => token.toUpperCase()));
    //^ To simulate SimulatorUI's capitalisation feature.
    //^ Sources - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map and https://stackoverflow.com/questions/29719329/convert-array-into-upper-case .
    const compiledSolution = compiler.validateAndCompile(uppercaseScriptSolution);
    //^ Attempt to compile script.
    console.log(compiledSolution);
    //^ For debugging purposes - has example solution compiled properly?
    console.log(compiler.getMessage());
    //^ For debugging purposes - explaination of compiler's compilation result.
    checker.setUserCompiled(compiledSolution);
    //^ Submit successfully compiled script to level checker.
    const levelStatus = await checker.assessScript();
    //^ Assess submitted script
    console.log(checker.getMessage());
    //^ For debugging purposes - explaination of checker's level script checking result.
    console.log(`Level #${level} star count:${levelStatus}`);
    //^ For debugging purposes - what was the specific star count?
    return levelStatus;
    //^ Return the star count.
}
//console.log(checkerHelper(9));
//console.log(checkerHelper(14));
//console.log(checkerHelper(13));
//console.log(checkerHelper(15));
console.log(checkerHelper(11));
//console.log(checkerHelper(18));
//console.log(checkerHelper(19));
//console.log(checkerHelper(20));

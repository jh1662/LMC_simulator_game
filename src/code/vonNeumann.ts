//: allows communication with the middleware
import { Middleware } from "./middleware.js";
import { UICatagory } from "./simulatorUI.js";
//^ better practice and far more easier to identify by enumeration that string or integer.

//#region enumerations (exported)
export enum Register { programCounter, address, instruction, accumulator }
//^ To identidy which processor sregister to read or write to.
export enum NumberStatus { underflow, normal, overflow }
//^ To identify if the ALU operation has overflowed, uncderflowed, or neither.
//#endregion
//#region aggregated classes
class RAM{
    private cells:number[];
    //^ where the momory stores
    constructor(memory:number[]){
        this.cells = new Array(100); //< initalise
        //^ LMC simulator has 100 memory cells in the RAM
        for(let index = 0; index < memory.length; index++){
            //* fill array with argument's elements
            let buffer: number|undefined = memory[index]
            //^ satisfies TS-2322
            if (buffer == undefined){buffer = 0;}
            //^ satisfies TS-2322 but if-statement will never be true
            this.cells[index] = buffer;
        }
    }
    //: property methods
    public read(address:number):number{ //< getter
        const value = this.cells[address];
        //^ gets in accordence to index argument (memory address)
        if(value == undefined){return 0;}
        //^ satisfies TS-2322
        return value;
    }
    public write(address:number, value:number){ this.cells[address] = value; } //< setter
}
class ALU{
    //: private fields
    private unflow:number;
    //^ constant number for dealing with overflows and underflows
    private arithmeticStatus:NumberStatus;
    //^ was there a overflow, underflow, or neither of them?

    constructor(){
        this.unflow = 999*2+1;
        //^ 999*2 because 2 lots of 999s - one for positive (1 to 999) and the other for negative (-1 to -999)
        //^ and the +1 to take the number zero into account.
        this.arithmeticStatus = NumberStatus.normal;
    }
    public getArithmeticStatus(){ //< getter method
        return this.arithmeticStatus;
        //^ for the last time an ADD or SUB operation happened
    }
    //: property mutator methods
    public add(input:number, registers:Registers){
        let result:number;

        result = input + registers.read(Register.accumulator);
        //^ get's accumulator's value and modify it
        if (result > 999){ //< overflow
            this.arithmeticStatus = NumberStatus.overflow;
            result = result - this.unflow;
            //^ deals with overflow
            registers.write(Register.accumulator, result);
        }
        else if (result < -999){ //< underflow
            this.arithmeticStatus = NumberStatus.underflow;
            result = result + this.unflow;
            //^ deals with underflow
            registers.write(Register.accumulator, result);
        }
        else{ //< in range
            this.arithmeticStatus = NumberStatus.normal;
            registers.write(Register.accumulator, result);
        }

    }
    public minus(input:number, registers:Registers){ this.add(input*-1, registers); } //< self-invoking
    public shift(registers:Registers, left:boolean){
        //: local variables (non-constant)
        let result;
        let operand:string = String(registers.read(Register.accumulator));

        if (operand[0] == "-"){ operand = operand.slice(1); }
        //^ prevents negative value's minus sign from messing up the shifting operation
        switch(operand.length){
            //* deals with the different digits of significances that the accumulator's value may have
            case 1: operand = "00"+operand+"0"; break;
            case 2: operand = "0"+operand+"0"; break;
            default: operand = operand+"0"; break; //< case 3
        }

        //: does the shifting
        if (left) { result = operand.slice(1); }
        else { result = operand.slice(0,2); } //< else right

        if(registers.read(Register.accumulator)<0){ result = "-"+result; }
        //^ re-add the minus sign if negative

        registers.write(Register.accumulator,Number(result));
        //^ writes result to accumulator
    }
}
class Registers{
    //: private fields
    private programCounter:number;
    private address:number;
    private instruction:number;
    private accumulator:number;

    constructor(){
        this.programCounter = 0;
        this.address = 0;
        this.instruction = 0;
        this.accumulator = 0;
    }
    //: conditional accessor methods
    public read(register:Register){ //< conditional exclusive getter
        switch(register){
            case Register.programCounter: return this.programCounter;
            case Register.address: return this.address;
            case Register.instruction: return this.instruction;
            default: return this.accumulator; //< case Register.accumulator
        }
    }
    public write(register:Register, value:number){ //< conditional exclusive setter
        switch(register){
            case Register.programCounter: this.programCounter = value; break;
            case Register.address: this.address = value; break;
            case Register.instruction: this.instruction = value; break;
            default: this.accumulator = value; //< case Register.accumulator
        }
    }
}
class IO{
    //: private fields
    private predefinedInputs:number[];
    //^ FIFO stack (First In First Out)
    private outputHistory:string[];

    constructor(predefinedInputs:number[]){
        this.predefinedInputs = predefinedInputs;
        //^ user may use pre-defined inputs for rapid prototyping
        this.outputHistory = [];
    }

    //: property methods
    public output(operand:number|string){ //< mutator and display
        this.outputHistory.push(String(operand));
        console.log(operand);
    }
    private stackShift(){ //< pop
        //* satisfies TS-2322 (return type could be either 'number' or 'undefined')
        const element = this.predefinedInputs.shift();
        //^ pops the list
        if (element == undefined){return 0;}
        //^ is list empty?
        return element;
    }
    public input():number { //< conditional getter
        if (this.predefinedInputs.length != 0){ return this.stackShift(); }
        return 0; //! takes user input but is currently '0' for sake of heuristic testing
        //^ else
    }
    public getHistory():string[]{ //< getter
        //! for now only for testing purposes - may become a final feature but not high piority
        return this.outputHistory;
    }
    public getLatestOutput():string{ //< getter
        let output:string|undefined = this.outputHistory[this.outputHistory.length-1];
        //^ Will never cause error becuase it will always be called when there is atleast one element inside it.
        if (output == undefined){ output = ""; }
        //^ Satisfies TS-2322
        return output;
    }
}
//#endregion
//#region exported main class (controlUnit)
export class ControlUnit{
    //: private aggrevated classes
    private ram:RAM;
    private alu:ALU;
    private registers:Registers;
    private io:IO;

    private middleware:Middleware|undefined;
    //^ potentially parent class (or 'undefined')

    //: public fields
    public cycleReady:boolean;
    public cycleInterval:number;


    constructor(memory:number[], predefinedInputs:number[], middleware?:Middleware){
        //: encapsulation
                this.ram = new RAM(memory);
        this.alu = new ALU;
        this.registers = new Registers;
        this.io = new IO(predefinedInputs);

        //: default values - user can change
        this.cycleReady = false;
        this.cycleInterval = 3000;
        //^ default time between actions (3000ms)

        this.middleware = middleware || undefined;
        //^ So '|' is OR-bitewise and '||' is OR-logical.
        //^ If instantiated in middleware instance, parent class instance assiagns to 'this.middleware',
        //^ otherwise 'undefined' assaigns to it which is used in test files.
        this.displayStatus(UICatagory.status,["Program starting"]);
    }
    //: private methods
    private fetch(){
        //* inter-class getter and inter-class mutator method
        const buffer:number = this.ram.read(this.registers.read(Register.programCounter));
        //^ call getter method
        const bufferStr:string = String(buffer); //< parse for decoding
        //: breakdown instruction into opcode and operand
        this.registers.write(Register.instruction, Number(bufferStr[0])); //< opcode
        this.registers.write(Register.address, Number(bufferStr.slice(1,4))); //< operand

        this.displayStatus(UICatagory.status,["Little man fetches next instruction at mail locker #"+this.registers.read(Register.programCounter)]);
        this.displayStatus(UICatagory.displayImage,["fetching.png"])
    }
    private decode(){ //< contitional caller method
        this.displayStatus(UICatagory.status,["Little man open the mail and reads: "+this.registers.read(Register.instruction)+this.registers.read(Register.address)]);
        this.displayStatus(UICatagory.displayImage,["decoding.png"])

        this.displayStatus(UICatagory.registerInstruction,[this.registers.read(Register.instruction).toString()]);
        this.displayStatus(UICatagory.registerAddress,[this.registers.read(Register.address).toString()]);

        switch(this.registers.read(Register.instruction)){ //< 0 to 9
            //x moved code from switch cases to methods because compiler does not allow two cases can declare the same variable.
            case 1: this.ADD(); break;
            case 2: this.SUB(); break;
            case 3: this.STA(); break;
            case 4: this.SH(); break;
            //^ Not part of the moden standard LMC instruction set but otherwise would be unpopulated.
            //^ Either is the left-shift ('401') or right-shift ('402')
            case 5: this.LDA(); break;
            case 6: this.BRA(); break;
            case 7: this.BRZ(); break;
            case 8: this.BRP(); break;
            default: this.IO(); //< case 9
            //^ Used "default" for code integrety.
            //^ Either input (901), output integer (902), or output extended ASCII character (only if in specified range) (903).
        }
    }
    //: methods for each instuction - the methods for instriction's execution
    private ADD(){
        //* Add memory cell address’ value to accumulator’s value
        //: locate and get pointed value
        const address:number = this.registers.read(Register.address);
        const input:number = this.ram.read(address);

        this.alu.add(input, this.registers); //< adding operation

        this.displayStatus(UICatagory.status, ["Little man adds mail address "+address+"'s value to calculator."]);
        this.displayStatus(UICatagory.aLU, ["alu.png"]);
        this.displayStatus(UICatagory.registerAccumulator, [this.registers.read(Register.accumulator).toString()])
        //^ Keeps code simpler by getting directly from register than to get return value from any of the public ALU methods.
        //^ This way barely take more computional time.
    }
    private SUB(){
        //* Subtract memory cell address’ value from accumulator’s value
        //: locate and get pointed value
        const address:number = this.registers.read(Register.address);
        const input:number = this.ram.read(address);

        this.alu.minus(input, this.registers); //< subtraction operation

        this.displayStatus(UICatagory.status,["Little man subtracts mail address "+address+"'s value from calculator."]);
        this.displayStatus(UICatagory.aLU, ["alu.png"]);
        this.displayStatus(UICatagory.registerAccumulator, [this.registers.read(Register.accumulator).toString()])
    }
    private STA(){
        //* Store accumulator’s value in memory cell address
        const address:number = this.registers.read(Register.address);
        const accumulator:number = this.registers.read(Register.accumulator);

        this.ram.write(address, accumulator); //< storing operation

        this.displayStatus(UICatagory.status,["Little man stores calculator's value to mail address "+address]);
        this.displayStatus(UICatagory.aLU, ["sta.png"]);
        this.displayStatus(UICatagory.cell,[address.toString(), accumulator.toString()]);
    }
    private SH(){
        //* Shift the accumulator value’s base-10 digits of significance, by one digit, to the left or right
        if(this.registers.read(Register.address) == 1){ //< left
            this.alu.shift(this.registers,true); //< left-shift operation

            this.displayStatus(UICatagory.status,["Little man left-shifts calculator's value"]);
        }
        else { //< right (==2)
            this.alu.shift(this.registers,false); //< right-shift operation

            this.displayStatus(UICatagory.status,["Little man right-shifts calculator's value"]);

        }
        this.displayStatus(UICatagory.aLU, ["alu.png"]);
        this.displayStatus(UICatagory.registerAccumulator, [this.registers.read(Register.accumulator).toString()])
    }
    private LDA(){
        //* Load memory address’s value to the accumulator (becomes the new accumulator’s value)
        const address:number = this.registers.read(Register.address);
        const value:number = this.ram.read(address);

        this.displayStatus(UICatagory.status,["Little man loads mail address "+address+"'s value to the calculator as accumulator"]);
        this.displayStatus(UICatagory.aLU, ["alu.png"]);
        this.displayStatus(UICatagory.registerAccumulator, [value.toString()]);
        //^ constant 'value' already had the accumulator value.

        this.registers.write(Register.accumulator, value); //< loading operation
    }
    private BRA(){
        //* Branch – change PC’s value to – the address value (regardless of accumulator’s value)
        const address:number = this.registers.read(Register.address);

        this.registers.write(Register.programCounter, address-1); //< branching operation
        //^ Notice - 'address-1' is fine even if resulting in '-1' because it will be incremented before next decoding.

        this.displayStatus(UICatagory.status,["Little man branches to mail address by changing program counter to "+(address-1)]);
        this.displayStatus(UICatagory.displayImage,["branchSuccess.png"])
    }
    private BRZ(){
        //* Branch – change PC’s value to – the address value if accumulator’s value is zero
        const address:number = this.registers.read(Register.address);

        if (this.registers.read(Register.accumulator) == 0){
            //* conditional branching operation
            this.registers.write(Register.programCounter, address-1);

            this.displayStatus(UICatagory.status,["If calculator value is 0, little man branches to mail address"+(address-1)]);
            this.displayStatus(UICatagory.displayImage,["branchSuccess.png"]);
            return;
        }
        this.displayStatus(UICatagory.status,["If calculator value is not 0, little man continues"+(address-1)]);
        this.displayStatus(UICatagory.displayImage,["branchFail.png"]);
    }
    private BRP(){
        //* Branch – change PC’s value to – the address value if accumulator’s value is positive or zero (not negative)
        const address:number = this.registers.read(Register.address);

        if (this.registers.read(Register.accumulator) >= 0){
            //^ conditional branching operation
            this.registers.write(Register.programCounter, address-1);

            this.displayStatus(UICatagory.status,["If calculator value is not 0, little man continues"+(address-1)]);
            this.displayStatus(UICatagory.displayImage,["branchSuccess.png"]);
            return;
        }
        this.displayStatus(UICatagory.status,["If calculator value is not 0 nor positive, little man continues"+(address-1)]);
        this.displayStatus(UICatagory.displayImage,["branchFail.png"]);
    }
    private IO(){
        //* Takes user input for accumulator value or output from accumulator value
        const address:number = this.registers.read(Register.address);
        switch(address){
            //* Determines which IO operation to do (based in address being either 1, 2, or 3).
            case 1:
                //* Input operation
                const input:number = this.io.input()
                this.registers.write(Register.accumulator,this.io.input());

                this.displayStatus(UICatagory.status,["Little man connects to the outside world to take in mail"]);
                this.displayStatus(UICatagory.displayImage,["inp.png"]);
                this.displayStatus(UICatagory.registerAccumulator, [input.toString()]);
                break;

            case 2:
                //* Output (as integer) operation
                this.displayStatus(UICatagory.status,["Little man connects to the outside world to post mail (contain integer)"]);
                this.io.output(this.registers.read(Register.accumulator));
                this.io.getHistory();
                this.displayStatus(UICatagory.output,[this.io.getLatestOutput()])
                this.displayStatus(UICatagory.displayImage,["out.png"]);
                break;

            default: //< case 3
                //* Output as extended ASCII character (only within a certain range)
                this.displayStatus(UICatagory.status,["Little man connects to the outside world to post mail (contain ASCII character)"]);
                const decimal:number = this.registers.read(Register.accumulator);
                //^ "decimal" as in base-10 integer.
                //^ Convert decimal to extended ASCII character
                if(decimal<32 || decimal>255){this.io.output("[?]"); break;}
                //^ range of most vsible extended ASCII characters
                this.io.output(String.fromCharCode(decimal));
                //^ Output (as extended ASCII character) operation
                this.displayStatus(UICatagory.output,[this.io.getLatestOutput()])
                this.displayStatus(UICatagory.displayImage,["output.png"]);
        }
    }
    public displayStatus(uIcatagory:UICatagory, content:string[]){ //< display method
        if (this.middleware == undefined) { return; }
        //^ no point updating UI when there is no UI, used in test files
        this.middleware.updateUI(uIcatagory,content);
        //^ calls parent class instance to update UI accordingly
    }

    //: public methods
    public async cycle():Promise<string[]>{ //< emulator cycle
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        //^ code source: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep "or in Typescript:" section
        while (true){
            //* most 'displayStatus' calls are done in other method calls as they have the relevant data/varaibles.
            //: degugging purposes
            console.log("PC - "+this.registers.read(Register.programCounter));
            console.log("Instruction - "+String(this.registers.read(Register.instruction))+String(this.registers.read(Register.instruction)));

            //: mix of displaying status, sleeping, and doing the "fetch, decode, execute" cycle.
            //if (!this.cycleReady){ continue; } //! is currently disabled because it depends on second sprint to be of use
            await sleep(this.cycleInterval);
            this.fetch();
            //^ fetch part of the cycle
            if (this.registers.read(Register.instruction) == 0){
                //* when compiled assembly program ends
                this.displayStatus(UICatagory.status,["Little man takes a coffee break"]);
                this.displayStatus(UICatagory.displayImage,["hlt.png"])
                break;
            }
            await sleep(this.cycleInterval);
            this.decode();
            //^ decode part of the cycle but also calls the specified instruction method for the execution part of the cycle
            await sleep(this.cycleInterval);
            //: increment and check in PC's value went over limit (99)
            this.displayStatus(UICatagory.status,["Little man checks the mail counter, is currently at "+this.registers.read(Register.programCounter)]);
            this.displayStatus(UICatagory.displayImage,["counter.png"]);
            await sleep(this.cycleInterval);
            this.displayStatus(UICatagory.status,["Little man increments the mail counter to "+(this.registers.read(Register.programCounter)+1).toString()]);
            this.displayStatus(UICatagory.displayImage,["counterIncrement.png"]);
            this.registers.write(Register.programCounter, this.registers.read(Register.programCounter)+1 )
            if( this.registers.read(Register.programCounter) > 99 ){
                //* resets to zero when above 99
                await sleep(this.cycleInterval);
                this.displayStatus(UICatagory.status,["Counter too high - Little man resets mail counter back to 0"]);
                this.displayStatus(UICatagory.displayImage,["counterReset.png"]);
                this.registers.write(Register.programCounter, 0);

            }
            //! more code will be added in the 'cycle' method to sync with the UI in the second sprint
            await sleep(this.cycleInterval);
        }
        this.displayStatus(UICatagory.end,[]);
        return this.io.getHistory();
    }
    public getArithmeticStatus():NumberStatus{ return this.alu.getArithmeticStatus(); } //< inter-class getter
    //^! 'getArithmeticStatus' does not get called in first sprint (hence not tested) but in the second sprint
}
//#endregion


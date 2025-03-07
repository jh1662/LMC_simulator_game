//#region enumeration
export enum Register { programCounter, address, instruction, accumulator }
//^ To identidy which processor sregister to read or write to.
export enum NumberStatus { underflow, normal, overflow}
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
        //! for now uses console for testing but must link up with user interface
    }
    private stackShift(){ //< pop
        //* satisfies TS-2322(return type could be either 'number' or 'undefined')
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
}
//#endregion
//#region exported class (controlUnit)
export class controlUnit{
    //: private aggrevated classes
    private ram:RAM;
    private alu:ALU;
    private registers:Registers;
    private io:IO;

    //: public fields
    public cycleReady:boolean;
    public cycleInterval:number;

    constructor(memory:number[], predefinedInputs:number[]){
        //: encapsulation
        this.displayStatus("Program starting");
        this.ram = new RAM(memory);
        this.alu = new ALU;
        this.registers = new Registers;
        this.io = new IO(predefinedInputs);

        //: default values - user can change
        this.cycleReady = false;
        this.cycleInterval = 1;
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
    }
    private decode(){ //< contitional caller method
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

        this.displayStatus("Little man adds mail address "+address+"'s value to calculator.");
        this.alu.add(input, this.registers); //< adding operation
    }
    private SUB(){
        //* Subtract memory cell address’ value from accumulator’s value
        //: locate and get pointed value
        const address:number = this.registers.read(Register.address);
        const input:number = this.ram.read(address);

        this.displayStatus("Little man subtracts mail address "+address+"'s value from calculator.");
        this.alu.minus(input, this.registers); //< subtraction operation
    }
    private STA(){
        //* Store accumulator’s value in memory cell address
        const address:number = this.registers.read(Register.address);
        this.ram.write(address, this.registers.read(Register.accumulator)); //< storing operation
        this.displayStatus("Little man stores calculator's value to mail address "+address);
    }
    private SH(){
        //* Shift the accumulator value’s base-10 digits of significance, by one digit, to the left or right
        if(this.registers.read(Register.address) == 1){ //< left
            this.alu.shift(this.registers,true); //< left-shift operation
            this.displayStatus("Little man left-shifts calculator's value");
        }
        else { //< right (==2)
            this.alu.shift(this.registers,false); //< right-shift operation
            this.displayStatus("Little man right-shifts calculator's value");
        }
    }
    private LDA(){
        //* Load memory address’s value to the accumulator (becomes the new accumulator’s value)
        const address:number = this.registers.read(Register.address);
        this.displayStatus("Little man loads mail address "+address+"'s value to the calculator");
        this.registers.write(Register.accumulator, this.ram.read(address)); //< loading operation
    }
    private BRA(){
        //* Branch – change PC’s value to – the address value (regardless of accumulator’s value)
        const address:number = this.registers.read(Register.address);
        this.displayStatus("Little man branches to mail address "+address);
        this.registers.write(Register.programCounter, address-1); //< branching operation
    }
    private BRZ(){
        //* Branch – change PC’s value to – the address value if accumulator’s value is zero
        const address:number = this.registers.read(Register.address);
        this.displayStatus("If calculator value is 0, little man branches to mail address"+address);
        if (this.registers.read(Register.accumulator) == 0){this.registers.write(Register.programCounter, address-1);}
        //^ conditional branching operation
    }
    private BRP(){
        //* Branch – change PC’s value to – the address value if accumulator’s value is positive or zero (not negative)
        const address:number = this.registers.read(Register.address);
        this.displayStatus("If calculator value is 0 or zero, little man branches to mail address"+address);
        if (this.registers.read(Register.accumulator) >= 0){this.registers.write(Register.programCounter, address-1);}
        //^ conditional branching operation
    }
    private IO(){
        //* Takes user input for accumulator value or output from accumulator value
        const address:number = this.registers.read(Register.address);
        this.displayStatus("Little man connects to the outside world");
        switch(address){
            //* Determines which IO operation to do (based in address being either 1, 2, or 3).
            case 1: this.registers.write(Register.accumulator,this.io.input()); break;
            //^ Input operation
            case 2: this.io.output(this.registers.read(Register.accumulator)); break;
            //^ Output (as integer) operation
            default: //< case 3
                //* Output as extended ASCII character (only within a certain range)
                const decimal:number = this.registers.read(Register.accumulator);
                //^ "decimal" as in base-10 integer.
                //^ Convert decimal to extended ASCII character
                if(decimal<32 || decimal>255){this.io.output("[?]"); break;}
                //^ range of most vsible extended ASCII characters
                this.io.output(String.fromCharCode(decimal)); break;
                //^ Output (as extended ASCII character) operation
        }
    }
    private displayStatus(status:string){ //< display method
        console.log(status);
        //! depends of second sprint to have a frontend to output to
    }

    //: public methods
    public async cycle():Promise<string[]>{ //< emulator cycle
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        //^ code source: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep "or in Typescript:" section
        while (true){
            //: degugging purposes
            console.log("PC - "+this.registers.read(Register.programCounter));
            console.log("Instruction - "+String(this.registers.read(Register.instruction))+String(this.registers.read(Register.instruction)));

            //: mix of displaying status, sleeping, and doing the "fetch, decode, execute" cycle.
            //if (!this.cycleReady){ continue; } //! is currently disabled because it depends on second sprint to be of use
            this.displayStatus("Little man fetches next instruction");
            await sleep(this.cycleInterval);
            this.fetch();
            //^ fetch part of the cycle
            if (this.registers.read(Register.instruction) == 0){
                //* when compiled assembly program ends
                this.displayStatus("Little man takes a coffee break");
                break;
            }
            this.displayStatus("Little man decodes then do the instruction");
            await sleep(this.cycleInterval);
            this.decode();
            //^ decode part of the cycle but also calls the specified instruction method for the execution part of the cycle
            await sleep(this.cycleInterval);
            //: increment and check in PC's value went over limit (99)
            this.displayStatus("Little man checks the mail counter");
            await sleep(this.cycleInterval);
            this.registers.write(Register.programCounter, this.registers.read(Register.programCounter)+1 )
            if( this.registers.read(Register.programCounter) > 99 ){
                //* resets to zero when above 99
                this.displayStatus("Counter too high - Little man resets mail counter");
                this.registers.write(Register.programCounter, 0);
                await sleep(this.cycleInterval);
            }
            //! more code will be added in the 'cycle' method to sync with the UI in the second sprint
        }
        this.displayStatus("Program halted");
        return this.io.getHistory();
    }
    public getArithmeticStatus():NumberStatus{ return this.alu.getArithmeticStatus(); } //< inter-class getter
    //^! 'getArithmeticStatus' does not get called in first sprint (hence not tested) but in the second sprint
}
//#endregion


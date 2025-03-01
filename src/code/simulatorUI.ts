///import { Register } from "./vonNeumann";
export enum Register { programCounter, address, instruction, accumulator }
//#region frontend connected classes
enum Direction{up, down, left, right};
export class MemoryUI{
    //* Class to generate the memory table once per simulator page load
    //* and to write to its cells (the textboxes).
    private HTMLTable: HTMLTableElement;
    constructor(tableId:string){
        this.HTMLTable = document.getElementById(tableId) as HTMLTableElement;
        //^ "as HTMLTableElement" assures code that argument isn't null
        //^ hence satisfying TS-2322
        this.generateTable();
    }
    private generateTable():void {
        for (let row = 0; row < 9; row++) {
            //* Y-axis - appending rows
            const rowEven = this.HTMLTable.insertRow();
            //^ Row 0,2,4,6, and 8
            const rowOdd = this.HTMLTable.insertRow();
            //^ Row 1,3,5,7, and 9
            for (let cell = 0; cell < 10; cell++) {
                //* X-axis - appending cells/fields.
                //* Writing to the cells as feilds but the cell count can also be concidered as column number.
                rowEven.insertCell().innerHTML = `<b>${cell}</b>`;
                //^ Not the usual coding style, but it is very clear to the author.
                //^ Cell's referance is not needed afterwards, hence not stored.
                //^ "innerHTML" property is applied directly to the result of "rowEven.insertCell()" (the cell).
                //^ This single line deals with the even row cells.

                //: deals with the odd row cells
                const cellId = `memoryCell${(row*10)+cell}`;
                //^ needs to be referanced when either assembly program compiles or is referanced by the assembly program's execution
                const cellContent = Object.assign(document.createElement('input'), {type: 'text', className: 'form-control col-xs-11', id: cellId, readOnly: false});
                //^ "Object.assign" - allows object to both be declared and have properties assigned in the same line without bad practice.
                rowOdd.insertCell().appendChild(cellContent);
                //^ inserting the contents as a new cell in the current odd cell
            }
        }
    }
    private writeToCell(index:number, value:number):void{
        //* Assume both arguments are valid (with-in range).
        //* Table is 2-dimentional, but LMC simulator engine ('vonNeumann.ts') views memory as 1-dimentional.
        const cell:HTMLElement|null = document.getElementById(`memoryCell${index}`);
        //^ Satisfies TS-2531 - takes possibliity of null into account
        if (cell instanceof HTMLInputElement) { cell.value = value.toString(); }
        //^ Satisfies TS-2339 - assures cell have the '.value' property
    }
    public compileToMemory(memory:number[]):void{
        for (let index = 0; index < memory.length; index++) {
            //^ memory.length is always positive and is always below 100
            //* one element to its corrosponding cell at a time
            let content = memory[index];
            if (content == undefined) { content = 0; }
            //^ Satisfies TS-2531
            this.writeToCell(index, content);
        }
    }
}
export class EditorUI{
    private HTMLTable: HTMLTableElement;
    constructor(tableId:string){
        this.HTMLTable = document.getElementById(tableId) as HTMLTableElement;
        //^ "as HTMLTableElement" assures code that argument isn't null
        //^ hence satisfying TS-2322
    }
    public generateLine(textbox:HTMLInputElement):void{
        //* adds a new line to the editor table only if the current/selected textbox is on the last line
        const currentRow:HTMLTableRowElement = textbox.parentElement!.parentElement as HTMLTableRowElement;
        //^ First 'parentElement' is the cell and second 'parentElement' is the row.
        //^ exclamation mark assures the code that the cell is not null/undifined - satisfying TS-18047
        //^ "as HTMLTableRowElement" satisfies TS-2322

        const lastRowID:number = this.HTMLTable.rows.length - 1
        //^ this id included the top row (label opcode operand).
        const lastRow:HTMLTableRowElement = this.HTMLTable.rows[lastRowID] as HTMLTableRowElement;
        //^ to see compare with current row

        if (currentRow != lastRow){ return; }
        //^ not currently on the bottom row?

        //: adding a new row/line
        const newRow:HTMLTableRowElement = this.HTMLTable.insertRow();
        //^ adds new row at the end
        const newRowID = lastRowID;
        //^ would have been "+1" if the top row did not count
        newRow.innerHTML = `
        <td>${newRowID}</td>
        <td id="${newRowID}-0"><input type="text" class="form-control col-xs-11" id="input-${newRowID}-0" oninput="addRowIfNeeded(this)" onkeydown="navigateEditor(event)"></td>
        <td id="${newRowID}-1"><input type="text" class="form-control col-xs-11" id="input-${newRowID}-1" oninput="addRowIfNeeded(this)" onkeydown="navigateEditor(event)"></td>
        <td id="${newRowID}-2"><input type="text" class="form-control col-xs-11" id="input-${newRowID}-2" oninput="addRowIfNeeded(this)" onkeydown="navigateEditor(event)"></td>
        `;
        //^ much easier to add all 3 cells by editing row element inner-HTML rather that using insertCell() method 3 times and edit their inner-HTML
        newRow.id = `line-${newRowID}`;
        //^ inner-HTML, of an element, does not include the element tags themselves.
    }
    public navigationCheck(event: KeyboardEvent):void{
        //* check if key pressed is a navigation key and act if it does
        switch (event.key) {
            case 'Tab':
                this.navigation(event,Direction.right);
                break;
            case ' ':
                this.navigation(event,Direction.right);
                break;
            case 'Enter':
                this.navigation(event,Direction.down);
                break;
            case 'ArrowRight':
                this.navigation(event,Direction.right);
                break;
            case 'ArrowLeft':
                this.navigation(event,Direction.left);
                break;
            case 'ArrowUp':
                this.navigation(event,Direction.up);
                break;
            case 'ArrowDown':
                this.navigation(event,Direction.down);
                break;
            //* no default case as most keys will not be handled

            //x adding different key functionality for when shift is pressed, at the same time, is a lower priority.
        }
    }
    private navigation(event: KeyboardEvent, direction:Direction):void{
        event.preventDefault();
        //: Require multiple lines to satisfy TS-2345 - could be undefined.
        //: Certain that target exists (hence the "as [datatype];" ends) - is not undefined.
        const cell:HTMLTableCellElement = (event.target as HTMLInputElement).parentElement! as HTMLTableCellElement;
        const cellId:string = cell.id;
        //^ need to emphasize that is id of the cell, not it's textbox but will help to get textbox's id
        const [rowStr, colStr] = cellId.split('-');
        if (!rowStr || !colStr) { return; }
        const row: number = parseInt(rowStr);
        const column: number = parseInt(colStr);

        switch (direction){
            //* calling more specific navigation functions (with arguments) based on directions
            case Direction.up:
                this.verticalNavigation(row, column, true);
                break;
            case Direction.down:
                this.verticalNavigation(row, column, false);
                break;
            case Direction.left:
                this.horizontalNavigation(row, column, false);
                break;
            default: //< Direction.right:
                this.horizontalNavigation(row, column, true);
        }
    }
    private verticalNavigation(rowId:number, columnId:number, isUpwards:boolean):void{
        //* columnId is not actually the column index (because of the row of column labels - label, opcode, and operand)
        const lastRowID:number = this.HTMLTable.rows.length - 2;
        //^ is not "this.HTMLTable.rows.length - 1" because to the first row is the column labels/titles.
        if (isUpwards){
            //* decrement row id if moving upwards
            rowId--;
            if (rowId < 0){ rowId = lastRowID; }
        }
        else{ //< moving downwards
            //* increment row id
            rowId++;
            if (rowId > lastRowID){ rowId = 0; }
        }
        const textbox:HTMLInputElement = document.getElementById(`input-${rowId}-${columnId}`) as HTMLInputElement;
        textbox.focus();
    }
    private horizontalNavigation(rowId:number, columnId:number, isRight:boolean):void{
        //* 'columnId' is not actually the column index (because of the column of line numbers - 0,1,2,3,4...).
        //* 'isRight' as in the direction.
        const lastColumnID:number = 2; //< operand column
        if (isRight){
            //* increment column id if moving right
            columnId++;
            if (columnId > lastColumnID){ columnId = 0; }
        }
        else{ //< moving left
            //* decrement column id
            columnId--;
            if (columnId < 0){ columnId = lastColumnID; }
        }
        const textbox:HTMLInputElement = document.getElementById(`input-${rowId}-${columnId}`) as HTMLInputElement;
        textbox.focus();
    }
    public getScript(){
        //* returns the script as a 2D array tokens
        let script:string[][] = [];
        for (let lineId = 0; lineId < this.HTMLTable.rows.length-1; lineId++) {
            ///const row:HTMLTableRowElement = this.HTMLTable.rows[lineId] as HTMLTableRowElement;
            const line:string[] = [
                //* Does not matter if the cell is empty - prevents jagged arrays.
                //* Same functionality as:
                //* "for (let cell = 1; cell < 4; cell++) { line.push(((document.getElementById(`input-${lineId}-${cell}`) as HTMLInputElement).value).innerText); }"
                //* but easier to comprehend and maintain/update in this current form and does not take that much more code space.
                (document.getElementById(`input-${lineId}-0`) as HTMLInputElement).value, //< label token
                //^ "as HTMLInputElement" satisfies TS-2531.
                //^ More reliable and easier to get textboxes by predictable ID rather that getting textbox by parent element (cell).
                (document.getElementById(`input-${lineId}-1`) as HTMLInputElement).value, //< opcode token
                (document.getElementById(`input-${lineId}-2`) as HTMLInputElement).value //< operand token
            ];
            if (line[0] == "" && line[1] == "" && line[2] == "") { continue; }
            //^ do not add empty lines to the script
            if((line[0] as string).charAt(0)=="#" || (line[0] as string).charAt(0)=="//"){ continue; }
            //^ Not possible for line[0] to be undefined - "as string" satisfies TS-2532.
            //^ Do not add region declarations or comments to the script.
            script.push(line);
            //^ each sub-array is a line, of tokens, in the script.
        }
        /*
        //? If only top line runs the output is no parsed
        //? but if both top and bottom lines run both outputs are parsed.
        //? Most likely the cause is that the script somehow gets parsed (by object referance) before first output.
        console.log(script);
        console.log(this.parseScript(script));
        */
        console.log(script);
        return this.parseScript(script);
        //^ Script is either a 2D array of tokens or an empty array.
        //^ If caller detects emty array, it will exit/stop.
    }
    private parseScript(script:string[][]):string[][]{
        //* parsing the tokens - makes validation much easier.
        //* parsing does not give errors hence is in this frontend class.
        for (let lineNum = 0; lineNum < script.length; lineNum++) {
            const line:string[] = script[lineNum] as string[];
            //^ declaration satisfies TS-2322
            for (let tokenType = 0; tokenType < line.length; tokenType++) {
                let token:string|undefined = line[tokenType];
                if (token == undefined) { token = ""; }
                //^ reassaignment as "" satisfies TS-18048
                line[tokenType] = token.replace(/\s+/g, '');
                //^ Removes all whitespaces.
                //^ Learned about 'regular expressions' on https://www.regexone.com/ .
                line[tokenType] = token.replace(/./g, (char) => char.toUpperCase());
                //^ capitalises all characters
            }
        }
        return script;
        //^ returns the script (2D-array of tokens) as parsed
    }
}
class IOUI{
    //: textboxes
    private input:HTMLInputElement; //< input
    private predefinedInput:HTMLInputElement; //< input and output
    private outputHistory:HTMLInputElement;//< output (read-only)

    private submitInput:HTMLButtonElement;
    //^ button for submitting non-predefined inputs

    constructor(input:string, predefinedInput:string, outputHistory:string, submitInput:string){
        this.input = document.getElementById(input) as HTMLInputElement;
        this.predefinedInput = document.getElementById(predefinedInput) as HTMLInputElement;
        this.outputHistory = document.getElementById(outputHistory) as HTMLInputElement;
        this.submitInput = document.getElementById(submitInput) as HTMLButtonElement;
    }

    public getInput():Promise<string>{
        this.input.readOnly = false;
        return new Promise((resolve) => {
            this.submitInput.addEventListener("click",() => {
                let userInput = this.input.value;
                userInput = userInput.replace(/\s+/g, '');
                //^ remove whitespaces
                if (!(/^-?(?:[1-9]?\d{1,2}|0)$/).test(userInput)) { userInput = ""; }
                //^ validation - if invalid, assaign it as ""
                resolve(this.input.value);
            },{
                once: true
            })
        });
    }
    public output(appendingValue:string){ this.outputHistory.value += (", "+appendingValue); }

    public reset():void{
        this.predefinedInput.value = "";
        this.predefinedInput.readOnly = false;
        this.input.readOnly = true;
    }

    public start():void{ this.predefinedInput.readOnly = true; }
}
/*
class ALUUI{

}
*/
class RegistersUI{
    //* simplitic - only display integers or resets to "0" as the procession happens in the backend.
    //* specifically named in plural form to emphasise the
    //: all input textboxes are readonly - output instead
    private programCounter:HTMLInputElement;
    private memoryInstructionRegister:HTMLInputElement;
    private memoryAddressRegister:HTMLInputElement;
    private accumulator:HTMLInputElement;

    constructor(programCounter:string, memoryInstructionRegister:string, memoryAddressRegister:string, accumulator:string){
        this.programCounter = document.getElementById(programCounter) as HTMLInputElement;
        this.memoryInstructionRegister = document.getElementById(memoryInstructionRegister) as HTMLInputElement;
        this.memoryAddressRegister = document.getElementById(memoryAddressRegister) as HTMLInputElement;
        this.accumulator = document.getElementById(accumulator) as HTMLInputElement;
    }

    public updateRegister(register:Register, newValue:number):void{
        //* 'newValue' was and works as a number but needs it as string because no math operations will apply to it
        //* and HTML input textboxes accept strings only for overwriting the '.value' property.
        //* Second parameter is called 'newValue' because not to be confused with the HTML element's '.value' property
        //* that gets called ofter in this class.
        switch(register){
            case Register.programCounter:
                this.programCounter.value = newValue.toString(); break;
            case Register.instruction:
                this.memoryInstructionRegister.value = newValue.toString(); break;
            case Register.address:
                this.memoryAddressRegister.value = newValue.toString(); break;
            case Register.accumulator:
                this.accumulator.value = newValue.toString(); break;
        }
    }
    public resetRegisters():void{
        this.programCounter.value = "0";
        this.memoryInstructionRegister.value = "0";
        this.memoryAddressRegister.value = "0";
        this.accumulator.value = "0";
    }
}

class MiscellaneousUI{
    //* Collection of managing single UI attributes that are not belong to a group and do not require a constructor.
    public displayManual():void{ window.open('manual.html', '_blank', 'width=800,height=600'); }
    public toggleDarkMode():void{
        //* note: dark/light mode is different to style themes
        const HTMLEle:HTMLElement = document.documentElement;
        const currentMode:string|null = HTMLEle.getAttribute('data-bs-theme');
        //^ Cannot get property directly due to name composition (use of dashes in name).
        if (currentMode == "light") { HTMLEle.setAttribute('data-bs-theme', 'dark'); }
        else { HTMLEle.setAttribute('data-bs-theme', 'light'); }
    }
}
//#endregion
//#region main class
export class SimulatorUI{
    //* To store and manage all front-end class instances.
    private memoryUI:MemoryUI;
    private editorUI:EditorUI;
    //@ts-ignore
    private iOUI:IOUI;
    //@ts-ignore
    private registerUI:RegistersUI;
    private miscellaneousUI: MiscellaneousUI;
    constructor(){
        //: Ids as arguments for simplicity and ease when maintaining/updating.
        this.memoryUI = new MemoryUI('memoryTable');
        this.editorUI = new EditorUI('editorTable');
        this.registerUI = new RegistersUI('registerProgramCounter','registerInstruction', 'registerAddress', 'registerAccumulator');
        this.iOUI = new IOUI('input','predefinedInputs','output','submitInput');
        this.miscellaneousUI = new MiscellaneousUI();

        console.log('simulatorUI has loaded');
    }
    //: called by middleware for tasks that does not involve the backend
    public addRowIfNeeded(textbox:HTMLInputElement):void{ this.editorUI.generateLine(textbox); }
    public navigateEditor(event:KeyboardEvent):void{ this.editorUI.navigationCheck(event); }
    public toggleDarkMode():void{ this.miscellaneousUI.toggleDarkMode(); }
    public getScript():string[][]{ return this.editorUI.getScript(); }
    public displayManual():void{ this.miscellaneousUI.displayManual(); }

    public compile(memory:number[]):void{ this.memoryUI.compileToMemory(memory); }
}

//function addRowIfNeeded(textbox:HTMLInputElement):void{ editorUI.generateLine(textbox); }
//function navigateEditor(event:KeyboardEvent):void{ editorUI.navigationCheck(event); }
//#endregion

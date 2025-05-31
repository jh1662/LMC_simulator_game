import { Register, NumberStatus } from "./vonNeumann.js";
//^ Why make new enumeration when can import an existing one.
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["down"] = 1] = "down";
    Direction[Direction["left"] = 2] = "left";
    Direction[Direction["right"] = 3] = "right";
})(Direction || (Direction = {}));
;
export var UICatagory;
(function (UICatagory) {
    UICatagory[UICatagory["registerAccumulator"] = 0] = "registerAccumulator";
    UICatagory[UICatagory["registerProgramCounter"] = 1] = "registerProgramCounter";
    UICatagory[UICatagory["registerAddress"] = 2] = "registerAddress";
    UICatagory[UICatagory["registerInstruction"] = 3] = "registerInstruction";
    //^ relating to registerUI
    UICatagory[UICatagory["aLU"] = 4] = "aLU";
    //^ realting to aLUUI - only one because all three relavant HTML textboxes get updated at the same time
    UICatagory[UICatagory["status"] = 5] = "status";
    UICatagory[UICatagory["displayImage"] = 6] = "displayImage";
    UICatagory[UICatagory["cell"] = 7] = "cell";
    //: relating to IOUI
    UICatagory[UICatagory["output"] = 8] = "output";
    //^ outputted numbers from LMC simulator
    UICatagory[UICatagory["end"] = 9] = "end";
    //^ resets for next script
    UICatagory[UICatagory["switchCycleModes"] = 10] = "switchCycleModes";
    //^ changes button layout in accordance to toggled cycle execution mode.
})(UICatagory || (UICatagory = {}));
//#region frontend connected classes
//enum UIProperties{};
class MemoryUI {
    constructor(tableId) {
        this.HTMLTable = document.getElementById(tableId);
        //^ "as HTMLTableElement" assures code that argument isn't null
        //^ hence satisfying TS-2322
        this.generateTable();
    }
    generateTable() {
        for (let row = 0; row < 10; row++) {
            //* Y-axis - appending rows
            const rowEven = this.HTMLTable.insertRow();
            //^ Row 0,2,4,6, and 8
            const rowOdd = this.HTMLTable.insertRow();
            //^ Row 1,3,5,7, and 9
            for (let cell = 0; cell < 10; cell++) {
                //* X-axis - appending cells/fields.
                //* Writing to the cells as feilds but the cell count can also be concidered as column number.
                rowEven.insertCell().innerHTML = `<b>${String((row * 10) + cell).padStart(2, "0")}</b>`;
                //^ Not the usual coding style, but it is very clear to the author.
                //^ Cell's referance is not needed afterwards, hence not stored.
                //^ "innerHTML" property is applied directly to the result of "rowEven.insertCell()" (the cell).
                //^ This single line deals with the even row cells.
                //: deals with the odd row cells
                const cellId = `memoryCell${(row * 10) + cell}`;
                //^ needs to be referanced when either assembly program compiles or is referanced by the assembly program's execution
                const cellContent = Object.assign(document.createElement('input'), { type: 'text', className: 'form-control col-xs-11', id: cellId, readOnly: true });
                //^ "Object.assign" - allows object to both be declared and have properties assigned in the same line without bad practice.
                rowOdd.insertCell().appendChild(cellContent);
                //^ inserting the contents as a new cell in the current odd cell
            }
        }
    }
    writeToCell(index, value) {
        //* Assume both arguments are valid (with-in range).
        //* Table is 2-dimentional, but LMC simulator engine ('vonNeumann.ts') views memory as 1-dimentional.
        const cell = document.getElementById(`memoryCell${index}`);
        //^ Satisfies TS-2531 - takes possibliity of null into account
        if (cell instanceof HTMLInputElement) {
            cell.value = value.toString().padStart(3, "0");
        }
        //^ Satisfies TS-2339 - assures cell have the '.value' property
    }
    compileToMemory(memory) {
        for (let index = 0; index < memory.length; index++) {
            //^ memory.length is always positive and is always below 100
            //* one element to its corrosponding cell at a time
            let content = memory[index];
            if (content == undefined) {
                content = 0;
            }
            //^ Satisfies TS-2531
            this.writeToCell(index, content);
        }
    }
}
class EditorUI {
    constructor(tableId) {
        this.HTMLTable = document.getElementById(tableId);
        //^ "as HTMLTableElement" assures code that argument isn't null
        //^ hence satisfying TS-2322
    }
    generateLine(textbox, loadExampleCall = false) {
        //* adds a new line to the editor table only if the current/selected textbox is on the last line
        const lastRowID = this.HTMLTable.rows.length - 1;
        //^ this id included the top row (label opcode operand).
        const lastRow = this.HTMLTable.rows[lastRowID];
        //^ to see compare with current row
        if (!loadExampleCall) {
            //* Verification is only bypassed/overiden if called by 'this.loadScript' method call.
            const currentRow = textbox.parentElement.parentElement;
            //^ First 'parentElement' is the cell and second 'parentElement' is the row.
            //^ exclamation mark assures the code that the cell is not null/undifined - satisfying TS-18047
            //^ "as HTMLTableRowElement" satisfies TS-2322
            if (currentRow != lastRow) {
                return;
            }
            //^ Not currently on the bottom row?
            //^ Only generate new line without being in last row if called by 'this.loadSolutionExample'.
        }
        //: adding a new row/line
        const newRow = this.HTMLTable.insertRow();
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
    navigationCheck(event) {
        //* check if key pressed is a navigation key and act if it does
        switch (event.key) {
            case 'Tab':
                this.navigation(event, Direction.right);
                break;
            case ' ':
                this.navigation(event, Direction.right);
                break;
            case 'Enter':
                this.navigation(event, Direction.down);
                break;
            case 'ArrowRight':
                this.navigation(event, Direction.right);
                break;
            case 'ArrowLeft':
                this.navigation(event, Direction.left);
                break;
            case 'ArrowUp':
                this.navigation(event, Direction.up);
                break;
            case 'ArrowDown':
                this.navigation(event, Direction.down);
                break;
            //* no default case as most keys will not be handled
            //x adding different key functionality for when shift is pressed, at the same time, is a lower priority.
        }
    }
    //: methods relating to fetching the script
    getScript() {
        //* returns the script as a 2D array tokens
        let script = [];
        for (let lineId = 0; lineId < this.HTMLTable.rows.length - 1; lineId++) {
            ///const row:HTMLTableRowElement = this.HTMLTable.rows[lineId] as HTMLTableRowElement;
            const line = [
                //* Does not matter if the cell is empty - prevents jagged arrays.
                //* Same functionality as:
                //* "for (let cell = 1; cell < 4; cell++) { line.push(((document.getElementById(`input-${lineId}-${cell}`) as HTMLInputElement).value).innerText); }"
                //* but easier to comprehend and maintain/update in this current form and does not take that much more code space.
                document.getElementById(`input-${lineId}-0`).value, //< label token
                //^ "as HTMLInputElement" satisfies TS-2531.
                //^ More reliable and easier to get textboxes by predictable ID rather that getting textbox by parent element (cell).
                document.getElementById(`input-${lineId}-1`).value, //< opcode token
                document.getElementById(`input-${lineId}-2`).value //< operand token
            ];
            if (line[0] == "" && line[1] == "" && line[2] == "") {
                continue;
            }
            //^ do not add empty lines to the script
            if (line[0].charAt(0) == "#" || line[0].charAt(0) == "//") {
                continue;
            }
            //^ Not possible for line[0] to be undefined - "as string" satisfies TS-2532.
            //^ Do not add region declarations or comments to the script.
            script.push(line);
            //^ each sub-array is a line, of tokens, in the script.
        }
        ///console.log(script);
        //! To help develop to help develop the level data in sprint 3^^^
        return this.parseScript(script);
        //^ Script is either a 2D array of tokens or an empty array.
        //^ If caller detects emty array, it will exit/stop.
    }
    parseScript(script) {
        //* parsing the tokens - makes validation much easier.
        //* parsing does not give errors hence is in this frontend class.
        for (let lineNum = 0; lineNum < script.length; lineNum++) {
            const line = script[lineNum];
            //^ declaration satisfies TS-2322
            for (let tokenType = 0; tokenType < line.length; tokenType++) {
                let token = line[tokenType];
                if (token == undefined) {
                    token = "";
                }
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
    //: Methods relating to navigation
    navigation(event, direction) {
        event.preventDefault();
        //: Require multiple lines to satisfy TS-2345 - could be undefined.
        //: Certain that target exists (hence the "as [datatype];" ends) - is not undefined.
        const cell = event.target.parentElement;
        const cellId = cell.id;
        //^ need to emphasize that is id of the cell, not it's textbox but will help to get textbox's id
        const [rowStr, colStr] = cellId.split('-');
        if (!rowStr || !colStr) {
            return;
        }
        const row = parseInt(rowStr);
        const column = parseInt(colStr);
        switch (direction) {
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
    verticalNavigation(rowId, columnId, isUpwards) {
        //* columnId is not actually the column index (because of the row of column labels - label, opcode, and operand)
        const lastRowID = this.HTMLTable.rows.length - 2;
        //^ is not "this.HTMLTable.rows.length - 1" because to the first row is the column labels/titles.
        if (isUpwards) {
            //* decrement row id if moving upwards
            rowId--;
            if (rowId < 0) {
                rowId = lastRowID;
            }
        }
        else { //< moving downwards
            //* increment row id
            rowId++;
            if (rowId > lastRowID) {
                rowId = 0;
            }
        }
        const textbox = document.getElementById(`input-${rowId}-${columnId}`);
        textbox.focus();
    }
    horizontalNavigation(rowId, columnId, isRight) {
        //* 'columnId' is not actually the column index (because of the column of line numbers - 0,1,2,3,4...).
        //* 'isRight' as in the direction.
        const lastColumnID = 2; //< operand column
        if (isRight) {
            //* increment column id if moving right
            columnId++;
            if (columnId > lastColumnID) {
                columnId = 0;
            }
        }
        else { //< moving left
            //* decrement column id
            columnId--;
            if (columnId < 0) {
                columnId = lastColumnID;
            }
        }
        const textbox = document.getElementById(`input-${rowId}-${columnId}`);
        textbox.focus();
    }
    loadScript(script) {
        //* Used only in campain mode.
        //* Can be used to either load partial script or example solution script.
        let rows = this.HTMLTable.rows.length - 1;
        //^ Minus 1 to account for token headers.
        //: Creates rows.
        for (rows; rows < script.length + 1; rows++) {
            //* makes space to load the example solution script
            /// this.generateLine(new HTMLInputElement(), true);
            //^ uncaught error - HTMLInputElement cannot be instantiated directly
            this.generateLine(document.createElement("input"), true);
            //^ First argument is required but is not important.
            //^ True argument allows new line to be generate without forcing client to focus of the last line/row.
        }
        //: populate the rows
        for (let line = 0; line < this.HTMLTable.rows.length - 1; line++) {
            //^ length in incremented, by 1, to purposely have empty line underneath - to not confuse user if want to add to loaded script.
            for (let token = 0; token < 3; token++) {
                //* Repeat via label, opcode and operand.
                //* Row headers will need to be taken into account.
                const tokenSlotId = `input-${line}-${token}`;
                if (line > script.length - 1) {
                    document.getElementById(tokenSlotId).value = "";
                    continue;
                }
                //^ erase the text content in any lines undeneath the loaded script
                document.getElementById(tokenSlotId).value = script[line][token];
                //^ TS-2532 solved with type assertions as 'script[line]' and 'script[line][token]' has string values.
            }
        }
    }
}
class IOUI {
    //^ when pre-defined inputs are exhausted, next input is taken from here and will reset value once taken.
    constructor(input, predefinedInput, outputHistory, submitInput) {
        this.input = document.getElementById(input);
        this.predefinedInput = document.getElementById(predefinedInput);
        this.outputHistory = document.getElementById(outputHistory);
        this.submitInput = document.getElementById(submitInput);
        this.firstOutput = true;
        this.cachedInput = 1000;
        //^ 1000 means empty as its outside valid range from LMC input number (-999 to 999)
    }
    ///public getInput = async (): Promise<number> => {
    /* Failed code (attempt for user's real-time input) from sprint 2
    public getInput = async (): Promise<number> => {
        this.input.readOnly = false;
        return new Promise<number>((resolve, reject) => {
            const attachEventListener = () => {
                console.log("Attempting to attach event listener...");
                if (this.submitInput) {
                    // Ensure the event listener is only attached once
                    const handleClick = () => {
                        console.log("Button clicked!");
                        let userInput = this.input.value.trim().replace(/\s+/g, '');
                        if ((/^-?(?:[1-9]?\d{1,2}|0)$/).test(userInput)) {
                            console.log("Valid input received:", userInput);
                            this.input.readOnly = true;
                            this.submitInput.removeEventListener("click", handleClick);
                            resolve(parseInt(userInput, 10));
                        } else {
                            console.log("Invalid input. Prompting user to correct.");
                            this.input.value = "Invalid - enter integer between -999 and 999!";
                        }
                    };

                    this.submitInput.addEventListener("click", handleClick);
                    console.log("Event listener successfully attached!");
                } else {
                    console.error("Submit button not found in the DOM.");
                    reject("Submit button is unavailable.");
                }
            };
        });
    }
    */
    async cacheInput() {
        //* parse, verify, then store input (if valid) to 'this.cachedInput' field.
        let input = this.input.value;
        //^ fetches what ever value is in the input textbox
        input = input.trim();
        //^ make it easier for users by ignoring (assumed-to-be accidental) side whitesapces
        if (input.length == 0) {
            return;
        }
        //^ no point assaigning nothing
        if (!(/^-?\d{1,3}$/).test(input)) {
            //^ Regex copied from compiler.ts - is it number between -999 and 999?
            this.input.value = "Invalid: -999 to 999 only";
            //^ If input is invalid, then tell user.
        }
        else {
            this.input.value = "Input cached.";
            this.cachedInput = Number(input);
            //^ assaigns valid input to cache input field wating to be taken by the backend when needed
        }
        /// this.input.focus();
        /// this.input.readOnly = true;
        //: clear input box after a while to not inconvenience user.
        await new Promise((r) => setTimeout(r, 2000));
        //^ Copied (and partially manipulated) from vonNeumann.ts.
        //^ Not a constant of method this time because it is only needed once here.
        this.input.value = "";
        //^ clears textbox's content.
    }
    getInput() {
        const inputted = this.cachedInput;
        this.cachedInput = 1000;
        //^ reset value
        return inputted;
    }
    output(appendingValue) {
        if (!this.firstOutput) {
            this.outputHistory.value += (", " + appendingValue);
            return;
        }
        this.outputHistory.value = (appendingValue);
        this.firstOutput = false;
    }
    reset() {
        this.predefinedInput.value = "";
        this.predefinedInput.readOnly = false;
        ///this.input.readOnly = true;
    }
    start() {
        //* Fetching and validating pre-defined inputs, not complex enough to be in a different class/file (and resetting output).
        //: for resetting the output
        this.firstOutput = true;
        this.outputHistory.value = "";
        //: for the pre-defined inputs
        this.predefinedInput.readOnly = true;
        let compiledInputs = [];
        const inputs = this.predefinedInput.value.replace(/\s+/g, '');
        //^ Collect all pre-defined inputs and remove any whitespaces.
        if (inputs == "") {
            return [];
        }
        //^ Means no pre-defined inputs but still valid.
        const splitInputs = inputs.split(",");
        for (const input of splitInputs) {
            if (!(/^-?(?:[1-9]?\d{0,2}|0)$/).test(input)) {
                return [-1000];
            }
            //^ Return '-1000' to indicate invalid instead of -1 because valid range is -999 to 999.
            //^ Keep in mind, an empty list is still valid as user does not have to predefine the inputs before execution.
            //x Can allow user to know what pre-defined input is invalid but is a lower priority, so will do after 3rd sprint if have time.
            compiledInputs.push(parseInt(input, 10));
        }
        return compiledInputs;
        //^ parsed pre-defined inputs as integer array.
    }
}
class ALUUI {
    constructor(flow, operation, result) {
        this.flow = document.getElementById(flow);
        this.operation = document.getElementById(operation);
        this.result = document.getElementById(result);
    }
    update(flow, operation, result) {
        switch (flow) {
            case NumberStatus.normal:
                this.flow.value = "_";
                break;
            //: better to use plus and minus signs instead of greater/less signs ('>' and '<') to not confuse the HTML.
            case NumberStatus.underflow:
                this.flow.value = "V";
                break;
            default: //< NumberStatus.overflow:
                this.flow.value = "^";
                break;
        }
        this.operation.value = operation;
        //^ formatting the string requires processing outside class
        this.result.value = result;
    }
    reset() { this.update(NumberStatus.normal, "", ""); }
}
class RegistersUI {
    constructor(programCounter, memoryInstructionRegister, memoryAddressRegister, accumulator) {
        this.programCounter = document.getElementById(programCounter);
        this.memoryInstructionRegister = document.getElementById(memoryInstructionRegister);
        this.memoryAddressRegister = document.getElementById(memoryAddressRegister);
        this.accumulator = document.getElementById(accumulator);
    }
    updateRegister(register, newValue) {
        //* 'newValue' was and works as a number but needs it as string because no math operations will apply to it
        //* and HTML input textboxes accept strings only for overwriting the '.value' property.
        //* Second parameter is called 'newValue' because not to be confused with the HTML element's '.value' property
        //* that gets called ofter in this class.
        switch (register) {
            case Register.programCounter:
                this.programCounter.value = newValue;
                break;
            case Register.instruction:
                this.memoryInstructionRegister.value = newValue;
                break;
            case Register.address:
                this.memoryAddressRegister.value = newValue;
                break;
            default: //< case Register.accumulator
                this.accumulator.value = newValue;
                break;
        }
    }
    resetRegisters() {
        this.programCounter.value = "0";
        this.memoryInstructionRegister.value = "0";
        this.memoryAddressRegister.value = "0";
        this.accumulator.value = "0";
    }
}
class MiscellaneousUI {
    constructor(status, displayBox, example, runButton, stopButton, objective, objectiveBox) {
        this.status = document.getElementById(status);
        this.objectiveBox = document.getElementById(objectiveBox);
        this.HTMLEle = document.documentElement;
        this.displayBox = document.getElementById(displayBox);
        this.displayImage = "hlt.png";
        //^ Name for default image and image for program stopping or not currently running.
        //^ File path is handled by 'changeDisplayImage' method.
        this.displayExample = example;
        this.stopButton = document.getElementById(stopButton);
        this.runButton = document.getElementById(runButton);
        this.displayBox.innerHTML = this.displayExample;
        this.objectiveBox.textContent = objective;
    }
    displayManual() { window.open('manual.html' + window.location.search, '_blank', 'width=800,height=600'); }
    changeStatus(status) { this.status.textContent = status; }
    toggleDarkMode() {
        //* note: dark/light mode is different to style themes
        const currentMode = this.HTMLEle.getAttribute('data-theme');
        //^ Cannot get property directly due to name composition (use of dashes in name).
        let newMode = currentMode.split("-")[0];
        if (newMode == undefined) {
            newMode = "default";
        }
        //^ TS-2322 and to deal with any unexpected error
        if (currentMode.includes("light")) {
            this.HTMLEle.setAttribute('data-theme', newMode + '-dark');
        }
        //^ ".include()" https://www.w3schools.com/jsref/jsref_includes.asp
        else {
            this.HTMLEle.setAttribute('data-theme', newMode + '-light');
        }
    }
    toggleDisplayMode(start) {
        //* Switch between objective and image.
        //* Unless is start of execution then make it Little Man action.
        if (this.displayBox.innerHTML.slice(0, 9) == "<img src=" && !start) {
            //^ simplistic way to tell if display
            this.displayBox.innerHTML = this.displayExample;
            //^ switch to displaying objective in box
            return;
        }
        this.displayBox.innerHTML = `<img src=../assets/littleManActions/${this.displayImage}>`;
        //^ Change to specific image depending on simulator's state.
        //^ Using PNGs (and maybe GIFs) instead of JPEG because of wanting more lossless formats.
    }
    changeDisplayImage(newImageName) {
        //^ Image could be image or GIF
        this.displayImage = newImageName;
        if (this.displayBox.innerHTML.slice(0, 9) == "<img src=") {
            this.displayBox.innerHTML = `<img src=../assets/littleManActions/${this.displayImage}>`;
        }
    }
    DuringRun() {
        this.stopButton.disabled = false;
        this.runButton.disabled = true;
    }
    afterRun() {
        this.stopButton.disabled = true;
        this.runButton.disabled = false;
    }
    toMenu() { window.location.href = "menu.html" + window.location.search; }
    switchCycleModes(cycleModeAutomatic) {
        if (!cycleModeAutomatic) {
            document.getElementById('executionControl').innerHTML = '<button type="button" class="btn mb-3" id="nextCycle" onclick="newCycle()">Next cycle</button>';
            //^ toggle from speed control to wait for user's click for executing next cycle
            return;
        }
        document.getElementById('executionControl').innerHTML = '<button type="button" class="btn mb-3" id="faster" onclick="changeSpeed(false)">&lt;&lt;</button>\n<button type="button" class="btn mb-3" id="slower" onclick="changeSpeed(true)">&gt;&gt;</button>';
        //^ not necessary to use '\n' but makes the HTML code neater
    }
    reload() { window.location.reload(); }
}
//#endregion
//#region main class
export class SimulatorUI {
    constructor(example = "This is sandbox mode.", objective = "") {
        //^ Default arguments from source - https://www.w3schools.com/typescript/typescript_functions.php .
        //: ids as arguments for simplicity and ease when maintaining/updating/developing
        this.memoryUI = new MemoryUI('memoryTable');
        this.editorUI = new EditorUI('editorTable');
        this.registerUI = new RegistersUI('registerProgramCounter', 'registerInstruction', 'registerAddress', 'registerAccumulator');
        this.iOUI = new IOUI('input', 'predefinedInputs', 'output', 'submitInput');
        this.miscellaneousUI = new MiscellaneousUI('status', 'displayBox', example, 'run', 'stop', objective, 'objectiveBox');
        this.aLUUI = new ALUUI('flow', 'operation', 'result');
        document.addEventListener("DOMContentLoaded", () => {
            //* Handle functionality that only requires frontend (no relation to backend).
            //* For HTML elemets that are not generated after original DOM load.
            document.getElementById('toggleMode').addEventListener("click", () => this.miscellaneousUI.toggleDarkMode());
            document.getElementById('manual').addEventListener("click", () => this.miscellaneousUI.displayManual());
            document.getElementById('menu').addEventListener("click", () => this.miscellaneousUI.toMenu());
            document.getElementById('toggleDisplay').addEventListener("click", () => this.miscellaneousUI.toggleDisplayMode(false));
            document.getElementById('reset').addEventListener("click", () => this.miscellaneousUI.reload());
            document.getElementById('submitInput').addEventListener("click", async () => await this.iOUI.cacheInput());
            document.getElementById('input').addEventListener("focus", async () => {
                //* Alternative to clicking on 'submitInput' HTML button element.
                //* Only works if user focuse (is currently typing/using textbox and press enter at the same time).
                document.getElementById('input').addEventListener("keydown", async (event) => {
                    if (event.key == "Enter") {
                        await this.iOUI.cacheInput();
                    }
                });
            });
        });
        //: Handles frontend-only functionality but for HTML elements that are dynamicly generated after after DOM load
        window.addRowIfNeeded = this.addRowIfNeeded.bind(this);
        window.navigateEditor = this.navigateEditor.bind(this);
        ///console.log('simulatorUI has loaded');
    }
    //: Not related to backend but for dynamically generated HTML elements laoded after the original DOM
    addRowIfNeeded(textbox) { this.editorUI.generateLine(textbox); }
    navigateEditor(event) { this.editorUI.navigationCheck(event); }
    //: Called by middleware for the backend
    getScript() { return this.editorUI.getScript(); }
    getPredefinedInputs() {
        return this.iOUI.start();
        //^ get pre-defined inputs
    }
    async getInput() {
        this.miscellaneousUI.changeStatus("Waiting for user to enter input.");
        while (true) {
            await new Promise((r) => setTimeout(r, 10));
            //^ iterative sleep to prevent busy-waiting (10ms because responce times is not too important here)
            const input = this.iOUI.getInput();
            if (input != 1000) {
                //* do not return input until user enters a valid one
                this.miscellaneousUI.changeStatus("Valid input received");
                return input;
            }
        }
    }
    //: For the frontend (not relating to backend)
    compile(memory) { this.memoryUI.compileToMemory(memory); } //< call by middleware
    resetRegesters() { this.registerUI.resetRegisters; } //< call by middleware
    update(catagory, value) {
        //* 'value' - taking advantage of the list's dynamic size to allow one or multiple values - much less complicated than optional parameters
        switch (catagory) {
            case UICatagory.registerAccumulator:
                this.registerUI.updateRegister(Register.accumulator, value[0]);
                break;
            //^ 'as string' satisfy TS-2345 because it will certainly not be undefined when called.
            case UICatagory.registerInstruction:
                this.registerUI.updateRegister(Register.instruction, value[0]);
                break;
            case UICatagory.registerProgramCounter:
                this.registerUI.updateRegister(Register.programCounter, value[0]);
                break;
            case UICatagory.registerAddress:
                this.registerUI.updateRegister(Register.address, value[0]);
                break;
            case UICatagory.aLU:
                this.aLUUI.update(parseInt(value[0], 10), value[1], value[2]);
                break;
            //^ Integers are interchangable with enumerations.
            //^ Update(NumberStatus, operation, result).
            case UICatagory.displayImage:
                this.miscellaneousUI.changeDisplayImage(value[0]);
                break;
            //^ string is name of image file but not path (path is handled by called method)
            case UICatagory.cell:
                this.memoryUI.writeToCell(parseInt(value[0], 10), parseInt(value[1], 10));
                break;
            case UICatagory.output:
                this.iOUI.output(value[0]);
                break;
            case UICatagory.end:
                this.end();
                break;
            case UICatagory.switchCycleModes:
                this.miscellaneousUI.switchCycleModes(JSON.parse(value[0]));
                break;
            //^ TS can parse string to boolean such as: "true" to true and "false" to false.
            //^ Requires parameter to make sure backend and frontend are in sync.
            //^ 'JSON.parse' does this parsing - https://www.w3schools.com/js/js_json_parse.asp .
            default: this.miscellaneousUI.changeStatus(value[0]); //< case UICatagory.status
            //^ Made to default for good peactice and code integrety.
            //^ Did not make default case for anything else because it is certain that it will not an unexpected value.
        }
    }
    end() {
        this.miscellaneousUI.afterRun();
    }
    start() {
        this.aLUUI.reset();
        this.iOUI.reset();
        this.registerUI.resetRegisters();
        this.miscellaneousUI.DuringRun();
        this.miscellaneousUI.toggleDisplayMode(true);
    }
    //: exclusive to campain mode
    loadSript(script) { this.editorUI.loadScript(script); } //< caller method
}
//#endregion

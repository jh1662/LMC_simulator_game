//#region frontend connected classes
enum Direction{up, down, left, right};
class MemoryUI{
    //* Class to generate the memory table once per simulator page load
    //* and to write to its cells (the textboxes).
    private HTMLTable: HTMLTableElement;
    constructor(tableId:string){
        this.HTMLTable = document.getElementById(tableId) as HTMLTableElement;
        //^ "as HTMLTableElement" assures code that argument isn't null
        //^ hence satisfying TS-2322
        this.generateTable();
    }
    public generateTable():void {
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
class EditorUI{
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
    private navigation(event: KeyboardEvent, direction:Direction){
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
    private verticalNavigation(rowId:number, columnId:number, isUpwards:boolean){
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
    private horizontalNavigation(rowId:number, columnId:number, isRight:boolean){
        //* 'columnId' is not actually the column index (because of the column of line numbers - 0,1,2,3,4...).
        //* 'isRight' as in the direction.
        const lastColumnID:number = 2; //< operand column
        if (isRight){
            columnId++;
            if (columnId > lastColumnID){ columnId = 0; }
        }
        else{ //< moving downwards
            columnId--;
            if (columnId < 0){ columnId = lastColumnID; }
        }
        const textbox:HTMLInputElement = document.getElementById(`input-${rowId}-${columnId}`) as HTMLInputElement;
        textbox.focus();
    }
}
//#endregion
//#region backend classes
//#endregion
//#region main class
/*
class simulatorApp{
    //: all file's class instances - for front-end
    private memoryUI: MemoryUI;
    private editorUI: EditorUI;
    //: all file's class instances - for back-end
    //private compilerUI: CompilerUI;
    constructor(){
        //this.compilerUI = new CompilerUI();
        this.memoryUI = new MemoryUI('memoryTable');
        this.editorUI = new EditorUI('editorTable');
    }
}
*/
console.log('simulatorUI has loaded');

const memoryUI:MemoryUI = new MemoryUI('memoryTable');
const editorUI:EditorUI = new EditorUI('editorTable');

function addRowIfNeeded(textbox:HTMLInputElement):void{ editorUI.generateLine(textbox); }
function navigateEditor(event:KeyboardEvent):void{ editorUI.navigationCheck(event); }
//#endregion

const fs = require('fs');
//^ imported to read the HTML file
const path = require('path');
//^ imported to resolve the location of the HTML file

//: linking HTML file only once because nothing will change it from original DOM and saves computational time
const html = fs.readFileSync(path.resolve('../frames/', 'index.html'), 'utf8');
document.body.innerHTML = html;
/*
editorTable
line-0
0-0
input-0-0
0-1
input-0-1
0-2
input-0-2
line-1
1-0
input-1-0
1-1
input-1-1
1-2
input-1-2
Menu
timeOrStep
Reset
compile
run
manual
submitInput
toggleMode
toggleDisplay
registerProgramCounter
registerInstruction
registerAddress
registerAccumulator
flow
operation
result
input
output
predefinedInputs
displayBox
status
memoryTable
*/
describe("Testing register textbox elements", () => {
    test("Program counter register", () => {
        const htmlElement:any = document.getElementById('registerProgramCounter');
        //^ attempt to get the HTML element to test (hence why type is 'any' as it could be null)
        //: each of these 'expect' statements are purposely done in this order as the ealier one makes sure the later one can be tested
        expect(htmlElement).not.toEqual(null);
        //^ see if HTML element object was sucessfully fetched or not.
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        //^ test if the specific/specialised class of the HTML element is 'HTMLInputElement' (for textboxes)
        expect(htmlElement.readonly).toEqual(true);
        //^ test a property of the object -  in this case, testing if the text boc is read-only or not
    });
    test("Instruction/opcode register", () => {
        const htmlElement:any = document.getElementById('registerInstruction');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readonly).toEqual(true);
    });
    test("Address/operand register", () => {
        const htmlElement:any = document.getElementById('registerAddress');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readonly).toEqual(true);
    });
    test("Accumulator register", () => {
        const htmlElement:any = document.getElementById('registerAccumulator');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readonly).toEqual(true);
    });
});
describe("Testing input/output (IO) elements", () => {

});